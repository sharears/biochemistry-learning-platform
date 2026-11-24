import React,{useEffect,useRef,useState} from 'react';

/**
 * Reusable SVG metabolic pathway canvas. Explicit coordinates keep the
 * chemical diagram readable rather than auto-layout changing its meaning.
 */
export const GLYCOLYSIS_POSITIONS={
  glucose:{x:375,y:32},g6p:{x:375,y:150},f6p:{x:375,y:268},
  f16bp:{x:375,y:386},dhap:{x:35,y:504},g3p:{x:375,y:504},
  bpg13:{x:375,y:622},pg3:{x:375,y:740},pg2:{x:375,y:858},
  pep:{x:375,y:976},pyruvate:{x:375,y:1094}
};
const W=236,H=62;
const center=id=>GLYCOLYSIS_POSITIONS[id].x+W/2;
const cy=id=>GLYCOLYSIS_POSITIONS[id].y+H/2;
const clip=(n,min,max)=>Math.max(min,Math.min(max,n));
const stepGeometry=r=>{
  if(r.number===4){
    const start=GLYCOLYSIS_POSITIONS.f16bp.y+H,y=GLYCOLYSIS_POSITIONS.g3p.y;
    return {d:'M '+center('f16bp')+' '+start+' V '+(start+20)+' H '+center('dhap')+' V '+y+' M '+center('f16bp')+' '+(start+20)+' V '+y,pillX:640,pillY:start+16};
  }
  if(r.number===5){
    return {d:'M '+(GLYCOLYSIS_POSITIONS.dhap.x+W)+' '+cy('dhap')+' H '+GLYCOLYSIS_POSITIONS.g3p.x,pillX:319,pillY:cy('dhap')};
  }
  const a=GLYCOLYSIS_POSITIONS[r.inputs[0]],b=GLYCOLYSIS_POSITIONS[r.outputs[0]];
  return {d:'M '+(a.x+W/2)+' '+(a.y+H)+' V '+b.y,pillX:650,pillY:(a.y+H+b.y)/2};
};

function MetaboliteNode({m,position,selected,onSelect}){
 const lines=m.short||[m.name];
 const activate=()=>onSelect({type:'metabolite',id:m.id});
 return <g className={'map-metabolite '+(selected?'is-selected':'')} role="button" tabIndex="0"
   aria-label={'Inspect '+m.name} onClick={activate}
   onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();activate();}}}
   transform={'translate('+position.x+' '+position.y+')'}>
  <rect width={W} height={H} rx="14" />
  <circle cx="23" cy="31" r="12" className="map-atom"/>
  <text x="23" y="35" textAnchor="middle" className="map-carbon">{m.carbon}C</text>
  {lines.map((line,i)=><text key={line} x="45" y={lines.length>1?25+i*19:37} className="map-met-name">{line}</text>)}
 </g>;
}
function ReactionEdge({reaction,isSelected,onSelect}){
 const {d,pillX,pillY}=stepGeometry(reaction);
 const activate=()=>onSelect({type:'reaction',id:reaction.id});
 return <g className={'map-reaction '+(isSelected?'is-selected ':'')+reaction.phase}>
  <path className="map-connection" d={d} markerEnd="url(#metabolic-arrow)"/>
  <g className="map-reaction-tap" role="button" tabIndex="0" aria-label={'Inspect step '+reaction.number+': '+reaction.enzyme}
    onClick={activate} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();activate();}}}>
    <circle cx={pillX} cy={pillY} r="21" className="map-step"/>
    <text x={pillX} y={pillY+4} textAnchor="middle" className="map-step-label">{reaction.number}</text>
    {reaction.number!==5&&<text x={pillX+29} y={pillY+4} className="map-enzyme-label">{reaction.enzyme.length>29?reaction.enzyme.slice(0,27)+'…':reaction.enzyme}</text>}
  </g>
 </g>;
}
export default function PathwayCanvas({pathway,selected,onSelect,focusStep,mode}){
 const[zoom,setZoom]=useState(.84);
 const scrollRef=useRef(null);
 const dragRef=useRef(null);

 useEffect(()=>{
  if(mode!=='guided')return;
  const reaction=pathway.reactions[focusStep];
  const y=GLYCOLYSIS_POSITIONS[reaction.inputs[0]]?.y??0;
  const box=scrollRef.current;
  if(box)box.scrollTo({top:clip(y*zoom-60,0,1600),behavior:'smooth'});
 },[focusStep,mode,zoom,pathway]);
 function down(e){
  if(e.button!==0||e.target.closest('.map-metabolite,.map-reaction-tap'))return;
  const el=scrollRef.current;
  dragRef.current={x:e.clientX,y:e.clientY,left:el.scrollLeft,top:el.scrollTop};
  el.classList.add('is-dragging');el.setPointerCapture(e.pointerId);
 }
 function move(e){
  if(!dragRef.current)return;
  const d=dragRef.current,el=scrollRef.current;
  el.scrollLeft=d.left-(e.clientX-d.x);el.scrollTop=d.top-(e.clientY-d.y);
 }
 function up(e){
  dragRef.current=null;const el=scrollRef.current;
  el?.classList.remove('is-dragging');
  if(el?.hasPointerCapture(e.pointerId))el.releasePointerCapture(e.pointerId);
 }
 function resetView(){setZoom(.84);scrollRef.current?.scrollTo({top:0,left:0,behavior:'smooth'});}
 return <section className="pathway-visual" aria-label="Pathway map">
  <div className="map-toolbar">
   <div><strong>Reaction map</strong><small>Click a molecule or numbered reaction · Drag empty space to pan</small></div>
   <div className="zoom-group">
    <button aria-label="Zoom out" title="Zoom out" onClick={()=>setZoom(v=>clip(Math.round((v-.12)*100)/100,.54,1.45))} disabled={zoom<=.54}>−</button>
    <span aria-label="Zoom level">{Math.round(zoom*100)}%</span>
    <button aria-label="Zoom in" title="Zoom in" onClick={()=>setZoom(v=>clip(Math.round((v+.12)*100)/100,.54,1.45))} disabled={zoom>=1.45}>+</button>
    <button onClick={resetView} title="Reset view" aria-label="Reset zoom and position">↺</button>
   </div>
  </div>
  <div className="map-scroll" ref={scrollRef} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
   <svg width={940*zoom} height={1190*zoom} viewBox="0 0 940 1190" aria-label="Glycolysis: glucose through pyruvate with 10 selectable enzyme reactions">
    <defs><marker id="metabolic-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill="#7fa79c"/></marker></defs>
    <rect x="0" y="0" width="940" height="1190" fill="#fafcfb"/>
    <rect x="18" y="22" width="264" height="45" rx="10" fill="#eaf5ed"/>
    <text x="35" y="41" fill="#547d62" fontSize="13" fontWeight="700">ENERGY INVESTMENT</text>
    <text x="35" y="57" fill="#7b9d85" fontSize="11">Steps 1–5 · 2 ATP consumed</text>
    <rect x="18" y="604" width="264" height="45" rx="10" fill="#edf2fc"/>
    <text x="35" y="623" fill="#4c709c" fontSize="13" fontWeight="700">ENERGY PAYOFF</text>
    <text x="35" y="639" fill="#7695b7" fontSize="11">Steps 6–10 · 2 triose molecules</text>
    {pathway.reactions.map(r=><ReactionEdge key={r.id} reaction={r} isSelected={selected.type==='reaction'&&selected.id===r.id} onSelect={onSelect}/>)}
    {pathway.metaboliteIds.map(id=><MetaboliteNode key={id} m={pathway.metabolites[id]} position={GLYCOLYSIS_POSITIONS[id]} selected={selected.type==='metabolite'&&selected.id===id} onSelect={onSelect}/>)}
    <text x="125" y="480" textAnchor="middle" fill="#789485" fontSize="13">Cleavage yields two 3C products</text>
    <text x="240" y="600" textAnchor="middle" fill="#789485" fontSize="12">DHAP converts to G3P</text>
    <text x="240" y="620" textAnchor="middle" fill="#789485" fontSize="12">→ 2 G3P continue</text>
    <rect x="22" y="1111" width="264" height="52" rx="11" fill="#e4f4ed"/>
    <text x="37" y="1133" fontSize="13" fill="#376e57" fontWeight="700">Per glucose: 2 pyruvate</text>
    <text x="37" y="1150" fontSize="12" fill="#5c8b73">Net +2 ATP · +2 NADH</text>
   </svg>
  </div>
  <div className="map-legend"><span><i className="legend-dot investment"/> Investment steps 1–5</span><span><i className="legend-dot payoff"/> Payoff steps 6–10</span><span><i className="legend-dot chosen"/> Selected</span></div>
 </section>;
}
