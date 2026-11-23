const assert=require('node:assert/strict');
const path=require('node:path');
const http=require('node:http');
const esbuild=require('./lib/admin-fixture-esbuild.cjs');
const {chromium}=require('playwright');
(async()=>{
 const root=path.resolve(__dirname,'..');
 const bundle=await esbuild.build({stdin:{contents:`import React from 'react';import{createRoot}from'react-dom/client';import Form from './src/domains/media-post/ui/MediaPostCreateForm';createRoot(document.getElementById('root')).render(<Form onCreated={()=>{window.created=true}} onCancel={()=>{}}/>);`,loader:'tsx',resolveDir:root},bundle:true,platform:'browser',jsx:'automatic',write:false,define:{'process.env.NODE_ENV':'"production"'},plugins:[{name:'ports',setup(b){
 b.onResolve({filter:/^@\/domains\/media-post\/actions$/},()=>({path:'actions',namespace:'fixture'}));
 b.onResolve({filter:/^next\/image$/},()=>({path:'image',namespace:'fixture'}));
 b.onLoad({filter:/.*/,namespace:'fixture'},a=>({loader:'tsx',resolveDir:root,contents:a.path==='image'?`import React from 'react';export default function Image({unoptimized,...p}){return <img {...p}/>}`:`export async function searchMediaPostThemeWatchesAction(){return {suggestion:null,items:[{watchId:'w1',productId:'p1',title:'Seiko test',sku:'SEI-1',gallery:[{key:'gallery/a.jpg',url:'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>'}],complications:[]}]}};export async function createMediaPostAction(input){window.calls=(window.calls||0)+1;window.payload=input;if(!window.retry)throw new Error('Không sao chép được ảnh Gallery');return {ok:true,postId:'post1',media:{errors:[]},coordination:{stageKey:'photography'}};}` }));
 }}]});
 const server=http.createServer((q,r)=>r.end('<div id="root"></div><script>'+bundle.outputFiles[0].text+'</script>'));await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({headless:true});try{
 const page=await browser.newPage();await page.goto('http://127.0.0.1:'+server.address().port);
 await page.getByRole('button',{name:'Tạo bài với 0 watch'}).click();await page.getByRole('alert').waitFor();assert.equal(await page.evaluate(()=>window.calls||0),0);
 await page.getByRole('button',{name:'Tìm watch',exact:true}).click();await page.getByRole('button',{name:'Chọn Seiko test',exact:true}).click();
 await page.getByRole('button',{name:'Tạo bài với 1 watch'}).click();await page.getByRole('alert').filter({hasText:'Không sao chép được ảnh Gallery'}).waitFor();assert.equal(await page.evaluate(()=>window.calls),1);
 await page.evaluate(()=>{window.retry=true});await page.getByRole('button',{name:'Tạo bài với 1 watch'}).click();await page.waitForFunction(()=>window.created===true);assert.equal(await page.evaluate(()=>window.payload.watchSelections[0].sourceGalleryKey),'gallery/a.jpg');
 console.log('PASS themed media create: visible validation, Gallery selection payload, visible server error and successful retry; fixture actions only, no DB/storage writes.');
 }finally{await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1});
