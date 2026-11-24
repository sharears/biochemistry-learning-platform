/**
 * First member of a reusable pathway registry.
 *
 * The graph stores stable metabolite and reaction IDs, never duplicate names.
 * Reaction energy accounting is explicitly PER ONE GLUCOSE (the payoff
 * reactions occur twice after fructose-1,6-bisphosphate cleavage).
 *
 * This is an instructional pathway graph, not a kinetic model or
 * a charge-/proton-balanced reaction database.
 */
export const glycolysis={
  id:'glycolysis',
  title:'Glycolysis',
  subtitle:'From glucose to pyruvate',
  compartment:'Cytosol',
  pathwayCategory:'carbohydrate',
  description:'Explore 10 enzyme-catalyzed reactions, a two-triose branch, and energy bookkeeping per molecule of glucose.',
  objectives:[
    'Identify substrates, products, and enzymes of the 10 steps.',
    'Explain why glycolysis has investment and payoff phases.',
    'Trace the formation of two three-carbon intermediates.',
    'Account for ATP invested, ATP formed, and NADH produced.'
  ],
  metaboliteIds:['glucose','g6p','f6p','f16bp','dhap','g3p','bpg13','pg3','pg2','pep','pyruvate'],
  metabolites:{
    glucose:{id:'glucose',name:'Glucose',short:['Glucose'],carbon:6,role:'Starting hexose sugar',description:'A six-carbon sugar that enters glycolysis through phosphorylation.',connections:[]},
    g6p:{id:'g6p',name:'Glucose-6-phosphate',short:['Glucose-6-','phosphate'],carbon:6,role:'Branch-point sugar phosphate',description:'Can enter glycolysis, glycogen metabolism, or the pentose phosphate pathway.',connections:['pentose-phosphate','glycogen-metabolism']},
    f6p:{id:'f6p',name:'Fructose-6-phosphate',short:['Fructose-6-','phosphate'],carbon:6,role:'Six-carbon ketose phosphate',description:'Interconverts with glucose-6-phosphate and is the substrate for phosphofructokinase-1.',connections:['gluconeogenesis']},
    f16bp:{id:'f16bp',name:'Fructose-1,6-bisphosphate',short:['Fructose-1,6-','bisphosphate'],carbon:6,role:'Cleavage substrate',description:'A six-carbon bisphosphate cleaved by aldolase into two three-carbon trioses.',connections:['gluconeogenesis']},
    dhap:{id:'dhap',name:'Dihydroxyacetone phosphate',short:['Dihydroxyacetone','phosphate'],carbon:3,role:'Triose phosphate',description:'Produced by aldolase and interconverted with glyceraldehyde-3-phosphate.',connections:[]},
    g3p:{id:'g3p',name:'Glyceraldehyde-3-phosphate',short:['Glyceraldehyde-3-','phosphate'],carbon:3,role:'Triose phosphate entering the payoff phase',description:'After isomerization of DHAP, two G3P molecules continue through the payoff steps for every starting glucose.',connections:['gluconeogenesis']},
    bpg13:{id:'bpg13',name:'1,3-Bisphosphoglycerate',short:['1,3-Bisphospho-','glycerate'],carbon:3,role:'High-energy acyl phosphate',description:'Its acyl phosphate can donate a phosphoryl group to ADP.',connections:[]},
    pg3:{id:'pg3',name:'3-Phosphoglycerate',short:['3-Phospho-','glycerate'],carbon:3,role:'Three-carbon phosphoglycerate',description:'Product of the first substrate-level phosphorylation in the payoff phase.',connections:[]},
    pg2:{id:'pg2',name:'2-Phosphoglycerate',short:['2-Phospho-','glycerate'],carbon:3,role:'Rearranged phosphate intermediate',description:'Its phosphate is at carbon 2, positioning it for dehydration to PEP.',connections:[]},
    pep:{id:'pep',name:'Phosphoenolpyruvate',short:['Phosphoenol-','pyruvate'],carbon:3,role:'High phosphoryl-transfer-potential intermediate',description:'Transfers its phosphoryl group to ADP in the final reaction.',connections:['gluconeogenesis']},
    pyruvate:{id:'pyruvate',name:'Pyruvate',short:['Pyruvate'],carbon:3,role:'Three-carbon product',description:'Two molecules are formed per glucose; pyruvate can enter other metabolic processes depending on cell type and conditions.',connections:['fermentation','pyruvate-oxidation','gluconeogenesis']}
  },
  reactions:[
    {id:'hexokinase',number:1,enzyme:'Hexokinase',enzymeEC:'2.7.1.1',phase:'investment',inputs:['glucose'],outputs:['g6p'],equation:'Glucose + ATP → Glucose-6-phosphate + ADP',description:'Phosphorylates glucose at carbon 6, using ATP.',type:'Phosphoryl transfer',reversible:false,regulation:'An important control point; many hexokinase isoforms are inhibited by glucose-6-phosphate.',energy:{atp:-1,nadh:0},multiplicity:1},
    {id:'pgi',number:2,enzyme:'Phosphoglucose isomerase',enzymeEC:'5.3.1.9',phase:'investment',inputs:['g6p'],outputs:['f6p'],equation:'Glucose-6-phosphate ⇌ Fructose-6-phosphate',description:'Interconverts an aldose phosphate and a ketose phosphate.',type:'Isomerization',reversible:true,regulation:'Near-equilibrium reaction in many cellular contexts.',energy:{atp:0,nadh:0},multiplicity:1},
    {id:'pfk1',number:3,enzyme:'Phosphofructokinase-1',enzymeEC:'2.7.1.11',phase:'investment',inputs:['f6p'],outputs:['f16bp'],equation:'Fructose-6-phosphate + ATP → Fructose-1,6-bisphosphate + ADP',description:'Invests a second ATP to phosphorylate the ketose at carbon 1.',type:'Phosphoryl transfer',reversible:false,regulation:'A major regulatory step affected by energy charge and fructose-2,6-bisphosphate.',energy:{atp:-1,nadh:0},multiplicity:1},
    {id:'aldolase',number:4,enzyme:'Aldolase',enzymeEC:'4.1.2.13',phase:'investment',inputs:['f16bp'],outputs:['dhap','g3p'],equation:'Fructose-1,6-bisphosphate ⇌ DHAP + G3P',description:'Cleaves the six-carbon sugar into two distinct three-carbon phosphates.',type:'Carbon–carbon bond cleavage',reversible:true,regulation:'DHAP and G3P can interconvert in the following step.',energy:{atp:0,nadh:0},multiplicity:1},
    {id:'tpi',number:5,enzyme:'Triose phosphate isomerase',enzymeEC:'5.3.1.1',phase:'investment',inputs:['dhap'],outputs:['g3p'],equation:'DHAP ⇌ Glyceraldehyde-3-phosphate',description:'Converts DHAP to G3P, leaving two G3P molecules to continue per original glucose.',type:'Isomerization',reversible:true,regulation:'The pathway now processes two triose-phosphate molecules per glucose.',energy:{atp:0,nadh:0},multiplicity:1},
    {id:'gapdh',number:6,enzyme:'Glyceraldehyde-3-phosphate dehydrogenase',enzymeEC:'1.2.1.12',phase:'payoff',inputs:['g3p'],outputs:['bpg13'],equation:'G3P + Pi + NAD⁺ ⇌ 1,3-Bisphosphoglycerate + NADH + H⁺',description:'Oxidizes and phosphorylates G3P while reducing NAD+ to NADH.',type:'Oxidation and phosphorylation',reversible:true,regulation:'Requires available NAD+; reaction occurs twice for each initial glucose.',energy:{atp:0,nadh:2},multiplicity:2},
    {id:'pgk',number:7,enzyme:'Phosphoglycerate kinase',enzymeEC:'2.7.2.3',phase:'payoff',inputs:['bpg13'],outputs:['pg3'],equation:'1,3-Bisphosphoglycerate + ADP ⇌ 3-Phosphoglycerate + ATP',description:'Makes ATP by substrate-level phosphorylation.',type:'Substrate-level phosphorylation',reversible:true,regulation:'Two ATP are made here per glucose.',energy:{atp:2,nadh:0},multiplicity:2},
    {id:'pgm',number:8,enzyme:'Phosphoglycerate mutase',enzymeEC:'5.4.2.11',phase:'payoff',inputs:['pg3'],outputs:['pg2'],equation:'3-Phosphoglycerate ⇌ 2-Phosphoglycerate',description:'Moves the phosphate group from carbon 3 to carbon 2.',type:'Phosphate rearrangement',reversible:true,regulation:'Occurs twice per glucose after the triose split.',energy:{atp:0,nadh:0},multiplicity:2},
    {id:'enolase',number:9,enzyme:'Enolase',enzymeEC:'4.2.1.11',phase:'payoff',inputs:['pg2'],outputs:['pep'],equation:'2-Phosphoglycerate ⇌ Phosphoenolpyruvate + H₂O',description:'Removes water to produce phosphoenolpyruvate.',type:'Dehydration',reversible:true,regulation:'Occurs twice per glucose after the triose split.',energy:{atp:0,nadh:0},multiplicity:2},
    {id:'pk',number:10,enzyme:'Pyruvate kinase',enzymeEC:'2.7.1.40',phase:'payoff',inputs:['pep'],outputs:['pyruvate'],equation:'Phosphoenolpyruvate + ADP → Pyruvate + ATP',description:'Transfers the phosphate of PEP to ADP, forming ATP.',type:'Substrate-level phosphorylation',reversible:false,regulation:'A major regulated control point; two ATP are made per glucose.',energy:{atp:2,nadh:0},multiplicity:2}
  ],
  quiz:[
    {question:'Which enzyme catalyzes the committed regulatory phosphorylation of fructose-6-phosphate in glycolysis?',options:['Hexokinase','Phosphofructokinase-1','Aldolase','Enolase'],answer:1,explanation:'Phosphofructokinase-1 catalyzes step 3 and is a major regulatory point.'},
    {question:'What two products result from aldolase cleavage?',options:['Pyruvate and lactate','G6P and F6P','DHAP and G3P','3PG and 2PG'],answer:2,explanation:'Aldolase splits fructose-1,6-bisphosphate into DHAP and G3P.'},
    {question:'Which reaction directly produces NADH?',options:['Step 2: PGI','Step 6: GAPDH','Step 8: PGM','Step 10: Pyruvate kinase'],answer:1,explanation:'GAPDH oxidizes G3P while reducing NAD+ to NADH.'},
    {question:'What is the net ATP production per glucose from glycolysis alone?',options:['0 ATP','2 ATP','4 ATP','6 ATP'],answer:1,explanation:'Two ATP are invested (steps 1 and 3), and four are produced (steps 7 and 10 twice each). Net: 2 ATP.'},
    {question:'Why do steps 6–10 occur twice per molecule of glucose?',options:['Glucose has two phosphate groups','Two G3P molecules proceed after the split and isomerization','ATP regenerates all intermediates','The pathway runs backward'],answer:1,explanation:'Aldolase and triose phosphate isomerase yield two G3P molecules from each glucose.'}
  ],
  sourceLinks:[
    {title:'NCBI Bookshelf — Biochemistry, Glycolysis',url:'https://www.ncbi.nlm.nih.gov/books/NBK482303/'},
    {title:'Reactome — Glycolysis (human)',url:'https://reactome.org/content/detail/R-HSA-70171'}
  ]
};
export const sumEnergy=(reactions,upTo=reactions.length)=>reactions.slice(0,upTo).reduce((acc,r)=>({atp:acc.atp+r.energy.atp,nadh:acc.nadh+r.energy.nadh}),{atp:0,nadh:0});
export const getReaction=(pathway,id)=>pathway.reactions.find(r=>r.id===id);
export const getMetabolite=(pathway,id)=>pathway.metabolites[id];
