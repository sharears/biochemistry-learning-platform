import React from 'react';
import {ionizationExamples,isoelectricPoint} from './aminoData.js';
import {chargeBreakdown,displayCharge} from './protonation.js';

function FractionFormula({site,ph}){
 const numerator=site.type==='base'?'protonated':'deprotonated';
 const exponent=site.type==='base'?ph-site.pKa:site.pKa-ph;
 return <div className="aa-formula">
  <span className="aa-formula-name">{numerator} fraction = </span>
  <code>1 / (1 + 10^({site.type==='base'?'pH − pKa':'pKa − pH'}))</code>
  <code>= 1 / (1 + 10^({exponent.toFixed(2)}))</code>
  <strong>= {(site.type==='base'?site.protonatedFraction:site.deprotonatedFraction).toFixed(4)}</strong>
 </div>;
}
export default function ChargeCalculation({one,ph}){
 const result=chargeBreakdown(one,ph);
 const pi=isoelectricPoint(one);
 const p=ionizationExamples[one];
 return <details className="aa-calculation">
  <summary><span>How is this calculated?</span><span className="aa-calc-expander">Show equations and charge contributions</span></summary>
  <div className="aa-calc-body">
   <p>At a particular pH, a free amino acid exists as a mixture of protonation states. The number displayed above is the <strong>population-weighted average</strong>, not the integer formal charge of a single molecule. This example updates as you move the slider or choose another amino acid.</p>
   <h4>1. Henderson–Hasselbalch fractions at pH {ph.toFixed(1)}</h4>
   <div className="aa-calc-equations">
    <div><strong>Protonated fraction</strong><code>1 / (1 + 10^(pH − pKa))</code></div>
    <div><strong>Deprotonated fraction</strong><code>1 / (1 + 10^(pKa − pH))</code></div>
   </div>
   <h4>2. Charge contribution of each ionizable group</h4>
   <div className="aa-calculation-sites">{result.groups.map(site=><div key={site.id} className="aa-calculation-site">
     <div className="aa-site-header"><strong>{site.name}</strong><span>pKa = {site.pKa.toFixed(2)}</span></div>
     <p>{site.type==='base'?
       'The protonated group carries +1; the deprotonated form carries 0.':
       'The protonated group carries 0; the deprotonated form carries −1.'}</p>
     <FractionFormula site={site} ph={ph}/>
     <div className="aa-calc-contribution">{site.type==='base'?'+1 × protonated fraction':'−1 × deprotonated fraction'}
       <strong>{displayCharge(site.contribution)}</strong></div>
    </div>)}</div>
   <h4>3. Add the contributions</h4>
   <div className="aa-calc-total">
    <span>Average net charge = {result.groups.map(g=>'('+displayCharge(g.contribution)+')').join(' + ')}</span>
    <strong>= {displayCharge(result.meanCharge)} ≈ {displayCharge(result.meanCharge,2)}</strong>
   </div>
   <p>Values shown in the table are rounded to four decimal places. The calculation uses the unrounded fractions.</p>
   <h4>And where does pI come from?</h4>
   <p>The estimated isoelectric point is the pH where this model's average net charge is zero. The app finds this numerically.</p>
   <div className="aa-calc-total"><span>{!p.side?'No ionizable side chain: pI = (pKa(carboxyl) + pKa(amino)) / 2':'Ionizable side chain present: solve average net charge = 0'}</span>
    <strong>{!p.side?'('+p.carboxyl.toFixed(2)+' + '+p.amino.toFixed(2)+') / 2 = ':''}{pi.toFixed(2)}</strong></div>
   <p className="aa-scope">Model assumptions: independent acid–base sites with fixed textbook pKa values in water. The results are estimates for free amino acids and do not account for residue environments or electrostatic coupling.</p>
  </div>
 </details>;
}
