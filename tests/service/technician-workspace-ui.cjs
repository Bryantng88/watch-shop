// Actual technician client with synthetic data and stubbed server actions/navigation.
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const http = require("node:http");
const path = require("node:path");
const esbuild = require("esbuild");
const { chromium } = require(
  process.env.PLAYWRIGHT_MODULE_PATH || "playwright",
);
(async () => {
  const sampleImage =
    "data:image/jpeg;base64," +
    (await fs.readFile("public/temp_watch.jpg")).toString("base64");
  const entry = `import React from 'react';import{createRoot}from'react-dom/client';import TechnicianWorkspace from './src/domains/service/client/technician/TechnicianWorkspace';import{getTechnicalIssueOperationStage}from './src/domains/service/server/shared/technical-issue-stage.policy';
const time=Date.now();const sampleImage=${JSON.stringify(sampleImage)};const specs=[['Seiko Diver 7002','Bảo dưỡng máy, kiểm tra sai số','IN_PROGRESS',true],['Tissot Seastar','Thay kính và kiểm tra chống nước','CONFIRMED',true],['Citizen Exceed','Kiểm tra bộ máy và núm chỉnh giờ','OPEN',false],['Omega Seamaster','Thay gioăng, kiểm tra chống nước','DONE',true],['Seiko LM','Đánh bóng vỏ','CANCELED',false]];
const items=specs.map(([watch,summary,status,confirmed],i)=>({id:'issue-'+i,summary,note:'Khách cần kiểm tra trước khi nhận lại đồng hồ.',updatedAt:new Date(time-600000).toISOString(),executionStatus:status,isConfirmed:confirmed,area:'MOVEMENT',actionMode:'INTERNAL',vendorId:null,vendorName:null,technicianName:'Đạt',technicalDetailCatalogId:i===0?'detail-1':null,expectedWorkingDays:i===0?3:null,expectedCompletionAt:i===0?new Date(time-86400000).toISOString():null,actualCost:i===3?150000:null,estimatedCost:750000,resolutionNote:i===3?'Đã kiểm tra, hoạt động ổn định.':'',priority:null,serviceRequest:{id:'sr-'+i,refNo:'SR-141126-00000'+i,productTitle:watch,sku:'VNT-00'+i,imageUrl:i<3?sampleImage:null}}));
window.__items=items;window.__actions=[];let current={view:'ACTIVE',q:''};const root=createRoot(document.getElementById('root'));
window.__render=()=>{const active=window.__items.filter(i=>!['DONE','CANCELED'].includes(i.executionStatus));const shown=window.__items.filter(i=>(current.view==='ALL'||current.view==='ACTIVE'?current.view==='ALL'||active.includes(i):current.view==='CANCELED'?i.executionStatus==='CANCELED':i.executionStatus!=='CANCELED'&&getTechnicalIssueOperationStage(i)===current.view)&&(!current.q||JSON.stringify(i).toLowerCase().includes(current.q.toLowerCase())));root.render(<TechnicianWorkspace data={{items:shown,total:shown.length,page:1,pageSize:25,view:current.view,q:current.q,counts:{active:active.length,processing:active.filter(i=>i.executionStatus==='IN_PROGRESS').length,ready:1,inspect:1},canUpdate:!new URLSearchParams(location.search).has('readonly'),details:[{id:'detail-1',area:'MOVEMENT',code:'MOVEMENT_SERVICE',name:'Bảo dưỡng máy'},{id:'replace',area:'MOVEMENT',code:'MOVEMENT_REPLACE_PARTS',name:'Thay linh kiện máy'}],vendors:[{id:'vendor-1',name:'Xưởng kỹ thuật'}]}}/>)};
window.__navigate=href=>{window.__route=href;const p=new URL(href,'https://preview.invalid').searchParams;current={view:p.get('view')||'ACTIVE',q:p.get('q')||''};window.__render()};window.__render();`;
  const built = await esbuild.build({
    stdin: { contents: entry, loader: "tsx", resolveDir: process.cwd() },
    bundle: true,
    platform: "browser",
    jsx: "automatic",
    write: false,
    define: { "process.env.NODE_ENV": '"production"' },
    plugins: [
      {
        name: "fixture",
        setup(build) {
          build.onResolve(
            { filter: /^next\/(navigation|link|image)$/ },
            (args) => ({ path: args.path, namespace: "fixture" }),
          );
          build.onLoad({ filter: /.*/, namespace: "fixture" }, (args) => ({
            contents: args.path.endsWith("navigation")
              ? "const router={push:href=>window.__navigate(href),refresh:()=>window.__render()};export const useRouter=()=>router;export const useSearchParams=()=>new URLSearchParams(window.location.search);"
              : args.path.endsWith("link")
                ? 'import React from "react";export default function Link({href,children,...props}){return <a href={href} {...props} onClick={e=>{e.preventDefault();window.__route=href}}>{children}</a>}'
                : 'import React from "react";export default function Image({unoptimized,...props}){return <img {...props}/>}',
            loader: "tsx",
            resolveDir: process.cwd(),
          }));
          build.onLoad(
            { filter: /technician-workspace\.actions\.ts$/ },
            () => ({
              contents: `export async function updateTechnicianIssue(command){window.__actions.push(command);if(window.__delay)await new Promise(r=>setTimeout(r,window.__delay));if(window.__failNext){window.__failNext=false;return {ok:false,error:'Chi phí đang chờ duyệt.'}}window.__items=window.__items.map(i=>i.id===command.id?{...i,...(command.action==='confirm'?{executionStatus:'CONFIRMED',isConfirmed:true}:command.action==='start'?{executionStatus:'IN_PROGRESS',technicalDetailCatalogId:command.technicalDetailCatalogId,expectedWorkingDays:command.expectedWorkingDays}:command.action==='complete'?{executionStatus:'DONE',actualCost:command.actualCost,resolutionNote:command.resolutionNote}:{note:command.note}),...(command.note!==undefined?{note:command.note}:{}),updatedAt:new Date().toISOString()}:i);return {ok:true}}`,
              loader: "js",
            }),
          );
        },
      },
    ],
  });
  const js = built.outputFiles[0].text;
  if (process.env.TECHNICIAN_EXPORT) {
    await fs.writeFile(process.env.TECHNICIAN_EXPORT, js);
    return;
  }
  const css = await fs.readFile(
    process.env.TECHNICIAN_CSS || "/tmp/technician.css",
    "utf8",
  );
  const server = http.createServer((req, res) => {
    if (req.url === "/app.js") {
      res.setHeader("content-type", "text/javascript");
      res.end(js);
    } else {
      res.setHeader("content-type", "text/html; charset=utf-8");
      res.end(
        '<meta name="viewport" content="width=device-width,initial-scale=1"><style>' +
          css +
          'body{margin:0;font-family:Arial,sans-serif}</style><div id="root"></div><script src="/app.js"></script>',
      );
    }
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const origin = "http://127.0.0.1:" + server.address().port;
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.CHROMIUM_EXECUTABLE
      ? { executablePath: process.env.CHROMIUM_EXECUTABLE }
      : {}),
    args: ["--no-sandbox"],
  });
  try {
    const page = await browser.newPage({
      viewport: { width: 390, height: 844 },
    });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(origin);
    await page.locator("[data-technician-row]").first().waitFor();
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 844 });
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      assert.equal(await page.locator("[data-technician-row]").count(), 3);
      if (process.env.TECHNICIAN_SHOTS) {
        await fs.mkdir(process.env.TECHNICIAN_SHOTS, { recursive: true });
        await page.screenshot({
          path: path.join(
            process.env.TECHNICIAN_SHOTS,
            "technician-" + width + ".png",
          ),
          fullPage: true,
        });
      }
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page
      .getByRole("combobox", { name: "Trạng thái phiếu" })
      .selectOption("DONE");
    await page.waitForFunction(
      () => document.querySelectorAll("[data-technician-row]").length === 1,
    );
    assert.equal(await page.locator("[data-technician-row]").count(), 1);
    await page.locator('[data-technician-row="issue-3"]').click();
    await page.getByRole("dialog").waitFor();
    assert.equal(
      await page
        .getByRole("button", { name: "Hoàn tất xử lý", exact: true })
        .count(),
      0,
    );
    await page
      .getByRole("button", { name: "Danh sách phiếu", exact: true })
      .click();
    await page
      .getByRole("combobox", { name: "Trạng thái phiếu" })
      .selectOption("ALL");
    await page.waitForFunction(
      () => document.querySelectorAll("[data-technician-row]").length === 5,
    );
    assert.equal(await page.locator("[data-technician-row]").count(), 5);
    await page
      .getByRole("textbox", { name: "Tìm phiếu kỹ thuật" })
      .fill("Citizen");
    await page.getByRole("button", { name: "Tìm kiếm", exact: true }).click();
    await page.waitForFunction(
      () => document.querySelectorAll("[data-technician-row]").length === 1,
    );
    assert.equal(await page.locator("[data-technician-row]").count(), 1);
    await page.locator('[data-technician-row="issue-2"]').click();
    await page
      .getByRole("button", { name: "Xác nhận phiếu", exact: true })
      .click();
    await page.getByRole("dialog").waitFor({ state: "hidden" });
    assert.equal(
      (await page.evaluate(() => window.__actions.at(-1))).action,
      "confirm",
    );
    await page.getByRole("textbox", { name: "Tìm phiếu kỹ thuật" }).fill("");
    await page.getByRole("button", { name: "Tìm kiếm", exact: true }).click();
    await page
      .getByRole("combobox", { name: "Trạng thái phiếu" })
      .selectOption("ACTIVE");
    await page.locator('[data-technician-row="issue-1"]').click();
    await page
      .getByRole("button", { name: "Bắt đầu xử lý", exact: true })
      .click();
    assert.equal(await page.getByRole("dialog").count(), 1);
    assert.equal((await page.evaluate(() => window.__actions)).length, 1);
    await page
      .getByRole("combobox", { name: "Chi tiết xử lý", exact: true })
      .selectOption("detail-1");
    await page
      .getByRole("spinbutton", { name: "Số ngày dự kiến", exact: true })
      .fill("3");
    await page
      .getByRole("button", { name: "Bắt đầu xử lý", exact: true })
      .click();
    await page.getByRole("dialog").waitFor({ state: "hidden" });
    assert.equal(
      (await page.evaluate(() => window.__actions.at(-1))).expectedWorkingDays,
      3,
    );
    await page.locator('[data-technician-row="issue-0"]').click();
    await page
      .getByRole("textbox", { name: "Ghi chú kỹ thuật", exact: true })
      .fill("Đã kiểm tra sai số.");
    await page
      .getByRole("button", { name: "Lưu ghi chú", exact: true })
      .click();
    await page.getByRole("dialog").waitFor({ state: "hidden" });
    assert.equal(
      (await page.evaluate(() => window.__actions.at(-1))).note,
      "Đã kiểm tra sai số.",
    );
    await page.locator('[data-technician-row="issue-0"]').click();
    await page
      .getByRole("textbox", { name: "Ghi chú kỹ thuật", exact: true })
      .fill("Ghi chú nhập cùng lúc hoàn tất.");
    await page
      .getByRole("textbox", { name: "Chi phí thực tế · nghìn ₫", exact: true })
      .fill("750");
    await page
      .getByRole("textbox", { name: "Kết quả xử lý", exact: true })
      .fill("Hoạt động ổn định.");
    await page.evaluate(() => {
      window.__failNext = true;
    });
    await page
      .getByRole("button", { name: "Hoàn tất xử lý", exact: true })
      .click();
    await page.getByRole("alert").waitFor();
    assert.equal(
      await page
        .getByRole("textbox", {
          name: "Chi phí thực tế · nghìn ₫",
          exact: true,
        })
        .inputValue(),
      "750",
    );
    await page.evaluate(() => {
      window.__delay = 150;
    });
    const before = await page.evaluate(() => window.__actions.length);
    await page
      .getByRole("button", { name: "Hoàn tất xử lý", exact: true })
      .dblclick({ force: true });
    await page.getByRole("dialog").waitFor({ state: "hidden" });
    assert.equal(
      await page.evaluate(() => window.__actions.length),
      before + 1,
    );
    assert.equal(
      (await page.evaluate(() => window.__actions.at(-1))).actualCost,
      750000,
    );
    assert.equal(
      (await page.evaluate(() => window.__actions.at(-1))).note,
      "Ghi chú nhập cùng lúc hoàn tất.",
    );
    await page.goto(origin + "/?readonly=1");
    await page.locator('[data-technician-row="issue-0"]').click();
    assert.ok(
      await page
        .getByRole("textbox", { name: "Ghi chú kỹ thuật", exact: true })
        .isDisabled(),
    );
    assert.equal(
      await page
        .getByRole("button", { name: "Hoàn tất xử lý", exact: true })
        .count(),
      0,
    );
    await page.keyboard.press("Escape");
    await page.getByRole("dialog").waitFor({ state: "hidden" });
    assert.deepEqual(await page.evaluate(() => window.__actions), []);
    assert.deepEqual(errors, []);
    console.log(
      "PASS: actual technician client at 320/390/768/1440, all issues/search/stages, required start data, note save, money conversion, blocked completion feedback, double-click guard, view-only controls and modal Escape.",
    );
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
