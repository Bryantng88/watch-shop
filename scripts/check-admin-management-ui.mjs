// Render the real directory/library/editor with synthetic HTTP and provider ports.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import esbuild from 'esbuild';
import postcss from 'postcss';
import tailwind from 'tailwindcss';
const require=createRequire(import.meta.url);
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const entry=`import React from'react';import{createRoot}from'react-dom/client';import Contacts from'./src/domains/contacts/client/ContactDirectory';import Library from'./src/domains/storefront/media/WebsiteMediaLibrary';import Home from'./src/domains/storefront/content/StorefrontManager';import Sidebar from'./src/app/(admin)/admin/_client/AdmidSideBar';const readOnly=new URLSearchParams(location.search).has('readonly');const navParams=new URLSearchParams(location.search);const view=navParams.has('navigation')?<Sidebar variant={navParams.has('mobile')?'mobile':'desktop'} user={navParams.has('customerOnly')?{roles:[],permissions:['CUSTOMER_VIEW']}:{roles:['ADMIN'],permissions:[]}}/>:location.pathname.includes('/storefront/home')?<Home homeOnly/>:location.pathname.includes('/storefront/media')?<Library/>:<Contacts kind={location.pathname.includes('/vendors')?'vendors':'customers'} canCreate={!readOnly} canUpdate={!readOnly}/>;createRoot(document.getElementById('root')).render(view);`;
const bundle=await esbuild.build({stdin:{contents:entry,loader:'tsx',resolveDir:root},bundle:true,platform:'browser',jsx:'automatic',write:false,outfile:'/tmp/admin-management-fixture.js',define:{'process.env.NODE_ENV':'"production"'},plugins:[{name:'boundaries',setup(build){
 build.onResolve({filter:/^next\/(link|navigation)$/},({path:p})=>({path:p,namespace:'next-fixture'}));
 build.onLoad({filter:/.*/,namespace:'next-fixture'},({path:p})=>({loader:'tsx',resolveDir:root,contents:p.endsWith('navigation')?`export const usePathname=()=>'/admin/customers';`:`import React from'react';export const useLinkStatus=()=>({pending:false});export default function Link({onNavigate,onClick,...p}){return <a {...p} onClick={e=>{onClick?.(e);e.preventDefault();onNavigate?.()}}/>}`}));
 build.onResolve({filter:/^next\/image$/},()=>({path:'image',namespace:'fixture'}));
 build.onResolve({filter:/AppDialogProvider$/},()=>({path:'dialog',namespace:'fixture'}));
 build.onResolve({filter:/AppToastProvider$/},()=>({path:'toast',namespace:'fixture'}));
 build.onLoad({filter:/.*/,namespace:'fixture'},({path:name})=>({loader:'tsx',resolveDir:root,contents:name==='image'?`import React from'react';export default function Image({unoptimized,...p}){return <img {...p}/>} `:name==='dialog'?`const api={confirm:async()=>window.__confirm!==false};export const useAppDialog=()=>api;`:`const notify={success(){},error(message){window.__notification=message}};export const useNotify=()=>notify;`}));
 build.onResolve({filter:/^@\//},async({path:p})=>{if(p==='@/domains/shared/ui/admin-design-contract')return{path:path.join(root,'src/domains/shared/ui/admin-design-contract/AdminPage.tsx')};for(const suffix of ['.tsx','.ts','/index.ts']){const file=path.join(root,p.replace(/^@\//,'src/'))+suffix;try{await fs.access(file);return{path:file}}catch{}}return null;});
}}]});
const css=(await postcss([tailwind({content:[path.join(root,'src/**/*.{ts,tsx}')],corePlugins:{preflight:true}})]).process(await fs.readFile(path.join(root,'src/app/globals.css'),'utf8'),{from:undefined})).css+'\n'+bundle.outputFiles.find(f=>f.path.endsWith('.css')).text;
const javascript=bundle.outputFiles.find(f=>f.path.endsWith('.js')).text;
const contract=await esbuild.build({entryPoints:[path.join(root,'src/domains/storefront/content/contract.ts')],bundle:true,platform:'node',format:'cjs',write:false});const m={exports:{}};vm.runInNewContext(contract.outputFiles[0].text,{module:m,exports:m.exports,require});
let home={id:'home',kind:'HOME',draft:JSON.parse(JSON.stringify(m.exports.defaultHome())),revision:0,publishedAt:null};
const initial=Array.from({length:31},(_,i)=>({id:String(i+1),name:i===0?'Khách hàng thử nghiệm có tên dài để kiểm tra bố cục':`Liên hệ mẫu ${i+1}`,phone:`090000${String(i).padStart(4,'0')}`,email:'fixture@example.invalid',address:'Địa chỉ thử nghiệm',updatedAt:'2026-11-19T00:00:00.000Z'}));
const writes=[];let failSave=false,failUpload=false,libraryVersion=0;
const asset=(folder,n)=>({key:`storefront/${folder}/fixture-${n}.webp`,name:`fixture-${n}.webp`,url:'/image.svg?v='+libraryVersion,sizeBytes:1024});
const server=http.createServer(async(req,res)=>{
 const url=new URL(req.url,'http://local');const send=(json,status=200)=>{res.statusCode=status;res.setHeader('Content-Type','application/json');res.end(JSON.stringify(json))};
 if(url.pathname==='/api/admin/contacts'){
  if(req.method==='POST'){let raw='';for await(const chunk of req)raw+=chunk;const input=JSON.parse(raw);if(failSave){failSave=false;return send({error:'Thông tin đã thay đổi ở nơi khác.'},409)}writes.push(input);const item={...input,id:input.id||'new',updatedAt:new Date().toISOString()};return send({item})}
  const q=url.searchParams.get('q')||'',page=Number(url.searchParams.get('page')||1);const rows=initial.filter(i=>!q||i.name.includes(q)||i.phone.includes(q));return send({items:rows.slice((page-1)*30,page*30),total:rows.length,page,pageSize:30});
 }
 if(url.pathname==='/api/admin/storefront/media/library'){
  const key=url.searchParams.get('key');if(key)return send({item:{key,name:'Ảnh cũ ngoài trang đầu',url:'/image.svg'}});
  const folder=url.searchParams.get('folder')||'editorial';return send({items:url.searchParams.has('cursor')?[asset(folder,3)]:[asset(folder,1),asset(folder,2)],nextCursor:url.searchParams.has('cursor')?null:'next',truncated:!url.searchParams.has('cursor')});
 }
 if(url.pathname==='/api/admin/storefront/media'){
  if(req.method==='POST'){const chunks=[];for await(const chunk of req)chunks.push(chunk);const form=await new Response(Buffer.concat(chunks),{headers:{'content-type':req.headers['content-type']}}).formData();if(failUpload){failUpload=false;return send({error:'Tải ảnh thất bại.'},400)}writes.push({uploadFolder:form.get('folder')});libraryVersion++;return send({item:asset(String(form.get('folder')||'editorial'),9)})}
  return send({items:[asset('editorial',1),asset('hero',1)],truncated:false});
 }
 if(url.pathname==='/api/admin/storefront/content'){if(req.method==='POST'){let raw='';for await(const c of req)raw+=c;const input=JSON.parse(raw);writes.push(input);home={...home,draft:input.content,revision:home.revision+1};return send({record:home})}return send({record:home,articles:[]})}
 if(url.pathname.startsWith('/api/admin/storefront/products'))return send({items:[]});
 if(url.pathname==='/image.svg'){res.setHeader('Content-Type','image/svg+xml');return res.end('<svg xmlns="http://www.w3.org/2000/svg" width="320" height="240"><rect width="320" height="240" fill="#f1f5f9"/></svg>')}
 res.setHeader('Content-Type','text/html');res.end('<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"><style>:root{--font-geist-sans:Arial}'+css+'</style></head><body><div class="admin-ui" id="root"></div><script>'+javascript+'</script></body></html>');
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const url='http://127.0.0.1:'+server.address().port;let browser;
try{
 browser=await chromium.launch({headless:true,...(process.env.BEN_PWA_CHROMIUM?{executablePath:process.env.BEN_PWA_CHROMIUM}:{})});
 const page=await browser.newPage({viewport:{width:1280,height:1000}});page.on('dialog',dialog=>dialog.accept());const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url+'/admin/customers');await page.getByRole('list',{name:'Danh sách liên hệ'}).waitFor();assert.equal(await page.getByRole('listitem').count(),30);
 await page.getByRole('button',{name:'Sau',exact:true}).click();await page.getByText('Trang 2 / 2',{exact:true}).waitFor();assert.equal(await page.getByRole('listitem').count(),1);
 await page.getByRole('searchbox',{name:'Tìm tên, điện thoại hoặc email'}).fill('0900000000');await page.getByRole('button',{name:'Tìm',exact:true}).click();await page.getByText('Trang 1 / 1',{exact:true}).waitFor();assert.equal(await page.getByRole('listitem').count(),1);
 await page.getByRole('button',{name:/^Sửa Khách hàng thử nghiệm/}).click();const form=page.getByRole('form',{name:'Sửa liên hệ'});await form.getByLabel('Tên liên hệ',{exact:true}).fill('Tên sửa chưa lưu');
 assert.deepEqual(await form.getByLabel('Tên liên hệ',{exact:true}).evaluate(el=>{const s=getComputedStyle(el);return[s.borderRadius,s.fontSize,s.minHeight]}),['8px','14px','40px']);
 failSave=true;await form.getByRole('button',{name:'Lưu liên hệ'}).click();await page.getByRole('alert').filter({hasText:'Thông tin đã thay đổi'}).waitFor();assert.equal(await form.getByLabel('Tên liên hệ',{exact:true}).inputValue(),'Tên sửa chưa lưu');
 await page.evaluate(()=>{window.__confirm=false});await form.getByRole('button',{name:'Hủy',exact:true}).click();assert.equal(await form.isVisible(),true);
 await form.getByRole('button',{name:'Lưu liên hệ'}).click();await page.getByRole('status').filter({hasText:'Đã lưu thông tin'}).waitFor();assert.equal(writes.filter(i=>i.name==='Tên sửa chưa lưu').length,1);
 await page.goto(url+'/admin/vendors?readonly');await page.getByRole('list',{name:'Danh sách liên hệ'}).waitFor();assert.equal(await page.getByRole('button',{name:/Thêm vendor|^Sửa /}).count(),0);
 await page.goto(url+'/admin/storefront/media');await page.getByRole('button',{name:'Tải ảnh lên',exact:true}).waitFor();await page.locator('figure').first().waitFor();assert.equal(await page.locator('figure').count(),2);
 await page.getByRole('button',{name:'Tải thêm ảnh'}).click();await page.waitForFunction(()=>document.querySelectorAll('figure').length===3);
 await page.getByRole('button',{name:'Ảnh mở đầu / Hero',exact:true}).click();await page.waitForFunction(()=>document.querySelector('a[href*="libraryImage="]')?.getAttribute('href').includes('hero'));
 failUpload=true;await page.getByLabel('Chọn ảnh tải lên website').setInputFiles({name:'fixture.png',mimeType:'image/png',buffer:Buffer.from('fixture')});await page.getByRole('alert').filter({hasText:'Tải ảnh thất bại.'}).waitFor();await page.getByRole('button',{name:'Tải ảnh lên',exact:true}).waitFor();assert.equal(await page.getByRole('alert').filter({hasText:'Tải ảnh thất bại.'}).isVisible(),true);
 await page.getByLabel('Chọn ảnh tải lên website').setInputFiles({name:'fixture.png',mimeType:'image/png',buffer:Buffer.from('fixture')});await page.getByRole('status').filter({hasText:'Đã tải 1 ảnh.'}).waitFor();assert.ok(writes.some(i=>i.uploadFolder==='hero'));
 await page.getByRole('button',{name:'Tải thêm ảnh'}).click();await page.waitForFunction(()=>document.querySelectorAll('figure').length===3);await page.getByRole('link',{name:'Dùng trên Home',exact:true}).last().click();await page.getByRole('heading',{name:'Trang chủ website',exact:true}).waitFor();await page.getByRole('combobox',{name:'Chọn Ảnh desktop',exact:true}).getByRole('option',{name:'Ảnh cũ ngoài trang đầu'}).waitFor({state:'attached'});
 const before=writes.length;await page.getByLabel('Tông màu khối mở đầu').selectOption('charcoal');await page.evaluate(()=>window.dispatchEvent(new Event('focus')));await page.waitForTimeout(100);assert.equal(await page.getByLabel('Tông màu khối mở đầu').inputValue(),'charcoal');assert.equal(writes.length,before,'library selection/focus never saves or publishes');
 await page.goto(url+'/admin/customers');await page.getByRole('list',{name:'Danh sách liên hệ'}).waitFor();
 for(const width of [320,390,768,1280,1440]){
  await page.setViewportSize({width,height:1000});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'contacts overflow '+width);
  if(process.env.MANAGEMENT_SCREENSHOT_DIR){await fs.mkdir(process.env.MANAGEMENT_SCREENSHOT_DIR,{recursive:true});await page.screenshot({path:path.join(process.env.MANAGEMENT_SCREENSHOT_DIR,'contacts-'+width+'.png'),fullPage:true})}
 }
 await page.goto(url+'/admin/storefront/media');await page.locator('figure').first().waitFor();
 for(const width of [320,390,768,1280,1440]){await page.setViewportSize({width,height:1000});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'media overflow '+width);if(process.env.MANAGEMENT_SCREENSHOT_DIR)await page.screenshot({path:path.join(process.env.MANAGEMENT_SCREENSHOT_DIR,'media-'+width+'.png'),fullPage:true})}
 await page.setViewportSize({width:1280,height:1000});await page.addInitScript(()=>localStorage.setItem('admin-sidebar:expanded','true'));
 await page.goto(url+'/admin/customers?navigation');const nav=page.getByRole('navigation',{name:'Điều hướng quản trị'});await nav.getByRole('link',{name:'Khách hàng',exact:true}).waitFor();await nav.getByRole('link',{name:'Nhà cung cấp / Vendor',exact:true}).waitFor();await nav.getByRole('link',{name:'Thư viện ảnh website',exact:true}).waitFor();
 await page.getByRole('button',{name:'Thu gọn thanh điều hướng',exact:true}).click();await page.waitForFunction(()=>document.querySelector('aside').getBoundingClientRect().width===76);assert.equal(await nav.getByRole('link',{name:'Thư viện ảnh website',exact:true}).getAttribute('title'),'Thư viện ảnh website');
 await page.goto(url+'/admin/customers?navigation&customerOnly');await nav.getByRole('link',{name:'Khách hàng',exact:true}).waitFor();assert.equal(await nav.getByRole('link',{name:'Nhà cung cấp / Vendor',exact:true}).count(),0);assert.equal(await nav.getByRole('link',{name:'Thư viện ảnh website',exact:true}).count(),0);
 await page.setViewportSize({width:390,height:844});await page.goto(url+'/admin/customers?navigation&mobile');await page.getByRole('button',{name:'Menu',exact:true}).click();await nav.getByRole('link',{name:'Thư viện ảnh website',exact:true}).waitFor();
 const touch=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});const touchPage=await touch.newPage();await touchPage.goto(url+'/admin/customers');await touchPage.getByRole('button',{name:'Thêm khách hàng',exact:true}).click();assert.ok(await touchPage.getByRole('button',{name:'Lưu liên hệ'}).evaluate(el=>el.getBoundingClientRect().height>=44));assert.equal(await touchPage.getByLabel('Tên liên hệ',{exact:true}).evaluate(el=>getComputedStyle(el).fontSize),'16px');await touch.close();
 assert.deepEqual(errors,[]);console.log('PASS real management clients: contact paging/search/edit failure+retry/dirty guards/read-only; website folders/paging/upload errors+retry/Home handoff; focus keeps draft and sends no publication; 320/390/768/1280/1440 layouts with real shared/global CSS. Synthetic API/providers only.');
}finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve))}
