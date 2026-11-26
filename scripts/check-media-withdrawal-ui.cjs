const assert=require('node:assert/strict'),http=require('node:http'),path=require('node:path');
const esbuild=require('./lib/admin-fixture-esbuild.cjs');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
(async()=>{
 const root=path.resolve(__dirname,'..');
 const mocks={
  AppDialogProvider:`const dialog={confirm:async()=>window.__confirm!==false};export const useAppDialog=()=>dialog;`,
  AppToastProvider:`export const useNotify=()=>({success:x=>window.__success=x});`,
  'watch-media-work.actions':`export const withdrawMediaQueueWatchAction=async input=>{const r=await fetch('/withdraw',{method:'POST',body:JSON.stringify(input)});if(!r.ok)throw Error('synthetic failure');return r.json()};`,
  'projection-delivery.client':`export const waitForProjectionDelivery=async()=>{};`,
 };
 const entry=`import React,{useState} from 'react';import{createRoot}from'react-dom/client';import{WithdrawMediaSelectionButton}from'./src/domains/coordination/ui/WithdrawMediaSelectionButton';import{RetiredMediaWorkspace}from'./src/domains/watch/ui/edit/RetiredMediaWorkspace';function App(){const[items,setItems]=useState([{id:'one',targetType:'WATCH',preview:{title:'Watch one'}},{id:'two',targetType:location.search.includes('mixed')?'MEDIA_POST':'WATCH',preview:{title:'Watch two'}}]);const[error,setError]=useState(null);return <><WithdrawMediaSelectionButton items={items} onPendingChange={x=>window.__pending=x} onWithdrawn={ids=>{window.__removed=ids;setItems(current=>current.filter(x=>!ids.includes(x.id)))}} onError={setError} onReload={()=>window.__reloaded=true}/><p role="status">{error}</p><span>{items.length} selected</span></>}createRoot(document.getElementById('root')).render(location.search.includes('retired')?<RetiredMediaWorkspace/>:<App/>);`;
 const bundle=await esbuild.build({stdin:{contents:entry,resolveDir:root,loader:'tsx'},bundle:true,platform:'browser',jsx:'automatic',write:false,define:{'process.env.NODE_ENV':'"production"'},plugins:[{name:'fixture',setup(build){build.onLoad({filter:/\.(tsx?|jsx?)$/},args=>{const key=Object.keys(mocks).find(name=>args.path.replaceAll('\\','/').endsWith('/'+name+'.ts')||args.path.replaceAll('\\','/').endsWith('/'+name+'.tsx'));if(key)return{contents:mocks[key],loader:'tsx'};});}}]});
 const server=http.createServer((req,res)=>{res.setHeader('content-type',req.url==='/app.js'?'text/javascript':'text/html;charset=utf-8');res.end(req.url==='/app.js'?bundle.outputFiles[0].text:req.url==='/frame'?'<script>window.__messages=[];addEventListener("message",e=>window.__messages.push(e.data.type))</script><iframe src="/?retired"></iframe>':'<meta charset="utf-8"><div id="root"></div><script src="/app.js"></script>');});await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
  const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));const url='http://127.0.0.1:'+server.address().port;
  let calls=[],failTwo=true;
  await page.route('**/withdraw',async route=>{const input=route.request().postDataJSON();calls.push(input.bindingId);await new Promise(resolve=>setTimeout(resolve,100));await route.fulfill(input.bindingId==='two'&&failTwo?{status:500,json:{}}:{json:{event:{projectionDeliveryKey:'synthetic'}}});});
  await page.goto(url);const button=page.getByRole('button',{name:'Bỏ khỏi quy trình media',exact:true});await button.waitFor();
  await page.evaluate(()=>window.__confirm=false);await button.click();assert.equal(calls.length,0);
  await page.evaluate(()=>window.__confirm=true);await button.dblclick();await page.getByText('1 selected',{exact:true}).waitFor();await page.getByRole('status').filter({hasText:'Chưa bỏ được: Watch two'}).waitFor();assert.deepEqual(calls,['one','two']);assert.deepEqual(await page.evaluate(()=>window.__removed),['one']);
  failTwo=false;await button.click();await page.getByText('0 selected',{exact:true}).waitFor();assert.deepEqual(calls,['one','two','two']);
  await page.goto(url+'/?mixed');assert.equal(await page.getByRole('button',{name:'Bỏ khỏi quy trình media',exact:true}).count(),0);
  await page.goto(url+'/frame');await page.waitForFunction(()=>window.__messages.includes('workspace-target-modal-close'));assert.deepEqual(await page.evaluate(()=>window.__messages),['workspace-target-modal-refresh','workspace-target-modal-close']);
  assert.deepEqual(errors,[]);console.log('PASS actual media selection button: confirmation/cancel, single flight, partial failure, retry, Watch-only selection; retired editor safely refreshes/closes its real same-origin iframe. Synthetic actions.');
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(error=>{console.error(error);process.exitCode=1});
