// Production PersonalWorkClient with synthetic work and stubbed server actions only.
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const http = require('node:http');
const path = require('node:path');
const esbuild = require('esbuild');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
async function buildFixture() {
  const root = path.resolve(__dirname, '..');
  const entry = `import React from 'react';import {createRoot} from 'react-dom/client';import {PersonalWorkClient} from './src/domains/personal-work/ui/PersonalWorkClient';import {checklistOnlyWork} from './src/domains/personal-work/shared/checklist-share-projection';
const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Bangkok'}).format(new Date());const yesterday=new Date(Date.parse(today+'T00:00:00Z')-86400000).toISOString().slice(0,10);const now=Date.now();
const owner={id:'long',name:'Long',email:'long@example.invalid',avatarUrl:null};const vi={id:'vi',name:'Vi',email:'vi@example.invalid',avatarUrl:null};
const general={key:'GENERAL',label:'Cá nhân',domain:'GENERAL',color:'#64748b',isDefault:true};const work={key:'WATCHSHOP',label:'WatchShop',domain:'WATCHSHOP',color:'#f43f5e',isDefault:true};
const specs=[['Tính tiền phí dịch vụ đồng hồ của An, Nam',23,'08:00',0,2],['Làm lại UI phiếu nhập WatchShop và tối ưu thao tác cho màn hình nhỏ với tiêu đề rất dài',28,'10:00',1,4],['Hoàn thành tối ưu web push cho PWA WatchShop',24,'10:00',3,5],['Tự động kết nối nhà vận chuyển',29,'14:00',0,0],['Nâng cấp vận hành cho Ben ở điện thoại',32,'09:00',0,1],['Tối ưu performance của trang quản lý công việc',31,'09:00',0,1],['GVU vs DK',26,'19:00',0,0],['GVU JR vs TCP',27,'20:00',0,0]];
const data={currentUserId:'long',availableUsers:[vi],categories:[general,work],canManageDefaultCategories:false,codex:{ready:false,reason:'Dữ liệu mẫu',canDispatch:false},calendar:{configured:false,connected:false,accountEmail:null,lastSyncedAt:null,events:[],loadError:null},items:specs.map(([title,number,time,done,total],i)=>({id:'item-'+number,title,personalWorkNumber:number,createdAt:new Date(now-7*86400000).toISOString(),updatedAt:new Date(now-20*60000).toISOString(),note:'Ghi chú đầy đủ của công việc mẫu',status:'TODO',priority:'MEDIUM',dueAt:(i<2?yesterday:today)+'T'+time+':00+07:00',scheduledEndAt:i<2?(i===0?today:yesterday)+'T17:00:00+07:00':null,estimatedDays:i<2?2:1,completedAt:null,domain:i>=6?'GENERAL':'WATCHSHOP',category:i>=6?general:work,workType:i>=6?'EVENT':'GENERAL_TASK',targets:i===0?[{type:'ORDER',id:'order',label:'OD-MẪU',secondary:'Đơn hàng liên quan',href:'/admin/orders/order'}]:[],progressPercent:total?Math.round(done/total*100):0,progressMode:total?'CHECKLIST':'MANUAL',checklistLockedAt:null,activities:[{id:'activity-'+i,title:'Cập nhật tiến độ',body:'Đã kiểm tra dữ liệu · Chờ xác nhận từ người phụ trách',occurredAt:new Date(now-20*60000).toISOString(),actor:owner}],checklist:Array.from({length:total},(_,n)=>({id:'step-'+i+'-'+n,title:'Đầu việc '+(n+1),isDone:n<done})),tags:i===0?['media','theo dõi']:[],calendar:{synced:false,htmlLink:null,lastSyncedAt:null},owner,assignee:owner,access:'OWNER',sharedWith:i===0?[{user:vi,accessLevel:'VIEWER'}]:[]}))};
data.items.push(checklistOnlyWork({...data.items[0],id:'shared',personalWorkNumber:40,title:'Đầu việc được chia sẻ chỉ xem',owner:vi},[{id:'visible-step',title:'Đầu việc của bạn',isDone:false,access:new URLSearchParams(location.search).has('entryEditor')?'EDITOR':'VIEWER'}]));
window.__fixture=data;const root=createRoot(document.getElementById('root'));window.__renderFixture=()=>root.render(<PersonalWorkClient data={window.__fixture}/>);window.__renderFixture();`;
  const bundle = await esbuild.build({ stdin: { contents: entry, loader: 'tsx', resolveDir: root }, outfile: '/tmp/work-responsive/app.js', bundle: true, platform: 'browser', jsx: 'automatic', write: false, define: { 'process.env.NODE_ENV': '"production"' }, plugins: [{ name: 'fixture', setup(build) {
    build.onResolve({ filter: /^next\/(navigation|link|image)$/ }, args => ({ path: args.path, namespace: 'fixture' }));
    build.onResolve({ filter: /^@\/domains\/shared\/feedback$/ }, () => ({ path: 'feedback', namespace: 'fixture' }));
    build.onLoad({ filter: /.*/, namespace: 'fixture' }, args => ({ contents: args.path === 'feedback' ? `const dialog={confirm:async()=>true,alert:async()=>{}};export const useAppDialog=()=>dialog;` : args.path.endsWith('navigation') ? `const params=new URLSearchParams(location.search);if(!params.has('full'))params.set('view','list');const router={refresh(){window.__refreshed=true;window.__renderFixture?.()},push(path){window.__route=path},replace(){}};export const useRouter=()=>router;export const useSearchParams=()=>params;` : args.path.endsWith('link') ? `import React from 'react';export default function Link({children,href,...props}){return <a href={href} {...props} onClick={e=>{e.preventDefault();window.__route=href}}>{children}</a>}` : `import React from 'react';export default function Image({unoptimized,...props}){return <img {...props}/>}`, loader: 'tsx', resolveDir: root }));
    build.onLoad({ filter: /\/personal-work\.actions\.ts$/ }, async args => { const source = await fs.readFile(args.path, 'utf8'); return { contents: [...source.matchAll(/export async function (\w+)/g)].map(m => `export async function ${m[1]}(input){(window.__actions??=[]).push({name:'${m[1]}',input});if('${m[1]}'==='updatePersonalWorkAction'&&input?.id&&window.__fixture){window.__fixture={...window.__fixture,items:window.__fixture.items.map(item=>item.id===input.id?{...item,...input}:item)}}return [];}`).join('\n'), loader: 'js' }; });
    build.onLoad({ filter: /\/AppToastProvider\.tsx$/ }, () => ({ contents: `const notify={success(){},warning(){},error(x){window.__toastError=x}};export const useNotify=()=>notify;`, loader: 'js' }));
  } }] });
  return { js: bundle.outputFiles.find(f => f.path.endsWith('.js')).text, css: bundle.outputFiles.find(f => f.path.endsWith('.css'))?.text || '' };
}
(async () => {
  const built = await buildFixture();
  if (process.env.WORK_RESPONSIVE_EXPORT) { await fs.writeFile(process.env.WORK_RESPONSIVE_EXPORT + '.js', built.js); await fs.writeFile(process.env.WORK_RESPONSIVE_EXPORT + '.css', built.css); return; }
  const css = (process.env.WORK_RESPONSIVE_CSS ? await fs.readFile(process.env.WORK_RESPONSIVE_CSS, 'utf8') : '') + '\n' + built.css;
  const server = http.createServer((req, res) => { if (req.url === '/app.js') { res.setHeader('content-type', 'text/javascript'); res.end(built.js); } else { res.setHeader('content-type', 'text/html; charset=utf-8'); res.end(`<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${css}\nbody{margin:0;font-family:Arial,sans-serif}</style><div id="root"></div><script src="/app.js"></script>`); } });
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
    await row(23).getByRole('button', { name: 'Thông tin thêm CV-23' }).click();
    const info = page.getByRole('group', { name: 'Thông tin thêm CV-23', exact: true }); await info.waitFor();
    assert.equal(await info.getByRole('link', { name: /OD-MẪU/ }).getAttribute('href'), '/admin/orders/order');
    await page.getByRole('heading', { level: 1 }).click(); await info.waitFor({ state: 'hidden' });
    await row(24).getByRole('button', { name: /^Có cập nhật:/ }).hover();
    const hint = page.getByRole('tooltip'); await hint.waitFor();
    assert.ok((await hint.innerText()).includes('20 phút trước')); await page.keyboard.press('Escape'); await hint.waitFor({ state: 'hidden' });
    await page.getByRole('button', { name: /^Bộ lọc công việc:/ }).click();
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
    assert.equal((await page.evaluate(() => window.__actions)).filter(a => a.name === 'updatePersonalWorkAction').length, 1); // Opening never mutates work.
    await page.getByRole('button', { name: 'Hủy', exact: true }).click();
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(origin + '/?full=1');
    await page.locator('[data-work-row]').first().waitFor();
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    if (process.env.WORK_RESPONSIVE_SHOTS) await page.screenshot({ path: path.join(process.env.WORK_RESPONSIVE_SHOTS, 'work-calendar-desktop.png'), fullPage: true });
    assert.ok(await page.getByRole('combobox', { name: 'Hiển thị công việc' }).isVisible()); // Container width, not screen width.
    await page.getByRole('combobox', { name: 'Hiển thị công việc' }).selectOption('ALL');
    await row(31).getByRole('button', { name: /^Lịch CV-31:/ }).click();
    const lastSchedule = page.getByRole('group', { name: 'Lịch CV-31', exact: true }); await lastSchedule.waitFor();
    const box = await lastSchedule.boundingBox(); assert.ok(box.x >= 0 && box.y >= 0 && box.y + box.height <= 1000);
    const touch = await browser.newContext({ viewport: { width: 390, height: 844 }, timezoneId: 'Asia/Bangkok', hasTouch: true });
    const phone = await touch.newPage(); await phone.goto(origin + '/?entryEditor=1');
    await phone.locator('[data-work-row="shared"]').getByLabel('Sửa đầu việc', { exact: true }).waitFor();
    assert.ok(await phone.getByRole('button', { name: 'Đánh dấu hoàn thành CV-40' }).isDisabled());
    await phone.locator('[data-work-row="item-31"]').getByRole('button', { name: /^Có cập nhật:/ }).tap();
    await phone.getByRole('tooltip').waitFor(); await phone.getByRole('heading', { level: 1 }).tap(); await phone.getByRole('tooltip').waitFor({ state: 'hidden' });
    await touch.close();
    assert.deepEqual(errors, []);
    console.log('PASS: actual personal-work client at 320/390/768/1440; category/title and reference placement; view/scope/category filters; event and viewer restrictions; schedule/context/update popovers; completion payload and read-only open; desktop calendar layout.');
  } finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
})().catch(e => { console.error(e); process.exitCode = 1; });
