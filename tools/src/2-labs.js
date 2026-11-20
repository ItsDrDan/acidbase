/* ============================== LABS ==============================
   Each lab: mount(host,cfg) builds its DOM once; live updates only change text and attributes
   (iOS Safari drops taps when DOM is rebuilt several times a second). onEvent(name) reports what the
   student did so a question's gold task box can check it. */
const svgNS='http://www.w3.org/2000/svg';
function fitCanvas(cv,w,h){const dpr=window.devicePixelRatio||1,cw=cv.clientWidth||w,want=Math.round(cw*dpr);if(cv.width!==want){cv.width=want;cv.height=Math.round(want*h/w)}const ctx=cv.getContext('2d');ctx.setTransform(cv.width/w,0,0,cv.height/h,0,0);return ctx}
const labFire=(L,ev)=>{try{L.onEvent&&L.onEvent(ev,L)}catch(e){}};
/* fast taps: act on touch-down so quick repeated taps on iPhone are never merged into one (click still works for mouse/keyboard) */
function fastTap(b,fn){let t=0;b.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'||b.disabled)return;e.preventDefault();t=Date.now();fn()});b.addEventListener('click',()=>{if(Date.now()-t<800)return;fn()})}


/* ---------- 1. Particle beaker: what does the substance look like in water? ---------- */
const PART={'H₃O⁺':'#f28b82','OH⁻':'#7fb2f0','A⁻':'#f6c26b','M⁺':'#c7a6ef','HA':'#9ad3a8','B':'#9ad3a8','BH⁺':'#c7a6ef','X':'#d4d9de'};
const BEAKER_MIX={SA:[['H₃O⁺',9],['A⁻',9]],WA:[['HA',9],['H₃O⁺',1],['A⁻',1]],SB:[['M⁺',9],['OH⁻',9]],WB:[['B',9],['BH⁺',1],['OH⁻',1]],N:[['X',11]]};
const BULB={SA:['bright','Bright: lots of ions (strong electrolyte)'],SB:['bright','Bright: lots of ions (strong electrolyte)'],WA:['dim','Dim: only a few ions (weak electrolyte)'],WB:['dim','Dim: only a few ions (weak electrolyte)'],N:['off','Off: no ions (nonelectrolyte)']};
const Beaker={el:null,raf:0,onEvent:null,cat:'SA',P:[],bulb:false,
 mount(host,cfg){this.cat=cfg.cat;this.bulb=false;host.innerHTML=`<div class="lab"><div class="ctrls"><button type="button" class="chip go" data-bulb>💡 Test conductivity</button>${speedChip()}<span class="kline" id="bkTxt" role="status" aria-live="polite">Bulb not tested yet</span></div>
  <div class="stage"><canvas id="bkCv" width="600" height="300" role="img" aria-label="${esc(this.aria())}"></canvas>
  <svg class="bulb" viewBox="0 0 60 80" aria-hidden="true"><circle id="bkGlow" cx="30" cy="28" r="27" fill="#ffe680" opacity="0"/><path d="M30 6a20 20 0 0 0-11 36.5V52h22v-9.5A20 20 0 0 0 30 6z" id="bkGlass" fill="#f3f6f9" stroke="#8a9aa6" stroke-width="2.5"/><rect x="20" y="54" width="20" height="10" rx="3" fill="#9aa7b2"/></svg></div>
  <p class="cap">Key: <b>H₃O⁺</b> hydronium · <b>OH⁻</b> hydroxide · <b>HA</b>, <b>B</b>, <b>X</b> = whole molecules (not split into ions) · <b>A⁻</b>, <b>M⁺</b>, <b>BH⁺</b> = other ions. Water molecules are not drawn.</p></div>`;
  this.el=host;const W=600,H=300;this.P=[];BEAKER_MIX[this.cat].forEach(([k,n])=>{for(let i=0;i<n;i++)this.P.push({k,x:80+Math.random()*(W-160),y:70+Math.random()*(H-110),vx:(Math.random()-.5)*60,vy:(Math.random()-.5)*60})});
  host.querySelector('[data-bulb]').onclick=()=>{this.bulb=!this.bulb;this.showBulb();labFire(this,'bulb')};wireSpeed(host)},
 aria(){const m=BEAKER_MIX[this.cat].map(([k,n])=>n+' '+k).join(', ');return 'Beaker particle view: '+m},
 showBulb(){const g=this.el.querySelector('#bkGlow'),gl=this.el.querySelector('#bkGlass'),[b,t]=BULB[this.cat];
  g.setAttribute('opacity',this.bulb?(b==='bright'?0.95:b==='dim'?0.35:0):0);gl.setAttribute('fill',this.bulb&&b!=='off'?(b==='bright'?'#fff3a6':'#fbf4d4'):'#f3f6f9');
  this.el.querySelector('#bkTxt').textContent=this.bulb?'💡 '+t:'Bulb unplugged';this.el.querySelector('[data-bulb]').textContent=this.bulb?'🔌 Unplug the bulb':'💡 Test conductivity'},
 start(){const cv=this.el.querySelector('#bkCv');let last=performance.now();const step=now=>{const dt=Math.min(0.05,(now-last)/1000)*SPEED.f();last=now;const W=600,H=300,ctx=fitCanvas(cv,W,H);
   ctx.clearRect(0,0,W,H);ctx.fillStyle='#eaf5fd';ctx.fillRect(48,48,W-96,H-62);ctx.strokeStyle='#8a9aa6';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(44,20);ctx.lineTo(44,H-10);ctx.lineTo(W-44,H-10);ctx.lineTo(W-44,20);ctx.stroke();
   if(this.bulb){ctx.fillStyle='#55606a';ctx.fillRect(150,30,10,150);ctx.fillRect(W-160,30,10,150)}
   for(const p of this.P){p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.x<74||p.x>W-74)p.vx*=-1;if(p.y<70||p.y>H-36)p.vy*=-1;p.x=Math.max(74,Math.min(W-74,p.x));p.y=Math.max(70,Math.min(H-36,p.y));
    const mol=/^(HA|B|X)$/.test(p.k),r=mol?24:20;ctx.beginPath();ctx.arc(p.x,p.y,r,0,7);ctx.fillStyle=PART[p.k];ctx.fill();ctx.lineWidth=mol?3:2;ctx.strokeStyle=mol?'#4b7a58':'#5c6a75';ctx.stroke();
    ctx.fillStyle='#22313b';ctx.font='bold 15px Inter,system-ui,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(p.k,p.x,p.y+1)}
   this.raf=requestAnimationFrame(step)};this.raf=requestAnimationFrame(step)},
 stop(){cancelAnimationFrame(this.raf);this.raf=0}};

/* ---------- 2. pH Lab: slider, household solutions, indicators, four corners ---------- */
/* 32 dot spots: a jittered 8 × 4 grid in a fixed shuffled order (seeded, so every visit looks the same) */
const PHDOTS=(()=>{let r=11;const rand=()=>(r=(r*9301+49297)%233280)/233280,a=[];for(let i=0;i<32;i++)a.push([24+(i%8)*19+rand()*9,64+Math.floor(i/8)*29+rand()*12]);
 for(let i=a.length-1;i>0;i--){const j=Math.floor(rand()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a})();
const PHLab={el:null,onEvent:null,pH:7,ind:'uni',picked:null,seen:new Set(),
 mount(host,cfg){this.pH=cfg.pH0!=null?cfg.pH0:7;this.ind=cfg.ind||'uni';this.picked=null;this.seen=new Set([Math.round(this.pH*10)/10]);
  host.innerHTML=`<div class="lab"><div class="ctrls"><label class="slider"><span>pH</span><input type="range" id="phR" min="0" max="14" step="0.1" value="${this.pH}" aria-label="pH"><output id="phO">${this.pH.toFixed(2)}</output></label></div>
  <div class="ctrls"><select id="phPick" class="chip" aria-label="Pick a solution"><option value="">🧴 Pick a solution…</option>${HOUSE.map((h,i)=>`<option value="${i}">${h[2]} ${h[0]}</option>`).join('')}</select>
  <span class="seg" role="group" aria-label="Indicator">${[['litmus','Litmus'],['phth','Phenolphthalein'],['uni','Universal']].map(([k,t])=>`<button type="button" data-ind="${k}" aria-pressed="${k===this.ind}">${t}</button>`).join('')}</span></div>
  <div class="phwrap"><svg viewBox="0 0 280 220" class="phsvg" role="img" aria-label="Beaker with indicator"><path d="M30 20v175a12 12 0 0 0 12 12h196a12 12 0 0 0 12-12V20" fill="none" stroke="#8a9aa6" stroke-width="5"/>
   <rect id="phLiq" x="33" y="60" width="214" height="144" rx="8" fill="#5db85a" opacity=".75"/>
   ${PHDOTS.map(([x,y],i)=>`<g id="phd${i}"><circle cx="${x+20}" cy="${y+20}" r="8" fill="#fff" stroke="#22313b" stroke-width="1.5"/><text x="${x+20}" y="${y+24}" font-size="10" font-weight="800" text-anchor="middle"></text></g>`).join('')}
   <g id="phStrip"><rect x="200" y="6" width="22" height="120" rx="3" fill="#fff" stroke="#8a9aa6" stroke-width="2"/><rect id="phStripC" x="201" y="62" width="20" height="63" fill="#9a6fc0"/></g></svg>
   <div class="corners"><div class="cn"><small>pH</small><b id="cpH"></b></div><div class="cn"><small>pOH</small><b id="cpOH"></b></div><div class="cn"><small>[H⁺] or [H₃O⁺]</small><b id="cH"></b></div><div class="cn"><small>[OH⁻]</small><b id="cOH"></b></div>
   <div class="status" id="phStat" role="status" aria-live="polite"></div><div class="kline" id="phInd"></div></div></div>
  <p class="cap">Dots: <b style="color:#c0392b">+</b> = H₃O⁺, <b style="color:#2f6fbf">−</b> = OH⁻ (each step of 1 pH is 10× more ions, so the dots are not to scale).</p></div>`;
  this.el=host;const R=host.querySelector('#phR');
  R.oninput=()=>{this.pH=Number(R.value);this.picked=null;host.querySelector('#phPick').value='';this.seen.add(Math.round(this.pH*10)/10);this.show();labFire(this,'slide')};
  host.querySelector('#phPick').onchange=e=>{const v=e.target.value;if(v==='')return;const h=HOUSE[+v];this.picked=h[0];this.pH=h[1];R.value=h[1];this.seen.add(Math.round(h[1]*10)/10);this.show();labFire(this,'pick')};
  host.querySelectorAll('[data-ind]').forEach(b=>b.onclick=()=>{this.ind=b.dataset.ind;host.querySelectorAll('[data-ind]').forEach(x=>x.setAttribute('aria-pressed',x===b));this.show();labFire(this,'ind')});
  this.show()},
 show(){const el=this.el,p=this.pH,h=10**-p,oh=KW/h;const set=(id,t)=>{const e=el.querySelector('#'+id);if(e.textContent!==t)e.textContent=t};
  set('phO',p.toFixed(2));set('cpH',p.toFixed(2));set('cpOH',(14-p).toFixed(2));set('cH',sci(h,2)+' M');set('cOH',sci(oh,2)+' M');
  const a=acidity(p);const st=el.querySelector('#phStat');st.className='status '+(a==='acidic'?'l':a==='basic'?'r':'eq');set('phStat',(a==='acidic'?'🍋 Acidic: [H⁺] > [OH⁻]':a==='basic'?'🧼 Basic: [OH⁻] > [H⁺]':'⚖️ Neutral: [H⁺] = [OH⁻]')+(this.picked?' · '+this.picked:''));
  const liq=el.querySelector('#phLiq'),strip=el.querySelector('#phStrip');
  if(this.ind==='uni'){liq.setAttribute('fill',universal(p));liq.setAttribute('opacity','.8');strip.style.display='none';set('phInd','Universal indicator: color changes all along the scale')}
  else if(this.ind==='phth'){const c=phth(p);liq.setAttribute('fill',c[1]);liq.setAttribute('opacity',c[0]==='colorless'?'.5':'.85');strip.style.display='none';set('phInd','Phenolphthalein: '+c[2])}
  else{const c=litmus(p);liq.setAttribute('fill','#eaf5fd');liq.setAttribute('opacity','.8');strip.style.display='';el.querySelector('#phStripC').setAttribute('fill',c[1]);set('phInd','Litmus paper: '+c[2])}
  const nH=Math.round(Math.max(0,Math.min(16,8+(7-p)*8/7))),nO=Math.round(Math.max(0,Math.min(16,8+(p-7)*8/7)));
  PHDOTS.forEach((_,i)=>{const g=el.querySelector('#phd'+i),t=g.querySelector('text'),c=g.querySelector('circle');const isH=i%2===0,k=Math.floor(i/2),on=isH?k<nH:k<nO;
   g.style.display=on?'':'none';if(on){const want=isH?'+':'−';if(t.textContent!==want){t.textContent=want;c.setAttribute('fill',isH?'#f9c4bf':'#c9dcf7')}}})},
 start(){},stop(){}};

/* ---------- 3. Titration Lab: buret, flask with phenolphthalein, pH curve ---------- */
const TitLab={el:null,onEvent:null,cfg:null,Vb:0,hist:[],endV:null,over:false,flashT:0,
 Veq(){const c=this.cfg;return c.r*c.Ca*c.Va/(c.m*c.Cb)},
 pHat(Vb){const c=this.cfg,nA=c.Ca*c.Va,nB=c.Cb*Vb*c.m,V=c.Va+Vb;return pHof(c.Ka?solveH(nB,nA,c.Ka,V):solveH(nB-c.r*nA,0,0,V))},
 mount(host,cfg){this.cfg=cfg;this.Vb=0;this.endV=null;this.over=false;this.hist=[[0,this.pHat(0)]];
  host.innerHTML=`<div class="lab"><div class="eqrow">${cfg.Va.toFixed(1)} mL ${cfg.acidF} + phenolphthalein · buret: ${cfg.Cb.toFixed(3)} M ${cfg.baseF}</div>
  <div class="ctrls" role="group" aria-label="Add base from the buret">${[[5,'+5.00 mL'],[1,'+1.00 mL'],[0.1,'+0.10 mL'],[0.05,'💧 1 drop']].map(([v,t])=>`<button type="button" class="chip go" data-add="${v}">${t}</button>`).join('')}<button type="button" class="chip rst" data-refill>↺ Refill</button></div>
  <div class="titwrap"><svg viewBox="0 0 260 250" class="titsvg" role="img" aria-label="Buret over a flask"><rect x="112" y="6" width="22" height="150" rx="4" fill="#fff" stroke="#8a9aa6" stroke-width="2.5"/><rect id="tbLiq" x="114" y="8" width="18" height="146" fill="#cfe6fa"/>
   ${[0,10,20,30,40,50].map(v=>`<line x1="112" x2="104" y1="${8+v*2.92}" y2="${8+v*2.92}" stroke="#8a9aa6" stroke-width="2"/><text x="100" y="${12+v*2.92}" font-size="10" text-anchor="end" fill="#5c6a75">${v}</text>`).join('')}
   <path d="M117 156h12l-3 14h-6z" fill="#8a9aa6"/><circle id="tbDrop" cx="123" cy="178" r="4" fill="#cfe6fa" opacity="0"/>
   <path d="M103 186h40v14l38 40H65l38-40z" fill="none" stroke="#8a9aa6" stroke-width="3.5" stroke-linejoin="round"/><path id="tfLiq" d="M100 212h46l28 26H72z" fill="#f4f8fb" stroke="none" style="transition:fill .35s"/></svg>
   <div class="titread"><div class="cn"><small>Buret reading</small><b id="tRead">0.00 mL</b></div><div class="cn"><small>pH meter</small><b id="tpH"></b></div>
   <div class="kline">In the flask (mmol):</div><div class="bars"><span>Acid H⁺ left</span><i><u id="barH"></u></i><b id="nH"></b><span>OH⁻ added</span><i><u id="barO"></u></i><b id="nO"></b></div>
   <div class="status" id="tStat" role="status" aria-live="polite">Colorless: still acidic. Start adding base.</div></div></div>
  <div class="graphwrap"><canvas id="tCv" width="600" height="190" role="img" aria-label="pH versus mL of base added"></canvas><p class="cap">Titration curve: pH (up) vs. mL of ${cfg.baseF} added. Pink band = where phenolphthalein turns pink.</p></div></div>`;
  this.el=host;host.querySelectorAll('[data-add]').forEach(b=>fastTap(b,()=>this.add(Number(b.dataset.add))));host.querySelector('[data-refill]').onclick=()=>this.refill();this.show()},
 add(v){if(this.endV!=null||this.over)return;if(this.Vb+v>50.0001){this.say('The buret only holds 50 mL. Tap ↺ Refill.');return}
  const prev=this.Vb;this.Vb=Math.round((this.Vb+v)*100)/100;const p=this.pHat(this.Vb);this.hist.push([this.Vb,p]);
  const d=this.el.querySelector('#tbDrop');d.setAttribute('opacity','1');setTimeout(()=>d.setAttribute('opacity','0'),180);
  const c=phth(p);
  if(c[0]==='faint'){this.endV=this.Vb;this.show();this.say(`🎉 Faint pink that stays! Endpoint at ${this.Vb.toFixed(2)} mL. Write that reading down.`);this.lock(true);labFire(this,'endpoint');return}
  if(c[0]==='pink'){this.over=true;this.show();this.say('😬 Dark pink: you passed the endpoint. Tap ↺ Refill and add drops near the end.');this.lock(true);labFire(this,'over');return}
  this.show();const left=this.Veq()-this.Vb;
  if(left<1.0){const f=this.el.querySelector('#tfLiq');f.style.fill='#f7b6d6';clearTimeout(this.flashT);this.flashT=setTimeout(()=>{f.style.fill=''},450);this.say('A pink swirl appears, then fades. You are close: use drops now!')}
  else this.say(prev===0?'Colorless: the OH⁻ is being used up by H⁺ (neutralization).':'Still colorless: H⁺ + OH⁻ → H₂O keeps using up the base.');labFire(this,'add')},
 lock(on){this.el.querySelectorAll('[data-add]').forEach(b=>b.disabled=on)},
 refill(){this.Vb=0;this.endV=null;this.over=false;this.hist=[[0,this.pHat(0)]];this.lock(false);this.show();this.say('Refilled. Colorless: still acidic. Start adding base.');labFire(this,'refill')},
 say(t){const e=this.el.querySelector('#tStat');e.textContent=t;e.className='status '+(this.over?'l':this.endV!=null?'eq':'r')},
 show(){const el=this.el,c=this.cfg,p=this.pHat(this.Vb);el.querySelector('#tRead').textContent=this.Vb.toFixed(2)+' mL';el.querySelector('#tpH').textContent=p.toFixed(2);
  el.querySelector('#tbLiq').setAttribute('y',8+this.Vb*2.92);el.querySelector('#tbLiq').setAttribute('height',Math.max(0,146-this.Vb*2.92));
  const col=phth(p);el.querySelector('#tfLiq').setAttribute('fill',col[0]==='colorless'?'#d6e8f6':col[1]);
  const nA=c.r*c.Ca*c.Va,nB=c.Cb*this.Vb*c.m,mx=Math.max(nA,nB,1e-9)*1.05;
  const hLeft=Math.max(0,nA-nB);el.querySelector('#barH').style.width=(hLeft/mx*100)+'%';el.querySelector('#barO').style.width=(nB/mx*100)+'%';
  el.querySelector('#nH').textContent=hLeft.toFixed(2);el.querySelector('#nO').textContent=nB.toFixed(2);this.graph()},
 graph(){const cv=this.el.querySelector('#tCv'),w=600,h=190,ctx=fitCanvas(cv,w,h),X0=36,Y0=170,xm=Math.min(50,Math.max(10,Math.ceil(this.Veq()*1.5/5)*5)),sx=(w-50)/xm,sy=150/14;
  ctx.clearRect(0,0,w,h);ctx.fillStyle='#fde3ef';ctx.fillRect(X0,Y0-10.4*sy,w-50,(10.4-8.2)*sy);ctx.strokeStyle='#c9d4dd';ctx.lineWidth=1;ctx.font='11px Inter,system-ui,sans-serif';ctx.fillStyle='#5c6a75';
  for(let y=0;y<=14;y+=7){ctx.beginPath();ctx.moveTo(X0,Y0-y*sy);ctx.lineTo(w-14,Y0-y*sy);ctx.stroke();ctx.fillText(y,X0-20,Y0-y*sy+4)}
  for(let x=0;x<=xm;x+=5){ctx.fillText(x,X0+x*sx-5,Y0+14)}
  ctx.strokeStyle='#3b8ccb';ctx.lineWidth=3;ctx.beginPath();this.hist.forEach(([v,p],i)=>{const X=X0+Math.min(v,xm)*sx,Y=Y0-p*sy;i?ctx.lineTo(X,Y):ctx.moveTo(X,Y)});ctx.stroke();
  const L=this.hist[this.hist.length-1];ctx.fillStyle='#e0675a';ctx.beginPath();ctx.arc(X0+Math.min(L[0],xm)*sx,Y0-L[1]*sy,5,0,7);ctx.fill()},
 start(){},stop(){clearTimeout(this.flashT)}};

/* ---------- 4. Buffer Lab: plain water vs. a buffer, side by side ---------- */
const BUF_SYS={
 acetic:{name:'Acetic acid / acetate',HA:'CH₃COOH',A:'CH₃COO⁻',salt:'NaCH₃COO',Ka:1.8e-5,a:5,b:5,real:'Vinegar-based buffer, used in labs and foods'},
 phos:{name:'Phosphate (H₂PO₄⁻ / HPO₄²⁻)',HA:'H₂PO₄⁻',A:'HPO₄²⁻',salt:'Na₂HPO₄',Ka:6.2e-8,a:5,b:5,real:'The main buffer inside your cells'},
 nh3:{name:'Ammonia / ammonium',HA:'NH₄⁺',A:'NH₃',salt:'NH₄Cl',Ka:5.6e-10,a:5,b:5,real:'A weak base with its conjugate acid also makes a buffer'},
 blood:{name:'Blood (H₂CO₃ / HCO₃⁻)',HA:'H₂CO₃',A:'HCO₃⁻',salt:'NaHCO₃',Ka:7.9e-7,a:2,b:40,real:'Keeps blood at pH 7.35–7.45. It holds 20× more HCO₃⁻ than H₂CO₃ because the body makes more acid than base. Below 7.35 is acidosis: in a real body the lungs (breathing out CO₂) and kidneys back the buffer up'}};
const BUF_SYS_LIST=[['acetic','Acetic'],['phos','Phosphate'],['nh3','Ammonia'],['blood','🩸 Blood']];
const BufLab={el:null,onEvent:null,sys:'acetic',acid:0,base:0,start0:null,broken:false,
 S(){return BUF_SYS[this.sys]},
 amounts(){const s=this.S(),net=this.acid-this.base;return {HA:Math.max(0,Math.min(s.a+s.b,s.a+net)),A:Math.max(0,Math.min(s.a+s.b,s.b-net))}},
 pHw(){return pHof(solveH(this.base-this.acid,0,0,100))},
 pHb(){const s=this.S();return pHof(solveH(s.b+this.base-this.acid,s.a+s.b,s.Ka,100))},
 mount(host,cfg){this.sys=cfg.sys||'acetic';this.acid=0;this.base=0;this.broken=false;const s=this.S();
  host.innerHTML=`<div class="lab">${cfg.choose?`<div class="ctrls" role="group" aria-label="Choose a buffer">${BUF_SYS_LIST.map(([k,t])=>`<button type="button" class="chip ${k===this.sys?'on':''}" aria-pressed="${k===this.sys}" data-bsys="${k}">${t}</button>`).join('')}</div>`:''}
  <div class="ctrls" role="group" aria-label="Add to both beakers"><button type="button" class="chip go" data-badd="acid">+ HCl (acid)</button><button type="button" class="chip go" data-badd="base">+ NaOH (base)</button><button type="button" class="chip rst" data-breset>↺ Reset</button><span class="kline">Each tap adds 1 mmol to <b>both</b> beakers.</span></div>
  <div class="real" id="bReal"></div>
  <div class="bufwrap">${['w','b'].map(k=>`<div class="bk"><div class="bkt">${k==='w'?'💧 Plain water':'🛡️ Buffer'}</div><svg viewBox="0 0 160 150" role="img" aria-label="${k==='w'?'Water':'Buffer'} beaker"><path d="M18 10v118a10 10 0 0 0 10 10h104a10 10 0 0 0 10-10V10" fill="none" stroke="#8a9aa6" stroke-width="4"/><rect id="bl${k}" x="21" y="40" width="118" height="95" rx="6" opacity=".8"/><text id="bt${k}" x="80" y="98" text-anchor="middle" font-size="30" font-weight="900" fill="#22313b"></text></svg><div class="kline" id="bd${k}"></div></div>`).join('')}</div>
  <div class="tokens"><div><b id="bHAn"></b><span id="bHA" aria-hidden="true"></span></div><div><b id="bAn"></b><span id="bA" aria-hidden="true"></span></div></div>
  <div class="status r" id="bStat" role="status" aria-live="polite"></div></div>`;
  this.el=host;host.querySelectorAll('[data-badd]').forEach(b=>fastTap(b,()=>this.add(b.dataset.badd)));host.querySelector('[data-breset]').onclick=()=>{this.reset();labFire(this,'reset')};
  host.querySelectorAll('[data-bsys]').forEach(b=>b.onclick=()=>{this.sys=b.dataset.bsys;host.querySelectorAll('[data-bsys]').forEach(x=>{x.classList.toggle('on',x===b);x.setAttribute('aria-pressed',x===b)});this.reset();labFire(this,'sys')});
  this.reset()},
 reset(){this.acid=0;this.base=0;this.broken=false;this.start0=[this.pHw(),this.pHb()];const s=this.S();this.el.querySelector('#bReal').textContent='🔗 '+s.name+': '+s.real;this.show(`Buffer = ${s.HA} (weak acid) + ${s.A} (its conjugate base). Add some acid or base.`)},
 add(k){const before=this.amounts();if(k==='acid')this.acid++;else this.base++;const s=this.S(),after=this.amounts();let msg;
  if(k==='acid')msg=before.A>0?`H⁺ + ${s.A} → ${s.HA}: the buffer's base part used up the added acid.`:`No ${s.A} left to grab the H⁺! The extra H⁺ stays in solution.`;
  else msg=before.HA>0?`OH⁻ + ${s.HA} → ${s.A} + H₂O: the buffer's acid part used up the added base.`:`No ${s.HA} left to react with the OH⁻! The extra OH⁻ stays in solution.`;
  if((after.A===0||after.HA===0)&&!this.broken){this.broken=true;msg+=' ⚠️ One buffer part is used up: the buffer capacity is reached.'}
  this.show(msg);labFire(this,k);if(this.acid>=2)labFire(this,'acid2');if(this.base>=2)labFire(this,'base2');if(Math.abs(this.pHb()-this.start0[1])>1)labFire(this,'broken')},
 show(msg){const el=this.el,s=this.S(),w=this.pHw(),b=this.pHb(),am=this.amounts();
  [['w',w,this.start0[0]],['b',b,this.start0[1]]].forEach(([k,p,p0])=>{el.querySelector('#bl'+k).setAttribute('fill',universal(p));el.querySelector('#bt'+k).textContent='pH '+p.toFixed(2);const d=p-p0;el.querySelector('#bd'+k).textContent=`Started at ${p0.toFixed(2)} · change ${d>=0?'+':'−'}${Math.abs(d).toFixed(2)}`});
  const dots=(n,c)=>c.repeat(Math.min(20,Math.round(n)));el.querySelector('#bHAn').textContent=`${s.HA}: ${am.HA} mmol `;el.querySelector('#bHA').textContent=dots(am.HA,'●');el.querySelector('#bAn').textContent=`${s.A}: ${am.A} mmol `;el.querySelector('#bA').textContent=dots(am.A,'○');
  const st=el.querySelector('#bStat');st.textContent=msg;st.className='status '+(this.broken?'l':'eq')},
 start(){},stop(){}};

/* speed control (only the particle beaker animates) */
const SPEEDS=[[1,'▶ Normal speed'],[0.3,'🐢 Slow motion'],[0,'⏸ Paused']];
const SPEED={i:typeof matchMedia!=='undefined'&&matchMedia('(prefers-reduced-motion: reduce)').matches?1:0,f(){return SPEEDS[this.i][0]}};
const speedChip=()=>`<button type="button" class="chip spd" data-speed aria-label="Animation speed: ${SPEEDS[SPEED.i][1].slice(2)}. Tap to change.">${SPEEDS[SPEED.i][1]}</button>`;
function wireSpeed(el){el.querySelectorAll('[data-speed]').forEach(b=>b.onclick=()=>{SPEED.i=(SPEED.i+1)%SPEEDS.length;el.querySelectorAll('[data-speed]').forEach(x=>{x.textContent=SPEEDS[SPEED.i][1];x.setAttribute('aria-label',`Animation speed: ${SPEEDS[SPEED.i][1].slice(2)}. Tap to change.`)})})}
const LABS={beaker:Beaker,ph:PHLab,tit:TitLab,buf:BufLab};
