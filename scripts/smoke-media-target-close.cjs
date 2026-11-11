// Actual OpenTargetAction + same-origin iframe; unrelated business modules are
// fixture adapters. No business API is called by this browser test.
const fs = require("node:fs/promises");
const path = require("node:path");
const http = require("node:http");
const assert = require("node:assert/strict");
const ts = require("typescript");
const esbuild = require("esbuild");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || "playwright");
(async () => {
  const root = path.resolve(__dirname, "..");
  const file = path.join(
    root,
    "src/domains/task/ui/task-work/QueueWorkQueue.tsx",
  );
  const source = ts.createSourceFile(
    file,
    await fs.readFile(file, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const mocks = new Map();
  for (const node of source.statements) {
    if (!ts.isImportDeclaration(node) || node.importClause?.isTypeOnly)
      continue;
    const name = node.moduleSpecifier.text;
    if (
      name === "react" ||
      name === "lucide-react" ||
      name.includes("/transitions/")
    )
      continue;
    const names =
      node.importClause?.namedBindings &&
      ts.isNamedImports(node.importClause.namedBindings)
        ? node.importClause.namedBindings.elements
            .filter((e) => !e.isTypeOnly)
            .map((e) => e.propertyName?.text || e.name.text)
        : [];
    let body =
      names.map((n) => `export const ${n}=()=>null;`).join("\n") +
      (node.importClause?.name ? "\nexport default ()=>null;" : "");
    if (name === "next/navigation")
      body = "export function useRouter(){return window.fixtureRouter}";
    if (name === "next/link")
      body =
        'import React from "react";export default function Link({href,children,...p}){return React.createElement("a",{...p,href},children)}';
    if (name.includes("AppDialogProvider"))
      body =
        "export function useAppDialog(){return {confirm:async()=>{window.confirmations++;return window.allowClose}}}";
    mocks.set(name, body);
  }
  const tmp = await fs.mkdtemp("/tmp/media-close-");
  await esbuild.build({
    stdin: {
      resolveDir: root,
      loader: "tsx",
      contents: `import React from 'react';import{createRoot}from'react-dom/client';import{OpenTargetAction}from'${file}';window.reloads=0;window.transitions=0;window.confirmations=0;window.allowClose=true;window.fixtureRouter={refresh:()=>window.reloads++,push:()=>{}};createRoot(document.getElementById('app')).render(React.createElement(OpenTargetAction,{queueItem:{id:'binding',href:'/editor',targetId:'watch',targetType:'WATCH',status:'IN_PROGRESS',preview:{title:'Fixture watch'}},transition:{metadata:{intent:'OPEN_TARGET',presentation:'MODAL',targetMode:'media'}},className:'',onRefreshRequested:()=>window.reloads++,onTransitionApplied:()=>window.transitions++}));`,
    },
    outfile: path.join(tmp, "app.js"),
    bundle: true,
    jsx: "automatic",
    define: { "process.env.NODE_ENV": '"production"' },
    plugins: [
      {
        name: "business-fixtures",
        setup(build) {
          build.onResolve({ filter: /.*/ }, (args) =>
            args.importer === file && mocks.has(args.path)
              ? { path: args.path, namespace: "fixture" }
              : null,
          );
          build.onLoad({ filter: /.*/, namespace: "fixture" }, (args) => ({
            contents: mocks.get(args.path),
            resolveDir: root,
            loader: "jsx",
          }));
        },
      },
    ],
    logLevel: "silent",
  });
  const server = http.createServer(async (req, res) => {
    if (req.url === "/app.js") {
      res.setHeader("content-type", "text/javascript");
      res.end(await fs.readFile(path.join(tmp, "app.js")));
    } else if (req.url.startsWith("/editor"))
      res.end("<!doctype html><title>Fixture editor</title>");
    else
      res.end(
        '<!doctype html><meta charset="utf-8"><div id="app"></div><script src="/app.js"></script>',
      );
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const executablePath = process.env.CHROMIUM_EXECUTABLE_PATH;
  const browser = await chromium.launch({
    ...(executablePath ? { executablePath } : {}),
    headless: true,
    args: ["--no-sandbox"],
  });
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("http://127.0.0.1:" + server.address().port);
    const open = async () => {
      await page
        .getByRole("button", { name: "Xử lý media", exact: true })
        .click();
      await page.locator("iframe").waitFor();
    };
    const send = async (data) => {
      const frame = page.frames().find((f) => f.url().includes("/editor"));
      assert.ok(frame);
      await frame.evaluate((d) => parent.postMessage(d, location.origin), data);
      await page.waitForTimeout(50);
    };
    const close = async () => {
      await page
        .getByRole("button", { name: "Close modal", exact: true })
        .click();
      await page.locator("iframe").waitFor({ state: "detached" });
    };
    await open();
    await close();
    assert.equal(
      await page.evaluate(() => reloads),
      0,
      "Read-only open/close must not reload",
    );
    await open();
    await send({ type: "workspace-target-modal-refresh" });
    await send({ type: "workspace-target-modal-refresh" });
    assert.equal(
      await page.evaluate(() => reloads),
      0,
      "Persisted edits wait until close",
    );
    await close();
    assert.equal(
      await page.evaluate(() => reloads),
      1,
      "Several saves coalesce into one reload on close",
    );
    await open();
    await close();
    assert.equal(
      await page.evaluate(() => reloads),
      1,
      "Reopening resets saved state",
    );
    await open();
    await send({ type: "workspace-target-modal-dirty", dirty: true });
    await page.evaluate(() => (allowClose = false));
    await page
      .getByRole("button", { name: "Close modal", exact: true })
      .click();
    assert.equal(await page.locator("iframe").count(), 1);
    await page.evaluate(() => (allowClose = true));
    await close();
    assert.equal(
      await page.evaluate(() => reloads),
      1,
      "Discarding unsaved edits must not reload",
    );
    await open();
    await send({ type: "workspace-target-modal-refresh" });
    await send({
      type: "workspace-transition-applied",
      bindingId: "binding",
      actionKey: "complete",
    });
    await send({ type: "workspace-target-modal-close" });
    await page.locator("iframe").waitFor({ state: "detached" });
    assert.equal(await page.evaluate(() => transitions), 1);
    assert.equal(
      await page.evaluate(() => reloads),
      1,
      "A handled transition must not cause another reload",
    );
    await open();
    await page.evaluate(() =>
      window.dispatchEvent(
        new MessageEvent("message", {
          origin: location.origin,
          source: window,
          data: { type: "workspace-target-modal-refresh" },
        }),
      ),
    );
    await close();
    assert.equal(
      await page.evaluate(() => reloads),
      1,
      "Messages from a different window must be ignored",
    );
    await open();
    await send({ type: "workspace-target-modal-refresh" });
    await send({ type: "workspace-target-modal-close" });
    await page.locator("iframe").waitFor({ state: "detached" });
    assert.equal(await page.evaluate(() => reloads), 2);
    assert.deepEqual(errors, []);
    console.log(
      "PASS actual OpenTargetAction: unchanged close, saved changes once, reopen, unsaved discard/confirmation, handled transition, source isolation and child close. No business writes.",
    );
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
    await fs.rm(tmp, { recursive: true, force: true });
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
