/* node tools/build.js → ../index.html (src/0-page.html with src/1-4 *.js inlined as separate <script> blocks) */
const fs=require('fs'),p=require('path'),S=p.join(__dirname,'src');
const page=fs.readFileSync(p.join(S,'0-page.html'),'utf8');if(!page.includes('<!--@SCRIPTS@-->'))throw 'no script slot';
const js=['1-data.js','2-labs.js','3-questions.js','4-engine.js'].map(f=>`<script>\n/* ${f} */\n${fs.readFileSync(p.join(S,f),'utf8')}\n</script>`).join('\n');
const out=p.join(__dirname,'..','index.html');fs.writeFileSync(out,page.replace('<!--@SCRIPTS@-->',()=>js));console.log('wrote',out);
