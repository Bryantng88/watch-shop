/* eslint-disable @typescript-eslint/no-require-imports -- Real checklist, title editor and attachments with isolated fixture data. */
const assert=require('node:assert/strict'),fs=require('node:fs/promises'),path=require('node:path'),http=require('node:http');
const {buildFixture}=require('./smoke-work-responsive-ui.cjs');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
(async()=>{
 const root=path.resolve(__dirname,'..'),built=await buildFixture();
 const css=(await require('postcss')([require('tailwindcss')({...require(path.join(root,'tailwind.config.js')),content:[path.join(root,'src/**/*.{ts,tsx}')],corePlugins:{preflight:true}})]).process(await fs.readFile(path.join(root,'src/app/globals.css'),'utf8'),{from:undefined})).css+'\n'+built.css;
 const png=await require('sharp')({create:{width:80,height:60,channels:3,background:'#cbd5e1'}}).png().toBuffer();
 const server=http.createServer((req,res)=>{
  const url=new URL(req.url,'http://fixture');
  if(url.pathname==='/api/admin/personal-work/images'){
   res.setHeader('content-type','application/json');res.end(JSON.stringify({canEdit:!String(req.headers.referer).includes('readonly'),limit:20,items:url.searchParams.has('entryId')?[{id:'fixture-image',name:'Ảnh bố trí bảng hiệu.jpg',state:'READY',url:'/api/admin/personal-work/images/fixture-image'}]:[]}));return;
  }
  if(url.pathname==='/api/admin/personal-work/images/fixture-image'){res.setHeader('content-type','image/png');res.end(png);return;}
  res.setHeader('content-type',url.pathname==='/app.js'?'text/javascript':'text/html;charset=utf-8');res.end(url.pathname==='/app.js'?built.js:`<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${css}body{margin:0;font-family:Arial,sans-serif}</style><div id="root"></div><script src="/app.js"></script>`);
 });await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_EXECUTABLE?{executablePath:process.env.CHROMIUM_EXECUTABLE}:{}),args:['--no-sandbox']});
 try{
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2});
  const page=await context.newPage();page.setDefaultTimeout(12000);const errors=[];page.on('pageerror',error=>errors.push(error.message));
  const origin='http://127.0.0.1:'+server.address().port;
  const titles=['Lắp bảng hiệu','Bàn giao và kiểm tra hệ thống đèn cho quán cà phê CàLab trước ngày khai trương'];
  async function open(scope='OWNER'){
   await page.goto(origin+'/?view=list'+(scope==='VIEWER'?'&readonly=1':''));await page.locator('[data-work-row=item-23]').waitFor();
   await page.evaluate(({scope,titles})=>{window.__fixture={...window.__fixture,items:window.__fixture.items.map(item=>item.id==='item-23'?{...item,title:'Setup quán cà phê CàLab',access:scope,checklist:item.checklist.map((entry,index)=>({...entry,title:titles[index]}))}:item)};window.__renderFixture();},{scope,titles});
   await page.getByRole('button',{name:'Mở CV-23: Setup quán cà phê CàLab',exact:true}).click();await page.getByRole('dialog').waitFor();
  }
  for(const width of [320,360,390,430,768,1440]){
   await page.setViewportSize({width,height:900});await open();
   const dialog=page.getByRole('dialog'),row=dialog.locator('[data-work-checklist-row]').first(),title=row.getByText(titles[0],{exact:true});
   const titleBox=await title.boundingBox();assert.ok(titleBox.width>=100,`title compressed at ${width}: ${titleBox.width}`);assert.ok(titleBox.height<=60,`short title wraps into single-character lines at ${width}`);
   const actions=await row.locator('[data-checklist-actions]').boundingBox(),content=await row.locator('[data-checklist-content]').boundingBox(),images=await row.getByRole('button',{name:`Ảnh đầu việc: ${titles[0]}`,exact:true}).boundingBox();
   assert.ok(actions.y>=content.y+content.height-1,`actions must be below the title at ${width}`);
   const meta=await row.locator("[data-checklist-meta]").boundingBox();assert.ok(Math.abs(images.y-meta.y)<24,`attachment trigger should stay beside the assignee at ${width}`);
   assert.ok(await dialog.evaluate(el=>el.scrollWidth<=el.clientWidth+1),`dialog overflows ${width}`);
   assert.ok(await dialog.locator('[data-work-checklist-row]').evaluateAll(rows=>rows.every(row=>row.scrollWidth<=row.clientWidth+1)),`checklist overflows ${width}`);
   const gallery=row.getByRole('button',{name:`Ảnh đầu việc: ${titles[0]}`,exact:true});assert.equal((await gallery.innerText()).trim(),'');await gallery.click();
   await row.getByRole('img',{name:'Ảnh bố trí bảng hiệu.jpg',exact:true}).waitFor();assert.ok(await row.evaluate(el=>el.scrollWidth<=el.clientWidth+1),`expanded gallery overflows ${width}`);
   await row.getByRole('button',{name:`Ảnh đầu việc: ${titles[0]} (1)`,exact:true}).click();await row.getByRole('img',{name:'Ảnh bố trí bảng hiệu.jpg',exact:true}).waitFor({state:'hidden'});
  }
  await page.setViewportSize({width:360,height:800});await open('EDITOR');let row=page.getByRole('dialog').locator('[data-work-checklist-row]').first();
  await row.getByRole('button',{name:`Thêm thao tác cho ${titles[0]}`,exact:true}).click();await page.getByRole('menuitem',{name:`Sửa ${titles[0]}`,exact:true}).click();const input=row.getByRole('textbox',{name:'Tên đầu việc',exact:true});assert.ok((await input.boundingBox()).width>=100,'mobile title editor is squeezed');await input.fill('Lắp bảng hiệu trước cửa');await row.getByRole('button',{name:'Lưu đầu việc',exact:true}).click();await row.getByText('Lắp bảng hiệu trước cửa',{exact:true}).waitFor();assert.ok(await page.evaluate(()=>window.__actions.some(action=>action.name==='renamePersonalWorkChecklistItemAction'&&action.input.title==='Lắp bảng hiệu trước cửa')));
  await row.getByRole('button',{name:'Hoàn thành Lắp bảng hiệu trước cửa',exact:true}).click();await row.getByRole('button',{name:'Mở lại Lắp bảng hiệu trước cửa',exact:true}).waitFor();
  await page.setViewportSize({width:390,height:844});await open('EDITOR');await fs.mkdir(process.env.WORK_CHECKLIST_SHOTS||'/tmp/work-checklist-mobile',{recursive:true});await page.screenshot({path:path.join(process.env.WORK_CHECKLIST_SHOTS||'/tmp/work-checklist-mobile','checklist-mobile.png'),fullPage:false});
  await page.evaluate(()=>document.documentElement.style.fontSize='20px');row=page.getByRole('dialog').locator('[data-work-checklist-row]').first();assert.ok((await row.getByText(titles[0],{exact:true}).boundingBox()).width>=100,'larger phone font compresses the title');assert.ok(await page.getByRole('dialog').evaluate(el=>el.scrollWidth<=el.clientWidth+1),'larger phone font overflows');
  await open('VIEWER');row=page.getByRole('dialog').locator('[data-work-checklist-row]').first();assert.equal(await row.getByRole('button',{name:`Sửa ${titles[0]}`,exact:true}).count(),0);assert.equal(await row.getByRole('button',{name:`Xóa ${titles[0]}`,exact:true}).count(),0);assert.ok(await row.getByRole('button',{name:`Hoàn thành ${titles[0]}`,exact:true}).isDisabled());await row.getByRole('button',{name:`Ảnh đầu việc: ${titles[0]}`,exact:true}).click();await row.getByRole('img').last().waitFor();assert.equal(await row.getByRole('button',{name:'Thêm ảnh',exact:true}).count(),0);assert.deepEqual(errors,[]);
  console.log('PASS real checklist + attachment mobile layout: 320–1440px, short/long titles, owner/editor/viewer, expanded images, larger fonts, rename payload and completion');
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(error=>{console.error(error);process.exitCode=1});
