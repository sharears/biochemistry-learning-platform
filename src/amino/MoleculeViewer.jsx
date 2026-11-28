import React,{useEffect,useMemo,useRef,useState} from 'react';
import {aminoByLetter} from './aminoData.js';
import {moleculeGraphs} from './moleculeGraphs.js';

const ELEMENT_COLORS={C:'#607b84',N:'#4974c5',O:'#d95e65',S:'#e7ab4d',Se:'#bc82bf'};
const clamp=(n,a,b)=>Math.min(b,Math.max(a,n));
const getColor=e=>ELEMENT_COLORS[e]||'#8ba59b';
const chargeSign=n=>n>0?'+':n<0?'−':'';
const atomsFor=one=>{
 const data=moleculeGraphs[one]||moleculeGraphs.A;
 return {atoms:data[0],bonds:data[1]};
};
function diagram2d(atoms){
 const xs=atoms.map(a=>a[2]),ys=atoms.map(a=>a[3]);
 const left=Math.min(...xs),right=Math.max(...xs),bottom=Math.min(...ys),top=Math.max(...ys);
 const s=Math.min(590/Math.max(26,right-left),280/Math.max(23,top-bottom));
 const mx=(left+right)/2,my=(bottom+top)/2;
 return atoms.map(a=>({x:350+(a[2]-mx)*s,y:190-(a[3]-my)*s,atom:a,z:0}));
}
function diagram3d(atoms,ax,ay,zoom){
 const xs=atoms.map(a=>a[4]),ys=atoms.map(a=>a[5]),zs=atoms.map(a=>a[6]);
 const mx=(Math.min(...xs)+Math.max(...xs))/2,my=(Math.min(...ys)+Math.max(...ys))/2,mz=(Math.min(...zs)+Math.max(...zs))/2;
 const cy=Math.cos(ay),sy=Math.sin(ay),cx=Math.cos(ax),sx=Math.sin(ax);
 const original=atoms.map(a=>{
  const x=a[4]-mx,y=a[5]-my,z=a[6]-mz;
  const rx=x*cy+z*sy,rz=-x*sy+z*cy;
  return {x:rx,y:y*cx-rz*sx,z:y*sx+rz*cx,atom:a};
 });
 const span=Math.max(25,...original.map(p=>Math.hypot(p.x,p.y)));
 const scale=Math.min(7,150/span)*zoom;
 return original.map(p=>({...p,x:350+p.x*scale,y:190-p.y*scale}));
}
function Atom({p,i,mode,selected,onPick,protonationLabel=null}){
 // Larger atom glyphs in both views, with circles scaled to keep labels clear.
 const [symbol,charge]=p.atom,rad=mode==='3d'?(symbol==='C'?16:18):symbol==='C'?15:17;
 const elementFontSize=symbol==='C'?15:16;
 const emphasized=Boolean(protonationLabel);
 const badgeWidth=emphasized?Math.max(50,protonationLabel.text.length*13+18):0;
 return <g onClick={()=>onPick(i)} role="button" tabIndex="0"
  aria-label={'Inspect atom '+(i+1)+': '+(protonationLabel?.group||symbol)+(protonationLabel?' '+protonationLabel.text:(charge?' charged '+charge:''))}
  onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onPick(i);}}}
  className="aa-atom" style={{cursor:'pointer'}}>
  {emphasized?<g>
   <rect x={p.x-badgeWidth/2} y={p.y-17} width={badgeWidth} height="34" rx="9"
     fill="#e0f4e9" stroke={selected===i?"#168360":"#63b08c"} strokeWidth={selected===i?3:2}/>
   <text x={p.x} y={p.y+6} textAnchor="middle" fontSize="18" fontWeight="800" fill="#17684d">{protonationLabel.text}</text>
  </g>:<g>
   <circle cx={p.x} cy={p.y} r={rad+(selected===i?5:2)} fill={selected===i?'#d3edcf':'transparent'} stroke={selected===i?'#2d946d':'none'} strokeWidth="2"/>
   <circle cx={p.x} cy={p.y} r={rad} fill={getColor(symbol)} stroke="#fff" strokeWidth="1.7"/>
   {mode==='3d'&&<circle cx={p.x-3} cy={p.y-4} r="3.2" fill="#fff" fillOpacity=".40"/>}
   <text x={p.x} y={p.y+5} textAnchor="middle" fontSize={elementFontSize} fontWeight="800" fill="#fff">{symbol}</text>
   {charge!==0&&<text x={p.x+rad-1} y={p.y-rad+2} fontSize="15" fill="#2e5960" fontWeight="900">{chargeSign(charge)}</text>}
  </g>}
 </g>;
}
function Bond({from,to,bond,mode}){
 const order=bond[2];
 const dx=to.x-from.x,dy=to.y-from.y,dist=Math.hypot(dx,dy)||1;
 const ox=-dy/dist*3,oy=dx/dist*3;
 const drawLine=(shift,key,width=mode==='3d'?6:3)=><line key={key} x1={from.x+ox*shift} y1={from.y+oy*shift}
   x2={to.x+ox*shift} y2={to.y+oy*shift} stroke={mode==='3d'?'#97a6a3':'#8ca49d'} strokeWidth={width} strokeLinecap="round"/>;
 if(mode==='3d')return <>{drawLine(0,'main')}</>;
 if(order===4)return <>{drawLine(-1,'a',2.4)}{drawLine(1,'b',2.4)}</>;
 if(order===3)return <>{drawLine(0,'a',2.7)}<line x1={from.x+ox} y1={from.y+oy} x2={to.x+ox} y2={to.y+oy} stroke="#789c91" strokeWidth="1" strokeDasharray="4 5"/></>;
 return drawLine(0,'single',2.8);
}

/**
 * Local vector molecular visualization: all 20 amino acids, 2D coordinates
 * and rotatable 3D conformers generated from a chemical toolkit.
 * No external API, script, account, or network request required.
 */
export default function MoleculeViewer({one='A',compact=false,viewMode=null,hideViewToggle=false,protonationLabels=null}){
 const [localMode,setLocalMode]=useState('2d'),[angles,setAngles]=useState({x:-0.35,y:0.55});
 const mode=viewMode??localMode;
 const [zoom,setZoom]=useState(1),[selected,setSelected]=useState(null);
 const dragging=useRef(null);
 const {atoms,bonds}=useMemo(()=>atomsFor(one),[one]);
 // Clear selections when changing molecules, including switching from a
 // larger molecule to glycine with fewer indexed atoms.
 useEffect(()=>setSelected(null),[one]);
 const safeSelected=selected!==null&&selected>=0&&selected<atoms.length?selected:null;
 const coords=mode==='2d'?diagram2d(atoms):diagram3d(atoms,angles.x,angles.y,zoom);
 const amino=aminoByLetter[one]||aminoByLetter.A;
 const ordered=[...coords.keys()].sort((a,b)=>coords[a].z-coords[b].z);
 function start(e){
   if(mode!=='3d'||e.target.closest('.aa-atom'))return;
   dragging.current={x:e.clientX,y:e.clientY,angles};
   e.currentTarget.setPointerCapture(e.pointerId);
 }
 function move(e){
   const d=dragging.current;if(!d)return;
   setAngles({x:d.angles.x+(e.clientY-d.y)*.014,y:d.angles.y+(e.clientX-d.x)*.014});
 }
 function end(e){
   dragging.current=null;
   if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);
 }
 return <section className={'aa-molecule-card '+(compact?'compact':'')} aria-label={'Interactive '+amino.name+' molecule viewer'}>
   <div className="aa-mol-header"><div><strong>{amino.name} <span>{amino.three} · {amino.one}</span></strong><p>{amino.sidechain}</p></div>
     {!hideViewToggle&&<div className="aa-view-toggle" role="group" aria-label="Molecular view"><button onClick={()=>{setLocalMode('2d');setSelected(null);}} className={mode==='2d'?'active':''} aria-pressed={mode==='2d'}>2D</button><button className={mode==='3d'?'active':''} onClick={()=>{setLocalMode('3d');setSelected(null);}} aria-pressed={mode==='3d'}>3D</button></div>}</div>
   <div className="aa-mol-canvas">
     <svg viewBox="0 0 700 380" width="100%" role="img" aria-label={mode==='3d'?'Rotatable 3D ball and stick model of '+amino.name:'2D atom and bond connectivity for '+amino.name}
       onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerCancel={end}
       onKeyDown={e=>{if(mode!=='3d')return;if(e.key==='ArrowLeft')setAngles(v=>({...v,y:v.y-.15}));if(e.key==='ArrowRight')setAngles(v=>({...v,y:v.y+.15}));}}
       tabIndex={mode==='3d'?0:undefined} style={{touchAction:mode==='3d'?'none':'auto'}}>
       <rect width="700" height="380" rx="16" fill="#f8fbf9"/>
       <g>{bonds.map((bond,i)=><Bond key={i} from={coords[bond[0]]} to={coords[bond[1]]} bond={bond} mode={mode}/>)}</g>
       <g>{ordered.map(i=><Atom key={i} i={i} p={coords[i]} mode={mode} selected={safeSelected} onPick={setSelected} protonationLabel={protonationLabels?.[i]}/>)}</g>
     </svg>
     <span className="aa-mol-watermark">{mode==='3d'?'Computational conformer · drag to rotate':'Atom and bond connectivity · tap atoms'}</span>
   </div>
   <div className="aa-mol-controls">
     <div className="aa-element-legend"><span><i style={{background:getColor('C')}}/>C</span><span><i style={{background:getColor('N')}}/>N</span><span><i style={{background:getColor('O')}}/>O</span><span><i style={{background:getColor('S')}}/>S</span></div>
     {mode==='3d'&&<div className="aa-rotation-buttons"><button onClick={()=>setZoom(z=>clamp(z-.12,.6,1.7))} aria-label="Zoom molecule out">−</button><button onClick={()=>setZoom(z=>clamp(z+.12,.6,1.7))} aria-label="Zoom molecule in">+</button><button onClick={()=>{setAngles({x:-.35,y:.55});setZoom(1);}} title="Reset 3D view">↺</button></div>}
   </div>
   {safeSelected!==null&&<p className="aa-atom-detail" aria-live="polite">Atom {safeSelected+1}: <strong>{protonationLabels?.[safeSelected]?.text||atoms[safeSelected][0]}</strong>{protonationLabels?.[safeSelected]?' · '+protonationLabels[safeSelected].group:(atoms[safeSelected][1]!==0?' · formal charge '+(atoms[safeSelected][1]>0?'+':'')+atoms[safeSelected][1]:'')} · bonded to {bonds.filter(b=>b[0]===safeSelected||b[1]===safeSelected).length} heavy atom(s). {protonationLabels?'Hydrogens on highlighted ionizable groups are shown in their labels; other hydrogens are implicit.':'Hydrogen atoms are implicit.'}</p>}
   <p className="aa-mol-disclaimer">{protonationLabels?'Predominant protonation states at the selected pH are shown as labels at the actual titratable atoms. Other hydrogens remain implicit. 3D coordinates do not re-optimize with pH; this is a structural teaching model.':'Free amino acid, illustrated near neutral pH. Hydrogen atoms are implicit; 3D geometry is computational and schematic, not experimental. Titrating groups and peptide-bound residues can have different protonation.'}</p>
 </section>;
}
