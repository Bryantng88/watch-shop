/* eslint-disable @typescript-eslint/no-require-imports -- Node SSR test preload. */
const esbuild = require('esbuild');
const path = require('node:path');

// SSR has no stylesheet renderer. Compile actual CSS-module class exports using
// the same bundler as browser fixtures; browser suites still load the real CSS.
require.extensions['.css'] = (module, filename) => {
  const contents = filename.endsWith('.module.css')
    ? `import styles from ${JSON.stringify(filename)};module.exports=styles;`
    : `import ${JSON.stringify(filename)};module.exports={};`;
  const result = esbuild.buildSync({stdin:{contents,loader:'js',resolveDir:path.dirname(filename)},bundle:true,platform:'node',format:'cjs',write:false,outfile:'/tmp/admin-css-ssr-test.js',logLevel:'silent'});
  module._compile(result.outputFiles.find(file=>file.path.endsWith('.js')).text,filename);
};
