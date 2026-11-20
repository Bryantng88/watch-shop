/* eslint-disable @typescript-eslint/no-require-imports -- Standalone browser fixture. */
const assert=require('node:assert/strict'),fs=require('node:fs/promises'),path=require('node:path'),http=require('node:http');
const esbuild=require('./lib/admin-fixture-esbuild.cjs');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
(async()=>{
 const root=path.resolve(__dirname,'..');
 const entry=`import React from'react';import{createRoot}from'react-dom/client';import Workspace from'./src/domains/trading/client/TradingWorkspace';import{tradingEntries}from'./src/domains/trading/shared/trading-navigation';import{PERMISSIONS as P}from'./src/constants/permissions';import{operationalDomainPresentation}from'./src/domains/shared/ui/signals/operational-domain-presentation';import{Truck}from'lucide-react';
window.__entries={none:tradingEntries({permissions:[]}),order:tradingEntries({permissions:[P.ORDER_VIEW]}),accessory:tradingEntries({permissions:[P.ACCESSORY_ACQUISITION_VIEW]}),admin:tradingEntries({permissions:[],roles:['ADMIN']})};window.__truck=operationalDomainPresentation('shipment-operation-flow').icon===Truck;
const orders=location.pathname.includes('orders');createRoot(document.getElementById('root')).render(<Workspace entries={window.__entries.admin} selected={orders?'/admin/orders':'/admin/acquisitions'}><h2>{orders?'Đơn hàng':'Phiếu nhập'}</h2><label>Bản sửa<input id="draft" defaultValue="Giữ nguyên"/></label></Workspace>);`;
 const result=await esbuild.build({stdin:{contents:entry,loader:'tsx',resolveDir:root},bundle:true,write:false,platform:'browser',jsx:'automatic',plugins:[{name:'ports',setup(build){build.onResolve({filter:/^next\/navigation$/},()=>({path:'router',namespace:'ports'}));build.onLoad({filter:/.*/,namespace:'ports'},()=>({contents:'export const useSearchParams=()=>new URLSearchParams(location.search);'}));}}]});
 const css=await fs.readFile(process.env.TRADING_UI_CSS||'/tmp/admin-buttons-global.css','utf8');
 const server=http.createServer((req,res)=>{res.setHeader('content-type',req.url==='/app.js'?'text/javascript':'text/html;charset=utf-8');res.end(req.url==='/app.js'?result.outputFiles.find(f=>f.path.endsWith('.js')).text:`<html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>${css}body{margin:0}</style></head><body><div id="root" class="admin-ui"></div><script src="/app.js"></script></body></html>`)});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_EXECUTABLE?{executablePath:process.env.CHROMIUM_EXECUTABLE}:{}),args:['--no-sandbox']});
 try{const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const route of ['/admin/orders?view=processing&q=rolex&page=4&sort=updatedAsc&subFilter=shipping','/admin/acquisitions?status=DRAFT&q=omega&vendorId=v1&page=3']){
  for(const width of [320,390,768,1024,1440]){
   await page.setViewportSize({width,height:1000});await page.goto(origin+route);await page.getByRole('heading',{name:'Mua bán',exact:true}).waitFor();
   assert.equal(await page.locator('h1').count(),1);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   assert.equal(await page.evaluate(()=>window.__truck),true);assert.deepEqual(await page.evaluate(()=>window.__entries.none),[]);assert.equal(await page.evaluate(()=>window.__entries.order[0].href),'/admin/orders');assert.equal(await page.evaluate(()=>window.__entries.accessory[0].href),'/admin/acquisitions');
   const orders=route.includes('orders');const status=page.getByRole('navigation',{name:orders?'Trạng thái đơn hàng':'Trạng thái phiếu nhập'});const target=status.locator('a').filter({hasText:orders?'Hoàn tất':'Đã nhập kho'});const url=new URL(await target.getAttribute('href'),origin);
   assert.equal(url.searchParams.get('q'),orders?'rolex':'omega');assert.equal(url.searchParams.has('page'),false);assert.equal(url.searchParams.get(orders?'view':'status'),orders?'completed':'POSTED');assert.equal(url.searchParams.has('subFilter'),false);if(!orders)assert.equal(url.searchParams.get('vendorId'),'v1');
   if(width>=1024){const selectedStatus=page.locator('nav[aria-label^="Trạng thái"] a[aria-current="page"]');assert.equal(await selectedStatus.evaluate(el=>getComputedStyle(el).fontSize),'13px');await page.getByLabel('Bản sửa').fill('Bản sửa đang mở');const line=page.getByRole('separator');await line.focus();await page.keyboard.press('ArrowRight');assert.equal(await page.getByLabel('Bản sửa').inputValue(),'Bản sửa đang mở');assert.equal(await page.getByRole('navigation',{name:'Khu vực mua bán'}).locator('[aria-current="page"]').getAttribute('href'),orders?'/admin/orders':'/admin/acquisitions');}
   else{assert.ok(await page.getByRole('combobox',{name:'Khu vực mua bán',exact:true}).isVisible());await page.getByRole('combobox',{name:orders?'Trạng thái đơn hàng':'Trạng thái phiếu nhập'}).selectOption(await target.getAttribute('href'));await page.waitForURL(url.href);}
   if(width===1440&&orders){await page.evaluate(()=>document.activeElement?.blur());const output=process.env.TRADING_UI_SCREENSHOT||'/tmp/trading-workspace.png';await fs.mkdir(path.dirname(output),{recursive:true});await page.screenshot({path:output,fullPage:true});}
  }
 }
 assert.deepEqual(errors,[]);console.log('PASS trading workspace: permission-aware entries, Truck icon, one title, route/status links preserve filters and reset paging, native narrow selection, resize retains content, no overflow 320–1440px. Synthetic navigation/data only.');
 }finally{await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1});
