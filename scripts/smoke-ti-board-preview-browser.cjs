/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS browser runner. */
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const ts = require("typescript");
const esbuild = require("esbuild");
const postcss = require("postcss");
const tailwind = require("tailwindcss");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || "playwright");

async function main() {
  const root = path.resolve(__dirname, "..");
  const source = await fs.readFile(path.join(root, "src/domains/coordination/ui/OperationCoordinationWorkspace.tsx"), "utf8");
  const parsed = ts.createSourceFile("workspace.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const card = parsed.statements.find(node => ts.isFunctionDeclaration(node) && node.name?.text === "TechnicalIssueBoardCard");
  assert.ok(card, "Render the preview control from the actual production card");
  const previews = [];
  function visit(node) {
    if (ts.isJsxSelfClosingElement(node) && node.tagName.getText(parsed) === "AdminButton"
      && node.attributes.properties.some(prop => prop.name?.getText(parsed) === "aria-label" && prop.getText(parsed).includes("Xem nhanh TI"))) {
      previews.push(node.getText(parsed));
    }
    ts.forEachChild(node, visit);
  }
  visit(card);
  assert.equal(previews.length, 1);
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "ti-preview-"));
  const entry = `import React from "react";
import {createRoot} from "react-dom/client";
import {AdminButton, AdminButtonProvider} from "./src/domains/shared/ui/admin-design-contract/AdminButton";
const item={summary:"Kiểm tra bộ máy"};
const onPreview=()=>{window.previews=(window.previews||0)+1};
createRoot(document.getElementById("root")).render(<AdminButtonProvider>
  <section data-card style={{position:"relative",width:280,minHeight:180,padding:16,background:"#eff6ff"}}>
    ${previews[0]}
    <h2>Kiểm tra bộ máy</h2><p>SR-123 · Seiko LM</p><p>Căn chỉnh sai số</p>
    <AdminButton aria-label="Đánh dấu gấp" style={{position:"relative",zIndex:20}}
      onClick={()=>{window.priorities=(window.priorities||0)+1}}>Gấp</AdminButton>
  </section>
</AdminButtonProvider>);`;
  const built = await esbuild.build({
    stdin: { contents: entry, loader: "tsx", resolveDir: root },
    bundle: true, outfile: path.join(tmp, "app.js"), write: false, jsx: "automatic",
    define: { "process.env.NODE_ENV": '"production"' },
  });
  const globalCss = await postcss([tailwind({ content: [{ raw: source, extension: "tsx" }] })])
    .process("@tailwind base;@tailwind utilities;", { from: undefined });
  const css = globalCss.css + built.outputFiles.filter(file => file.path.endsWith(".css")).map(file => file.text).join("\n");
  const js = built.outputFiles.find(file => file.path.endsWith(".js")).text;
  const server = http.createServer((req, res) => {
    res.setHeader("Content-Type", req.url === "/app.js" ? "text/javascript" : "text/html");
    res.end(req.url === "/app.js" ? js : `<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><style>${css}</style><div id="root"></div><script src="/app.js"></script>`);
  });
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const browser = await chromium.launch({ headless: true, ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}) });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 700 } });
    await page.goto("http://127.0.0.1:" + server.address().port);
    const preview = page.getByRole("button", { name: "Xem nhanh TI Kiểm tra bộ máy", exact: true });
    await preview.waitFor();
    async function assertTransparent() {
      assert.equal(await preview.evaluate(el => getComputedStyle(el).backgroundColor), "rgba(0, 0, 0, 0)");
      assert.equal(await preview.evaluate(el => getComputedStyle(el).backgroundImage), "none");
    }
    await assertTransparent();
    await preview.hover();
    await page.waitForTimeout(160);
    await assertTransparent();
    assert.ok(await page.getByText("SR-123 · Seiko LM", { exact: true }).isVisible());
    const cardBounds = await page.locator("[data-card]").boundingBox();
    const hitBounds = await preview.boundingBox();
    assert.equal(hitBounds.width, cardBounds.width);
    assert.equal(hitBounds.height, cardBounds.height);
    await page.mouse.click(cardBounds.x + cardBounds.width - 8, cardBounds.y + cardBounds.height - 8);
    assert.equal(await page.evaluate(() => window.previews), 1);
    await page.getByRole("button", { name: "Đánh dấu gấp", exact: true }).click();
    assert.equal(await page.evaluate(() => window.priorities), 1);
    assert.equal(await page.evaluate(() => window.previews), 1);
    await preview.focus();
    await page.keyboard.press("Enter");
    await page.keyboard.press("Space");
    assert.equal(await page.evaluate(() => window.previews), 3);
    console.log("PASS production TI preview overlay remains transparent, covers the card, supports keyboard, and leaves priority action independent");
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
