import React,{useState} from 'react';
import MoleculeViewer from './MoleculeViewer.jsx';
import {aminoAcids,aminoByLetter} from './aminoData.js';

const sideChainPolarity={
 nonpolar:'Mostly nonpolar',polar:'Polar, uncharged',
 negative:'Polar, usually negative',positive:'Basic / polar',
 aromatic:'Aromatic (polarity varies)',special:'Distinctive chemistry'
};
const chargeNearSeven=one=>{
 if(['D','E'].includes(one))return 'Typically −1';
 if(['K','R'].includes(one))return 'Typically +1';
 if(one==='H')return 'Mostly 0; partly +1';
 return 'Typically ~0';
};
const polarityOf=one=>{
 if(one==='G')return 'Small, weakly hydrophobic';
 if(one==='P')return 'Mostly nonpolar cyclic';
 if(one==='C')return 'Polar thiol';
 if(one==='Y')return 'Polar aromatic';
 if(one==='W')return 'Amphipathic aromatic';
 if(one==='F')return 'Nonpolar aromatic';
 return sideChainPolarity[aminoByLetter[one].category];
};
function PickAmino({label,value,onChange,id}){
 return <label className="aa-compare-select" htmlFor={id}>{label}
  <select id={id} value={value} onChange={e=>onChange(e.target.value)}>
   {aminoAcids.map(aa=><option key={aa.one} value={aa.one}>{aa.name} ({aa.three}, {aa.one})</option>)}
  </select>
 </label>;
}

/**
 * Two independent molecular canvases sharing one mode toggle. These are
 * built from the same data and viewer as Topic 4.1, avoiding duplicate tools.
 */
export default function SideBySideCompare(){
 const [first,setFirst]=useState('A');
 const [second,setSecond]=useState('K');
 const [mode,setMode]=useState('2d');
 const left=aminoByLetter[first],right=aminoByLetter[second];
 return <section className="aa-compare">
  <div className="aa-compare-header">
   <div><span className="aa-label">AMINO ACID COMPARISON</span>
    <h3>Compare two amino acids</h3>
    <p>Choose any two standard amino acids and inspect their 2D connectivity or 3D conformations side by side.</p>
   </div>
   <div className="aa-view-toggle" role="group" aria-label="Comparison molecule view">
    <button className={mode==='2d'?'active':''} aria-pressed={mode==='2d'} onClick={()=>setMode('2d')}>2D both</button>
    <button className={mode==='3d'?'active':''} aria-pressed={mode==='3d'} onClick={()=>setMode('3d')}>3D both</button>
   </div>
  </div>
  <div className="aa-compare-pickers">
   <PickAmino label="Amino acid A" id="aa-compare-first" value={first} onChange={setFirst}/>
   <button className="aa-compare-swap" onClick={()=>{setFirst(second);setSecond(first);}} aria-label="Swap the two amino acids">⇄ Swap</button>
   <PickAmino label="Amino acid B" id="aa-compare-second" value={second} onChange={setSecond}/>
  </div>
  <div className="aa-compare-grid">
   <MoleculeViewer one={first} viewMode={mode} compact hideViewToggle/>
   <MoleculeViewer one={second} viewMode={mode} compact hideViewToggle/>
  </div>
  <div className="aa-comparison-table-wrap">
   <table className="aa-comparison-table">
    <thead><tr><th scope="col">Feature</th><th scope="col">{left.name} ({left.three})</th><th scope="col">{right.name} ({right.three})</th></tr></thead>
    <tbody>
     <tr><th scope="row">Side chain</th><td>{left.sidechain}</td><td>{right.sidechain}</td></tr>
     <tr><th scope="row">Teaching category</th><td>{left.category==='special'?'Special chemistry':sideChainPolarity[left.category]}</td><td>{right.category==='special'?'Special chemistry':sideChainPolarity[right.category]}</td></tr>
     <tr><th scope="row">Polarity</th><td>{polarityOf(first)}</td><td>{polarityOf(second)}</td></tr>
     <tr><th scope="row">Typical side-chain charge near pH 7</th><td>{chargeNearSeven(first)}</td><td>{chargeNearSeven(second)}</td></tr>
     <tr><th scope="row">Characteristic</th><td>{left.property}</td><td>{right.property}</td></tr>
    </tbody>
   </table>
  </div>
  <p className="aa-scope">Charge labels refer to side chains, not the whole free amino acid. They are approximate and can change with pH and local environment. 3D structures are illustrative computational conformers, not experimental measurements.</p>
 </section>;
}
