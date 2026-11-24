import assert from 'node:assert/strict';
import {parts,chapters,pathwayCatalog,metabolicCategories} from '../src/courseCatalog.js';
import {glycolysis,sumEnergy} from '../src/metabolism/pathways.js';

assert.equal(parts.length,6,'Six textbook parts');
assert.equal(chapters.length,28,'28 chapters');
assert.equal(new Set(chapters.map(c=>c.number)).size,28,'Every chapter has one number');
for(let i=1;i<=28;i++)assert(chapters.some(c=>c.number===i),'Missing chapter '+i);

assert.equal(glycolysis.reactions.length,10,'Glycolysis should have ten reactions');
assert.equal(glycolysis.metaboliteIds.length,11);
assert.equal(new Set(glycolysis.reactions.map(r=>r.id)).size,10,'Reaction IDs are unique');
assert.equal(new Set(glycolysis.metaboliteIds).size,11,'Metabolite IDs are unique');
for(const [index,r] of glycolysis.reactions.entries()){
  assert.equal(r.number,index+1,'Steps are ordered 1–10');
  assert(r.inputs.length>0&&r.outputs.length>0,'Every reaction needs substrates and products');
  for(const id of [...r.inputs,...r.outputs])assert(glycolysis.metabolites[id],'Unknown metabolite: '+id);
  assert(['investment','payoff'].includes(r.phase),'A known phase is required');
  assert.equal(r.multiplicity,index>=5?2:1,'Two triose molecules in steps 6–10');
  assert(typeof r.energy.atp==='number'&&typeof r.energy.nadh==='number','Energy contributions are numeric');
}
for(const id of glycolysis.metaboliteIds){
  const m=glycolysis.metabolites[id];
  assert(m&&m.id===id,'Metabolite key and ID must agree');
  assert(Number.isInteger(m.carbon)&&m.carbon>0,'Every metabolite has carbon count');
  for(const linked of m.connections)assert(pathwayCatalog.some(p=>p.id===linked),'Unknown planned pathway: '+linked);
}
assert.equal(glycolysis.reactions[3].outputs.length,2,'Aldolase should yield two three-carbon products');
assert.equal(glycolysis.reactions[4].inputs[0],'dhap');
assert.equal(glycolysis.reactions[4].outputs[0],'g3p');
assert.equal(sumEnergy(glycolysis.reactions).atp,2,'Net ATP per glucose');
assert.equal(sumEnergy(glycolysis.reactions).nadh,2,'NADH per glucose');
assert.equal(glycolysis.reactions.filter(r=>r.energy.atp<0).reduce((s,r)=>s+r.energy.atp,0),-2,'Two ATP invested');
assert.equal(glycolysis.reactions.filter(r=>r.energy.atp>0).reduce((s,r)=>s+r.energy.atp,0),4,'Four ATP produced');
assert.equal(sumEnergy(glycolysis.reactions,5).atp,-2);
assert.equal(sumEnergy(glycolysis.reactions,7).atp,0);
assert.equal(glycolysis.reactions.at(-1).outputs[0],'pyruvate');
assert.equal(pathwayCatalog.filter(p=>p.status==='active').length,1);
assert.equal(metabolicCategories.length,5);
for(const p of pathwayCatalog){
  assert(metabolicCategories.some(c=>c.id===p.category),'Unknown category: '+p.category);
  assert(chapters.some(c=>c.number===p.chapter),'Pathway links to missing chapter '+p.chapter);
}
console.log('Content checks passed: 28 chapters, 16 pathway entries, 10 glycolysis steps, balanced ATP/NADH accounting.');
