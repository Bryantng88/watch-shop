/* eslint-disable @typescript-eslint/no-require-imports */
// Synthetic browser transport acceptance. Next adapters and Markdown rendering
// are stubbed; this checks the real AiAssistant read/poll/submit lifecycle only.
const {createRequire}=require('node:module');
const path=require('node:path');
const root=process.cwd();
const requireApp=createRequire(path.join(root,'package.json'));
const {build}=requireApp('esbuild');
const {chromium}=requireApp('playwright');
const http=require('node:http');
const assert=require('node:assert/strict');
(async()=>{
const fixture=()=>{
 const row=(id,title,text)=>({id,title,context:null,steps:[],tasks:[],approved:false,revision:1,updatedAt:new Date().toISOString(),runStatus:'NEEDS_INFO',messages:[{id:id+'-reply',role:'assistant',text}]});
 const f=window.fixture={rows:[row('a','Conversation A','Answer A'),row('b','Conversation B','Answer B')],gets:0,posts:[],delayNext:0,active:0,maxActive:0,status:200,visibility:'visible'};
 Object.defineProperty(document,'visibilityState',{configurable:true,get:()=>f.visibility});
 window.fetch=async(url,options={})=>{
  if(!String(url).startsWith('/api/admin/customer-assistant'))throw Error('Unexpected API '+url);
  if(options.method==='POST'){
   const body=JSON.parse(options.body);f.posts.push(body.action);if(body.action!=='send'&&body.action!=='cancel')throw Error('Unexpected business write');
   const current=f.rows.find(r=>r.id===body.id)||f.rows[0];
   if(body.action==='send'){current.runStatus='QUEUED';current.messages.push({id:body.requestKey,role:'user',text:body.text});setTimeout(()=>{current.runStatus='NEEDS_INFO';current.messages.push({id:'completed',role:'assistant',text:'Fresh answer completed'});},150);}
   else current.runStatus='CANCELLED';
   return new Response(JSON.stringify(current));
  }
  f.gets++;f.active++;f.maxActive=Math.max(f.active,f.maxActive);
  const id=new URL(url,location.href).searchParams.get('id'),delay=f.delayNext;f.delayNext=0;
  const snapshot=JSON.stringify({partial:!!id,conversations:id?f.rows.filter(r=>r.id===id):f.rows});
  // Intentionally ignore abort here to exercise stale-response fencing as well.
  try{if(delay)await new Promise(r=>setTimeout(r,delay));return new Response(f.status===200?snapshot:JSON.stringify({error:'Synthetic server failure'}),{status:f.status});}finally{f.active--;}
 };
};
const bundle=await build({absWorkingDir:root,stdin:{contents:`import React from 'react';import{createRoot}from'react-dom/client';import Ben from './src/domains/ai-assistant/AiAssistant';(${fixture.toString()})();createRoot(document.getElementById('root')).render(<Ben userId="synthetic-user" canManage={false} live fullPage/>);`,resolveDir:root,loader:'tsx'},bundle:true,write:false,jsx:'automatic',define:{'process.env.NODE_ENV':'"test"'},plugins:[{name:'fixture-adapters',setup(b){b.onResolve({filter:/^(next\/navigation|next\/link|next\/image)$|^\.\/BenMessage$/},a=>({path:a.path,namespace:'fixture'}));b.onLoad({filter:/.*/,namespace:'fixture'},a=>({loader:'jsx',resolveDir:root,contents:a.path==='next/navigation'?`const router={push(path){window.navigationPath=path}};export const useRouter=()=>router;export const usePathname=()=>'/admin/ben';`:a.path==='./BenMessage'?`import React from 'react';export default function Message({text}){return <p>{text}</p>}`:a.path==='next/link'?`import React from 'react';export default function Link(props){return <a {...props}/>} `:`import React from 'react';export default function Image({fill,unoptimized,priority,...props}){return <img {...props}/>} `}));}}]});
const server=http.createServer((req,res)=>{res.setHeader('Content-Type',req.url==='/app.js'?'application/javascript':'text/html');res.end(req.url==='/app.js'?bundle.outputFiles[0].contents:'<!doctype html><html><body><div id="root"></div><script src="/app.js"></script></body></html>');});
await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
try{
 browser=await chromium.launch({executablePath:process.env.BEN_PERFORMANCE_CHROMIUM||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});const context=await browser.newContext();const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(`http://127.0.0.1:${server.address().port}/admin/ben`);
 await page.getByText('Answer A',{exact:true}).waitFor();const initial=await page.evaluate(()=>fixture.gets);await page.waitForTimeout(2300);assert.equal(await page.evaluate(()=>fixture.gets),initial,'idle must not poll');
 const start=Date.now();await page.getByRole('textbox',{name:'Tin nhắn cho Ben'}).fill('Hello');await page.getByRole('button',{name:'Gửi tin nhắn'}).click();await page.getByText('Fresh answer completed',{exact:true}).waitFor({timeout:4500});console.log('Completed response visible in',Date.now()-start,'ms');
 assert.deepEqual(await page.evaluate(()=>fixture.posts),['send']);
 await page.evaluate(()=>{fixture.delayNext=2200;for(let i=0;i<12;i++)window.dispatchEvent(new Event('pageshow'));});await page.waitForTimeout(2400);assert.equal(await page.evaluate(()=>fixture.maxActive),1,'resume events must not overlap reads');
 await page.evaluate(()=>{fixture.visibility='hidden';document.dispatchEvent(new Event('visibilitychange'));});let count=await page.evaluate(()=>fixture.gets);await page.waitForTimeout(2200);assert.equal(await page.evaluate(()=>fixture.gets),count);await page.evaluate(()=>{fixture.visibility='visible';document.dispatchEvent(new Event('visibilitychange'));});await page.waitForFunction(n=>fixture.gets>n,count);
 await context.setOffline(true);count=await page.evaluate(()=>fixture.gets);await page.waitForTimeout(2200);assert.equal(await page.evaluate(()=>fixture.gets),count);await context.setOffline(false);await page.waitForFunction(n=>fixture.gets>n,count);
 await page.evaluate(()=>{fixture.delayNext=1400;window.dispatchEvent(new Event('pageshow'));});await page.getByRole('button',{name:'Trao đổi mới'}).click();await page.waitForTimeout(1600);assert.equal(await page.getByText('Fresh answer completed',{exact:true}).count(),0,'old reads cannot restore a replaced chat');
 await page.getByRole('button',{name:'Lịch sử trao đổi'}).click();await page.getByRole('button').filter({hasText:'Conversation B'}).click();await page.getByText('Answer B',{exact:true}).waitFor();assert.equal(await page.getByText('Answer A',{exact:true}).count(),0);
 await page.evaluate(()=>{fixture.status=401;window.dispatchEvent(new Event('pageshow'));});await page.getByRole('heading',{name:'Đăng nhập lại để tiếp tục với Ben'}).waitFor();count=await page.evaluate(()=>fixture.gets);await page.evaluate(()=>window.dispatchEvent(new Event('pageshow')));await page.waitForTimeout(2200);assert.equal(await page.evaluate(()=>fixture.gets),count);assert.deepEqual(await page.evaluate(()=>fixture.posts),['send']);assert.deepEqual(errors,[]);
 console.log('Actual Ben client transport: idle/hidden/offline suppression, single-flight resume, response delivery, new chat/history fencing, 401 cleanup and zero write replay passed. Next routing and text rendering are fixture adapters; no server/business data is used.');
}finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1});
