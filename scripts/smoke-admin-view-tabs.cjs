// Exercise the shared production component with local controlled state only.
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const path=require('node:path');
const http=require('node:http');
const esbuild=require('./lib/admin-fixture-esbuild.cjs');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
async function main(){
 const root=path.resolve(__dirname,'..');const dir='/tmp/admin-view-tabs';await fs.mkdir(dir,{recursive:true});
 const entry=`import React,{useState} from 'react';import {createRoot} from 'react-dom/client';import {AdminViewTabs} from './src/domains/shared/ui/admin-design-contract/AdminViewTabs';
const work=[['TODAY','Hôm nay'],['OVERDUE','Quá hạn'],['UPCOMING','Sắp tới'],['ALL','Tất cả'],['EVENTS','Sự kiện'],['DONE','Đã xong']].map(([value,label])=>({value,label}));
const chart=[{value:'all',label:'Tất cả'},{value:'waiting',label:'Chờ xử lý'},{value:'active',label:'Đang xử lý'}];
function Demo(){const [view,setView]=useState('TODAY');const [state,setState]=useState('all');const [type,setType]=useState('task');const [disabled,setDisabled]=useState(false);window.__disableActive=()=>setDisabled(true);return <main style={{padding:20,fontFamily:'Arial,sans-serif'}}><h1>Tab dùng chung · Dữ liệu mẫu</h1><section style={{margin:'20px 0'}}><h2>Công việc</h2><AdminViewTabs label="Hiển thị công việc" items={work} value={view} onValueChange={setView}/><p data-work>{view}</p></section><section style={{maxWidth:360,margin:'20px 0'}}><h2>Biểu đồ điều hành</h2><AdminViewTabs label="Trạng thái biểu đồ" items={chart.map(item=>({...item,disabled:disabled&&item.value==='active'}))} value={state} onValueChange={setState}/><p data-chart>{state}</p></section><section style={{maxWidth:200,margin:'20px 0'}}><h2>Tạo mục</h2><AdminViewTabs label="Kiểu mục" items={[{value:'task',label:'Công việc'},{value:'event',label:'Sự kiện'}]} value={type} onValueChange={setType}/><p data-type>{type}</p></section></main>};createRoot(document.getElementById('root')).render(<Demo/>);`;
 await esbuild.build({stdin:{contents:entry,loader:'tsx',resolveDir:root},outfile:path.join(dir,'app.js'),bundle:true,platform:'browser',jsx:'automatic',define:{'process.env.NODE_ENV':'"production"'}});
 const js=await fs.readFile(path.join(dir,'app.js'),'utf8');const css=await fs.readFile(process.env.WORK_RESPONSIVE_CSS||'/tmp/work-responsive.css','utf8');
 const server=http.createServer((req,res)=>{res.setHeader('content-type',req.url==='/app.js'?'text/javascript':'text/html');res.end(req.url==='/app.js'?js:`<!doctype html><html lang="vi"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0}button,select{font-family:inherit}${css}</style><div id="root"></div><script src="/app.js"></script></html>`)});await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({headless:true,args:['--no-sandbox'],...(process.env.CHROMIUM_EXECUTABLE?{executablePath:process.env.CHROMIUM_EXECUTABLE}:{})});
 try{
 const page=await browser.newPage({viewport:{width:1000,height:900}});const errors=[];page.on('pageerror',error=>{errors.push(error.message);console.error(error.message)});await page.goto('http://127.0.0.1:'+server.address().port);
 const work=page.getByRole('group',{name:'Hiển thị công việc',exact:true});const chart=page.getByRole('group',{name:'Trạng thái biểu đồ',exact:true});
 await work.getByRole('button',{name:'Hôm nay',exact:true}).waitFor();await work.getByRole('button',{name:'Sự kiện',exact:true}).click();assert.equal(await page.locator('[data-work]').textContent(),'EVENTS');
 await work.getByRole('button',{name:'Sự kiện',exact:true}).focus();await page.keyboard.press('End');assert.equal(await page.locator('[data-work]').textContent(),'DONE');await page.keyboard.press('Home');assert.equal(await page.locator('[data-work]').textContent(),'TODAY');
 await chart.getByRole('button',{name:'Chờ xử lý',exact:true}).click();assert.equal(await page.locator('[data-chart]').textContent(),'waiting');await page.keyboard.press('ArrowRight');assert.equal(await page.locator('[data-chart]').textContent(),'active');await page.keyboard.press('ArrowRight');assert.equal(await page.locator('[data-chart]').textContent(),'all');
 await page.evaluate(()=>window.__disableActive());await chart.getByRole('button',{name:'Chờ xử lý',exact:true}).focus();await page.keyboard.press('ArrowRight');assert.equal(await page.locator('[data-chart]').textContent(),'all');assert.ok(await chart.getByRole('button',{name:'Đang xử lý',exact:true}).isDisabled());
 const appearance=await chart.getByRole('button',{name:'Tất cả',exact:true}).evaluate(button=>({shadow:getComputedStyle(button).boxShadow,background:getComputedStyle(button).backgroundColor,underline:getComputedStyle(button,'::after').height}));assert.equal(appearance.shadow,'none');assert.equal(appearance.background,'rgba(0, 0, 0, 0)');assert.equal(appearance.underline,'2px');
 await page.screenshot({path:path.join(dir,'shared-tabs-desktop.png'),fullPage:true});
 for(const width of [390,320]){await page.setViewportSize({width,height:900});const select=page.getByRole('combobox',{name:'Hiển thị công việc',exact:true});await select.waitFor();await select.selectOption('EVENTS');assert.equal(await page.locator('[data-work]').textContent(),'EVENTS');assert.ok(await chart.isVisible());await page.getByRole('group',{name:'Kiểu mục',exact:true}).getByRole('button',{name:'Sự kiện',exact:true}).click();assert.equal(await page.locator('[data-type]').textContent(),'event');assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.screenshot({path:path.join(dir,'shared-tabs-'+width+'.png'),fullPage:true});}
 await page.setViewportSize({width:1000,height:900});await work.getByRole('button',{name:'Sự kiện',exact:true}).waitFor();assert.equal(await work.getByRole('button',{name:'Sự kiện',exact:true}).getAttribute('aria-pressed'),'true');assert.deepEqual(errors,[]);
 console.log('Shared tabs passed: 2/3/6 options, view changes, keyboard, disabled, underline, responsive select, retained state, 320/390px overflow.');
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
}
main().catch(error=>{console.error(error);process.exitCode=1});

