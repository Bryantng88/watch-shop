import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import esbuild from 'esbuild';
import sharp from 'sharp';
import {NextRequest} from 'next/server.js';
const require=createRequire(import.meta.url),root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const state={user:null,db:null,storage:null};
async function load(file){
 const result=await esbuild.build({entryPoints:[path.join(root,file)],bundle:true,write:false,platform:'node',format:'cjs',packages:'external',plugins:[{name:'synthetic-io',setup(build){
  build.onResolve({filter:/getCurrentUser$/},()=>({path:'user',namespace:'fixture'}));
  build.onResolve({filter:/^@\/server\/db\/client$/},()=>({path:'db',namespace:'fixture'}));
  build.onResolve({filter:/^@\/domains\/media\/storage$/},()=>({path:'storage',namespace:'fixture'}));
  build.onLoad({filter:/.*/,namespace:'fixture'},({path:name})=>({contents:name==='user'?'export const getCurrentUser=async()=>globalThis.__state.user':name==='db'?'export const prisma=globalThis.__state.db':'export const mediaStorage=globalThis.__state.storage'}));
  build.onResolve({filter:/^@\//},async({path:p})=>{for(const suffix of ['.ts','.tsx','/index.ts']){const file=path.join(root,p.replace(/^@\//,'src/'))+suffix;try{await fs.access(file);return{path:file}}catch{}}return null;});
 }}]});
 const fixtureModule={exports:{}};vm.runInNewContext(result.outputFiles[0].text,{module:fixtureModule,exports:fixtureModule.exports,require,__state:state,Response,Request,Headers,File,FormData,Buffer,URL,Date,console,process,setTimeout,clearTimeout,TextEncoder,TextDecoder});return fixtureModule.exports;
}
let writes=0;const snapshots=[];
const data={customers:Array.from({length:35},(_,i)=>({id:'c'+i,name:'Customer '+i,phone:'090'+i,email:'c'+i+'@example.invalid',address:'Address',updatedAt:new Date('2026-11-19T00:00:00Z'),city:'Preserve city',userId:'private-user'})),vendors:[{id:'v1',name:'Vendor',phone:null,email:null,address:'Vendor address',updatedAt:new Date('2026-11-19T00:00:00Z'),role:'SUPPLIER',isActive:true,bankAcc:'not-for-directory'}]};
const pick=(row,select)=>Object.fromEntries(Object.keys(select).filter(key=>select[key]).map(key=>[key,row[key]]));
const filtered=(kind,where={})=>data[kind].filter(row=>{
 if(where.phone&&row.phone!==where.phone)return false;
 if(where.id?.not&&row.id===where.id.not)return false;
 if(where.OR&&!where.OR.some(filter=>Object.entries(filter).some(([field,condition])=>String(row[field]||'').toLowerCase().includes(condition.contains.toLowerCase()))))return false;
 return true;
});
function model(kind){return{
 findMany:async args=>filtered(kind,args.where).slice(args.skip||0,(args.skip||0)+args.take).map(row=>pick(row,args.select)),
 count:async args=>filtered(kind,args.where).length,
 findFirst:async args=>{const row=filtered(kind,args.where)[0];return row?pick(row,args.select):null},
 create:async args=>{writes++;const row={id:kind+'-new',...args.data,updatedAt:new Date()};data[kind].push(row);return pick(row,args.select)},
 updateMany:async args=>{const row=data[kind].find(row=>row.id===args.where.id&&new Date(row.updatedAt).getTime()===new Date(args.where.updatedAt).getTime());if(!row)return{count:0};writes++;Object.assign(row,args.data,{updatedAt:new Date()});return{count:1}},
 findUnique:async args=>{const row=data[kind].find(row=>row.id===args.where.id);return row?pick(row,args.select):null},
 findUniqueOrThrow:async args=>{const row=data[kind].find(row=>row.id===args.where.id);assert.ok(row);return pick(row,args.select)},
}}
const db={customer:model('customers'),vendor:model('vendors'),$transaction:async(fn,options)=>{snapshots.push(options.isolationLevel);return fn(db)}};state.db=db;
const storageCalls=[];state.storage={
 list:async input=>{storageCalls.push(['list',input]);return{items:[{key:input.prefix+'image.webp',sizeBytes:100,lastModified:new Date('2026-11-19T00:00:00Z')},{key:'watches/private.webp',sizeBytes:10,lastModified:null}],nextCursor:input.cursor?null:'next-page',truncated:!input.cursor}},
 stat:async key=>{storageCalls.push(['stat',key]);return{key,sizeBytes:100}},
 sign:async(key,expiry)=>{storageCalls.push(['sign',key,expiry]);return'https://example.invalid/'+key},
 write:async input=>{storageCalls.push(['write',input.key]);return{key:input.key,sizeBytes:input.bytes.length}},
};
const contacts=await load('src/app/api/admin/contacts/route.ts');
const request=(suffix='',body)=>new NextRequest('http://localhost/api/admin/contacts'+suffix,body?{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}:undefined);
const fields={name:'New Customer',phone:'NEW-090',email:'',address:''};
assert.equal((await contacts.GET(request('?kind=customers'))).status,401);assert.equal(writes,0);
state.user={roles:[],permissions:['PRODUCT_VIEW']};
assert.equal((await contacts.GET(request('?kind=customers'))).status,403);
let response=await contacts.GET(request('?kind=vendors'));assert.equal(response.status,200);let json=await response.json();assert.equal(json.items[0].bankAcc,undefined);assert.equal(json.items[0].role,'SUPPLIER');
assert.equal((await contacts.POST(request('',{kind:'vendors',...fields}))).status,403);assert.equal(writes,0);
state.user={roles:[],permissions:['CUSTOMER_VIEW','CUSTOMER_CREATE']};
response=await contacts.GET(request('?kind=customers&page=2'));json=await response.json();assert.equal(json.total,35);assert.equal(json.items.length,5);assert.equal(json.items[0].userId,undefined);
assert.equal((await contacts.GET(request('?kind=customers&page=-1'))).status,400);
assert.equal((await contacts.GET(request('?kind=customers&page=NaN'))).status,400);
response=await contacts.POST(request('',{kind:'customers',...fields}));assert.equal(response.status,200);assert.equal(writes,1);
response=await contacts.POST(request('',{kind:'customers',...fields}));assert.equal(response.status,409);assert.equal(writes,1,'duplicate phone must not create a second row');
assert.equal((await contacts.POST(request('',{kind:'customers',...fields,bankAcc:'forged'}))).status,400);
const original=data.customers[0],update={kind:'customers',id:original.id,updatedAt:original.updatedAt.toISOString(),name:'Updated',phone:original.phone,email:'',address:'Updated address'};
assert.equal((await contacts.POST(request('',update))).status,403);
state.user.permissions.push('CUSTOMER_UPDATE');
assert.equal((await contacts.POST(request('',{...update,updatedAt:'2000-01-01T00:00:00.000Z'}))).status,409);assert.equal(original.name,'Customer 0');
assert.equal((await contacts.POST(request('',update))).status,200);assert.equal(original.name,'Updated');assert.equal(original.city,'Preserve city');assert.equal(original.userId,'private-user');
assert.equal((await contacts.POST(request('',update))).status,409,'replaying an old update must not overwrite');
const legacy=data.customers[1];legacy.phone=data.customers[2].phone;assert.equal((await contacts.POST(request('',{kind:'customers',id:legacy.id,updatedAt:legacy.updatedAt.toISOString(),name:'Legacy name edit',phone:legacy.phone,email:'',address:''}))).status,200,'unchanged historical shared phone must permit a name edit');
assert.ok(snapshots.includes('RepeatableRead'));assert.ok(snapshots.includes('Serializable'));
state.user={roles:['ADMIN'],permissions:[]};assert.equal((await contacts.POST(request('',{kind:'vendors',...fields,name:'New vendor',phone:''}))).status,200);
const media=await load('src/app/api/admin/storefront/media/library/route.ts');
const mediaRequest=(params)=>new NextRequest('http://localhost/api/admin/storefront/media/library?'+params);
state.user=null;const before=storageCalls.length;assert.equal((await media.GET(mediaRequest('folder=hero'))).status,401);assert.equal(storageCalls.length,before);
state.user={roles:[],permissions:['PRODUCT_VIEW']};assert.equal((await media.GET(mediaRequest('folder=hero'))).status,403);
state.user={roles:[],permissions:['PRODUCT_UPDATE']};
assert.equal((await media.GET(mediaRequest('folder=../../private'))).status,400);
assert.equal((await media.GET(mediaRequest('key=watches/private.webp'))).status,404);assert.equal(storageCalls.length,before,'no storage access for non-website keys');
response=await media.GET(mediaRequest('folder=hero'));json=await response.json();assert.equal(json.items.length,1);assert.equal(json.nextCursor,'next-page');assert.ok(json.items[0].key.startsWith('storefront/hero/'));assert.ok(storageCalls.some(([name,arg])=>name==='list'&&arg.prefix==='storefront/hero/'&&arg.maxKeys===60));
response=await media.GET(mediaRequest('folder=hero&cursor=next-page'));json=await response.json();assert.equal(json.nextCursor,null);assert.ok(storageCalls.some(([name,arg])=>name==='list'&&arg.cursor==='next-page'));
response=await media.GET(mediaRequest('key=storefront/editorial/older.webp'));assert.equal(response.status,200);assert.equal((await response.json()).item.key,'storefront/editorial/older.webp');
const upload=await load('src/app/api/admin/storefront/media/route.ts');
const bytes=await sharp({create:{width:2,height:2,channels:3,background:'#ffffff'}}).png().toBuffer();
function uploadRequest(folder){const form=new FormData();form.set('file',new File([bytes],'fixture.png',{type:'image/png'}));if(folder!==undefined)form.set('folder',folder);return new NextRequest('http://localhost/api/admin/storefront/media',{method:'POST',body:form})}
const writesBefore=storageCalls.filter(([method])=>method==='write').length;
assert.equal((await upload.POST(uploadRequest('../watches'))).status,400);assert.equal(storageCalls.filter(([method])=>method==='write').length,writesBefore);
response=await upload.POST(uploadRequest());assert.equal(response.status,200);assert.match((await response.json()).item.key,/^storefront\/editorial\/[a-f0-9-]+\.webp$/);
response=await upload.POST(uploadRequest('hero'));assert.equal(response.status,200);assert.match((await response.json()).item.key,/^storefront\/hero\/[a-f0-9-]+\.webp$/);
state.user={roles:[],permissions:['PRODUCT_VIEW']};assert.equal((await upload.POST(uploadRequest('hero'))).status,403);
const policy=await load('src/server/auth/admin-api-policy.ts');assert.ok(policy.getAdminApiPolicy('/api/admin/contacts','GET'));assert.ok(policy.getAdminPagePolicy('/admin/vendors'));assert.deepEqual(Array.from(policy.getAdminPagePolicy('/admin/storefront/media').anyOf),['PRODUCT_UPDATE']);assert.deepEqual(Array.from(policy.getAdminApiPolicy('/api/admin/storefront/media','POST').anyOf),['PRODUCT_UPDATE']);
console.log('PASS actual APIs with synthetic DB/storage: per-directory auth and write gates, strict fields, paging, duplicate phone, stale-update fencing and field preservation; website-only keys, folder validation, cursors and legacy/default+Hero upload conversion. No real database/storage writes or production data.');

const navigation=await load('src/domains/contacts/shared/directory-navigation.ts');
assert.deepEqual(Array.from(navigation.directoryEntries({roles:[],permissions:[]})),[]);
for(const [permissions,href] of [[['USER_VIEW'],'/admin/users'],[['USER_MANAGE'],'/admin/users'],[['CUSTOMER_VIEW'],'/admin/customers'],[['PRODUCT_VIEW'],'/admin/vendors']]){
 assert.deepEqual(Array.from(navigation.directoryEntries({roles:[],permissions})).map(i=>i.href),[href]);
}
assert.equal(navigation.directoryEntries({roles:['ADMIN'],permissions:[]}).length,3);
assert.equal(navigation.directoryEntries({roles:[],permissions:['USER_CREATE','USER_UPDATE']}).length,0,'write grants do not imply existing user list read access');
assert.deepEqual(Array.from(policy.getAdminPagePolicy('/admin/directory').anyOf),Array.from(navigation.DIRECTORY_READ_PERMISSIONS));
console.log('PASS directory navigation: existing read grants, ADMIN bypass and destination policy agreement.');
