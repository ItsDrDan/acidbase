/* ============================== v1.3 ADDITIONS ==============================
   🩺 patient cases (blood gases, DKA, aspirin, antacids, vomiting, diarrhea, lactic acid)
   🧪 EXP 12a pre-lab (red cabbage indicator, mass → pH, excess reactant) and EXP 12b (citric acid in soda)
   ➰ proton-transfer pictures reused after Arrhenius, conjugate and buffer questions */

/* ---------- reusable reaction picture with an H⁺ arrow ----------
   sp: species, ops: operators between them, arrow: [from, to] species indexes, note: arrow label */
let RXPIC_N=0;
function rxPic(sp,ops,arrow,note='H⁺ moves',tags){const n=sp.length,U=660/(4*n-1),id='rxArc'+(++RXPIC_N);const X=[],OX=[];let x=0;
 for(let i=0;i<n;i++){X.push(x+1.5*U);x+=3*U;if(i<n-1){OX.push(x+U/2);x+=U}}
 const fs=n>=4?25:27,[a,b]=arrow,t=(x,y,s,o='')=>`<text x="${x}" y="${y}" text-anchor="middle" ${o}>${s}</text>`;
 const up=Math.max(30,74-Math.abs(X[b]-X[a])*0.32),peak=0.75*up+0.25*76;
 const alt=sp.map((s,i)=>s+(i<n-1?' '+ops[i]+' ':'')).join('');
 return `<svg class="blsvg" viewBox="0 0 660 ${tags?150:124}" role="img" aria-label="${esc(alt)}. ${esc(note)}: from ${esc(sp[a])} to ${esc(sp[b])}."><defs><marker id="${id}h" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#e0675a"/></marker></defs>
 <g font-family="Inter,system-ui,sans-serif" font-weight="900" font-size="${fs}" fill="#22313b">${sp.map((s,i)=>t(X[i],108,s)).join('')}${ops.map((o,i)=>t(OX[i],108,o)).join('')}</g>
 <g class="blReveal" aria-hidden="true" style="opacity:0;transition:opacity .4s"><path id="${id}" d="M${X[a]},76 C${X[a]},${up} ${X[b]},${up} ${X[b]},76" fill="none" stroke="#e0675a" stroke-width="3.5" stroke-dasharray="7 5" marker-end="url(#${id}h)"/>
 ${t((X[a]+X[b])/2,Math.max(15,peak-11),note,`font-family="Inter,system-ui,sans-serif" font-size="17" font-weight="800" fill="#c0504a"`)}
 <g class="blBall"><circle r="13" fill="#f9c4bf" stroke="#e0675a" stroke-width="2.5"/>${t(0,5,'H⁺',`font-family="Inter,system-ui,sans-serif" font-size="12" font-weight="900" fill="#22313b"`)}<animateMotion dur="1.4s" begin="indefinite" fill="freeze"><mpath href="#${id}"/></animateMotion></g>
 ${tags?tags.map(([i,s,c])=>t(X[i],138,s,`font-family="Inter,system-ui,sans-serif" font-size="16" font-weight="800" fill="${c}"`)).join(''):''}</g></svg>`}

/* ---------- 🩺 patient cases ---------- */
const CASE_TAG='<span class="tagchip">🩺 Patient case</span> ';
const ABG_NORMAL='Normal: pH 7.35–7.45 · PaCO₂ 35–45 mmHg · HCO₃⁻ 22–26 mEq/L';
const ABG_TYPES={RA:['Respiratory acidosis','CO₂ is high. Extra CO₂ makes extra H₂CO₃, which releases H⁺ (CO₂ + H₂O ⇌ H₂CO₃ ⇌ H⁺ + HCO₃⁻), so pH drops. The lungs are the problem (breathing too little).'],
 RB:['Respiratory alkalosis','CO₂ is low. Breathing too fast blows off CO₂, the equilibrium shifts left, H⁺ is used up and pH rises. The lungs are the cause.'],
 MA:['Metabolic acidosis','HCO₃⁻ is low. Bicarbonate (the base part of the blood buffer) has been used up by extra acid or lost from the body, so pH drops. CO₂ is normal, so breathing did not cause it.'],
 MB:['Metabolic alkalosis','HCO₃⁻ is high. Too much base (bicarbonate) or lost stomach acid raises pH. CO₂ is normal, so breathing did not cause it.']};
const ABG_WRONG={RA:'That needs high CO₂ (above 45 mmHg) with a low pH.',RB:'That needs low CO₂ (below 35 mmHg) with a high pH.',MA:'That needs low HCO₃⁻ (below 22 mEq/L) with a low pH.',MB:'That needs high HCO₃⁻ (above 26 mEq/L) with a high pH.'};
const ABG_STORY={RA:['an older patient with severe COPD who is drowsy and breathing slowly','a patient who took too much of an opioid pain medicine and is barely breathing'],
 RB:['a student having a panic attack and breathing very fast','a hiker who just arrived at high altitude and is breathing fast'],
 MA:['a patient with uncontrolled type 1 diabetes (DKA) who just arrived in the ER','a patient with several days of severe diarrhea'],
 MB:['a patient who has been vomiting for two days','a patient who took far too much baking-soda antacid']};
function abgQ(){const k=pick(Object.keys(ABG_TYPES)),r=(a,b,d=0)=>Number((a+Math.random()*(b-a)).toFixed(d));
 const pH=k==='RA'||k==='MA'?r(7.18,7.32,2):r(7.48,7.58,2),co2=k==='RA'?r(52,68):k==='RB'?r(24,31):r(37,43),hco3=k==='MA'?r(11,18):k==='MB'?r(31,38):r(23,26);
 return mc({topic:'buf',video:'bufBlood',keepOrder:true,prompt:`${CASE_TAG}Arterial blood gas for ${pick(ABG_STORY[k])}: pH ${pH.toFixed(2)}, PaCO₂ ${co2} mmHg, HCO₃⁻ ${hco3} mEq/L. Which problem is this?`,
  html:`<div class="givens"><span>${ABG_NORMAL}</span></div>`,hint:'Step 1: pH below 7.35 = acidosis, above 7.45 = alkalosis. Step 2: is CO₂ (lungs, acts like an acid) or HCO₃⁻ (kidneys, a base) out of range in the matching direction?',
  choices:Object.keys(ABG_TYPES).map(x=>[ABG_TYPES[x][0],x===k,x===k?`pH ${pH.toFixed(2)} is ${pH<7.35?'below 7.35 (acidosis)':'above 7.45 (alkalosis)'}. ${ABG_TYPES[x][1]}`:`${ABG_WRONG[x]} Here pH is ${pH.toFixed(2)}, CO₂ is ${co2} and HCO₃⁻ is ${hco3}.`])})}
const CASES=[
 {p:'A patient in diabetic ketoacidosis (DKA) is breathing very deep and fast (Kussmaul breathing). Why does breathing harder help?',h:'CO₂ + H₂O ⇌ H₂CO₃ ⇌ H⁺ + HCO₃⁻. What happens when CO₂ is removed?',c:[['Removing CO₂ shifts the buffer left, using up H⁺',true,'Ketoacids add H⁺. Breathing out CO₂ pulls CO₂ + H₂O ⇌ H₂CO₃ ⇌ H⁺ + HCO₃⁻ to the left, which uses up H⁺ and raises pH back toward normal.'],['Fast breathing adds extra OH⁻ ions to the blood',false,'Breathing does not add OH⁻. It removes CO₂, which removes acid.'],['Extra O₂ neutralizes the ketoacids',false,'Oxygen does not neutralize acids. Losing CO₂ is what lowers [H⁺].'],['Fast breathing raises CO₂, making the blood more basic',false,'More CO₂ would make blood MORE acidic. Fast breathing lowers CO₂.']]},
 {p:'Aspirin is acetylsalicylic acid, a weak acid. In a large overdose, what happens to blood pH, and which IV treatment helps?',h:'Extra acid lowers pH. What base is used in hospitals?',c:[['pH drops; IV sodium bicarbonate (HCO₃⁻) helps',true,'The salicylic acid adds H⁺, lowering pH (acidosis). Bicarbonate is a base: HCO₃⁻ + H⁺ → H₂CO₃ → CO₂ + H₂O.'],['pH rises; IV hydrochloric acid brings it back down',false,'Aspirin is an acid, so it lowers pH. Strong acids are never given by IV.'],['pH drops; IV sodium hydroxide (NaOH) is the best fix',false,'NaOH is a strong, caustic base; it would damage tissue. Bicarbonate is the gentle, buffering base used.'],['pH stays the same; aspirin is neutral',false,'Aspirin has a –COOH group: it is an acid.']]},
 {p:'Heartburn: an antacid tablet contains calcium carbonate, CaCO₃. What does it do to stomach acid (HCl)?',h:'Carbonate is a base. What gas fizzes out?',c:[['Neutralizes it: CaCl₂ + H₂O + CO₂ form',true,'CaCO₃ + 2 HCl → CaCl₂ + H₂O + CO₂. Carbonate takes up H⁺, so the stomach pH rises (and you may burp CO₂).'],['Makes the stomach more acidic',false,'Carbonate is a base: it takes H⁺ away, raising pH.'],['Turns HCl into a stronger acid',false,'Antacids neutralize acid; they do not strengthen it.'],['Nothing; CaCO₃ does not react with acid',false,'Carbonates fizz in acid, giving off CO₂.']]},
 {p:'Why are antacids made with weak bases like Mg(OH)₂ or CaCO₃ instead of NaOH?',h:'Think about what a strong base does to tissue.',c:[['NaOH is a strong, caustic base that burns tissue',true,'NaOH releases all its OH⁻ and would damage the mouth and esophagus. Mg(OH)₂ barely dissolves and CaCO₃ is a weak base, so they neutralize gently.'],['NaOH is an acid, not a base',false,'NaOH is a strong base.'],['Weak bases always neutralize far more acid per gram',false,'The reason is safety, not capacity: strong bases are caustic.'],['NaOH does not react with stomach HCl at all',false,'NaOH + HCl → NaCl + H₂O reacts very quickly; it is just unsafe to swallow.']]},
 {p:'After two days of vomiting, a patient loses a lot of stomach acid (HCl). Which blood problem is most likely?',h:'Losing acid leaves the body with relatively more base.',c:[['Metabolic alkalosis (pH too high)',true,'Losing H⁺ (stomach HCl) leaves extra HCO₃⁻ behind, so blood pH rises: metabolic alkalosis.'],['Metabolic acidosis (pH too low)',false,'Losing acid makes blood more basic, not more acidic.'],['Respiratory acidosis',false,'Breathing (CO₂) is not the cause here.'],['No change; the stomach is separate',false,'The H⁺ comes from the blood, so losing it changes blood pH.']]},
 {p:'Severe diarrhea removes bicarbonate (HCO₃⁻) from the body. What happens to blood pH?',h:'HCO₃⁻ is the base part of the blood buffer.',c:[['It drops: metabolic acidosis',true,'Losing HCO₃⁻ (the base) leaves less to absorb H⁺, so pH falls.'],['It rises: metabolic alkalosis',false,'Losing a base lowers pH.'],['It rises: respiratory alkalosis',false,'The cause is lost bicarbonate, not breathing.'],['It stays exactly 7.40',false,'The buffer loses its base part, so pH drops.']]},
 {p:'During a hard sprint, muscles release lactic acid. Which buffer reaction protects blood pH right away?',h:'Which blood buffer part grabs H⁺?',c:[['H⁺ + HCO₃⁻ → H₂CO₃ → H₂O + CO₂',true,'Bicarbonate grabs the H⁺; the H₂CO₃ breaks into water and CO₂, which you breathe out (that is why you pant).'],['H₂CO₃ + OH⁻ → HCO₃⁻ + H₂O',false,'That handles added BASE, not acid.'],['H⁺ + Cl⁻ → HCl',false,'Cl⁻ is not a base; it does not grab H⁺ back.'],['Lactic acid + O₂ → CO₂ + H₂O only',false,'That ignores the instant buffering step by HCO₃⁻.']]},
 {p:'In chronic COPD, CO₂ stays high for weeks. How do the kidneys help (compensate)?',h:'Which buffer part would raise pH back up?',c:[['They keep more HCO₃⁻, raising pH toward normal',true,'The kidneys hold on to bicarbonate (a base), which offsets the extra acid from CO₂ (metabolic compensation).'],['They get rid of HCO₃⁻ so the blood pH drops further',false,'That would make the acidosis worse.'],['They breathe out extra CO₂',false,'Breathing is the lungs\' job; the kidneys adjust HCO₃⁻.'],['Nothing at all; the kidneys cannot change blood pH',false,'Kidneys control blood bicarbonate, so they do affect pH.']]}];
function caseQ(){if(Math.random()<0.45)return abgQ();const it=pickNew('case',CASES);return mc({topic:'buf',video:'bufBlood',prompt:CASE_TAG+it.p,hint:it.h,choices:it.c})}
function stomachBloodQ(){const s=pick([1.5,1.8,2.0,2.2]),b=7.4,d=b-s,f=10**d;const show=x=>Number(x.toPrecision(2)).toLocaleString('en-US');
 return mc({topic:'phc',video:'ph',prompt:`${CASE_TAG}Stomach acid is about pH ${s.toFixed(1)} and blood is pH 7.4. About how many times more H⁺ is in stomach acid?`,hint:'Each pH unit is 10×. Find the difference, then use 10<sup>difference</sup>.',
  choices:[[show(f)+'×',true,`7.4 − ${s.toFixed(1)} = ${d.toFixed(1)} pH units, so 10<sup>${d.toFixed(1)}</sup> ≈ ${show(f)}× more H⁺. That is why the stomach lining needs protection.`],[d.toFixed(1)+'×',false,'pH is a log scale: subtracting pH values gives the exponent, not the ratio.'],[show(f/10)+'×',false,`That is one pH unit too few (10<sup>${(d-1).toFixed(1)}</sup>).`],[show(f*10)+'×',false,`That is one pH unit too many (10<sup>${(d+1).toFixed(1)}</sup>).`]]})}

/* ---------- 🧪 EXP 12a: red cabbage indicator ---------- */
const LAB12='<span class="tagchip">🧪 EXP 12a pre-lab</span> ';
const CAB_NAMES=[[2.5,'Red'],[4.5,'Pink'],[6.5,'Purple'],[7.5,'Violet'],[9.5,'Blue'],[11.5,'Green'],[15,'Yellow']];
const cabName=p=>CAB_NAMES.find(([m])=>p<m)[1];
function cabbageColorQ(){const h=pick(HOUSE.filter(x=>![2.5,4.5,6.5,7.5,9.5,11.5].some(m=>Math.abs(x[1]-m)<0.35))),right=cabName(h[1]);
 const names=['Red','Pink','Purple','Violet','Blue','Green','Yellow'],i=names.indexOf(right),others=shuf(names.filter(n=>n!==right)).slice(0,3);
 const why=n=>{const lo=[0,2.5,4.5,6.5,7.5,9.5,11.5][names.indexOf(n)],hi=[2.5,4.5,6.5,7.5,9.5,11.5,14][names.indexOf(n)];return `Red cabbage is ${n.toLowerCase()} around pH ${lo}–${hi}.`};
 return mc({topic:'ind',video:'ind',lab:{kind:'ph',cfg:{pH0:7,ind:'uni'}},task:{need:L=>L.picked===h[0]&&L.ind==='cab',say:`Pick <b>${h[2]} ${h[0]}</b>, then tap <b>Red cabbage</b>.`},
  prompt:`${LAB12}What color does red cabbage juice turn in ${h[0].toLowerCase()}?`,hint:'Red cabbage goes red → pink → purple → violet → blue → green → yellow as pH rises.',
  choices:[[right,true,`${h[0]} is pH ${h[1].toFixed(2)}. ${why(right)}`],...others.map(n=>[n,false,`${why(n)} ${h[0]} is pH ${h[1].toFixed(2)}.`])]})}
function cabbageMatchQ(){const p=rnd(4,24)/2,ps=[p,...shuf([2,3,4,5,6,7,8,9,10,11,12].filter(x=>Math.abs(x-p)>=1.5&&cabName(x)!==cabName(p))).slice(0,3)];const sw=x=>`<span class="cabsw" style="background:${cabbage(x)}"></span>`;
 return mc({topic:'ind',video:'ind',prompt:`${LAB12}A test tube with red cabbage juice looks like the tube on the left. Using the standards, estimate its pH to the nearest 0.5.`,
  html:`<div class="cabrow"><div class="cabtube" style="background:${cabbage(p)}" role="img" aria-label="Unknown tube, ${cabName(p).toLowerCase()} color"></div><div class="cabstd">${[2,3,4,5,6,7,8,9,10,11,12].map(x=>`<span>${sw(x)}<small>${x}</small></span>`).join('')}</div></div>`,hint:'Find the standard with the closest color; if it is between two, use the half step.',
  choices:ps.map(x=>[x.toFixed(1),x===p,x===p?`The tube's ${cabName(p).toLowerCase()} color matches pH ${p.toFixed(1)} on the standards.`:`A pH ${x.toFixed(1)} tube would be ${cabName(x).toLowerCase()}, not ${cabName(p).toLowerCase()}.`])})}
/* post-lab style: grams of strong acid or base in a solution → pH */
const SA_MM={'HCl':36.46,'HNO₃':63.02,'HBr':80.91},SB_MM={NaOH:40.00,KOH:56.11,'Ca(OH)₂':74.10,'Sr(OH)₂':121.64,'Ba(OH)₂':171.36};
function massPHQ(){const acid=Math.random()<0.5,f=pick(Object.keys(acid?SA_MM:SB_MM)),MM=(acid?SA_MM:SB_MM)[f],n=/\(OH\)₂/.test(f)?2:1,V=pick([0.250,0.500,0.750,1.00]),g=Number((rnd(100,600)/100).toFixed(2)),mol=g/MM,C=mol/V*n,a=acid?-Math.log10(C):14+Math.log10(C);
 return {type:'num',kind:'log',dp:3,topic:'phc',video:'stoich',prompt:`${LAB12}What is the pH of ${g.toFixed(2)} g ${f} dissolved in ${V.toFixed(3)} L of total solution?`,html:`<div class="givens"><span>Molar mass ${f} = ${MM.toFixed(2)} g/mol</span></div>`,answer:a,
  hint:`grams → mol (÷ ${MM.toFixed(2)}) → M (÷ ${V.toFixed(3)} L) → ${acid?'[H⁺] (strong acid, 1 : 1)':`[OH⁻] (strong base${n===2?', × 2 OH⁻':''})`} → ${acid?'pH = −log[H⁺]':'pOH, then pH = 14.00 − pOH'}. Three sig figs → 3 decimal places.`,
  why:`${g.toFixed(2)} g ÷ ${MM.toFixed(2)} g/mol = ${nf(mol,3)} mol ÷ ${V.toFixed(3)} L = ${nf(mol/V,3)} M ${f}. ${acid?`[H⁺] = ${nf(C,3)} M → pH = <b>${a.toFixed(3)}</b>.`:`[OH⁻] = ${n===2?'2 × ':''}${nf(mol/V,3)} = ${nf(C,3)} M → pOH = ${(14-a).toFixed(3)} → pH = <b>${a.toFixed(3)}</b>.`}`,
  slips:[[acid?14+Math.log10(C):-Math.log10(C),acid?'An acid gives H⁺: pH = −log[H⁺] directly.':'That is the pOH. Finish with pH = 14.00 − pOH.'],...(n===2?[[14+Math.log10(C/2),`Each ${f} gives 2 OH⁻: double the molarity.`]]:[]),[acid?-Math.log10(g/V):14+Math.log10(g/V),'Change grams to moles first, using the molar mass.']]}}
/* post-lab 2c style: HCl + Sr(OH)₂ (or Ba(OH)₂) mixed; find the pH from the excess */
function excessPHQ(){const [bf,MMb]=pick([['Sr(OH)₂',121.64],['Ba(OH)₂',171.36],['Ca(OH)₂',74.10]]);let ga,gb,nH,nOH;
 for(let k=0;k<40;k++){ga=Number((rnd(100,300)/100).toFixed(2));gb=Number((rnd(150,600)/100).toFixed(2));nH=ga/36.46;nOH=2*gb/MMb;if(Math.abs(nH-nOH)/Math.max(nH,nOH)>0.15)break}
 const V=pick([0.500,0.700,1.00]),ex=Math.abs(nH-nOH)/V,acidLeft=nH>nOH,a=acidLeft?-Math.log10(ex):14+Math.log10(ex);
 return {type:'num',kind:'log',dp:3,topic:'neut',video:'stoich',prompt:`${LAB12}${ga.toFixed(2)} g HCl and ${gb.toFixed(2)} g ${bf} are mixed in ${V.toFixed(3)} L of total solution. What is the pH?`,
  html:`<div class="rxn">2 HCl + ${bf} → ${bf.replace('(OH)₂','Cl₂')} + 2 H₂O</div><div class="givens"><span>HCl 36.46 g/mol</span><span>${bf} ${MMb.toFixed(2)} g/mol</span></div>`,answer:a,
  hint:'Find mol H⁺ (from HCl) and mol OH⁻ (2 per base). They cancel 1 : 1; whichever is left over sets the pH. Divide the leftover by the total volume.',
  why:`H⁺: ${ga.toFixed(2)} ÷ 36.46 = ${nf(nH,3)} mol. OH⁻: 2 × (${gb.toFixed(2)} ÷ ${MMb.toFixed(2)}) = ${nf(nOH,3)} mol. ${acidLeft?'H⁺':'OH⁻'} is in excess by ${nf(Math.abs(nH-nOH),3)} mol ÷ ${V.toFixed(3)} L = ${nf(ex,3)} M → ${acidLeft?`pH = <b>${a.toFixed(3)}</b>`:`pOH = ${(14-a).toFixed(3)}, pH = <b>${a.toFixed(3)}</b>`}.`,
  slips:[[acidLeft?-Math.log10(nH/V):14+Math.log10(nOH/V),'Subtract first: the H⁺ and OH⁻ neutralize each other, and only the excess sets the pH.'],[14-a,'Check which one is left over: an excess of acid gives a pH below 7, an excess of base above 7.']]}}
/* EXP 12b: citric acid (triprotic) in soda by titration with NaOH */
function citricQ(){const Vs=pick([10.0,20.0,25.0]),Cb=pick([0.0500,0.100]),Vb=rnd(400,2200)/100,mol=Cb*Vb/1000/3,M=mol/(Vs/1000);
 return {type:'num',kind:'conc',sf:3,unit:'M',topic:'tit',video:'titrRatio',prompt:`<span class="tagchip">🧪 EXP 12b</span> Citric acid in soda: ${Vs.toFixed(1)} mL of soda needs ${Vb.toFixed(2)} mL of ${Cb.toFixed(4)} M NaOH to reach the endpoint. What is the molarity of citric acid?`,
  html:'<div class="rxn">H₃C₆H₅O₇ + 3 NaOH → Na₃C₆H₅O₇ + 3 H₂O</div>',answer:M,hint:'Citric acid gives 3 H⁺ each, so mol citric acid = mol NaOH ÷ 3. Then divide by the soda volume in liters.',
  why:`mol NaOH = ${Cb.toFixed(4)} × ${(Vb/1000).toFixed(5)} L = ${nf(Cb*Vb/1000,3)} mol → ÷ 3 = ${nf(mol,3)} mol citric acid → ÷ ${(Vs/1000).toFixed(4)} L = <b>${nf(M,3)} M</b>.`,
  slips:[[M*3,'Citric acid is triprotic: divide the moles of NaOH by 3.'],[M*1000,'Convert mL to L before dividing.'],[M*9,'Divide by 3 once (1 citric acid : 3 NaOH).']]}}
function prelabQ(){return pick([cabbageColorQ,cabbageColorQ,cabbageMatchQ,cabbageMatchQ,massPHQ,excessPHQ])()}

/* ---------- ➰ pictures added after existing question types ---------- */
const withPic=(q,pic)=>{q.after=pic;return q};
const _arrEqQ=arrEqQ;arrEqQ=function(){const q=_arrEqQ();const m=q.answer.match(/^(.+?)\(aq\) → H⁺\(aq\) \+ (.+?)\(aq\)$/);
 if(m)q.after=rxPic([m[1],'H₂O','H₃O⁺',m[2]],['+','→','+'],[0,1],'H⁺ moves to water',[[0,'Arrhenius acid','#c0392b'],[2,'hydronium','#1f6aa5']])+'<p class="tip">In water the H⁺ does not float alone: it jumps onto H₂O, making H₃O⁺. That is why "makes H⁺" and "makes H₃O⁺" mean the same thing.</p>';return q};
const _conjQ=conjQ;conjQ=function(){const q=_conjQ(),base=/conjugate base/.test(q.prompt),x=(q.prompt.match(/ of (.+)\?$/)||[])[1];if(!x)return q;
 q.after=base?rxPic([x,'H₂O',q.answer,'H₃O⁺'],['+','⇌','+'],[0,1],'H⁺ leaves',[[0,'acid','#c0392b'],[2,'conjugate base','#c0392b']]):rxPic([x,'H₃O⁺',q.answer,'H₂O'],['+','⇌','+'],[1,0],'H⁺ joins',[[0,'base','#1f6aa5'],[2,'conjugate acid','#1f6aa5']]);return q};
const _bufPartQ=bufPartQ;bufPartQ=function(){const q=_bufPartQ(),s=BUF_SYS[q.lab.cfg.sys],acid=/added HCl/.test(q.prompt);
 q.after=acid?rxPic(['H₃O⁺',s.A,'H₂O',s.HA],['+','→','+'],[0,1],'added H⁺ is grabbed',[[1,'buffer base part','#1f6aa5']]):rxPic([s.HA,'OH⁻',s.A,'H₂O'],['+','→','+'],[0,1],'H⁺ neutralizes OH⁻',[[0,'buffer acid part','#c0392b']]);return q};
const _bufBloodQ=bufBloodQ;bufBloodQ=function(){const q=_bufBloodQ();q.after=rxPic(['H₃O⁺','HCO₃⁻','H₂O','H₂CO₃'],['+','→','+'],[0,1],'H⁺ moves',[[1,'bicarbonate','#1f6aa5'],[3,'→ CO₂ + H₂O (exhaled)','#5c6a75']]);return q};
/* blend the new items into the modes */
GEN.ph=()=>(typeof PRELAB!=='undefined'&&PRELAB)||Math.random()<0.25?prelabQ():phQ();
GEN.calc=()=>{const r=Math.random();return r<0.07?stomachBloodQ():r<0.17?pick([massPHQ,excessPHQ])():calcModeQ()};
GEN.titrate=()=>Math.random()<0.08?citricQ():titrateQ();
GEN.buffer=()=>Math.random()<0.3?caseQ():bufferQ();
const _topicQ=topicQ;topicQ=function(t){if(t==='buf'&&Math.random()<0.3){const q=caseQ();q.topic='buf';q.lab=null;q.task=null;return q}if(t==='tit'&&Math.random()<0.15){const q=citricQ();q.topic='tit';return q}return _topicQ(t)};
