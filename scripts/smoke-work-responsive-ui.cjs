/* eslint-disable @typescript-eslint/no-require-imports -- Real-component browser fixture and isolated synthetic action ports. */
// Production PersonalWorkClient with synthetic work and stubbed server actions only.
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const http = require('node:http');
const path = require('node:path');
const esbuild = require('./lib/admin-fixture-esbuild.cjs');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
async function buildFixture({ realFeedback = false } = {}) {
  const root = path.resolve(__dirname, '..');
  const photo='data:image/jpeg;base64,'+(await fs.readFile(path.join(root,'public/temp_watch.jpg'))).toString('base64');
  const entry = `import React from 'react';import {createRoot} from 'react-dom/client';import {PersonalWorkClient} from './src/domains/personal-work/ui/PersonalWorkClient';import {AppToastProvider} from './src/domains/shared/feedback/AppToastProvider';import {checklistOnlyWork} from './src/domains/personal-work/shared/checklist-share-projection';
const workObject={type:'WATCH',id:'watch-fixture',label:'Seiko Diver',secondary:'SEI-001',href:'/admin/watches/product-fixture',imageUrl:${JSON.stringify(photo)}};
const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Bangkok'}).format(new Date());const yesterday=new Date(Date.parse(today+'T00:00:00Z')-86400000).toISOString().slice(0,10);const now=Date.now();
const sampleAvatar='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><rect width="80" height="80" fill="#dce7ed"/><path d="M7 80c0-23 13-34 33-34s33 11 33 34" fill="#334155"/><ellipse cx="40" cy="32" rx="18" ry="23" fill="#e6b493"/><path d="M21 31C15 4 62 0 59 31l-10-9-18 2z" fill="#302b2a"/><path d="M34 43q6 4 12 0" fill="none" stroke="#9b6452" stroke-width="2"/></svg>');
const owner={id:'long' ,name:'Long',email:'long@example.invalid',avatarUrl:sampleAvatar};const vi={id:'vi',name:'Vi',email:'vi@example.invalid',avatarUrl:null};
const nam={id:'nam',name:'Nam',email:'nam@example.invalid',avatarUrl:null};const hoa={id:'hoa',name:'Hoa',email:'hoa@example.invalid',avatarUrl:null};
const general={key:'GENERAL',label:'Cá nhân',domain:'GENERAL',color:'#64748b',isDefault:true};const work={key:'WATCHSHOP',label:'WatchShop',domain:'WATCHSHOP',color:'#f43f5e',isDefault:true};
const specs=[['Tính tiền phí dịch vụ đồng hồ của An, Nam',23,'08:00',0,2],['Làm lại UI phiếu nhập WatchShop và tối ưu thao tác cho màn hình nhỏ với tiêu đề rất dài',28,'10:00',1,4],['Hoàn thành tối ưu web push cho PWA WatchShop',24,'10:00',3,5],['Tự động kết nối nhà vận chuyển',29,'14:00',0,0],['Nâng cấp vận hành cho Ben ở điện thoại',32,'09:00',0,1],['Tối ưu performance của trang quản lý công việc',31,'09:00',0,1],['GVU vs DK',26,'19:00',0,0],['GVU JR vs TCP',27,'20:00',0,0]];
const data={currentUserId:'long',availableUsers:[vi,nam,hoa],categories:[general,work],canManageDefaultCategories:false,codex:{ready:false,reason:'Dữ liệu mẫu',canDispatch:false},calendar:{configured:false,connected:false,accountEmail:null,lastSyncedAt:null,events:[],loadError:null},items:specs.map(([title,number,time,done,total],i)=>({id:'item-'+number,title,personalWorkNumber:number,createdAt:new Date(now-7*86400000).toISOString(),updatedAt:new Date(now-20*60000).toISOString(),note:'Ghi chú đầy đủ của công việc mẫu',status:'TODO',priority:'MEDIUM',dueAt:(i<2?yesterday:today)+'T'+time+':00+07:00',scheduledEndAt:i<2?(i===0?today:yesterday)+'T17:00:00+07:00':null,estimatedDays:i<2?2:1,completedAt:null,domain:i>=6?'GENERAL':'WATCHSHOP',category:i>=6?general:work,workType:i>=6?'EVENT':'GENERAL_TASK',targets:i===0?[{type:'ORDER',id:'order',label:'OD-MẪU',secondary:'Đơn hàng liên quan',href:'/admin/orders/order'}]:i===1?[workObject]:[],progressPercent:total?Math.round(done/total*100):0,progressMode:total?'CHECKLIST':'MANUAL',checklistLockedAt:null,activities:[{id:'activity-'+i,title:'Cập nhật tiến độ',body:'Đã kiểm tra dữ liệu · Chờ xác nhận từ người phụ trách',occurredAt:new Date(now-20*60000).toISOString(),actor:owner}],checklist:Array.from({length:total},(_,n)=>({id:'step-'+i+'-'+n,title:'Đầu việc '+(n+1),isDone:n<done,...(n===0?{object:workObject,mediaContext:{productId:'product-fixture',label:'Seiko Diver',secondary:'SEI-001',href:'/admin/watches/product-fixture/edit?mode=media&focus=image',request:'Chụp ảnh'}}:{})})),tags:i===0?['media','theo dõi']:[],calendar:{synced:false,htmlLink:null,lastSyncedAt:null},owner,assignee:owner,access:'OWNER',sharedWith:i===0?[{user:vi,accessLevel:'EDITOR'},{user:nam,accessLevel:'VIEWER'},{user:hoa,accessLevel:'VIEWER'}]:[]}))};
data.items.push(checklistOnlyWork({...data.items[0],id:'shared',personalWorkNumber:40,title:'Đầu việc được chia sẻ chỉ xem',owner:vi},[{id:'visible-step',title:'Đầu việc của bạn',isDone:false,access:new URLSearchParams(location.search).has('entryEditor')?'EDITOR':'VIEWER'}]));
if(new URLSearchParams(location.search).has('calendarFault'))Object.assign(data.calendar,{configured:true,connected:true,accountEmail:'fixture@example.invalid'});
if(new URLSearchParams(location.search).has('fullShare'))data.items.push({...data.items[0],id:'shared-full',personalWorkNumber:41,title:'Theo dõi khách hàng được chia sẻ',owner:vi,access:'VIEWER',assignedToMe:false,checklistOnly:false,checklist:[],sharedWith:[]});
window.__fixture=data;const root=createRoot(document.getElementById('root'));window.__renderFixture=()=>root.render(<AppToastProvider><PersonalWorkClient data={window.__fixture}/></AppToastProvider>);window.__renderFixture();`;
  const bundle = await esbuild.build({ stdin: { contents: entry, loader: 'tsx', resolveDir: root }, outfile: '/tmp/work-responsive/app.js', bundle: true, platform: 'browser', jsx: 'automatic', write: false, define: { 'process.env.NODE_ENV': '"production"' }, plugins: [{ name: 'fixture', setup(build) {
    build.onResolve({ filter: /^next\/(navigation|link|image)$/ }, args => ({ path: args.path, namespace: 'fixture' }));
    build.onResolve({ filter: /^@\/domains\/shared\/feedback$/ }, () => ({ path: 'feedback', namespace: 'fixture' }));
    build.onLoad({ filter: /.*/, namespace: 'fixture' }, args => ({ contents: args.path === 'feedback' ? `const dialog={confirm:async()=>true,alert:async()=>{}};export const useAppDialog=()=>dialog;` : args.path.endsWith('navigation') ? `const params=new URLSearchParams(location.search);if(!params.has('full'))params.set('view','list');const router={refresh(){window.__refreshed=true;window.__renderFixture?.()},push(path){window.__route=path},replace(){}};export const useRouter=()=>router;export const useSearchParams=()=>params;` : args.path.endsWith('link') ? `import React from 'react';export default function Link({children,href,...props}){return <a href={href} {...props} onClick={e=>{e.preventDefault();window.__route=href}}>{children}</a>}` : `import React from 'react';export default function Image({unoptimized,...props}){return <img {...props}/>}`, loader: 'tsx', resolveDir: root }));
    build.onLoad({ filter: /[\\/]personal-work\.actions\.ts$/ }, async args => { const source = await fs.readFile(args.path, 'utf8'); return { contents: [...source.matchAll(/export async function (\w+)/g)].map(m => `export async function ${m[1]}(input){(window.__actions??=[]).push({name:'${m[1]}',input});if(input?.status||'${m[1]}'==='finalizePersonalWorkChecklistAction'){await new Promise(resolve=>setTimeout(resolve,window.__completionDelay||150));if(window.__completionError)throw new Error('Không thể hoàn thành công việc. Vui lòng thử lại.');}if('${m[1]}'==='updatePersonalWorkAction'&&window.__saveError)throw Object.assign(new Error('An error occurred in the Server Components render.'),{digest:'synthetic'});if('${m[1]}'==='updatePersonalWorkAction'&&input?.id&&window.__fixture){window.__fixture={...window.__fixture,items:window.__fixture.items.map(item=>item.id===input.id?{...item,...input}:item)}}if('${m[1]}'==='finalizePersonalWorkChecklistAction')window.__fixture={...window.__fixture,items:window.__fixture.items.map(item=>item.id===input?{...item,status:'DONE',checklistLockedAt:new Date().toISOString()}:item)};if('${m[1]}'==='renamePersonalWorkChecklistItemAction')window.__fixture={...window.__fixture,items:window.__fixture.items.map(item=>item.id===input.taskItemId?{...item,checklist:item.checklist.map(entry=>entry.id===input.checklistItemId?{...entry,title:input.title}:entry)}:item)};if('${m[1]}'==='togglePersonalWorkChecklistItemAction')window.__fixture={...window.__fixture,items:window.__fixture.items.map(item=>item.id===input.taskItemId?{...item,checklist:item.checklist.map(entry=>entry.id===input.checklistItemId?{...entry,isDone:input.isDone}:entry)}:item)};if('${m[1]}'==='updatePersonalWorkAction'||'${m[1]}'==='finalizePersonalWorkChecklistAction')return {ok:true,calendarSync:window.__calendarStatus||'NOT_LINKED'};return [];}`).join('\n'), loader: 'js' }; });
    if(!realFeedback)build.onLoad({ filter: /[\\/]AppToastProvider\.tsx$/ }, () => ({ contents: `const notify={success(){},warning(){},error(x){window.__toastError=x}};export const useNotify=()=>notify;export const AppToastProvider=({children})=>children;`, loader: 'js' }));
  } }] });
  return { js: bundle.outputFiles.find(f => f.path.endsWith('.js')).text, css: bundle.outputFiles.find(f => f.path.endsWith('.css'))?.text || '' };
}
module.exports = { buildFixture };
if (require.main === module) (async () => {
  const built = await buildFixture();
  if (process.env.WORK_RESPONSIVE_EXPORT) { await fs.writeFile(process.env.WORK_RESPONSIVE_EXPORT + '.js', built.js); await fs.writeFile(process.env.WORK_RESPONSIVE_EXPORT + '.css', built.css); return; }
  const css = (process.env.WORK_RESPONSIVE_CSS ? await fs.readFile(process.env.WORK_RESPONSIVE_CSS, 'utf8') : '') + '\n' + built.css;
  const server = http.createServer((req, res) => { if (req.url.startsWith('/api/admin/personal-work/images')) { res.setHeader('content-type', 'application/json'); res.end(JSON.stringify({items:[],canEdit:false,limit:20})); return; } if (req.url === '/app.js') { res.setHeader('content-type', 'text/javascript'); res.end(built.js); } else { res.setHeader('content-type', 'text/html; charset=utf-8'); res.end(`<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${css}\nbody{margin:0;font-family:Arial,sans-serif}</style><div id="root"></div><script src="/app.js"></script>`); } });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({ headless: true, ...(process.env.CHROMIUM_EXECUTABLE ? { executablePath: process.env.CHROMIUM_EXECUTABLE } : {}), args: ['--no-sandbox'] });
  try {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, timezoneId: 'Asia/Bangkok' });
    const page = await context.newPage(); page.setDefaultTimeout(12000);
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    await page.goto(origin);
    await page.locator('[data-work-row]').first().waitFor();
    assert.equal(await page.locator('[data-work-row]').count(), 9);
    const row = code => page.locator(`[data-work-row="item-${code}"]`);
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 844 });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `page overflow ${width}`);
      assert.ok(await page.locator('[data-work-row]').evaluateAll(rows => rows.every(row => row.scrollWidth <= row.clientWidth + 1 && row.querySelector('[data-work-meta]').scrollWidth <= row.querySelector('[data-work-meta]').clientWidth + 1 && row.querySelector('[data-work-headline]').getBoundingClientRect().height <= 33)), `row overflow or extra title line ${width}`);
      const filter = page.getByRole('button', { name: /^Bộ lọc công việc:/ });
      assert.ok(await filter.isVisible());
      const ref = await row(28).locator('[data-work-code]').textContent(); assert.equal(ref, 'CV-28');
      assert.equal(await row(28).locator('[data-work-headline] [data-work-code]').count(), 0);
      if (process.env.WORK_RESPONSIVE_SHOTS) { await fs.mkdir(process.env.WORK_RESPONSIVE_SHOTS, { recursive: true }); await page.screenshot({ path: path.join(process.env.WORK_RESPONSIVE_SHOTS, `work-${width}.png`), fullPage: true }); }
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole('combobox', { name: 'Hiển thị công việc' }).selectOption('EVENTS');
    assert.equal(await page.locator('[data-work-row]').count(), 2); assert.equal(await page.getByRole('button', { name: /^Đánh dấu hoàn thành/ }).count(), 0);
    await page.getByRole('combobox', { name: 'Hiển thị công việc' }).selectOption('ALL');
    await row(23).getByRole('button', { name: /^Lịch CV-23:/ }).click();
    const schedule = page.getByRole('group', { name: 'Lịch CV-23', exact: true }); await schedule.waitFor();
    assert.ok(await schedule.getByText('Thời lượng: 2 ngày', { exact: true }).count());
    await page.keyboard.press('Escape'); await schedule.waitFor({ state: 'hidden' });
    assert.equal(await row(23).getByRole('button', { name: /^Lịch CV-23:/ }).evaluate(el => el === document.activeElement), true);
    const sharing = row(23).getByRole('button', { name: /^Chia sẻ CV-23:/ });
    await page.getByRole('heading', { level: 1 }).click();
    await sharing.hover();
    assert.equal(await page.getByRole('group', { name: 'Thông tin thêm CV-23', exact: true }).count(), 0);
    assert.equal(await sharing.getByLabel('Long', { exact: true }).count(), 1);
    assert.equal(await sharing.locator('img').evaluate(img => img.complete && img.naturalWidth > 0), true);
    assert.equal(await sharing.getByText('+1', { exact: true }).count(), 0);
    await sharing.click();
    const info = page.getByRole('group', { name: 'Thông tin thêm CV-23', exact: true }); await info.waitFor();
    assert.equal(await info.getByText('Có thể sửa', { exact: true }).count(), 1);
    assert.equal(await info.getByText('Chỉ xem', { exact: true }).count(), 2);
    assert.equal(await info.getByText('Long', { exact: true }).count(), 1);
    assert.equal(await info.getByRole('link', { name: /OD-MẪU/ }).getAttribute('href'), '/admin/orders/order');
    await page.getByRole('heading', { level: 1 }).click(); await info.waitFor({ state: 'hidden' });
    await row(24).getByRole('button', { name: /^Có cập nhật:/ }).hover();
    const hint = page.getByRole('tooltip'); await hint.waitFor();
    assert.ok((await hint.innerText()).includes('20 phút trước')); await page.keyboard.press('Escape'); await hint.waitFor({ state: 'hidden' });
    await page.getByRole('button', { name: /^Bộ lọc công việc:/ }).click();
    await page.getByRole('button', { name: 'Đóng bộ lọc', exact: true }).waitFor();
    assert.equal(await page.getByRole('button', { name: 'Đóng bộ lọc', exact: true }).evaluate(el => el === document.activeElement), true);
    await page.keyboard.press('Tab');
    assert.equal(await page.getByRole('combobox', { name: 'Phạm vi công việc', exact: true }).evaluate(el => el === document.activeElement), true);
    await page.getByRole('combobox', { name: 'Phạm vi công việc', exact: true }).selectOption('SHARED');
    assert.equal(await page.locator('[data-work-row]').count(), 1); assert.ok(await page.getByRole('button', { name: 'Đánh dấu hoàn thành CV-40' }).isDisabled());
    await page.getByRole('combobox', { name: 'Phạm vi công việc', exact: true }).selectOption('MINE');
    await page.getByRole('combobox', { name: 'Loại công việc', exact: true }).selectOption('WATCHSHOP');
    assert.equal(await page.locator('[data-work-row]').count(), 6);
    await page.keyboard.press('Escape');
    await row(29).getByRole('button', { name: 'Đánh dấu hoàn thành CV-29' }).click();
    await page.waitForFunction(() => window.__actions?.some(a => a.name === 'updatePersonalWorkAction'));
    const action = await page.evaluate(() => window.__actions.find(a => a.name === 'updatePersonalWorkAction')); assert.deepEqual(action.input, { id: 'item-29', status: 'DONE' });
    await row(28).getByRole('button', { name: /^Mở CV-28:/ }).click();
    await page.getByRole('button', { name: 'Hủy', exact: true }).waitFor();
    assert.ok(await page.getByRole('dialog').getByRole('img', {name:'Ảnh Seiko Diver',exact:true}).count());
    assert.equal(await page.getByRole('dialog').getByText('Ghi chú', {exact:true}).count(), 0);
    assert.equal(await page.getByRole('button', {name:'← Danh sách công việc', exact:true}).getAttribute('data-admin-button'), 'contextual');
    assert.equal(await page.getByRole('dialog').getByPlaceholder('Ví dụ: báo cáo, codex (ngăn cách bằng dấu phẩy)').isVisible().catch(()=>false), false);

    assert.equal((await page.evaluate(() => window.__actions)).filter(a => a.name === 'updatePersonalWorkAction').length, 1); // Opening never mutates work.
    await page.getByRole('button', { name: 'Hủy', exact: true }).click();
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(origin + '/?full=1');
    await page.locator('[data-work-row]').first().waitFor();
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    assert.equal(await page.locator('#personal-google-calendar-agenda').count(), 1);
    const leftHeading = await page.getByRole('navigation', { name: 'Hiển thị công việc' }).getByRole('heading').boundingBox();
    const contentHeading = await page.getByRole('heading', { name: 'Hôm nay', exact: true }).boundingBox();
    assert.ok(Math.abs(leftHeading.y - contentHeading.y) <= 1, 'Pane headings align');
    if (process.env.WORK_RESPONSIVE_SHOTS) await page.screenshot({ path: path.join(process.env.WORK_RESPONSIVE_SHOTS, 'work-workspace-desktop.png'), fullPage: true });
    await page.locator('#personal-google-calendar-agenda').waitFor();
    const calendarWidth = (await page.locator('#personal-google-calendar-agenda').boundingBox()).width;
    const listWidth = (await page.getByRole('list', { name: 'Công việc', exact: true }).boundingBox()).width;
    assert.ok(calendarWidth >= 420 && calendarWidth > listWidth, 'Calendar receives the wider desktop pane');
    if (process.env.WORK_RESPONSIVE_SHOTS) await page.screenshot({ path: path.join(process.env.WORK_RESPONSIVE_SHOTS, 'work-calendar-desktop.png'), fullPage: true });
    const navigation = page.getByRole('navigation', { name: 'Hiển thị công việc' });
    await navigation.getByRole('button', { name: 'Tất cả', exact: true }).click();
    assert.equal(await navigation.getByRole('button', { name: 'Tất cả', exact: true }).getAttribute('aria-pressed'), 'true');
    assert.ok(await page.getByRole('separator', { name: 'Điều chỉnh độ rộng menu công việc' }).isVisible());
    await page.getByPlaceholder('Việc cần làm...').fill('Bản nháp đang nhập');
    await navigation.getByRole('button', { name: 'Quá hạn', exact: true }).click();
    await row(28).waitFor(); assert.equal(await row(31).count(), 0);
    await navigation.getByRole('button', { name: 'Sự kiện', exact: true }).click();
    await row(26).waitFor(); assert.equal(await row(28).count(), 0);
    await navigation.getByRole('button', { name: 'Tất cả', exact: true }).click();
    assert.equal(await page.getByPlaceholder('Việc cần làm...').inputValue(), 'Bản nháp đang nhập');
    assert.equal(await page.evaluate(() => (window.__actions || []).length), 0);
    for (const width of [390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      const viewSelect = navigation.getByRole('combobox', { name: 'Hiển thị công việc', exact: true });
      await viewSelect.waitFor(); await viewSelect.selectOption('OVERDUE'); await row(28).waitFor();
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      if (process.env.WORK_RESPONSIVE_SHOTS) await page.screenshot({ path: path.join(process.env.WORK_RESPONSIVE_SHOTS, 'work-workspace-' + width + '.png'), fullPage: true });
      await viewSelect.selectOption('ALL');
    }
    await page.setViewportSize({ width: 1440, height: 1000 });

    await row(31).getByRole('button', { name: /^Lịch CV-31:/ }).click();
    const lastSchedule = page.getByRole('group', { name: 'Lịch CV-31', exact: true }); await lastSchedule.waitFor();
    const box = await lastSchedule.boundingBox(); assert.ok(box.x >= 0 && box.y >= 0 && box.y + box.height <= 1000);
    const touch = await browser.newContext({ viewport: { width: 390, height: 844 }, timezoneId: 'Asia/Bangkok', hasTouch: true });
    const phone = await touch.newPage(); await phone.goto(origin + '/?entryEditor=1');
    await phone.locator('[data-work-row="shared"]').getByLabel('Sửa đầu việc', { exact: true }).waitFor();
    assert.ok(await phone.getByRole('button', { name: 'Đánh dấu hoàn thành CV-40' }).isDisabled());
    await phone.locator('[data-work-row="item-31"]').getByRole('button', { name: /^Có cập nhật:/ }).tap();
    await phone.getByRole('tooltip').waitFor(); await phone.getByRole('heading', { level: 1 }).tap(); await phone.getByRole('tooltip').waitFor({ state: 'hidden' });
    await phone.locator('[data-work-row="item-23"]').getByRole('button', { name: /^Chia sẻ CV-23:/ }).tap();
    const recipients = phone.getByRole('group', { name: 'Thông tin thêm CV-23', exact: true });
    await recipients.waitFor();
    for (const name of ['Vi', 'Nam', 'Hoa']) assert.equal(await recipients.getByText(name, { exact: true }).count(), 1);
    await phone.getByRole('heading', { level: 1 }).tap();
    for (const id of ['item-23', 'shared']) {
      await phone.goto(origin + '/?view=list&item=' + id);
      await phone.getByRole('dialog').waitFor();
      assert.equal(await phone.getByRole('dialog').getByRole('heading', { level: 2 }).innerText(), id === 'shared' ? 'Đầu việc được chia sẻ chỉ xem' : 'Tính tiền phí dịch vụ đồng hồ của An, Nam');

      await phone.getByRole('button', { name: '← Danh sách công việc', exact: true }).tap();
    }
    await phone.locator('[data-work-row="shared"]').getByRole('button', { name: /^Chia sẻ CV-40:/ }).tap();
    const scopedSharing = phone.getByRole('group', { name: 'Thông tin thêm CV-40', exact: true });
    await scopedSharing.waitFor();
    assert.equal(await scopedSharing.getByText('Vi', { exact: true }).count(), 1);
    assert.equal(await scopedSharing.getByText('Bạn · Xem đầu việc', { exact: true }).count(), 1);
    assert.equal(await scopedSharing.getByText('Nam', { exact: true }).count(), 0);
    // Saved work must close its editor even when optional Google sync failed.
    await phone.goto(origin+'/?view=list&item=item-23');
    await phone.getByRole('dialog').waitFor();
    await phone.evaluate(()=>{window.__calendarStatus='FAILED'});
    await phone.getByLabel(/^Nội dung cập nhật/).fill('500.000');
    await phone.getByRole('button',{name:'Lưu thay đổi',exact:true}).tap();
    await phone.getByRole('dialog').waitFor({state:'hidden'});
    assert.ok(await phone.getByText('Đã lưu công việc. Chưa đồng bộ Google Calendar; bạn có thể thử lại.',{exact:true}).isVisible());
    await phone.getByRole('button',{name:'Thử đồng bộ lại',exact:true}).tap();
    await phone.getByRole('button',{name:'Thử đồng bộ lại',exact:true}).waitFor({state:'hidden'});
    const saveCalls=await phone.evaluate(()=>window.__actions);
    assert.equal(saveCalls.filter(a=>a.name==='updatePersonalWorkAction').length,1);
    assert.equal(saveCalls.filter(a=>a.name==='syncPersonalWorkCalendarAction').length,1);
    assert.equal(saveCalls.find(a=>a.name==='updatePersonalWorkAction').input.updateBody,'500.000');
    assert.equal(saveCalls.find(a=>a.name==='updatePersonalWorkAction').input.note, 'Ghi chú đầy đủ của công việc mẫu');
    await phone.goto(origin+'/?view=list&item=item-23');
    await phone.getByRole('dialog').waitFor();
    await phone.evaluate(()=>{window.__saveError=true});
    await phone.getByLabel(/^Nội dung cập nhật/).fill('Giữ nội dung khi lỗi');
    await phone.getByRole('button',{name:'Lưu thay đổi',exact:true}).tap();
    await phone.getByRole('dialog').getByRole('alert').waitFor();
    assert.match(await phone.getByRole('dialog').getByRole('alert').innerText(),/tải lại danh sách/);
    assert.equal(await phone.getByLabel(/^Nội dung cập nhật/).inputValue(),'Giữ nội dung khi lỗi');
    await touch.close();
    let calendarMode='reconnect';
    await page.route('**/api/admin/personal-work/calendar',async route=>{
      const fixture=await page.evaluate(()=>window.__fixture);
      await route.fulfill({json:{events:calendarMode==='ok'?[]:null,items:fixture.items,lastSyncedAt:null,loadError:calendarMode==='ok'?null:calendarMode==='reconnect'?'Quyền truy cập đã hết hạn. Hãy kết nối lại.':'Google Calendar tạm thời chưa phản hồi.',reconnectRequired:calendarMode==='reconnect'}});
    });
    await page.goto(origin+'/?full=1&calendarFault=1');
    await page.getByText('CẦN KẾT NỐI LẠI',{exact:true}).waitFor();
    assert.ok(await page.getByRole('button',{name:'Kết nối lại Google Calendar',exact:true}).isVisible());
    assert.ok(await page.locator('[data-work-row="item-31"]').isVisible());
    calendarMode='temporary';await page.reload();
    await page.getByText('LỖI ĐỒNG BỘ',{exact:true}).waitFor();
    assert.ok(await page.getByRole('button',{name:'Tải lại lịch',exact:true}).isVisible());
    calendarMode='ok';await page.getByRole('button',{name:'Tải lại lịch',exact:true}).click();
    await page.getByText('ĐÃ LIÊN KẾT',{exact:true}).waitFor();
    await page.goto(origin+'/?view=list&fullShare=1');
    const sharedFull=page.locator('[data-work-row="shared-full"]');
    await sharedFull.waitFor();
    assert.ok(await page.getByRole('button',{name:'Bộ lọc công việc: Tất cả',exact:true}).isVisible());
    assert.ok(await sharedFull.getByRole('button',{name:'Đánh dấu hoàn thành CV-41',exact:true}).isDisabled());
    await page.getByRole('button',{name:/^Bộ lọc công việc:/}).click();
    const scopeControl=page.getByRole('combobox',{name:'Phạm vi công việc',exact:true});
    await scopeControl.selectOption('MINE');await sharedFull.waitFor({state:'hidden'});
    await scopeControl.selectOption('ALL');await sharedFull.waitFor();
    await page.reload();await page.locator('[data-work-row="shared-full"]').waitFor();
    assert.deepEqual(errors, []);
    console.log('PASS: actual personal-work client at 320/390/768/1440; category/title and reference placement; view/scope/category filters; event and viewer restrictions; schedule/context/update popovers; completion payload and read-only open; desktop calendar layout.');
  } finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
})().catch(e => { console.error(e); process.exitCode = 1; });

