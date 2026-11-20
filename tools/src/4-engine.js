/* ============================== ENGINE (practice card) ============================== */
const REFERENCE=[
 ['Strong acids and bases (green sheet)',`<b>Strong acids:</b> ${STRONG_LIST}. Every other acid is weak.<br><b>Strong bases:</b> soluble hydroxides: LiOH, NaOH, KOH, Ca(OH)₂, Sr(OH)₂, Ba(OH)₂.<br>Strong = 100% ions (strong electrolyte). Weak = mostly whole molecules.`],
 ['Spotting acids and bases','<b>Acids:</b> binary (HCl), oxyacids (H₂SO₄), carboxylic acids (–COOH).<br><b>Bases:</b> OH⁻ (NaOH), CO₃²⁻/HCO₃⁻ (baking soda), amines (–NH₂, N lone pair).<br>An alcohol –OH (CH₃OH) is <b>not</b> hydroxide.'],
 ['Definitions','<table><tr><td></td><td><b>Acid</b></td><td><b>Base</b></td></tr><tr><td>Arrhenius</td><td>makes H⁺ in water</td><td>makes OH⁻ in water</td></tr><tr><td>Brønsted–Lowry</td><td>H⁺ donor</td><td>H⁺ acceptor</td></tr><tr><td>Taste, litmus</td><td>sour, red</td><td>bitter, blue</td></tr><tr><td>Phenolphthalein</td><td>colorless</td><td>pink</td></tr></table>'],
 ['Conjugate pairs','HA + B ⇌ A⁻ + BH⁺<br>Acid → conjugate base (one H⁺ less). Base → conjugate acid (one H⁺ more). A pair differs by exactly one H⁺.'],
 ['The pH four corners','pH = −log[H⁺] &nbsp;·&nbsp; [H⁺] = 10<sup>−pH</sup><br>pOH = −log[OH⁻] &nbsp;·&nbsp; [OH⁻] = 10<sup>−pOH</sup><br>pH + pOH = 14.00 &nbsp;·&nbsp; [H⁺][OH⁻] = 1.0 × 10⁻¹⁴<br>pH &lt; 7 acidic, 7 neutral, &gt; 7 basic. Decimal places in pH = sig figs in [H⁺].'],
 ['Neutralization and titration','Acid + base → salt + water (H⁺ + OH⁻ → H₂O). Metal + acid → salt + H₂(g).<br>Titration: mol base = M × L → mole ratio → mol acid → M = mol ÷ L. Endpoint = faint pink that stays.'],
 ['Buffers','Weak acid + its conjugate base (or weak base + conjugate acid). The base part grabs added H⁺; the acid part neutralizes added OH⁻. Blood: H₂CO₃ / HCO₃⁻, pH 7.35–7.45.']];
let ui={};try{ui=JSON.parse(localStorage.getItem(GAME_KEY+'-ui')||'{}')}catch(e){}
const saveUI=()=>{try{localStorage.setItem(GAME_KEY+'-ui',JSON.stringify(ui))}catch(e){}};
const state={mode:MODES.some(m=>m.id===ui.mode)?ui.mode:MODES[0].id,q:null,sel:null,done:false,correct:0,streak:0,assist:0,taskOk:true,taskAt:0,logged:false,lab:null};
function toast(t){const e=$('toast');e.textContent=t;e.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove('on'),2600)}
function confetti(){if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;const c=['#ff7d73','#70b7e8','#8fd8c8','#f7c968','#e9a3cc'];for(let i=0;i<50;i++){const p=document.createElement('i');p.className='confetti';p.style.left=Math.random()*100+'vw';p.style.background=c[i%5];p.style.animationDelay=Math.random()*.5+'s';document.body.appendChild(p);setTimeout(()=>p.remove(),3600)}}
const JK=GAME_KEY+'-journey',jBlank=()=>({xp:0,correct:0,best:0,modes:{},badges:{}});let J=jBlank();try{J=Object.assign(jBlank(),JSON.parse(localStorage.getItem(JK)||'{}'))}catch(e){}
const BADGES=[['first','🌱','First Answer','Answer a question',j=>j.correct>=1],['ten','🔟','Ten Correct','10 on your own',j=>j.correct>=10],['fifty','🏅','Fifty Correct','50 on your own',j=>j.correct>=50],
 ['s5','🔥','Hot Streak','5 in a row',j=>j.best>=5],['s10','⚡','On Fire','10 in a row',j=>j.best>=10],
 ['id','🔍','Acid Spotter','10 in Acid or Base?',j=>(j.modes.id||0)>=10],['ph','🌈','pH Painter','5 in pH Lab',j=>(j.modes.ph||0)>=5],['calc','🧮','Log Master','10 in pH Calculator',j=>(j.modes.calc||0)>=10],
 ['pairs','🔄','Proton Matchmaker','10 in Proton Pairs',j=>(j.modes.pairs||0)>=10],['titrate','⚗️','Faint Pink','5 in Titration Lab',j=>(j.modes.titrate||0)>=5],['buffer','🛡️','Buffer Guard','5 in Buffer Lab',j=>(j.modes.buffer||0)>=5],
 ['quiz','🎯','Skill Check Star','8+ on a Skill Check',j=>(j.bestQuiz||0)>=8],['all','🧭','Explorer','Every mode',j=>MODES.every(m=>j.modes[m.id])]];
function renderJ(){const l=Math.floor(J.xp/100)+1,i=J.xp%100;$('jChip').textContent=`Level ${l} • ${J.xp} XP`;$('lvl').textContent='Level '+l;$('xpFill').style.width=i+'%';$('xpTxt').textContent=i+' / 100 XP';
 $('badges').innerHTML=BADGES.map(([id,em,t,d])=>`<div class="bdg ${J.badges[id]?'got':''}"><img src="assets/ach-${id}.webp" alt="" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'em',textContent:'${em}'}))"><span><b>${t}</b>${d}</span></div>`).join('')}
function checkBadges(){BADGES.forEach(([id,em,t,,ok])=>{if(!J.badges[id]&&ok(J)){J.badges[id]=1;toast('Badge earned: '+em+' '+t)}})}
function award(assisted){const before=Math.floor(J.xp/100);if(assisted)J.xp+=2;else{J.xp+=10+Math.min(state.streak,5)*2;J.correct++;J.best=Math.max(J.best,state.streak);J.modes[state.mode]=(J.modes[state.mode]||0)+1}
 checkBadges();if(Math.floor(J.xp/100)>before)toast('Level up!');try{localStorage.setItem(JK,JSON.stringify(J))}catch(e){}renderJ()}
function stats(){[['nCorrect',state.correct],['nStreak',state.streak],['nAssist',state.assist]].forEach(([id,v])=>{const e=$(id);if(e.textContent!==String(v)){e.textContent=v;const p=e.parentElement;p.classList.remove('pop');void p.offsetWidth;p.classList.add('pop')}})}
function fb(k,h){$('fb').className='fb '+k;$('fb').innerHTML=h}
function log(ok){if(state.logged)return;state.logged=true;try{window.ddTrack&&ddTrack({game:'acidbase',course:'3A',mode:MODES.find(m=>m.id===state.mode).title,topic:state.q.topic||state.q.video||'',correct:!!ok})}catch(e){}}
function buildModes(){$('modes').innerHTML=MODES.map(m=>`<button type="button" class="mode ${m.id===state.mode?'on':''}" aria-pressed="${m.id===state.mode}" data-m="${m.id}" style="--mb:${m.mb};--ma:${m.ma}"><span class="ic art" aria-hidden="true"><img src="assets/mode-${m.id}.webp" alt="" onerror="this.parentNode.classList.remove('art');this.parentNode.textContent='${m.icon}'"></span><b>${m.title}</b><small>${m.short}</small></button>`).join('');
 $('modes').querySelectorAll('.mode').forEach(b=>b.onclick=()=>{state.mode=b.dataset.m;ui.mode=state.mode;saveUI();buildModes();next()})}
/* labs: a fresh lab for every question, so each task starts from the same baseline */
const labHost=document.createElement('div');
function stopLabs(){Object.values(LABS).forEach(L=>L.stop())}
function mountLab(spec){stopLabs();const L=LABS[spec.kind];L.onEvent=null;L.mount(labHost,spec.cfg||{});L.start();L.onEvent=ev=>taskEvent(ev,L);state.lab=L;return L}
function taskEvent(ev,L){const t=state.q&&state.q.task;if(!t||state.taskOk||state.done)return;const ok=typeof t.need==='function'?t.need(L):ev===t.need;if(!ok)return;
 if(state.q.onTask)state.q.onTask(L);state.taskOk=true;const el=$('taskBox');if(el){el.className='task done';el.innerHTML='✅ Done! Now answer below.'}$('checkBtn').disabled=false;
 if(state.q.type==='num'&&$('numIn')){$('numIn').disabled=false;$('numIn').placeholder='Your answer'}}
function startQuiz(){state.quiz={plan:shuf(QUIZ_PLAN.slice(0,4)).concat(shuf(QUIZ_PLAN.slice(4,7)),shuf(QUIZ_PLAN.slice(7))),i:0,res:[],over:false}}
function quizSummary(){const Q=state.quiz,n=Q.res.filter(r=>r.ok).length;Q.over=true;J.bestQuiz=Math.max(J.bestQuiz||0,n);checkBadges();try{localStorage.setItem(JK,JSON.stringify(J))}catch(e){}renderJ();
 const miss={};Q.res.forEach(r=>{if(!r.ok)miss[r.topic]=(miss[r.topic]||0)+1});
 const rows=Object.keys(TOPICS).filter(t=>Q.res.some(r=>r.topic===t)).map(t=>{const R=Q.res.filter(r=>r.topic===t),k=R.filter(r=>r.ok).length;return `<tr><td>${k===R.length?'✅':'❌'}</td><td>${TOPICS[t][0]}</td><td>${k} / ${R.length}</td></tr>`}).join('');
 const plan=Object.keys(miss).map(t=>`<div class="item"><b>📌 ${TOPICS[t][0]}</b><br><button type="button" class="btn hint" data-go="${t}">Practice this</button><button type="button" class="btn show" data-vid="${t}">🎥 Watch Dr. Dan</button></div>`).join('');
 const msg=n>=9?'🌟 Excellent! You are ready.':n>=7?'👍 Solid. Review the topics below.':n>=5?'📚 Getting there. Practice the topics below, then try again.':'🧭 Start with the topics below; the labs help a lot.';
 $('qArea').innerHTML=`<div class="qsum"><p class="prompt">Skill Check complete</p><div class="big">${n} / ${Q.res.length}</div><p>${msg}</p><table>${rows}</table>
  <h3 style="margin:14px 0 4px">Your study plan</h3>${plan?`<div class="plan">${plan}</div>`:'<p>Nothing to review: every topic was right. Try another Skill Check to be sure!</p>'}
  <button type="button" class="btn check" id="againBtn" style="margin-top:14px">🎯 Start a new Skill Check</button></div>`;
 ['checkBtn','hintBtn','showBtn'].forEach(id=>$(id).disabled=true);fb('','');$('newBtn').textContent='New Skill Check ↻';$('practice').classList.add('quizdone');$('modeTitle').textContent='Skill Check results';
 $('qArea').querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{state.mode=TOPICS[b.dataset.go][1];ui.mode=state.mode;saveUI();buildModes();next();$('practice').scrollIntoView({behavior:'smooth'})});
 $('qArea').querySelectorAll('[data-vid]').forEach(b=>b.onclick=()=>{state.q={video:TOPICS[b.dataset.vid][2]};video();openVideo()});
 $('againBtn').onclick=()=>{startQuiz();next()};$('againBtn').focus({preventScroll:true})}
/* label builder (Brønsted–Lowry roles) */
function lbHTML(q){return `<div class="lb" id="lb">${q.rows.map((x,i)=>`<div class="lbrow" data-row="${i}"><span class="lbsp">${x.f}</span><span class="seg" role="group" aria-label="Role of ${esc(x.f)}">${Object.keys(ROLE_NAME).map(r=>`<button type="button" data-r="${r}" aria-pressed="false">${ROLE_NAME[r]}</button>`).join('')}</span></div>`).join('')}</div>`}
function lbSync(q){$('lb').querySelectorAll('.lbrow').forEach((row,i)=>row.querySelectorAll('[data-r]').forEach(b=>b.setAttribute('aria-pressed',q.st[i]===b.dataset.r)))}
function lbWire(q){$('lb').querySelectorAll('.lbrow').forEach((row,i)=>row.querySelectorAll('[data-r]').forEach(b=>b.onclick=()=>{if(state.done)return;q.st[i]=b.dataset.r;row.classList.remove('bad','ok');lbSync(q)}))}
function lbErrors(q){return q.rows.map((x,i)=>q.st[i]===x.want?null:[i,q.st[i]?`<b>${x.f}</b> is not the ${ROLE_LONG[q.st[i]]}. ${q.msg[x.want]}`:`Choose a role for <b>${x.f}</b> first.`]).filter(Boolean)}
/* show the proton-transfer arrow, role tags and pair brackets on a Brønsted–Lowry picture */
function blShow(){const g=document.querySelector('.blReveal');if(!g)return;g.style.opacity=1;const ball=g.querySelector('.blBall'),am=ball&&ball.querySelector('animateMotion');
 if(matchMedia('(prefers-reduced-motion: reduce)').matches||!am||!am.beginElement){const arc=document.getElementById('blArc');if(arc&&arc.getPointAtLength){const p=arc.getPointAtLength(arc.getTotalLength());ball.setAttribute('transform',`translate(${p.x},${p.y})`)}return}
 try{am.beginElement()}catch(e){}}
function next(){stopLabs();state.lab=null;
 $('practice').classList.toggle('quizmode',state.mode==='quiz');$('practice').classList.remove('quizdone');$('newBtn').textContent='New Question ↻';
 if(state.mode==='quiz'){if(!state.quiz||state.quiz.over)startQuiz();else if(state.done&&state.q&&state.q.qi===state.quiz.i)state.quiz.i++;
  if(state.quiz.i>=state.quiz.plan.length){state.q={};state.done=true;return quizSummary()}$('newBtn').textContent='Next question →'}
 const q=GEN[state.mode]();if(state.mode==='quiz')q.qi=state.quiz.i;state.q=q;state.sel=null;state.done=false;state.logged=false;
 $('modeTitle').textContent=MODES.find(m=>m.id===state.mode).title+(state.mode==='quiz'?` · ${state.quiz.i+1} of ${state.quiz.plan.length}`:'');
 $('hintBox').className='hintbox';fb('','');
 let h=(state.mode==='quiz'?`<div class="qprog" aria-hidden="true">${state.quiz.plan.map((t,i)=>`<i class="${i<state.quiz.res.length?(state.quiz.res[i].ok?'ok':'no'):i===state.quiz.i?'now':''}"></i>`).join('')}</div><p class="tip">One try per question. No hints until the end.</p>`:'');
 if(q.task)h+=`<div class="task" id="taskBox" role="status" aria-live="polite"><span>👉 ${q.task.say}</span></div>`;
 if(q.lab)h+='<div id="labHere"></div>';
 h+=`<p class="prompt">${q.prompt}</p>`;
 if(q.html)h+=`<div class="qbox">${q.html}</div>`;
 if(q.type==='label')h+=lbHTML(q);
 else if(q.type==='num')h+=numHTML(q);
 else h+=`<div class="options">${q.options.map((o,i)=>`<button type="button" class="opt" aria-pressed="false" data-i="${i}"><span class="L" aria-hidden="true">${i+1}</span><span>${o}</span></button>`).join('')}</div>`;
 $('qArea').innerHTML=h;['checkBtn','hintBtn','showBtn'].forEach(id=>$(id).disabled=false);
 if(q.lab){$('labHere').appendChild(labHost);mountLab(q.lab)}
 state.taskOk=!q.task;if(q.task){$('checkBtn').disabled=true;if(q.type==='num'&&$('numIn')){$('numIn').disabled=true;$('numIn').placeholder='Do the lab step first'}}
 wireIns();if(q.type==='label'){lbWire(q);lbSync(q)}
 $('qArea').querySelectorAll('.opt').forEach(b=>b.onclick=()=>{if(state.done)return;state.sel=q.options[+b.dataset.i];$('qArea').querySelectorAll('.opt').forEach(x=>{x.classList.toggle('sel',x===b);x.setAttribute('aria-pressed',x===b);x.classList.remove('wrong')})});
 video();stats()}
function numHTML(q){const log=q.kind==='log';return `<div class="numrow"><label for="numIn" class="sr-only">Your answer</label><input id="numIn" class="num" inputmode="decimal" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Your answer">${q.unit?`<span class="unit">${q.unit}</span>`:''}${log?'':'<button type="button" class="chip ins" data-ins="E" aria-label="×10ⁿ: insert E for times ten to the power">×10ⁿ</button><button type="button" class="chip ins" data-ins="-" aria-label="− minus sign">−</button>'}</div>
 <p class="tip">${log?`Give <b>${q.dp} decimal place${q.dp>1?'s':''}</b> (log rule: decimal places = sig figs in the concentration).`:`Round to <b>${q.sf} significant figures</b>. Scientific notation: tap <b>×10ⁿ</b> (or type E), like <span style="white-space:nowrap">2.4E-5</span> for 2.4 × 10⁻⁵.`}</p>`}
/* ×10ⁿ and − buttons: the iPhone number keypad has no E or minus key. Keep the keypad open and add to the end (iOS reports a stale cursor). */
function wireIns(){$('qArea').querySelectorAll('[data-ins]').forEach(b=>{if(b.dataset.w)return;b.dataset.w=1;const keep=e=>e.preventDefault();b.addEventListener('pointerdown',keep);b.addEventListener('mousedown',keep);
  b.onclick=()=>{const n=$('numIn');if(!n||n.readOnly||n.disabled)return;n.value+=b.dataset.ins;n.focus();const L=n.value.length;try{n.setSelectionRange(L,L)}catch(e){}}})}
const ansText=q=>q.type==='num'?(q.kind==='log'?q.answer.toFixed(q.dp):nf(q.answer,q.sf)+(q.unit?' '+q.unit:'')):q.type==='label'?q.rows.map(x=>`${x.f} = ${ROLE_LONG[x.want]}`).join(', '):q.answer;
function whyList(q){const others=q.options.filter(o=>o!==q.answer&&q.whys[o]);return others.length?`<ul class="why">${others.map(o=>`<li>❌ <b>${o}</b>: ${q.whys[o]}</li>`).join('')}</ul>`:''}
function finish(revealed,quizWrong){state.done=true;['checkBtn','hintBtn','showBtn'].forEach(id=>$(id).disabled=true);const q=state.q;if($('numIn'))$('numIn').readOnly=true;
 if(state.mode==='quiz'&&state.quiz&&q.qi===state.quiz.i&&state.quiz.res.length===state.quiz.i)state.quiz.res.push({topic:q.topic,ok:!revealed&&!quizWrong});
 if(state.mode==='quiz'){const last=state.quiz.i+1>=state.quiz.plan.length;$('newBtn').textContent=last?'See my results →':'Next question →'}
 if(q.type==='label'){blShow();$('lb').classList.add('locked');if(revealed||quizWrong){q.rows.forEach((x,i)=>q.st[i]=x.want);lbSync(q)}$('lb').querySelectorAll('.lbrow').forEach(r=>{r.classList.remove('bad');r.classList.add('ok')})}
 const ansTxt=ansText(q),more=q.type==='mc'?whyList(q):'';
 $('qArea').querySelectorAll('.opt').forEach(b=>{b.disabled=true;if(q.options[+b.dataset.i]===q.answer)b.classList.add('right')});
 if(quizWrong){state.streak=0;log(false);stats();fb('bad',`❌ Not this time. The answer is <b>${ansTxt}</b>.<br>${q.why}${more}`);return}
 if(revealed){state.assist++;state.streak=0;log(false);fb('good',`👀 <b>${ansTxt}</b><br>${q.why}${more}<br><small>Assisted: no point this time. <button class="linkbtn" onclick="openVideo()">🎥 Review with Dr. Dan</button></small>`);award(true)}
 else{state.correct++;state.streak++;log(true);confetti();fb('good','✅ Correct! '+q.why+more);award(false)}stats();
 const a=document.activeElement;if(!a||a===document.body||a.disabled)$('newBtn').focus({preventScroll:true})}
function checkNum(q){const raw=$('numIn').value.trim();if(!raw)return fb('bad','Type your answer first.');
 if(NUM.decimalComma(raw))return fb('bad','Use a period for decimals (type 1.5, not 1,5). Commas only for thousands, like 1,200.');
 const v=NUM.parseValue(raw);if(!isFinite(v))return fb('bad','Type one number, like 4.62 or 2.4E-5.');
 const slipOf=()=>(q.slips||[]).find(([x,m])=>m&&isFinite(x)&&(q.kind==='log'?Math.abs(v-x)<=0.02&&Math.abs(x-q.answer)>0.02:Math.abs(v-x)<=Math.abs(x)*0.012&&Math.abs(x-q.answer)>Math.abs(q.answer)*0.012));
 if(q.kind==='log'){const d=dpCount(raw),err=Math.abs(v-q.answer);
  if(err<=1.0001*10**-q.dp&&d===q.dp)return finish(false);
  if(err<=0.06&&d!==q.dp)return fb('bad',`✏️ Your math is right! Now give <b>${q.dp} decimal place${q.dp>1?'s':''}</b>: the concentration has ${q.dp} sig figs, and a log keeps that many decimal places.`)}
 else{const close=(a,b)=>Math.abs(a-b)<=Math.abs(b)*0.012,target=Number(q.answer.toPrecision(q.sf));
  if(close(v,q.answer)||close(v,target)){if(NUM.sfCount(raw)!==q.sf)return fb('bad',`✏️ Your math is right! Now round to <b>${q.sf} significant figure${q.sf>1?'s':''}</b>. (Trailing zeros only count with a decimal point; use E notation if needed, like 1.20E3.)`);return finish(false)}}
 if(state.mode==='quiz')return finish(false,true);
 const slip=slipOf();state.streak=0;log(false);stats();return fb('bad',`🔎 Not quite. ${slip?slip[1]+' ':''}<br>💡 ${q.hint}`)}
function checkLabel(q){const errs=lbErrors(q);if(errs.length&&q.st.every(t=>!t))return fb('bad','Tap a role for each species first.');
 if(q.st.some(t=>!t))return fb('bad','Choose a role for every species first.');
 const rows=$('lb').querySelectorAll('.lbrow');rows.forEach((r,i)=>{r.classList.toggle('bad',errs.some(([j])=>j===i));r.classList.toggle('ok',!errs.some(([j])=>j===i))});
 if(!errs.length)return finish(false);if(state.mode==='quiz')return finish(false,true);
 state.streak=0;log(false);stats();return fb('bad',`🔎 Almost. Fix the rows in red:<ul class="why">${errs.slice(0,2).map(([,m])=>`<li>${m}</li>`).join('')}</ul>💡 ${q.hint}`)}
function check(){if(state.done)return;const q=state.q;if(!state.taskOk)return fb('bad','👉 Do the lab step in the gold box first, then answer.');
 if(q.type==='num')return checkNum(q);if(q.type==='label')return checkLabel(q);
 if(!state.sel)return fb('bad','Choose an answer first.');
 const i=q.options.indexOf(state.sel);
 if(state.sel!==q.answer&&state.mode==='quiz'){$('qArea').querySelector(`.opt[data-i="${i}"]`)?.classList.add('wrong');return finish(false,true)}
 if(state.sel!==q.answer){state.streak=0;log(false);stats();$('qArea').querySelector(`.opt[data-i="${i}"]`)?.classList.add('wrong');const w=q.whys[state.sel];state.sel=null;return fb('bad',`🔎 Not quite. ${w?w+' ':''}<br>💡 ${q.hint}`)}
 finish(false)}
function hint(){if(state.done)return;$('hintBox').innerHTML='💡 '+state.q.hint+(VIDEO_FOR[state.q.video]?` <button class="linkbtn" onclick="openVideo()">🎥 Watch Dr. Dan explain it</button>`:'');$('hintBox').className='hintbox on'}
const mmss=t=>Math.floor(t/60)+':'+String(t%60).padStart(2,'0');
function video(){const v=VIDEO_FOR[state.q?.video];const src=v?`https://www.youtube.com/embed/${v[0]}?start=${v[1]}&rel=0`:`https://www.youtube.com/embed/${FALLBACK_VIDEO}?rel=0`;
 $('vidCard').innerHTML=v?`<small>🎯 Matched to this topic</small><b>${esc(v[2])}</b>${v[1]?`<div class="tip">Starts at ${mmss(v[1])}</div>`:''}`:'<small>📺 The pH scale</small>';
 $('player').dataset.want=src;if($('videoPanel').open&&$('player').src!==src)$('player').src=src}
function openVideo(){$('videoPanel').open=true;$('player').src=$('player').dataset.want;$('videoPanel').scrollIntoView({behavior:'smooth',block:'center'})}
$('videoPanel').addEventListener('toggle',()=>{if($('videoPanel').open&&!$('player').src)$('player').src=$('player').dataset.want});
$('refBody').innerHTML=REFERENCE.map(([t,d])=>`<div class="refcard"><b>${t}</b><div>${d}</div></div>`).join('');
$('checkBtn').onclick=check;$('hintBtn').onclick=hint;
$('showBtn').onclick=()=>{if(state.done)return;if(!state.taskOk){state.taskOk=true;const el=$('taskBox');if(el){el.className='task done';el.textContent='Skipped the lab step.'}}finish(true)};
$('newBtn').onclick=()=>{if(state.mode==='quiz'&&state.quiz&&!state.quiz.over&&!state.done)return fb('bad','Answer this question first. (Each question gets one try.)');next()};
{let armed=0;$('resetBtn').onclick=()=>{if(!armed){$('resetBtn').textContent='Tap again to confirm';armed=setTimeout(()=>{armed=0;$('resetBtn').textContent='Reset progress'},4000);return}clearTimeout(armed);armed=0;J=jBlank();try{localStorage.setItem(JK,JSON.stringify(J))}catch(e){}$('resetBtn').textContent='Reset progress';renderJ()}}
if(!matchMedia('(max-width:1000px)').matches){$('journey').open=true;$('videoPanel').open=true}
document.addEventListener('keydown',e=>{if(e.ctrlKey||e.metaKey||e.altKey)return;const t=e.target.tagName;if(e.target.id==='numIn'&&e.key==='Enter'){e.preventDefault();state.done?$('newBtn').click():check();return}if(t==='INPUT'||t==='TEXTAREA'||t==='SELECT'||e.target.isContentEditable)return;
 const bs=[...$('qArea').querySelectorAll('.opt')];if(/^[1-9]$/.test(e.key)&&bs[e.key-1]&&!bs[e.key-1].disabled){bs[e.key-1].click();return}
 if(e.key==='Enter'&&!/^(BUTTON|SUMMARY|A)$/.test(t)){e.preventDefault();state.done?$('newBtn').click():check()}});
/* disabled buttons: stop iOS double-tap zoom */
document.addEventListener('touchend',e=>{const b=e.target.closest&&e.target.closest('button');if(b&&b.disabled)e.preventDefault()},{passive:false});
/* Deep links: ?mode=id|ph|calc|pairs|titrate|buffer|quiz opens that mode for this visit only (for textbook Explore It boxes). */
(()=>{const m=new URLSearchParams(location.search).get('mode');if(MODES.some(x=>x.id===m)){state.mode=m;addEventListener('load',()=>setTimeout(()=>{const e=$('modes');if(e)scrollTo(0,e.getBoundingClientRect().top+scrollY-8)},150))}})();
/* The shared Feedback pill is fixed bottom-right; on phones it covered Show Answer. Hide it while the answer buttons are on screen. */
(()=>{const row=document.querySelector('.btnrow');if(!row||!('IntersectionObserver' in window))return;let vis=false;const apply=()=>{const f=document.querySelector('.ddfb-float');if(f)f.classList.toggle('eq-hide',vis)};
 new IntersectionObserver(es=>{vis=es[0].isIntersecting;apply()}).observe(row);new MutationObserver(apply).observe(document.body,{childList:true})})();
buildModes();renderJ();next();
