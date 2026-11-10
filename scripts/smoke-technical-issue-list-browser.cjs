const path = require("node:path"),
  fs = require("node:fs/promises"),
  http = require("node:http"),
  assert = require("node:assert/strict");
const esbuild = require("esbuild"),
  { chromium } = require("playwright");
(async () => {
  const root = path.resolve(__dirname, ".."),
    tmp = await fs.mkdtemp("/tmp/ti-list-browser-");
  const cssNames = await fs.readdir(path.join(root, ".next/static/css"));
  await fs.writeFile(
    path.join(tmp, "global.css"),
    (
      await Promise.all(
        cssNames
          .filter((name) => name.endsWith(".css"))
          .map((name) =>
            fs.readFile(path.join(root, ".next/static/css", name), "utf8"),
          ),
      )
    ).join("\n"),
  );
  await esbuild.build({
    entryPoints: [
      path.join(root, "tests/browser/technical-issue-list.fixture.tsx"),
    ],
    outfile: path.join(tmp, "app.js"),
    bundle: true,
    format: "esm",
    jsx: "automatic",
    target: "es2020",
    define: { "process.env.NODE_ENV": '"production"' },
    plugins: [
      {
        name: "fixture-next-image",
        setup(build) {
          build.onResolve({ filter: /^next\/image$/ }, () => ({
            path: "next-image",
            namespace: "fixture",
          }));
          build.onLoad({ filter: /.*/, namespace: "fixture" }, () => ({
            contents:
              'import {createElement} from "react";export default function Image({unoptimized,...props}){return createElement("img",props)}',
            loader: "jsx",
            resolveDir: root,
          }));
        },
      },
    ],
    logLevel: "silent",
  });
  await fs.writeFile(
    path.join(tmp, "index.html"),
    `<!doctype html><html lang="vi"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>TI List browser fixture</title><link rel="stylesheet" href="/global.css"><link rel="stylesheet" href="/app.css"><style>body{margin:0;background:#fff;font-family:Arial,sans-serif}.fixture-canvas{max-width:1600px;margin:auto}.fixture-label{font-size:11px;color:#94a3b8}.fixture-controls{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:24px 0 20px}.fixture-search{display:flex;align-items:center;gap:8px;border:1px solid #e2e8f0;border-radius:8px;padding:8px 12px;color:#94a3b8;flex:1;max-width:520px}.fixture-search input{width:100%;font-size:13px;outline:0;border:0}.fixture-board{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px}.fixture-board>section{padding:14px;background:#f8fafc;border-radius:8px}.fixture-board h2{font-weight:600;font-size:14px}.fixture-board button{display:block;text-align:left;background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:14px;margin-top:12px;font-size:13px;width:100%}.fixture-board small{display:block;color:#94a3b8;margin-top:6px}.fixture-overlay{position:fixed;inset:0;background:#0f172a55;display:grid;place-items:center;z-index:100}.fixture-overlay>section{background:white;padding:24px;border-radius:12px;max-width:90vw}.fixture-overlay h2{font-weight:600}.fixture-overlay p{margin:12px 0;color:#64748b;font-size:13px}.fixture-overlay button{padding:8px 12px;border:1px solid #e2e8f0;border-radius:6px;font-size:12px;margin-right:8px}@media(max-width:760px){.fixture-canvas{padding:20px 16px}.fixture-controls{align-items:stretch}.fixture-search{min-width:0;flex:1}.fixture-controls>div:last-child button{padding:0 9px;font-size:12px;gap:4px}}</style><div id="root"></div><script type="module" src="/app.js"></script></html>`,
  );
  const server = http.createServer(async (req, res) => {
    try {
      const name = new URL(req.url, "http://localhost").pathname;
      const file = path.join(tmp, name === "/" ? "index.html" : name.slice(1));
      if (!file.startsWith(tmp + path.sep)) throw Error("path");
      const data = await fs.readFile(file);
      res.writeHead(200, {
        "Content-Type": file.endsWith(".js")
          ? "text/javascript"
          : file.endsWith(".css")
            ? "text/css"
            : "text/html",
      });
      res.end(data);
    } catch {
      res.writeHead(404);
      res.end();
    }
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const origin = `http://127.0.0.1:${server.address().port}`,
    browser = await chromium.launch({
      executablePath: process.env.TI_CHROMIUM || "/usr/bin/chromium",
      headless: true,
      args: ["--no-sandbox", "--disable-dev-shm-usage"],
    });
  try {
    const page = await browser.newPage({
        viewport: { width: 1600, height: 1100 },
      }),
      errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(origin + "/?view=technical-issue-flow&tiLayout=list");
    await page
      .getByRole("table", { name: "Danh sách TI", exact: true })
      .waitFor();
    assert.equal(await page.locator("[data-technical-issue-id]").count(), 25);
    await page.screenshot({
      path:
        process.env.TI_DESKTOP_SCREENSHOT ||
        "/tmp/technical-issue-list-desktop.png",
      fullPage: true,
    });
    await page
      .getByRole("button", { name: "Trang TI sau", exact: true })
      .click();
    assert.equal((await page.evaluate(() => window.__tiQA.getState())).page, 2);
    await page.getByRole("button", { name: "Board", exact: true }).click();
    await page.getByLabel("Board minh họa").waitFor();
    await page.getByRole("button", { name: "List", exact: true }).click();
    assert.equal((await page.evaluate(() => window.__tiQA.getState())).page, 2);
    await page.getByLabel("Lọc chú ý TI").selectOption("OVERDUE");
    assert.equal((await page.evaluate(() => window.__tiQA.getState())).page, 1);
    assert.equal(
      (await page.getByText("Đã xong", { exact: false }).first().count()) > 0,
      true,
    );
    await page.getByLabel("Lọc chú ý TI").selectOption("ALL");
    await page.getByRole("button", { name: /^Chờ xử lý/ }).click();
    await page.getByLabel("Sắp xếp TI").selectOption("DUE");
    const first = page.locator("[data-technical-issue-id]").first();
    const firstId = await first.getAttribute("data-technical-issue-id");
    await first.getByRole("button", { name: /^Bắt đầu:/ }).click();
    await page.getByRole("dialog", { name: "Đề nghị chuyển TI" }).waitFor();
    assert.deepEqual(
      (await page.evaluate(() => window.__tiQA.getCalls())).at(-1),
      { type: "move", id: firstId, stage: "PROCESSING" },
    );
    await page.getByRole("button", { name: "Hủy", exact: true }).click();
    await first.getByRole("button", { name: /^Thao tác khác:/ }).click();
    await page
      .getByRole("button", { name: "Kiểm tra lại", exact: true })
      .waitFor();
    await page.keyboard.press("Escape");
    assert.equal(
      await first
        .getByRole("button", { name: /^Thao tác khác:/ })
        .getAttribute("aria-expanded"),
      "false",
    );
    await first.getByRole("button", { name: /^Xem nhanh TI/ }).click();
    await page.getByRole("dialog", { name: "Xem nhanh TI" }).waitFor();
    assert.equal(
      (await page.evaluate(() => window.__tiQA.getCalls())).at(-1).id,
      firstId,
    );
    await page.getByRole("button", { name: "Đóng xem nhanh" }).click();
    const priority = first.getByRole("button", { name: /gấp:/ });
    await priority.click();
    assert.equal(await priority.getAttribute("aria-busy"), "true");
    await page.waitForFunction(
      () => document.querySelectorAll('[aria-busy="true"]').length === 0,
    );
    await page.getByRole("button", { name: "Board", exact: true }).click();
    await page.getByRole("button", { name: "List", exact: true }).click();
    assert.equal(await page.getByLabel("Sắp xếp TI").inputValue(), "DUE");
    assert.equal(
      (await page.evaluate(() => window.__tiQA.getState())).scope,
      "READY",
    );
    await page.getByRole("button", { name: /^Đang mở/ }).click();
    await page.getByRole("button", { name: /^Tải thêm kiểm tra/ }).click();
    await page.waitForFunction(
      () => document.querySelectorAll('[aria-busy="true"]').length === 0,
    );
    assert.deepEqual(
      (await page.evaluate(() => window.__tiQA.getCalls()))
        .filter((c) => c.type === "load")
        .at(-1),
      { type: "load", stage: "INSPECT", page: 3 },
    );
    await page.getByLabel("Tìm TI").fill("seiko");
    await page.waitForFunction(() => window.__tiQA.getState().page === 1);
    assert.ok((await page.locator("[data-technical-issue-id]").count()) > 0);
    await page.getByLabel("Tìm TI").fill("không-tồn-tại");
    await page.getByText("Không có TI khớp bộ lọc", { exact: true }).waitFor();
    assert.ok(await page.getByRole("button", { name: /Tải thêm/ }).count());
    await page.getByLabel("Tìm TI").fill("");
    await page.getByRole("button", { name: /^Đã xong/ }).click();
    await page.getByLabel("Lịch sử TI đã xong").selectOption("30D");
    assert.deepEqual(
      (await page.evaluate(() => window.__tiQA.getCalls()))
        .filter((c) => c.type === "range")
        .at(-1),
      { type: "range", value: "30D" },
    );
    await page.getByRole("button", { name: /^Đang mở/ }).click();
    await page.evaluate(() => window.__tiQA.focus("processing-18"));
    await page.waitForFunction(
      () => window.__tiQA.getState().scope === "PROCESSING",
    );
    await page.getByRole("button", { name: /^Chờ xử lý/ }).click();
    await page.getByRole("button", { name: "Board", exact: true }).click();
    await page.getByRole("button", { name: "List", exact: true }).click();
    assert.equal(
      (await page.evaluate(() => window.__tiQA.getState())).scope,
      "READY",
    );
    await page.setViewportSize({ width: 390, height: 844 });
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
    );
    await page.screenshot({
      path:
        process.env.TI_MOBILE_SCREENSHOT ||
        "/tmp/technical-issue-list-mobile.png",
      fullPage: true,
    });
    assert.deepEqual(errors, []);
    console.log(
      "PASS actual TI list component: pagination and filter retention across Board/List, correct row preview/move callbacks, priority pending, menu Escape, loaded-data paging, search/empty state, Done range, focus without replay, responsive no overflow. Parent board, API/actions and images use fixtures.",
    );
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
    await fs.rm(tmp, { recursive: true, force: true });
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
