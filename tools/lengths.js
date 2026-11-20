/* node tools/lengths.js : how often the right answer is the single longest choice (target: about 25% or less) */
const fs=require('fs'),path=require('path'),S=path.join(__dirname,'src');global.window={};global.state={quiz:{plan:[],i:0}};
(0,eval)(['1-data.js','2-labs.js','3-questions.js'].map(f=>fs.readFileSync(path.join(S,f),'utf8')).join('\n;\n').replace(/^const (\w+)=/gm,'var $1=').replace(/^function (\w+)/gm,'var $1=globalThis.$1=function $1'));
const strip=s=>s.replace(/<[^>]+>/g,'').length;
const G={id:idQ,ph:phQ,calc:calcModeQ,pairs:pairsQ,titrate:titrateQ,buffer:bufferQ};
for(const [m,g] of Object.entries(G)){let L=0,n=0;for(let i=0;i<4000;i++){const q=g();if(q.type!=='mc'||q.keepOrder)continue;n++;const a=strip(q.answer);if(q.options.every(o=>o===q.answer||strip(o)<a))L++}console.log(m.padEnd(8),'right answer longest',(L/n*100).toFixed(0)+'%','of',n)}
for(const [nm,list] of [['PROPS',PROPS],['PH_IDEAS',PH_IDEAS],['ARR_IDEAS',ARR_IDEAS],['TIT_IDEAS',TIT_IDEAS],['BUF_IDEAS',BUF_IDEAS]])list.forEach((it,i)=>{const r=it.c.find(c=>c[1])[0],mx=Math.max(...it.c.filter(c=>!c[1]).map(c=>strip(c[0])));if(strip(r)>mx)console.log(' ',nm,i,strip(r),'vs',mx,'|',r)});
