// Production form/share components; synthetic vendors, network and media only.
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const http = require('node:http');
const path = require('node:path');
const esbuild = require('esbuild');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
(async () => {
  const root = path.resolve(__dirname, '..');
  const entry = `import React,{useState} from 'react';import {createRoot} from 'react-dom/client';
import Form from './src/domains/acquisition/client/AcquisitionFormClient';
import Edit from './src/domains/acquisition/ui/edit/AcquisitionEditModal';
import Money from './src/domains/acquisition/ui/shared/AcquisitionMoneyInput';
import {PersonalChecklistShare} from './src/domains/personal-work/ui/PersonalChecklistShare';
const vi={id:'vi',name:'Vi',email:'vi@example.invalid'};
function App(){const [shares,setShares]=useState([]);const [money,setMoney]=useState(2500000);const mode=new URLSearchParams(location.search).get('mode');
if(mode==='edit')return <Edit open acquisitionId="fixture" onClose={()=>{}}/>;
if(mode==='money')return <><Money label="Số tiền" value={money} currency={new URLSearchParams(location.search).get('currency')||'VND'} onChange={v=>{setMoney(v);window.__amount=v}}/><button>Rời ô</button></>;
if(mode==='share')return <div style={{display:'flex',justifyContent:'flex-end',padding:32}}><PersonalChecklistShare users={[vi]} shares={shares} onSave={async next=>{window.__calls=(window.__calls||0)+1;await new Promise(r=>setTimeout(r,50));if(window.__fail)throw new Error('Không lưu được');window.__shares=next;setShares(next)}}/></div>;
return <Form vendors={[{id:'vendor',name:'Vendor mẫu'}]} canApprove={false}/>;}
createRoot(document.getElementById('root')).render(<App/>);`;
  const mocks = {
    AppToastProvider: `const notify={success(){},warning(x){window.__warning=x},error(x){window.__error=x}};export const useNotify=()=>notify;`,
    AppProgressProvider: `const progress={show(){},hide(){},update(){}};export const useAppProgress=()=>progress;`,
    AppDialogProvider: `const dialog={confirm:async()=>true};export const useAppDialog=()=>dialog;`,
    'vendor.actions': `export const createQuickVendor=async()=>({id:'new',name:'New'});`,
    'operation-delivery.client': `export const waitForOperationProjectionDeliveries=async()=>{};`,
    MediaPickerInline: `export default function Picker(){return <button type="button" aria-label="Chọn ảnh">Ảnh</button>;}`,
    AcquisitionBulkImagePicker: `export default function Picker(){return <button type="button">Chọn nhiều ảnh</button>;}`,
    AcquisitionCreatedDialog: `export default function Dialog({open}){return open?<p>Đã lưu phiếu mẫu</p>:null;}`,
  };
  const bundle = await esbuild.build({ stdin: { contents: entry, loader: 'tsx', resolveDir: root }, bundle: true, platform: 'browser', jsx: 'automatic', write: false,
    define: { 'process.env.NODE_ENV': '"production"' }, plugins: [{ name: 'fixture', setup(build) {
      build.onResolve({ filter: /^next\/navigation$/ }, () => ({ path: 'navigation', namespace: 'fixture' }));
      build.onLoad({ filter: /.*/, namespace: 'fixture' }, () => ({ contents: `export const useRouter=()=>({push(){},refresh(){}});` }));
      build.onLoad({ filter: /\.(tsx?|jsx?)$/ }, args => {
        const key = Object.keys(mocks).find(name => args.path.endsWith('/' + name + '.tsx') || args.path.endsWith('/' + name + '.ts'));
        if (key) return { contents: mocks[key], loader: 'tsx' };
      });
    } }] });
  const css = process.env.ACQUISITION_PREVIEW_CSS ? await fs.readFile(process.env.ACQUISITION_PREVIEW_CSS, 'utf8') : '';
  const server = http.createServer((req, res) => {
    if (req.url === '/app.js') { res.setHeader('content-type', 'text/javascript'); res.end(bundle.outputFiles[0].text); }
    else { res.setHeader('content-type', 'text/html'); res.end(`<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${css}\nbody{margin:0;font-family:Arial,sans-serif}input,select,button{font:inherit}</style><div id="root"></div><script src="/app.js"></script>`); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({ headless: true, ...(process.env.CHROMIUM_EXECUTABLE ? { executablePath: process.env.CHROMIUM_EXECUTABLE } : {}), args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    page.setDefaultTimeout(10000);
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    let created, edited;
    await page.route('**/api/admin/acquisitions/inline-submit', async route => { created = route.request().postDataJSON(); await route.fulfill({ json: { id: 'fixture' } }); });
    const detail = { id: 'fixture', refNo: 'PN-MẪU', status: 'DRAFT', audienceSegment: 'MEN', vendorName: 'Vendor mẫu', currency: 'VND', notes: '', totalAmount: 2500000, paidAmount: 0, unpaidAmount: 2500000,
      items: [{ id: 'watch', productType: 'WATCH', title: 'Seiko mẫu', quantity: 1, unitCost: 2500000, aiHint: '', imageKey: null, imageUrl: null }] };
    await page.route('**/api/admin/acquisitions/fixture/edit', async route => {
      if (route.request().method() === 'PUT') { edited = route.request().postDataJSON(); await route.fulfill({ json: { ok: true } }); }
      else await route.fulfill({ json: detail });
    });
    await page.goto(origin);
    await page.getByRole('combobox', { name: 'Vendor', exact: true }).selectOption('vendor');
    await page.getByPlaceholder('VD: seiko tự động').fill('Seiko mẫu');
    const cost = page.getByRole('textbox', { name: 'Giá nhập đồng hồ 1', exact: true });
    await cost.fill('2500');
    await page.getByRole('textbox', { name: 'Giá bán đồng hồ 1', exact: true }).fill('3200');
    assert.ok(await page.getByText('2.500.000 VND', { exact: true }).count());
    if (process.env.ACQUISITION_SCREENSHOT) await page.screenshot({ path: process.env.ACQUISITION_SCREENSHOT, fullPage: true });
    await page.getByRole('button', { name: 'Lưu phiếu nhập', exact: true }).click();
    await page.getByText('Đã lưu phiếu mẫu').waitFor();
    assert.equal(created.items[0].cost, 2500000); assert.equal(created.items[0].salePrice, 3200000);
    await page.goto(origin + '/?mode=edit');
    const editCost = page.getByRole('textbox', { name: 'Giá nhập Seiko mẫu', exact: true });
    await editCost.waitFor(); assert.equal(await editCost.inputValue(), '2500');
    await Promise.all([page.waitForResponse(response => response.url().endsWith('/fixture/edit') && response.request().method() === 'PUT'), page.getByRole('button', { name: 'Lưu thay đổi', exact: true }).click()]);
    assert.equal(edited.items[0].unitCost, 2500000); // Existing VND amounts never scale twice.
    await editCost.fill('2750,5');
    await Promise.all([page.waitForResponse(response => response.url().endsWith('/fixture/edit') && response.request().method() === 'PUT'), page.getByRole('button', { name: 'Lưu thay đổi', exact: true }).click()]);
    assert.equal(edited.items[0].unitCost, 2750500);
    await page.goto(origin + '/?mode=money');
    const money = page.getByRole('textbox', { name: 'Số tiền', exact: true });
    await money.fill('2,5'); assert.equal(await page.evaluate(() => window.__amount), 2500);
    await money.fill(''); assert.equal(await page.evaluate(() => window.__amount), '');
    await money.fill('12'); await money.fill('-5'); assert.equal(await page.evaluate(() => window.__amount), 12000);
    await money.fill('1e9'); assert.equal(await page.evaluate(() => window.__amount), 12000);
    await money.fill('999999999999999999'); assert.equal(await page.evaluate(() => window.__amount), 12000);
    await page.goto(origin + '/?mode=money&currency=USD');
    await money.fill('25.5'); assert.equal(await page.evaluate(() => window.__amount), 25.5);
    await page.goto(origin + '/?mode=share');
    await page.getByRole('button', { name: 'Chia sẻ đầu việc', exact: true }).click();
    const dialog = page.getByRole('dialog', { name: 'Chia sẻ đầu việc', exact: true });
    assert.equal(await dialog.getByRole('button', { name: 'Lưu chia sẻ' }).count(), 0);
    await dialog.getByRole('combobox', { name: 'Thêm người xem đầu việc' }).selectOption('vi');
    await page.waitForFunction(() => window.__shares?.length === 1);
    assert.equal(await page.evaluate(() => window.__shares[0].accessLevel), 'VIEWER');
    await dialog.getByRole('combobox', { name: 'Quyền đầu việc của Vi' }).selectOption('EDITOR');
    await page.waitForFunction(() => window.__shares[0].accessLevel === 'EDITOR');
    await page.evaluate(() => window.__fail = true);
    await dialog.getByRole('button', { name: 'Bỏ chia sẻ đầu việc với Vi' }).click();
    await dialog.getByRole('alert').waitFor();
    assert.equal(await dialog.getByRole('combobox', { name: 'Quyền đầu việc của Vi' }).inputValue(), 'EDITOR');
    await page.evaluate(() => window.__fail = false);
    await dialog.getByRole('button', { name: 'Bỏ chia sẻ đầu việc với Vi' }).click();
    await page.waitForFunction(() => window.__shares.length === 0);
    await page.waitForFunction(() => document.querySelector('[role=dialog]')?.getAttribute('aria-busy') === 'false');
    await page.keyboard.press('Escape'); await dialog.waitFor({state:'hidden'}); assert.equal(await dialog.count(), 0);
    assert.equal(await page.getByRole('button', { name: 'Chia sẻ đầu việc', exact: true }).evaluate(el => el === document.activeElement), true);
    for (const width of [390, 768]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(origin);
      await cost.waitFor();
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `form overflow at ${width}`);
      await page.goto(origin + '/?mode=share');
      await page.getByRole('button', { name: 'Chia sẻ đầu việc', exact: true }).click();
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `share overflow at ${width}`);
    }
    assert.deepEqual(errors, []);
    console.log('PASS: real create/edit payloads in VND; prefilled edit unchanged; decimal, blank, invalid, overflow and USD; compact immediate sharing with default VIEWER, role change, failed revoke rollback, successful revoke and Escape focus; mobile/tablet no overflow.');
  } finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error); process.exitCode = 1; });
