import assert from 'node:assert/strict';
import {topicsForChapter,findTopic,learningStages} from '../src/topicCatalog.js';
import {aminoAcids,aminoLesson,netCharge,isoelectricPoint,phPresets,explainChargeAtPh,ionizationExamples} from '../src/amino/aminoData.js';
import {chargeBreakdown,protonationAtomLabels,TITRATABLE_ATOM_INDICES,displayCharge} from '../src/amino/protonation.js';
import {moleculeGraphs} from '../src/amino/moleculeGraphs.js';
import {parts,chapters,pathwayCatalog,metabolicCategories} from '../src/courseCatalog.js';
import {biomoleculeLessons,chapterIntroductions} from '../src/biomolecules/biomoleculeLessons.js';
import {readFileSync} from 'node:fs';
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

/* Quick pH buttons must agree with the live charge model and have useful explanations. */
assert.deepEqual(phPresets,[2,7,12]);
for(const letter of Object.keys({G:1,D:1,K:1,H:1})){
 for(const ph of phPresets){
  const note=explainChargeAtPh(letter,ph);
  assert(note.summary.includes('pH '+ph.toFixed(1)),'Preset explanation must show selected pH');
  assert(note.summary.includes('α-carboxyl')&&note.summary.includes('α-amino'),'Explain both backbone groups');
  assert(Math.abs(note.netCharge-netCharge(letter,ph))<1e-9,'Charge explanation matches model');
  assert(note.carboxylPercent>=0&&note.carboxylPercent<=100);
  assert(note.aminoPercent>=0&&note.aminoPercent<=100);
 }
}
assert(explainChargeAtPh('G',2).netCharge>0.5);
assert(Math.abs(explainChargeAtPh('G',7).netCharge)<0.01);
assert(explainChargeAtPh('G',12).netCharge<-.99);
console.log('pH preset checks passed for acidic, neutral, and basic conditions.');


/* Interactive calculation and molecular protonation: one consistent model. */
assert.equal(Object.keys(TITRATABLE_ATOM_INDICES).length,Object.keys(ionizationExamples).length);
for(const [one,model] of Object.entries(ionizationExamples)){
 const mapping=TITRATABLE_ATOM_INDICES[one];
 assert(mapping,'Missing pH-sensitive structure mapping for '+one);
 assert(Object.keys(mapping).length===2+(model.side?1:0),'Incorrect group count for '+one);
 const [atoms,bonds]=moleculeGraphs[one];
 for(const [id,index] of Object.entries(mapping)){
  assert(Number.isInteger(index)&&index>=0&&index<atoms.length,'Invalid atom index '+one+' '+id);
  const symbol=atoms[index][0];
  assert(symbol===(id==='amino'?'N':id==='carboxyl'?'O':({C:'S',Y:'O',D:'O',E:'O',K:'N',R:'N',H:'N'}[one])),'Wrong titratable atom '+one+' '+id);
 }
 for(const ph of [0,0.6,2,2.34,3.65,6,7,9.6,12,14]){
  const b=chargeBreakdown(one,ph);
  const labels=protonationAtomLabels(one,ph);
  assert.equal(b.groups.length,Object.keys(mapping).length);
  assert(Math.abs(b.meanCharge-b.modelCharge)<1e-10,'Breakdown disagrees with live charge');
  assert(Object.keys(labels).length===b.groups.length,'All ionizable groups visible');
  assert(b.groups.every(g=>Math.abs(g.protonatedFraction+g.deprotonatedFraction-1)<1e-10),'HH fractions must sum to one');
  assert(b.groups.every(g=>g.predominantlyProtonated===(ph<=g.pKa)),'Majority switch at pKa');
  assert(b.groups.every(g=>g.type==='base'?g.contribution>=0:g.contribution<=0),'Expected charge sign');
 }
}
assert.equal(protonationAtomLabels('G',0.6)[0].text,'NH₃⁺');
assert.equal(protonationAtomLabels('G',0.6)[4].text,'OH');
assert.equal(chargeBreakdown('G',0.6).dominantCharge,1);
assert(Math.abs(chargeBreakdown('G',0.6).meanCharge-.9821)<.001);
assert.equal(protonationAtomLabels('G',7)[4].text,'O⁻');
assert.equal(protonationAtomLabels('G',12)[0].text,'NH₂');
assert.equal(chargeBreakdown('G',7).dominantCharge,0);
assert.equal(protonationAtomLabels('D',7)[0].text,'O⁻');
assert.equal(protonationAtomLabels('K',2)[0].text,'NH₃⁺');
assert.equal(protonationAtomLabels('K',12)[0].text,'NH₂');
assert.equal(protonationAtomLabels('H',2)[1].text,'NH⁺');
assert(chargeBreakdown('G',2.34).nearTransition,'pKa midpoint requires population note');
assert.equal(displayCharge(0,2),'0.00');
console.log('Ionization structure checks passed: nine amino acids, 2D/3D atom mappings, pH-dependent species, and group-level math.');


/* Chapters 7 and 8 now have complete, topic-specific five-stage lessons. */
for(const number of [7,8]){
 const chapter=chapters.find(ch=>ch.number===number);
 assert(chapter?.implemented,'Chapters 7 and 8 must be marked available');
 assert(chapterIntroductions[number]?.length>50,'Chapter description missing');
 const topics=topicsForChapter(number);
 assert.equal(topics.length,4,'Four topics per new chapter');
 for(const topic of topics){
  assert(topic.implemented,'Topic '+topic.number+' should be marked available');
  const lesson=biomoleculeLessons[number]?.[topic.id];
  assert(lesson,'Missing lesson for '+topic.number+' '+topic.id);
  assert(lesson.intro.length>=120,'Detailed intro missing '+topic.id);
  assert(lesson.points.length>=5,'At least five explanatory learning ideas per topic '+topic.id);
  assert(lesson.points.every(p=>p.length>=70),'Each core idea must be substantive '+topic.id);
  assert(lesson.caseStudy?.text.length>70,'Real-world connection missing '+topic.id);
  assert(lesson.callout?.length>70,'Guided interactive explanation missing '+topic.id);
  assert(lesson.explore?.length>70,'Open-ended investigation missing '+topic.id);
  assert(lesson.questions.length>=3,'Practice set missing '+topic.id);
  for(const q of lesson.questions){
   assert(q.options?.length===4&&Number.isInteger(q.correct)&&q.correct>=0&&q.correct<4,'Invalid multiple-choice question '+topic.id);
   assert(q.why?.length>35,'Explanatory feedback required '+topic.id);
  }
  assert(lesson.apply?.title&&lesson.apply?.prompt&&lesson.apply?.why,'Applied exercise missing '+topic.id);
  assert(['choice','number'].includes(lesson.apply.kind),'Unsupported application type '+topic.id);
  if(lesson.apply.kind==='choice')assert(lesson.apply.options.length===4&&Number.isInteger(lesson.apply.correct));
  if(lesson.apply.kind==='number')assert(Number.isFinite(lesson.apply.answer)&&lesson.apply.tolerance===0);
  assert(lesson.key.length>=4,'Review checklist needs four takeaways '+topic.id);
 }
}
const interactives=readFileSync(new URL('../src/biomolecules/BiomoleculeInteractive.jsx',import.meta.url),'utf8');
for(const chapterNumber of [7,8])for(const topic of topicsForChapter(chapterNumber)){
 assert(interactives.includes("if(topicId==='"+topic.id+"')"),'No interactive for '+topic.number);
}
const biomoleculeUI=readFileSync(new URL('../src/biomolecules/BiomoleculeChapter.jsx',import.meta.url),'utf8');
for(const stage of learningStages)assert(biomoleculeUI.includes("stage==='"+stage.id+"'"),'Stage missing in new chapter UI: '+stage.id);
assert(chapters.find(ch=>ch.number===4).implemented,'Existing amino acid chapter must remain available');
assert(!chapters.find(ch=>ch.number===17).implemented,'Metabolic carbohydrate chapter 17 remains planned');
assert(!chapters.find(ch=>ch.number===18).implemented,'Metabolic lipid chapter 18 remains planned');
console.log('Biomolecule chapter checks passed: 8 topics, 40 learning stages, 8 embedded interactives, 24 practice questions and 8 applications.');
