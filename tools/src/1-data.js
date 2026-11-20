/* ============================== SETTINGS ============================== */
const GAME_KEY='itsdrdan-acidbase';
const MODES=[
 {id:'id',title:'Acid or Base?',short:'Spot acids, bases and strength',icon:'🔍',mb:'#fff0e3',ma:'#e8955a'},
 {id:'ph',title:'pH Lab',short:'Slide the pH, test indicators',icon:'🌈',mb:'#fdeef6',ma:'#d0709f'},
 {id:'calc',title:'pH Calculator',short:'pH, pOH, [H⁺] and [OH⁻]',icon:'🧮',mb:'#fff6e2',ma:'#c99a2e'},
 {id:'pairs',title:'Proton Pairs',short:'Arrhenius and conjugate pairs',icon:'🔄',mb:'#e7f6e9',ma:'#6fae7e'},
 {id:'titrate',title:'Titration Lab',short:'Neutralize and find molarity',icon:'⚗️',mb:'#e6f2ff',ma:'#5d9fd2'},
 {id:'buffer',title:'Buffer Lab',short:'Watch a buffer resist pH change',icon:'🛡️',mb:'#f1eafb',ma:'#9a7fcf'},
 {id:'quiz',title:'Skill Check',short:'10 questions, then your study plan',icon:'🎯',mb:'#fdeef2',ma:'#d0708a'}];
/* Dr. Dan's videos (VIDEO-CATALOG.md); start times found in games/data/transcripts.json */
const VIDEO_FOR={
 props:['_3MEHX5yvzQ',0,'Properties of acids and bases'],
 arr:['_3MEHX5yvzQ',415,'Arrhenius vs. Brønsted–Lowry definitions'],
 ind:['_3MEHX5yvzQ',830,'Indicators: litmus paper'],
 strength:['tGqiUbBxqec',185,'Strong vs. weak: how many ions form'],
 kw:['tGqiUbBxqec',795,'Autoionization of water and Kw'],
 ph:['M5gCzKjb0kA',240,'pH, pOH, H⁺ and OH⁻'],
 inv:['M5gCzKjb0kA',660,'From pH back to [H⁺]'],
 log:['AAOXGkcrUMg',225,'Log sig figs: count decimal places'],
 conj:['T8Uxtqoi1-8',300,'Finding conjugate acid–base pairs'],
 titr:['Ca7o0AjwhcY',310,'Titration and the equivalence point'],
 titrRatio:['Ca7o0AjwhcY',450,'Using the mole ratio in a titration'],
 stoich:['tbcxL9K3KBU',0,'Practice: neutralization, pH and pOH'],
 buffer:['-UrwKIGAj08',20,'Buffers resist changes in pH'],
 bufAdd:['-UrwKIGAj08',150,'What a buffer does with added acid'],
 bufBlood:['-UrwKIGAj08',190,'The blood buffer'],
 bufCap:['-UrwKIGAj08',800,'Buffer capacity']};
const FALLBACK_VIDEO='M5gCzKjb0kA';

/* ============================== HELPERS ============================== */
const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1)),pick=a=>a[Math.floor(Math.random()*a.length)],shuf=a=>a.map(x=>[Math.random(),x]).sort((p,q)=>p[0]-q[0]).map(x=>x[1]);
const $=id=>document.getElementById(id),esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const SUBS='₀₁₂₃₄₅₆₇₈₉',SUPS='⁰¹²³⁴⁵⁶⁷⁸⁹';
const sub=n=>n>1?String(n).replace(/\d/g,d=>SUBS[d]):'';
const supN=n=>String(n).replace(/[0-9-]/g,c=>c==='-'?'⁻':SUPS[c]);
const chg=c=>c===0?'':(Math.abs(c)>1?supN(Math.abs(c)):'')+(c>0?'⁺':'⁻');
const gcd=(a,b)=>b?gcd(b,a%b):a;
/* a × 10ⁿ shown with s sig figs (always scientific; used for given concentrations) */
function sci(x,s=2){if(x===0)return '0';const [m,p]=x.toExponential(s-1).split('e');return m+' × 10'+supN(Number(p))}
/* multiple choice: choices = [[text, isRight, why]] */
function mc(o){const ch=o.choices;const q=Object.assign({type:'mc'},o);q.options=o.keepOrder?ch.map(c=>c[0]):shuf(ch.map(c=>c[0]));q.answer=ch.find(c=>c[1])[0];q.whys={};ch.forEach(c=>q.whys[c[0]]=c[2]);q.why=o.why||ch.find(c=>c[1])[2];return q}
let lastPick={};
function pickNew(key,list){let i,tries=0;do{i=Math.floor(Math.random()*list.length)}while(list.length>1&&i===lastPick[key]&&tries++<10);lastPick[key]=i;return list[i]}
/* shared number reading (games/brand/chemparse.v2.js), with a small local fallback */
const NUM=(typeof window!=='undefined'&&window.ChemParse)||(()=>{const SU={'⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9','⁻':'-','⁺':'+'};
 const base=r=>String(r==null?'':r).replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺]/g,c=>SU[c]).replace(/[−–—‐]/g,'-').replace(/\s+/g,'');
 const decimalComma=r=>{const t=String(r==null?'':r).replace(/\s+/g,'');return t.includes(',')&&!/^[+\-−–]?[1-9]\d{0,2}(,\d{3})+(\.\d*)?([eE×xX*·⋅].*)?$/.test(t)};
 const norm=r=>base(r).replace(/,/g,'').replace(/[×xX*·⋅]10\^?([+-]?\d+)$/,'e$1');
 const parseValue=r=>{if(decimalComma(r))return NaN;const t=norm(r);return /^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(t)?Number(t):NaN};
 const sfCount=r=>{if(decimalComma(r))return 0;let t=base(r).replace(/,/g,'').replace(/(?:[×xX*·⋅]10\^?|[eE])[+-]?\d+$/,'').replace(/^[+-]/,'');if(!/^(?:\d+\.?\d*|\.\d+)$/.test(t))return 0;t=t.replace(/^0+(?=\d)/,'');if(/^0*\.?0*$/.test(t))return Math.max(1,(t.split('.')[1]||'').length);if(t.includes('.'))return t.replace('.','').replace(/^0+/,'').length;return t.replace(/0+$/,'').length};
 const fmt=(x,s)=>{if(x===0)return '0';const e=Math.floor(Math.log10(Math.abs(Number(x.toPrecision(s)))));if(e>=5||e<-3)return sci(x,s);const v=Number(x.toPrecision(s)),d=Math.max(0,s-1-e);let t=v.toFixed(d);if(d===0&&t.replace(/^-/,'').replace(/0+$/,'').length<s)t+='.';return t};
 return {normalize:norm,decimalComma,parseValue,sfCount,fmt}})();
const nf=(x,s)=>NUM.fmt(x,s);
/* decimal places the student typed (for pH answers) */
const dpCount=raw=>{const t=String(raw).replace(/\s+/g,'').replace(/[eE].*$/,'');const m=t.match(/\.(\d*)/);return m?m[1].length:0};

/* ============================== CHEMISTRY DATA ============================== */
/* Green-sheet strong acids and strong bases (Lecture 26 slide 9) */
const STRONG_ACIDS=['HCl','HBr','HI','HNO₃','H₂SO₄','HClO₄'];
const STRONG_LIST='HCl, HBr, HI, HNO₃, H₂SO₄, HClO₄';
/* [formula, category, family, why (what it does), name]
   SA strong acid · WA weak acid · SB strong base · WB weak base · N neither */
const SUBST=[
 ['HCl','SA','binary','is on the strong-acid list: it gives away all of its H⁺ in water','hydrochloric acid (stomach acid)'],
 ['HBr','SA','binary','is on the strong-acid list: it gives away all of its H⁺ in water','hydrobromic acid'],
 ['HI','SA','binary','is on the strong-acid list: it gives away all of its H⁺ in water','hydroiodic acid'],
 ['HNO₃','SA','oxy','is on the strong-acid list: it gives away all of its H⁺ in water','nitric acid'],
 ['H₂SO₄','SA','oxy','is on the strong-acid list: it gives away its H⁺ in water','sulfuric acid (battery acid)'],
 ['HClO₄','SA','oxy','is on the strong-acid list: it gives away all of its H⁺ in water','perchloric acid'],
 ['HF','WA','binary','gives off H⁺, but only a little: HF is not on the strong-acid list','hydrofluoric acid'],
 ['H₂S','WA','binary','gives off a little H⁺: H₂S is not on the strong-acid list','hydrosulfuric acid'],
 ['CH₃COOH','WA','carb','has a –COOH (carboxylic acid) group that gives off a little H⁺','acetic acid (vinegar)'],
 ['HCOOH','WA','carb','has a –COOH group that gives off a little H⁺','formic acid (ant stings)'],
 ['C₆H₅COOH','WA','carb','has a –COOH group that gives off a little H⁺','benzoic acid (a food preservative)'],
 ['CH₃CH(OH)COOH','WA','carb','has a –COOH group that gives off a little H⁺ (its –OH is an alcohol group, not hydroxide)','lactic acid (from hard exercise)'],
 ['H₂CO₃','WA','oxy','gives off a little H⁺: it is not on the strong-acid list','carbonic acid (in soda and blood)'],
 ['H₃PO₄','WA','oxy','gives off a little H⁺: it is not on the strong-acid list','phosphoric acid (in cola)'],
 ['HNO₂','WA','oxy','gives off a little H⁺: it is HNO₂ (nitrous acid), not HNO₃ (nitric acid)','nitrous acid'],
 ['HClO','WA','oxy','gives off a little H⁺: it is HClO, not HClO₄ (perchloric acid)','hypochlorous acid'],
 ['NaOH','SB','oh','is a soluble hydroxide: it releases all of its OH⁻ in water','sodium hydroxide (lye, drain cleaner)'],
 ['KOH','SB','oh','is a soluble hydroxide: it releases all of its OH⁻ in water','potassium hydroxide'],
 ['LiOH','SB','oh','is a soluble hydroxide: it releases all of its OH⁻ in water','lithium hydroxide'],
 ['Ca(OH)₂','SB','oh','is a soluble hydroxide: it releases all of its OH⁻ in water','calcium hydroxide (slaked lime)'],
 ['Ba(OH)₂','SB','oh','is a soluble hydroxide: it releases all of its OH⁻ in water','barium hydroxide'],
 ['Sr(OH)₂','SB','oh','is a soluble hydroxide: it releases all of its OH⁻ in water','strontium hydroxide'],
 ['NH₃','WB','amine','has a lone pair on N that accepts H⁺, which makes only a little OH⁻','ammonia (window cleaner)'],
 ['CH₃NH₂','WB','amine','has an amine group (–NH₂) whose N lone pair accepts H⁺','methylamine'],
 ['CH₃CH₂NH₂','WB','amine','has an amine group (–NH₂) whose N lone pair accepts H⁺','ethylamine'],
 ['(CH₃)₂NH','WB','amine','has an amine N (–NH–) whose lone pair accepts H⁺','dimethylamine (fishy smell)'],
 ['Na₂CO₃','WB','co3','contains the carbonate ion, CO₃²⁻, which accepts H⁺','sodium carbonate (washing soda)'],
 ['NaHCO₃','WB','co3','contains the bicarbonate ion, HCO₃⁻, which accepts H⁺','sodium bicarbonate (baking soda)'],
 ['K₂CO₃','WB','co3','contains the carbonate ion, CO₃²⁻, which accepts H⁺','potassium carbonate'],
 ['NaCl','N','none','is a salt of Na⁺ and Cl⁻: it releases neither H⁺ nor OH⁻','sodium chloride (table salt)'],
 ['KNO₃','N','none','is a salt of K⁺ and NO₃⁻: it releases neither H⁺ nor OH⁻','potassium nitrate'],
 ['CH₃OH','N','none','is an alcohol: its O–H is a covalent bond, so it does not release OH⁻ (or H⁺)','methanol'],
 ['CH₃CH₂OH','N','none','is an alcohol: its O–H is a covalent bond, so it does not release OH⁻ (or H⁺)','ethanol'],
 ['C₆H₁₂O₆','N','none','is a sugar: its –OH groups are alcohol groups, not hydroxide ions','glucose'],
 ['CH₄','N','none','has H atoms, but they are bonded to carbon and are not given off as H⁺','methane'],
 ['CH₃COOCH₃','N','none','is an ester (–COO–): it has no –COOH hydrogen to give off and no amine','methyl acetate (nail polish remover)']];
const CAT_NAME={SA:'Strong acid',WA:'Weak acid',SB:'Strong base',WB:'Weak base',N:'Neither'};
const isAcid=c=>c==='SA'||c==='WA',isBase=c=>c==='SB'||c==='WB';

/* ions for neutralization equations: [symbol, charge, polyatomic] */
const CATIONS={Na:['Na',1],K:['K',1],Li:['Li',1],Ca:['Ca',2],Ba:['Ba',2],Sr:['Sr',2],Mg:['Mg',2]};
const ANIONS={Cl:['Cl',1,false],Br:['Br',1,false],I:['I',1,false],NO3:['NO₃',1,true],ClO4:['ClO₄',1,true],SO4:['SO₄',2,true]};
const acidF=a=>'H'+sub(a[1])+a[0];
const baseF=c=>c[1]>1?`${c[0]}(OH)${sub(c[1])}`:c[0]+'OH';
const ionPart=(ion,n)=>n>1?(ion[2]?`(${ion[0]})${sub(n)}`:ion[0]+sub(n)):ion[0];
function saltF(c,a){const g=gcd(c[1],a[1]);return c[0]+sub(a[1]/g)+ionPart(a,c[1]/g)}
const cf=n=>n>1?n+' ':'';

/* conjugate ladders: [body, charge] from most H to least H (each step = one H⁺) */
const LADDERS=[
 [['H₃PO₄',0],['H₂PO₄',-1],['HPO₄',-2],['PO₄',-3]],
 [['H₂CO₃',0],['HCO₃',-1],['CO₃',-2]],
 [['H₂SO₄',0],['HSO₄',-1],['SO₄',-2]],
 [['H₃O',1],['H₂O',0],['OH',-1]],
 [['NH₄',1],['NH₃',0],['NH₂',-1]],
 [['H₂S',0],['HS',-1],['S',-2]],
 [['HF',0],['F',-1]],[['HCl',0],['Cl',-1]],[['HNO₃',0],['NO₃',-1]],[['HNO₂',0],['NO₂',-1]],
 [['CH₃COOH',0],['CH₃COO',-1]],[['HCN',0],['CN',-1]],[['CH₃NH₃',1],['CH₃NH₂',0]]];
const sp=e=>e[0]+chg(e[1]);

/* Brønsted–Lowry reactions as written, with the role of each species.
   roles: A acid, B base, CA conjugate acid, CB conjugate base */
const BL_RX=[
 [['HNO₃','A'],['H₂O','B'],['H₃O⁺','CA'],['NO₃⁻','CB']],
 [['HF','A'],['H₂O','B'],['H₃O⁺','CA'],['F⁻','CB']],
 [['H₂SO₄','A'],['H₂O','B'],['HSO₄⁻','CB'],['H₃O⁺','CA']],
 [['HCO₃⁻','B'],['H₂O','A'],['H₂CO₃','CA'],['OH⁻','CB']],
 [['NH₃','B'],['H₂O','A'],['NH₄⁺','CA'],['OH⁻','CB']],
 [['CH₃COOH','A'],['H₂O','B'],['CH₃COO⁻','CB'],['H₃O⁺','CA']],
 [['HCl','A'],['NH₃','B'],['NH₄⁺','CA'],['Cl⁻','CB']],
 [['CH₃NH₂','B'],['H₂O','A'],['CH₃NH₃⁺','CA'],['OH⁻','CB']],
 [['CO₃²⁻','B'],['H₂O','A'],['HCO₃⁻','CA'],['OH⁻','CB']],
 [['HBr','A'],['H₂O','B'],['H₃O⁺','CA'],['Br⁻','CB']],
 [['HSO₄⁻','A'],['H₂O','B'],['SO₄²⁻','CB'],['H₃O⁺','CA']],
 [['H₂PO₄⁻','A'],['H₂O','B'],['H₃O⁺','CA'],['HPO₄²⁻','CB']],
 [['CH₃COOH','A'],['OH⁻','B'],['CH₃COO⁻','CB'],['H₂O','CA']],
 [['HCN','A'],['H₂O','B'],['H₃O⁺','CA'],['CN⁻','CB']],
 [['HCOOH','A'],['NH₃','B'],['HCOO⁻','CB'],['NH₄⁺','CA']],
 [['HPO₄²⁻','B'],['H₂O','A'],['H₂PO₄⁻','CA'],['OH⁻','CB']]];
const ROLE_NAME={A:'Acid',B:'Base',CA:'Conj. acid',CB:'Conj. base'};
const ROLE_LONG={A:'acid',B:'base',CA:'conjugate acid',CB:'conjugate base'};

/* household solutions (Lecture 26 slides 21–22 plus common examples) */
const HOUSE=[['Stomach acid',1.50,'🫃'],['Lemon juice',2.30,'🍋'],['Wine',3.10,'🍷'],['Coffee',5.00,'☕'],['Pure water',7.00,'💧'],['Human blood',7.40,'🩸'],['Baking soda water',8.30,'🧁'],['Household ammonia',10.49,'🧴'],['Bleach',12.50,'🧺'],['Drain cleaner',14.00,'🚿']];

/* ============================== pH MATH ============================== */
const KW=1.0e-14;
const pHof=h=>-Math.log10(h);
/* indicator colors (Lecture 26 slides 42–49) */
function litmus(pH){return pH<5?['red','#e4574e','Red']:pH>8?['blue','#4f7fd6','Blue']:['purple','#9a6fc0','Purple (in between)']}
function phth(pH){return pH<8.2?['colorless','#f4f8fb','Colorless']:pH<=10.8?['faint','#f7b6d6','Light pink']:['pink','#e0489a','Dark pink']}
function universal(pH){const C=[[0,'#d93b3b'],[2,'#ee6a3a'],[4,'#f4a53b'],[5.5,'#f0d43c'],[7,'#5db85a'],[8.5,'#2fa6a0'],[10,'#3b6fd0'],[12,'#5b45b0'],[14,'#7a2f9a']];
 let i=0;while(i<C.length-2&&pH>C[i+1][0])i++;const [a,ca]=C[i],[b,cb]=C[i+1],t=Math.max(0,Math.min(1,(pH-a)/(b-a)));
 const mix=(x,y)=>Math.round(parseInt(x,16)+(parseInt(y,16)-parseInt(x,16))*t).toString(16).padStart(2,'0');
 return '#'+mix(ca.slice(1,3),cb.slice(1,3))+mix(ca.slice(3,5),cb.slice(3,5))+mix(ca.slice(5,7),cb.slice(5,7))}
/* red cabbage (anthocyanin) indicator, EXP 12a: red → pink → purple → violet → blue → green → yellow */
function cabbage(pH){const C=[[1,'#c8173a'],[3,'#e0457b'],[5.5,'#9b4a9f'],[7,'#6a55c2'],[8.5,'#3f72d0'],[10.5,'#2e9e8a'],[12,'#6fbf3f'],[14,'#e3cf33']];
 let i=0;while(i<C.length-2&&pH>C[i+1][0])i++;const [a,ca]=C[i],[b,cb]=C[i+1],t=Math.max(0,Math.min(1,(pH-a)/(b-a)));
 const mix=(x,y)=>Math.round(parseInt(x,16)+(parseInt(y,16)-parseInt(x,16))*t).toString(16).padStart(2,'0');
 return '#'+mix(ca.slice(1,3),cb.slice(1,3))+mix(ca.slice(3,5),cb.slice(3,5))+mix(ca.slice(5,7),cb.slice(5,7))}
const acidity=pH=>Math.abs(pH-7)<0.005?'neutral':pH<7?'acidic':'basic';
/* [H⁺] from charge balance, by bisection on log[H⁺]:
   h + pos/V − CT/V · Ka/(Ka+h) − Kw/h = 0
   pos = net positive "spectator" charge (mmol): conjugate-base salt + strong base added − strong acid added
   CT = total weak acid + conjugate base (mmol), V in mL (mmol/mL = M) */
function solveH(pos,CT,Ka,V){const f=h=>h+pos/V-(CT>0?CT/V*Ka/(Ka+h):0)-KW/h;let lo=-15.5,hi=1.5;
 for(let i=0;i<80;i++){const m=(lo+hi)/2;if(f(10**m)>0)hi=m;else lo=m}return 10**((lo+hi)/2)}
