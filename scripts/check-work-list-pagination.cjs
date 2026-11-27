/* eslint-disable @typescript-eslint/no-require-imports -- Real work UI with synthetic page action transport. */
const assert=require('node:assert/strict'),http=require('node:http'),fs=require('node:fs/promises'),path=require('node:path');
const {buildFixture}=require('./smoke-work-responsive-ui.cjs');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
(async()=>{
 const root=path.resolve(__dirname,'..'),built=await buildFixture();
 const css=(await require('postcss')([require('tailwindcss')({...require(path.join(root,'tailwind.config.js')),content:[path.join(root,'src/**/*.{ts,tsx}')],corePlugins:{preflight:true}})]).process(await fs.readFile(path.join(root,'src/app/globals.css'),'utf8'),{from:undefined})).css+'\n'+built.css;
 const server=http.createServer((req,res)=>{res.setHeader('content-type','text/html; charset=utf-8');res.end(`<meta name="viewport" content="width=device-width,initial-scale=1"><style>${css}body{margin:0}</style><div id="root"></div><script>${built.js.replace(/<\/script/gi,'<\\/script')}</script>`)});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({headless:true});
 try{
 const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const origin='http://127.0.0.1:'+server.address().port;
 await page.goto(origin+'/?full=1&pagination=1');
 await page.waitForFunction(()=>document.querySelectorAll('[data-work-row]').length===30);
 const list=page.getByRole('list',{name:'Công việc',exact:true});
 const initialHeight=await list.evaluate(el=>el.clientHeight);const bodyHeight=await page.evaluate(()=>document.documentElement.scrollHeight);assert.ok(initialHeight>=280&&initialHeight<=680);assert.ok(await list.evaluate(el=>el.scrollHeight>el.clientHeight));
 const nav=page.getByRole('navigation',{name:'Hiển thị công việc',exact:true});
 assert.equal(await nav.getByRole('button',{name:'Hôm nay 88',exact:true}).isVisible(),true);
 assert.equal(await nav.getByRole('button',{name:'Tất cả 88',exact:true}).isVisible(),true);
 assert.equal(await nav.getByRole('button',{name:'Đã xong 8',exact:true}).isVisible(),true);
 await page.evaluate(()=>window.__pageFail=true);
 await list.evaluate(el=>{el.scrollTop=el.scrollHeight;});
 await page.getByRole('alert').filter({hasText:'Không tải được danh sách'}).waitFor();
 assert.equal(await page.locator('[data-work-row]').count(),30);
 await page.evaluate(()=>window.__pageFail=false);
 await page.getByRole('button',{name:'Thử lại',exact:true}).click();
 await page.waitForFunction(()=>document.querySelectorAll('[data-work-row]').length===60);
 assert.equal(await nav.getByRole('button',{name:'Tất cả 88',exact:true}).innerText(),'Tất cả\n88');assert.equal(await list.evaluate(el=>el.clientHeight),initialHeight);assert.ok(Math.abs(await page.evaluate(()=>document.documentElement.scrollHeight)-bodyHeight)<3);
 await list.evaluate(el=>{el.scrollTop=el.scrollHeight;});
 await page.waitForFunction(()=>document.querySelectorAll('[data-work-row]').length===88);
 const ids=await page.locator('[data-work-row]').evaluateAll(rows=>rows.map(row=>row.dataset.workRow));assert.equal(new Set(ids).size,88);
 const last=page.locator('[data-work-row]').last();await last.scrollIntoViewIfNeeded();const scroll=await page.evaluate(()=>scrollY);const listScroll=await list.evaluate(el=>el.scrollTop);
 await last.getByRole('button',{name:/^Mở CV/}).click();await page.getByRole('dialog').waitFor();
 await page.getByRole('button',{name:'Đóng',exact:true}).click();assert.equal(await page.locator('[data-work-row]').count(),88);assert.ok(Math.abs(await page.evaluate(()=>scrollY)-scroll)<100);assert.ok(Math.abs(await list.evaluate(el=>el.scrollTop)-listScroll)<3);
 // Refresh keeps all loaded pages, rather than collapsing to the first 30.
 await page.evaluate(()=>{window.__fixture={...window.__fixture,items:[...window.__fixture.items]};window.__renderFixture();});
 await page.waitForFunction(()=>window.__actions.filter(x=>x.name==='loadPersonalWorkPageAction').length>=7);
 await page.getByText('Đã hiển thị 88 công việc',{exact:true}).waitFor();
 await nav.getByRole('button',{name:'Đã xong 8',exact:true}).click();await page.waitForFunction(()=>document.querySelectorAll('[data-work-row]').length===8);assert.equal(await list.evaluate(el=>el.scrollTop),0);
 await page.evaluate(()=>window.__pageDelay=400);
 await nav.getByRole('button',{name:'Tất cả 88',exact:true}).click();
 await nav.getByRole('button',{name:'Đã xong 8',exact:true}).click();
 await page.waitForTimeout(600);assert.equal(await page.locator('[data-work-row]').count(),8);
 await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 assert.ok(await list.evaluate(el=>el.clientHeight<=window.innerHeight));
 for(const width of [390,320]){
  await page.setViewportSize({width,height:844});await page.goto(origin+'/?view=list&pagination=1');await page.waitForFunction(()=>document.querySelectorAll('[data-work-row]').length===30);
  const pane=page.getByRole('list',{name:'Công việc',exact:true}),height=await pane.evaluate(el=>el.clientHeight),documentHeight=await page.evaluate(()=>document.documentElement.scrollHeight);
  assert.ok(height>=280&&height<=680);await pane.evaluate(el=>{el.scrollTop=el.scrollHeight;});await page.waitForFunction(()=>document.querySelectorAll('[data-work-row]').length===60);
  assert.equal(await pane.evaluate(el=>el.clientHeight),height);assert.ok(Math.abs(await page.evaluate(()=>document.documentElement.scrollHeight)-documentHeight)<3);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 }
 assert.deepEqual(errors,[]);console.log('PASS real work pagination: bounded internal scroll 30/60/88 without growing the page, exact full counts, automatic load, retry, no duplicates, filter races, refresh depth and detail scroll return');
 }finally{await browser.close();await new Promise(r=>server.close(r));}
})().catch(error=>{console.error(error);process.exitCode=1;});
