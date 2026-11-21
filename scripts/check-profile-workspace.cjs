/* eslint-disable @typescript-eslint/no-require-imports -- Standalone browser fixture. */
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const esbuild = require('./lib/admin-fixture-esbuild.cjs');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');

(async () => {
  const root = path.resolve(__dirname, '..');
  const entry = `import React from 'react';import{createRoot}from'react-dom/client';import Profile from './src/app/(admin)/admin/profile/_client/ProfileWorkspace';import{AdminButtonProvider}from'./src/domains/shared/ui/admin-design-contract/AdminButton';import{useAdminNavigationProfile}from'./src/domains/shared/ui/admin-design-contract/AdminNavigationProfile';
  function Probe(){const{profile}=useAdminNavigationProfile(location.search?'other-user':'fixture-user');return <output aria-label="Header profile">{profile}</output>}
  const user={id:location.search?'other-user':'fixture-user',email:'fixture@example.invalid',name:'Fixture',avatarUrl:null,roles:['STAFF']};createRoot(document.getElementById('root')).render(<AdminButtonProvider><Probe/><Profile user={user} permissions={[{code:'PRODUCT_VIEW',description:'Xem đồng hồ'},{code:'ORDER_VIEW',description:'Xem đơn hàng'}]}/></AdminButtonProvider>);`;
  const build = await esbuild.build({ stdin: { contents: entry, loader: 'tsx', resolveDir: root }, bundle: true, write: false, platform: 'browser', jsx: 'automatic', define: { 'process.env.NODE_ENV': '"production"' }, plugins: [{ name: 'ports', setup(b) {
    b.onResolve({ filter: /^next\/navigation$/ }, () => ({ path: 'router', namespace: 'ports' }));
    b.onResolve({ filter: /MediaBrowserDialog$/ }, () => ({ path: 'media', namespace: 'ports' }));
    b.onLoad({ filter: /.*/, namespace: 'ports' }, ({ path: port }) => ({ contents: port === 'router' ? 'export const useRouter=()=>({refresh(){}});' : 'export default function Media(){return null;}' }));
  } }] });
  const css = await fs.readFile(process.env.PROFILE_UI_CSS || '/tmp/admin-buttons-global.css', 'utf8');
  const server = http.createServer((req, res) => { res.setHeader('Content-Type', 'text/html; charset=utf-8'); res.end(`<html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>${css}\n${build.outputFiles.filter(f=>f.path.endsWith('.css')).map(f=>f.text).join('\n')}</style></head><body style="margin:0"><div id="root"></div><script>${build.outputFiles.find(f=>f.path.endsWith('.js')).text}</script></body></html>`); });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage(); const origin = `http://127.0.0.1:${server.address().port}`;
    const requests = []; let mode = 'error'; let release;
    await page.route('**/api/admin/profile**', async route => { requests.push({ url: route.request().url(), body: route.request().postDataJSON() }); if (mode === 'pending') await new Promise(resolve => { release = resolve; }); await route.fulfill({ status: mode === 'error' ? 400 : 200, contentType: 'application/json', body: JSON.stringify(mode === 'error' ? { message: 'Không thể lưu bản thử' } : { success: true }) }); });
    await page.goto(origin);
    await page.getByLabel('Dark', { exact: false }).check(); await assert.doesNotReject(()=>page.getByLabel('Header profile').getByText('dark',{exact:true}).waitFor());
    await page.reload(); await page.getByLabel('Dark', { exact: false }).waitFor(); assert.equal(await page.getByLabel('Dark', { exact: false }).isChecked(), true);
    await page.goto(origin+'?other'); assert.equal(await page.getByLabel('Simple', { exact: false }).isChecked(), true); await page.goto(origin);
    const name = page.getByLabel('Tên hiển thị',{exact:true}); const save = page.getByRole('button',{name:'Lưu thay đổi',exact:true});
    assert.equal(await save.isDisabled(),true); await name.fill('Updated fixture'); await save.click(); await page.getByRole('alert').waitFor(); assert.equal(await name.inputValue(),'Updated fixture');
    mode='pending'; await save.click(); await page.waitForFunction(()=>document.querySelector('form[aria-label="Thông tin cá nhân"]').getAttribute('aria-busy')==='true'); assert.equal(await name.isDisabled(),true); const count=requests.length; await page.getByRole('form',{name:'Thông tin cá nhân'}).press('Enter'); assert.equal(requests.length,count); mode='success'; release(); await page.getByText('Đã lưu thông tin cá nhân.',{exact:true}).waitFor(); assert.equal(await save.isDisabled(),true); assert.deepEqual(requests.at(-1).body,{name:'Updated fixture',avatarUrl:null});
    const old=page.getByLabel('Mật khẩu hiện tại',{exact:true}), fresh=page.getByLabel('Mật khẩu mới',{exact:true}), confirm=page.getByLabel('Nhập lại mật khẩu mới',{exact:true}), change=page.getByRole('button',{name:'Đổi mật khẩu',exact:true});
    await old.fill('synthetic-old'); await fresh.fill('synthetic-new'); await confirm.fill('mismatch'); const before=requests.length; await change.click(); await page.getByText('Mật khẩu xác nhận chưa khớp.',{exact:true}).waitFor(); assert.equal(requests.length,before);
    await confirm.fill('synthetic-new'); mode='error'; await change.click(); await page.getByRole('alert').waitFor(); assert.equal(await old.inputValue(),'synthetic-old');
    mode='success'; await change.click(); await page.getByText('Đã đổi mật khẩu.',{exact:true}).waitFor(); assert.equal(await old.inputValue(),''); assert.equal(await fresh.inputValue(),''); assert.equal(await confirm.inputValue(),''); assert.deepEqual(requests.at(-1).body,{oldPassword:'synthetic-old',newPassword:'synthetic-new'});
    await page.getByText('Xem danh sách quyền',{exact:true}).click(); await page.getByLabel('Tìm quyền',{exact:true}).fill('dong ho'); await page.locator('code').filter({hasText:'PRODUCT_VIEW'}).waitFor(); assert.equal(await page.locator('code').filter({hasText:'ORDER_VIEW'}).count(),0);
    for(const width of [320,390,768,1440]) { await page.setViewportSize({width,height:900}); assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`overflow ${width}`); }
    console.log('PASS profile: scoped appearance persistence and live subscribers, failure retention/retry, save payload and pending guard, password confirmation/error/success/reset, permission search and 320–1440px overflow. Synthetic fetch/media ports only; no account or credentials changed.');
  } finally { await browser.close(); await new Promise(resolve=>server.close(resolve)); }
})().catch(error=>{console.error(error);process.exitCode=1;});
