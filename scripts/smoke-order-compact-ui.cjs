// Actual order create/edit form UI; synthetic records and mocked external boundaries.
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const http = require('node:http');
const path = require('node:path');
const esbuild = require('esbuild');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
async function prepare() {
  const root = path.resolve(__dirname, '..');
  const initial = { customerName: 'Khách mẫu', shipPhone: '0900000000', paymentMethod: 'BANK_TRANSFER', hasShipment: false, notes: '', items: [
    { id: 'watch-line', kind: 'PRODUCT', productId: 'watch', title: 'Seiko Prospex Diver — đồng hồ mẫu cho bản xem thử', sku: 'SK-MẪU-01', quantity: 1, listPrice: 5000000, unitPriceAgreed: 4500000, source: 'WATCH_QUICK_ORDER' },
    { id: 'service-line', kind: 'SERVICE', serviceCatalogId: 'service', title: 'Vệ sinh đồng hồ', quantity: 1, listPrice: 350000, unitPriceAgreed: 350000, serviceScope: 'CUSTOMER_OWNED', customerItemNote: 'Tissot nam, mặt xanh — vệ sinh, kiểm tra chống nước.' },
  ] };
  const entry = `import React from 'react';import {createRoot} from 'react-dom/client';
import Form from './src/domains/order/client/OrderFormClient';
const initial=${JSON.stringify(initial)};
const services=[{id:'service',name:'Vệ sinh đồng hồ',defaultPrice:350000},{id:'battery',name:'Thay pin',defaultPrice:150000},{id:'inactive',name:'Dịch vụ ngừng',isActive:false}];
function App(){const mode=window.__previewMode||new URLSearchParams(location.search).get('mode')||'create';
return <Form key={mode} mode={mode==='create'||mode==='modal'?'create':'edit'} orderId="fixture" initialData={{...initial,status:mode==='locked'?'COMPLETED':mode==='edit'?'DRAFT':undefined}} services={services} surface={mode==='modal'?'modal':'page'} createSubmitAs={mode==='modal'?'DRAFT':'POSTED'}/>;}
createRoot(document.getElementById('root')).render(<App/>);`;
  const mocks = {
    AppToastProvider: `const notify={success(x){window.__success=x},warning(x){window.__warning=x},error(x){window.__error=x}};export const useNotify=()=>notify;`,
    AppProgressProvider: `const progress={show(){},hide(){},update(){}};export const useAppProgress=()=>progress;`,
    AppDialogProvider: `const dialog={confirm:async input=>{window.__confirmation=input;return window.__accept!==false}};export const useAppDialog=()=>dialog;`,
  };
  const bundle = await esbuild.build({ stdin: { contents: entry, loader: 'tsx', resolveDir: root }, bundle: true, platform: 'browser', jsx: 'automatic', write: false, define: { 'process.env.NODE_ENV': '"production"' }, plugins: [{ name: 'fixture', setup(build) {
    build.onResolve({ filter: /^next\/(navigation|link|image)$/ }, args => ({ path: args.path, namespace: 'fixture' }));
    build.onLoad({ filter: /.*/, namespace: 'fixture' }, args => ({ contents: args.path.endsWith('navigation') ? `const params=new URLSearchParams();const router={push(path){window.__route=path;window.dispatchEvent(new CustomEvent('preview:navigate',{detail:path}))},refresh(){},replace(){}};export const useRouter=()=>router;export const usePathname=()=>'/admin/orders';export const useSearchParams=()=>params;` : args.path.endsWith('link') ? `import React from 'react';export default function Link({href,children,...props}){return <a href={href} {...props} onClick={e=>{e.preventDefault();window.dispatchEvent(new CustomEvent('preview:navigate',{detail:href}))}}>{children}</a>}` : `import React from 'react';export default function Image({unoptimized,...props}){return <img {...props}/>}`, loader: 'tsx', resolveDir: root }));
    build.onResolve({ filter: /^@\/domains\/shipment\/ui$/ }, () => ({ path: 'shipment', namespace: 'shipment-fixture' }));
    build.onLoad({ filter: /.*/, namespace: 'shipment-fixture' }, () => ({ contents: `export const ShipmentManageModal=()=>null;` }));
    build.onLoad({ filter: /\.(tsx?|jsx?)$/ }, args => {
      const name = Object.keys(mocks).find(key => args.path.endsWith('/' + key + '.tsx') || args.path.endsWith('/' + key + '.ts'));
      if (name) return { contents: mocks[name], loader: 'tsx' };
    });
  } }] });
  return { js: bundle.outputFiles[0].text, root, initial };
}
(async () => {
  const { js } = await prepare();
  if (process.env.ORDER_UI_EXPORT) { await fs.writeFile(process.env.ORDER_UI_EXPORT, js); return; }
  const css = process.env.ORDER_UI_CSS ? await fs.readFile(process.env.ORDER_UI_CSS, 'utf8') : '';
  const server = http.createServer((req, res) => {
    if (req.url === '/app.js') { res.setHeader('content-type', 'text/javascript'); res.end(js); }
    else { res.setHeader('content-type', 'text/html; charset=utf-8'); res.end(`<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${css}\nbody{margin:0;font-family:Arial,sans-serif;color:#0f172a;background:white}</style><div id="root"></div><script src="/app.js"></script>`); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({ headless: true, ...(process.env.CHROMIUM_EXECUTABLE ? { executablePath: process.env.CHROMIUM_EXECUTABLE } : {}), args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    page.setDefaultTimeout(12000);
    const errors = [], writes = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/api/admin/**', async route => {
      const request = route.request();
      if (request.method() !== 'GET') { writes.push({ method: request.method(), path: new URL(request.url()).pathname, body: request.postDataJSON() }); await route.fulfill({ json: { id: 'fixture' } }); }
      else await route.fulfill({ json: { items: [] } });
    });
    const shot = async name => { if (process.env.ORDER_UI_SCREENSHOTS) { await fs.mkdir(process.env.ORDER_UI_SCREENSHOTS, { recursive: true }); await page.screenshot({ path: path.join(process.env.ORDER_UI_SCREENSHOTS, name + '.png'), fullPage: true }); } };
    await page.goto(origin + '/?mode=create');
    assert.equal(await page.getByRole('button', { name: 'Tạo & duyệt đơn', exact: true }).count(), 1);
    assert.equal(await page.getByRole('button', { name: 'Lưu nháp', exact: true }).count(), 1);
    assert.equal(await page.getByRole('option', { name: 'Dịch vụ ngừng' }).count(), 0);
    await shot('orders-create');
    await page.evaluate(() => window.__accept = false);
    await page.getByRole('button', { name: 'Tạo & duyệt đơn', exact: true }).click();
    assert.equal(writes.length, 0); // Original explicit confirmation is still required.
    await page.evaluate(() => window.__accept = true);
    await page.getByRole('button', { name: 'Lưu nháp', exact: true }).click();
    await page.waitForFunction(() => window.__success);
    assert.equal(writes[0].method, 'POST'); assert.equal(writes[0].body.status, 'DRAFT');
    assert.equal(writes[0].body.items[0].unitPriceAgreed, 4500000);
    assert.equal(writes[0].body.items[1].customerItemNote, 'Tissot nam, mặt xanh — vệ sinh, kiểm tra chống nước.');
    await page.goto(origin + '/?mode=create');
    await page.getByRole('combobox', { name: 'Thêm dịch vụ' }).selectOption('battery');
    await page.getByRole('button', { name: 'Tạo & duyệt đơn', exact: true }).click();
    await page.waitForFunction(() => window.__warning);
    assert.equal(writes.length, 1); // Service identification cannot be hidden or bypassed.
    await page.getByRole('textbox', { name: 'Ghi chú dịch vụ Thay pin' }).fill('Citizen nữ mặt trắng, thay pin.');
    await page.getByRole('button', { name: 'Tạo & duyệt đơn', exact: true }).click();
    await page.waitForFunction(() => window.__success);
    assert.equal(writes[1].body.status, 'POSTED'); assert.equal(writes[1].body.items[2].serviceScope, 'CUSTOMER_OWNED');
    assert.equal(writes[1].body.items[2].customerItemNote, 'Citizen nữ mặt trắng, thay pin.');
    await page.goto(origin + '/?mode=edit');
    const price = page.getByRole('textbox', { name: /^Giá chốt Seiko/ });
    assert.equal(await price.inputValue(), '4500000');
    await price.fill('4400000');
    await page.getByRole('checkbox', { name: 'Có giao hàng', exact: true }).check();
    await page.getByRole('textbox', { name: 'Địa chỉ', exact: true }).fill('Địa chỉ mẫu');
    await page.getByRole('textbox', { name: 'Tỉnh / thành', exact: true }).fill('TP Hồ Chí Minh');
    await page.getByRole('button', { name: 'Lưu thay đổi', exact: true }).click();
    await page.waitForFunction(() => window.__success);
    assert.equal(writes[2].method, 'PATCH'); assert.equal(writes[2].body.items[0].unitPriceAgreed, 4400000);
    assert.equal(writes[2].body.hasShipment, true); assert.equal(writes[2].body.shipAddress, 'Địa chỉ mẫu');
    await page.goto(origin + '/?mode=locked');
    assert.ok(await page.getByRole('button', { name: 'Lưu thay đổi', exact: true }).isDisabled());
    assert.ok(await price.isDisabled());
    await page.goto(origin + '/?mode=modal');
    assert.equal(await page.getByRole('button', { name: 'Lưu nháp', exact: true }).count(), 0);
    await page.getByRole('button', { name: 'Lưu đơn nháp', exact: true }).click();
    await page.waitForFunction(() => window.__success); assert.equal(writes[3].body.status, 'DRAFT');
    await page.goto(origin + '/?mode=create');
    await page.getByRole('combobox', { name: 'Thêm dịch vụ' }).selectOption('battery');
    await page.getByRole('combobox', { name: 'Thêm dịch vụ' }).selectOption('battery');
    const notes = page.getByRole('textbox', { name: 'Ghi chú dịch vụ Thay pin' });
    await notes.nth(0).fill('Đồng hồ thứ nhất'); await notes.nth(1).fill('Đồng hồ thứ hai');
    await page.getByRole('button', { name: 'Bỏ dòng Thay pin', exact: true }).first().click();
    assert.equal(await notes.inputValue(), 'Đồng hồ thứ hai');
    await page.getByRole('button', { name: 'Thêm trade-in', exact: true }).click();
    const trade = page.getByRole('dialog', { name: 'Phiếu nhập trade-in', exact: true });
    await trade.waitFor();
    await trade.getByRole('spinbutton', { name: 'Giá thu vào', exact: true }).fill('1000000');
    await trade.getByRole('button', { name: 'Gắn vào Order', exact: true }).click();
    await trade.waitFor({ state: 'hidden' });
    assert.ok(await page.getByText('Chênh lệch', { exact: false }).count());
    await page.getByRole('button', { name: 'Chỉnh sửa', exact: true }).click();
    await page.keyboard.press('Escape'); await trade.waitFor({ state: 'hidden' });
    assert.equal(await page.getByRole('button', { name: 'Chỉnh sửa', exact: true }).evaluate(el => el === document.activeElement), true);
    await page.goto(origin + '/?mode=create');
    await page.getByRole('combobox', { name: 'Loại thanh toán', exact: true }).selectOption('COD');
    assert.ok(await page.getByRole('checkbox', { name: 'Có giao hàng', exact: true }).isChecked());
    await page.getByRole('textbox', { name: 'Tiền cọc COD', exact: true }).fill('1000000');
    await page.getByRole('textbox', { name: 'Địa chỉ', exact: true }).fill('Địa chỉ mẫu');
    await page.getByRole('textbox', { name: 'Tỉnh / thành', exact: true }).fill('TP Hồ Chí Minh');
    await page.getByRole('button', { name: 'Tạo & duyệt đơn', exact: true }).click();
    await page.waitForFunction(() => window.__success);
    assert.equal(writes[4].body.reserve.type, 'COD'); assert.equal(writes[4].body.reserve.amount, 1000000);
    assert.equal(writes[4].body.paymentMethod, 'COD'); assert.equal(writes[4].body.hasShipment, true);
    for (const width of [390, 768, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      for (const mode of ['create', 'edit']) {
        await page.goto(origin + '/?mode=' + mode);
        await page.getByRole('heading', { level: 1 }).waitFor();
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${mode} overflow at ${width}`);
        if (mode === 'create' && width === 390) await shot('orders-mobile');
      }
    }
    assert.deepEqual(errors, []);
    console.log('PASS: actual order create/edit forms; one save bar; draft/post confirmation and VND payloads; service identification and notes preserved; shipment fields; locked-order guard; draft-only modal; no overflow at 390/768/1280.');
  } finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error); process.exitCode = 1; });
