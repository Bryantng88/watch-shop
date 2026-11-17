// Render the production dashboard with synthetic queues; no API or database access.
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const esbuild = require('esbuild');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');

async function main() {
  const root = path.resolve(__dirname, '..');
  const output = '/tmp/operations-compact';
  await fs.mkdir(output, { recursive: true });
  const entry = `import React from 'react';import {createRoot} from 'react-dom/client';import Dashboard from './src/domains/admin-home/ui/OperationsDashboard';
const keys=['orders','purchase-requests','media','technical','payments','personal-work'];
const labels=['Chờ xử lý','Đang xử lý','Đã sẵn sàng'];
const queues=keys.map((key,i)=>({key,label:key,description:'Mô tả khu vực',href:'/admin/'+key,activeCount:10,actionLabel:'Mở',insights:[{key:'wait',label:'việc cần kiểm tra',count:3,href:'/admin/'+key+'?attention=1',severity:'attention'}],stages:labels.map((label,n)=>({key:key+n,label,count:[7,3,0][n],href:'/admin/'+key+'?stage='+n,actionLabel:'Mở',metrics:[{label:'Thời gian chờ',value:'3 ngày',detail:'Dữ liệu mẫu'}]}))}));
const data={generatedAt:'2026-11-17T03:00:00Z',totalActive:60,queues,completionTrend:[{date:'2026-11-17',label:'17/11',count:2}],attention:[],priorityAction:null};
window.renderFixture=(empty=false)=>createRoot(document.getElementById('root')).render(<Dashboard data={empty?{...data,totalActive:0,queues:[]}:data}/>);window.renderFixture(new URLSearchParams(location.search).has('empty'));`;
  await esbuild.build({stdin:{contents:entry,loader:'tsx',resolveDir:root},outfile:path.join(output,'app.js'),bundle:true,platform:'browser',jsx:'automatic',define:{'process.env.NODE_ENV':'"production"'},plugins:[{name:'fixture-link',setup(build){
    build.onResolve({filter:/^next\/link$/},()=>({path:'link',namespace:'fixture'}));
    build.onLoad({filter:/.*/,namespace:'fixture'},()=>({contents:`import React from 'react';export default function Link(props){return <a {...props}/>}`,loader:'tsx',resolveDir:root}));
  }}]});
  const css=await fs.readFile(process.env.OPERATIONS_PREVIEW_CSS || '/tmp/operations-ui.css','utf8');
  const js=await fs.readFile(path.join(output,'app.js'),'utf8');
  const moduleCss=await fs.readFile(path.join(output,'app.css'),'utf8');
  const server=http.createServer((req,res)=>{res.setHeader('content-type',req.url==='/app.js'?'text/javascript':'text/html');res.end(req.url==='/app.js'?js:`<!doctype html><html lang="vi"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>${css}\n${moduleCss}\nbody{margin:0;font-family:Arial,sans-serif}</style><div id="root"></div><script src="/app.js"></script></html>`);});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_EXECUTABLE?{executablePath:process.env.CHROMIUM_EXECUTABLE}:{}),args:['--no-sandbox']});
  try {
    const page=await browser.newPage();
    const errors=[];page.on('pageerror',error=>errors.push(error.message));
    for(const width of [360,390,768,1440]){
      await page.setViewportSize({width,height:1000});
      await page.goto('http://127.0.0.1:'+server.address().port);
      await page.getByRole('heading',{name:'Trung tâm điều hành'}).waitFor();
      assert.equal(await page.locator('section[aria-label="Khu vực xử lý"] > ul > li').count(),6);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`overflow at ${width}`);
      assert.equal(await page.locator('details[open]').count(),0);
      assert.equal(await page.getByRole('link',{name:'Chờ xử lý: 7 việc cần xử lý',exact:true}).first().getAttribute('href'),'/admin/orders?stage=0');
      await page.screenshot({path:path.join(output,`dashboard-${width}.png`),fullPage:true});
      const summary=page.locator('summary').filter({hasText:'Điểm tập trung'});
      await summary.focus();await page.keyboard.press('Enter');
      assert.equal(await page.locator('details[open]').count(),1);
      await page.getByText('Phân tích khối lượng & nhịp hoàn tất',{exact:true}).click();
      assert.equal(await page.locator('details[open]').count(),2);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`expanded overflow at ${width}`);
    }
    await page.goto('http://127.0.0.1:'+server.address().port+'/?empty');
    await page.getByText('Chưa có khu vực xử lý trong phạm vi truy cập của bạn.').waitFor();
    assert.deepEqual(errors,[]);
    console.log('Operations dashboard: 360/390/768/1440px, links, keyboard disclosure, empty state passed');
  } finally {await browser.close();await new Promise(resolve=>server.close(resolve));}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
