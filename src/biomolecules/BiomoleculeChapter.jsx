import React,{useEffect,useState} from 'react';
import {chapters} from '../courseCatalog.js';
import {learningStages,topicsForChapter,findTopic} from '../topicCatalog.js';
import {biomoleculeLessons,chapterIntroductions} from './biomoleculeLessons.js';
import BiomoleculeInteractive from './BiomoleculeInteractive.jsx';
import '../amino/amino.css';
import './biomolecules.css';

const STORAGE_KEY='biochem-topics-v1';
const initialProgress=()=>({completed:[],answers:{},applications:{},confidence:{}});
function readProgress(){
 try{
  const state=JSON.parse(localStorage.getItem(STORAGE_KEY));
  if(state&&Array.isArray(state.completed)&&state.answers&&state.applications&&state.confidence)return state;
 }catch{}
 return initialProgress();
}
function useTopicProgress(){
 const [state,setState]=useState(readProgress);
 useEffect(()=>{try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}catch{}},[state]);
 return [state,setState];
}
function BreadCrumb({navigate,chapter,topic}){
 return <div className="aa-breadcrumbs">
  <button onClick={()=>navigate('/chapters')}>Textbook</button><span>/</span>
  <button onClick={()=>navigate('/chapters/'+chapter.number)}>Chapter {chapter.number} · {chapter.title}</button>
  {topic&&<><span>/</span><span>{topic.number} {topic.title}</span></>}
 </div>;
}
const progressKey=(n,id,stage)=>n+'/'+id+'/'+stage;
function Practice({questions,answers,onAnswer,prefix}){
 const attempted=questions.filter((q,i)=>Number.isInteger(answers[prefix+i])).length;
 const correct=questions.filter((q,i)=>answers[prefix+i]===q.correct).length;
 return <>
  <div className="aa-practice-status">{attempted}/{questions.length} answered{attempted===questions.length?' · '+correct+' correct':''}</div>
  {questions.map((q,i)=><section className="aa-question bm-question" key={i}>
   <span className="aa-label">QUESTION {i+1} OF {questions.length}</span><h3>{q.q}</h3>
   <div className="aa-answer-grid">{q.options.map((choice,j)=><button key={j} onClick={()=>onAnswer(prefix+i,j)} aria-pressed={answers[prefix+i]===j} className={answers[prefix+i]===j?'active':''}><strong>{'ABCD'[j]}</strong>{choice}</button>)}</div>
   {Number.isInteger(answers[prefix+i])&&<div className={'aa-feedback '+(answers[prefix+i]===q.correct?'good':'try')} role="status">
    <strong>{answers[prefix+i]===q.correct?'Correct!':'Try again'}</strong><p>{answers[prefix+i]===q.correct?q.why:'Review the concept and choose another answer. '+(q.hint||'')}</p>
   </div>}
  </section>)}
 </>;
}
function Apply({application,answer,onAnswer,inputId}){
 const isChoice=application.kind==='choice';
 const value=answer?.value;
 const hasValue=value!==undefined&&value!=='';
 const isNumeric=application.kind==='number';
 const numeric=Number(value);
 const correct=isChoice?value===application.correct:hasValue&&Number.isFinite(numeric)&&Math.abs(numeric-application.answer)<=(application.tolerance??.01);
 return <section className="aa-question aa-application">
  <span className="aa-label">APPLIED BIOCHEMISTRY</span><h3>{application.title}</h3><p>{application.prompt}</p>
  {isChoice?<div className="aa-answer-grid">{application.options.map((option,i)=><button key={i} onClick={()=>onAnswer({value:i,checked:true})} className={value===i?'active':''} aria-pressed={value===i}><strong>{'ABCD'[i]}</strong>{option}</button>)}</div>:
   <div className="aa-numeric-form"><label htmlFor={inputId}>Your answer</label>
    <input type="number" id={inputId} step="1" value={value??''} onChange={e=>onAnswer({value:e.target.value,checked:false})}/>
    <button disabled={!hasValue||!Number.isFinite(numeric)} onClick={()=>onAnswer({value,checked:true})}>Check answer</button></div>}
  {answer?.checked&&<div className={'aa-feedback '+(correct?'good':'try')} role="status"><strong>{correct?'Correct!':'Try again'}</strong><p>{correct?application.why:'Revisit the reasoning in Learn and try another answer.'}</p></div>}
 </section>;
}
function TopicStages({chapter,topic,stage,progress,setProgress}){
 const lesson=biomoleculeLessons[chapter][topic.id];
 const base=chapter+'/'+topic.id+'/';
 const key=progressKey(chapter,topic.id,stage);
 const done=progress.completed.includes(key);
 const completedCount=progress.completed.filter(k=>k.startsWith(base)).length;
 const confidence=progress.confidence[chapter+'/'+topic.id]||[];
 const setAnswer=(id,index)=>setProgress(s=>({...s,answers:{...s.answers,[id]:index}}));
 const setApplication=value=>setProgress(s=>({...s,applications:{...s.applications,[chapter+'/'+topic.id]:value}}));
 const toggleConfidence=i=>setProgress(s=>{
  const prev=s.confidence[chapter+'/'+topic.id]||[];
  return {...s,confidence:{...s.confidence,[chapter+'/'+topic.id]:prev.includes(i)?prev.filter(j=>j!==i):[...prev,i]}};
 });
 const toggleDone=()=>setProgress(s=>({...s,completed:s.completed.includes(key)?s.completed.filter(k=>k!==key):[...s.completed,key]}));
 return <div className="aa-topic-body">
  {stage==='learn'&&<>
    <div className="aa-stage-intro"><span className="aa-label">LEARN · EXPLANATIONS WITH GUIDED INTERACTIONS</span><h2>Understand the chemistry</h2><p>{lesson.intro}</p></div>
    <div className="aa-learning-card"><h3>Core ideas</h3>{lesson.points.map((text,i)=><div className="aa-point" key={i}><span>{String(i+1).padStart(2,'0')}</span><p>{text}</p></div>)}</div>
    <div className="bm-case"><span className="aa-label">BIOCHEMISTRY CONNECTION</span><h3>{lesson.caseStudy.title}</h3><p>{lesson.caseStudy.text}</p></div>
    <div className="aa-stage-intro interactive"><span className="aa-label">INTERACTIVE EXAMPLE · EMBEDDED IN LEARN</span><h2>See it in action</h2><p>{lesson.callout}</p></div>
    <BiomoleculeInteractive chapter={chapter} topicId={topic.id}/>
  </>}
  {stage==='explore'&&<>
    <div className="aa-stage-intro"><span className="aa-label">EXPLORE · INVESTIGATE INDEPENDENTLY</span><h2>Test your understanding</h2><p>Change the variables, inspect the diagrams, and look for the chemical principle behind the result.</p></div>
    <div className="aa-prompt-card"><strong>Try this investigation</strong><p>{lesson.explore}</p></div>
    <BiomoleculeInteractive chapter={chapter} topicId={topic.id}/>
  </>}
  {stage==='practice'&&<>
    <div className="aa-stage-intro"><span className="aa-label">PRACTICE · IMMEDIATE FEEDBACK</span><h2>Check your understanding</h2><p>Select an answer and review the feedback. Your selections are saved in this browser.</p></div>
    <Practice questions={lesson.questions} answers={progress.answers} onAnswer={setAnswer} prefix={base}/>
  </>}
  {stage==='apply'&&<>
    <div className="aa-stage-intro"><span className="aa-label">APPLY · CHEMICAL REASONING</span><h2>Use what you learned</h2><p>Solve a problem that draws on the structural and biochemical ideas in this topic.</p></div>
    <Apply application={lesson.apply} answer={progress.applications[chapter+'/'+topic.id]} onAnswer={setApplication} inputId={'bm-apply-'+chapter+'-'+topic.id}/>
  </>}
  {stage==='review'&&<>
    <div className="aa-stage-intro"><span className="aa-label">REVIEW · CONSOLIDATE</span><h2>What should you remember?</h2><p>Check each takeaway as you become confident with it. You can always revisit the interactive example.</p></div>
    <div className="aa-learning-card"><h3>Key takeaways</h3>{lesson.key.map((text,i)=><label className="aa-review-check" key={i}><input type="checkbox" checked={confidence.includes(i)} onChange={()=>toggleConfidence(i)}/><span>{text}</span></label>)}
     <p className="aa-scope">Self-assessment checkboxes are not an exam score.</p></div>
    <div className="aa-progress-summary"><strong>{completedCount} / 5 stages marked complete</strong><p>Completion is self-reported and saved on this device.</p></div>
  </>}
  <div className="aa-completion"><div><strong>{done?'Stage completed':'Finished with this stage?'}</strong><p>Mark completion to track your progress. All stages remain revisitable.</p></div>
   <button className={done?'marked':''} onClick={toggleDone}>{done?'✓ Completed · Undo':'Mark stage complete'}</button>
  </div>
 </div>;
}
export default function BiomoleculeChapter({number,navigate,topicId,stageId}){
 const chapter=chapters.find(c=>c.number===number);
 const lessons=biomoleculeLessons[number];
 const topics=topicsForChapter(number),topic=findTopic(number,topicId);
 const [progress,setProgress]=useTopicProgress();
 const stage=learningStages.some(s=>s.id===stageId)?stageId:'learn';
 const visit=(id,section='learn')=>navigate('/chapters/'+number+'/topics/'+id+'/'+section);
 const completed=progress.completed.filter(s=>s.startsWith(number+'/')).length;
 if(!chapter||!lessons)return null;
 if(!topic)return <div className="aa-page bm-chapter">
   <BreadCrumb navigate={navigate} chapter={chapter}/>
   <div className="aa-chapter-hero"><span className="aa-label">PART II · STRUCTURE AND FUNCTION OF BIOMOLECULES</span><h1>Chapter {number} — {chapter.title}</h1><p>{chapterIntroductions[number]}</p>
     <div><span>{topics.length} topics</span><span>Learn · Explore · Practice · Apply · Review</span><span>{completed}/{topics.length*5} stages marked complete</span></div></div>
   <div className="aa-chapter-intro"><h2>Choose a topic</h2><p>Each topic contains guided reading, interactive exploration, practice, application and review. Activities are embedded in the lessons.</p></div>
   <div className="aa-topic-cards">{topics.map(t=><button key={t.id} onClick={()=>visit(t.id)}>
     <span className="aa-topic-number">{t.number}</span><strong>{t.title}</strong><p>{lessons[t.id]?.intro}</p>
     <span className="aa-topic-card-foot">{progress.completed.filter(s=>s.startsWith(number+'/'+t.id+'/')).length}/5 stages complete <b>Open topic →</b></span></button>)}</div>
   <p className="aa-scope">Learning activities are conceptual models and do not replace experimental data or atom-complete molecular structures. Progress is stored locally in this browser.</p>
 </div>;
 if(!lessons[topic.id])return <div className="aa-page">Topic content not available.</div>;
 const index=topics.findIndex(t=>t.id===topic.id),stageIndex=learningStages.findIndex(s=>s.id===stage);
 return <div className="aa-page bm-chapter">
  <BreadCrumb navigate={navigate} chapter={chapter} topic={topic}/>
  <div className="aa-topic-hero"><span className="aa-label">CHAPTER {String(number).padStart(2,'0')} · TOPIC {topic.number}</span><h1>{topic.title}</h1><p>{lessons[topic.id].intro}</p>
   <div className="aa-topic-meta"><span>{progress.completed.filter(s=>s.startsWith(number+'/'+topic.id+'/')).length}/5 stages complete</span><span>Interactive learning</span></div></div>
  <nav className="aa-stage-tabs" aria-label="Learning stages">{learningStages.map((tab,i)=><button key={tab.id} className={stage===tab.id?'current':''} aria-current={stage===tab.id?'page':undefined} onClick={()=>visit(topic.id,tab.id)}>
    <span>{progress.completed.includes(progressKey(number,topic.id,tab.id))?'✓':String(i+1).padStart(2,'0')}</span>{tab.title}</button>)}</nav>
  <TopicStages key={number+'-'+topic.id+'-'+stage} chapter={number} topic={topic} stage={stage} progress={progress} setProgress={setProgress}/>
  <div className="aa-next-row">
   {stageIndex>0?<button onClick={()=>visit(topic.id,learningStages[stageIndex-1].id)}>← Previous: {learningStages[stageIndex-1].title}</button>:<button onClick={()=>navigate('/chapters/'+number)}>← All topics</button>}
   {stageIndex<learningStages.length-1?<button className="aa-primary-next" onClick={()=>visit(topic.id,learningStages[stageIndex+1].id)}>Next: {learningStages[stageIndex+1].title} →</button>:
    index<topics.length-1?<button className="aa-primary-next" onClick={()=>visit(topics[index+1].id)}>Next topic: {topics[index+1].number} →</button>:
    <button className="aa-primary-next" onClick={()=>navigate('/chapters/'+number)}>Back to chapter outline →</button>}
  </div>
 </div>;
}
