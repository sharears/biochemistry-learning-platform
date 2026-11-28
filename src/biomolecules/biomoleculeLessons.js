/**
 * Chapter 7 and 8 undergraduate lessons. Five stages are rendered separately
 * for each topic; all guided interactives live within Learn and Explore.
 * Chemical conventions are explained where simplified diagrams are used.
 */
export const biomoleculeLessons={
 7:{
  'monosaccharides-and-stereochemistry':{
   intro:'Monosaccharides are polyhydroxy aldehydes or ketones. Their stereochemistry controls molecular recognition: two sugars with the same formula can behave differently in enzymes and lectins.',
   points:[
    'Aldoses contain an aldehyde in the open-chain form; ketoses contain a ketone. D-glucose is an aldohexose, while D-fructose is a ketohexose. Both commonly form cyclic hemiacetals or hemiketals in water.',
    'The D/L designation describes the configuration at the stereocenter farthest from the carbonyl in the Fischer projection, relative to glyceraldehyde. It does not indicate optical rotation or whether a sugar is alpha or beta.',
    'Epimers differ at exactly one stereogenic center. D-mannose is the C2 epimer of D-glucose; D-galactose is its C4 epimer. These differences affect enzyme specificity.',
    'Ring closure creates a new stereocenter at the anomeric carbon. Alpha and beta anomers differ at that carbon; for a D-pyranose in a conventional Haworth projection, the alpha anomeric OH is trans (down) to the C5 CH2OH (up), and beta is cis (up).',
    'Mutarotation is the interconversion of anomers through ring opening and reclosing. The proportions of alpha, beta and open-chain species depend on solvent and conditions; a static diagram does not show the equilibrium distribution.'
   ],
   callout:'Switch among D-glucose, D-mannose and D-galactose, then flip the anomer. Compare the Fischer stereocenters with the substituents in a schematic pyranose Haworth projection.',
   caseStudy:{title:'Why C2 and C4 matter',text:'Hexokinase and many glycan-binding proteins distinguish sugars through the spatial orientation of OH groups. A one-carbon epimerization changes that orientation without changing the molecular formula.'},
   explore:'Compare D-glucose with D-mannose: where does the Fischer OH change? Then compare D-glucose with D-galactose and switch alpha to beta. Which change affects only the anomeric carbon?',
   questions:[
    {q:'D-glucose and D-mannose are what kind of stereoisomers?',options:['Enantiomers','C2 epimers','Anomers','Constitutional isomers'],correct:1,why:'They differ in configuration only at C2, so they are epimers.'},
    {q:'In a conventional Haworth projection of an alpha-D-glucopyranose ring, the anomeric OH is…',options:['Up, same side as C5 CH2OH','Down, opposite C5 CH2OH','Always in the ring plane','Absent'],correct:1,why:'For this D-pyranose, alpha means the anomeric OH is trans to the CH2OH group.'},
    {q:'Which description correctly defines D/L?',options:['Clockwise optical rotation','Relative stereochemistry at the farthest stereocenter from the carbonyl','Whether the anomeric OH points up','Whether the sugar has an aldehyde'],correct:1,why:'D/L is a stereochemical convention, distinct from alpha/beta or optical rotation.'}
   ],
   apply:{kind:'choice',title:'Identify a sugar epimer',prompt:'An enzyme converts D-glucose to a sugar with only its C4 OH stereochemistry inverted. What sugar is formed?',options:['D-mannose','D-galactose','L-glucose','D-fructose'],correct:1,why:'D-galactose differs from D-glucose at C4 only.'},
   key:['D/L and alpha/beta describe different stereochemical features.','Epimers differ at one non-anomeric stereocenter.','The ring anomeric configuration can change through mutarotation.','OH orientation determines biomolecular recognition.']
  },
  'glycosidic-linkages':{
   intro:'Glycosidic bonds link a sugar anomeric carbon to an oxygen, nitrogen or other nucleophile. Their position and stereochemistry help determine whether an oligosaccharide is recognized or hydrolyzed by a particular enzyme.',
   points:[
    'A glycosidic linkage names the anomeric configuration of the donor residue and the connected positions; alpha(1→4) means C1 of the donor is linked to C4 of the next sugar through an O-glycosidic bond.',
    'Maltose consists of two glucose units joined by an alpha(1→4) bond. Cellobiose consists of two glucose units joined by a beta(1→4) bond. The connectivity is similar, but the stereochemistry differs.',
    'Lactose is galactose beta(1→4) glucose. Lactase hydrolyzes lactose; an enzyme recognizing maltose cannot be assumed to cleave lactose.',
    'An oligosaccharide is reducing if it retains a free anomeric hemiacetal capable of ring opening. In sucrose, both anomeric centers participate in the linkage, so sucrose is nonreducing.',
    'Glycosidic linkages are stereospecific: alpha and beta polymers can have very different shapes and biological roles. Most humans hydrolyze starch alpha(1→4) linkages but not cellulose beta(1→4) linkages.'
   ],
   callout:'Inspect familiar disaccharides to reveal which positions connect, where the reducing end remains, and why different enzymes recognize different linkages.',
   caseStudy:{title:'Why lactose intolerance is enzyme-specific',text:'Lactase cleaves the beta(1→4) galactosyl-glucose bond in lactose. Without sufficient lactase, lactose is not efficiently digested in the small intestine.'},
   explore:'Compare maltose and cellobiose (both glucose–glucose), then inspect lactose and sucrose. Which has both anomeric carbons tied up, and which disaccharides retain a reducing end?',
   questions:[
    {q:'What distinguishes maltose from cellobiose?',options:['Different monosaccharide formulas','Alpha(1→4) versus beta(1→4) stereochemistry','One is a trisaccharide','Both anomeric carbons are linked in maltose'],correct:1,why:'Both are glucose–glucose disaccharides, but their glycosidic stereochemistry differs.'},
    {q:'Why is sucrose nonreducing?',options:['It contains no oxygen','Its two anomeric carbons are joined in the bond','It is too large to oxidize','It contains only fructose'],correct:1,why:'Neither sugar has a free anomeric hemiacetal or hemiketal in sucrose.'},
    {q:'Which enzyme digests lactose in the small intestine?',options:['Amylase','Lactase','Lipase','Pepsin'],correct:1,why:'Lactase catalyzes hydrolysis of lactose to galactose and glucose.'}
   ],
   apply:{kind:'number',title:'Count the links',prompt:'A linear chain contains five glucose residues joined consecutively by glycosidic bonds. How many glycosidic bonds connect the residues?',answer:4,tolerance:0,why:'A linear chain of n residues has n − 1 connections, so 5 − 1 = 4.'},
   key:['Both linkage position and anomeric stereochemistry matter.','Maltose and cellobiose differ at alpha/beta(1→4).','A free anomeric carbon creates a reducing end.','Sucrose is nonreducing because both anomeric centers are linked.']
  },
  polysaccharides:{
   intro:'Polysaccharides store energy, provide mechanical strength and organize extracellular environments. Their properties depend on monosaccharide identity, glycosidic stereochemistry, chain length and branching.',
   points:[
    'Amylose is a mostly linear alpha(1→4) glucan and a component of starch. Amylopectin has alpha(1→4) stretches with alpha(1→6) branch points.',
    'Glycogen is a highly branched alpha-glucan with alpha(1→4) chains and alpha(1→6) branch points. Multiple nonreducing ends permit rapid addition or removal of glucose residues.',
    'Cellulose consists of beta(1→4)-linked glucose chains. Its extended geometry permits extensive interchain hydrogen bonding, supporting strong plant cell-wall fibers.',
    'Mammalian amylases cleave internal alpha(1→4) bonds but do not directly hydrolyze cellulose beta(1→4) bonds. Debranching activities are needed for alpha(1→6) branch points during glycogen mobilization.',
    'Polymer diagrams here show a short illustrative segment, not an exact branching frequency or crystallographic conformation. Natural polymers have many more residues and distributions of chain lengths.'
   ],
   callout:'Switch between amylose, amylopectin, glycogen and cellulose. Observe the relationship between alpha/beta bonds, branch points and biological function.',
   caseStudy:{title:'Why branching speeds glycogen mobilization',text:'Glycogen phosphorylase removes glucose-1-phosphate from nonreducing ends. Having many such ends allows multiple enzyme molecules to work concurrently.'},
   explore:'Select cellulose and glycogen. Find the alpha/beta difference, then compare the number of illustrated branch tips. Why would a branched storage polymer behave differently from a structural fiber?',
   questions:[
    {q:'Which linkage creates glycogen branch points?',options:['Alpha(1→6)','Beta(1→4)','Alpha(1→2)','Peptide bond'],correct:0,why:'Glycogen contains alpha(1→4) chains with alpha(1→6) branches.'},
    {q:'Why can mammals digest starch more readily than cellulose?',options:['Starch has no glucose','Our common enzymes cleave starch alpha links, not cellulose beta(1→4) links','Cellulose has no oxygen','Cellulose is a protein'],correct:1,why:'The stereochemistry and resulting geometry determine enzyme specificity.'},
    {q:'What is a key benefit of glycogen branching?',options:['It eliminates all reducing ends','It increases accessible nonreducing chain ends','It creates DNA-like strands','It converts glucose into fructose'],correct:1,why:'Many nonreducing ends support rapid synthesis and degradation.'}
   ],
   apply:{kind:'number',title:'An unbranched oligomer',prompt:'An unbranched cellulose fragment contains eight glucose residues. How many beta(1→4) glycosidic links join them?',answer:7,tolerance:0,why:'An unbranched 8-residue chain has 8 − 1 = 7 links.'},
   key:['Amylose: mostly linear alpha(1→4).','Amylopectin and glycogen: alpha(1→4) with alpha(1→6) branches.','Cellulose: beta(1→4), extended structural fibers.','Branching increases available nonreducing ends.']
  },
  glycoconjugates:{
   intro:'Glycans attached to proteins and lipids shape cell surfaces, secretion, molecular recognition and extracellular matrices. Their branching and composition create signals that cannot be inferred from the protein sequence alone.',
   points:[
    'An N-linked glycan is attached to an asparagine side-chain nitrogen; in eukaryotes it is commonly introduced through an Asn-X-Ser/Thr sequon (X is usually not proline). The sequon alone does not guarantee glycosylation.',
    'Many O-linked glycans attach to serine or threonine hydroxyl groups. O-linked glycans vary widely in core structure and modification; they are not all equivalent.',
    'Glycoproteins bear carbohydrate attachments that can influence folding, trafficking, receptor binding and stability. A glycan is not necessarily a direct signal for only one function.',
    'Proteoglycans contain core proteins with one or more long glycosaminoglycan (GAG) chains, often highly hydrated and negatively charged. They help organize extracellular matrices.',
    'Glycolipids embed a lipid anchor in a membrane while exposing carbohydrate groups to the aqueous surface. Cell-surface glycan recognition underlies selectin interactions and blood-group antigen specificity.'
   ],
   callout:'Inspect glycoproteins, proteoglycans and glycolipids. See where the carbohydrate attaches and which cellular interactions it can influence.',
   caseStudy:{title:'Cell-surface information',text:'ABO blood-group antigens differ in the terminal carbohydrate structures on cell-surface glycoconjugates. Specific enzymes install different terminal sugars.'},
   explore:'Compare an N-linked glycoprotein with a proteoglycan and glycolipid. What is the attachment point in each case, and how does the carbohydrate face the extracellular space?',
   questions:[
    {q:'Which amino acid side chain is modified in classic N-linked glycosylation?',options:['Glycine','Asparagine','Leucine','Aspartate'],correct:1,why:'The glycan is linked to the side-chain amide nitrogen of Asn.'},
    {q:'A proteoglycan is distinguished by…',options:['Long glycosaminoglycan chains attached to a core protein','Being composed entirely of cholesterol','A DNA backbone','Having no carbohydrate'],correct:0,why:'GAG chains are characteristic components of many proteoglycans.'},
    {q:'Where is the glycan of a plasma-membrane glycolipid generally presented?',options:['In the cytosolic ATP-binding pocket','On the external aqueous face of the membrane','Only inside the hydrophobic bilayer core','Inside a peptide bond'],correct:1,why:'The lipid anchor inserts into the bilayer while the carbohydrate projects into the extracellular space.'}
   ],
   apply:{kind:'choice',title:'Pick the glycosylation site',prompt:'You identify a protein glycosylation site where a glycan is attached through a side-chain nitrogen. Which residue is the most likely attachment site?',options:['Asparagine','Serine','Threonine','Tyrosine'],correct:0,why:'Conventional N-linked glycans attach to Asn through an N-glycosidic linkage.'},
   key:['N-linked glycans typically attach to Asn.','O-linked glycans commonly attach to Ser/Thr hydroxyl groups.','Proteoglycans frequently carry hydrated GAG chains.','Glycolipids display glycans using a membrane lipid anchor.']
  }
 },
 8:{
  'fatty-acids-and-lipid-classes':{
   intro:'Lipids include fatty acids, triacylglycerols, phospholipids, sphingolipids and sterols. Hydrophobic and amphipathic structures help explain energy storage, membrane assembly and signaling.',
   points:[
    'Fatty acid shorthand C:D counts total carbons (C) and double bonds (D). For example, 18:1 has 18 carbons and one C=C bond. Standard cis double bonds introduce a bend that disrupts tight packing.',
    'At comparable chain lengths, increasing cis unsaturation generally lowers melting temperature by weakening packing. Longer saturated chains generally have stronger van der Waals interactions; actual melting temperatures depend on molecular context.',
    'Triacylglycerols contain glycerol esterified to three fatty acids and are mainly hydrophobic energy-storage lipids. They are not the main structural building block of bilayers.',
    'Glycerophospholipids contain a polar phosphodiester headgroup and nonpolar tails. Many sphingolipids have a sphingosine-derived backbone and may carry a phosphocholine or sugar headgroup.',
    'Cholesterol has a rigid fused-ring structure, a small hydroxyl headgroup and a hydrocarbon tail. It modulates packing and mechanical properties of many animal membranes.'
   ],
   callout:'Compare chain length, cis/trans unsaturation, and lipid classes. The chain diagrams emphasize packing geometry instead of claiming to show complete atom-by-atom structures.',
   caseStudy:{title:'What does 18:2 actually mean?',text:'An 18:2 fatty acid has two carbon–carbon double bonds. Compared with an 18:0 fatty acid of the same chain length, it contains four fewer hydrogens before other modifications are considered.'},
   explore:'Compare 18:0, cis-18:1, trans-18:1 and cis-18:2. Which chains look more kinked? Then switch among triacylglycerol, phospholipid and cholesterol to identify their different roles.',
   questions:[
    {q:'What does 18:2 indicate for a fatty acid?',options:['18 double bonds and 2 carbons','18 carbons and 2 double bonds','18 oxygens and 2 esters','Two glycerol molecules'],correct:1,why:'The first number is carbons, the second is carbon-carbon double bonds.'},
    {q:'Why does cis unsaturation tend to reduce fatty-acid packing?',options:['It adds positive charge','It introduces bends in the hydrocarbon chain','It turns tails into sugars','It removes all hydrogens'],correct:1,why:'Cis double bonds introduce bends that impede close packing.'},
    {q:'Which is most directly associated with concentrated energy storage?',options:['Triacylglycerol','Glycophorin','Cellulose','An ion channel'],correct:0,why:'Triacylglycerols are hydrophobic storage lipids found in lipid droplets.'}
   ],
   apply:{kind:'number',title:'Count the missing hydrogens',prompt:'At equal 18-carbon chain length, how many fewer hydrogens does an 18:2 fatty acid have compared with 18:0?',answer:4,tolerance:0,why:'Each carbon-carbon double bond replaces a single bond and removes two H atoms: 2 × 2 = 4.'},
   key:['C:D notation reports carbons and C=C bonds.','Cis double bonds create bends and usually weaken packing.','Triacylglycerols store energy; phospholipids are major membrane constituents.','Cholesterol is a sterol with a small polar OH and rigid rings.']
  },
  'membrane-organization':{
   intro:'A biological membrane is an asymmetric, dynamic lipid bilayer with embedded proteins. Amphipathic lipids assemble because their polar groups interact with water while hydrophobic tails are sheltered.',
   points:[
    'Phospholipid headgroups face the aqueous extracellular and cytosolic compartments; hydrocarbon tails occupy the bilayer interior. The arrangement minimizes exposure of nonpolar surfaces to water.',
    'Lipids undergo lateral diffusion, rotation and flexing. Transbilayer movement (flip-flop) is generally much slower without enzymes such as flippases or scramblases.',
    'At a given temperature, chains containing cis double bonds tend to pack less tightly than comparable saturated chains, often favoring greater disorder. Increasing temperature usually increases molecular motion.',
    'Cholesterol can buffer membrane order: it restricts tail motion at higher temperatures, yet can disrupt tight crystalline packing at lower temperatures. Its net influence depends on composition and conditions.',
    'Membrane asymmetry matters. For example, phosphatidylserine is normally enriched on the cytosolic leaflet of many animal plasma membranes; externalization can signal apoptosis.'
   ],
   callout:'Adjust the fraction of bent, cis-unsaturated tails and choose a temperature regime. The schematic illustrates molecular packing tendencies, not a calculated membrane fluidity.',
   caseStudy:{title:'Why cold matters',text:'Cells can alter lipid composition as temperatures change. A higher fraction of cis-unsaturated tails can help membranes avoid excessively ordered packing under cooler conditions.'},
   explore:'Move the cis-unsaturation slider from 0 to 100%. Compare the schematic at cool and warm temperatures. Which changes are qualitative tendencies rather than numerical predictions?',
   questions:[
    {q:'Which parts of a phospholipid bilayer contact water?',options:['Hydrocarbon tails','Polar headgroups','Only cholesterol rings','Only acyl carbonyls'],correct:1,why:'Polar headgroups are exposed to aqueous compartments; tails cluster inside.'},
    {q:'Which motion is generally slow without specific enzymes?',options:['Lateral diffusion','Tail rotation','Transbilayer flip-flop','Small flexing motions'],correct:2,why:'Moving a polar headgroup through the hydrophobic core is energetically unfavorable.'},
    {q:'Why is cholesterol not simply a universal fluidizer?',options:['It has no effect','It can order tails but also hinder tight low-temperature packing','It is a protein','It permanently freezes lipids'],correct:1,why:'Its ordering and packing effects depend on temperature and lipid composition.'}
   ],
   apply:{kind:'choice',title:'Predict the packing tendency',prompt:'At the same temperature and chain length, a membrane is enriched in cis-monounsaturated phospholipids instead of saturated ones. What is the most likely qualitative change?',options:['Hydrocarbon tails tend to pack less tightly','All flip-flop becomes instantaneous','The bilayer loses its aqueous-facing headgroups','Every lipid has identical melting temperature'],correct:0,why:'Cis double bonds typically create chain bends that disrupt close packing.'},
   key:['Bilayers form from amphipathic organization.','Lateral diffusion differs from flip-flop.','Cis unsaturation tends to reduce tight packing.','Cholesterol can both order and disrupt packing, depending on conditions.']
  },
  'membrane-transport':{
   intro:'Membranes are selective barriers. Passive transport follows a favorable chemical or electrochemical gradient, whereas active transport couples an unfavorable movement to another energy source.',
   points:[
    'Small nonpolar molecules such as O2 often cross the lipid bilayer by simple diffusion. Polar solutes and ions generally require transport proteins for useful fluxes.',
    'Facilitated diffusion through channels or carriers does not directly consume ATP and cannot, by itself, maintain net movement against the relevant electrochemical gradient.',
    'Primary active transport couples movement to energy sources such as ATP hydrolysis; secondary active transport couples an uphill movement to a favorable ion-gradient flow.',
    'For an uncharged solute, concentration alone determines the direction of the chemical driving force: passive net transport tends toward the lower concentration. For ions, voltage also contributes to electrochemical potential.',
    'Osmosis concerns water movement in response to differences in water chemical potential; aquaporins facilitate rapid water movement but do not themselves supply ATP.'
   ],
   callout:'Set concentrations on each side of a membrane for a hypothetical uncharged solute. Watch the predicted passive direction, then explore what an energy-coupled transporter would need to move the solute uphill.',
   caseStudy:{title:'Transport and intestinal glucose uptake',text:'Apical SGLT proteins couple glucose uptake to the sodium electrochemical gradient (secondary active transport). Basolateral GLUT proteins then mediate facilitated glucose exit down its gradient.'},
   explore:'Set outside to 5 mM and inside to 20 mM for an uncharged solute. Which way is passive net transport favored? What changes when concentrations match? Why would moving uphill require coupling?',
   questions:[
    {q:'For an uncharged solute at 20 mM inside and 5 mM outside, passive net movement is favored…',options:['Outside to inside','Inside to outside','Only into the nucleus','In neither direction for any molecule'],correct:1,why:'The net chemical driving force is from higher to lower concentration.'},
    {q:'Which process directly uses ATP hydrolysis in its transport cycle?',options:['Simple oxygen diffusion','Facilitated diffusion through GLUT','Primary ATP-driven pumping','Lateral lipid diffusion'],correct:2,why:'Primary active transporters can couple uphill transport to ATP hydrolysis.'},
    {q:'Why can ionic transport not be predicted from concentration alone?',options:['Ions have no charge','Membrane voltage also contributes to electrochemical driving force','Ions cannot cross channels','A bilayer has no water'],correct:1,why:'An ion responds to both chemical and electrical gradients.'}
   ],
   apply:{kind:'choice',title:'Interpret a concentration gradient',prompt:'An uncharged solute is at 5 mM outside and 20 mM inside. What is the favored direction of net passive flux?',options:['Outside → inside','Inside → outside','Neither direction because both are nonzero','Only through an ATP pump'],correct:1,why:'Passive net flux goes from high (inside) to low (outside) concentration.'},
   key:['Passive transport follows a favorable gradient.','Channels/carriers can accelerate passive flux without pumping uphill.','ATP coupling can support active uphill transport.','Ion transport requires electrochemical, not just chemical, reasoning.']
  },
  'membrane-proteins':{
   intro:'Membrane proteins use hydrophobic surfaces, transmembrane helices, beta barrels, peripheral contacts or covalent lipid anchors to occupy specific positions in or near membranes.',
   points:[
    'Integral membrane proteins insert into the bilayer. Single-pass proteins typically traverse it once; multipass proteins cross several times using hydrophobic helices or, in certain membranes, beta barrels.',
    'Peripheral membrane proteins associate noncovalently with lipid headgroups or other membrane proteins but do not cross the hydrophobic core themselves.',
    'Lipid-anchored proteins are attached to covalently linked lipid groups. The anchor inserts into one leaflet, while the protein domain remains on the corresponding aqueous side.',
    'Protein topology specifies which domains face each compartment. The extracellular/lumenal and cytosolic orientations are generally preserved during trafficking through the secretory pathway.',
    'Transmembrane proteins can serve as channels, transporters, receptors, enzymes or scaffolds. A cartoon depicting transmembrane spans does not specify a unique 3D fold or transport mechanism.'
   ],
   callout:'Select single-pass, multipass, peripheral and lipid-anchored proteins. Observe how each associates with the bilayer, and identify where its aqueous domains are exposed.',
   caseStudy:{title:'Why topology matters for cell signaling',text:'A cell-surface receptor may bind a ligand extracellularly while its cytosolic domain recruits signaling partners. These regions stay on distinct sides of the lipid bilayer.'},
   explore:'Switch among the four protein types. Which class truly crosses the bilayer, which contacts only one face, and which remains attached by a lipid anchor?',
   questions:[
    {q:'A protein held at the membrane by noncovalent interactions with a lipid headgroup is usually described as…',options:['Peripheral','Multipass transmembrane','A carbohydrate polymer','An integral beta barrel'],correct:0,why:'Peripheral proteins attach without traversing the bilayer.'},
    {q:'A protein that traverses the bilayer repeatedly is…',options:['A single-pass membrane protein','A multipass integral membrane protein','Always a soluble protein','A triacylglycerol'],correct:1,why:'Multipass proteins contain multiple bilayer-spanning segments.'},
    {q:'A covalently attached membrane lipid primarily provides…',options:['A lipid anchor in a membrane leaflet','A peptide bond between two proteins','A glycosidic bond','A DNA sequence'],correct:0,why:'The hydrophobic anchor embeds in one leaflet while the protein remains aqueous-exposed.'}
   ],
   apply:{kind:'choice',title:'Classify a transport protein',prompt:'A membrane protein contains 12 hydrophobic transmembrane helices that create a pathway for solute exchange. How would you classify it?',options:['Peripheral soluble protein','Multipass integral membrane protein','Triacylglycerol','Proteoglycan'],correct:1,why:'Multiple transmembrane helices identify a multipass integral membrane protein.'},
   key:['Integral proteins cross or embed within the bilayer.','Peripheral proteins bind to a membrane face without crossing the core.','Lipid anchors attach proteins to one leaflet.','Topology determines extracellular versus cytosolic function.']
  }
 }
};

export const chapterIntroductions={
 7:'From a single stereocenter to an elaborate cell-surface glycan: understand how carbohydrate connectivity encodes biological function.',
 8:'Explore the chemistry of lipids, why bilayers form, and how membrane proteins direct transport and cellular communication.'
};
