import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { test } from 'node:test';
const source=readFileSync('public/ben-sw.js','utf8');
function worker(fetch, overrides={}){const events={};vm.runInNewContext(source,{self:{location:{origin:'https://example.test'},addEventListener:(name,fn)=>events[name]=fn,skipWaiting(){},clients:{claim(){}},...overrides},URL,Response,fetch});return events;}
test('Ben worker leaves APIs and other admin documents untouched',()=>{
 const events=worker(()=>{throw Error('Unexpected fetch');});
 for(const [mode,path] of [['cors','/api/admin/customer-assistant'],['navigate','/admin/watches'],['navigate','/login']])events.fetch({request:{method:"GET",mode,url:'https://example.test'+path},respondWith(){assert.fail('Must not intercept');}});
});
test('Ben navigation stays network-only and shows offline fallback without cached business data',async()=>{
 let response;const events=worker(async()=>{throw Error('offline');});
 events.fetch({request:{method:'GET',mode:'navigate',url:'https://example.test/admin/ben'},respondWith(r){response=r;}});
 const result=await response;assert.equal(result.status,503);assert.equal(result.headers.get('cache-control'),'no-store');assert.match(await result.text(),/Ben đang chờ kết nối/);
});
test('Ben has a distinct install identity and valid local icon entries',()=>{
 const manifest=JSON.parse(readFileSync('public/ben.webmanifest','utf8'));
 assert.equal(manifest.id,'/admin/ben');assert.equal(manifest.start_url,'/admin/ben');assert.equal(manifest.scope,'/admin/');
 for(const icon of manifest.icons)assert.ok(readFileSync('public'+icon.src).length>0);
 assert.ok(manifest.icons.some(icon=>icon.purpose==='maskable'));
});

test('Ben leaves other origins, writes and streamed API data outside the offline fallback',()=>{
 const events=worker(()=>{throw Error('Unexpected fetch');});
 for(const request of [{method:'GET',mode:'navigate',url:'https://other.test/admin/ben'},{method:'POST',mode:'navigate',url:'https://example.test/admin/ben'},{method:'GET',mode:'cors',url:'https://example.test/api/admin/customer-assistant'},{method:'GET',mode:'navigate',url:'https://example.test/admin/ben/extra'}])events.fetch({request,respondWith(){assert.fail('Must not intercept');}});
});
test('successful navigation and HTTP auth failures are returned without caching or masking errors',async()=>{
 for(const status of [200,401,503]){
  const expected=new Response('network result',{status});let promise;
  worker(async()=>expected).fetch({request:{method:'GET',mode:'navigate',url:'https://example.test/admin/ben'},respondWith(r){promise=r;}});
  assert.equal(await promise,expected);
 }
});

test('Ben requests its protected manifest with browser credentials', () => {
 const page=readFileSync('src/app/(admin)/admin/ben/page.tsx','utf8');
 assert.match(page, /<link rel="manifest" href="\/ben\.webmanifest" crossOrigin="use-credentials"/);
});

test('Ben push ignores malformed payload and opens only a validated internal destination', async () => {
 const shown=[];const opened=[];
 const events=worker(undefined,{
  registration:{showNotification:async (title,options)=>shown.push({title,body:options.body,data:options.data})},
  clients:{matchAll:async()=>[],openWindow:async path=>opened.push(path)},
 });
 let work;
 events.push({data:{json(){throw Error('malformed');}},waitUntil(p){work=p;}});
 await work;
 assert.equal(shown[0].body,'Bạn có công việc mới');
 events.notificationclick({notification:{data:shown[0].data,close(){}},waitUntil(p){work=p;}});
 await work;
 assert.deepEqual(opened,['https://example.test/admin/ben']);
});

for (const [route,expected] of [["/admin/personal-work?item=fixture","/admin/personal-work?view=list&item=fixture"],["https://evil.invalid","/admin/ben"],["/admin/ben/work/fixture","/admin/ben/work/fixture"]]) test(`push click validates ${route}`,async()=>{
 let work;const opened=[];const shown=[];
 const events=worker(undefined,{registration:{showNotification:async(t,o)=>shown.push(o)},clients:{matchAll:async()=>[],openWindow:async p=>opened.push(p)}});
 events.push({data:{json:()=>({kind:"REMINDER",route,tag:"stable",title:"private customer data"})},waitUntil(p){work=p;}});await work;
 assert.equal(shown[0].body,"Bạn có lịch công việc hoặc sự kiện cần nhắc");assert.equal(shown[0].tag,"stable");assert.ok(!JSON.stringify(shown).includes("private customer data"));
 events.notificationclick({notification:{data:shown[0].data,close(){}},waitUntil(p){work=p;}});await work;assert.deepEqual(opened,['https://example.test'+expected]);
});

test('legacy assignment notifications open the mobile work list', async () => {
 const opened=[];let work, notification;
 const events=worker(undefined,{
  registration:{showNotification:async (_,options)=>{notification=options}},
  clients:{matchAll:async()=>[],openWindow:async path=>opened.push(path)},
 });
 events.push({data:{json:()=>({type:'assignment'})},waitUntil(p){work=p}});
 await work;
 events.notificationclick({notification:{...notification,close(){}},waitUntil(p){work=p}});
 await work;
 assert.deepEqual(opened,['https://example.test/admin/personal-work?view=list']);
});

async function click(route, clients) {
 let pending, closed=false;
 const events=worker(undefined,{clients});
 events.notificationclick({notification:{data:route===undefined?undefined:{route},close(){closed=true}},waitUntil(p){pending=p}});
 await pending;assert.ok(closed);
}
for(const route of ['/admin/personal-work?view=list&item=item-23','/admin/personal-work?item=item-23&view=list'])test(`canonical list keeps item: ${route}`,async()=>{
 const opened=[];await click(route,{matchAll:async()=>[],openWindow:async url=>{opened.push(url)}});
 assert.deepEqual(opened,['https://example.test/admin/personal-work?view=list&item=item-23']);
});
for(const route of ['//evil.invalid/admin/ben','/admin/personal-work?item=../private','/admin/personal-work?item=a%2Fb','/admin/personal-work?item=a&item=b','/admin/personal-work?view=list&view=list','/admin/personal-work?view=all','/admin/personal-work?next=https://evil.invalid','/admin/personal-work?item=','/admin/personal-work#x','/admin/ben/work/%2e%2e','/admin/ben/work/a%5Cb'])test(`reject unsafe click destination: ${route}`,async()=>{
 const opened=[];await click(route,{matchAll:async()=>[],openWindow:async url=>{opened.push(url)}});
 assert.deepEqual(opened,['https://example.test/admin/ben']);
});
test('old displayed notification without route opens work list',async()=>{
 const opened=[];await click(undefined,{matchAll:async()=>[],openWindow:async url=>{opened.push(url)}});
 assert.deepEqual(opened,['https://example.test/admin/personal-work?view=list']);
});
test('focuses the returned navigated client, preserves item and avoids unrelated windows',async()=>{
 const calls=[];
 await click('/admin/personal-work?item=item-23',{matchAll:async()=>[
 {url:'https://evil.invalid/admin/ben',navigate(){assert.fail('external client')}},
 {url:'invalid',navigate(){assert.fail('invalid client')}},
 {url:'https://example.test/admin/orders/new',navigate(){assert.fail('order draft')}},
 {url:'https://example.test/admin/ben',navigate(){assert.fail('prefer matching list')}},
 {url:'https://example.test/admin/personal-work?view=list&item=old',navigate:async url=>{calls.push(url);return {focus:async()=>calls.push('focused returned client')}},focus(){assert.fail('old client')}}
 ],openWindow(){assert.fail('must reuse client')}});
 assert.deepEqual(calls,['https://example.test/admin/personal-work?view=list&item=item-23','focused returned client']);
});
for(const failure of ['null','navigate rejects','focus rejects'])test(`mobile resume fallback when ${failure}`,async()=>{
 const opened=[];let focused=false;
 await click('/admin/personal-work?item=shared',{matchAll:async()=>[{url:'https://example.test/admin/ben',navigate:async()=>{
 if(failure==='navigate rejects')throw Error('closed');
 return failure==='null'?null:{focus:async()=>{throw Error('vanished')}};
 }}],openWindow:async url=>{opened.push(url);return {focus:async()=>{focused=true}}}});
 assert.deepEqual(opened,['https://example.test/admin/personal-work?view=list&item=shared']);assert.ok(focused);
});
test('cold launch works even if window enumeration fails',async()=>{
 const opened=[];await click('/admin/personal-work',{matchAll:async()=>{throw Error('resume')},openWindow:async url=>{opened.push(url)}});
 assert.deepEqual(opened,['https://example.test/admin/personal-work?view=list']);
});
test('recognized work pushes without route use list and ignore inherited label keys',async()=>{
 for(const payload of [{kind:'SHARED'},{type:'assignment'},{type:'work'},{kind:'toString'},null,5]){
 let pending,shown;const events=worker(undefined,{registration:{showNotification:async(_,o)=>{shown=o}}});
 events.push({data:{json:()=>payload},waitUntil(p){pending=p}});await pending;
 assert.equal(shown.data.route,payload && (payload.kind==='SHARED'||payload.type)?'/admin/personal-work?view=list':'/admin/ben');
 assert.equal(typeof shown.body,'string');
 }
});
