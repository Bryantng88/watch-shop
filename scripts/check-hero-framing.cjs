/* eslint-disable @typescript-eslint/no-require-imports -- Real editor, synthetic content/media ports. */
const assert=require('node:assert/strict'),fs=require('node:fs/promises'),path=require('node:path'),http=require('node:http');
const esbuild=require('./lib/admin-fixture-esbuild.cjs'),{chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
(async()=>{
 const root=path.resolve(__dirname,'..');
 const entry=`import React from 'react';import {createRoot} from 'react-dom/client';import StorefrontManager from './src/domains/storefront/content/StorefrontManager';import {AppToastProvider} from './src/domains/shared/feedback/AppToastProvider';import {AppDialogProvider} from './src/domains/shared/feedback/AppDialogProvider';createRoot(document.getElementById('root')).render(<AppToastProvider><AppDialogProvider><StorefrontManager homeOnly/></AppDialogProvider></AppToastProvider>);`;
 const bundle=await esbuild.build({stdin:{contents:entry,loader:'tsx',resolveDir:root},bundle:true,write:false,outfile:'/tmp/hero-framing/app.js',jsx:'automatic',define:{'process.env.NODE_ENV':'"production"'},plugins:[{name:'ports',setup(build){build.onResolve({filter:/^next\/(image|navigation)$/},args=>({path:args.path,namespace:'fixture'}));build.onLoad({filter:/.*/,namespace:'fixture'},args=>({loader:'tsx',resolveDir:root,contents:args.path==='next/navigation'?`export const usePathname=()=>'/admin/storefront/home';export const useRouter=()=>({refresh(){},push(){}});export const useSearchParams=()=>new URLSearchParams();`:`import React from'react';export default function Image({unoptimized,fill,priority,fetchPriority,sizes,...props}){return <img {...props}/>}` }));}}]});
 const {defaultHome}=await import('../src/domains/storefront/content/contract.ts');
 let content=defaultHome();content.hero.image={key:'storefront/hero/desktop.webp',alt:'Desktop hero',focalX:50,focalY:50};
 let revision=0;const posts=[];
 const css=(await require('postcss')([require('tailwindcss')({...require('../tailwind.config.js'),content:[path.join(root,'src/**/*.{ts,tsx}')]} )]).process(await fs.readFile(path.join(root,'src/app/globals.css'),'utf8'),{from:undefined})).css+bundle.outputFiles.find(file=>file.path.endsWith('.css')).text;
 const server=http.createServer(async(req,res)=>{
  if(req.url==='/app.js'){res.setHeader('content-type','text/javascript');return res.end(bundle.outputFiles.find(file=>file.path.endsWith('.js')).text);}
  if(req.url.startsWith('/api/admin/storefront/content')){if(req.method==='POST'){let data='';for await(const chunk of req)data+=chunk;const payload=JSON.parse(data);posts.push(payload);content=payload.content;revision++;}res.setHeader('content-type','application/json');return res.end(JSON.stringify({record:{id:'home',kind:'HOME',draft:content,revision,publishedAt:null,updatedAt:null},articles:[]}));}
  if(req.url.startsWith('/api/admin/storefront/products')){res.setHeader('content-type','application/json');return res.end(JSON.stringify({items:[]}));}
  if(req.url.startsWith('/api/admin/storefront/media')&&!req.url.includes('file')){res.setHeader('content-type','application/json');return res.end(JSON.stringify({items:[{key:'storefront/hero/desktop.webp',name:'Hero',url:'/desktop.svg'}]}));}
  if(req.url.includes('file')||req.url.endsWith('.svg')){res.setHeader('content-type','image/svg+xml');return res.end('<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600"><rect width="900" height="600" fill="#c1a684"/><circle cx="600" cy="300" r="120" fill="#fff" stroke="#333" stroke-width="12"/></svg>');}
  res.setHeader('content-type','text/html;charset=utf-8');res.end(`<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${css}</style><div id="root"></div><script src="/app.js"></script>`);
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const browser=await chromium.launch({headless:true});
 try{const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:'+server.address().port);
 const field=page.locator('fieldset.sfc-image').filter({has:page.locator('legend',{hasText:/^Ảnh desktop$/})});await field.locator('summary').click();
 const preview=page.frameLocator('iframe[title="Preview Hero trực tiếp"]');await preview.locator('.vg-hero').waitFor();
 await field.getByLabel('Thu phóng Ảnh desktop',{exact:true}).fill('2');await field.getByLabel('Lấy nét ngang Ảnh desktop',{exact:true}).fill('25');
 await page.waitForFunction(()=>{const image=document.querySelector('iframe[title="Preview Hero trực tiếp"]').contentDocument.querySelector('.vg-photo img');return image&&getComputedStyle(image).transform==='matrix(2, 0, 0, 2, 0, 0)';});
 assert.equal(await preview.locator('.vg-photo img').evaluate(el=>getComputedStyle(el).objectPosition),'25% 50%');assert.equal(posts.length,0,'live changes do not save or publish');
 await page.getByRole('button',{name:'Mobile',exact:true}).click();assert.equal(await preview.locator('.vg-photo img').evaluate(el=>getComputedStyle(el).transform),'matrix(2, 0, 0, 2, 0, 0)');
 await field.getByLabel('Thu phóng Ảnh desktop',{exact:true}).fill('0.5');await page.getByRole('button',{name:'Lưu nháp',exact:true}).click();await page.waitForFunction(()=>document.body.textContent.includes('Đã lưu nháp'));assert.equal(posts.at(-1).content.hero.image.zoom,0.5);
 await field.getByRole('button',{name:'Đặt lại căn chỉnh',exact:true}).click();assert.equal(await field.getByLabel('Thu phóng Ảnh desktop',{exact:true}).inputValue(),'1');
 content.hero.mobileImage={key:'storefront/hero/mobile.webp',alt:'Mobile hero',focalX:75,focalY:25,zoom:1.3};await page.reload();await page.getByRole('button',{name:'Mobile',exact:true}).click();
 await page.waitForFunction(()=>{const image=document.querySelector('iframe[title="Preview Hero trực tiếp"]').contentDocument?.querySelector('.vg-photo img');return image&&getComputedStyle(image).transform==='matrix(1.3, 0, 0, 1.3, 0, 0)';});assert.equal(await preview.locator('.vg-photo img').evaluate(el=>getComputedStyle(el).objectPosition),'75% 25%');
 for(const width of [320,390,1440]){await page.setViewportSize({width,height:1000});await page.getByRole('button',{name:'Desktop',exact:true}).click();assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));if(process.env.HERO_SCREENSHOTS){await fs.mkdir(process.env.HERO_SCREENSHOTS,{recursive:true});await page.locator('.sfc-hero-live').screenshot({path:path.join(process.env.HERO_SCREENSHOTS,`hero-${width}.png`)});}}
 assert.deepEqual(errors,[]);console.log('PASS real Hero editor: live zoom/focal preview, desktop/mobile fallback, draft payload, reset and 320/390/1440 overflow.');
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(error=>{console.error(error);process.exitCode=1});
