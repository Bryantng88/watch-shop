const assert = require('node:assert/strict');
const test = require('node:test');
const esbuild = require('esbuild');
const fs = require('node:fs');
const vm = require('node:vm');
function compile(source, filename='test.ts') {
  const output = esbuild.transformSync(source,{loader:'ts',format:'cjs',sourcefile:filename}).code;
  const module={exports:{}};vm.runInNewContext(output,{module,exports:module.exports,require,URLSearchParams,console,Date,Map});return module.exports;
}
const shared=compile(fs.readFileSync('src/domains/watch/shared/ben-media-workspace.ts','utf8'));
test('filter inputs are bounded; edit links retain exact binding and list context',()=>{
  assert.equal(shared.mediaListSearch({stage:'INVALID',page:'NaN'}).stage,'MEDIA_PROCESSING');
  assert.equal(shared.mediaListSearch({page:'-1'}).page,1);
  assert.equal(shared.mediaListSearch({page:'2.5'}).page,1);
  const input=shared.mediaListSearch({stage:['PUBLISH'],q:'  Seiko & Co  ',page:'3'});
  const back=shared.mediaListHref(input);assert.equal(new URL(back,'https://example.invalid').searchParams.get('q'),'Seiko & Co');
  const row={id:'watch',productId:'product/a',bindingId:'binding&1',stage:'MEDIA_PROCESSING',targetType:'WATCH'};
  const url=new URL(shared.mediaRowHref(row,back,true),'https://example.invalid');
  assert.equal(url.pathname,'/admin/watches/product%2Fa/edit');assert.equal(url.searchParams.get('workspaceBindingId'),'binding&1');assert.equal(url.searchParams.get('returnTo'),back);assert.equal(url.searchParams.get('source'),'ben-media');
  assert.equal(shared.mediaRowHref(row,back,false),'/admin/watches/product%2Fa');
  assert.equal(shared.mediaRowHref({...row,productId:null},back,true),null);
  assert.equal(shared.mediaRowHref({...row,targetType:'MEDIA_POST'},back,true),'/admin/media-posts/watch');
});
test('projection search is parameterized and runs before totals and pagination',async()=>{
  const source=fs.readFileSync('src/domains/projection/server/media-operation-board.projection.ts','utf8');
  const functionSource=source.slice(source.indexOf('export async function queryMediaOperationBoardProjection('),source.indexOf('export async function queryMediaOperationBoardInsightCounts('));
  const api=compile(`import {Prisma} from '@prisma/client';const MEDIA_OPERATION_BOARD_PROJECTION_KEY='media-operation-board';const MEDIA_OPERATION_BOARD_PROJECTION_VERSION=13;const operationBoardDoneCutoff=()=>null;const dbOrTx=db=>db;const normalizeMediaProgressTotal=x=>x;${functionSource}`);
  let sql;const db={$queryRaw:async statement=>{sql=statement;return [{kind:'TOTAL',status:'MEDIA_PROCESSING',total:26n}]}};
  const query="x%' OR 1=1 --";const result=await api.queryMediaOperationBoardProjection(db,{requestedStage:'MEDIA_PROCESSING',page:2,pageSize:25,query});
  assert.equal(result.totals.get('MEDIA_PROCESSING'),26);
  assert.ok(sql.values.includes(query.toLowerCase()));assert.ok(!sql.sql.includes(query));
  assert.ok(sql.sql.indexOf('strpos(')<sql.sql.indexOf('ROW_NUMBER()'));
  assert.match(sql.sql,/"updatedAt" DESC, "entityId" ASC/);assert.ok(sql.values.includes(25));assert.ok(sql.values.includes(50));
});
test('server authorizes before reading and clamps out-of-range pages without exposing action metadata',async()=>{
 const ports={actor:{permissions:['TASK_VIEW'],roles:[]},reads:[],ensure:0,deny:false};
 const built=await esbuild.build({entryPoints:['src/domains/watch/server/media-workspace/ben-media-workspace.query.ts'],bundle:true,platform:'node',format:'cjs',write:false,plugins:[{name:'query-ports',setup(build){build.onResolve({filter:/^@\/(server\/db\/client|server\/auth\/requirePermission|domains\/projection\/server\/)/},args=>({path:args.path,namespace:'ports'}));build.onLoad({filter:/.*/,namespace:'ports'},args=>({contents:args.path.endsWith('/client')?'export const prisma={};':args.path.endsWith('/requirePermission')?`export async function requirePermission(code){if(code!=='TASK_VIEW')throw Error('Wrong permission');if(globalThis.__ports.deny)throw Error('Denied');return globalThis.__ports.actor;}`:args.path.endsWith('/projection-read.service')?`export async function ensureProjectionReady(){globalThis.__ports.ensure++;return {ready:!globalThis.__ports.unavailable}}`:`export async function queryMediaOperationBoardProjection(db,input){globalThis.__ports.reads.push(input);return {totals:new Map([['MEDIA_PROCESSING',26],['PUBLISH',3],['PHOTOGRAPHY',2]]),rows:[{id:'watch',bindingId:'exact-binding',productId:'product',targetType:'WATCH',title:'Seiko',sku:'SKU',imageUrl:null,stage:'MEDIA_PROCESSING',reshootNote:null,updatedAt:null,mediaWorkProgress:{profile:true,content:false,image:false,cover:false},manualTransitions:[{secret:'never serialize'}]}]}}`,loader:'ts'}));}}]});
 const module={exports:{}};vm.runInNewContext(built.outputFiles[0].text,{module,exports:module.exports,__ports:ports,console});
 ports.deny=true;await assert.rejects(()=>module.exports.getBenMediaWorkspace({q:'Seiko',stage:'MEDIA_PROCESSING',page:9}),/Denied/);assert.equal(ports.ensure,0);assert.equal(ports.reads.length,0);
 ports.deny=false;const result=await module.exports.getBenMediaWorkspace({q:'Seiko',stage:'MEDIA_PROCESSING',page:9});assert.equal(result.page,2);assert.equal(result.total,26);assert.equal(result.open,31);assert.equal(result.canEdit,false);assert.equal(ports.reads[1].page,2);assert.equal(ports.reads[0].query,'Seiko');assert.equal(ports.reads[0].doneRetentionDays,null);assert.equal(result.items[0].bindingId,'exact-binding');assert.equal(result.items[0].manualTransitions,undefined);
 ports.unavailable=true;await assert.rejects(()=>module.exports.getBenMediaWorkspace({q:'',stage:'MEDIA_PROCESSING',page:1}),/MEDIA_WORKSPACE_UNAVAILABLE/);ports.unavailable=false;
 ports.actor.permissions.push('PRODUCT_UPDATE');assert.equal((await module.exports.getBenMediaWorkspace({q:'',stage:'MEDIA_PROCESSING',page:1})).canEdit,true);
});
