// Real editor/shared primitives with synthetic HTTP responses; no database or storage writes.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import esbuild from './lib/admin-fixture-esbuild.cjs';
import tailwind from 'tailwindcss';
import postcss from 'postcss';
const require = createRequire(import.meta.url);
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

(async () => {
  const contractBundle = await esbuild.build({ entryPoints: [path.join(root, 'src/domains/storefront/content/contract.ts')], bundle: true, platform: 'node', format: 'cjs', write: false });
  const contractModule = { exports: {} };
  vm.runInNewContext(contractBundle.outputFiles[0].text, { module: contractModule, exports: contractModule.exports, require });
  const home = JSON.parse(JSON.stringify(contractModule.exports.defaultHome()));
  const key = 'storefront/editorial/fixture.webp';
  let record = { id: 'home', kind: 'HOME', draft: home, revision: 0, publishedAt: null, updatedAt: null };
  let published = null;
  let failSave = false;
  const mutations = [];
  const notifications = [];
  const bundle = await esbuild.build({
    stdin: { contents: `import React from 'react';import{createRoot}from'react-dom/client';import Manager from './src/domains/storefront/content/StorefrontManager';createRoot(document.getElementById('root')).render(<Manager homeOnly storefrontUrl="/public-fixture"/>);`, resolveDir: root, loader: 'tsx' },
    bundle: true, platform: 'browser', jsx: 'automatic', write: false, outfile: '/tmp/storefront-home-layout/app.js', loader: { '.css': 'empty', '.module.css': 'local-css' },
    define: { 'process.env.NODE_ENV': '"production"' },
    plugins: [{ name: 'synthetic-ports', setup(build) {
      build.onResolve({ filter: /^next\/image$/ }, () => ({ path: 'image', namespace: 'fixture' }));
      build.onResolve({ filter: /AppToastProvider$/ }, () => ({ path: 'toast', namespace: 'fixture' }));
      build.onResolve({ filter: /AppDialogProvider$/ }, () => ({ path: 'dialog', namespace: 'fixture' }));
      build.onLoad({ filter: /.*/, namespace: 'fixture' }, ({ path: name }) => ({ loader: 'tsx', resolveDir: root, contents: name === 'image'
        ? `import React from 'react';export default function Image({unoptimized,...props}){return <img {...props}/>}`
        : name === 'toast' ? `const notify={success(message){window.__successes=(window.__successes||[]).concat(message)},error(message){window.__errors=(window.__errors||[]).concat(message)}};export const useNotify=()=>notify;`
        : `export const useAppDialog=()=>({confirm:async()=>true});` }));
      build.onResolve({ filter: /^@\// }, async ({ path: source }) => {
        if (source === '@/domains/shared/ui/admin-design-contract') return { path: path.join(root, 'src/domains/shared/ui/admin-design-contract/AdminPage.tsx') };
        const base = path.join(root, source.replace(/^@\//, 'src/'));
        for (const suffix of ['.ts', '.tsx', '/index.ts']) { try { await fs.access(base + suffix); return { path: base + suffix }; } catch {} }
        return null;
      });
    } }],
  });
  const tailwindCss = await postcss([tailwind({ content: [path.join(root, 'src/domains/storefront/content/StorefrontManager.tsx'), path.join(root, 'src/domains/shared/ui/admin-design-contract/*.{ts,tsx}')], corePlugins: { preflight: true } })]).process('@tailwind base;@tailwind utilities;', { from: undefined });
  const css = tailwindCss.css + '\n' + bundle.outputFiles.filter(file => file.path.endsWith('.css')).map(file => file.text).join('\n') + '\n' + await fs.readFile(path.join(root, 'src/domains/storefront/content/manager.css'), 'utf8');
  const server = http.createServer((req, res) => {
    if (req.url.startsWith('/api/admin/storefront/content')) return reply({ record, articles: [] });
    if (req.url.startsWith('/api/admin/storefront/media/library')) return reply({ items: [{ key, name: 'Ảnh mẫu', url: '/image.svg' }], nextCursor: null, truncated: false });
    if (req.url === '/api/admin/storefront/media') return reply({ items: [{ key, name: 'Ảnh mẫu', url: '/image.svg' }], truncated: false });
    if (req.url.startsWith('/api/admin/storefront/products?gallery=')) return reply({images:[{id:'gallery-1',url:'/image.svg',alt:'Ảnh nổi bật'}]});
    if (req.url.startsWith('/api/admin/storefront/products')) return reply({items:[{productId:'p1',title:'Đồng hồ mẫu',image:{url:'/image.svg',alt:'Cover mẫu'}}]});
    if (req.url.startsWith('/storefront-preview')) { res.setHeader('Content-Type', 'text/html'); return res.end('<p>Bản xem trước nháp</p>'); }
    if (req.url === '/image.svg') { res.setHeader('Content-Type', 'image/svg+xml'); return res.end('<svg xmlns="http://www.w3.org/2000/svg" width="140" height="115"><rect width="140" height="115" fill="#e2e8f0"/></svg>'); }
    res.setHeader('Content-Type', 'text/html');
    res.end('<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"><style>body{margin:0;font-family:Arial,sans-serif}' + css + '</style></head><body><div id="root"></div><script>' + bundle.outputFiles[0].text + '</script></body></html>');
    function reply(json) { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(json)); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = 'http://127.0.0.1:' + server.address().port;
  let browser;
  try {
    browser = await chromium.launch({ headless: true, ...(process.env.BEN_PWA_CHROMIUM ? { executablePath: process.env.BEN_PWA_CHROMIUM } : {}) });
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    page.on('pageerror', error => notifications.push(error.message));
    await page.route('**/api/admin/storefront/content*', async route => {
      if (route.request().method() !== 'POST') return route.continue();
      const body = route.request().postDataJSON();
      assert.equal(body.scope, 'home'); assert.equal(body.revision, record.revision);
      if (failSave) { failSave = false; return route.fulfill({ status: 503, json: { error: 'Lưu thất bại, giữ bản đang sửa.' } }); }
      await new Promise(resolve => setTimeout(resolve, 100));
      mutations.push(body.action);
      record = { ...record, draft: body.content, revision: record.revision + 1 };
      if (body.action === 'publish') { published = structuredClone(body.content); record.publishedAt = new Date().toISOString(); }
      return route.fulfill({ json: { record } });
    });
    await page.goto(url);
    await page.getByRole('heading', { name: 'Trang chủ website', exact: true }).waitFor();
    const nav = page.getByRole('region', { name: 'Các khối trang chủ' });
    const bar = page.locator('.sfc-document-actions');
    await bar.waitFor();
    assert.equal(await bar.evaluate(el => el.tagName), 'DIV');
    assert.equal(await bar.evaluate(el => Boolean(el.closest('.sfc-heading-links'))), true);
    assert.equal(await page.getByText(/lưu ý về cách hiển thị ảnh/).count(), 0);
    assert.equal(await bar.getByText('Trang chủ', { exact: true }).count(), 0);
    assert.equal(await bar.getByRole('button', {name:'Xuất bản',exact:true}).count(), 1);
    assert.equal(await page.getByRole('group', {name:'Thao tác tài liệu',exact:true}).count(), 1, 'one active document action group');
    assert.equal(await page.getByRole('link', {name:/Thư viện ảnh website|Mở website/}).count(), 0, 'home editor omits removed shortcuts');
    assert.equal(await page.locator('.sfc-section-editor:visible').count(), 1);
    await page.getByLabel('Tông màu khối mở đầu').selectOption('charcoal');
    await nav.getByRole('button',{name:/^Đồng hồ nổi bật/}).click();
    await page.getByRole('button',{name:'Đồng hồ mẫu',exact:true}).click();
    await page.getByText('Chọn ảnh gallery',{exact:true}).click();
    await page.getByRole('button',{name:'Chọn ảnh gallery 1',exact:true}).click();
    assert.equal(await page.locator('.sfc-featured-image-editor input[type="range"]').count(),0);
    assert.equal(await page.getByRole('button',{name:'Chọn ảnh gallery 1',exact:true}).getAttribute('aria-pressed'),'true');
    await nav.getByRole('button', { name: /^Về Vintic/ }).click();
    const about = page.locator('#home-editor-about');
    const hint = about.getByText('Ảnh không bắt buộc. Chưa chọn ảnh: phần giới thiệu hiển thị dạng văn bản gọn.', { exact: true });
    await hint.waitFor();
    const aboutImage = about.getByRole('button', { name: 'Chọn Ảnh giới thiệu', exact: true });
    assert.equal(await aboutImage.getAttribute('aria-describedby'), await hint.getAttribute('id'));
    await aboutImage.click();const picker = about.getByRole('region', { name: 'Thư viện Ảnh giới thiệu', exact: true });assert.equal(await picker.getByRole('combobox').inputValue(), 'about');await picker.getByRole('button', { name: 'Chọn ảnh Ảnh mẫu', exact: true }).click();assert.equal(await hint.count(), 0);
    await about.getByRole('button', { name: 'Bỏ ảnh', exact: true }).click(); await hint.waitFor();
    await about.getByLabel('Tiêu đề', { exact: true }).fill('Giới thiệu vẫn giữ khi đổi khối');
    await nav.getByRole('button', { name: /^Bộ sưu tập/ }).click();
    await page.locator('#home-editor-collections').getByText('Ảnh không bắt buộc. Chưa chọn ảnh: nhóm hiển thị thành liên kết gọn.', { exact: true }).first().waitFor();
    await nav.getByRole('button', { name: /^Ảnh mở đầu/ }).click();
    assert.equal(await page.getByLabel('Tông màu khối mở đầu').inputValue(), 'charcoal');
    failSave = true; await page.getByRole('button', { name: 'Lưu nháp', exact: true }).click();
    await page.getByRole('alert').filter({hasText:'Lưu thất bại, giữ bản đang sửa.'}).waitFor();
    assert.equal(await page.getByLabel('Tông màu khối mở đầu').inputValue(), 'charcoal');
    await page.getByRole('button', { name: 'Lưu nháp', exact: true }).click();
    await page.waitForFunction(() => window.__successes?.includes('Đã lưu nháp.'));
    assert.equal(published, null);
    await page.getByRole('button', { name: 'Xem trước', exact: true }).click();
    const preview = page.getByRole('dialog', { name: 'Xem trước Storefront' }); await preview.waitFor();
    await page.getByRole('button', { name: 'Đóng xem trước' }).click(); assert.equal(published, null);
    await page.getByRole('button', { name: 'Xuất bản', exact: true }).click();
    await page.waitForFunction(() => window.__successes?.includes('Đã xuất bản phiên bản mới.'));
    assert.equal(published.about.title, 'Giới thiệu vẫn giữ khi đổi khối'); assert.equal(published.about.image.key, '');
    assert.deepEqual(published.featured.images,{p1:{imageId:'gallery-1',focalX:50,focalY:50,zoom:1}});
    assert.equal(published.hero.theme, 'charcoal'); assert.deepEqual(mutations, ['save', 'save', 'publish']);
    for (const width of [320, 390, 768, 1280, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.waitForFunction(() => {
        const layout = document.querySelector('.sfc-home-layout');
        return layout && layout.dataset.wide === String(layout.clientWidth >= 960);
      });
      if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) {
        console.log(await page.evaluate(() => [...document.querySelectorAll('body *')]
          .filter(el => el.getBoundingClientRect().right > innerWidth + 1)
          .slice(0, 8).map(el => ({ tag: el.tagName, className: el.className, right: el.getBoundingClientRect().right }))));
      }
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'overflow at ' + width);
      const bounds = await bar.boundingBox(); assert.ok(bounds.height < (width < 640 ? 180 : 120), 'action bar stays compact');
      if (width <= 768) await page.getByRole('combobox', { name: 'Khối đang sửa' }).selectOption('about');
      else await nav.getByRole('button', { name: /^Về Vintic/ }).click();
      await hint.waitFor();
      assert.equal(await about.getByLabel('Tiêu đề', { exact: true }).inputValue(), 'Giới thiệu vẫn giữ khi đổi khối');
      if (process.env.HOME_LAYOUT_SCREENSHOT_DIR) { await fs.mkdir(process.env.HOME_LAYOUT_SCREENSHOT_DIR, { recursive: true }); await page.screenshot({ path: path.join(process.env.HOME_LAYOUT_SCREENSHOT_DIR, 'home-' + width + '.png'), fullPage: true }); }
    }
    assert.deepEqual(notifications, []);
    console.log('PASS real home editor: flat action bar; contextual conditional image hints; accessible hint references; section draft retention; failed save/retry; draft/preview/publish separation; no overflow at 320/390/768/1280/1440. API/dialog/Next image ports use fixtures; no live backend or storage writes.');
  } finally { if (browser) await browser.close(); await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error); process.exitCode = 1; });
