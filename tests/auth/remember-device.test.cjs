const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const esbuild = require('esbuild');
const path = require('node:path');
async function fixture() {
 const state={cookies:[],active:true,passwordOK:true,lastLogin:0};
 const built=await esbuild.build({entryPoints:['src/app/(admin)/admin/auth/_server/auth.service.ts'],bundle:true,platform:'node',format:'cjs',write:false,plugins:[{name:'auth-fixture',setup(build){
  build.onResolve({filter:/^(next\/headers|bcryptjs|\.\/auth\.repo)$/},args=>({path:args.path,namespace:'auth-fixture'}));
  build.onLoad({filter:/.*/,namespace:'auth-fixture'},args=>({contents:args.path==='next/headers'?'export async function cookies(){return {set:(...args)=>globalThis.__state.cookies.push(args)}}':args.path==='bcryptjs'?'export default {compare:async()=>globalThis.__state.passwordOK}':'export async function findUserByEmail(){return {id:"fixture-user",isActive:globalThis.__state.active,passwordHash:"fixture-only",roles:[],email:"long@example.invalid",name:"Long"}};export async function updateLastLogin(){globalThis.__state.lastLogin++}'}));
 }}]});
 const module={exports:{}};
 vm.runInNewContext(built.outputFiles[0].text,{module,exports:module.exports,require,Buffer,process:{env:{NODE_ENV:'production',AUTH_SECRET:'synthetic-only-secret-at-least-32-characters'}},__state:state});
 return {state,login:module.exports.loginService};
}
test('remembered login aligns signed token with protected cookie; default remains 12 hours',async()=>{
 const {state,login}=await fixture();
 const {createHmac}=require('node:crypto');
 for(const rememberDevice of [undefined,false,true]){
  const before=Math.floor(Date.now()/1000);
  await login({email:'long@example.invalid',password:'fixture',...(rememberDevice===undefined?{}:{rememberDevice})});
  const [name,token,options]=state.cookies.at(-1);const [id,expiry,signature]=token.split('.');
  const maxAge=rememberDevice?30*86400:12*3600;
  assert.equal(name,'auth_token');assert.equal(id,'fixture-user');
  assert.ok(Number(expiry)>=before+maxAge && Number(expiry)<=Math.floor(Date.now()/1000)+maxAge);
  assert.equal(signature,createHmac('sha256','synthetic-only-secret-at-least-32-characters').update(`${id}.${expiry}`).digest('base64url'));
  assert.deepEqual(JSON.parse(JSON.stringify(options)),{httpOnly:true,sameSite:'lax',secure:true,path:'/',maxAge});
 }
 assert.equal(state.lastLogin,3);
});
test('invalid remember flags, wrong passwords and disabled users never issue a cookie',async()=>{
 for(const rememberDevice of ['true','false',1,null]){
  const {state,login}=await fixture();await assert.rejects(login({email:'long@example.invalid',password:'fixture',rememberDevice}));assert.equal(state.cookies.length,0);
 }
 for(const flag of ['active','passwordOK']){
  const {state,login}=await fixture();state[flag]=false;
  await assert.rejects(login({email:'long@example.invalid',password:'fixture',rememberDevice:true}));assert.equal(state.cookies.length,0);assert.equal(state.lastLogin,0);
 }
});
