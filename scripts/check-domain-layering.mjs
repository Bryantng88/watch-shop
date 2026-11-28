import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const baselineFile = "docs/architecture/domain-layering-baseline.json";
const normalize = value => value.split(path.sep).join("/");
const modules = new Map();
function visit(dir) {
  for (const entry of fs.readdirSync(dir, {withFileTypes:true})) {
    const file=path.join(dir,entry.name);
    if(entry.isDirectory()) { if(entry.name!=="__generated__") visit(file); }
    else if(/\.[cm]?[jt]sx?$/.test(file)&&!/(?:\.test|\.spec|\.d)\.[jt]sx?$/.test(file)) {
      const source=ts.createSourceFile(file,fs.readFileSync(file,"utf8"),ts.ScriptTarget.Latest,true);
      const directives=source.statements.filter(ts.isExpressionStatement).map(node=>ts.isStringLiteral(node.expression)?node.expression.text:"");
      const imports=[];
      function scan(node) {
        if(ts.isImportDeclaration(node)&&ts.isStringLiteral(node.moduleSpecifier)) {
          const clause=node.importClause;
          const bindings=clause?.namedBindings;
          const typeOnly=clause?.isTypeOnly||(!clause?.name&&bindings&&ts.isNamedImports(bindings)&&bindings.elements.length>0&&bindings.elements.every(item=>item.isTypeOnly));
          if(!typeOnly) imports.push(node.moduleSpecifier.text);
        }
        if(ts.isExportDeclaration(node)&&!node.isTypeOnly&&node.moduleSpecifier&&ts.isStringLiteral(node.moduleSpecifier)) {
          if(!node.exportClause||!ts.isNamedExports(node.exportClause)||node.exportClause.elements.some(item=>!item.isTypeOnly)) imports.push(node.moduleSpecifier.text);
        }
        if(ts.isCallExpression(node)&&(node.expression.kind===ts.SyntaxKind.ImportKeyword||ts.isIdentifier(node.expression)&&node.expression.text==="require")&&node.arguments[0]&&ts.isStringLiteral(node.arguments[0])) imports.push(node.arguments[0].text);
        ts.forEachChild(node,scan);
      }
      scan(source);
      modules.set(normalize(file),{client:directives.includes("use client"),action:directives.includes("use server"),imports});
    }
  }
}
visit("src");
function resolve(file,specifier) {
  const base=specifier.startsWith("@/")?"src/"+specifier.slice(2):specifier.startsWith(".")?normalize(path.join(path.dirname(file),specifier)):null;
  return base&&[base,...[".ts",".tsx",".js",".jsx","/index.ts","/index.tsx"].map(ext=>base+ext)].find(candidate=>modules.has(candidate));
}
const visited=new Set(),violations=new Set();
function walk(file) {
  if(visited.has(file))return;
  visited.add(file);
  for(const specifier of modules.get(file).imports) {
    const target=resolve(file,specifier);
    if(target&&modules.get(target).action)continue; // Next server-action RPC, not a browser implementation dependency.
    if(/^(?:server-only|@prisma\/client|node:|@aws-sdk\/)/.test(specifier)||target&&/(?:^src\/server\/|\/server\/|\/storage\/|\/pipeline\/)/.test(target)) violations.add(`${file} -> ${target||specifier}`);
    else if(target)walk(target);
  }
}
for(const [file,mod] of modules)if(mod.client)walk(file);
// The pilot service assembles DTOs; source-backed SQL lives in its repository.
const pilot="src/domains/order/server/detail/order-detail.service.ts";
const pilotText=fs.readFileSync(pilot,"utf8");
if(/prisma\.\w+\s*\./.test(pilotText))violations.add(`${pilot} -> inline Prisma model query`);
const found=[...violations].sort();
if(process.argv.includes("--write-baseline")) {
  fs.writeFileSync(baselineFile,JSON.stringify({note:"Existing browser-boundary debt, frozen for incremental migration; entries are exceptions, not architectural approval. Adding an exception requires review and a reason in the PR.",violations:found},null,2)+"\n");
  console.log(`Recorded ${found.length} existing boundary exceptions`);
} else {
  const known=new Set(JSON.parse(fs.readFileSync(baselineFile,"utf8")).violations);
  const added=found.filter(item=>!known.has(item));
  const removed=[...known].filter(item=>!violations.has(item));
  if(added.length||removed.length) {console.error(JSON.stringify({newViolations:added,staleExceptions:removed},null,2));process.exitCode=1;}
  else console.log(`Domain layering OK: no new browser/server boundary violations; ${known.size} explicit legacy exceptions; Order detail service uses repositories.`);
}
