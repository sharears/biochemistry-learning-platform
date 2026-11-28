import React,{useState} from 'react';
import './biomolecules.css';

const sugarProfiles={
 glucose:{name:'D-glucose',positions:['R','L','R','R'],epimer:'Reference configuration: C2 right, C3 left, C4 right, C5 right'},
 mannose:{name:'D-mannose',positions:['L','L','R','R'],epimer:'C2 epimer of D-glucose: the C2 OH is flipped'},
 galactose:{name:'D-galactose',positions:['R','L','L','R'],epimer:'C4 epimer of D-glucose: the C4 OH is flipped'}
};
const pos=(way)=>way==='R'?'right':'left';
function Fischer({profile}){
 const rows=profile.positions;
 return <svg viewBox="0 0 300 335" className="bm-sugar-svg" role="img" aria-label={'Open-chain Fischer projection of '+profile.name}>
  <text x="150" y="26" textAnchor="middle" fontSize="18" fontWeight="750">CHO</text>
  <line x1="150" y1="37" x2="150" y2="263" stroke="#638b7d" strokeWidth="3"/>
  {rows.map((side,i)=>{
   const cy=63+i*62;
   return <g key={i}>
    <line x1="90" y1={cy} x2="210" y2={cy} stroke="#638b7d" strokeWidth="3"/>
    <circle cx="150" cy={cy} r="14" fill="#e7f4ed" stroke="#6caa88" strokeWidth="1.2"/>
    <text x="150" y={cy+5} textAnchor="middle" fontSize="13" fontWeight="700" fill="#28674e">{i+2}</text>
    <text x={side==='R'?243:56} y={cy+6} textAnchor="middle" fontSize="19" fontWeight="750" fill="#17835b">OH</text>
    <text x={side==='R'?56:243} y={cy+6} textAnchor="middle" fontSize="18" fill="#5d7687">H</text>
   </g>;
  })}
  <text x="150" y="301" textAnchor="middle" fontSize="18" fontWeight="750">CH₂OH</text>
  <text x="150" y="324" textAnchor="middle" fontSize="10" fill="#6b9380">C2 → C5 configuration</text>
 </svg>;
}
function Haworth({profile,anomer}){
 const {positions}=profile;
 // Conventional D-pyranose OH placements: C2/3/4 Fischer right=down, left=up.
 const carbons=[
  {n:1,x:310,y:108,dir:anomer==='alpha'?'down':'up',label:'OH'},
  {n:2,x:283,y:172,dir:positions[0]==='R'?'down':'up',label:'OH'},
  {n:3,x:195,y:172,dir:positions[1]==='R'?'down':'up',label:'OH'},
  {n:4,x:145,y:110,dir:positions[2]==='R'?'down':'up',label:'OH'},
  {n:5,x:185,y:56,dir:'up',label:'CH₂OH'}
 ];
 return <svg viewBox="0 0 440 285" className="bm-sugar-svg" role="img" aria-label={anomer+'-'+profile.name+' pyranose Haworth projection with OH orientations'}>
   <path d="M257 57 L310 108 L283 172 L195 172 L145 110 L185 56 Z" fill="#ecf8f0" stroke="#397e64" strokeWidth="4" strokeLinejoin="round"/>
   <text x="254" y="64" fontSize="22" fontWeight="800" fill="#d25b61">O</text>
   {carbons.map(c=>{
    const dy=c.dir==='up'?-32:32;
    const lx=c.x+(c.n===4?-13:c.n===1?10:0);
    const endY=c.y+dy;
    const labelY=endY+(dy<0?-5:20);
    return <g key={c.n}>
     <circle cx={c.x} cy={c.y} r="4.5" fill="#21674f"/>
     <text x={c.x+(c.n===1?12:c.n===4?-21:9)} y={c.y-3} fontSize="12" fontWeight="750" fill="#21674f">C{c.n}</text>
     <path d={'M'+c.x+' '+c.y+' L'+lx+' '+endY} stroke="#4d9880" strokeWidth="2.7" fill="none"/>
     <text x={lx} y={labelY} textAnchor="middle" fontSize="17" fontWeight="750" fill={c.dir==='up'?'#235fa4':'#9a5d30'}>{c.label}</text>
    </g>;
   })}
   <text x="220" y="260" textAnchor="middle" fontSize="11" fill="#779389">Blue = up · brown = down · H at C1–C4 omitted</text>
 </svg>;
}
function SugarStereochemistry(){
 const [sugar,setSugar]=useState('glucose'),[anomer,setAnomer]=useState('alpha');
 const chosen=sugarProfiles[sugar];
 return <div className="bm-lab">
  <div className="bm-lab-top"><div><span className="aa-label">STEREOCHEMISTRY EXPLORER</span><h3>From Fischer to Haworth</h3>
   <p>Compare the OH positions of three D-aldohexoses and flip the anomeric C1 hydroxyl.</p></div>
   <div className="bm-controls"><label>Sugar<select value={sugar} onChange={e=>setSugar(e.target.value)}>{Object.entries(sugarProfiles).map(([k,v])=><option value={k} key={k}>{v.name}</option>)}</select></label>
   <label>C1 anomer<select value={anomer} onChange={e=>setAnomer(e.target.value)}><option value="alpha">α (down OH)</option><option value="beta">β (up OH)</option></select></label></div>
  </div>
  <div className="bm-figure-grid"><div className="bm-figure"><strong>Open chain · Fischer projection</strong><Fischer profile={chosen}/></div>
    <div className="bm-figure"><strong>{anomer==='alpha'?'α':'β'}-{chosen.name.slice(2)}pyranose · Haworth schematic</strong><Haworth profile={chosen} anomer={anomer}/></div></div>
  <div className="bm-insight"><strong>What changed?</strong><p>{chosen.epimer}. The {anomer==='alpha'?'alpha':'beta'} anomer has its C1 OH {anomer==='alpha'?'down (trans to C5 CH₂OH)':'up (cis to C5 CH₂OH)'}. D/L remains D in both cases.</p></div>
  <p className="bm-disclaimer">Teaching diagrams of D-aldohexose pyranoses, not measured conformers or equilibrium populations. The Fischer form and Haworth form are related by cyclization; OH orientation is schematic, with several hydrogen atoms omitted.</p>
 </div>;
}
const linkageExamples={
 maltose:{name:'Maltose',from:'D-glucose',to:'D-glucose',bond:'α(1→4)',start:'C1 α',end:'C4',reducing:true,details:'The second glucose retains a free anomeric carbon; the disaccharide has a reducing end. Maltase-type enzymes recognize this linkage.'},
 cellobiose:{name:'Cellobiose',from:'D-glucose',to:'D-glucose',bond:'β(1→4)',start:'C1 β',end:'C4',reducing:true,details:'The beta linkage is characteristic of cellulose fragments; human intestinal amylase does not hydrolyze beta(1→4) cellulose bonds.'},
 lactose:{name:'Lactose',from:'D-galactose',to:'D-glucose',bond:'β(1→4)',start:'C1 β',end:'C4',reducing:true,details:'The galactose C1 is connected to glucose C4; the glucose anomeric carbon remains free. Lactase cleaves this bond.'},
 sucrose:{name:'Sucrose',from:'D-glucose',to:'D-fructose',bond:'α(1→2)β',start:'Glc C1 α',end:'Fru C2 β',reducing:false,details:'Both anomeric centers are involved: glucose C1 and fructose C2. There is no free reducing end.'}
};
function SugarRing({cx,cy,label,kind='hex'}){
 const points=kind==='pent'?[[-34,-22],[34,-22],[44,22],[0,43],[-44,22]]:[[-45,-22],[3,-42],[50,-17],[42,29],[-8,42],[-49,17]];
 return <g><polygon points={points.map(([x,y])=>[cx+x,cy+y].join(',')).join(' ')} stroke="#3a8465" strokeWidth="3" fill="#e9f6ed"/>
  <text x={cx} y={cy+6} textAnchor="middle" fontSize="17" fontWeight="750" fill="#2c7955">{label}</text></g>;
}
function LinkageExplorer(){
 const [selected,setSelected]=useState('maltose');const d=linkageExamples[selected];
 return <div className="bm-lab">
  <span className="aa-label">GLYCOSIDIC BOND EXPLORER</span><h3>One bond, different biological consequences</h3>
  <div className="bm-choice-row">{Object.entries(linkageExamples).map(([k,x])=><button key={k} className={selected===k?'active':''} onClick={()=>setSelected(k)} aria-pressed={selected===k}>{x.name}</button>)}</div>
  <div className="bm-figure"><svg viewBox="0 0 600 225" className="bm-wide-svg" role="img" aria-label={d.name+' schematic '+d.bond+' linkage from '+d.from+' to '+d.to}>
   <SugarRing cx={147} cy={113} label={d.from==='D-galactose'?'Gal':'Glc'}/>
   <SugarRing cx={447} cy={113} kind={selected==='sucrose'?'pent':'hex'} label={selected==='sucrose'?'Fru':'Glc'}/>
   <path d="M198 113 L396 113" stroke="#b17d41" strokeWidth="5" strokeLinecap="round"/>
   <rect x="240" y="89" width="119" height="45" rx="9" fill="#fff9e8" stroke="#e6c88b"/>
   <text x="300" y="116" textAnchor="middle" fontSize="19" fontWeight="800" fill="#92602f">{d.bond}</text>
   <text x="147" y="183" textAnchor="middle" fontSize="12" fill="#648779">{d.start} donor</text>
   <text x="447" y="183" textAnchor="middle" fontSize="12" fill="#648779">{d.end} acceptor</text>
  </svg><span className="bm-figure-caption">Simplified ring connectivity: the bridge denotes an O-glycosidic bond, not a geometric atomic structure.</span></div>
  <div className="bm-result-grid"><div><small>GLYCOSIDIC LINKAGE</small><strong>{d.bond}</strong></div><div><small>REDUCING END?</small><strong>{d.reducing?'Yes':'No'}</strong></div></div>
  <p className="bm-insight">{d.details}</p>
 </div>;
}
const polymers={
 amylose:{name:'Amylose',branches:0,linkage:'α(1→4)',role:'Energy storage (starch component)',explain:'A mostly unbranched alpha(1→4) glucose chain that can adopt a helical tendency.'},
 amylopectin:{name:'Amylopectin',branches:2,linkage:'α(1→4) and α(1→6)',role:'Energy storage (starch component)',explain:'An alpha(1→4) backbone with alpha(1→6) branches, facilitating access to multiple nonreducing ends.'},
 glycogen:{name:'Glycogen',branches:3,linkage:'α(1→4) and α(1→6)',role:'Energy storage in animals and many microbes',explain:'A frequently branched alpha-glucan with abundant nonreducing termini for enzyme access.'},
 cellulose:{name:'Cellulose',branches:0,linkage:'β(1→4)',role:'Structural support in plant cell walls',explain:'Extended beta(1→4) chains can hydrogen-bond into strong fibers; mammalian amylase cannot cleave these bonds.'}
};
function PolymerExplorer(){
 const [which,setWhich]=useState('glycogen');const p=polymers[which];
 const points=Array.from({length:8},(_,i)=>({x:62+i*73,y:144}));
 const extra=p.branches===0?[]:[{index:2,n:3},{index:4,n:2},{index:6,n:3}].slice(0,p.branches);
 return <div className="bm-lab"><span className="aa-label">POLYSACCHARIDE STRUCTURE EXPLORER</span><h3>Linear chains versus branches</h3>
  <div className="bm-choice-row">{Object.entries(polymers).map(([k,x])=><button key={k} className={which===k?'active':''} onClick={()=>setWhich(k)} aria-pressed={which===k}>{x.name}</button>)}</div>
  <div className="bm-figure"><svg viewBox="0 0 665 272" className="bm-wide-svg" role="img" aria-label={'Illustrative '+p.name+' glucose polymer with '+p.branches+' shown branch points'}>
   {points.slice(0,-1).map((v,i)=><path key={'ln'+i} d={'M'+(v.x+18)+' '+v.y+' L'+(points[i+1].x-18)+' '+points[i+1].y} stroke={which==='cellulose'?'#4578b4':'#c18b50'} strokeWidth="3.5"/>)}
   {extra.map(b=><g key={b.index}>
    <path d={'M'+points[b.index].x+' 125 L'+points[b.index].x+' 74 L'+(points[b.index].x+33)+' 45'} fill="none" stroke="#ca875e" strokeWidth="3.5"/>
    <circle cx={points[b.index].x} cy="74" r="14" fill="#fdf0df" stroke="#d29a66" strokeWidth="2"/>
    <circle cx={points[b.index].x+33} cy="45" r="14" fill="#fdf0df" stroke="#d29a66" strokeWidth="2"/>
    <text x={points[b.index].x+42} y="23" fontSize="10" fill="#9d6d3b">nonreducing end</text>
    </g>)}
   {points.map((v,i)=><g key={i}><circle cx={v.x} cy={v.y} r="19" stroke="#42856c" strokeWidth="2.5" fill={which==='cellulose'&&i%2?'#dceafa':'#e4f5e9'}/>
      <text x={v.x} y={v.y+5} textAnchor="middle" fontWeight="750" fontSize="11" fill="#21644b">Glc</text></g>)}
   <text x="62" y="188" textAnchor="middle" fontSize="12" fill="#648978">nonreducing end</text>
   <text x="574" y="188" textAnchor="middle" fontSize="12" fill="#648978">reducing end</text>
   <text x="320" y="240" textAnchor="middle" fontWeight="700" fontSize="14" fill="#557d6a">Backbone {which==='cellulose'?'β':'α'}(1→4) · {extra.length?'branches α(1→6)':'no branch in this schematic'}</text>
  </svg></div>
  <div className="bm-result-grid"><div><small>LINKAGES</small><strong>{p.linkage}</strong></div><div><small>MAIN ROLE</small><strong>{p.role}</strong></div></div>
  <p className="bm-insight">{p.explain}</p>
  <p className="bm-disclaimer">Eight-residue conceptual backbone; branch count/placement and glucose conformations are illustrative, not a quantitative statement about natural polymer size or branch frequency.</p>
 </div>;
}
const conjugates={
 glycoprotein:{label:'N-linked glycoprotein',anchor:'Asn side-chain N',desc:'A branched N-glycan attaches to Asn and can affect folding, recognition and trafficking.',kind:'protein'},
 olinked:{label:'O-linked glycoprotein',anchor:'Ser/Thr hydroxyl O',desc:'An O-glycan attaches to an amino-acid hydroxyl. Mucin-type O-glycans commonly decorate extracellular mucins.',kind:'protein'},
 proteoglycan:{label:'Proteoglycan',anchor:'Core protein + GAG chains',desc:'Long, often negatively charged GAG chains attract water and participate in extracellular-matrix organization.',kind:'proteoglycan'},
 glycolipid:{label:'Glycolipid',anchor:'Glycan + membrane lipid',desc:'A lipid anchor sits in a membrane leaflet while the glycan projects into the extracellular aqueous space.',kind:'lipid'}
};
function GlycoconjugateExplorer(){
 const [kind,setKind]=useState('glycoprotein');const d=conjugates[kind];
 const isLipid=d.kind==='lipid',isGag=d.kind==='proteoglycan';
 return <div className="bm-lab"><span className="aa-label">GLYCOCONJUGATE EXPLORER</span><h3>Where is the glycan attached?</h3>
  <div className="bm-choice-row">{Object.entries(conjugates).map(([k,v])=><button key={k} className={kind===k?'active':''} onClick={()=>setKind(k)} aria-pressed={kind===k}>{v.label}</button>)}</div>
  <div className="bm-figure"><svg viewBox="0 0 620 290" className="bm-wide-svg" role="img" aria-label={d.label+' schematic with attachment and glycan'}>
   {isLipid&&<g>{[0,1].map((n)=><g key={n}>
      <rect x="95" y={218+n*31} width="440" height="14" rx="7" fill="#b1d2be" opacity=".9"/></g>)}
      <path d="M298 220 L285 258 M310 220 L327 258" stroke="#b77c4d" strokeWidth="7" strokeLinecap="round"/>
      <circle cx="303" cy="212" r="16" fill="#5b9c80"/>
    </g>}
   {!isLipid&&<rect x={isGag?190:210} y="202" width={isGag?280:235} height="50" rx="23" fill="#d2e8fa" stroke="#5e89b3" strokeWidth="2"/>}
   {!isLipid&&<text x="325" y="232" textAnchor="middle" fontSize="17" fill="#285d87" fontWeight="700">{isGag?'core protein':'protein'}</text>}
   {Array.from({length:isGag?3:1},(_,i)=>{const x=isGag?220+i*100:320;
    const top=isGag?40:72;
    return <g key={i}>
     <path d={'M'+x+' 200 L'+x+' '+top} stroke="#b88648" strokeWidth="4" fill="none"/>
     {Array.from({length:isGag?6:3},(_,j)=><g key={j}>
      <rect x={x-10} y={top+10+j*(isGag?18:34)} width="20" height="13" rx="4" fill={j%2?'#e9b77c':'#80bda0'} stroke="#5a8b70"/>
     </g>)}
     {!isGag&&<g><path d={'M'+x+' 95 L'+(x-50)+' 48 M'+x+' 110 L'+(x+50)+' 50'} stroke="#bc8b57" strokeWidth="3"/>
       <circle cx={x-50} cy="44" r="13" fill="#e9b77c"/><circle cx={x+50} cy="44" r="13" fill="#84c4aa"/></g>}
    </g>;
   })}
   <text x="325" y="282" textAnchor="middle" fill="#5c7d6d" fontSize="12">{d.anchor}</text>
  </svg><span className="bm-figure-caption">Topology schematic only: symbols do not specify glycan monosaccharide composition or exact linkage chemistry.</span></div>
  <div className="bm-insight"><strong>{d.label}</strong><p>{d.desc}</p></div>
 </div>;
}
const acids={
 palmitate:{label:'Palmitate',short:'16:0',carbon:16,double:0,cis:true,desc:'Saturated 16-carbon fatty acid, often relatively straight and able to pack closely.'},
 stearate:{label:'Stearate',short:'18:0',carbon:18,double:0,cis:true,desc:'Saturated 18-carbon fatty acid; longer saturated chains generally strengthen dispersion interactions.'},
 oleate:{label:'Oleate',short:'18:1 cis',carbon:18,double:1,cis:true,desc:'One cis double bond introduces a bend and impedes tight packing relative to 18:0.'},
 elaidate:{label:'Elaidate',short:'18:1 trans',carbon:18,double:1,cis:false,desc:'A trans double bond produces a straighter chain than the corresponding cis isomer.'},
 linoleate:{label:'Linoleate',short:'18:2 cis,cis',carbon:18,double:2,cis:true,desc:'Two cis double bonds typically disrupt packing further; the molecule remains amphipathic through its carboxyl head.'}
};
const lipidClasses={
 tag:{label:'Triacylglycerol',head:'Glycerol + three fatty acyl esters',note:'Hydrophobic neutral-lipid energy storage; not an amphipathic bilayer-forming phospholipid.'},
 phospholipid:{label:'Glycerophospholipid',head:'Polar phosphate-containing head + two acyl tails',note:'Amphipathic; a major component of many biological membranes.'},
 sphingolipid:{label:'Sphingolipid',head:'Sphingoid backbone + amide-linked acyl chain + headgroup',note:'Sphingolipids include sphingomyelin and glycosphingolipids; chemistry depends on headgroup.'},
 sterol:{label:'Cholesterol (sterol)',head:'Rigid fused rings + small hydroxyl group',note:'Amphipathic sterol that tunes packing and mechanical behavior in many animal membranes.'}
};
function AcidChain({acid}){
 const n=acid.carbon;const count=Math.min(17,n-1),points=[[35,123]];
 for(let i=1;i<=count;i++){
  let y=123+(i%2?19:-3);
  if(acid.double>0&&acid.cis){
   if(i>7)y+=acid.double>1?(i>12?-27:-50):-45;
  }
  points.push([35+i*26,y]);
 }
 const k=acid.double?8:0;
 return <svg viewBox="0 0 540 214" className="bm-wide-svg" role="img" aria-label={acid.label+' '+acid.short+' schematic tail shape'}>
  <text x="20" y="85" fontSize="13" fontWeight="700" fill="#427a68">COOH / COO⁻</text>
  <path d={'M'+points.map(p=>p.join(' ')).join(' L')} stroke="#638c79" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  {acid.double>0&&Array.from({length:acid.double},(_,j)=>{
   const i=k+j*4;const a=points[i],b=points[i+1];if(!b)return null;
   return <g key={j}><path d={'M'+a[0]+' '+(a[1]-7)+' L'+b[0]+' '+(b[1]-7)} stroke="#b57d51" strokeWidth="3" strokeLinecap="round"/>
     <text x={(a[0]+b[0])/2} y={Math.min(a[1],b[1])-15} fontSize="12" fontWeight="750" fill="#926139">C=C</text></g>;
  })}
  <text x="270" y="190" textAnchor="middle" fill="#779387" fontSize="12">Schematic: chain bends indicate cis versus trans geometry; not an atom-complete structure</text>
 </svg>;
}
function FattyAcidExplorer(){
 const [acid,setAcid]=useState('oleate'),[kind,setKind]=useState('phospholipid');const a=acids[acid],l=lipidClasses[kind];
 return <div className="bm-lab">
  <span className="aa-label">LIPID STRUCTURE EXPLORER</span><h3>Compare hydrocarbon chains</h3>
  <div className="bm-controls"><label>Fatty acid<select value={acid} onChange={e=>setAcid(e.target.value)}>{Object.entries(acids).map(([k,v])=><option key={k} value={k}>{v.label} ({v.short})</option>)}</select></label>
   <label>Lipid class<select value={kind} onChange={e=>setKind(e.target.value)}>{Object.entries(lipidClasses).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}</select></label></div>
  <div className="bm-figure"><AcidChain acid={a}/></div>
  <div className="bm-result-grid"><div><small>CHAIN NOTATION</small><strong>{a.short}</strong></div><div><small>C=C DOUBLE BONDS</small><strong>{a.double}</strong></div></div>
  <p className="bm-insight">{a.desc}</p>
  <div className="bm-insight"><strong>{l.label}</strong><p><b>{l.head}.</b> {l.note}</p></div>
  <p className="bm-disclaimer">The chain diagram conveys geometry, not absolute melting points or an atom-complete representation; actual lipid packing depends on temperature, chain mixtures, headgroups and other components.</p>
 </div>;
}
function MembranePackingExplorer(){
 const [unsaturation,setUnsaturation]=useState(50),[temperature,setTemperature]=useState('moderate');
 const bent=Math.round(unsaturation/100*11);
 const explanation=unsaturation>65?'A large fraction of cis-unsaturated tails tends to hinder tight packing.':unsaturation<35?'More saturated chains can adopt relatively straighter, closely packed conformations.':'The mixture illustrates an intermediate distribution of straight and bent tails.';
 return <div className="bm-lab"><span className="aa-label">MEMBRANE PACKING EXPLORER</span><h3>Why do lipid tails matter?</h3>
  <div className="bm-controls"><label>Cis-unsaturated tails: <b>{unsaturation}%</b><input type="range" min="0" max="100" step="10" value={unsaturation} onChange={e=>setUnsaturation(Number(e.target.value))}/></label>
   <label>Temperature<select value={temperature} onChange={e=>setTemperature(e.target.value)}><option value="cool">Cool</option><option value="moderate">Moderate</option><option value="warm">Warm</option></select></label></div>
  <div className="bm-figure"><svg viewBox="0 0 650 255" className="bm-wide-svg" role="img" aria-label={'Membrane packing schematic with '+unsaturation+' percent unsaturated tails at '+temperature+' temperature'}>
   <rect x="24" y="25" width="602" height="203" rx="12" fill="#f6faf7"/>
   <rect x="25" y="94" width="600" height="65" rx="6" fill="#e8f2ed"/>
   {Array.from({length:11},(_,i)=>{
    const x=52+i*54;const kinky=i<bent;const offset=kinky?(i%2?18:-17):0;
    const headColor=kinky?'#56a28b':'#739bb7';
    return <g key={i}>
     <circle cx={x} cy="62" r="12" fill={headColor}/><circle cx={x} cy="192" r="12" fill={headColor}/>
     <path d={kinky?'M'+x+' 75 L'+x+' 107 L'+(x+offset)+' 117 L'+(x+offset)+' 123':'M'+x+' 75 L'+x+' 123'} stroke="#b8916c" strokeWidth="5" strokeLinecap="round" fill="none"/>
     <path d={kinky?'M'+x+' 180 L'+x+' 153 L'+(x+offset)+' 144 L'+(x+offset)+' 137':'M'+x+' 180 L'+x+' 137'} stroke="#b8916c" strokeWidth="5" strokeLinecap="round" fill="none"/>
    </g>;
   })}
   <text x="325" y="19" textAnchor="middle" fontSize="13" fill="#587b6c">Extracellular aqueous space</text>
   <text x="325" y="247" textAnchor="middle" fontSize="13" fill="#587b6c">Cytosolic aqueous space</text>
  </svg><span className="bm-figure-caption">Cartoon of phospholipid packing; colored heads and tail bends represent composition, not a molecular dynamics simulation.</span></div>
  <div className="bm-insight"><strong>Qualitative interpretation</strong><p>{explanation} {temperature==='cool'?'At lower temperatures, reduced molecular motion favors ordering; cis bends can oppose dense packing.':temperature==='warm'?'At higher temperatures, greater thermal motion tends to increase disorder.':'At an intermediate temperature, lipid composition still strongly influences packing and dynamics.'}</p></div>
  <p className="bm-disclaimer">No numerical fluidity or transition temperature is calculated. Cholesterol, headgroups, hydration and specific lipid mixtures also matter.</p>
 </div>;
}
function TransportExplorer(){
 const [outside,setOutside]=useState(20),[inside,setInside]=useState(5),[type,setType]=useState('passive');
 const equal=outside===inside,fromOutside=outside>inside;
 const passiveDirection=equal?'No concentration-driven net direction':fromOutside?'Outside → inside':'Inside → outside';
 const uphill=equal?'No uphill concentration direction':fromOutside?'Inside → outside':'Outside → inside';
 const direction=type==='passive'?passiveDirection:uphill;
 const arrow=equal?'—':(type==='passive'?fromOutside:!fromOutside)?'→':'←';
 return <div className="bm-lab"><span className="aa-label">TRANSPORT GRADIENT EXPLORER</span><h3>Which way is transport favored?</h3>
  <p className="bm-interactive-intro">Model a hypothetical uncharged solute X. For ions, membrane voltage would also matter.</p>
  <div className="bm-controls"><label>Outside concentration: <b>{outside} mM</b><input type="range" min="0" max="30" step="1" value={outside} onChange={e=>setOutside(Number(e.target.value))}/></label>
   <label>Inside concentration: <b>{inside} mM</b><input type="range" min="0" max="30" step="1" value={inside} onChange={e=>setInside(Number(e.target.value))}/></label></div>
  <div className="bm-choice-row"><button className={type==='passive'?'active':''} onClick={()=>setType('passive')} aria-pressed={type==='passive'}>Passive transport</button><button className={type==='active'?'active':''} onClick={()=>setType('active')} aria-pressed={type==='active'}>Energy-coupled uphill transport</button></div>
  <div className="bm-figure"><svg viewBox="0 0 640 280" className="bm-wide-svg" role="img" aria-label={'Outside '+outside+' millimolar, inside '+inside+' millimolar. '+direction}>
   <rect x="250" y="27" width="140" height="215" rx="12" fill="#ebf1eb"/>
   {Array.from({length:6},(_,i)=><g key={i}><circle cx={268+i*20} cy="62" r="10" fill="#6fa68a"/><circle cx={268+i*20} cy="204" r="10" fill="#6fa68a"/><path d={'M'+(268+i*20)+' 74 L'+(268+i*20)+' 192'} stroke="#c9b090" strokeWidth="6" opacity=".6"/></g>)}
   <rect x="301" y="65" width="38" height="130" rx="15" fill="#5f9db7" stroke="#417a9a" strokeWidth="2"/>
   <text x="111" y="55" textAnchor="middle" fill="#316a54" fontSize="17" fontWeight="750">Outside</text><text x="526" y="55" textAnchor="middle" fill="#316a54" fontSize="17" fontWeight="750">Inside</text>
   <text x="111" y="90" textAnchor="middle" fontSize="21" fontWeight="800" fill="#477a60">{outside} mM</text><text x="526" y="90" textAnchor="middle" fontSize="21" fontWeight="800" fill="#477a60">{inside} mM</text>
   <text x="320" y="149" textAnchor="middle" fontSize="23" fontWeight="800" fill="white">X</text>
   <text x="320" y="263" textAnchor="middle" fontSize="27" fontWeight="800" fill={type==='active'?'#9b6d34':'#287753'}>{arrow}</text>
   {type==='active'&&<text x="320" y="23" textAnchor="middle" fontSize="13" fontWeight="800" fill="#b17a3b">Energy coupling required (conceptual)</text>}
  </svg><span className="bm-figure-caption">Arrow shows the favored net concentration-driven direction (passive) or the uphill direction that energy coupling could support.</span></div>
  <div className="bm-result-grid"><div><small>{type==='passive'?'FAVORED NET DIRECTION':'UPHILL TARGET DIRECTION'}</small><strong>{direction}</strong></div><div><small>CONCENTRATION DIFFERENCE</small><strong>{Math.abs(outside-inside)} mM</strong></div></div>
  <div className="bm-insight">{equal?'When concentrations match, there is no net concentration-driven passive flux (though individual molecules continue to move).':type==='passive'?'Passive net movement follows the higher-to-lower concentration gradient; a compatible channel or carrier may facilitate flux, but does not directly force uphill transport.':'Moving X from the lower to the higher concentration requires an energy source, such as ATP or a coupled ion gradient. This is a hypothetical transporter; the diagram does not represent a particular pump.'}</div>
 </div>;
}
const membraneProteinTypes={
 single:{label:'Single-pass integral',kind:'single',desc:'A single membrane-spanning segment connects an extracellular/lumenal domain to a cytosolic domain.'},
 multi:{label:'Multipass integral',kind:'multi',desc:'Several transmembrane segments cross the hydrophobic core; many transporters and receptors use this topology.'},
 peripheral:{label:'Peripheral protein',kind:'peripheral',desc:'The protein sits at one surface through noncovalent contacts without spanning the hydrophobic core.'},
 anchored:{label:'Lipid-anchored protein',kind:'anchored',desc:'A covalently linked lipid embeds in one leaflet, tethering the protein to the membrane surface.'}
};
function MembraneProteinExplorer(){
 const [which,setWhich]=useState('single');const p=membraneProteinTypes[which];
 return <div className="bm-lab"><span className="aa-label">MEMBRANE PROTEIN TOPOLOGY</span><h3>How does a protein associate with a bilayer?</h3>
  <div className="bm-choice-row">{Object.entries(membraneProteinTypes).map(([k,x])=><button key={k} className={which===k?'active':''} onClick={()=>setWhich(k)} aria-pressed={which===k}>{x.label}</button>)}</div>
  <div className="bm-figure"><svg viewBox="0 0 620 330" className="bm-wide-svg" role="img" aria-label={p.label+' structural topology diagram'}>
   <rect x="35" y="122" width="550" height="121" rx="10" fill="#f2ece2"/>
   {[0,1].map((n)=>Array.from({length:13},(_,i)=><g key={n+'-'+i}><circle cx={60+i*42} cy={n===0?137:226} r="12" fill="#7daf9a"/><path d={'M'+(60+i*42)+' '+(n===0?150:214)+' L'+(60+i*42)+' '+(n===0?204:160)} stroke="#d5b48d" strokeWidth="6" opacity=".68"/></g>))}
   <text x="310" y="37" textAnchor="middle" fill="#4d7766" fontSize="16" fontWeight="750">Extracellular / lumenal side</text>
   <text x="310" y="313" textAnchor="middle" fill="#4d7766" fontSize="16" fontWeight="750">Cytosolic side</text>
   {p.kind==='single'&&<g><path d="M300 70 C275 88 330 105 307 130 L307 245 C320 268 283 285 300 296" fill="none" stroke="#417cb2" strokeWidth="23" strokeLinecap="round"/>
     <ellipse cx="300" cy="77" rx="58" ry="25" fill="#bedbf3" stroke="#407cae" strokeWidth="3"/></g>}
   {p.kind==='multi'&&<g><path d="M190 73 L190 262 Q230 293 247 242 L247 128 Q280 81 307 128 L307 242 Q340 285 365 242 L365 128 Q397 85 431 75" fill="none" stroke="#447eae" strokeWidth="21" strokeLinecap="round" strokeLinejoin="round"/></g>}
   {p.kind==='peripheral'&&<g><ellipse cx="302" cy="85" rx="93" ry="34" fill="#bedbf3" stroke="#407cae" strokeWidth="3"/>
     <path d="M273 116 Q289 134 307 116 Q319 135 333 117" stroke="#407cae" strokeWidth="3" fill="none"/></g>}
   {p.kind==='anchored'&&<g><ellipse cx="300" cy="79" rx="88" ry="36" fill="#bedbf3" stroke="#407cae" strokeWidth="3"/>
     <path d="M300 115 L300 163 L321 199" stroke="#b67e42" strokeWidth="7" fill="none" strokeLinecap="round"/>
     <path d="M300 163 L282 199" stroke="#b67e42" strokeWidth="7" fill="none" strokeLinecap="round"/></g>}
  </svg><span className="bm-figure-caption">Membrane topology schematic: not an atomic protein structure, and no unique fold is implied.</span></div>
  <div className="bm-insight"><strong>{p.label}</strong><p>{p.desc}</p></div>
 </div>;
}

export default function BiomoleculeInteractive({chapter,topicId}){
 if(chapter===7){
  if(topicId==='monosaccharides-and-stereochemistry')return <SugarStereochemistry/>;
  if(topicId==='glycosidic-linkages')return <LinkageExplorer/>;
  if(topicId==='polysaccharides')return <PolymerExplorer/>;
  if(topicId==='glycoconjugates')return <GlycoconjugateExplorer/>;
 }
 if(chapter===8){
  if(topicId==='fatty-acids-and-lipid-classes')return <FattyAcidExplorer/>;
  if(topicId==='membrane-organization')return <MembranePackingExplorer/>;
  if(topicId==='membrane-transport')return <TransportExplorer/>;
  if(topicId==='membrane-proteins')return <MembraneProteinExplorer/>;
 }
 return null;
}
