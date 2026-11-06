import assert from "node:assert/strict";
import {test} from "node:test";
import {canReadRepository,allowedRepositoryPath} from "../repository-access";
import {readRepository} from "./repository-reader";
const commit="a".repeat(40),tree="b".repeat(40),blob="c".repeat(40);
const env={BEN_REPOSITORY_READ_ENABLED:"1",CUSTOMER_AI_PERMISSION_CONTACT_USER_ID:"long",BEN_REPOSITORY_COMMIT:commit,BEN_GITHUB_READ_TOKEN:"synthetic-token"};
test("only verified configured Long admin may read, and every missing configuration fails closed",()=>{
 assert.equal(canReadRepository({id:"long",admin:true},env),true);
 for(const actor of [{id:"other",admin:true},{id:"long",admin:false},{admin:true}])assert.equal(canReadRepository(actor,env),false);
 for(const key of Object.keys(env))assert.equal(canReadRepository({id:"long",admin:true},{...env,[key]:""}),false);
});
test("repository paths exclude secrets, deployment, generated blobs and traversal",()=>{
 for(const path of [".env","src/.env.local","../package.json","src/../README.md","src/secret.key","src/secrets.ts","docs/deployment/keys.md",".github/workflows/deploy.yml","src/features/__generated__/zod.ts","https://evil.test","src/%2e%2e/foo.ts","src//file.ts"])assert.equal(allowedRepositoryPath(path),false,path);
 assert.equal(allowedRepositoryPath("docs/deployment",true),false);
 for(const path of ["src/domains/order/service.ts","src/app/(admin)/admin/orders/[id]/page.tsx","prisma/schema.prisma","AGENTS.md"])assert.equal(allowedRepositoryPath(path),true,path);
});
function fixture(content="export function example() { return 1; }",mode="100644"){
 const calls:{url:string;options?:RequestInit}[]=[];
 const fetcher:typeof fetch=async(input,options)=>{const url=String(input);calls.push({url,options});return Response.json(url.includes("git/commits/")?{sha:commit,tree:{sha:tree},message:"Synthetic revision"}:url.includes(`git/trees/${tree}`)?{truncated:false,tree:[{path:"src",mode:"040000",type:"tree",sha:"d".repeat(40)}]}:url.includes("git/trees/")?{truncated:false,tree:[{path:"example.ts",mode,type:"blob",sha:blob,size:content.length}]}:{encoding:"base64",content:Buffer.from(content).toString("base64"),size:content.length});};return {fetcher,calls};
}
test("reads exact immutable files with line references and GET-only fixed GitHub origin",async()=>{
 const {fetcher,calls}=fixture("line one\nline two\nline three");const r=await readRepository({tool:"repository.file",query:"src/example.ts:2-3"},commit,"fixture",fetcher);
 assert.equal(r.content,"2: line two\n3: line three");assert.equal(r.commitSha,commit);assert.equal(r.readOnly,true);assert.ok(String(r.url).includes(`/blob/${commit}/src/example.ts#L2-L3`));
 assert.equal(calls.length,4);for(const c of calls){assert.ok(c.url.startsWith("https://api.github.com/repos/Bryantng88/watch-shop/"));assert.equal(c.options?.method,"GET");assert.equal(c.options?.redirect,"error");}
});
test("symlink content, credentials, unbounded ranges and unavailable GitHub cannot reach model",async()=>{
 for(const [content,mode] of [["normal","120000"],["-----BEGIN PRIVATE KEY-----","100644"],["const password = 'private-value';","100644"]]){const f=fixture(content,mode);await assert.rejects(readRepository({tool:"repository.file",query:"src/example.ts"},commit,"fixture",f.fetcher));}
 const f=fixture("normal");await assert.rejects(readRepository({tool:"repository.file",query:"src/example.ts:1-900"},commit,"fixture",f.fetcher));
 await assert.rejects(readRepository({tool:"repository.info"},commit,"fixture",async()=>new Response("private server detail",{status:403})),/REPOSITORY_UNAVAILABLE/);
});
test("history remains anchored to the configured SHA and PR metadata is explicitly a separate observation",async()=>{
 const calls:string[]=[];const fetcher:typeof fetch=async input=>{calls.push(String(input));return Response.json(String(input).includes('commits?')?[{sha:commit,commit:{message:'Observed commit\nbody',author:{email:'not-forwarded'}}}]:[{number:7,title:'Open work',head:{sha:blob},base:{sha:commit},body:'not forwarded'}]);};
 const history=await readRepository({tool:'repository.history'},commit,'fixture',fetcher);assert.ok(calls[0].includes(`commits?sha=${commit}&per_page=10`));assert.equal(JSON.stringify(history).includes('not-forwarded'),false);
 const pulls=await readRepository({tool:'repository.pullRequests'},commit,'fixture',fetcher);assert.equal(JSON.stringify(pulls).includes('not forwarded'),false);assert.ok(String(pulls.note).includes('separate references'));
});
test("directory reads avoid repository-wide recursive downloads and hide non-source roots",async()=>{
 const calls:string[]=[];const fetcher:typeof fetch=async input=>{const url=String(input);calls.push(url);return Response.json(url.includes('commits/')?{sha:commit,tree:{sha:tree}}:{tree:[{path:'src',type:'tree',mode:'040000',sha:blob},{path:'ops',type:'tree',mode:'040000',sha:blob},{path:'.env',type:'blob',mode:'100644',sha:blob},{path:'README.md',type:'blob',mode:'100644',sha:blob}]});};
 const result=await readRepository({tool:'repository.tree',query:''},commit,'fixture',fetcher);assert.deepEqual((result.entries as {path:string}[]).map(e=>e.path),['src','README.md']);assert.ok(calls.every(url=>!url.includes('recursive')));assert.equal(calls.length,2);
});
