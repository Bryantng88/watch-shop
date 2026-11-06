import { BEN_REPOSITORY, allowedRepositoryPath } from "../repository-access";
import type { AssistantLookup } from "../live-contract";
type GitEntry={path:string;mode:string;type:string;sha:string;size?:number};
export type RepositoryLookup=Extract<AssistantLookup,{tool:`repository.${string}`}>;
export function isRepositoryLookup(request:AssistantLookup):request is RepositoryLookup {return ["repository.info","repository.history","repository.tree","repository.file","repository.pullRequests"].includes(request.tool);}
const sha=(value:unknown):value is string=>typeof value==="string"&&/^[a-f0-9]{40}$/.test(value);
function safeCode(text:string){
 // Do not return whole files containing private-key material or literal credentials.
 if(/-----BEGIN [A-Z ]*PRIVATE KEY-----|\b(?:gh[pousr]_[a-zA-Z0-9]{20,}|github_pat_[a-zA-Z0-9_]{20,}|sk-[a-zA-Z0-9_-]{20,})|(?:password|secret|token|api[_-]?key)\s*[:=]\s*["'][^"'\n]{8,}["']/i.test(text))throw Error("REPOSITORY_SENSITIVE_CONTENT");
 return text;
}
export async function readRepository(request:RepositoryLookup,commit:string,token:string,fetcher:typeof fetch=fetch):Promise<Record<string,unknown>>{
 if(!sha(commit)||!token)throw Error("REPOSITORY_UNAVAILABLE");
 let calls=0;
 async function get(resource:string){
  if(++calls>3)throw Error("REPOSITORY_REQUEST_LIMIT");
  const response=await fetcher(`https://api.github.com/repos/${BEN_REPOSITORY}/${resource}`,{method:"GET",headers:{Authorization:`Bearer ${token}`,Accept:"application/vnd.github+json","User-Agent":"Watch-Shop-Ben-ReadOnly","X-GitHub-Api-Version":"2022-11-28"},redirect:"error",signal:AbortSignal.timeout(4500),cache:"no-store"});
  if(!response.ok)throw Error("REPOSITORY_UNAVAILABLE");
  if(Number(response.headers.get("content-length"))>4000000)throw Error("REPOSITORY_RESPONSE_LIMIT");
  const reader=response.body?.getReader();if(!reader)throw Error("REPOSITORY_UNAVAILABLE");let length=0;const chunks:Uint8Array[]=[];
  try{for(;;){const r=await reader.read();if(r.done)break;length+=r.value.length;if(length>4000000)throw Error("REPOSITORY_RESPONSE_LIMIT");chunks.push(r.value);}}finally{await reader.cancel();}
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
 }
 const base={repository:BEN_REPOSITORY,commitSha:commit,readOnly:true};
 if(request.tool==="repository.history"){
  const commits=await get(`commits?sha=${commit}&per_page=10`);if(!Array.isArray(commits))throw Error("REPOSITORY_UNAVAILABLE");
  return {...base,commits:commits.slice(0,10).map(c=>({sha:sha(c.sha)?c.sha:null,subject:safeCode(String(c.commit?.message||"").split("\n")[0]).slice(0,200)}))};
 }
 if(request.tool==="repository.pullRequests"){
  const pulls=await get("pulls?state=open&sort=updated&direction=desc&per_page=15");if(!Array.isArray(pulls))throw Error("REPOSITORY_UNAVAILABLE");
  return {...base,observedAt:new Date().toISOString(),note:"PR heads are separate references; code reads remain pinned to commitSha.",pullRequests:pulls.slice(0,15).map(p=>({number:p.number,title:safeCode(String(p.title||"")).slice(0,200),headSha:sha(p.head?.sha)?p.head.sha:null,baseSha:sha(p.base?.sha)?p.base.sha:null,draft:p.draft===true}))};
 }
 const revision=await get(`git/commits/${commit}`);if(revision.sha!==commit||!sha(revision.tree?.sha))throw Error("REPOSITORY_UNAVAILABLE");
 if(request.tool==="repository.info")return {...base,treeSha:revision.tree.sha,subject:safeCode(String(revision.message||"").split("\n")[0]).slice(0,200),note:"Operator-pinned source snapshot. Not proof of the current deployed revision. No edits, commands, branches, PR writes or deployment are available."};
 const match=request.tool==="repository.file"?/^(.+?)(?::(\d+)-(\d+))?$/.exec(request.query):null;
 const path=match?match[1]:request.query;if(!allowedRepositoryPath(path,request.tool==="repository.tree"))throw Error("REPOSITORY_PATH_DENIED");
 const tree=await get(`git/trees/${revision.tree.sha}?recursive=1`);if(tree.truncated||!Array.isArray(tree.tree)||tree.tree.length>20000)throw Error("REPOSITORY_TREE_LIMIT");
 const entries=tree.tree as GitEntry[];
 if(request.tool==="repository.tree"){
  const prefix=path?path+"/":"";
  const matches=entries.filter(e=>e.path.startsWith(prefix)&&!e.path.slice(prefix.length).includes("/")&&allowedRepositoryPath(e.path,e.type==="tree")&&(e.type==="tree"||e.type==="blob"&&["100644","100755"].includes(e.mode)));
  return {...base,path,entries:matches.slice(0,60).map(e=>({path:e.path,type:e.type,size:e.size})),truncated:matches.length>60};
 }
 const entry=entries.find(e=>e.path===path);if(!entry||entry.type!=="blob"||!["100644","100755"].includes(entry.mode)||!sha(entry.sha)||typeof entry.size!=="number"||entry.size>80000)throw Error("REPOSITORY_FILE_UNAVAILABLE");
 const blob=await get(`git/blobs/${entry.sha}`);if(blob.encoding!=="base64"||typeof blob.content!=="string"||blob.size>80000)throw Error("REPOSITORY_FILE_UNAVAILABLE");
 const bytes=Buffer.from(blob.content,"base64");if(bytes.length>80000)throw Error("REPOSITORY_FILE_UNAVAILABLE");
 const text=safeCode(bytes.toString("utf8"));if(text.includes("\0"))throw Error("REPOSITORY_FILE_UNAVAILABLE");
 const lines=text.split("\n"),start=Number(match?.[2]||1),end=Number(match?.[3]||Math.min(lines.length,120));
 if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start<1||end<start||end-start>=160||start>lines.length)throw Error("REPOSITORY_LINE_RANGE");
 const last=Math.min(end,lines.length);const content=lines.slice(start-1,last).map((line,i)=>`${start+i}: ${line}`).join("\n");if(content.length>16000)throw Error("REPOSITORY_RESPONSE_LIMIT");
 return {...base,path,startLine:start,endLine:last,totalLines:lines.length,content,url:`https://github.com/${BEN_REPOSITORY}/blob/${commit}/${path.split("/").map(encodeURIComponent).join("/")}#L${start}-L${last}`};
}
