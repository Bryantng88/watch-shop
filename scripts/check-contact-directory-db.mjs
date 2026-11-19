// PostgreSQL fixture only: a new, disposable schema in the loopback CI test DB.
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import path from 'node:path';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {PrismaClient} from '@prisma/client';
import esbuild from 'esbuild';
const require=createRequire(import.meta.url),root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const url=new URL(process.env.DATABASE_URL||'http://invalid');
assert.ok(['127.0.0.1','localhost','[::1]'].includes(url.hostname)&&url.pathname==='/admin_management_test','Only the owned loopback admin_management_test database is allowed');
const schema='management_'+randomUUID().replaceAll('-','');
url.searchParams.set('connection_limit','6');url.searchParams.set('pool_timeout','10');
const owner=new PrismaClient({datasourceUrl:url.toString()});url.searchParams.set('schema',schema);
const db=new PrismaClient({datasourceUrl:url.toString()});let created=false;
try{
 await owner.$executeRawUnsafe(`CREATE SCHEMA "${schema}"`);created=true;
 await owner.$executeRawUnsafe(`CREATE TYPE "${schema}"."VendorRole" AS ENUM ('SUPPLIER','SERVICE','BOTH','PRIVATE_SELLER')`);
 await owner.$executeRawUnsafe(`CREATE TABLE "${schema}"."Customer" (id text PRIMARY KEY DEFAULT gen_random_uuid()::text,name text NOT NULL,email text UNIQUE,phone varchar(32),ward text,city text,"userId" text UNIQUE,"createdAt" timestamp(3) NOT NULL DEFAULT now(),"updatedAt" timestamp(3) NOT NULL,address text,district text)`);
 await owner.$executeRawUnsafe(`CREATE TABLE "${schema}"."Vendor" (id text PRIMARY KEY DEFAULT gen_random_uuid()::text,name text NOT NULL UNIQUE,role "${schema}"."VendorRole" NOT NULL DEFAULT 'SUPPLIER',"isAuthorized" boolean NOT NULL DEFAULT false,email text,phone text,address text,note text,"createdAt" timestamp(3) NOT NULL DEFAULT now(),"updatedAt" timestamp(3) NOT NULL,"bankName" text,"bankAcc" text,"isActive" boolean NOT NULL DEFAULT true,UNIQUE(name,role))`);
 const bundle=await esbuild.build({entryPoints:[path.join(root,'src/domains/contacts/server/contact-directory.service.ts')],bundle:true,write:false,platform:'node',format:'cjs',packages:'external',plugins:[{name:'owned-database',setup(build){
  build.onResolve({filter:/^@\/server\/db\/client$/},()=>({path:'db',namespace:'fixture'}));build.onLoad({filter:/.*/,namespace:'fixture'},()=>({contents:'export const prisma=globalThis.__db'}));
  build.onResolve({filter:/^@\//},async({path:p})=>{for(const suffix of ['.ts','.tsx']){const file=path.join(root,p.replace(/^@\//,'src/'))+suffix;try{await fs.access(file);return{path:file}}catch{}}return null;});
 }}]});
 const fixtureModule={exports:{}};vm.runInNewContext(bundle.outputFiles[0].text,{module:fixtureModule,exports:fixtureModule.exports,require,__db:db,Date});const {saveContact,listContacts}=fixtureModule.exports;
 const fields={kind:'customers',name:'Fixture',phone:'090-fixture',email:'',address:''};
 const creations=await Promise.allSettled([saveContact(fields),saveContact({...fields,name:'Concurrent fixture'})]);
 assert.equal(creations.filter(r=>r.status==='fulfilled').length,1);assert.equal(await db.customer.count({where:{phone:fields.phone}}),1);
 const contact=await db.customer.findFirstOrThrow({where:{phone:fields.phone}});await db.customer.update({where:{id:contact.id},data:{city:'Preserve city',userId:'fixture-user'}});const current=await db.customer.findUniqueOrThrow({where:{id:contact.id}});
 await new Promise(resolve=>setTimeout(resolve,10));
 const update={...fields,id:current.id,updatedAt:current.updatedAt.toISOString()};
 const updates=await Promise.allSettled([saveContact({...update,name:'Concurrent A'}),saveContact({...update,name:'Concurrent B'})]);
 assert.equal(updates.filter(r=>r.status==='fulfilled').length,1,'exactly one concurrent editor can save the old version');
 const saved=await db.customer.findUniqueOrThrow({where:{id:contact.id}});assert.equal(saved.city,'Preserve city');assert.equal(saved.userId,'fixture-user');assert.ok(['Concurrent A','Concurrent B'].includes(saved.name));
 const legacy=await db.customer.create({data:{name:'Legacy shared phone',phone:fields.phone}});await new Promise(resolve=>setTimeout(resolve,10));assert.equal((await saveContact({...fields,id:legacy.id,updatedAt:legacy.updatedAt.toISOString(),name:'Legacy renamed'})).name,'Legacy renamed');
 await db.customer.createMany({data:Array.from({length:35},(_,n)=>({name:'Paging '+String(n).padStart(2,'0'),phone:'paging-'+n}))});const page=await listContacts('customers','Paging',2);assert.equal(page.total,35);assert.equal(page.items.length,5);
 await saveContact({kind:'vendors',name:'Vendor unique',phone:'',email:'',address:''});await assert.rejects(saveContact({kind:'vendors',name:'Vendor unique',phone:'',email:'',address:''}),error=>error.code==='P2002');
 console.log('PASS owned PostgreSQL fixture: contact paging, concurrent duplicate creates, concurrent stale edits, historical shared phone, preserved unrelated fields and vendor uniqueness. Disposable schema only.');
}finally{await db.$disconnect();if(created)await owner.$executeRawUnsafe(`DROP SCHEMA "${schema}" CASCADE`);await owner.$disconnect()}
