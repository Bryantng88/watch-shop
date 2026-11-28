/* eslint-disable @typescript-eslint/no-require-imports -- Actual confirmation provider, work client and embedded workspace with isolated transports. */
const assert=require('node:assert/strict'),http=require('node:http'),fs=require('node:fs/promises'),path=require('node:path');
const {buildFixture}=require('./smoke-work-responsive-ui.cjs');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
(async()=>{
 const root=path.resolve(__dirname,'..'),built=await buildFixture({realFeedback:true,realDialogs:true});
 const css=(await require('postcss')([require('tailwindcss')({...require('../tailwind.config.js'),content:[path.join(root,'src/**/*.{ts,tsx}')]} )]).process(await fs.readFile(path.join(root,'src/app/globals.css'),'utf8'),{from:undefined})).css+built.css;
 const server=http.createServer((req,res)=>{
  const url=new URL(req.url,'http://fixture');
  if(url.searchParams.has('embedded')){res.setHeader('content-type','text/html;charset=utf-8');res.end(`<button onclick="parent.postMessage({type:'workspace-target-modal-dirty',dirty:true},location.origin)">Chỉnh sửa mẫu</button>`);return;}
  if(req.url.startsWith('/api/admin/personal-work/images')){res.setHeader('content-type','application/json');res.end(JSON.stringify({items:[],canEdit:false,limit:20}));return;}
  res.setHeader('content-type',req.url==='/app.js'?'text/javascript':'text/html;charset=utf-8');res.end(req.url==='/app.js'?built.js:`<meta charset="utf-8"><meta name="viewport" content="width=device-width"><style>${css}</style><div id="root"></div><script src="/app.js"></script>`);
 });await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const browser=await chromium.launch();
 try{
  for(const width of [320,390,1440]){
   const page=await browser.newPage({viewport:{width,height:900}});page.setDefaultTimeout(12000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto('http://127.0.0.1:'+server.address().port+'/?view=list&item=item-23');const work=page.locator('form[role=dialog]');await work.waitFor();
   const first=work.locator('[data-work-checklist-row]').first(),second=work.locator('[data-work-checklist-row]').nth(1);
   await first.getByRole('button',{name:'Hoàn thành Đầu việc 1',exact:true}).click();let confirm=page.getByRole('alertdialog');await confirm.waitFor();
   assert.equal(await page.evaluate(()=>window.__actions?.filter(a=>a.name==='togglePersonalWorkChecklistItemAction').length||0),0);
   assert.ok(await confirm.getByRole('button',{name:'Bỏ qua',exact:true}).evaluate(el=>el===document.activeElement));
   await page.keyboard.press('Enter');await confirm.waitFor({state:'hidden'});assert.equal(await first.getByRole('button',{name:'Hoàn thành Đầu việc 1',exact:true}).count(),1);
   await first.getByRole('button',{name:'Hoàn thành Đầu việc 1',exact:true}).click();await confirm.getByRole('button',{name:'Hoàn thành đầu việc',exact:true}).click();await first.getByRole('button',{name:'Mở lại Đầu việc 1',exact:true}).waitFor();
   assert.equal(await page.evaluate(()=>window.__actions.filter(a=>a.name==='togglePersonalWorkChecklistItemAction').length),1);
   await first.getByRole('button',{name:'Thêm thao tác cho Đầu việc 1',exact:true}).click();assert.deepEqual(await page.getByRole('menuitem').allTextContents(),['Mở media','Xóa Đầu việc 1']);await page.getByRole('menuitem',{name:'Mở media',exact:true}).click();
   const media=page.locator('dialog').filter({has:page.getByRole('button',{name:'Đóng xử lý media',exact:true})});await media.waitFor();assert.equal(await page.evaluate(()=>window.__route),undefined);
   const iframe=media.locator('iframe');assert.match(await iframe.getAttribute('src'),/embedded=1/);
   await page.evaluate(()=>window.postMessage({type:'workspace-target-modal-dirty',dirty:true},location.origin));await media.getByRole('button',{name:'Đóng xử lý media',exact:true}).click();await media.waitFor({state:'hidden'});assert.equal(await confirm.count(),0);
   await first.getByRole('button',{name:'Thêm thao tác cho Đầu việc 1',exact:true}).click();await page.getByRole('menuitem',{name:'Mở media',exact:true}).click();await media.waitFor();
   await page.waitForFunction(()=>document.querySelector('dialog iframe')?.contentDocument?.readyState==='complete');
   await page.evaluate(()=>{window.__dirtySeen=false;const receive=event=>{if(event.source===document.querySelector('dialog iframe')?.contentWindow&&event.data?.type==='workspace-target-modal-dirty'&&event.data.dirty===true){window.__dirtySeen=true;window.removeEventListener('message',receive);}};window.addEventListener('message',receive);});
   await media.frameLocator('iframe').getByRole('button',{name:'Chỉnh sửa mẫu',exact:true}).click();await page.waitForFunction(()=>window.__dirtySeen);await page.keyboard.press('Escape');await confirm.waitFor();
   await page.keyboard.press('Escape');await confirm.waitFor({state:'hidden'});assert.ok(await media.isVisible());
   await media.getByRole('button',{name:'Đóng xử lý media',exact:true}).click();await confirm.getByRole('button',{name:'Bỏ thay đổi và đóng',exact:true}).click();await media.waitFor({state:'hidden'});assert.ok(await work.isVisible());
   await second.getByRole('button',{name:'Thêm thao tác cho Đầu việc 2',exact:true}).click();assert.deepEqual(await page.getByRole('menuitem').allTextContents(),['Xóa Đầu việc 2']);await page.getByRole('menuitem',{name:'Xóa Đầu việc 2',exact:true}).click();await confirm.waitFor();assert.equal(await page.evaluate(()=>window.__actions.filter(a=>a.name==='deletePersonalWorkChecklistItemAction').length),0);
   await confirm.getByRole('button',{name:'Giữ lại',exact:true}).click();assert.equal(await second.count(),1);
   await second.getByRole('button',{name:'Thêm thao tác cho Đầu việc 2',exact:true}).click();await page.getByRole('menuitem',{name:'Xóa Đầu việc 2',exact:true}).click();await confirm.getByRole('button',{name:'Xóa đầu việc',exact:true}).click();await page.waitForFunction(()=>window.__actions.some(a=>a.name==='deletePersonalWorkChecklistItemAction'));assert.equal(await page.evaluate(()=>window.__actions.filter(a=>a.name==='deletePersonalWorkChecklistItemAction').length),1);
   await page.evaluate(()=>{window.__dialogResults=[];window.__dialogApi.confirm({title:'Hỏi thứ nhất',message:'Thứ nhất'}).then(value=>window.__dialogResults.push(value));window.__dialogApi.confirm({title:'Hỏi thứ hai',message:'Thứ hai'}).then(value=>window.__dialogResults.push(value));});
   await page.getByRole('alertdialog',{name:'Hỏi thứ nhất',exact:true}).waitFor();await page.keyboard.press('Escape');const next=page.getByRole('alertdialog',{name:'Hỏi thứ hai',exact:true});await next.waitFor();await page.keyboard.press('Enter');await next.waitFor({state:'hidden'});assert.deepEqual(await page.evaluate(()=>window.__dialogResults),[false,false]);
   await page.goto('http://127.0.0.1:'+server.address().port+'/?view=list&item=item-29');await page.locator('form[role=dialog]').getByRole('button',{name:'Hoàn thành',exact:true}).click();const completeWork=page.getByRole('alertdialog',{name:'Hoàn thành công việc?',exact:true});await completeWork.waitFor();assert.equal(await page.evaluate(()=>window.__actions?.filter(a=>a.name==='updatePersonalWorkAction').length||0),0);await completeWork.getByRole('button',{name:'Bỏ qua',exact:true}).click();
   assert.deepEqual(errors,[]);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.close();
  }
  console.log('PASS actual shared confirmations: safe focus/Enter/cancel, exact-once complete/delete, compact menus, embedded media, dirty-close guard and origin/source filtering at 320/390/1440');
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(error=>{console.error(error);process.exitCode=1;});
