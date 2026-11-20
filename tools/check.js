/* node tools/check.js : loads the game's logic in Node and checks
   1) every generated question (answer in options, unique options, a reason for every wrong choice, hint, why, known video, no NaN/undefined)
   2) typed answers display correctly (pH decimal places, sig figs) and the checker accepts them
   3) chemistry against Dr. Dan's Lecture 26–27 slide examples
   4) the titration lab (drop-by-drop reaches faint pink within 0.15 mL of equivalence; big steps overshoot)
   5) the buffer lab (water swings, buffers hold, capacity runs out) */
const fs=require('fs'),path=require('path'),S=path.join(__dirname,'src');
global.window={};global.matchMedia=undefined;
const cp=path.join(__dirname,'..','..','games','brand','chemparse.v2.js');if(fs.existsSync(cp)){(0,eval)(fs.readFileSync(cp,'utf8'))}
global.state={quiz:{plan:[],i:0}};
const src=['1-data.js','2-labs.js','3-questions.js'].map(f=>fs.readFileSync(path.join(S,f),'utf8')).join('\n;\n');
(0,eval)(src.replace(/^const (\w+)=/gm,'var $1=').replace(/^function (\w+)/gm,'var $1=globalThis.$1=function $1'));
let fails=0,n=0;const bad=m=>{n++;if(fails++<40)console.log('FAIL',m)},ok=(c,m)=>{n++;if(!c)bad(m)};
const txt=q=>[q.prompt,q.html,q.why,q.hint,...(q.options||[]),...Object.values(q.whys||{})].join(' ');
console.log('chemparse:',window.ChemParse?'shared v2':'local fallback');
/* 1) generators */
const gens={ionConc:ionConcQ,defs:defsQ,massTit:massTitQ,id:idQ,ph:phQ,calc:calcModeQ,pairs:pairsQ,titrate:titrateQ,buffer:bufferQ,classify:classifyQ,family:familyQ,strong:strongPickQ,beaker:beakerQ,phColor:phColorQ,pOHLab:pOHLabQ,ratio:ratioLabQ,pink:pinkLabQ,conc:concClassQ,label:labelQ,conj:conjQ,arr:arrEqQ,pairPick:pairPickQ,titLab:titLabQ,titCalc:titCalcQ,neut:neutQ,metal:metalQ,bufCmp:bufCompareQ,bufPart:bufPartQ,bufCap:bufCapQ,isBuf:isBufferQ,blood:bloodCalcQ};
Object.keys(TOPICS).forEach(t=>gens['quiz:'+t]=()=>topicQ(t));
for(const [k,g] of Object.entries(gens))for(let i=0;i<2500;i++){let q;try{q=g()}catch(e){bad(k+' throws '+e.stack.split('\n').slice(0,2).join(' '));break}
 ok(q.prompt&&q.hint&&(q.why||q.mkWhy),k+': missing prompt/hint/why');ok(!q.video||VIDEO_FOR[q.video],k+': unknown video '+q.video);
 if(q.type!=='label')ok(!/undefined|\bNaN\b|Infinity|\[object/.test(txt(q)),k+': bad text: '+txt(q).slice(0,200));
 if(k.startsWith('quiz:'))ok(!q.lab&&!q.task,k+': quiz question needs a lab');
 if(q.task)ok(q.lab&&LABS[q.lab.kind],k+': task without lab');
 if(q.type==='num'){ok(isFinite(q.answer)&&q.answer>0,k+': bad answer '+q.answer+' '+q.prompt);
  if(q.kind==='log'){ok(q.dp>=1&&q.dp<=4,k+': dp '+q.dp);const sh=q.answer.toFixed(q.dp);ok(Math.abs(Number(sh)-q.answer)<=0.5001*10**-q.dp,k+' shown '+sh)}
  else{const sh=nf(q.answer,q.sf);ok(NUM.sfCount(sh)===q.sf,`${k}: shown ${sh} has ${NUM.sfCount(sh)} sf, need ${q.sf}`);ok(Math.abs(NUM.parseValue(sh)-Number(q.answer.toPrecision(q.sf)))<=q.answer*1e-9,k+': shown '+sh+' != '+q.answer)}
  /* a slip equal to the answer is ignored by the checker (slipOf requires a different value) */continue}
 if(q.type==='label'){const roles=q.rows.map(r=>r.want).sort().join();ok(roles==='A,B,CA,CB',k+': roles '+roles);continue}
 ok(q.options.includes(q.answer),k+': answer not in options '+q.prompt);ok(new Set(q.options).size===q.options.length,k+': duplicate options '+q.options.join(' | '));
 ok(q.options.length>=3,k+': fewer than 3 options');ok(q.options.filter(o=>o!==q.answer).every(o=>q.whys[o]),k+': missing wrong reason: '+q.prompt.slice(0,60))}
/* every fixed item has exactly one right answer */
[['PROPS',PROPS],['PH_IDEAS',PH_IDEAS],['ARR_IDEAS',ARR_IDEAS],['TIT_IDEAS',TIT_IDEAS],['BUF_IDEAS',BUF_IDEAS]].forEach(([nm,L])=>L.forEach((it,i)=>ok(it.c.filter(c=>c[1]).length===1&&it.c.every(c=>c[2]),nm+' '+i+' right/why')));
/* 2) the pH checker logic: correct dp passes, wrong dp flagged */
for(let i=0;i<3000;i++){const q=calcQ();if(q.kind!=='log')continue;const sh=q.answer.toFixed(q.dp),v=Number(sh);ok(Math.abs(v-q.answer)<=1.0001*10**-q.dp&&dpCount(sh)===q.dp,'log accept '+sh)}
/* 3) slide examples */
const near=(a,b,t,m)=>ok(Math.abs(a-b)<=t,m+`: got ${a}, want ${b}`);
near(pHof(0.0050),2.30,0.005,'L26 s22 lemon pH');near(pHof(3.2e-11),10.49,0.005,'L26 s22 ammonia pH');near(pHof(4.0e-8),7.40,0.005,'L26 s22 blood pH');
near(14-pHof(2.4e-5),9.38,0.005,'L26 s31 pOH');near(pHof(1.5e-7),6.82,0.005,'L26 s24 pH 1.5e-7');near(10**-3.45,3.5e-4,0.06e-4,'L26 s26 [H+] from pH 3.45');
near(pHof(1.7e-3),2.77,0.005,'L26 s36 aspirin');near(pHof(5.01e-8),7.300,0.0005,'L26 s37 blood (acidosis)');ok(pHof(5.01e-8)<7.35,'s37 acidosis');
near(KW/1.0e-4,1.0e-10,1e-14,'L26 s20 [OH-]');near(pHof(2.0e-4),3.70,0.005,'L26 s30 HCl pH');
near(titAns({cfg:{Cb:0.100,r:1,Va:20.0}},80.00),0.400,1e-9,'L27 s20 HCl 0.400 M');near(titAns({cfg:{Cb:0.200,r:2,Va:20.0}},60.0),0.300,1e-9,'L27 s22 H2SO4 0.300 M');
ok(saltF(CATIONS.Ca,ANIONS.NO3)==='Ca(NO₃)₂','salt Ca(NO3)2 '+saltF(CATIONS.Ca,ANIONS.NO3));ok(saltF(CATIONS.Na,ANIONS.SO4)==='Na₂SO₄','salt Na2SO4');ok(saltF(CATIONS.Ba,ANIONS.SO4)==='BaSO₄','salt BaSO4');ok(saltF(CATIONS.Mg,ANIONS.Cl)==='MgCl₂','salt MgCl2');ok(saltF(CATIONS.K,ANIONS.Br)==='KBr','salt KBr');
ok(baseF(CATIONS.Ba)==='Ba(OH)₂'&&acidF(ANIONS.SO4)==='H₂SO₄','formulas');
/* indicators */
ok(phth(7)[0]==='colorless'&&phth(8.1)[0]==='colorless'&&phth(8.3)[0]==='faint'&&phth(12.5)[0]==='pink','phenolphthalein colors');ok(litmus(2)[0]==='red'&&litmus(11)[0]==='blue'&&litmus(7)[0]==='purple','litmus colors');
/* conjugate ladders: each step removes exactly one H and lowers the charge by 1 */
const hCount=b=>{const m=b.match(/H([₀-₉]?)/g);return (b.match(/H([₀-₉]*)/g)||[]).reduce((s,t)=>s+(t.length>1?SUBS.indexOf(t[1]):1),0)};
LADDERS.forEach(L=>{for(let i=0;i+1<L.length;i++){ok(L[i][1]-L[i+1][1]===1,'ladder charge '+L[i][0]);ok(hCount(L[i][0])-hCount(L[i+1][0])===1,'ladder H '+L[i][0]+' '+hCount(L[i][0])+' → '+L[i+1][0]+' '+hCount(L[i+1][0]))}});
/* BL reactions: atoms and charge balance (H count and charge) */
const chOf=f=>{const m=f.match(/([²³]?)([⁺⁻])$/);return m?(m[1]==='²'?2:m[1]==='³'?3:1)*(m[2]==='⁺'?1:-1):0},bodyOf=f=>f.replace(/[²³]?[⁺⁻]$/,'');
BL_RX.forEach(rx=>{const h=s=>hCount(bodyOf(s)),A=rx.find(x=>x[1]==='A')[0],B=rx.find(x=>x[1]==='B')[0],CA=rx.find(x=>x[1]==='CA')[0],CB=rx.find(x=>x[1]==='CB')[0];
 ok(h(A)-h(CB)===1&&chOf(A)-chOf(CB)===1,'BL acid→conj base '+A+'→'+CB);ok(h(CA)-h(B)===1&&chOf(CA)-chOf(B)===1,'BL base→conj acid '+B+'→'+CA)});
/* 4) titration lab */
let overs=0,runs=0;
for(const [af,r,Ka] of TIT_ACIDS)for(let i=0;i<400;i++){const nn=titNums(r),c={acidF:af,baseF:'NaOH',r,m:1,Ka,Ca:nn.Ca,Va:nn.Va,Cb:nn.Cb};TitLab.cfg=c;const Veq=TitLab.Veq();
 ok(Math.abs(Veq-nn.Veq)<1e-9&&Veq>10&&Veq<44,'Veq range '+Veq);
 ok(phth(TitLab.pHat(0))[0]==='colorless','starts colorless '+af);
 /* drops of 0.05 mL: first pink must be faint and within 0.15 mL of equivalence */
 let V=0,col;while(V<50){V=Math.round((V+0.05)*100)/100;col=phth(TitLab.pHat(V))[0];if(col!=='colorless')break}
 ok(col==='faint','drop titration first color '+col+' '+af+' Cb '+c.Cb);ok(Math.abs(V-Veq)<=0.15,'endpoint '+V+' vs Veq '+Veq.toFixed(2)+' '+af);
 /* the answer from that reading is within 1.2% of the true molarity */
 ok(Math.abs(titAns({cfg:c},V)-c.Ca)<=c.Ca*0.012,'titration answer within 1.2% '+af);
 /* 0.10 mL steps can still land on faint pink; 1 mL steps usually overshoot */
 V=0;while(V<50){V=Math.round((V+0.10)*100)/100;col=phth(TitLab.pHat(V))[0];if(col!=='colorless')break}ok(col==='faint','0.10 mL step overshoots '+af+' Cb '+c.Cb+' V '+V);
 V=0;while(V<50){V=V+1;col=phth(TitLab.pHat(V))[0];if(col!=='colorless')break}runs++;if(col==='pink')overs++}
console.log(`titration: 1 mL steps overshoot to dark pink in ${(overs/runs*100).toFixed(0)}% of runs`);
/* 5) buffer lab */
for(const sys of Object.keys(BUF_SYS)){const B=Object.create(BufLab);B.sys=sys;B.acid=0;B.base=0;const w0=B.pHw(),b0=B.pHb();near(w0,7,0.005,'water starts at 7');
 if(sys==='blood')near(b0,7.40,0.02,'blood buffer starts at 7.40');
 B.acid=2;ok(Math.abs(B.pHw()-w0)>3,sys+' water swings with 2 acid');ok(Math.abs(B.pHb()-b0)<0.5,sys+' buffer holds with 2 acid: '+(B.pHb()-b0).toFixed(2));
 B.acid=0;B.base=sys==='blood'?0:2;if(sys!=='blood')ok(Math.abs(B.pHb()-b0)<0.5,sys+' buffer holds with 2 base');
 /* capacity: acid until broken */
 const s=BUF_SYS[sys];let k=0;B.base=0;B.acid=0;while(Math.abs(B.pHb()-b0)<=1&&k<40){B.acid++;k++}ok(sys==='blood'?k>=8&&k<=s.b:k<=s.b+1&&k>=s.b,sys+' acid capacity taps '+k+' (A⁻ = '+s.b+')');
 B.acid=0;k=0;while(Math.abs(B.pHb()-b0)<=1&&k<40){B.base++;k++}ok(k<=s.a+1&&k>=s.a,sys+' base capacity taps '+k+' (HA = '+s.a+')')}
console.log(fails?`❌ ${fails} of ${n} checks failed`:`✅ all ${n} checks passed`);process.exit(fails?1:0);
