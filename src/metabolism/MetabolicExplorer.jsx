import React,{useEffect,useState} from 'react';
import PathwayCanvas from './PathwayCanvas.jsx';
import {glycolysis,sumEnergy} from './pathways.js';
import {pathwayCatalog} from '../courseCatalog.js';

const SAVE_KEY='biochem-metabolism-glycolysis-v1';
function loadState(){
 try{
  const s=JSON.parse(localStorage.getItem(SAVE_KEY));
  if(s&&typeof s==='object'&&Array.isArray(s.visited)&&s.answers&&typeof s.answers==='object')return s;
 }catch{/* Private mode may block storage. */}
 return {visited:[],answers:{}};
}

function EnergyCard({until}){
 const subset=glycolysis.reactions.slice(0,until);
 const invested=subset.reduce((n,r)=>n+Math.max(0,-r.energy.atp),0);
 const produced=subset.reduce((n,r)=>n+Math.max(0,r.energy.atp),0);
 const total=sumEnergy(glycolysis.reactions,until);
 return <div className="mp-energy">
   <div className="mp-panel-title"><span className="mp-kicker">PER STARTING GLUCOSE</span><strong>Energy accounting</strong></div>
   <p className="mp-subtle">Through step {until} of 10</p>
   <div className="mp-energy-rows">
     <div><span>ATP invested</span><b>−{invested}</b></div>
     <div><span>ATP produced</span><b>+{produced}</b></div>
     <div className="mp-energy-net"><span>Net ATP</span><b>{total.atp>0?'+':''}{total.atp}</b></div>
     <div><span>NADH produced</span><b>+{total.nadh}</b></div>
   </div>
   <p className="mp-footnote">Steps 6–10 occur twice per starting glucose. These are stoichiometric totals, not predicted concentrations or reaction rates.</p>
 </div>;
}

function DetailPanel({selected,onNavigate}){
 const isReaction=selected.type==='reaction';
 const r=isReaction?glycolysis.reactions.find(x=>x.id===selected.id):null;
 const m=!isReaction?glycolysis.metabolites[selected.id]:null;
 if(!r&&!m)return null;
 return <div className="mp-details">
  <div className="mp-panel-title"><span className="mp-kicker">{isReaction?'REACTION DETAILS':'METABOLITE DETAILS'}</span><strong>{isReaction?'Step '+r.number:m.name}</strong></div>
  {r?<div className="mp-detail-body">
    <div className="mp-phase-line"><span className={'mp-phase '+r.phase}>{r.phase==='investment'?'Investment phase':'Payoff phase'}</span><span>{r.reversible?'Reversible':'Strongly forward-favored'}</span></div>
    <h3>{r.enzyme}</h3>
    <div className="mp-equation">{r.equation}</div>
    <dl className="mp-definition">
      <div><dt>Enzyme EC</dt><dd>{r.enzymeEC}</dd></div>
      <div><dt>Reaction type</dt><dd>{r.type}</dd></div>
      <div><dt>Number per glucose</dt><dd>{r.multiplicity===2?'Occurs twice':'Occurs once'}</dd></div>
    </dl>
    <p>{r.description}</p>
    <div className="mp-insight"><strong>Biochemical context</strong><p>{r.regulation}</p></div>
    <div className="mp-detail-actions"><span>Explore the molecules</span><div>
      {[...r.inputs,...r.outputs].filter((x,i,all)=>all.indexOf(x)===i).map(id=><button key={id} onClick={()=>onNavigate({type:'metabolite',id})}>{glycolysis.metabolites[id].name}</button>)}
    </div></div>
  </div>:<div className="mp-detail-body">
    <div className="mp-phase-line"><span className="mp-phase meta">{m.carbon}-carbon compound</span><span>Cytosol</span></div>
    <h3>{m.name}</h3>
    <p className="mp-muted-strong">{m.role}</p>
    <p>{m.description}</p>
    <div className="mp-insight"><strong>Structure viewer</strong><p>Atom-level structures and reaction atom mapping are planned additions. This version does not claim to show chemical bond changes.</p></div>
    {m.connections.length>0&&<div className="mp-detail-actions"><span>Connection points · planned modules</span><div>
      {m.connections.map(id=>{
        const pathway=pathwayCatalog.find(x=>x.id===id);
        return <button key={id} onClick={()=>onNavigate({type:'planned',id})}>{pathway?.title||id} ↗</button>;
      })}
    </div></div>}
  </div>}
 </div>;
}

function Challenge({answers,onAnswer}){
 const correct=glycolysis.quiz.filter((q,i)=>answers[i]===q.answer).length;
 const answered=glycolysis.quiz.filter((q,i)=>Number.isInteger(answers[i])).length;
 return <section className="mp-challenge">
  <div className="mp-challenge-header"><span className="mp-kicker">PRACTICE MODE</span><h2>Can you complete the pathway?</h2><p>Five starter questions reinforce the key reactions and energy accounting. Choose an answer to see feedback.</p></div>
  <div className="mp-quiz-progress"><strong>{answered} / {glycolysis.quiz.length} answered</strong><span>{answered===glycolysis.quiz.length?correct+' correct':''}</span></div>
  {glycolysis.quiz.map((q,i)=><div className="mp-quiz" key={q.question}><div className="mp-quiz-number">QUESTION {i+1}</div><h3>{q.question}</h3><div className="mp-options">
    {q.options.map((option,j)=><button key={option} onClick={()=>onAnswer(i,j)} aria-pressed={answers[i]===j} className={answers[i]===j?'mp-picked':''}><b>{'ABCD'[j]}</b><span>{option}</span></button>)}
  </div>{Number.isInteger(answers[i])&&<div className={'mp-feedback '+(answers[i]===q.answer?'mp-correct':'mp-incorrect')} role="status"><strong>{answers[i]===q.answer?'Correct':'Not quite — try another answer'}</strong><p>{q.explanation}</p></div>}</div>)}
  <p className="mp-footnote">Practice is not a graded exam. Answers are saved only in this browser.</p>
 </section>;
}

export default function MetabolicExplorer({navigate}){
 const[mode,setMode]=useState('explore');
 const[stepIndex,setStepIndex]=useState(0);
 const[selected,setSelected]=useState({type:'reaction',id:glycolysis.reactions[0].id});
 const[saved,setSaved]=useState(loadState);
 useEffect(()=>{try{localStorage.setItem(SAVE_KEY,JSON.stringify(saved));}catch{}},[saved]);
 const step=glycolysis.reactions[stepIndex];
 const fullEnergy=sumEnergy(glycolysis.reactions);
 const choice=(item)=>{
   if(item.type==='planned'){navigate('/tools/metabolism/'+item.id);return;}
   setSelected(item);
   if(item.type==='reaction'){
     const i=glycolysis.reactions.findIndex(r=>r.id===item.id);
     setStepIndex(i);
     setSaved(old=>({...old,visited:old.visited.includes(item.id)?old.visited:[...old.visited,item.id]}));
   }
 };
 const selectStep=index=>choice({type:'reaction',id:glycolysis.reactions[index].id});
 const setView=value=>{
   setMode(value);
   if(value==='guided')selectStep(stepIndex);
 };
 return <div className="mp-page">
  <div className="mp-crumbs"><button onClick={()=>navigate('/tools')}>Interactive Tools</button><span>›</span><button onClick={()=>navigate('/tools/metabolism')}>Metabolic Pathways</button><span>›</span><strong>Glycolysis</strong></div>
  <div className="mp-heading">
    <div><div className="mp-kicker">PATHWAY 01 · CARBOHYDRATE METABOLISM</div><h1>Glycolysis</h1><p>Explore the conversion of glucose into pyruvate, one reaction at a time.</p>
      <div className="mp-pills"><span>10 reactions</span><span>Cytosol</span><span>2 phases</span></div></div>
    <div className="mp-heading-art" aria-hidden="true">C₆ <span>→</span> 2 C₃</div>
  </div>
  <div className="mp-summary">
    <div><small>NET ATP</small><strong>+{fullEnergy.atp}</strong><span>per glucose</span></div>
    <div><small>NADH</small><strong>+{fullEnergy.nadh}</strong><span>per glucose</span></div>
    <div><small>PYRUVATE</small><strong>2</strong><span>per glucose</span></div>
    <div><small>REACTIONS EXPLORED</small><strong>{saved.visited.length}/10</strong><span>saved on this device</span></div>
  </div>
  <div className="mp-modebar" role="group" aria-label="Explorer mode">
    {[['explore','◎ Explore map'],['guided','→ Guided steps'],['challenge','✎ Practice']].map(([id,label])=><button key={id} className={mode===id?'mp-mode-active':''} aria-pressed={mode===id} onClick={()=>setView(id)}>{label}</button>)}
    <span className="mp-mode-caption">Interactive learning prototype</span>
  </div>
  <div className="mp-layout">
    <aside className="mp-rail">
      <div className="mp-panel-title"><span className="mp-kicker">PATHWAY NAVIGATION</span><strong>Reaction sequence</strong></div>
      <div className="mp-rail-stage">ENERGY INVESTMENT · 1–5</div>
      {glycolysis.reactions.map((r,i)=><React.Fragment key={r.id}>{i===5&&<div className="mp-rail-stage payoff">ENERGY PAYOFF · 6–10</div>}
        <button className={'mp-step-link '+(stepIndex===i&&mode!=='challenge'?'is-active':'')} onClick={()=>{selectStep(i);setMode('guided');}}>
          <span className="mp-step-index">{String(r.number).padStart(2,'0')}</span>
          <span><strong>{r.enzyme}</strong><small>{r.type}</small></span>
          {saved.visited.includes(r.id)&&<b title="Explored">✓</b>}
        </button>
      </React.Fragment>)}
      <div className="mp-rail-end">Select a reaction to inspect it in guided mode. All steps can be revisited.</div>
    </aside>
    <div className="mp-center">
      {mode==='challenge'?<Challenge answers={saved.answers} onAnswer={(i,j)=>setSaved(s=>({...s,answers:{...s.answers,[i]:j}}))}/>:<>
        {mode==='guided'&&<div className="mp-guided-bar">
          <div><span>STEP {step.number} OF 10</span><strong>{step.enzyme}</strong></div>
          <div className="mp-guide-buttons"><button onClick={()=>selectStep(Math.max(0,stepIndex-1))} disabled={stepIndex===0}>← Previous</button><button onClick={()=>selectStep(Math.min(9,stepIndex+1))} disabled={stepIndex===9}>Next →</button></div>
        </div>}
        <PathwayCanvas pathway={glycolysis} selected={selected} onSelect={choice} focusStep={stepIndex} mode={mode}/>
        <div className="mp-map-note"><strong>About this diagram</strong><p>Numbers correspond to enzymatic reactions. Step 4 produces DHAP and G3P; step 5 converts DHAP to G3P. Steps 6–10 therefore operate on two trioses per glucose. Arrows are schematic, not representations of rates or measured flux.</p></div>
      </>}
    </div>
    <aside className="mp-right">
      <DetailPanel selected={selected} onNavigate={choice}/>
      <EnergyCard until={stepIndex+1}/>
      <div className="mp-note">
        <strong>Coming next: pathway connections</strong>
        <p>Shared metabolite IDs will connect glycolysis to glycogen metabolism, the pentose phosphate pathway, fermentation, and the TCA cycle via pyruvate oxidation.</p>
        <button onClick={()=>navigate('/tools/metabolism')}>View pathway roadmap →</button>
      </div>
    </aside>
  </div>
  <div className="mp-sources"><span>Biochemical reference:</span>{glycolysis.sourceLinks.map((link,i)=><a href={link.url} key={link.url} target="_blank" rel="noopener noreferrer">{link.title} ↗</a>)}</div>
 </div>;
}
