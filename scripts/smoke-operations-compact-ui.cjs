/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS browser smoke runner. */
// Render the production dashboard with synthetic queues; no API or database access.
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const esbuild = require('./lib/admin-fixture-esbuild.cjs');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');

async function main() {
  const root = path.resolve(__dirname, '..');
  const output = '/tmp/operations-compact';
  await fs.mkdir(output, { recursive: true });
  const photo='data:image/jpeg;base64,'+(await fs.readFile(path.join(root,'public/temp_watch.jpg'))).toString('base64');
  const entry = `import React from 'react';import {createRoot} from 'react-dom/client';import Dashboard from './src/domains/admin-home/ui/OperationsDashboard';
const keys=['orders','purchase-requests','media','technical','payments','personal-work'];
const labels=['Chờ xử lý','Đang xử lý','Đã sẵn sàng'];
const queues=keys.map((key,i)=>({key,label:key,description:'Mô tả khu vực',href:'/admin/'+key,activeCount:10,execution:i===0||i===4?{waiting:0,inProgress:0,unknown:10}:i===2?{waiting:4,inProgress:3,unknown:3}:{waiting:7,inProgress:3,unknown:0},actionLabel:'Mở',insights:[{key:'wait',label:'việc cần kiểm tra',count:3,href:'/admin/'+key+'?attention=1',severity:'attention'}],stages:labels.map((label,n)=>({key:key+n,label,count:[7,3,0][n],href:'/admin/'+key+'?stage='+n,actionLabel:'Mở',metrics:[{label:'Thời gian chờ',value:'3 ngày',detail:'Dữ liệu mẫu'}]}))}));
const data={generatedAt:'2026-11-17T03:00:00Z',totalActive:60,queues,completionTrend:[{date:'2026-11-17',label:'17/11',count:2}],attention:Array.from({length:6},(_,i)=>({id:'attention-'+i,domain:i%3===0?'MEDIA':i%3===1?'TECHNICAL':'PURCHASE_REQUEST',title:'Mục mẫu '+i,reference:'REF-'+i,reason:'Cần kiểm tra mục này',ageLabel:(41-i)+' ngày',ageDays:41-i,ownerLabel:i===2?'Chưa có người nhận':'Long phụ trách',actionLabel:'Mở mục',href:'/admin/services/service-fixture-'+i,tone:'blue',severity:i<2?'risk':'attention',imageUrl:i===0?${JSON.stringify(photo)}:i===1?'data:image/png;base64,broken':null,avatarUser:i===2?{name:'Vi',avatarUrl:null}:null})),priorityAction:null};
window.renderFixture=(empty=false)=>createRoot(document.getElementById('root')).render(<Dashboard data={empty?{...data,totalActive:0,queues:[],attention:[]}:data}/>);window.renderFixture(new URLSearchParams(location.search).has('empty'));`;
  await esbuild.build({stdin:{contents:entry,loader:'tsx',resolveDir:root},outfile:path.join(output,'app.js'),bundle:true,platform:'browser',jsx:'automatic',define:{'process.env.NODE_ENV':'"production"'},plugins:[{name:'fixture-link',setup(build){
    build.onResolve({filter:/^next\/link$/},()=>({path:'link',namespace:'fixture'}));
    build.onLoad({filter:/.*/,namespace:'fixture'},()=>({contents:`import React from 'react';export default function Link(props){return <a {...props}/>}`,loader:'tsx',resolveDir:root}));
  }}]});
  const css=await fs.readFile(process.env.OPERATIONS_PREVIEW_CSS || '/tmp/operations-ui.css','utf8');
  const js=await fs.readFile(path.join(output,'app.js'),'utf8');
  const moduleCss=await fs.readFile(path.join(output,'app.css'),'utf8');
  const server=http.createServer((req,res)=>{res.setHeader('content-type',req.url==='/app.js'?'text/javascript':'text/html');res.end(req.url==='/app.js'?js:`<!doctype html><html lang="vi"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>${css}\n${moduleCss}\nbody{margin:0;font-family:Arial,sans-serif}</style><div id="root" class="admin-ui"></div><script src="/app.js"></script></html>`);});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_EXECUTABLE?{executablePath:process.env.CHROMIUM_EXECUTABLE}:{}),args:['--no-sandbox']});
  try {
    const page=await browser.newPage();
    const errors=[];page.on('pageerror',error=>errors.push(error.message));
    for(const width of [360,390,768,1440,1920,2560]){
      await page.setViewportSize({width,height:1000});
      await page.goto('http://127.0.0.1:'+server.address().port);
      await page.getByRole('heading',{name:'Trung tâm điều hành'}).waitFor();
      assert.equal(await page.locator('section[aria-labelledby="operation-queues-title"] > ul > li').count(),6);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`overflow at ${width}`);
      const panel=page.locator('[data-insight-panel]');
      await page.waitForFunction(expected=>document.querySelector('[data-insight-panel]').open===expected,width>=1280);
      if(width<1280)await page.getByText('Insight vận hành',{exact:true}).click();
      await page.getByRole('heading',{name:'Khối lượng đang mở',exact:true}).waitFor();
      assert.ok(await page.locator('[data-volume-chart]').isVisible());
      const completion=page.getByRole('region',{name:'Nhịp hoàn tất đơn hàng · 7 ngày'});
      assert.ok(await completion.isVisible());
      assert.equal(await completion.locator('dd').first().textContent(),'2');
      const fonts=await page.locator('h1, h2').evaluateAll(nodes=>nodes.map(el=>getComputedStyle(el).fontFamily));
      assert.equal(new Set(fonts).size,1,'dashboard headings share one font family');
      assert.equal(await page.locator('#intervention-title').evaluate(el=>getComputedStyle(el).fontSize),await page.locator('#operation-queues-title').evaluate(el=>getComputedStyle(el).fontSize));
      assert.equal(await page.getByRole('navigation',{name:'Cần chú ý trước'}).getByRole('link').count(),3);
      assert.equal(await page.locator('[data-attention-item]').count(),6);
      const summaryLinks=page.locator('nav[aria-label="Cần chú ý trước"] a, section[aria-labelledby="operation-queues-title"] a[data-admin-button]');
      assert.equal(await summaryLinks.count(),21);
      for(const link of await summaryLinks.all()){
        const surface=await link.evaluate(el=>{const s=getComputedStyle(el);return {border:s.borderTopWidth,shadow:s.boxShadow,image:s.backgroundImage,variant:el.dataset.adminButton};});
        assert.deepEqual(surface,{border:'0px',shadow:'none',image:'none',variant:'contextual'},'summary navigation must not become raised action buttons');
      }
      const intervention=page.locator('[data-attention-item="attention-0"]');
      await intervention.locator('summary').focus();await page.keyboard.press('Enter');
      assert.equal(await intervention.getByRole('link',{name:'Mở mục'}).getAttribute('href'),'/admin/services/service-fixture-0');
      assert.ok(await intervention.getByRole('img',{name:'Mục mẫu 0'}).isVisible());
      await intervention.locator('summary').click();
      assert.equal(await page.getByRole('link',{name:'Chờ xử lý: 7 việc cần xử lý',exact:true}).first().getAttribute('href'),'/admin/orders?stage=0');
      const controls=page.getByRole('group',{name:'Trạng thái biểu đồ',exact:true});
      await controls.getByRole('button',{name:'Chờ xử lý',exact:true}).click();
      await page.getByRole('heading',{name:'Khối lượng chờ xử lý',exact:true}).waitFor();
      assert.ok(await page.locator('[aria-label="Đơn hàng: Chưa có trạng thái thực hiện"]').isVisible());
      assert.ok(await page.locator('[aria-label="Media: 4 việc đã xác định; 3 chưa phân loại"]').isVisible());
      assert.match(await page.getByRole('status').textContent(),/23 mục/);
      await controls.getByRole('button',{name:'Đang xử lý',exact:true}).click();
      await page.getByRole('heading',{name:'Khối lượng đang xử lý',exact:true}).waitFor();
      assert.ok(await page.locator('[aria-label="Media: 3 việc đã xác định; 3 chưa phân loại"]').isVisible());
      await controls.getByRole('button',{name:'Tất cả',exact:true}).click();
      const first=page.locator('section[aria-labelledby="stage-concentration-title"] > details').first().locator('summary');
      await first.focus();await page.keyboard.press('Enter');
      assert.ok(await page.getByText('Dữ liệu mẫu',{exact:true}).first().isVisible());
      if(width>=1280){
        const listBox=await page.locator('section[aria-labelledby="operation-queues-title"]').boundingBox();
        const chartBox=await panel.boundingBox();
        assert.ok(chartBox.x>listBox.x+listBox.width);
        assert.ok(listBox.width/chartBox.width>1.8&&listBox.width/chartBox.width<2.2);
        const attentionBox=await page.locator('section[aria-labelledby="intervention-title"]').boundingBox();
        assert.ok(attentionBox.y>=listBox.y+listBox.height&&attentionBox.y-(listBox.y+listBox.height)<50);
        assert.ok(attentionBox.x===listBox.x&&attentionBox.width<=listBox.width+1);
        assert.ok(attentionBox.y<chartBox.y+chartBox.height);
        assert.equal(await page.locator('[data-chart-surface]').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(239, 246, 255)');
        assert.equal(await panel.evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(255, 255, 255)');
        const row=page.locator('section[aria-labelledby="operation-queues-title"] > ul > li').first();
        const identity=await row.locator('h3').boundingBox();
        const warning=await row.locator('[data-queue-warning]').boundingBox();
        assert.ok(warning.x>identity.x+identity.width,'attention has its own middle column');
        const { canvas, container } = await page.locator('h1').evaluate(el => {
          const dashboard = el.closest('.min-h-screen');
          return {
            canvas: dashboard.getBoundingClientRect().toJSON(),
            container: dashboard.parentElement.getBoundingClientRect().toJSON(),
          };
        });
        assert.ok(Math.abs(canvas.width - container.width) <= 1, `dashboard must fill available width at ${width}`);
        assert.ok(Math.abs(canvas.left - container.left) <= 1, `dashboard must align with its container at ${width}`);
      }
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`expanded overflow at ${width}`);
      await page.evaluate(()=>document.activeElement?.blur());
      await page.screenshot({path:path.join(output,`dashboard-${width}.png`),fullPage:true});
    }
    await page.goto('http://127.0.0.1:'+server.address().port+'/?empty');
    await page.getByText('Chưa có khu vực xử lý trong phạm vi truy cập của bạn.').waitFor();
    await page.getByText('Chưa có mục cần can thiệp theo tiêu chí hiện tại.').waitFor();
    assert.deepEqual(errors,[]);
    console.log('Live operations UI: responsive 2:1 columns, visible chart, three real-state views, unknown coverage, links, keyboard disclosures, empty state passed');
  } finally {await browser.close();await new Promise(resolve=>server.close(resolve));}
}
main().catch(error=>{console.error(error);process.exitCode=1;});

