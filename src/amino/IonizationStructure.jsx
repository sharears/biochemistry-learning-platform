import React,{useState} from 'react';
import MoleculeViewer from './MoleculeViewer.jsx';
import {aminoByLetter} from './aminoData.js';
import {chargeBreakdown,protonationAtomLabels,displayCharge} from './protonation.js';

/**
 * Embedded directly inside Topic 4.3's pH experiment.
 * The bond diagram is the existing amino acid viewer with titratable atoms
 * labelled according to the predominant free-amino-acid microstate.
 */
export default function IonizationStructure({one,ph}){
 const [view,setView]=useState('2d');
 const amino=aminoByLetter[one];
 const state=chargeBreakdown(one,ph);
 const labels=protonationAtomLabels(one,ph);
 const mixed=state.groups.filter(g=>g.protonatedFraction>.1&&g.protonatedFraction<.9);
 return <section className="aa-ionization-structure" aria-label="pH responsive amino acid structure">
  <div className="aa-structure-head">
   <div><span className="aa-label">LIVE MOLECULAR STRUCTURE</span><h3>Which groups are protonated at pH {ph.toFixed(1)}?</h3>
    <p>Highlighted atoms show explicit H counts and formal charges for the predominant form of each ionizable group.</p></div>
   <div className="aa-view-toggle" role="group" aria-label="pH responsive molecular view">
    <button className={view==='2d'?'active':''} onClick={()=>setView('2d')} aria-pressed={view==='2d'}>2D</button>
    <button className={view==='3d'?'active':''} onClick={()=>setView('3d')} aria-pressed={view==='3d'}>3D</button>
   </div>
  </div>
  <div className="aa-structure-status"><div><span>Predominant form of {amino.name}</span>
    <strong>{state.dominantCharge>0?'+':''}{state.dominantCharge} formal charge</strong></div>
    <div><span>Population-weighted mean charge</span><strong>{displayCharge(state.meanCharge,2)}</strong></div></div>
  <MoleculeViewer one={one} viewMode={view} hideViewToggle compact protonationLabels={labels}/>
  <div className="aa-group-state-list">
   {state.groups.map(group=><div className="aa-group-state" key={group.id}>
    <div><strong>{group.name}</strong><span>pKa {group.pKa.toFixed(2)} · predominantly <b>{group.dominantLabel}</b></span></div>
    <div className="aa-state-fractions"><span>{(100*group.protonatedFraction).toFixed(1)}% protonated</span>
      <span>{(100*group.deprotonatedFraction).toFixed(1)}% deprotonated</span></div>
   </div>)}
  </div>
  {mixed.length>0&&<p className="aa-population-note" role="note">
   <strong>Both forms matter here:</strong> {mixed.map(g=>g.name).join(', ')} {mixed.length===1?'has':'have'} substantial populations in both protonation states. The drawing shows a representative predominant microstate, not every molecule.
  </p>}
  <p className="aa-scope">This is an independent-site illustration for free amino acids. Ionizable groups in actual proteins may have shifted pKa values. Histidine and arginine are depicted using one representative ring tautomer or resonance form. The 3D geometry does not re-minimize when the protonation state changes.</p>
 </section>;
}
