// Actual launcher with local fixture only; no conversations or production calls.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const http=require('node:http');
const esbuild=require('esbuild');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
(async()=>{
 const bundle=await esbuild.build({stdin:{contents:`import React,{useRef,useState}from'react';import{createRoot}from'react-dom/client';import BenLauncher from './src/domains/ai-assistant/BenLauncher';function App(){const ref=useRef(null),[open,setOpen]=useState(false);return <><div style={{height:1800}}>Trang nghiệp vụ mẫu</div><BenLauncher buttonRef={ref} open={open} live={true} onToggle={()=>setOpen(v=>!v)}/>{open&&<aside>Đang mở Ben<button onClick={()=>{setOpen(false);ref.current?.focus()}}>Đóng</button></aside>}</>}createRoot(document.getElementById('root')).render(<App/>);`,loader:'tsx',resolveDir:process.cwd()},bundle:true,platform:'browser',jsx:'automatic',write:false,define:{'process.env.NODE_ENV':'"production"'},plugins:[{name:'image',setup(build){build.onResolve({filter:/^next\/image$/},()=>({path:'image',namespace:'image'}));build.onLoad({filter:/.*/,namespace:'image'},()=>({contents:'import React from "react";export default function Image(props){return <img {...props}/>}',loader:'tsx',resolveDir:process.cwd()}));}}]});
 const css=fs.readFileSync(process.env.BEN_LAUNCHER_CSS||'/tmp/ben-launcher.css','utf8');
 const server=http.createServer((req,res)=>{if(req.url==='/app.js'){res.setHeader('content-type','text/javascript');res.end(bundle.outputFiles[0].text)}else if(req.url==='/ben/avatar.jpg'){res.setHeader('content-type','image/jpeg');res.end(fs.readFileSync('public/ben/avatar.jpg'))}else{res.setHeader('content-type','text/html; charset=utf-8');res.end('<meta name="viewport" content="width=device-width,initial-scale=1"><style>'+css+'body{margin:0}aside{position:fixed;top:0;left:0}</style><div id="root"></div><script src="/app.js"></script>')}});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_EXECUTABLE?{executablePath:process.env.CHROMIUM_EXECUTABLE}:{}),args:['--no-sandbox']});
 try{
  const origin='http://127.0.0.1:'+server.address().port;
  const page=await browser.newPage({viewport:{width:1280,height:800}});const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(origin);
  const button=page.getByRole('button',{name:'Mở Ben',exact:true});await button.waitFor();
  const inside=async p=>{const box=await p.getByRole('button',{name:'Mở Ben',exact:true}).boundingBox();const size=p.viewportSize();assert.ok(box.x>=0&&box.y>=0&&box.x+box.width<=size.width+1&&box.y+box.height<=size.height+1);return box};
  await button.click();await page.getByText('Đang mở Ben',{exact:false}).waitFor();await page.getByRole('button',{name:'Đóng',exact:true}).click();assert.equal(await button.evaluate(el=>el===document.activeElement),true);
  let box=await button.boundingBox();await page.mouse.move(box.x+30,box.y+30);await page.mouse.down();await page.mouse.move(250,200,{steps:12});await page.mouse.up();assert.equal(await page.locator('aside').count(),0);box=await inside(page);assert.ok(box.x<400&&box.y<300);
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('ben.launcher.position.v1')));assert.ok(saved.x>=0&&saved.x<=1&&saved.y>=0&&saved.y<=1);
  await page.reload();await button.waitFor();await page.waitForTimeout(100);const restored=await button.boundingBox();assert.ok(Math.abs(restored.x-box.x)<2&&Math.abs(restored.y-box.y)<2);
  await button.focus();await page.keyboard.press('Enter');await page.locator('aside').waitFor();await page.getByRole('button',{name:'Đóng',exact:true}).click();
  const before=await button.boundingBox();await page.keyboard.press('Alt+ArrowLeft');assert.ok((await button.boundingBox()).x<before.x);
  await page.setViewportSize({width:320,height:640});await page.waitForTimeout(100);await inside(page);
  box=await button.boundingBox();await page.mouse.move(box.x+20,box.y+20);await page.mouse.down();await page.mouse.move(-200,-200,{steps:8});await page.mouse.up();await inside(page);assert.equal(await page.locator('aside').count(),0);
  await button.click();await page.locator('aside').waitFor();await page.getByRole('button',{name:'Đóng',exact:true}).click();
  const touch=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const phone=await touch.newPage();await phone.goto(origin);const mobile=phone.getByRole('button',{name:'Mở Ben',exact:true});await mobile.waitFor();await phone.waitForTimeout(100);await mobile.tap();await phone.locator('aside').waitFor();await phone.getByRole('button',{name:'Đóng',exact:true}).tap();box=await mobile.boundingBox();
  const session=await touch.newCDPSession(phone);const point=(x,y)=>[{x,y}];await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:point(box.x+25,box.y+25)});for(let i=1;i<=8;i++)await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:point(box.x+25+(70-box.x-25)*i/8,box.y+25+(180-box.y-25)*i/8)});await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  assert.equal(await phone.locator('aside').count(),0);assert.equal(await phone.evaluate(()=>scrollY),0);await inside(phone);await mobile.tap();await phone.locator('aside').waitFor();await phone.getByRole('button',{name:'Đóng',exact:true}).tap();await phone.setViewportSize({width:844,height:390});await phone.waitForTimeout(100);await inside(phone);await touch.close();
  const blocked=await browser.newContext();await blocked.addInitScript(()=>{Storage.prototype.getItem=()=>{throw Error('blocked')};Storage.prototype.setItem=()=>{throw Error('blocked')}});const privatePage=await blocked.newPage();await privatePage.goto(origin);await privatePage.getByRole('button',{name:'Mở Ben',exact:true}).click();await privatePage.locator('aside').waitFor();await blocked.close();assert.deepEqual(errors,[]);
  console.log('PASS: mouse/touch drag, no accidental open/scroll, click/keyboard open and return focus, persistence, bounds at 320px and rotated viewport, blocked storage.');
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(e=>{console.error(e);process.exitCode=1});
