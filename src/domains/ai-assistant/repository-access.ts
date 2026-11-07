export const BEN_REPOSITORY = "Bryantng88/watch-shop";
export function canReadRepository(actor:{id?:string;admin:boolean},env:Readonly<Record<string,string|undefined>>=process.env){
 return actor.admin && !!actor.id && actor.id===env.CUSTOMER_AI_PERMISSION_CONTACT_USER_ID && env.BEN_REPOSITORY_READ_ENABLED==="1" && /^[a-f0-9]{40}$/.test(env.BEN_REPOSITORY_COMMIT||"") && !!env.BEN_GITHUB_READ_TOKEN;
}
export function allowedRepositoryPath(path:string,directory=false){
 if(path==="")return directory;
 if(path.length>220||! /^[a-zA-Z0-9_./()\[\]@ -]+$/.test(path)||path.startsWith("/")||path.endsWith("/")||path.split("/").some(p=>!p||p==="."||p===".."||p.startsWith(".")))return false;
 if(/(?:^|\/)(?:credentials?|secrets?|private|backups?|attachments|__generated__)(?:\/|[.-]|$)/i.test(path))return false;
 const roots=["src","tests","scripts","docs/design","docs/development"];
 if(directory)return path==="docs"||path==="prisma"||roots.some(root=>path===root||path.startsWith(root+"/"));
 return (["package.json","tsconfig.json","next.config.ts","next.config.js","README.md","AGENTS.md","prisma/schema.prisma"].includes(path)||roots.some(root=>path.startsWith(root+"/")))&&/\.(?:ts|tsx|js|jsx|mjs|cjs|json|md|css|prisma)$/.test(path);
}
