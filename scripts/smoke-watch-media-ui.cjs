// Real media form and daily-work dialog. Only section internals, auth/actions and providers are fixture ports.
const assert=require('node:assert/strict'),fs=require('node:fs/promises'),http=require('node:http'),path=require('node:path'),esbuild=require('esbuild');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
(async()=>{
 const root=path.resolve(__dirname,'..');
 const entry=`import React,{useState,useEffect} from 'react';import {createRoot} from 'react-dom/client';import Form from './src/domains/watch/client/WatchFormClient';
function App(){const [state,setState]=useState(null);useEffect(()=>{fetch('/fixture/read').then(r=>r.json()).then(setState)},[]);if(!state)return <p>Đang tải</p>;return <Form detail={state.detail} brands={[]} vendors={[]} categories={[]} canReviewContent={false} initialMediaWorkDone={state.parts} initialMediaWorkspaceContext={{bindingId:'binding',workTypeKey:'media-processing',workflowState:'NEW'}}/>}createRoot(document.getElementById('root')).render(<App/>);`;
 const mocks={
  'watch-media-delivery.client':`export const waitForWatchMediaDelivery=async()=>({});`,
  AppToastProvider:`const notify={success(x){window.__success=x},warning(){},error(x){window.__error=x}};export const useNotify=()=>notify;`,
  AppProgressProvider:`const p={show(){},hide(){},update(){}};export const useAppProgress=()=>p;`,
  AppDialogProvider:`const p={confirm:async()=>true,alert:async()=>{}};export const useAppDialog=()=>p;`,
  'watch-form.actions':`export const submitWatchForm=async values=>(await fetch('/fixture/save',{method:'POST',body:JSON.stringify(values)})).json();`,
  'watch-media-work.actions':`export const loadWatchMediaPoolAction=async()=>[];export const markWatchMediaAssetAttachedFromWatchAction=async()=>({});export const saveWatchMediaWorkDraftFromWatchAction=async input=>(await fetch('/fixture/progress',{method:'POST',body:JSON.stringify(input)})).json();`,
  'watch-ai-spec.actions':`export const suggestWatchSpecWithOpenAIAction=async()=>({});`,
  'task.actions':`export const applyQueueItemManualTransitionAction=async()=>{throw Error('No workflow transition expected')};`,
  'media-daily.actions':`export const mediaDailyAssigneesAction=async()=>({currentUserId:'self',users:[{id:'self',name:'Vi',email:'vi@example.invalid'},{id:'other',name:'Long',email:'long@example.invalid'}]});export const addDailyMediaWorkAction=async input=>(await fetch('/fixture/daily',{method:'POST',body:JSON.stringify(input)})).json();`,
  WatchBasicSection:`export default function Basic({values,onChange,actions}){return <section><h2>Thông tin/spec</h2><input aria-label="Tên Watch" value={values.title} onChange={e=>onChange({title:e.target.value})}/>{actions}</section>}`,
  WatchContentSection:`export default function Content({values,onChange,completionAction}){return <section><h2>Content</h2><textarea aria-label="Nội dung Watch" value={values.body} onChange={e=>onChange({body:e.target.value})}/>{completionAction}</section>}`,
  WatchImageSection:`export default function Images({sectionMode,mediaActions,onGalleryImagesChange,onCoverImageChange}){return <section><h2>{sectionMode==='cover'?'Cover':'Gallery'}</h2><button type="button" onClick={()=>onGalleryImagesChange([{key:'gallery.jpg',url:'/gallery.jpg'}])}>Chọn gallery mẫu</button><button type="button" onClick={()=>onCoverImageChange({key:'cover-new.jpg',url:'/cover-new.jpg'})}>Xác nhận Cover mẫu</button>{mediaActions}</section>}`,
  WatchEditHeader:`export default function Header({values,headerActions}){return <header><h1>{values.basic.title}</h1>{headerActions}</header>}`,
  WatchSpecModal:`export default function Modal(){return null;}`,
  WatchMediaSidebar:`export default function Sidebar(){return null;}`,
  WatchStateSection:`export default function State(){return null;}`,
  AfterSaveDialog:`export default function After(){return null;}`,
 };
 const bundle=await esbuild.build({stdin:{contents:entry,loader:'tsx',resolveDir:root},bundle:true,platform:'browser',jsx:'automatic',write:false,define:{'process.env.NODE_ENV':'"production"'},plugins:[{name:'fixtures',setup(build){
  build.onResolve({filter:/^next\/(navigation|link)$/},args=>({path:args.path,namespace:'fixture'}));
  build.onLoad({filter:/.*/,namespace:'fixture'},args=>({contents:args.path.endsWith('link')?`import React from 'react';export default function Link(p){return <a {...p}/>}`:`export const useRouter=()=>({push(){},refresh(){}});export const useSearchParams=()=>new URLSearchParams(location.search);`,loader:'tsx'}));
  build.onLoad({filter:/\.(tsx?|jsx?)$/},args=>{const key=Object.keys(mocks).find(k=>args.path.endsWith('/'+k+'.tsx')||args.path.endsWith('/'+k+'.ts'));if(key)return{contents:mocks[key],loader:'tsx'};});
 }}]});
 const css=process.env.ACQUISITION_PREVIEW_CSS?await fs.readFile(process.env.ACQUISITION_PREVIEW_CSS,'utf8'):'';
 const server=http.createServer((req,res)=>{if(req.url==='/app.js'){res.setHeader('content-type','text/javascript');res.end(bundle.outputFiles[0].text);}else{res.setHeader('content-type','text/html');res.end(`<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${css}body{margin:0;font-family:Arial,sans-serif}</style><div id="root"></div><script src="/app.js"></script>`);}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_EXECUTABLE?{executablePath:process.env.CHROMIUM_EXECUTABLE}:{}),args:['--no-sandbox']});
 try{
 const page=await browser.newPage({viewport:{width:1280,height:900}});const errors=[];page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(10000);
 let parts={profile:false,content:false,image:false,cover:false},saved=null,saveGate=null;
 const base={productId:'watch-one',watchId:'physical-one',title:'Bulova Oceanographer',sku:'BLV-001',status:'DRAFT',watch:{specStatus:'READY'},spec:{model:'Oceanographer'},content:{body:'Original'},review:{content:{status:'APPROVED'},image:{status:'APPROVED'}},images:[{role:'COVER',fileKey:'cover.jpg'}]};
 await page.route('**/fixture/read',route=>route.fulfill({json:{parts,detail:{...base,title:saved?.basic.title||base.title,content:{body:saved?.content.body||'Original'},images:[{role:'COVER',fileKey:'cover.jpg'}]}}}));
 await page.route('**/fixture/save',async route=>{saved=route.request().postDataJSON();if(saveGate)await saveGate;await route.fulfill({json:{ok:true,media:{poolImages:saved.media.poolImages,galleryImages:saved.media.galleryImages}}});});
 const progressCalls=[];await page.route('**/fixture/progress',async route=>{const body=route.request().postDataJSON();progressCalls.push(body);parts={...parts,...body.parts};await route.fulfill({json:{ok:true,skipped:false,parts}});});
 const daily=[];await page.route('**/fixture/daily',async route=>{const body=route.request().postDataJSON();daily.push(body);await route.fulfill({json:{taskItemId:'same-daily-task',created:daily.length===1,reopened:false}});});
 const url=origin+'/?mode=media&embedded=1&from=media-workspace&mediaProfileDone=1&mediaContentDone=1&mediaImageDone=1&mediaCoverDone=1';
 await page.goto(url);await page.getByRole('textbox',{name:'Tên Watch',exact:true}).waitFor();assert.equal(await page.getByRole('button',{name:'Hoàn tất mục',exact:true}).isEnabled(),true);await page.getByText('Chưa hoàn tất',{exact:true}).waitFor();
 await page.getByRole('button',{name:'Lưu tạm',exact:true}).click();await page.waitForFunction(()=>window.__success?.message?.includes('lưu tạm'));assert.equal(progressCalls.at(-1).parts.profile,false);
 await page.getByRole('button',{name:'Hoàn tất mục',exact:true}).click();await page.getByText('Đã hoàn tất',{exact:true}).waitFor();assert.equal(progressCalls.at(-1).parts.profile,true);
 await page.getByRole('textbox',{name:'Tên Watch',exact:true}).fill('Bulova còn đang chỉnh');await page.getByText('Chưa hoàn tất',{exact:true}).waitFor();
 await page.getByRole('button',{name:/^2\s*Content/}).click();await page.getByRole('textbox',{name:'Nội dung Watch',exact:true}).fill('Content đang làm dở');
 await page.getByRole('button',{name:'Lưu tạm',exact:true}).click();await page.waitForFunction(()=>window.__success?.message?.includes('lưu tạm'));assert.equal(parts.content,false);assert.equal(saved.content.body,'Content đang làm dở');
 await page.reload();await page.getByRole('button',{name:/^2\s*Content/}).click();assert.equal(await page.getByRole('textbox',{name:'Nội dung Watch',exact:true}).inputValue(),'Content đang làm dở');await page.getByText('Chưa hoàn tất',{exact:true}).waitFor();
 let release;saveGate=new Promise(r=>release=r);await page.getByRole('textbox',{name:'Nội dung Watch',exact:true}).fill('Nội dung gửi lưu');await Promise.all([page.waitForRequest('**/fixture/save'),page.getByRole('button',{name:'Lưu tạm',exact:true}).click()]);
 await page.getByRole('textbox',{name:'Nội dung Watch',exact:true}).fill('Nội dung gõ thêm trong lúc chờ');release();saveGate=null;await page.waitForFunction(()=>[...document.querySelectorAll('button')].some(b=>b.textContent==='Lưu tạm'&&!b.disabled));
 assert.equal(await page.getByRole('textbox',{name:'Nội dung Watch',exact:true}).inputValue(),'Nội dung gõ thêm trong lúc chờ');await page.getByText('Chưa hoàn tất',{exact:true}).waitFor();
 await page.getByRole('button',{name:/^4\s*Cover storefront/}).click();await page.getByRole('button',{name:'Xác nhận Cover mẫu',exact:true}).click();await page.getByText('Chưa hoàn tất',{exact:true}).waitFor();assert.equal(parts.cover,false);
 await page.getByRole('button',{name:'Tạo việc WatchShop',exact:true}).click();const dialog=page.getByRole('dialog',{name:'Thêm đầu việc media'});await dialog.waitFor();await dialog.getByRole('combobox',{name:'Người phụ trách media'}).selectOption('other');await dialog.getByRole('textbox',{name:'Yêu cầu media'}).fill('Hoàn thiện Cover');await dialog.getByRole('button',{name:'Thêm đầu việc',exact:true}).click();await dialog.waitFor({state:'hidden'});assert.equal(daily[0].productId,'watch-one');assert.equal(daily[0].part,'cover');assert.equal(daily[0].assigneeUserId,'other');assert.equal(daily[0].request,'Hoàn thiện Cover');assert.equal(parts.cover,false);
 assert.equal(await page.getByRole('link',{name:'Mở việc trong ngày'}).getAttribute('href'),'/admin/personal-work?item=same-daily-task');
 for(const width of [390,768]){await page.setViewportSize({width,height:844});await page.goto(url);await page.getByRole('button',{name:'Tạo việc WatchShop',exact:true}).click();await page.getByRole('dialog').waitFor();assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'media overflow '+width);await page.keyboard.press('Escape');await page.getByRole('dialog').waitFor({state:'hidden'});assert.equal(await page.getByRole('button',{name:'Tạo việc WatchShop',exact:true}).evaluate(el=>el===document.activeElement),true);}
 assert.deepEqual(errors,[]);console.log('PASS media UI: saved draft reloads incomplete; explicit finish only; edits clear done; delayed save preserves later typing; cover selection stays incomplete; watch/part/assignee daily-work context; modal Escape focus and 390/768 no overflow. Synthetic section interiors/server actions only.');
 }finally{await browser.close();await new Promise(r=>server.close(r));}
})().catch(error=>{console.error(error);process.exitCode=1});
