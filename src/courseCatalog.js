/**
 * Central textbook outline. New chapters can be added without changing the UI.
 * Titles follow the agreed 28-chapter, six-part course plan.
 */
export const parts = [
  { id: 'foundations', title: 'Foundations of Biochemistry', short: 'Foundations', chapters: [
    [1,'Introduction to Biochemistry'],[2,'Water, pH, and Biological Buffers'],[3,'Bioenergetics and Thermodynamics']
  ]},
  { id: 'biomolecules', title: 'Structure and Function of Biomolecules', short:'Biomolecules',chapters: [
    [4,'Amino Acids and Their Properties'],[5,'Protein Structure'],[6,'Protein Function'],[7,'Carbohydrates and Glycobiology'],
    [8,'Lipids and Biological Membranes'],[9,'Nucleotides and Nucleic Acids']
  ]},
  { id: 'enzymes', title: 'Enzymes and Biochemical Techniques', short:'Enzymes & Methods',chapters: [
    [10,'Enzymes and Catalytic Mechanisms'],[11,'Enzyme Kinetics and Regulation'],[12,'Experimental Methods in Biochemistry']
  ]},
  { id: 'metabolism', title: 'Metabolism and Energy Production', short:'Metabolism',chapters: [
    [13,'Introduction to Metabolism'],[14,'Glycolysis'],[15,'Pyruvate Oxidation and the Citric Acid Cycle'],
    [16,'Electron Transport and Oxidative Phosphorylation'],[17,'Carbohydrate Metabolism'],[18,'Lipid Metabolism'],
    [19,'Amino Acid Metabolism'],[20,'Nucleotide Metabolism'],[21,'Photosynthesis and Carbon Fixation'],
    [22,'Metabolic Integration and Hormonal Regulation']
  ]},
  { id: 'molecular', title: 'Molecular Biology and Information Flow', short:'Molecular Biology',chapters: [
    [23,'DNA Replication, Repair, and Recombination'],[24,'Transcription and Gene Regulation'],
    [25,'Translation and Protein Processing'],[26,'RNA Biology and Regulation']
  ]},
  { id: 'applications', title: 'Cellular Regulation and Applications', short:'Applications',chapters: [
    [27,'Cell Signaling and Biochemical Regulation'],[28,'Biochemistry in Medicine and Biotechnology']
  ]}
].map((part,index)=>({
  ...part, number:index+1,
  chapters:part.chapters.map(([number,title])=>({
    number, title, partId:part.id, implemented:[4,7,8].includes(number),
    pathway:number===14?'glycolysis':null
  }))
}));

export const chapters=parts.flatMap(p=>p.chapters);

export const toolGroups=[
  {id:'molecular',name:'Molecular Structure Explorer',description:'Examine structures, functional groups, and molecular interactions.',status:'planned',icon:'◈'},
  {id:'kinetics',name:'Enzyme Kinetics Simulator',description:'Investigate substrate concentration, reaction rate, and enzyme inhibition.',status:'planned',icon:'ƒ'},
  {id:'metabolism',name:'Metabolic Pathway Explorer',description:'Navigate reactions, metabolites, energy accounting, and connected pathways.',status:'active',icon:'◎'},
  {id:'data',name:'Biochemical Data Explorer',description:'Interpret experimental data and molecular measurements.',status:'planned',icon:'▤'}
];

export const metabolicCategories=[
  { id:'carbohydrate',title:'Carbohydrate Metabolism',description:'Pathways for sugar breakdown, synthesis, and storage.',icon:'◌'},
  { id:'energy',title:'Energy Metabolism',description:'ATP production, electron transport, and fuel oxidation.',icon:'⚡'},
  { id:'lipid',title:'Lipid Metabolism',description:'Fatty acids, ketone bodies, and lipid biosynthesis.',icon:'◐'},
  { id:'amino',title:'Amino Acid Metabolism',description:'Nitrogen handling, amino acid conversion, and biosynthesis.',icon:'◇'},
  { id:'nucleotide',title:'Nucleotide Metabolism',description:'Purines, pyrimidines, salvage, and degradation.',icon:'⬡'}
];

/** Status is deliberately explicit so planned paths cannot look operational. */
export const pathwayCatalog=[
  { id:'glycolysis',title:'Glycolysis',category:'carbohydrate',chapter:14,status:'active',description:'Ten reactions that convert glucose to pyruvate.' },
  { id:'gluconeogenesis',title:'Gluconeogenesis',category:'carbohydrate',chapter:17,status:'planned',description:'Glucose synthesis using dedicated bypass reactions.' },
  { id:'glycogen-metabolism',title:'Glycogen metabolism',category:'carbohydrate',chapter:17,status:'planned',description:'Glycogen synthesis and mobilization.' },
  { id:'pentose-phosphate',title:'Pentose phosphate pathway',category:'carbohydrate',chapter:17,status:'planned',description:'NADPH and sugar-phosphate metabolism.' },
  { id:'pyruvate-oxidation',title:'Pyruvate oxidation',category:'energy',chapter:15,status:'planned',description:'Link pyruvate to acetyl-CoA.' },
  { id:'tca-cycle',title:'Citric acid cycle',category:'energy',chapter:15,status:'planned',description:'Oxidize acetyl units and generate reducing equivalents.' },
  { id:'electron-transport',title:'Electron transport & oxidative phosphorylation',category:'energy',chapter:16,status:'planned',description:'Electron flow, proton motive force, and ATP synthesis.' },
  { id:'fatty-acid-oxidation',title:'Fatty acid β-oxidation',category:'lipid',chapter:18,status:'planned',description:'Sequential cleavage of fatty acyl chains.' },
  { id:'fatty-acid-synthesis',title:'Fatty acid synthesis',category:'lipid',chapter:18,status:'planned',description:'Build fatty acyl chains with reductive chemistry.' },
  { id:'ketone-bodies',title:'Ketone body metabolism',category:'lipid',chapter:18,status:'planned',description:'Ketone synthesis and utilization.' },
  { id:'urea-cycle',title:'Urea cycle',category:'amino',chapter:19,status:'planned',description:'Convert nitrogen into excretable urea.' },
  { id:'amino-acid-catabolism',title:'Amino acid catabolism',category:'amino',chapter:19,status:'planned',description:'Carbon skeletons and amino-group processing.' },
  { id:'purine-metabolism',title:'Purine metabolism',category:'nucleotide',chapter:20,status:'planned',description:'Purine synthesis, salvage, and degradation.' },
  { id:'pyrimidine-metabolism',title:'Pyrimidine metabolism',category:'nucleotide',chapter:20,status:'planned',description:'Pyrimidine synthesis, salvage, and degradation.' },
  { id:'photosynthesis',title:'Photosynthesis and carbon fixation',category:'energy',chapter:21,status:'planned',description:'Light-driven electron transfer and carbon fixation.' },
  { id:'fermentation',title:'Lactate fermentation',category:'carbohydrate',chapter:14,status:'planned',description:'Regenerate NAD+ through lactate formation.' }
];
