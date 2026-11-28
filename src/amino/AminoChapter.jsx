import React,{useEffect,useState} from 'react';
import MoleculeViewer from './MoleculeViewer.jsx';
import SideBySideCompare from './SideBySideCompare.jsx';
import IonizationStructure from './IonizationStructure.jsx';
import ChargeCalculation from './ChargeCalculation.jsx';
import {aminoAcids,aminoByLetter,aaGroups,aminoLesson,modifications,netCharge,isoelectricPoint,ionizationExamples,phPresets,explainChargeAtPh} from './aminoData.js';
import {learningStages,topicsForChapter,findTopic} from '../topicCatalog.js';
import './amino.css';

const KEY='biochem-topics-v1';
const empty=()=>({completed:[],answers:{},applications:{},confidence:{}});
function savedProgress(){
 try{const data=JSON.parse(localStorage.getItem(KEY));if(data&&Array.isArray(data.completed)&&data.answers&&data.applications&&data.confidence)return data;}catch{}
 return empty();
}
const useProgress=()=>{
 const [state,setState]=useState(savedProgress);
 useEffect(()=>{try{localStorage.setItem(KEY,JSON.stringify(state));}catch{}},[state]);
 return [state,setState];
};
const topicKey=(topic,stage)=>'4/'+topic+'/'+stage;
function PageHeader({navigate,topic,stage}){
 return <div className="aa-breadcrumbs"><button onClick={()=>navigate('/chapters')}>Textbook</button><span>/</span>
 <button onClick={()=>navigate('/chapters/4')}>Chapter 4 · Amino Acids</button>
 {topic&&<><span>/</span><span>{topic.number} {topic.title}</span></>}</div>;
}
function ProfilePicker({selected,onSelect,showFilter=true}){
 const [category,setCategory]=useState('all');
 const subset=aminoAcids.filter(a=>category==='all'||a.category===category);
 const current=aminoByLetter[selected];
 return <div className="aa-picker">
  <div className="aa-picker-top"><div><span className="aa-label">AMINO ACID SELECTOR</span><h3>Get to know the 20 standard amino acids</h3></div>
   <label>Search by category <select value={category} onChange={e=>setCategory(e.target.value)}><option value="all">All 20</option>{aaGroups.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}</select></label></div>
  <div className="aa-letter-grid" role="group" aria-label="Select an amino acid">{subset.map(a=><button key={a.one} title={a.name} onClick={()=>onSelect(a.one)} className={selected===a.one?'active':''} aria-pressed={selected===a.one}><strong>{a.one}</strong><small>{a.three}</small></button>)}</div>
  <div className="aa-profile"><div><span className="aa-label">{current.three} · {current.category.toUpperCase()}</span><h4>{current.name}</h4><p>{current.property}. {current.note}</p></div><div><span className="aa-label">SIDE CHAIN</span><strong>{current.sidechain}</strong></div></div>
 </div>;
}
// Match the pH 0–14 color stops in amino.css (approximate universal indicator colors).
const phIndicatorStops=[
  [0,'#d83a3a'],[2,'#e64a35'],[4,'#ef8332'],[5,'#f4c341'],
  [6,'#e3d943'],[7,'#39a94d'],[8,'#28a698'],[10,'#247bb5'],
  [11,'#4054b4'],[12,'#6948ab'],[14,'#903da7']
];
function phIndicatorColor(ph){
  const value=Math.max(0,Math.min(14,ph));
  const endIndex=phIndicatorStops.findIndex(([stop])=>value<=stop);
  if(endIndex<=0)return phIndicatorStops[0][1];
  const [endPh,endHex]=phIndicatorStops[endIndex];
  const [startPh,startHex]=phIndicatorStops[endIndex-1];
  const mix=(value-startPh)/(endPh-startPh);
  const rgb=[1,3,5].map(i=>{
    const a=parseInt(startHex.slice(i,i+2),16);
    const b=parseInt(endHex.slice(i,i+2),16);
    return Math.round(a+(b-a)*mix).toString(16).padStart(2,'0');
  });
  return '#'+rgb.join('');
}
function phIndicatorTextColor(color){
  const linear=[1,3,5].map(i=>{
    const channel=parseInt(color.slice(i,i+2),16)/255;
    return channel<=0.04045?channel/12.92:((channel+0.055)/1.055)**2.4;
  });
  const luminance=0.2126*linear[0]+0.7152*linear[1]+0.0722*linear[2];
  // Pick whichever of near-black or white has the stronger WCAG contrast ratio.
  const darkLuminance=0.021;
  return (luminance+0.05)/(darkLuminance+0.05) > 1.05/(luminance+0.05)?'#18332d':'#ffffff';
}
function ChargeLab(){
 const [chosen,setChosen]=useState('G'),[ph,setPh]=useState(7);
 const model=ionizationExamples[chosen];
 const aa=aminoByLetter[chosen];
 const charge=netCharge(chosen,ph);
 const pi=isoelectricPoint(chosen);
 const explanation=explainChargeAtPh(chosen,ph);
 return <div className="aa-lab">
  <div className="aa-lab-title"><div><span className="aa-label">INTERACTIVE ACID–BASE LAB</span><h3>Investigate charge as pH changes</h3><p>Choose a free amino acid and adjust pH. The model estimates its average net charge from ionizable-group pKa values.</p></div>
    <div className="aa-ph-number" style={{backgroundColor:phIndicatorColor(ph),color:phIndicatorTextColor(phIndicatorColor(ph))}}>pH <strong>{ph.toFixed(1)}</strong></div></div>
  <label className="aa-input-label" htmlFor="aa-species">Free amino acid</label>
  <select id="aa-species" value={chosen} onChange={e=>setChosen(e.target.value)}>{Object.keys(ionizationExamples).map(k=><option key={k} value={k}>{aminoByLetter[k].name}</option>)}</select>
  <label className="aa-input-label" htmlFor="aa-ph-range">Solution pH</label>
  <div className="aa-ph-presets" role="group" aria-label="Choose a pH preset">{phPresets.map(value=><button key={value} className={ph===value?'active':''} aria-pressed={ph===value} style={{backgroundColor:phIndicatorColor(value),color:phIndicatorTextColor(phIndicatorColor(value))}} onClick={()=>setPh(value)}>pH {value}</button>)}</div>
  <input id="aa-ph-range" type="range" min="0" max="14" step=".1" value={ph} onChange={e=>setPh(Number(e.target.value))}/>
  <div className="aa-range-scale"><span>Acidic (0)</span><span>Neutral (7)</span><span>Basic (14)</span></div>
  <IonizationStructure one={chosen} ph={ph}/>
  <div className="aa-charge-metrics"><div><small>AVERAGE NET CHARGE</small><strong>{charge>0?'+':''}{charge.toFixed(2)}</strong></div>
    <div><small>ESTIMATED pI</small><strong>{pi.toFixed(2)}</strong></div><div><small>CHARGE TENDENCY</small><strong className="aa-charge-word">{Math.abs(charge)<.1?'Near zero':charge>.1?'Positive':'Negative'}</strong></div></div>
  <ChargeCalculation one={chosen} ph={ph}/>
  <div className="aa-lab-pka"><strong>Approximate pKa values</strong><span>α-COOH {model.carboxyl.toFixed(2)}</span><span>α-NH₃⁺ {model.amino.toFixed(2)}</span>{model.side&&<span>Side chain {model.side.pKa.toFixed(2)}</span>}</div>
  <div className="aa-ph-explanation" aria-live="polite"><strong>Why does {aa.name.toLowerCase()} behave this way?</strong><p>{explanation.summary}</p><div><span>α-COO−: {explanation.carboxylPercent}%</span><span>α-NH₃⁺: {explanation.aminoPercent}%</span></div></div>
  <p className="aa-scope">Approximate independent-site model for free amino acids in water, not a prediction of charge for protein-bound residues or titration curves measured under specific conditions.</p>
 </div>;
}
function PeptideBuilder(){
 const [seq,setSeq]=useState(['G','A','S']);
 const [choice,setChoice]=useState('K');
 const names=seq.map(c=>aminoByLetter[c].three);
 return <div className="aa-lab"><span className="aa-label">PEPTIDE BUILDER · SCHEMATIC</span><h3>Build an N → C sequence</h3>
  <p>Select amino acids to extend a linear polypeptide. The diagram shows residue order and peptide connections, not a complete chemical structure.</p>
  <div className="aa-peptide-controls"><label>Add residue <select value={choice} onChange={e=>setChoice(e.target.value)}>{aminoAcids.map(a=><option key={a.one} value={a.one}>{a.name} ({a.one})</option>)}</select></label>
    <button onClick={()=>setSeq(s=>s.length<6?[...s,choice]:s)} disabled={seq.length>=6}>+ Add residue</button><button onClick={()=>setSeq(s=>s.length>1?s.slice(0,-1):s)} disabled={seq.length<=1}>Remove last</button><button onClick={()=>setSeq(['G','A','S'])}>Reset</button></div>
  <div className="aa-chain" aria-label={'Sequence '+seq.join(' ')+' from N terminus to C terminus'}><strong className="aa-terminus">N</strong>
   {seq.map((c,i)=><React.Fragment key={i}><div className="aa-residue"><strong>{aminoByLetter[c].three}</strong><small>{c}</small></div>{i<seq.length-1&&<div className="aa-peptide-link"><span>—</span><small>peptide</small></div>}</React.Fragment>)}
   <strong className="aa-terminus">C</strong></div>
  <div className="aa-chain-metrics"><span>Sequence: <strong>{seq.join('')}</strong></span><span>Residues: <strong>{seq.length}</strong></span><span>Peptide bonds: <strong>{seq.length-1}</strong></span></div>
  <p className="aa-scope">Amino acid codes correspond to the unmodified residues. In a real peptide, the backbone is an amide-linked molecular chain; internal residues no longer possess separate free α-amino and α-carboxyl groups.</p>
 </div>;
}
function ModificationLab(){
 const [which,setWhich]=useState(modifications[0].id);
 const [modified,setModified]=useState(false);
 const m=modifications.find(x=>x.id===which);
 return <div className="aa-lab"><span className="aa-label">MODIFICATION COMPARISON</span><h3>What changes chemically?</h3>
  <label className="aa-input-label" htmlFor="aa-mod-choice">Example</label><select id="aa-mod-choice" value={which} onChange={e=>{setWhich(e.target.value);setModified(false);}}>{modifications.map(m=><option key={m.id} value={m.id}>{m.title}</option>)}</select>
  <div className="aa-mod-toggle" role="group" aria-label="Modification state"><button className={!modified?'active':''} aria-pressed={!modified} onClick={()=>setModified(false)}>Before</button><button className={modified?'active':''} aria-pressed={modified} onClick={()=>setModified(true)}>After</button></div>
  <div className="aa-mod-display"><span>{modified?'MODIFIED STATE':'STARTING STATE'}</span><strong>{modified?m.after:m.before}</strong></div>
  <p>{m.effect}</p><p className="aa-scope">Condensed group formulas are simplified annotations, not full structural drawings. Selenocysteine incorporation differs mechanistically from post-translational modification.</p>
 </div>;
}
function TheInteractive({topicId,selected,onSelect}){
 if(topicId==='ionization')return <ChargeLab/>;
 if(topicId==='peptides')return <PeptideBuilder/>;
 if(topicId==='modifications')return <ModificationLab/>;
 if(topicId==='side-chains')return <><SideBySideCompare/><details className="aa-single-explorer"><summary>Browse one amino acid individually</summary><ProfilePicker selected={selected} onSelect={onSelect}/><MoleculeViewer one={selected}/></details></>;
 return <><ProfilePicker selected={selected} onSelect={onSelect}/><MoleculeViewer one={selected}/></>;
}
function QuestionSet({questions,answers,onAnswer,prefix}){
 const attempted=questions.filter((q,i)=>Number.isInteger(answers[prefix+i])).length;
 const correct=questions.filter((q,i)=>answers[prefix+i]===q.correct).length;
 return <><div className="aa-practice-status">{attempted}/{questions.length} answered {attempted===questions.length?'· '+correct+' correct':''}</div>
 {questions.map((q,i)=><section className="aa-question" key={i}><span className="aa-label">QUESTION {i+1} OF {questions.length}</span><h3>{q.q}</h3><div className="aa-answer-grid">{q.options.map((s,j)=><button key={j} className={answers[prefix+i]===j?'active':''} onClick={()=>onAnswer(prefix+i,j)} aria-pressed={answers[prefix+i]===j}><strong>{'ABCD'[j]}</strong>{s}</button>)}</div>
 {Number.isInteger(answers[prefix+i])&&<div className={'aa-feedback '+(answers[prefix+i]===q.correct?'good':'try')} role="status"><strong>{answers[prefix+i]===q.correct?'Correct!':'Try again'}</strong><p>{q.why}</p></div>}</section>)}</>;
}
function Application({topicId,answer,onAnswer}){
 const item=aminoLesson[topicId].apply;
 const isNumeric=item.kind!=='choice',number=Number(answer?.value),hasValue=answer?.value!==undefined&&answer.value!=='';
 const success=isNumeric?(hasValue&&Math.abs(number-item.answer)<(item.kind==='pi'?.06:.1)):(answer?.value===item.correct);
 return <div className="aa-question aa-application"><span className="aa-label">APPLIED BIOCHEMISTRY</span><h3>{item.title}</h3><p>{item.prompt}</p>
 {item.kind==='choice'?<div className="aa-answer-grid">{item.options.map((opt,i)=><button key={i} className={answer?.value===i?'active':''} onClick={()=>onAnswer({value:i,checked:true})} aria-pressed={answer?.value===i}><strong>{'ABCD'[i]}</strong>{opt}</button>)}</div>:
 <div className="aa-numeric-form"><label htmlFor={'aa-apply-'+topicId}>Your answer</label><input id={'aa-apply-'+topicId} type="number" step={item.kind==='pi'?'.01':'1'} value={answer?.value??''} onChange={e=>onAnswer({value:e.target.value,checked:false})}/><button disabled={!hasValue||!Number.isFinite(number)} onClick={()=>onAnswer({...answer,checked:true})}>Check answer</button></div>}
 {answer?.checked&&<div className={'aa-feedback '+(success?'good':'try')} role="status"><strong>{success?'Correct!':'Not quite'}</strong><p>{success?item.why:'Try a different answer using the learning notes. '+(item.kind==='bonds'?'For a linear chain, bonds = residues − 1.':'')}</p></div>}
 </div>;
}
function TopicContent({topic,stage,state,setState}){
 const [selected,setSelected]=useState(topic.id==='side-chains'?'K':'A');
 const lesson=aminoLesson[topic.id];
 const base='4/'+topic.id+'/';
 const done=state.completed.includes(topicKey(topic.id,stage));
 const answer=(key,index)=>setState(s=>({...s,answers:{...s.answers,[key]:index}}));
 const applyValue=value=>setState(s=>({...s,applications:{...s.applications,[topic.id]:value}}));
 const confidence=state.confidence[topic.id]||[];
 const toggleKey=i=>setState(s=>({...s,confidence:{...s.confidence,[topic.id]:confidence.includes(i)?confidence.filter(n=>n!==i):[...confidence,i]}}));
 const toggleDone=()=>setState(s=>({...s,completed:done?s.completed.filter(n=>n!==topicKey(topic.id,stage)):[...s.completed,topicKey(topic.id,stage)]}));
 return <div className="aa-topic-body">
  {stage==='learn'&&<><div className="aa-stage-intro"><span className="aa-label">LEARN · EXPLANATIONS WITH LIVE INTERACTIONS</span><h2>Understand the chemistry</h2><p>{lesson.intro}</p></div>
   <div className="aa-learning-card"><h3>Core ideas</h3>{lesson.points.map((p,i)=><div className="aa-point" key={i}><span>{String(i+1).padStart(2,'0')}</span><p>{p}</p></div>)}</div>
   <div className="aa-stage-intro interactive"><span className="aa-label">INTERACTIVE EXAMPLE · EMBEDDED IN LEARN</span><h2>See it in action</h2><p>{lesson.callout}</p></div>
   <TheInteractive topicId={topic.id} selected={selected} onSelect={setSelected}/>
  </>}
  {stage==='explore'&&<><div className="aa-stage-intro"><span className="aa-label">EXPLORE · INDEPENDENT INVESTIGATION</span><h2>Investigate for yourself</h2><p>Use the same scientific visualization or experiment more freely. Compare your observations with the prompts below.</p></div>
   <div className="aa-prompt-card"><strong>Try this investigation</strong><p>{({
     structure:'Compare glycine, alanine, and proline. Which lacks a stereogenic alpha carbon? Which forms a ring involving the backbone nitrogen?',
     'side-chains':'Select an acidic, basic, hydrophobic, and aromatic amino acid. Compare the atoms and functional groups that make them different.',
     ionization:'Set the pH to 2, 7, and 12 for glycine, lysine, and aspartate. Which regions give positive, zero, or negative average charge?',
     peptides:'Build Gly-Ala-Ser and then add Lys. How many peptide bonds were added? Check how the N→C sequence changes.',
     modifications:'Compare lysine acetylation with serine phosphorylation. Which one removes a positive group, and which typically adds negative charge?'
    })[topic.id]}</p></div>
   <TheInteractive topicId={topic.id} selected={selected} onSelect={setSelected}/>
  </>}
  {stage==='practice'&&<><div className="aa-stage-intro"><span className="aa-label">PRACTICE · IMMEDIATE FEEDBACK</span><h2>Check your understanding</h2><p>Try these short questions as often as you like. Answers remain saved in this browser.</p></div><QuestionSet questions={lesson.questions} answers={state.answers} onAnswer={answer} prefix={base}/></>}
  {stage==='apply'&&<><div className="aa-stage-intro"><span className="aa-label">APPLY · CHEMICAL REASONING</span><h2>Use what you learned</h2><p>Work through a question that asks you to use the concept, not just recognize a definition.</p></div><Application topicId={topic.id} answer={state.applications[topic.id]} onAnswer={applyValue}/></>}
  {stage==='review'&&<><div className="aa-stage-intro"><span className="aa-label">REVIEW · CONSOLIDATE</span><h2>What should you remember?</h2><p>Use the statements below to check your confidence and return to earlier stages when needed.</p></div><div className="aa-learning-card"><h3>Key takeaways</h3>{lesson.key.map((k,i)=><label key={i} className="aa-review-check"><input type="checkbox" checked={confidence.includes(i)} onChange={()=>toggleKey(i)}/><span>{k}</span></label>)}
   <p className="aa-scope">These are self-assessment checkboxes, not an exam score.</p></div>
   <div className="aa-progress-summary"><strong>{state.completed.filter(x=>x.startsWith(base)).length} / 5 learning stages marked complete</strong><p>You can revisit earlier pages and change any answers.</p></div>
  </>}
  <div className="aa-completion"><div><strong>{done?'Stage completed':'Finished with this stage?'}</strong><p>Completion is self-reported and saved on this device.</p></div><button className={done?'marked':''} onClick={toggleDone}>{done?'✓ Completed · Undo':'Mark stage complete'}</button></div>
 </div>;
}

export default function AminoChapter({navigate,topicId,stageId}){
 const topics=topicsForChapter(4),topic=findTopic(4,topicId);
 const [state,setState]=useProgress();
 const stage=learningStages.some(s=>s.id===stageId)?stageId:'learn';
 const visit=(id,stageId='learn')=>navigate('/chapters/4/topics/'+id+'/'+stageId);
 const done=state.completed.filter(s=>s.startsWith('4/')).length;
 if(!topic)return <div className="aa-page"><PageHeader navigate={navigate}/><div className="aa-chapter-hero"><span className="aa-label">PART II · STRUCTURE AND FUNCTION OF BIOMOLECULES</span><h1>Chapter 4 — Amino Acids and Their Properties</h1><p>Learn how amino acid chemistry determines structure, charge, and biochemical function. Select a topic to follow five stages of guided learning and investigation.</p><div><span>5 topics</span><span>Learn · Explore · Practice · Apply · Review</span><span>{done}/25 stages marked complete</span></div></div>
   <div className="aa-chapter-intro"><h2>Choose a topic</h2><p>Each topic has its own learning sections. Interactive chemistry is embedded in the lesson—not placed on a separate tools page.</p></div>
   <div className="aa-topic-cards">{topics.map((t,i)=><button key={t.id} onClick={()=>visit(t.id)}><span className="aa-topic-number">{t.number}</span><strong>{t.title}</strong><p>{aminoLesson[t.id].intro}</p><span className="aa-topic-card-foot">{state.completed.filter(s=>s.startsWith('4/'+t.id+'/')).length}/5 stages complete <b>Open topic →</b></span></button>)}</div>
   <p className="aa-scope">Original Chapter 4 source has been retained in the repository for reference. This redesigned chapter saves new topic-level progress separately.</p>
  </div>;
 const idx=topics.findIndex(t=>t.id===topic.id),stageIndex=learningStages.findIndex(s=>s.id===stage);
 return <div className="aa-page">
  <PageHeader navigate={navigate} topic={topic}/>
  <div className="aa-topic-hero"><span className="aa-label">CHAPTER 04 · TOPIC {topic.number}</span><h1>{topic.title}</h1><p>{aminoLesson[topic.id].intro}</p><div className="aa-topic-meta"><span>{state.completed.filter(s=>s.startsWith('4/'+topic.id+'/')).length}/5 stages complete</span><span>Interactive learning</span></div></div>
  <nav className="aa-stage-tabs" aria-label="Learning sections">{learningStages.map((s,i)=><button key={s.id} aria-current={stage===s.id?'page':undefined} className={stage===s.id?'current':''} onClick={()=>visit(topic.id,s.id)}><span>{state.completed.includes(topicKey(topic.id,s.id))?'✓':String(i+1).padStart(2,'0')}</span>{s.title}</button>)}</nav>
  <TopicContent key={topic.id+'-'+stage} topic={topic} stage={stage} state={state} setState={setState}/>
  <div className="aa-next-row">
   {stageIndex>0?<button onClick={()=>visit(topic.id,learningStages[stageIndex-1].id)}>← Previous: {learningStages[stageIndex-1].title}</button>:<button onClick={()=>navigate('/chapters/4')}>← All topics</button>}
   {stageIndex<4?<button className="aa-primary-next" onClick={()=>visit(topic.id,learningStages[stageIndex+1].id)}>Next: {learningStages[stageIndex+1].title} →</button>:idx<topics.length-1?<button className="aa-primary-next" onClick={()=>visit(topics[idx+1].id)}>Next topic: {topics[idx+1].number} →</button>:<button className="aa-primary-next" onClick={()=>navigate('/chapters/4')}>Back to chapter outline →</button>}
  </div>
 </div>;
}
