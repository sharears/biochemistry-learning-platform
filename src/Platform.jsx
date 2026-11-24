import React,{useEffect,useMemo,useState} from 'react';
import Chapter4 from './Chapter4.jsx';
import MetabolicExplorer from './metabolism/MetabolicExplorer.jsx';
import {parts,chapters,toolGroups,pathwayCatalog,metabolicCategories} from './courseCatalog.js';
import './styles.css';
import './platform.css';

const PLATFORM_NAV=[
 {path:'/home',label:'Home',icon:'⌂'},
 {path:'/chapters',label:'Textbook',icon:'▤'},
 {path:'/tools',label:'Interactive Tools',icon:'✧'},
 {path:'/practice',label:'Practice',icon:'✓'},
 {path:'/progress',label:'My Progress',icon:'◉'},
 {path:'/library',label:'Reference Library',icon:'▥'}
];
function getRoute(){
 const value=decodeURIComponent(window.location.hash.replace(/^#/,''));
 return value.startsWith('/')?value:'/home';
}
function getLocal(key){
 try{return JSON.parse(localStorage.getItem(key)||'null');}catch{return null;}
}
function Badge({status}){return <span className={'pl-badge '+(status==='active'?'live':'later')}>{status==='active'?'Explore now':'Planned'}</span>;}
function PageIntro({overline,title,description,children}){
 return <div className="pl-page-intro"><div><span className="pl-eyebrow">{overline}</span><h1>{title}</h1><p>{description}</p></div>{children}</div>;
}
function ArrowButton({onClick,children,secondary=false}){return <button className={'pl-action '+(secondary?'secondary':'')} onClick={onClick}>{children}<span aria-hidden="true">→</span></button>;}
function ToolCard({tool,navigate}){
 return <button className={'pl-tool-card '+(tool.status==='active'?'featured':'')} onClick={()=>navigate(tool.status==='active'?'/tools/metabolism':'/tools/'+tool.id)}>
   <div className="pl-tool-head"><span className="pl-tool-symbol">{tool.icon}</span><Badge status={tool.status}/></div>
   <strong>{tool.name}</strong><p>{tool.description}</p><span className="pl-card-link">{tool.status==='active'?'Open tool →':'Preview plan →'}</span>
 </button>;
}
function Home({navigate}){
 return <>
  <div className="pl-hero">
   <div className="pl-hero-copy"><span className="pl-eyebrow">BIOCHEMISTRY · INTERACTIVE LEARNING</span>
    <h1>Learn the molecules.<br/><em>Connect the pathways.</em></h1>
    <p>An expanding, chapter-based learning space combining clear explanations, experiments, practice questions, and scientific exploration.</p>
    <div className="pl-hero-buttons"><ArrowButton onClick={()=>navigate('/chapters')}>Browse textbook</ArrowButton><button className="pl-hero-secondary" onClick={()=>navigate('/tools/metabolism')}>Explore metabolism ↗</button></div>
   </div>
   <div className="pl-hero-orbit" aria-hidden="true"><div className="orb-circle a"/><div className="orb-circle b"/><div className="orb-center">BIO<br/>CHEM</div><span className="orbit-dot o1"/><span className="orbit-dot o2"/><span className="orbit-dot o3"/><span className="orbit-dot o4"/></div>
  </div>
  <div className="pl-stat-row"><div><strong>28</strong><span>Chapters outlined</span></div><div><strong>6</strong><span>Textbook parts</span></div><div><strong>5</strong><span>Learning stages</span></div><div><strong>1</strong><span>Metabolic pathway live</span></div></div>
  <div className="pl-section-head"><div><span className="pl-eyebrow">START EXPLORING</span><h2>Pick up where curiosity leads</h2></div></div>
  <div className="pl-feature-grid">
   <button className="pl-feature-card chapter-feature" onClick={()=>navigate('/chapters/4')}><span className="pl-card-pre">FEATURED CHAPTER · AVAILABLE</span><span className="pl-feature-icon">C</span><h3>04 — Amino Acids and Their Properties</h3><p>Five learning stages, a pH explorer, starter questions, and an isoelectric-point exercise.</p><span className="pl-card-link">Open Chapter 4 →</span></button>
   <button className="pl-feature-card metabolism-feature" onClick={()=>navigate('/tools/metabolism/glycolysis')}><span className="pl-card-pre">INTERACTIVE TOOL · AVAILABLE</span><span className="pl-feature-icon">↗</span><h3>Glycolysis: 10 reactions to explore</h3><p>Click metabolites and enzymes, follow the sequence, and track ATP and NADH per glucose.</p><span className="pl-card-link">Launch pathway explorer →</span></button>
  </div>
  <div className="pl-section-head"><div><span className="pl-eyebrow">COURSE ORGANIZATION</span><h2>Six connected areas of biochemistry</h2></div><button onClick={()=>navigate('/chapters')} className="pl-text-link">Full table of contents ↗</button></div>
  <div className="pl-parts-mini">{parts.map(part=><button key={part.id} onClick={()=>navigate('/chapters?part='+part.id)}>
    <span>PART {String(part.number).padStart(2,'0')}</span><strong>{part.title}</strong><small>{part.chapters.length} chapters</small>
  </button>)}</div>
  <div className="pl-educator-note"><span className="pl-note-symbol">✦</span><div><strong>Designed to grow chapter by chapter</strong><p>Sections marked “Planned” show the agreed course architecture, not completed instructional content. Chapter 4 and the Glycolysis Explorer are the first working modules.</p></div></div>
 </>;
}
function Textbook({navigate,filterPart}){
 const visible=filterPart?parts.filter(p=>p.id===filterPart):parts;
 return <>
  <PageIntro overline="COURSE CONTENTS" title="Interactive Biochemistry Textbook" description="Six parts and 28 chapters. Explore the existing amino acid chapter, or preview the outline for upcoming material.">
    <span className="pl-counter">{chapters.length} CHAPTERS</span>
  </PageIntro>
  <div className="pl-filter-tabs"><button className={!filterPart?'current':''} onClick={()=>navigate('/chapters')}>All parts</button>{parts.map(p=><button key={p.id} className={filterPart===p.id?'current':''} onClick={()=>navigate('/chapters?part='+p.id)}>{p.short}</button>)}</div>
  <div className="pl-part-list">{visible.map(p=><section className="pl-part-section" key={p.id}>
    <div className="pl-part-heading"><div><span className="pl-eyebrow">PART {String(p.number).padStart(2,'0')}</span><h2>{p.title}</h2></div><small>{p.chapters.length} CHAPTERS</small></div>
    <div className="pl-chapter-grid">{p.chapters.map(c=><button key={c.number} className={'pl-chapter-card '+(c.implemented?'ready':'')} onClick={()=>navigate('/chapters/'+c.number)}>
      <span className="pl-chapter-no">{String(c.number).padStart(2,'0')}</span><strong>{c.title}</strong><span className="pl-chapter-foot">{c.implemented?'Chapter available':c.pathway?'Pathway tool available · chapter planned':'Chapter outline'} <span>↗</span></span>
    </button>)}</div>
  </section>)}</div>
 </>;
}
function ChapterPreview({number,navigate}){
 const chapter=chapters.find(c=>c.number===number);
 if(!chapter)return <NotFound navigate={navigate}/>;
 const part=parts.find(p=>p.id===chapter.partId);
 return <>
  <div className="pl-crumb"><button onClick={()=>navigate('/chapters')}>Textbook</button> / {part.title} / Chapter {number}</div>
  <div className="pl-outline-hero"><span className="pl-eyebrow">CHAPTER {String(number).padStart(2,'0')} · OUTLINE PREVIEW</span><h1>{chapter.title}</h1><p>This chapter has a reserved place in the textbook. Lessons, figures, problems, and full content can be added using the consistent five-stage structure below.</p><span className="pl-status-box">Planned chapter · content not yet written</span></div>
  <div className="pl-section-head"><div><span className="pl-eyebrow">REUSABLE LEARNING SEQUENCE</span><h2>Five stages in every chapter</h2></div></div>
  <div className="pl-stage-grid">{[['01','Learn','Reading, facts, diagrams, equations'],['02','Explore','Relevant simulations and molecular tools'],['03','Practice','Short questions with feedback'],['04','Apply','Calculations, data, and cases'],['05','Review','Summaries and self-assessment']].map(s=><div key={s[0]}><span>{s[0]}</span><strong>{s[1]}</strong><p>{s[2]}</p></div>)}</div>
  {number===14&&<div className="pl-chapter-connection"><div><span className="pl-eyebrow">CONNECTED INTERACTIVE TOOL · AVAILABLE NOW</span><h3>Glycolysis Explorer</h3><p>While the Chapter 14 reading content is still planned, the metabolic map with all ten reactions is ready for review.</p></div><ArrowButton onClick={()=>navigate('/tools/metabolism/glycolysis')}>Open glycolysis</ArrowButton></div>}
  {number!==14&&number>=13&&number<=22&&<div className="pl-educator-note"><span className="pl-note-symbol">◎</span><div><strong>Metabolism chapters share one Explorer</strong><p>The metabolic pathway modules will be linked from their respective chapters as they are implemented.</p><button className="pl-text-link" onClick={()=>navigate('/tools/metabolism')}>Explore the pathway roadmap ↗</button></div></div>}
 </>;
}
function Tools({navigate}){
 return <><PageIntro overline="INTERACTIVE TOOLKIT" title="Explore beyond the page" description="Reusable interactive modules complement the chapter content. Begin with metabolic pathways; more tools are planned."/>
  <div className="pl-tool-grid">{toolGroups.map(tool=><ToolCard key={tool.id} tool={tool} navigate={navigate}/>)}</div>
  <div className="pl-educator-note"><span className="pl-note-symbol">↔</span><div><strong>One tool, multiple chapters</strong><p>Interactive modules are standalone but can also open directly from relevant textbook chapters, keeping a single shared implementation.</p></div></div>
 </>;
}
function ToolPreview({id,navigate}){
 const tool=toolGroups.find(t=>t.id===id);
 return <><div className="pl-crumb"><button onClick={()=>navigate('/tools')}>Interactive Tools</button> / Preview</div>
 <PageIntro overline="TOOL PLANNING" title={tool?.name||'Future interactive tool'} description={tool?.description||'This module is reserved for future work.'}/>
 <div className="pl-empty-block"><span>⌘</span><h2>Reserved for a future module</h2><p>The overall platform has a place for this tool, but its simulations and content have not been created yet.</p><ArrowButton onClick={()=>navigate('/tools')}>View available tools</ArrowButton></div></>;
}
function ConnectionsOverview({navigate}){
 const chips=[
  {from:'Glucose-6-phosphate',to:'Pentose phosphate pathway',id:'pentose-phosphate'},
  {from:'Glucose-6-phosphate',to:'Glycogen metabolism',id:'glycogen-metabolism'},
  {from:'Pyruvate',to:'Lactate fermentation',id:'fermentation'},
  {from:'Pyruvate',to:'Pyruvate oxidation → TCA',id:'pyruvate-oxidation'}
 ];
 return <div className="pl-connections"><div><span className="pl-eyebrow">NETWORK ARCHITECTURE</span><h3>Future pathway connections</h3><p>Connections will reuse identified metabolites and explicit reactions, not simply draw lines between unrelated pathway titles.</p></div>
  <div className="pl-connections-grid">{chips.map(x=><button key={x.id} onClick={()=>navigate('/tools/metabolism/'+x.id)}><span>{x.from}</span><b>→</b><strong>{x.to}</strong><small>Planned</small></button>)}</div>
  <p className="pl-small">Cellular compartments and reaction direction will be tracked as modules are added. Ubiquitous cofactors such as ATP should not automatically connect every pathway.</p>
 </div>;
}
function MetabolismHome({navigate}){
 const[category,setCategory]=useState('all'),[query,setQuery]=useState('');
 const filtered=useMemo(()=>pathwayCatalog.filter(p=>(category==='all'||p.category===category)&&p.title.toLowerCase().includes(query.toLowerCase())),[category,query]);
 return <>
  <div className="pl-crumb"><button onClick={()=>navigate('/tools')}>Interactive Tools</button> / Metabolic Pathway Explorer</div>
  <div className="pl-pathway-hero"><div><span className="pl-eyebrow">INTERACTIVE BIOCHEMISTRY · METABOLIC NETWORKS</span><h1>Metabolic Pathway Explorer</h1><p>Start with individual pathways. Follow reactions, inspect metabolites, and eventually navigate an interconnected map of cellular metabolism.</p><ArrowButton onClick={()=>navigate('/tools/metabolism/glycolysis')}>Explore glycolysis</ArrowButton></div><div className="pl-network-art" aria-hidden="true"><span>Glucose</span><i>↓</i><span>Glycolysis</span><i>↓</i><span>Pyruvate</span><i>⇢</i><span>More pathways</span></div></div>
  <div className="pl-section-head"><div><span className="pl-eyebrow">PATHWAY LIBRARY</span><h2>Explore pathways by system</h2></div><span className="pl-counter">1 LIVE · {pathwayCatalog.length-1} PLANNED</span></div>
  <div className="pl-pathway-filter"><label htmlFor="pathway-search">Search pathways</label><input id="pathway-search" type="search" placeholder="e.g., glycolysis, citric acid cycle..." value={query} onChange={e=>setQuery(e.target.value)}/></div>
  <div className="pl-filter-tabs"><button className={category==='all'?'current':''} onClick={()=>setCategory('all')}>All systems</button>{metabolicCategories.map(c=><button key={c.id} className={category===c.id?'current':''} onClick={()=>setCategory(c.id)}>{c.title}</button>)}</div>
  <div className="pl-pathway-grid">{filtered.map(p=><button key={p.id} onClick={()=>navigate('/tools/metabolism/'+p.id)} className={'pl-pathway-card '+(p.status==='active'?'ready':'')}>
   <div className="pl-pathway-card-top"><span className="pl-pathway-mark">{metabolicCategories.find(c=>c.id===p.category)?.icon}</span><Badge status={p.status}/></div>
   <strong>{p.title}</strong><p>{p.description}</p><small>Chapter {p.chapter} · {metabolicCategories.find(c=>c.id===p.category)?.title}</small><span className="pl-card-link">{p.status==='active'?'Open interactive pathway →':'Preview planned pathway →'}</span>
  </button>)}</div>
  {filtered.length===0&&<div className="pl-empty-block"><h3>No pathways match that search</h3><button className="pl-text-link" onClick={()=>{setCategory('all');setQuery('');}}>Clear filters</button></div>}
  <ConnectionsOverview navigate={navigate}/>
 </>;
}
function PlannedPathway({id,navigate}){
 const p=pathwayCatalog.find(x=>x.id===id);
 if(!p)return <NotFound navigate={navigate}/>;
 return <><div className="pl-crumb"><button onClick={()=>navigate('/tools/metabolism')}>Pathway library</button> / {p.title}</div>
  <PageIntro overline="PLANNED PATHWAY MODULE" title={p.title} description={p.description}><Badge status={p.status}/></PageIntro>
  <div className="pl-empty-block"><span>◎</span><h2>Pathway reserved for future development</h2><p>This module will reuse the metabolite/reaction data model and the same explorer layout as glycolysis. Its reaction data and biochemical visualization have not been built yet.</p>
  <div className="pl-inline-actions"><ArrowButton onClick={()=>navigate('/tools/metabolism/glycolysis')}>Explore working prototype</ArrowButton><ArrowButton secondary onClick={()=>navigate('/tools/metabolism')}>Back to pathway library</ArrowButton></div></div>
 </>;
}
function Practice({navigate}){
 return <><PageIntro overline="PRACTICE & ASSESSMENT" title="Build understanding through practice" description="An expandable home for chapter quizzes, reaction challenges, and data-interpretation activities."/>
  <div className="pl-practice-tiles"><div><span>01</span><h3>Amino acid practice</h3><p>Questions within Chapter 4 on R-group properties and peptide bonds.</p><ArrowButton onClick={()=>navigate('/chapters/4')}>Open Chapter 4</ArrowButton></div><div><span>02</span><h3>Glycolysis challenge</h3><p>Five starter questions about enzymes, cleavage, ATP balance, and NADH.</p><ArrowButton onClick={()=>navigate('/tools/metabolism/glycolysis')}>Open pathway</ArrowButton></div></div>
  <div className="pl-educator-note"><span className="pl-note-symbol">✓</span><div><strong>Formal assessments are planned</strong><p>In this version, practice is ungraded and saved only in the browser. A future assessment system will require course policies and student privacy safeguards.</p></div></div>
 </>;
}
function Progress({navigate}){
 const chapter=getLocal('biochem-chapter4-v1'),metabolism=getLocal('biochem-metabolism-glycolysis-v1');
 const done=Array.isArray(chapter?.done)?chapter.done.length:0;
 const visited=Array.isArray(metabolism?.visited)?metabolism.visited.length:0;
 return <><PageIntro overline="LOCAL LEARNING PROGRESS" title="Your learning at a glance" description="This prototype saves only local browser progress. No accounts, synchronization, or instructor gradebook are connected."/>
  <div className="pl-progress-grid"><button onClick={()=>navigate('/chapters/4')}><span className="pl-eyebrow">CHAPTER 04</span><h3>Amino Acids and Their Properties</h3><strong>{done} / 5 sections</strong><div className="pl-progress-track"><div style={{width:done/5*100+'%'}}/></div><small>Open chapter →</small></button>
  <button onClick={()=>navigate('/tools/metabolism/glycolysis')}><span className="pl-eyebrow">METABOLISM TOOL</span><h3>Glycolysis Explorer</h3><strong>{visited} / 10 steps explored</strong><div className="pl-progress-track"><div style={{width:visited/10*100+'%'}}/></div><small>Continue exploring →</small></button></div>
  <div className="pl-educator-note"><span className="pl-note-symbol">ⓘ</span><div><strong>Browser-only progress</strong><p>Using a different device or clearing browser storage will lose this progress. Student login and cross-device synchronization can be added after a privacy and access-control design review.</p></div></div>
 </>;
}
function Library(){
 const resources=[
  {name:'Glossary',description:'Searchable biochemical terms and definitions',samples:['ATP','pKa','Gibbs free energy','Zwitterion']},
  {name:'Equation reference',description:'Central formulas with examples',samples:['Henderson–Hasselbalch','Michaelis–Menten','ΔG = ΔG°′ + RT ln Q']},
  {name:'Molecule collection',description:'Structures and metadata',samples:['Amino acids','Nucleotides','Metabolic intermediates']},
  {name:'Experimental methods',description:'Reference techniques and data',samples:['Chromatography','Electrophoresis','Spectroscopy']}
 ];
 return <><PageIntro overline="COURSE RESOURCES" title="Reference Library" description="A home for cross-chapter references. The entries below are organizational starters, not complete reference datasets."/>
 <div className="pl-library-grid">{resources.map(r=><div className="pl-library-card" key={r.name}><span className="pl-eyebrow">REFERENCE COLLECTION · PLANNED</span><h3>{r.name}</h3><p>{r.description}</p><div>{r.samples.map(s=><span key={s}>{s}</span>)}</div></div>)}</div></>;
}
function NotFound({navigate}){return <div className="pl-empty-block"><h2>Page not found</h2><p>This section does not exist in the current outline.</p><ArrowButton onClick={()=>navigate('/home')}>Return to dashboard</ArrowButton></div>;}
export default function Platform(){
 const[route,setRoute]=useState(getRoute);
 useEffect(()=>{const listener=()=>{setRoute(getRoute());window.scrollTo(0,0);};window.addEventListener('hashchange',listener);return()=>window.removeEventListener('hashchange',listener);},[]);
 useEffect(()=>{document.title='Biochemistry Learning Platform';},[]);
 function navigate(path){
  const hash='#'+path;
  if(window.location.hash!==hash)window.location.hash=hash;
  setRoute(path);window.scrollTo({top:0,behavior:'smooth'});
 }
 const pathname=route.split('?')[0];
 const params=new URLSearchParams(route.split('?')[1]||'');
 const numberMatch=pathname.match(/^\/chapters\/(\d+)$/);
 const id=pathname.startsWith('/tools/metabolism/')?pathname.split('/').pop():null;
 if(numberMatch&&Number(numberMatch[1])===4)return <div className="pl-legacy-page"><div className="pl-legacy-back"><button onClick={()=>navigate('/chapters')}>← Back to textbook</button><span>Chapter 04 · Original learning module</span><button onClick={()=>navigate('/tools/metabolism')}>Explore metabolism ↗</button></div><Chapter4/></div>;
 const navPath=pathname.startsWith('/chapters')?'/chapters':pathname.startsWith('/tools')?'/tools':pathname;
 const routeLabel=pathname==='/home'?'Dashboard':pathname.startsWith('/tools/metabolism')?'Metabolic Pathway Explorer':PLATFORM_NAV.find(x=>x.path===navPath)?.label||'Course';
 return <div className="pl-shell">
  <aside className="pl-sidebar">
   <button className="pl-brand" onClick={()=>navigate('/home')}><span className="pl-brand-symbol">B<span>•</span></span><span><strong>Biochemistry</strong><small>INTERACTIVE LEARNING</small></span></button>
   <div className="pl-side-group">EXPLORE</div>
   <nav className="pl-side-nav" aria-label="Main navigation">{PLATFORM_NAV.map(item=><button key={item.path} onClick={()=>navigate(item.path)} aria-current={navPath===item.path?'page':undefined} className={navPath===item.path?'active':''}><span className="pl-nav-icon">{item.icon}</span>{item.label}</button>)}</nav>
   <div className="pl-side-group section">QUICK ACCESS</div>
   <button className="pl-quick" onClick={()=>navigate('/chapters/4')}><span>04</span> Amino acids</button>
   <button className="pl-quick" onClick={()=>navigate('/tools/metabolism/glycolysis')}><span>↗</span> Glycolysis explorer</button>
   <div className="pl-sidebar-footer"><div className="pl-sidebar-ring">◎</div><strong>Growing together</strong><p>One chapter and one metabolic pathway at a time.</p><span>Version 0.2 · Prototype</span></div>
  </aside>
  <main className="pl-main"><header className="pl-topbar"><span>Biochemistry / <strong>{routeLabel}</strong></span><span className="pl-top-status"><span>●</span> Learning prototype</span></header>
   <div className="pl-page-wrap">
    {pathname==='/home'&&<Home navigate={navigate}/>}
    {pathname==='/chapters'&&<Textbook navigate={navigate} filterPart={params.get('part')}/>}
    {numberMatch&&<ChapterPreview number={Number(numberMatch[1])} navigate={navigate}/>}
    {pathname==='/tools'&&<Tools navigate={navigate}/>}
    {pathname==='/tools/metabolism'&&<MetabolismHome navigate={navigate}/>}
    {id==='glycolysis'&&<MetabolicExplorer navigate={navigate}/>}
    {id&&id!=='glycolysis'&&<PlannedPathway id={id} navigate={navigate}/>}
    {pathname.startsWith('/tools/')&&!pathname.startsWith('/tools/metabolism')&&<ToolPreview id={pathname.split('/').pop()} navigate={navigate}/>}
    {pathname==='/practice'&&<Practice navigate={navigate}/>}
    {pathname==='/progress'&&<Progress navigate={navigate}/>}
    {pathname==='/library'&&<Library/>}
    {!['/home','/chapters','/tools','/tools/metabolism','/practice','/progress','/library'].includes(pathname)&&!numberMatch&&!pathname.startsWith('/tools/')&&<NotFound navigate={navigate}/>}
    <footer className="pl-footer"><span>Biochemistry Learning Platform · Built for learning and exploration</span><span>Course structure prototype · 2026</span></footer>
   </div>
  </main>
 </div>;
}
