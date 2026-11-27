/* eslint-disable @typescript-eslint/no-require-imports -- Production Next navigation fixture with synthetic delayed pages, no database/auth service. */
const assert=require('node:assert/strict'),fs=require('node:fs/promises'),path=require('node:path'),os=require('node:os'),http=require('node:http'),{spawn}=require('node:child_process');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
const root=path.resolve(__dirname,'..');
async function run(command,args,options){await new Promise((resolve,reject)=>{const child=spawn(command,args,options);child.on('error',reject);child.on('exit',code=>code===0?resolve():reject(new Error(`${command} exited ${code}`)));});}
(async()=>{
 const fixture=await fs.mkdtemp(path.join(os.tmpdir(),'admin-navigation-'));let server,browser;
 try{
  async function write(file,source){const target=path.join(fixture,file);await fs.mkdir(path.dirname(target),{recursive:true});await fs.writeFile(target,source);}
  await fs.symlink(path.join(root,'node_modules'),path.join(fixture,'node_modules'),'dir');
  await write('package.json',JSON.stringify({private:true,name:'admin-navigation-synthetic-fixture',version:'1.0.0'}));
  await write('next.config.js',`module.exports={experimental:{externalDir:true,cpus:1},eslint:{ignoreDuringBuilds:true},devIndicators:false,webpack(config){config.resolve.alias['@']=${JSON.stringify(path.join(root,'src'))};return config;}};`);
  await write('tsconfig.json',JSON.stringify({compilerOptions:{target:'ES2017',lib:['dom','dom.iterable','esnext'],allowJs:true,skipLibCheck:true,strict:true,noEmit:true,esModuleInterop:true,module:'esnext',moduleResolution:'bundler',resolveJsonModule:true,isolatedModules:true,jsx:'preserve',plugins:[{name:'next'}],baseUrl:'.',paths:{'@/*':[path.join(root,'src/*')]}},include:['next-env.d.ts','**/*.ts','**/*.tsx','.next/types/**/*.ts'],exclude:['node_modules']}));
  await write('app/layout.tsx','export default function Root({children}:{children:React.ReactNode}){return <html><body style={{margin:0,fontFamily:"Arial"}}>{children}</body></html>;}');
  await write('app/admin/layout.tsx',`import {cookies} from 'next/headers';import {AdminTopNavigation} from '@/app/(admin)/admin/_client/AdmidSideBar';import {AdminButtonProvider} from '@/domains/shared/ui/admin-design-contract/AdminButton';export default async function Layout({children}:{children:React.ReactNode}){const limited=(await cookies()).get('fixture-role')?.value==='restricted';return <AdminButtonProvider><header data-fixture-shell><AdminTopNavigation user={{roles:[],permissions:limited?['ACCESSORY_VIEW','ORDER_VIEW','TASK_VIEW']:['PRODUCT_VIEW','ACQUISITION_VIEW_ALL','TASK_VIEW']}}/></header>{children}</AdminButtonProvider>;}`);
  await write('app/admin/loading.tsx',`export {default} from '@/app/(admin)/admin/loading';`);
  for(const route of ['watches','straps','acquisitions','orders','personal-work','coordination/operation']){
   await write(`app/admin/${route}/page.tsx`,`export const dynamic='force-dynamic';export default async function Page(){await new Promise(resolve=>setTimeout(resolve,1500));return <h1 data-fixture-page=${JSON.stringify(route)}>${route}</h1>;}`);
  }
  for(const [route,target] of [['products','watches'],['trading','acquisitions']])await write(`app/admin/${route}/page.tsx`,`import {redirect} from 'next/navigation';export default function Alias(){redirect('/admin/${target}');}`);
  const env={...process.env,NEXT_TELEMETRY_DISABLED:'1'};
  const log=path.join(fixture,'build.log');const logHandle=await fs.open(log,'w');
  try{await run(process.execPath,[require.resolve('next/dist/bin/next'),'build'],{cwd:fixture,env,stdio:['ignore',logHandle.fd,logHandle.fd]});}catch(error){console.error((await fs.readFile(log,'utf8')).slice(-10000));throw error;}finally{await logHandle.close();}
  const port=await new Promise(resolve=>{const listener=http.createServer();listener.listen(0,'127.0.0.1',()=>{const selected=listener.address().port;listener.close(()=>resolve(selected));});});
  server=spawn(process.execPath,[require.resolve('next/dist/bin/next'),'start','-H','127.0.0.1','-p',String(port)],{cwd:fixture,env,stdio:'ignore'});const origin='http://127.0.0.1:'+port;
  let ready=false;for(let i=0;i<100;i++){try{const response=await fetch(origin+'/admin/personal-work');if(response.ok){ready=true;break;}}catch{}await new Promise(resolve=>setTimeout(resolve,100));}assert.ok(ready,'production Next fixture starts');
  browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_EXECUTABLE?{executablePath:process.env.CHROMIUM_EXECUTABLE}:{}),args:['--no-sandbox']});
  const page=await browser.newPage({viewport:{width:1600,height:900}});page.setDefaultTimeout(10000);const aliases=[];page.on('request',request=>{const path=new URL(request.url()).pathname;if(['/admin/products','/admin/trading'].includes(path))aliases.push(path);});
  await page.goto(origin+'/admin/personal-work');await page.locator('[data-fixture-page=personal-work]').waitFor();const nav=page.getByRole('navigation',{name:'Điều hướng quản trị'});
  assert.equal(await nav.getByRole('link',{name:'Sản phẩm',exact:true}).getAttribute('href'),'/admin/watches');assert.equal(await nav.getByRole('link',{name:'Mua bán',exact:true}).getAttribute('href'),'/admin/acquisitions');
  for(const [label,target] of [['Mua bán','acquisitions'],['Vận hành','coordination/operation'],['Sản phẩm','watches']]){
   await nav.getByRole('link',{name:label,exact:true}).click();await page.getByRole('status',{name:'Đang tải nội dung',exact:true}).waitFor({timeout:1200});assert.ok(await nav.isVisible(),'shared navigation remains usable while content streams');await page.locator(`[data-fixture-page="${target}"]`).waitFor();await page.getByRole('status',{name:'Đang tải nội dung',exact:true}).waitFor({state:'hidden'});assert.equal(new URL(page.url()).pathname,'/admin/'+target);assert.equal(await nav.getByRole('link',{name:label,exact:true}).getAttribute('aria-current'),'page');
  }
  assert.deepEqual(aliases,[],'normal section navigation never requests redirect aliases');
  await page.context().addCookies([{name:'fixture-role',value:'restricted',url:origin}]);await page.goto(origin+'/admin/personal-work');await page.locator('[data-fixture-page=personal-work]').waitFor();assert.equal(await nav.getByRole('link',{name:'Sản phẩm',exact:true}).getAttribute('href'),'/admin/straps');assert.equal(await nav.getByRole('link',{name:'Mua bán',exact:true}).getAttribute('href'),'/admin/orders');
  await page.setViewportSize({width:390,height:844});await nav.getByRole('combobox',{name:'Khu vực quản trị',exact:true}).selectOption('/admin/orders');await page.locator('[data-fixture-page=orders]').waitFor();assert.deepEqual(aliases,[]);
  console.log('PASS production Next navigation: one canonical destination per section, permission-dependent product/trading targets, real loading stream before delayed page, persistent shell, active state and mobile select. Synthetic delays only; no production latency claim.');
 }finally{if(browser)await browser.close();if(server)await new Promise(resolve=>{const timer=setTimeout(()=>server.kill('SIGKILL'),3000);server.once('exit',()=>{clearTimeout(timer);resolve();});server.kill('SIGTERM');});await fs.rm(fixture,{recursive:true,force:true});}
})().catch(error=>{console.error(error);process.exitCode=1});
