/* eslint-disable @typescript-eslint/no-require-imports -- Shared CommonJS fixture bundler. */
const esbuild = require('esbuild');
const ts = require('typescript');
const path = require('node:path');
const fs = require('node:fs/promises');

/** Bundle real shared CSS and put browser fixtures inside the admin appearance scope. */
async function build(options) {
  const { adminScope = true, ...buildOptions } = options;
  options = buildOptions;
  if (options.platform === 'node') return esbuild.build(options);
  let stdin = options.stdin;
  if (stdin && adminScope) {
    let source = stdin.contents;
    const tree = ts.createSourceFile('fixture.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const edits = [];
    function visit(node) {
      if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression) && node.expression.name.text === 'render' && node.arguments.length) {
        const argument = node.arguments[0];
        edits.push({start:argument.getStart(tree),end:argument.end,text:`<FixtureAdminButtonProvider>{${argument.getText(tree)}}</FixtureAdminButtonProvider>`});
      }
      ts.forEachChild(node, visit);
    }
    visit(tree);
    for (const edit of edits.sort((a,b)=>b.start-a.start)) source = source.slice(0,edit.start)+edit.text+source.slice(edit.end);
    if (edits.length) source = `import {AdminButtonProvider as FixtureAdminButtonProvider} from ${JSON.stringify(path.resolve(__dirname,'../../src/domains/shared/ui/admin-design-contract/AdminButton'))};\n`+source;
    stdin = {...stdin,contents:source};
  }
  // A standalone fixture has no Next router runtime. Existing domain-specific
  // navigation ports take precedence; this fallback retains anchor/ref semantics.
  const nextLink = {name:'admin-fixture-link',setup(build) {
    build.onResolve({filter:/^next\/link$/},()=>({path:'link',namespace:'admin-fixture-link'}));
    build.onLoad({filter:/.*/,namespace:'admin-fixture-link'},()=>({loader:'tsx',resolveDir:path.resolve(__dirname,'../..'),contents:`import React,{forwardRef} from 'react';export const useLinkStatus=()=>({pending:false});export default forwardRef(function Link({onNavigate,onClick,...props},ref){return <a {...props} ref={ref} onClick={event=>{onClick?.(event);if(!event.defaultPrevented)onNavigate?.(event)}}/>})`}));
  }};
  options = {...options,plugins:[...(options.plugins||[]),nextLink]};
  const write = options.write !== false;
  const result = await esbuild.build({...options,write:false,...(stdin?{stdin}:{}),...(!options.outfile&&!options.outdir?{outfile:'/tmp/admin-fixture/app.js'}:{})});
  const css = result.outputFiles.filter(file=>file.path.endsWith('.css')).map(file=>file.text).join('\n');
  // Load real CSS before render, including legacy harnesses serving a single JS response.
  const prefix = css ? `if(typeof document!=="undefined"){const style=document.createElement("style");style.dataset.adminFixture="true";style.textContent=${JSON.stringify(css)};document.head.append(style); }\n` : '';
  const outputFiles = result.outputFiles.map(file=>file.path.endsWith('.js')?{...file,contents:Buffer.from(prefix+file.text),text:prefix+file.text}:file).sort((a,b)=>Number(b.path.endsWith('.js'))-Number(a.path.endsWith('.js')));
  if (write) for (const file of outputFiles) {await fs.mkdir(path.dirname(file.path),{recursive:true});await fs.writeFile(file.path,file.contents);}
  return {...result,outputFiles};
}
module.exports = {...esbuild,build};
