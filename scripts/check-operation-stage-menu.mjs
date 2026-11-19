// Actual navigation/list/menu components with synthetic records and editor/action ports.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import esbuild from 'esbuild';
import postcss from 'postcss';
import tailwind from 'tailwindcss';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const entry=`import React,{useState,useImperativeHandle}from'react';import{createRoot}from'react-dom/client';import{MediaRowActions}from'./src/domains/coordination/ui/MediaRowActions';
const actions=[{actionKey:'edit',label:'Mở trình sửa',manualActionLabel:'Mở trình sửa',enabled:true,metadata:{intent:'OPEN_TARGET'}},{actionKey:'publish',label:'Đăng bài',manualActionLabel:'Đăng bài',enabled:true,metadata:{}}];
const item={id:'media1',targetId:'watch1',targetType:'WATCH',preview:{title:'Đồng hồ mẫu'},manualTransitions:actions};
function App(){const[disabled,setDisabled]=useState(false);return <div><button id="pending" onClick={()=>setDisabled(v=>!v)}>Đổi pending</button><table style={{tableLayout:'fixed',width:'100%',minWidth:0}}><tbody><tr><td style={{width:180}}><MediaRowActions item={item} actions={actions} status={<span>Chưa xử lý</span>} disabled={disabled} onActivate={()=>{window.__activate=(window.__activate||0)+1}} onTransitionApplied={()=>{}} onAction={action=>{window.__command=action.actionKey}}/></td><td>Media</td></tr></tbody></table><button id="outside">Ngoài menu</button></div>};createRoot(document.getElementById('root')).render(<App/>);`;
const mocks={name:'ports',setup(build){
 build.onResolve({filter:/QueueWorkQueue$/},()=>({path:'queue',namespace:'fixture'}));
 build.onResolve({filter:/manual-transition-feedback$/},()=>({path:'labels',namespace:'fixture'}));
 build.onResolve({filter:/^next\/(image|navigation|link)$/},({path:p})=>({path:p,namespace:'fixture'}));
 build.onLoad({filter:/.*/,namespace:'fixture'},({path:p})=>({loader:'tsx',resolveDir:root,contents:p==='queue'?`import React,{useState,useImperativeHandle}from'react';export const isOpenTargetTransition=t=>t.metadata?.intent==='OPEN_TARGET';export function OpenTargetAction({triggerRef,onActivate,className}){const[open,setOpen]=useState(false);const[text,setText]=useState('');useImperativeHandle(triggerRef,()=>()=>{onActivate?.();setOpen(true)});return <><button className={className}>Mở editor</button>{open&&<div role="dialog" aria-label="Editor port"><input aria-label="Bản sửa" value={text} onChange={e=>setText(e.target.value)}/><button onClick={()=>setOpen(false)}>Đóng editor</button></div>}</>}`:p==='labels'?`export const manualTransitionActionLabel=t=>t.manualActionLabel||t.label;`:p==='next/image'?`import React from'react';export default function Image({unoptimized,...props}){return <img {...props}/>} `:p==='next/navigation'?`export const useRouter=()=>({push(){}});`:`import React from'react';export default function Link(props){return <a {...props}/>}`}));
}};
const opts={bundle:true,platform:'browser',jsx:'automatic',write:false,outfile:'/tmp/operation-stage-menu.js',define:{'process.env.NODE_ENV':'"production"'},plugins:[mocks],preserveSymlinks:true,absWorkingDir:root,tsconfig:path.join(root,'tsconfig.check.json')};
const technical=await esbuild.build({...opts,entryPoints:[path.join(root,'tests/browser/technical-issue-list.fixture.tsx')]});
const media=await esbuild.build({...opts,stdin:{contents:entry,loader:'tsx',resolveDir:root}});
const css=(await postcss([tailwind({content:[path.join(root,'src/**/*.{ts,tsx}'),path.join(root,'tests/browser/technical-issue-list.fixture.tsx')],corePlugins:{preflight:true}})]).process(await fs.readFile(path.join(root,'src/app/globals.css'),'utf8'),{from:undefined})).css;
const server=http.createServer((req,res)=>{const build=req.url.startsWith('/media')?media:technical;res.setHeader('content-type','text/html; charset=utf-8');res.end('<!doctype html><html lang="vi"><meta name="viewport" content="width=device-width,initial-scale=1"><style>'+css+'\n'+build.outputFiles.find(f=>f.path.endsWith('.css')).text+'\nbody{margin:0;background:white}.fixture-canvas{padding:20px 24px}.fixture-controls{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:16px}.fixture-search{flex:1;min-width:0}.fixture-search input{width:100%;min-width:0}.fixture-search svg{display:none}.fixture-board{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.fixture-board button{overflow-wrap:anywhere}.fixture-overlay{position:fixed;inset:0;background:#fff;z-index:50}@media(max-width:639px){.fixture-canvas{padding:12px 16px}}</style><div id="root"></div><script>'+build.outputFiles.find(f=>f.path.endsWith('.js')).text+'</script></html>');});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const origin='http://127.0.0.1:'+server.address().port;let browser;
try{
 browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_EXECUTABLE?{executablePath:process.env.CHROMIUM_EXECUTABLE}:{}),args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(origin+'/?navigation&tiLayout=list');await page.getByRole('table',{name:'Danh sách TI',exact:true}).waitFor();
 const stages=page.getByRole('group',{name:'Giai đoạn Kỹ thuật',exact:true});await stages.waitFor();assert.equal(await page.getByRole('group',{name:'Trạng thái TI',exact:true}).count(),0);
 await stages.getByRole('button',{name:/^Chờ xử lý/}).click();await page.waitForFunction(()=>window.__tiQA.getState().scope==='READY');
 await page.getByRole('combobox',{name:'Sắp xếp TI'}).selectOption('UPDATED');await page.getByRole('textbox',{name:'Tìm TI'}).fill('máy');
 await stages.getByRole('button',{name:/^Đang xử lý/}).click();assert.equal(await page.getByRole('textbox',{name:'Tìm TI'}).inputValue(),'máy');assert.equal((await page.evaluate(()=>window.__tiQA.getState())).sort,'UPDATED');
 await page.getByRole('button',{name:'Board',exact:true}).click();await page.getByRole('button',{name:'List',exact:true}).click();assert.equal((await page.evaluate(()=>window.__tiQA.getState())).scope,'PROCESSING');assert.equal(await page.getByRole('textbox',{name:'Tìm TI'}).inputValue(),'máy');
 for(const width of [320,390,768,1280,1440]){await page.setViewportSize({width,height:1000});await page.waitForFunction(()=>{const el=document.querySelector('[data-admin-pane=content]').parentElement;return el.dataset.wide===String(el.clientWidth>=960)});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'technical overflow '+width);if(width<1000){await page.getByRole('combobox',{name:'Giai đoạn Kỹ thuật'}).selectOption('DONE');assert.equal((await page.evaluate(()=>window.__tiQA.getState())).scope,'DONE');}if(process.env.STAGE_MENU_SCREENSHOT_DIR){await fs.mkdir(process.env.STAGE_MENU_SCREENSHOT_DIR,{recursive:true});await page.screenshot({path:path.join(process.env.STAGE_MENU_SCREENSHOT_DIR,'technical-'+width+'.png'),fullPage:true});}}
 await page.goto(origin+'/media');const trigger=page.getByRole('button',{name:'Xử lý: Đồng hồ mẫu',exact:true});await trigger.waitFor();assert.equal(await page.getByRole('button',{name:'Thêm thao tác'}).count(),0);
 await trigger.press('ArrowDown');const menu=page.getByRole('menu');await menu.waitFor();assert.equal(await menu.getByRole('menuitem').count(),2);await page.keyboard.press('End');assert.equal(await menu.getByRole('menuitem',{name:'Đăng bài'}).evaluate(el=>el===document.activeElement),true);await page.keyboard.press('Escape');assert.equal(await trigger.evaluate(el=>el===document.activeElement),true);
 await trigger.click();await menu.getByRole('menuitem',{name:'Mở trình sửa'}).click();const editor=page.getByRole('dialog',{name:'Editor port'});await editor.waitFor();await editor.getByRole('textbox',{name:'Bản sửa'}).fill('Bản sửa vẫn còn');assert.equal(await editor.getByRole('textbox').inputValue(),'Bản sửa vẫn còn');assert.equal(await page.evaluate(()=>window.__activate),1);assert.equal(await menu.count(),0);await editor.getByRole('button',{name:'Đóng editor'}).click();
 await trigger.click();await menu.getByRole('menuitem',{name:'Đăng bài'}).click();assert.equal(await page.evaluate(()=>window.__command),'publish');
 await trigger.click();await page.mouse.click(700,500);assert.equal(await menu.count(),0);await page.locator('#pending').click();assert.equal(await trigger.isDisabled(),true);await page.locator('#pending').click();
 await page.setViewportSize({width:320,height:650});await trigger.click();const box=await menu.boundingBox();assert.ok(box.x>=0&&box.x+box.width<=320);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 assert.deepEqual(errors,[]);console.log('PASS real split navigation + TI list: external stages, native narrow selection, retained query/sort, 320/390/768/1280/1440; real Media action component/menu: one trigger, all enabled actions, keyboard/Escape/outside, pending, popup bounds, editor remains mounted. Synthetic editor/action/data ports only.');
}finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
