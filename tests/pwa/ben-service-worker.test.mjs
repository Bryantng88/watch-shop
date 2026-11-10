import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { test } from 'node:test';
const source=readFileSync('public/ben-sw.js','utf8');
function worker(fetch){const events={};vm.runInNewContext(source,{self:{location:{origin:'https://example.test'},addEventListener:(name,fn)=>events[name]=fn,skipWaiting(){},clients:{claim(){}}},URL,Response,fetch});return events;}
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
