/**
 * Navigation is deliberately content-first: Part -> Chapter -> Topic.
 * Learn, Explore, Practice, Apply, Review are tabs WITHIN each topic.
 */
export const learningStages=[
  {id:'learn',title:'Learn',detail:'Explanation and guided interactive examples'},
  {id:'explore',title:'Explore',detail:'Investigate and compare independently'},
  {id:'practice',title:'Practice',detail:'Quick questions and immediate feedback'},
  {id:'apply',title:'Apply',detail:'Solve a biochemical problem'},
  {id:'review',title:'Review',detail:'Key takeaways and confidence check'}
];

const chapterTopics={
  1:['The scope of biochemistry','Cells and molecular organization','Chemical principles of life'],
  2:['Properties of water','Acids, bases and pH','Buffers in biology','Noncovalent interactions'],
  3:['Free energy and equilibrium','Coupled biochemical reactions','ATP and energy transfer','Oxidation–reduction chemistry'],
  4:[
    {id:'structure',title:'Structure and stereochemistry of amino acids'},
    {id:'side-chains',title:'The 20 amino acids and side-chain properties'},
    {id:'ionization',title:'Ionization, pKa and isoelectric point'},
    {id:'peptides',title:'Peptide bonds and polypeptides'},
    {id:'modifications',title:'Nonstandard amino acids and modifications'}
  ],
  5:['Levels of protein structure','Alpha helices and beta sheets','Protein folding and stability','Domains and structural motifs'],
  6:['Ligand binding and specificity','Oxygen-binding proteins','Molecular recognition','Conformational changes'],
  7:['Monosaccharides and stereochemistry','Glycosidic linkages','Polysaccharides','Glycoconjugates'],
  8:['Fatty acids and lipid classes','Membrane organization','Membrane transport','Membrane proteins'],
  9:['Nucleotide chemistry','DNA and RNA structures','Nucleic acid interactions','Nucleic acid stability'],
  10:['Enzymes and activation energy','Catalytic strategies','Cofactors and coenzymes','Enzyme mechanisms'],
  11:['Reaction rates and Michaelis–Menten kinetics','Enzyme inhibition','Allosteric regulation','Interpreting kinetic data'],
  12:['Separation and purification','Spectroscopy','Electrophoresis and chromatography','Structural biochemistry techniques'],
  13:['Catabolism and anabolism','Pathway organization','Cofactors and metabolic regulation'],
  14:[{id:'overview',title:'Overview of glycolysis'},{id:'glycolysis',title:'Glycolysis reaction pathway'},{id:'regulation',title:'Regulation and energy balance'}],
  15:['Pyruvate dehydrogenase complex','Citric acid cycle','Control of carbon oxidation'],
  16:['Mitochondrial electron transport','Proton motive force','ATP synthase','Respiratory control'],
  17:['Gluconeogenesis','Glycogen synthesis and breakdown','Pentose phosphate pathway','Carbohydrate regulation'],
  18:['Fatty acid oxidation','Fatty acid synthesis','Ketone bodies','Cholesterol and lipid metabolism'],
  19:['Amino group transfer','Ammonia handling and urea cycle','Amino acid carbon skeletons'],
  20:['Nucleotide biosynthesis','Purine salvage and breakdown','Pyrimidine metabolism'],
  21:['Photosynthetic light reactions','Carbon fixation','Metabolic adaptations in plants'],
  22:['Fed and fasting states','Hormonal control','Interorgan fuel exchange','Metabolic integration'],
  23:['DNA replication','DNA repair','Homologous recombination'],
  24:['Transcription machinery','RNA processing','Gene regulation'],
  25:['Genetic code and ribosomes','Translation steps','Protein targeting and modification'],
  26:['RNA structure and folding','Functional noncoding RNAs','RNA regulation'],
  27:['Receptors and signaling cascades','Second messengers','Feedback and pathway cross-talk'],
  28:['Biochemical basis of disease','Biomarkers and diagnostics','Biotechnology applications']
};
const slug=s=>s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
export const topicsForChapter=number=>(chapterTopics[Number(number)]||[]).map((item,i)=>(
  typeof item==='string'?{id:slug(item),number:Number(number)+'.'+(i+1),title:item,implemented:false}:
  {...item,number:Number(number)+'.'+(i+1),implemented:Number(number)===4}
));
export const findTopic=(chapter,topicId)=>topicsForChapter(chapter).find(t=>t.id===topicId);
export const getTopicCount=()=>Object.values(chapterTopics).reduce((n,topics)=>n+topics.length,0);
