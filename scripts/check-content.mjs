import assert from 'node:assert/strict';
import {topicsForChapter,findTopic,learningStages} from '../src/topicCatalog.js';
import {aminoAcids,aminoLesson,netCharge,isoelectricPoint} from '../src/amino/aminoData.js';
import {moleculeGraphs} from '../src/amino/moleculeGraphs.js';
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

/* Topic-first curriculum contract */
assert.equal(learningStages.map(s=>s.id).join(','),'learn,explore,practice,apply,review');
for(let n=1;n<=28;n++){
 const t=topicsForChapter(n);
 assert(t.length>=3,'Chapter '+n+' needs multiple topics');
 assert.equal(new Set(t.map(x=>x.id)).size,t.length,'Unique topic IDs for chapter '+n);
 for(const topic of t){
  assert(topic.title&&topic.number.startsWith(n+'.'),'Invalid topic structure');
  assert.equal(findTopic(n,topic.id).id,topic.id);
 }
}
const topics=topicsForChapter(4);
assert.equal(topics.length,5);
for(const t of topics){
 const lesson=aminoLesson[t.id];
 assert(lesson,'Topic 4.'+t.id+' missing lesson content');
 assert(lesson.points.length>=4,'Insufficient learning notes for '+t.id);
 assert(lesson.key.length>=3,'Missing review takeaways for '+t.id);
 assert(lesson.questions.length>=2,'Missing practice questions for '+t.id);
 assert(lesson.apply,'Missing application for '+t.id);
 for(const q of lesson.questions){
  assert(q.options.length>=3&&q.correct>=0&&q.correct<q.options.length,'Bad question choices');
 }
}
assert.equal(aminoAcids.length,20,'20 standard amino acids');
assert.equal(new Set(aminoAcids.map(x=>x.one)).size,20,'Unique residue codes');
assert.equal(Object.keys(moleculeGraphs).length,20,'2D and 3D molecular data for all 20');
for(const a of aminoAcids){
 const [atoms,bonds]=moleculeGraphs[a.one]||[];
 assert(Array.isArray(atoms)&&atoms.length>3,'Atom data for '+a.one);
 assert(Array.isArray(bonds)&&bonds.length>2,'Bond data for '+a.one);
 assert(atoms.every(atom=>atom.length===7&&atom.slice(2).every(Number.isFinite)),'Invalid molecular coords '+a.one);
 assert(bonds.every(([i,j,order])=>Number.isInteger(i)&&Number.isInteger(j)&&i>=0&&j>=0&&i<atoms.length&&j<atoms.length&&i!==j&&[2,3,4].includes(order)),'Invalid bonds '+a.one);
}
assert(Math.abs(isoelectricPoint('G')-5.97)<.005);
assert(netCharge('G',2)>0.5&&netCharge('G',12)<-.95);
assert(netCharge('D',7)<-0.9&&netCharge('K',7)>0.9);
console.log('Topic checks passed: all 28 chapters contain topics, 5 amino-acid lessons, 20 2D/3D structures, and charge/pI models.');
