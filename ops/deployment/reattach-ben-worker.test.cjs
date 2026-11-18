const assert = require('node:assert/strict');
const test = require('node:test');
const {reattach} = require('./reattach-ben-worker.cjs');
function fixture(failProbe=false, aligned=false) {
 const calls=[];
 const rows={
 app:{Id:'app-new',State:{Running:true,Health:{Status:'healthy'}}},
 old:{Id:'old',Image:'sha256:worker',Config:{Hostname:'old-host',Env:['SECRET=synthetic'],Labels:{'codex.scope':'ben-production-205789f6'}},HostConfig:{NetworkMode:aligned?'container:app-new':'container:app-old',Binds:['/source:/target:ro'],ReadonlyRootfs:true},State:{Running:true},RestartCount:0},
 candidate:{Id:'new',State:{Running:true},RestartCount:0},
 };
 const api=async(method,path,body)=>{
 calls.push({method,path,body});
 if(path==='/containers/watch-shop-app-1/json')return rows.app;
 if(path==='/containers/watch-shop-production-ben-worker/json')return rows.old;
 if(path.startsWith('/containers/create'))return {Id:'new'};
 if(path==='/containers/new/json')return rows.candidate;
 if(path==='/containers/old/json')return rows.old;
 if(path.endsWith('/exec'))return {Id:'probe'};
 if(path==='/exec/probe/json')return {Running:false,ExitCode:failProbe?1:0};
 return null;
 };
 return {api,calls,rows};
}
test('recreates a stale namespace with the same image and runtime restrictions',async()=>{
 const f=fixture();await reattach(f.api,async()=>{});
 const c=f.calls.find(x=>x.path.startsWith('/containers/create')).body;
 assert.equal(c.Image,f.rows.old.Image);assert.deepEqual(c.Env,f.rows.old.Config.Env);
 assert.equal(c.HostConfig.NetworkMode,'container:app-new');
 assert.deepEqual(c.HostConfig.Binds,f.rows.old.HostConfig.Binds);
 assert.equal(c.HostConfig.ReadonlyRootfs,true);assert.equal(c.Hostname,undefined);
 assert.ok(f.calls.some(x=>x.method==='DELETE'&&x.path==='/containers/old'));
});
test('repeating on an aligned running worker verifies connectivity without replacing it',async()=>{
 const f=fixture(false,true);await reattach(f.api,async()=>{});
 assert.ok(!f.calls.some(x=>x.path.startsWith('/containers/create')));
 assert.ok(f.calls.some(x=>x.path==='/exec/probe/json'));
});
test('failed connectivity restores original worker name and running state for app rollback',async()=>{
 const f=fixture(true);await assert.rejects(reattach(f.api,async()=>{}));
 assert.ok(f.calls.some(x=>x.path==='/containers/new?force=true'));
 assert.ok(f.calls.some(x=>x.path==='/containers/old/rename?name=watch-shop-production-ben-worker'));
 assert.ok(f.calls.some(x=>x.path==='/containers/old/start'));
 assert.ok(!f.calls.some(x=>x.path==='/containers/old'&&x.method==='DELETE'));
});
