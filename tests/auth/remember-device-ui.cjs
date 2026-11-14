// Actual login component; synthetic credentials and local HTTP boundary only.
const assert=require('node:assert/strict');
const http=require('node:http');
const esbuild=require('esbuild');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
(async()=>{
 const built=await esbuild.build({stdin:{contents:`import React from 'react';import{createRoot}from'react-dom/client';import LoginForm from './src/app/(admin)/login/_client/LoginForm';createRoot(document.getElementById('root')).render(<LoginForm destination="/admin/personal-work?view=list&item=fixture"/>);`,loader:'tsx',resolveDir:process.cwd()},bundle:true,platform:'browser',jsx:'automatic',write:false,define:{'process.env.NODE_ENV':'"production"'}});
 const sent=[];let fail=false;
 const server=http.createServer(async(req,res)=>{
  if(req.url==='/api/auth/login'){let body='';for await(const part of req)body+=part;sent.push(JSON.parse(body));res.writeHead(fail?401:200,{'content-type':'application/json'});res.end(JSON.stringify(fail?{error:'Thử sai mật khẩu'}:{user:{id:'fixture'}}));}
  else if(req.url.startsWith('/admin/'))res.end('Destination');
  else if(req.url==='/app.js'){res.setHeader('content-type','text/javascript');res.end(built.outputFiles[0].text);}
  else {res.setHeader('content-type','text/html; charset=utf-8');res.end('<meta name="viewport" content="width=device-width,initial-scale=1"><div id="root"></div><script src="/app.js"></script>');}
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_EXECUTABLE?{executablePath:process.env.CHROMIUM_EXECUTABLE}:{}),args:['--no-sandbox']});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const origin='http://127.0.0.1:'+server.address().port;
  for(const remember of [false,true]){
   await page.goto(origin);const check=page.getByRole('checkbox',{name:'Ghi nhớ thiết bị này trong 30 ngày'});await check.waitFor();assert.equal(await check.isChecked(),false);if(remember)await check.check();
   await page.getByRole('textbox',{name:'Email',exact:true}).fill('fixture@example.invalid');await page.getByLabel('Mật khẩu',{exact:true}).fill('synthetic-only');
   await page.getByRole('button',{name:'Đăng nhập',exact:true}).click();await page.waitForURL('**/admin/personal-work?view=list&item=fixture');assert.equal(sent.at(-1).rememberDevice,remember);
  }
  fail=true;await page.goto(origin);await page.getByRole('checkbox').check();await page.getByLabel('Email',{exact:true}).fill('fixture@example.invalid');await page.getByLabel('Mật khẩu',{exact:true}).fill('synthetic-only');await page.getByRole('button',{name:'Đăng nhập',exact:true}).click();await page.getByText('Thử sai mật khẩu',{exact:true}).waitFor();assert.equal(await page.getByRole('checkbox').isChecked(),true);assert.equal(await page.getByRole('button',{name:'Đăng nhập',exact:true}).isEnabled(),true);assert.deepEqual(errors,[]);
  console.log('PASS: unchecked 12-hour login, remembered login, original deep-link destination, failure retry.');
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(e=>{console.error(e);process.exitCode=1});
