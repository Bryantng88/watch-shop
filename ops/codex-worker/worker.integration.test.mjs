import assert from 'node:assert/strict';
import { test } from 'node:test';
import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { runWorker } from './worker.mjs';

async function fixture(mode) {
 const root=await mkdtemp(join(tmpdir(),'watchshop-codex-fixture-'));
 const repo=join(root,'repo'), bare=join(root,'origin.git'), bin=join(root,'bin');
 await mkdir(repo);await mkdir(bin);
 const realGit=execFileSync('which',['git'],{encoding:'utf8'}).trim();
 const git=args=>execFileSync(realGit,args,{cwd:repo,stdio:['ignore','pipe','pipe']});
 git(['init','-b','main']);await writeFile(join(repo,'README.md'),'synthetic fixture\n');
 git(['add','README.md']);git(['-c','user.name=Fixture','-c','user.email=fixture@example.invalid','commit','-m','Initial fixture']);
 git(['clone','--bare',repo,bare]);git(['remote','add','origin','https://github.com/Bryantng88/watch-shop.git']);
 await writeFile(join(repo,'.git','personal-codex-worker'),'fixture');
 const gitShim=join(bin,'git');
 await writeFile(gitShim,`#!/usr/bin/env node\nconst {spawnSync}=require('node:child_process');let args=process.argv.slice(2);if(args[0]==='fetch')args=['fetch',${JSON.stringify(bare)},'main'];if(args.includes('push'))throw new Error('Publishing is forbidden in the fixture');const result=spawnSync(${JSON.stringify(realGit)},args,{stdio:'inherit'});process.exit(result.status??1);\n`,{mode:0o755});
 const marker=join(root,'terminated');const cli=join(bin,'fixture-codex');
 await writeFile(cli,`#!/usr/bin/env node
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const args=process.argv.slice(2),cwd=args[args.indexOf('-C')+1],output=args[args.indexOf('--output-last-message')+1];
if(process.env.GH_TOKEN||process.env.PERSONAL_CODEX_WORKER_TOKEN)throw new Error('Worker credential inherited');
process.stdin.resume();process.stdin.on('end',()=>{
 if(${JSON.stringify(mode)}==='protected'){fs.mkdirSync(path.join(cwd,'.github/workflows'),{recursive:true});fs.writeFileSync(path.join(cwd,'.github/workflows/deploy-production.yml'),'synthetic');cp.execFileSync(${JSON.stringify(realGit)},['add','.github/workflows/deploy-production.yml'],{cwd});}
 if(${JSON.stringify(mode)}==='cancel'){process.on('SIGTERM',()=>{fs.writeFileSync(${JSON.stringify(marker)},'terminated');process.exit(0);});setInterval(()=>{},1000);return;}
 fs.writeFileSync(output,'Synthetic mocked Codex result. No model or external API was called.');
});
`,{mode:0o755});
 let heartbeats=0;const finished=[];const run={id:randomUUID(),taskItemId:randomUUID(),prompt:'Synthetic test',repository:'Bryantng88/watch-shop',baseBranch:'main',leaseToken:randomUUID(),timeoutSeconds:60};
 const server=createServer(async(req,res)=>{
  assert.equal(req.headers.authorization,'Bearer synthetic-worker-token-at-least-32-characters');
  let text='';for await(const chunk of req)text+=chunk;const body=JSON.parse(text);
  res.setHeader('content-type','application/json');
  if(req.url.endsWith('/claim'))res.end(JSON.stringify({run}));
  else if(req.url.endsWith('/heartbeat')){heartbeats++;const active=mode!=='cancel'||heartbeats<4;res.statusCode=active?200:409;res.end(JSON.stringify({active}));}
  else {finished.push(body);res.end(JSON.stringify({accepted:true}));}
 });
 await new Promise(done=>server.listen(0,'127.0.0.1',done));
 const previous={...process.env};
 Object.assign(process.env,{PERSONAL_CODEX_ENVIRONMENT:'staging',PERSONAL_CODEX_APP_URL:`http://127.0.0.1:${server.address().port}`,PERSONAL_CODEX_WORKER_TOKEN:'synthetic-worker-token-at-least-32-characters',PERSONAL_CODEX_REPO_ROOT:repo,PERSONAL_CODEX_BINARY:cli,GH_TOKEN:'synthetic-github-token',PATH:`${bin}:${process.env.PATH}`});
 try {await runWorker({once:true,heartbeatIntervalMs:200});return{heartbeats,finished,terminated:await readFile(marker,'utf8').catch(()=>null)};}
 finally {for(const key of Object.keys(process.env))if(!(key in previous))delete process.env[key];Object.assign(process.env,previous);await new Promise(done=>server.close(done));await rm(root,{recursive:true,force:true});}
}

test('isolated worker executes the CLI adapter, returns a result and withholds worker/GitHub secrets', async()=>{
 const result=await fixture('success');assert.equal(result.finished.length,1);assert.equal(result.finished[0].status,'SUCCEEDED');assert.match(result.finished[0].summary,/mocked Codex/);
});
test('even already-staged production workflow changes cannot be published',async()=>{
 const result=await fixture('protected');assert.equal(result.finished.length,1);assert.equal(result.finished[0].status,'FAILED');
});
test('failed lease heartbeat terminates the actual CLI child and never reports success',async()=>{
 const result=await fixture('cancel');assert.ok(result.heartbeats>=4);assert.equal(result.terminated,'terminated');assert.equal(result.finished.length,0);
});
