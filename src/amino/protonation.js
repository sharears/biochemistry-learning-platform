/**
 * pH-responsive ionization chemistry for free alpha amino acids.
 *
 * The independent-site Henderson–Hasselbalch model already drives netCharge
 * in aminoData.js; this module exposes its per-site contributions and the
 * most probable protonation state for the SAME model. Do not mistake the
 * displayed predominant microstate for a whole-molecule average charge.
 */
import {ionizationExamples,baseFraction,acidFraction,netCharge} from './aminoData.js';

/**
 * Heavy-atom indices from the existing moleculeGraphs.js, verified by tests.
 * Carboxyl and acidic-side-chain indices identify single-bonded O atoms.
 */
export const TITRATABLE_ATOM_INDICES={
 G:{amino:0,carboxyl:4},
 A:{amino:2,carboxyl:5},
 D:{amino:5,carboxyl:8,side:0},
 E:{amino:6,carboxyl:9,side:0},
 K:{amino:6,carboxyl:9,side:0},
 R:{amino:8,carboxyl:11,side:2},
 H:{amino:7,carboxyl:10,side:1},
 C:{amino:3,carboxyl:6,side:0},
 Y:{amino:7,carboxyl:10,side:0}
};

/** Explicit labels are at the actual titratable atoms in the 2D/3D graph.
 * For carboxylates, the OH/O− is attached to the carboxyl carbon, whose
 * carbonyl oxygen is already drawn separately in the atom-bond diagram.
 * Histidine and arginine representations depict one valid resonance/tautomer.
 */
const SIDE_STATES={
 D:{name:'Asp carboxyl',protonated:'OH',deprotonated:'O⁻'},
 E:{name:'Glu carboxyl',protonated:'OH',deprotonated:'O⁻'},
 K:{name:'Lys ammonium',protonated:'NH₃⁺',deprotonated:'NH₂'},
 R:{name:'Arg guanidinium',protonated:'NH₂⁺',deprotonated:'NH'},
 H:{name:'His imidazole',protonated:'NH⁺',deprotonated:'N'},
 C:{name:'Cys thiol',protonated:'SH',deprotonated:'S⁻'},
 Y:{name:'Tyr phenol',protonated:'OH',deprotonated:'O⁻'}
};

export function chargeBreakdown(one,ph){
 const p=ionizationExamples[one];
 if(!p)throw new Error('No ionization model for '+one);
 const sites=[
  {id:'amino',name:'α-amino group',type:'base',pKa:p.amino,protonated:'NH₃⁺',deprotonated:'NH₂'},
  {id:'carboxyl',name:'α-carboxyl group',type:'acid',pKa:p.carboxyl,protonated:'COOH',deprotonated:'COO⁻'}
 ];
 if(p.side)sites.push({
  id:'side',name:SIDE_STATES[one]?.name||'Ionizable side chain',
  type:p.side.type,pKa:p.side.pKa,
  protonated:SIDE_STATES[one]?.protonated||'Protonated',
  deprotonated:SIDE_STATES[one]?.deprotonated||'Deprotonated'
 });
 const groups=sites.map(site=>{
  const protonatedFraction=baseFraction(ph,site.pKa);
  const deprotonatedFraction=acidFraction(ph,site.pKa);
  const contribution=site.type==='base'?protonatedFraction:-deprotonatedFraction;
  // At exact pKa, both forms are equally populated; choose protonated for
  // the representative illustration while explicitly showing the 50/50 split.
  const predominantlyProtonated=protonatedFraction>=.5;
  return {
   ...site,protonatedFraction,deprotonatedFraction,contribution,
   predominantlyProtonated,dominantLabel:predominantlyProtonated?site.protonated:site.deprotonated
  };
 });
 const meanCharge=groups.reduce((sum,site)=>sum+site.contribution,0);
 const dominantCharge=groups.reduce((sum,site)=>sum+(site.type==='base'?(site.predominantlyProtonated?1:0):(site.predominantlyProtonated?0:-1)),0);
 return {
  ph,groups,meanCharge,dominantCharge,
  modelCharge:netCharge(one,ph),
  nearTransition:groups.some(site=>Math.abs(site.protonatedFraction-.5)<.15)
 };
}

/** Per-atom overlay labels for the existing 2D / rotatable 3D viewer. */
export function protonationAtomLabels(one,ph){
 const mapping=TITRATABLE_ATOM_INDICES[one];
 if(!mapping)return {};
 const result={};
 for(const group of chargeBreakdown(one,ph).groups){
  const atomIndex=mapping[group.id];
  if(atomIndex===undefined)continue;
  const text=group.id==='carboxyl'?(group.predominantlyProtonated?'OH':'O⁻'):group.dominantLabel;
  result[atomIndex]={text,group:group.name,protonated:group.predominantlyProtonated};
 }
 return result;
}

export const displayCharge=(charge,digits=4)=>{
 const value=Math.abs(charge)<.5*10**(-digits)?0:charge;
 return (value>0?'+':'')+value.toFixed(digits);
};
