/* eslint-disable @typescript-eslint/no-require-imports -- Lifecycle harness for the actual shared hooks. */
const assert=require('node:assert/strict');const path=require('node:path');const esbuild=require('esbuild');const{createRequire}=require('node:module');
(async()=>{
 const root=path.resolve(__dirname,'..');
 const build=await esbuild.build({stdin:{contents:`export {useAdminSplitWorkspace} from './src/domains/shared/ui/admin-design-contract/AdminSplitWorkspace';export {useAdminSplitResize} from './src/domains/shared/ui/admin-design-contract/AdminSplitResize';`,loader:'ts',resolveDir:root},outfile:'/tmp/split-first-paint.cjs',write:false,bundle:true,platform:'node',format:'cjs',plugins:[{name:'react-scheduler',setup(build){build.onResolve({filter:/^react$/},()=>({path:'react',namespace:'scheduler'}));build.onLoad({filter:/.*/,namespace:'scheduler'},()=>({contents:`export const useState=(...args)=>globalThis.__splitReact.useState(...args);export const useRef=(...args)=>globalThis.__splitReact.useRef(...args);export const useEffect=(...args)=>globalThis.__splitReact.useEffect(...args);export const useLayoutEffect=(...args)=>globalThis.__splitReact.useLayoutEffect(...args);`}));}}]});
 const fixture={exports:{}};new Function('require','module','exports',build.outputFiles.find(f=>f.path.endsWith('.cjs')).text)(createRequire(path.join(root,'package.json')),fixture,fixture.exports);const hooks=fixture.exports;
 const storageDescriptor=Object.getOwnPropertyDescriptor(globalThis,'localStorage');const previousObserver=global.ResizeObserver;
 try{
 for(const scenario of [{width:1440,saved:'340',expected:340,wide:true},{width:1440,saved:'0',expected:0,wide:true},{width:980,saved:'390',expected:352,wide:true},{width:700,saved:'340',expected:200,wide:false},{width:1440,saved:'bad',expected:280,wide:true},{width:1440,denied:true,expected:280,wide:true}]){
  const slots=[];let cursor=0,pending=false,layouts=[],passives=[];const values=new Map([['admin:trading:menu-width:v1',scenario.saved],['admin:trading:menu-width:v1:expanded','340']]);
  Object.defineProperty(globalThis,'localStorage',{configurable:true,value:{getItem(key){if(scenario.denied)throw Error('Storage restricted');return values.get(key)??null},setItem(key,value){if(scenario.denied)throw Error('Storage restricted');values.set(key,value)}}});
  global.ResizeObserver=class{observe(){}disconnect(){}};
  const effect=(queue,fn,deps)=>{const at=cursor++;const old=slots[at];if(!old||deps.some((v,i)=>!Object.is(v,old[i]))){slots[at]=deps;queue.push(fn)}};
  global.__splitReact={useRef(value){const at=cursor++;return slots[at]??(slots[at]={current:value})},useState(value){const at=cursor++;if(!(at in slots))slots[at]=value;return[slots[at],next=>{const resolved=typeof next==='function'?next(slots[at]):next;if(!Object.is(slots[at],resolved)){slots[at]=resolved;pending=true}}]},useLayoutEffect(fn,deps){effect(layouts,fn,deps)},useEffect(fn,deps){effect(passives,fn,deps)}};
  const node={clientWidth:scenario.width,dataset:{}};let pane;
  const render=()=>{cursor=0;const ref=hooks.useAdminSplitWorkspace();pane=hooks.useAdminSplitResize(ref,'admin:trading:menu-width:v1');ref.current=node};render();
  // Commit/layout work runs before paint; passive work is deliberately held.
  let passes=0;do{pending=false;const effects=layouts;layouts=[];effects.forEach(fn=>fn());if(pending)render();assert.ok(++passes<10)}while(pending||layouts.length);
  assert.equal(node.dataset.wide,String(scenario.wide),'available-width mode must exist before passive effects');assert.equal(pane.wide,scenario.wide);assert.equal(pane.width,scenario.expected,'restore/clamp the menu before the first paint');assert.equal(pane.style['--admin-split-width'],scenario.expected+'px');assert.equal(passives.length,0,'essential layout restoration cannot depend on passive effects');assert.equal(values.get('admin:trading:menu-width:v1'),scenario.saved,'measurement does not overwrite stored preference');
 }
 console.log('PASS actual split hooks before passive effects: wide/narrow mode, saved expanded/collapsed width, available-width clamp, invalid and blocked storage. Prevents the desktop native-select flash on route remount.');
 }finally{delete global.__splitReact;global.ResizeObserver=previousObserver;if(storageDescriptor)Object.defineProperty(globalThis,'localStorage',storageDescriptor);else delete globalThis.localStorage;}
})().catch(e=>{console.error(e);process.exitCode=1});
