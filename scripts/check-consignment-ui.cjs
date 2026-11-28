/* eslint-disable @typescript-eslint/no-require-imports -- Browser acceptance with synthetic HTTP, navigation, payment and preview-body ports. */
const assert = require("node:assert/strict"),
  fs = require("node:fs/promises"),
  path = require("node:path"),
  http = require("node:http");
const esbuild = require("./lib/admin-fixture-esbuild.cjs");
const { chromium } = require(
  process.env.PLAYWRIGHT_MODULE_PATH || "playwright",
);
(async () => {
  const root = path.resolve(__dirname, "..");
  const entry = `import React from 'react';import{createRoot}from'react-dom/client';import ConsignmentClient from './src/domains/consignment/ui/ConsignmentClient';import{WatchQuickPreviewProvider}from'./src/domains/shared/ui/work-object/WatchQuickPreviewProvider';import{WorkObjectThumbnail}from'./src/domains/shared/ui/work-object/WorkObjectThumbnail';
 window.__writes=[];window.__confirm=false;window.__fail=false;window.__parent=0;window.__preview=0;window.__notices=[];
 const cap={create:true,approve:true,edit:true,cancel:true,paymentView:true,paymentCreate:true,paymentUpdate:true};
 window.__row={id:'doc-1',refNo:'KG-TEST',version:'2026-11-28T01:00:00.000Z',direction:'OUT',status:'ACTIVE',productId:'product-1',watchId:'watch-1',title:'Seiko có tên dài để kiểm tra màn hình nhỏ',vendorName:'Đối tác',terms:{mode:'PERCENT',value:10},soldAmount:null,net:null,remaining:null,history:[]};
 window.fetch=async(url,options={})=>{if(options.method==='POST'){window.__writes.push(JSON.parse(options.body));return new Response(JSON.stringify(window.__fail?{error:'Lỗi kết nối giả lập'}:{id:'doc-1'}),{status:window.__fail?503:200});}return new Response(JSON.stringify(String(url).includes('lookup=')?{vendors:[{id:'vendor-1',name:'Người gửi thử'}],watches:[{id:'watch-1',productId:'product-1',product:{title:'Seiko',sku:'SEI-1'}}]}:{orders:[{id:'order-1',label:'OD-TEST',amount:10000000}]}));};
 const reactRoot=createRoot(document.getElementById('root'));window.__render=()=>reactRoot.render(<WatchQuickPreviewProvider allowed={!location.search.includes('denied')}><main className="min-w-0 p-4"><div onClick={()=>window.__parent++} onKeyDown={()=>window.__parent++}><WorkObjectThumbnail object={{type:'WATCH',id:'watch-1',label:'Seiko'}}/><input aria-label="Ghi chú cha" defaultValue="Bản nháp chưa lưu"/></div><ConsignmentClient data={{items:[window.__row],total:1,page:1,pageSize:30,canReadMoney:!location.search.includes('readonly'),capabilities:location.search.includes('readonly')?Object.fromEntries(Object.keys(cap).map(k=>[k,false])):cap}}/></main></WatchQuickPreviewProvider>);window.__render();`;
  const ports = {
    name: "ports",
    setup(build) {
      build.onResolve(
        {
          filter:
            /^next\/navigation$|^next\/image$|AppDialogProvider$|AppToastProvider$|\/payment\/ui\/PaymentWorkspace$|\.\.\/business\/BusinessEntityPreview$/,
        },
        (args) => ({ path: args.path, namespace: "port" }),
      );
      build.onLoad({ filter: /.*/, namespace: "port" }, (args) => {
        let contents;
        if (args.path === "next/navigation")
          contents = `export const useRouter=()=>({push:url=>{history.pushState({},'',url);window.__render()},refresh:()=>window.__render()});export const useSearchParams=()=>new URLSearchParams(location.search);`;
        else if (args.path === "next/image")
          contents = `import React from'react';export default function Image({unoptimized,...props}){return <img {...props}/>}`;
        else if (args.path.endsWith("AppDialogProvider"))
          contents = `export const useAppDialog=()=>({confirm:async()=>window.__confirm});`;
        else if (args.path.endsWith("AppToastProvider"))
          contents = `const notify=Object.fromEntries(['success','warning','error'].map(k=>[k,v=>window.__notices.push(v.message)]));export const useNotify=()=>notify;`;
        else if (args.path.includes("PaymentWorkspace"))
          contents = `import React from'react';export default function Payment({owner,allowComplete}){return <div role="region" aria-label="Thanh toán" data-direction={owner.direction} data-complete={allowComplete}/>}`;
        else
          contents = `import React,{useState}from'react';export function useBusinessEntityPreview(){const[preview,set]=useState(null);return{preview,openPreview:value=>{window.__preview++;set(value)},refreshPreview:()=>{},loading:false,error:null}}export function BusinessEntityPreviewModal({preview,onClose}){return <div className="fixed inset-0 bg-white p-6"><h2>{preview.title}</h2><button aria-label="Đóng xem nhanh" onClick={onClose}>Đóng</button><button>Chi tiết</button></div>}`;
        return { loader: "tsx", resolveDir: root, contents };
      });
    },
  };
  const bundle = await esbuild.build({
    stdin: { contents: entry, loader: "tsx", resolveDir: root },
    bundle: true,
    write: false,
    format: "iife",
    jsx: "automatic",
    plugins: [ports],
  });
  const css = (
    await require("postcss")([
      require("tailwindcss")({
        ...require(path.join(root, "tailwind.config.js")),
        content: [path.join(root, "src/**/*.{ts,tsx}")],
        corePlugins: { preflight: true },
      }),
    ]).process(
      await fs.readFile(path.join(root, "src/app/globals.css"), "utf8"),
      { from: undefined },
    )
  ).css;
  const server = http.createServer((req, res) => {
    res.setHeader(
      "content-type",
      req.url === "/app.js" ? "text/javascript" : "text/html;charset=utf-8",
    );
    res.end(
      req.url === "/app.js"
        ? bundle.outputFiles.find((f) => f.path.endsWith(".js")).text
        : `<html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>${css}</style></head><body><div id="root" class="admin-ui"></div><script src="/app.js"></script></body></html>`,
    );
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.CHROMIUM_EXECUTABLE
      ? { executablePath: process.env.CHROMIUM_EXECUTABLE }
      : {}),
    args: ["--no-sandbox"],
  });
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    const origin = "http://127.0.0.1:" + server.address().port;
    const navigate = async (query) => {
      await page.goto(origin + query);
      await page.getByRole("heading", { level: 2 }).waitFor();
    };
    for (const width of [320, 390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await navigate("?new=IN");
      await page.getByLabel(/^Người gửi/).selectOption("vendor-1");
      await page.getByLabel("Tên đồng hồ nhận ký gửi").fill("Seiko thử");
      await page.getByRole("button", { name: "Tạo hồ sơ nháp" }).click();
      assert.equal(
        await page.evaluate(() => window.__writes.length),
        0,
        "fee must be explicitly agreed",
      );
      await page.getByLabel("Tỷ lệ phí (%)").fill("10");
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
    }
    await page.evaluate(() => (window.__fail = true));
    await page.getByRole("button", { name: "Tạo hồ sơ nháp" }).click();
    await page.getByRole("alert").waitFor();
    const receipt = await page.evaluate(() => window.__writes[0].requestId);
    await page.getByRole("button", { name: "Tạo hồ sơ nháp" }).click();
    await page.waitForFunction(() => window.__writes.length === 2);
    assert.equal(
      await page.evaluate(() => window.__writes[1].requestId),
      receipt,
    );
    assert.equal(
      await page.getByLabel("Tên đồng hồ nhận ký gửi").inputValue(),
      "Seiko thử",
    );
    await navigate("?id=doc-1");
    await page.getByLabel("Giá đối tác đã bán (VND)").fill("10000000");
    assert.equal(
      await page
        .getByRole("button", { name: "Chốt bán & số tiền quyết toán" })
        .isEnabled(),
      false,
    );
    await page
      .getByLabel("Xác nhận / tham chiếu bán từ đối tác")
      .fill("Báo bán #1");
    await page.getByText("Phí đối tác hưởng:", { exact: false }).waitFor();
    await page
      .getByRole("button", { name: "Chốt bán & số tiền quyết toán" })
      .click();
    assert.equal(
      await page.evaluate(() => window.__writes.length),
      0,
      "cancelled confirmation never writes",
    );
    await page.evaluate(() => (window.__confirm = true));
    await page
      .getByRole("button", { name: "Chốt bán & số tiền quyết toán" })
      .click();
    await page.waitForFunction(() => window.__writes.length === 1);
    assert.equal(
      await page.evaluate(() => window.__writes[0].expectedVersion),
      "2026-11-28T01:00:00.000Z",
    );
    await navigate("?id=doc-1");
    await page.evaluate(() => {
      window.__row = { ...window.__row, direction: "IN" };
      window.__render();
    });
    await page.getByLabel("Đơn hàng đã bán").selectOption("order-1");
    await page.evaluate(() => (window.__confirm = true));
    await page
      .getByRole("button", { name: "Chốt bán & số tiền quyết toán" })
      .click();
    await page.waitForFunction(() => window.__writes.length === 1);
    assert.equal(
      await page.evaluate(() => window.__writes[0].orderId),
      "order-1",
    );
    assert.equal(
      await page.evaluate(() => window.__writes[0].saleAmount),
      undefined,
    );
    await navigate("?id=doc-1&readonly");
    await page.evaluate(() => {
      window.__row = { ...window.__row, terms: null };
      window.__render();
    });
    await page
      .getByText("Bạn không có quyền xem điều khoản tài chính.")
      .waitFor();
    assert.equal(
      await page.getByRole("button", { name: "Trả lại người gửi" }).count(),
      0,
    );
    assert.equal(
      await page
        .getByRole("button", { name: "Chốt bán & số tiền quyết toán" })
        .count(),
      0,
    );
    await navigate("");
    const trigger = page.getByRole("button", {
      name: "Xem nhanh Seiko",
      exact: true,
    });
    await trigger.focus();
    await page.keyboard.press("Enter");
    const preview = page.getByRole("dialog", { name: "Xem nhanh đồng hồ" });
    await preview.waitFor();
    assert.equal(await page.evaluate(() => window.__parent), 0);
    assert.equal(
      await page.getByLabel("Ghi chú cha").inputValue(),
      "Bản nháp chưa lưu",
    );
    await page.keyboard.press("Escape");
    await preview.waitFor({ state: "detached" });
    assert.equal(
      await trigger.evaluate((el) => el === document.activeElement),
      true,
    );
    await trigger.click();
    await preview.waitFor();
    await page.getByRole("button", { name: "Đóng xem nhanh" }).click();
    assert.equal(await page.evaluate(() => window.__parent), 0);
    await navigate("?denied");
    await page
      .getByRole("button", { name: "Xem nhanh Seiko", exact: true })
      .click();
    assert.equal(await page.evaluate(() => window.__preview), 0);
    assert.ok((await page.evaluate(() => window.__notices)).length > 0);
    await page.setViewportSize({ width: 390, height: 844 });
    await navigate("?new=IN");
    await fs.mkdir(
      process.env.CONSIGNMENT_SCREENSHOTS || "/tmp/consignment-preview",
      { recursive: true },
    );
    await page.screenshot({
      path: path.join(
        process.env.CONSIGNMENT_SCREENSHOTS || "/tmp/consignment-preview",
        "consignment-mobile.png",
      ),
      fullPage: true,
    });
    assert.deepEqual(errors, []);
    console.log(
      "PASS actual consignment forms and shared preview host: explicit negotiated fee, responsive layout, stable retry receipt, confirmation/version payload, inbound order link, readonly controls, thumbnail event isolation and focus return. HTTP/payment/preview contents are fixture ports.",
    );
  } finally {
    await browser.close();
    await new Promise((r) => server.close(r));
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
