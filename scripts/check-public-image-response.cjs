/* eslint-disable @typescript-eslint/no-require-imports -- Actual route fixture with synthetic signer/storage. */
const assert=require('node:assert/strict');
const path=require('node:path');
const {createRequire}=require('node:module');
const esbuild=require('esbuild');
const sharp=require('sharp');
(async()=>{
 const root=path.resolve(__dirname,'..');
 const result=await esbuild.build({entryPoints:[path.join(root,'src/app/api/public/catalog/watches/[productId]/images/[imageId]/route.ts')],bundle:true,write:false,platform:'node',format:'cjs',packages:'external',plugins:[{name:'signer',setup(build){build.onResolve({filter:/^@\/domains\/storefront\/server$/},()=>({path:'signer',namespace:'ports'}));build.onLoad({filter:/.*/,namespace:'ports'},()=>({contents:'export const signPublicWatchImage=input=>globalThis.__imageSigner(input);'}));}}]});
 const fixtureModule={exports:{}};new Function('require','module','exports',result.outputFiles[0].text)(createRequire(path.join(root,'package.json')),fixtureModule,fixtureModule.exports);
 const{GET}=fixtureModule.exports;const originalFetch=global.fetch;const originalError=console.error;const logs=[];console.error=(...args)=>logs.push(args);
 const request=new Request('http://fixture.test/image');const context={params:Promise.resolve({productId:'public-product',imageId:'public-cover'})};let calls=0;
 global.__imageSigner=async input=>{assert.deepEqual(input,{productId:'public-product',imageId:'public-cover'});return 'https://storage.fixture/image?signature=never-expose'};
 const respond=async(response)=>{global.fetch=async()=>{calls++;return response};return GET(request,context)};
 try{
  for(const format of ['jpeg','png','webp','gif','avif']){
   const bytes=await sharp({create:{width:2,height:2,channels:3,background:'#bbaa88'}}).toFormat(format).toBuffer();
   for(const mime of [null,'application/octet-stream','image/jpeg']){
    const headers=mime?{'content-type':mime}:{};const response=await respond(new Response(bytes,{headers}));
    assert.equal(response.status,200,format+' / '+mime);assert.equal(response.headers.get('content-type'),'image/'+format);assert.equal(response.headers.get('x-content-type-options'),'nosniff');assert.equal(response.headers.get('content-length'),String(bytes.length));assert.deepEqual(Buffer.from(await response.arrayBuffer()),bytes);
   }
  }
  const failure=async(upstream,code)=>{const response=await respond(upstream);assert.equal(response.status,503);assert.equal(response.headers.get('cache-control'),'no-store');assert.deepEqual(await response.json(),{error:'Image unavailable',code});};
  await failure(new Response('not found',{status:404}),'UPSTREAM_STATUS');
  await failure(new Response('<html>storage error</html>',{headers:{'content-type':'image/jpeg'}}),'INVALID_IMAGE');
  await failure(new Response('<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>',{headers:{'content-type':'image/svg+xml'}}),'UNSUPPORTED_IMAGE');
  await failure(new Response(null),'EMPTY_BODY');await failure(new Response(new Uint8Array()),'EMPTY_BODY');
  let canceled=false;await failure(new Response(new ReadableStream({cancel(){canceled=true}}),{headers:{'content-length':String(21*1024*1024)}}),'IMAGE_TOO_LARGE');assert.equal(canceled,true);
  canceled=false;let chunks=0;await failure(new Response(new ReadableStream({pull(c){chunks++;c.enqueue(new Uint8Array(4*1024*1024));},cancel(){canceled=true}})),'IMAGE_TOO_LARGE');assert.equal(canceled,true);assert.ok(chunks<=7,'stop reading oversized streams');
  global.fetch=async()=>{throw new DOMException('Do not expose storage details','TimeoutError')};let response=await GET(request,context);assert.equal((await response.json()).code,'FETCH_FAILED');
  const previousCalls=calls;global.__imageSigner=async()=>null;response=await GET(request,context);assert.equal(response.status,404);assert.equal(calls,previousCalls);
  global.__imageSigner=async()=>{throw Error('secret SDK details')};response=await GET(request,context);assert.equal((await response.json()).code,'SIGNING_FAILED');
  assert.ok(!JSON.stringify(logs).match(/never-expose|secret SDK|signature|Do not expose/));
  originalError('PASS actual public image route: JPEG/PNG/WebP/GIF/AVIF with absent/generic/wrong MIME, preserved bytes/cache, rejected HTML/SVG, empty/oversized bodies, bounded stream cancellation, upstream missing/timeout and signer failure classifications, no signed URLs/error details exposed. Synthetic upstream only.');
 }finally{global.fetch=originalFetch;console.error=originalError;delete global.__imageSigner;}
})().catch(error=>{console.error(error);process.exitCode=1});
