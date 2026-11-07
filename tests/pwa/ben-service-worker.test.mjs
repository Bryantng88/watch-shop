import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { test } from 'node:test';
const source=readFileSync('public/ben-sw.js','utf8');
function worker(fetch){const events={};vm.runInNewContext(source,{self:{addEventListener:(name,fn)=>events[name]=fn,skipWaiting(){},clients:{claim(){}}},URL,Response,fetch});return events;}
test('Ben worker leaves APIs and other admin documents untouched',()=>{
 const events=worker(()=>{throw Error('Unexpected fetch');});
 for(const [mode,path] of [['cors','/api/admin/customer-assistant'],['navigate','/admin/watches'],['navigate','/login']])events.fetch({request:{mode,url:'https://example.test'+path},respondWith(){assert.fail('Must not intercept');}});
});
test('Ben navigation stays network-only and shows offline fallback without cached business data',async()=>{
 let response;const events=worker(async()=>{throw Error('offline');});
 events.fetch({request:{mode:'navigate',url:'https://example.test/admin/ben'},respondWith(r){response=r;}});
 const result=await response;assert.equal(result.status,503);assert.equal(result.headers.get('cache-control'),'no-store');assert.match(await result.text(),/Ben đang chờ kết nối/);
});
test('Ben has a distinct install identity and valid local icon entries',()=>{
 const manifest=JSON.parse(readFileSync('public/ben.webmanifest','utf8'));
 assert.equal(manifest.id,'/admin/ben');assert.equal(manifest.start_url,'/admin/ben');assert.equal(manifest.scope,'/admin/');
 for(const icon of manifest.icons)assert.ok(readFileSync('public'+icon.src).length>0);
 assert.ok(manifest.icons.some(icon=>icon.purpose==='maskable'));
});
