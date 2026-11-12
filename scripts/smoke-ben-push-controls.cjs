// Actual settings component, synthetic Push APIs and HTTP responses. No real push.
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const http=require('node:http');
const path=require('node:path');
const esbuild=require('esbuild');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
(async()=>{
 const root=path.resolve(__dirname,'..');
 const result=await esbuild.build({stdin:{contents:`import React from 'react';import {createRoot} from 'react-dom/client';import BenPushControls from './src/domains/ai-assistant/BenPushControls';import {History,Plus} from 'lucide-react';createRoot(document.getElementById('root')).render(<header style={{display:'flex',justifyContent:'space-between',padding:16}}><div><b>Ben</b><p style={{fontSize:12,color:'#64748b'}}>Cùng bạn xử lý công việc</p></div><div style={{display:'flex',gap:4,alignItems:'center'}}><BenPushControls/><History size={19}/><Plus size={19}/></div></header>);`,loader:'tsx',resolveDir:root},bundle:true,platform:'browser',jsx:'automatic',write:false,define:{'process.env.NODE_ENV':'"production"'}});
 const css=process.env.BEN_PUSH_PREVIEW_CSS?await fs.readFile(process.env.BEN_PUSH_PREVIEW_CSS,'utf8'):'';
 const server=http.createServer((req,res)=>{if(req.url==='/app.js'){res.setHeader('content-type','text/javascript');res.end(result.outputFiles[0].text);}else{res.setHeader('content-type','text/html');res.end(`<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${css}\nbody{margin:0;font-family:Arial,sans-serif}button{cursor:pointer}header{max-width:768px;margin:auto}</style><div id="root"></div><script src="/app.js"></script>`);}});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const origin=`http://127.0.0.1:${server.address().port}`;
 const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_EXECUTABLE?{executablePath:process.env.CHROMIUM_EXECUTABLE}:{}),args:['--no-sandbox']});
 try{
  async function scenario(name){
   const context=await browser.newContext({viewport:{width:390,height:844}});
   await context.addInitScript(({name})=>{
    window.__permissionRequests=0;window.__posts=[];window.__mode=name;window.__enabled=name==='enabled';
    let permission=name==='denied'?'denied':name==='enabled'?'granted':'default';
    Object.defineProperty(window,'Notification',{configurable:true,value:class{static get permission(){return permission;}static requestPermission(){window.__permissionRequests++;permission='granted';return Promise.resolve(permission);}}});
    Object.defineProperty(window,'PushManager',{configurable:true,value:function(){}});
    const sub={endpoint:'https://fcm.googleapis.com/fcm/send/synthetic',toJSON(){return{endpoint:this.endpoint,keys:{p256dh:'x'.repeat(87),auth:'x'.repeat(22)}};},unsubscribe:async()=>true};
    Object.defineProperty(navigator,'serviceWorker',{configurable:true,value:{addEventListener(){},removeEventListener(){},getRegistration:async()=>window.__mode==='worker'?undefined:{active:{scriptURL:location.origin+(name==='foreign-worker'?'/storefront-sw.js':'/ben-sw.js')},pushManager:{getSubscription:async()=>window.__enabled?sub:null,subscribe:async()=>{window.__enabled=true;return sub;}}}}});
    if(name==='unsupported')delete window.PushManager;
    if(name==='ios')Object.defineProperty(navigator,'userAgent',{configurable:true,get:()=> 'iPhone Safari'});
   },{name});
   const page=await context.newPage();
   await page.route('**/api/admin/customer-assistant*',async route=>{
    if(route.request().method()==='GET'){
     const mode=await page.evaluate(()=>window.__mode);
     if(mode==='error')return route.fulfill({status:503,body:'{}'});
     return route.fulfill({json:{publicKey:mode==='unconfigured'?null:'synthetic-key'}});
    }
    const body=route.request().postDataJSON();await page.evaluate(body=>{window.__posts.push(body.action);if(body.action==='unsubscribe-push')window.__enabled=false;},body);
    return route.fulfill({json:body.action==='push-status'?{enabled:true}:{ok:true}});
   });
   await page.goto(origin+'/?case='+name);
   await page.getByRole('button',{name:'Thông báo Ben',exact:true}).click();
   const dialog=page.getByRole('dialog',{name:'Cài đặt thông báo Ben',exact:true});await dialog.waitFor();
   return {page,context,dialog};
  }
  for(const [name,text] of [['unconfigured','Chưa sẵn sàng'],['unsupported','Thiết bị chưa hỗ trợ'],['error','Chưa kiểm tra được'],['denied','Trình duyệt đang chặn'],['worker','Đang chuẩn bị'],['foreign-worker','Đang chuẩn bị'],['ios','Cài Ben trước']]){
   const {page,context,dialog}=await scenario(name);await dialog.getByText(text,{exact:true}).waitFor();assert.equal(await dialog.getByRole('button',{name:'Bật thông báo',exact:true}).count(),0);assert.equal(await page.evaluate(()=>window.__permissionRequests),0);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   if(name==='error'){await page.evaluate(()=>window.__mode='ready');await dialog.getByRole('button',{name:'Kiểm tra lại',exact:true}).click();await dialog.getByRole('button',{name:'Bật thông báo',exact:true}).waitFor();}
   if(name==='unconfigured'&&process.env.BEN_PUSH_SCREENSHOT)await page.screenshot({path:process.env.BEN_PUSH_SCREENSHOT});
   await context.close();
  }
  const enabled=await scenario('enabled');await enabled.dialog.getByText('Đã bật trên thiết bị này',{exact:true}).waitFor();assert.equal(await enabled.page.evaluate(()=>window.__permissionRequests),0);await enabled.context.close();
  const {page,context,dialog}=await scenario('ready');
  await dialog.getByRole('button',{name:'Bật thông báo',exact:true}).waitFor();assert.equal(await page.evaluate(()=>window.__permissionRequests),0);
  await dialog.getByRole('button',{name:'Bật thông báo',exact:true}).click();await dialog.getByText('Đã bật trên thiết bị này',{exact:true}).waitFor();assert.equal(await page.evaluate(()=>window.__permissionRequests),1);
  await dialog.getByRole('button',{name:'Gửi thử',exact:true}).click();await dialog.getByText(/Đã gửi yêu cầu thử/).waitFor();assert.ok((await page.evaluate(()=>window.__posts)).includes('test-push'));
  await dialog.getByRole('button',{name:'Tắt thông báo',exact:true}).click();await dialog.getByText('Chưa bật',{exact:true}).waitFor();
  await page.keyboard.press('Escape');await dialog.waitFor({state:'hidden'});assert.equal(await dialog.count(),0);assert.equal(await page.getByRole('button',{name:'Thông báo Ben',exact:true}).evaluate(el=>el===document.activeElement),true);
  await context.close();
  console.log('PASS: visible bell for all states; missing configuration, denied permission, unsupported browser, iOS install, worker readiness and retry; explicit permission gesture; enable/test/disable; Escape focus; mobile no overflow.');
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(error=>{console.error(error);process.exitCode=1;});
