/**
 * Free standard amino acids, represented at approximately neutral aqueous pH.
 * pKa values are illustrative textbook values for FREE amino acids; exact
 * values depend on temperature, ionic strength, and molecular environment.
 */
const raw=[
 ['A','Ala','Alanine','nonpolar','Methyl (-CH3)','Small hydrophobic side chain','A useful simple example of an L-alpha amino acid.'],
 ['R','Arg','Arginine','positive','Guanidinium','Basic, strongly protonated near neutral pH','Often contributes to electrostatic interactions with phosphates.'],
 ['N','Asn','Asparagine','polar','Carboxamide','Polar, uncharged amide','Can form multiple hydrogen bonds.'],
 ['D','Asp','Aspartate','negative','Carboxylate','Acidic side chain','Typically negatively charged near neutral pH.'],
 ['C','Cys','Cysteine','special','Thiol (-SH)','Reactive sulfur-containing group','Two cysteine residues can form a disulfide bond under oxidizing conditions.'],
 ['Q','Gln','Glutamine','polar','Carboxamide (longer)','Polar, uncharged amide','Has an extra methylene group compared with asparagine.'],
 ['E','Glu','Glutamate','negative','Carboxylate (longer)','Acidic side chain','Typically negatively charged near neutral pH.'],
 ['G','Gly','Glycine','special','Hydrogen (-H)','Smallest amino acid, achiral','The alpha carbon bears two hydrogens, so glycine is not chiral.'],
 ['H','His','Histidine','positive','Imidazole','Titratable near physiological pH','An imidazole ring can donate or accept protons in enzyme active sites.'],
 ['I','Ile','Isoleucine','nonpolar','Branched aliphatic','Hydrophobic, beta-branched','Has two stereogenic centers in its standard L form.'],
 ['L','Leu','Leucine','nonpolar','Branched aliphatic','Hydrophobic','Frequently contributes to nonpolar packing.'],
 ['K','Lys','Lysine','positive','Terminal ammonium','Basic, positively charged near neutral pH','Can form salt bridges; amino side chain is a site of modification.'],
 ['M','Met','Methionine','nonpolar','Thioether','Hydrophobic sulfur-containing side chain','Its sulfur is part of a thioether, not a thiol.'],
 ['F','Phe','Phenylalanine','aromatic','Phenyl','Hydrophobic aromatic','Aromatic ring participates in hydrophobic packing.'],
 ['P','Pro','Proline','special','Cyclic pyrrolidine','Backbone-constraining cyclic residue','Its side chain connects to the backbone nitrogen.'],
 ['S','Ser','Serine','polar','Hydroxymethyl (-CH2OH)','Polar hydroxyl-containing','Can be phosphorylated in proteins.'],
 ['T','Thr','Threonine','polar','Hydroxyethyl','Polar, beta-branched','Can be phosphorylated; has a second stereogenic center.'],
 ['W','Trp','Tryptophan','aromatic','Indole','Large aromatic side chain','Indole can participate in stacking and hydrogen bonding.'],
 ['Y','Tyr','Tyrosine','aromatic','Phenol','Aromatic with an ionizable phenolic OH','Can be phosphorylated in proteins.'],
 ['V','Val','Valine','nonpolar','Isopropyl','Hydrophobic, beta-branched','Often found in buried hydrophobic environments.']
];
export const aminoAcids=raw.map(([one,three,name,category,sidechain,property,note])=>({one,three,name,category,sidechain,property,note}));
export const aminoByLetter=Object.fromEntries(aminoAcids.map(a=>[a.one,a]));
export const aaGroups=[
 {id:'nonpolar',name:'Nonpolar aliphatic',summary:'Predominantly hydrophobic side chains. This teaching grouping excludes Gly, Pro, and Cys, which are highlighted as special cases.'},
 {id:'polar',name:'Polar uncharged',summary:'Side chains containing hydrogen-bond donors or acceptors without a typical formal charge at pH 7.'},
 {id:'negative',name:'Acidic / negative',summary:'Asp and Glu have carboxylate groups that are usually deprotonated near neutral pH.'},
 {id:'positive',name:'Basic / titratable',summary:'Lys and Arg are mostly positive near neutral pH. Histidine is often partly protonated and environment dependent.'},
 {id:'aromatic',name:'Aromatic',summary:'Phe, Tyr, and Trp contain aromatic rings; their polarity and reactivity differ.'},
 {id:'special',name:'Special structural chemistry',summary:'Gly, Pro, and Cys are highlighted separately for their distinctive features.'}
];

export const aminoLesson={
 structure:{
  intro:'An alpha amino acid contains an amino group, a carboxyl group, an alpha carbon, and a side chain. At physiological pH, many free amino acids occur predominantly as zwitterions.',
  points:[
   'The side chain (R group) differentiates the amino acids. Glycine has R = H; alanine has R = CH3.',
   'With glycine as the exception, standard alpha amino acids possess a chiral alpha carbon. Proteins overwhelmingly use L amino acids.',
   'L/D designation refers to configuration relative to glyceraldehyde, not to the direction of optical rotation. Most L amino acids are S by CIP rules, but L-cysteine is R.',
   'The free amino acid has an amino and carboxyl terminus. Within a polypeptide, backbone groups form peptide bonds and have different chemistry.'
  ],
  callout:'Rotate the 3D ball-and-stick model or select atoms in the 2D view. Coordinates are illustrative computational conformers, not experimental structures.',
  questions:[
   {q:'Which standard proteinogenic amino acid does not have a chiral alpha carbon?',options:['Alanine','Glycine','Serine','Cysteine'],correct:1,why:'Glycine has two hydrogens bonded to Cα.'},
   {q:'What determines the distinct chemical identity of standard alpha amino acids?',options:['Their backbone carboxyl group','Their R groups','Their peptide bonds','The common alpha carbon'],correct:1,why:'Amino acids share a backbone; their side chains provide distinct properties.'}
  ],
  apply:{kind:'choice',title:'Reason about a substitution',prompt:'An alanine residue is replaced with glycine. Which structural change is the best first prediction?',options:['The alpha carbon becomes achiral and side-chain steric bulk decreases','The alpha carbon becomes more chiral','A charged side chain is introduced','A peptide bond disappears'],correct:0,why:'Replacing a methyl side chain with H removes Cα chirality and reduces steric bulk.'},
  key:['All standard proteinogenic alpha amino acids share a core backbone.','Glycine is achiral; proline has a side-chain/backbone-N ring.','2D connectivity and 3D conformation reveal complementary information.']
 },
 'side-chains':{
  intro:'Side-chain chemistry influences solubility, folding, recognition, and catalysis. Categories are teaching aids; several properties overlap.',
  points:[
   'Nonpolar side chains favor hydrophobic packing, but whether a residue is buried depends on protein structure and environment.',
   'Ser, Thr, Asn, and Gln are common polar uncharged residues; Asp and Glu are usually negative near neutral pH.',
   'Lys and Arg are generally positive at pH 7; histidine has an imidazole pKa near neutrality and changes state more readily.',
   'Tyr is both aromatic and polar; Cys contains a reactive thiol. Classification is more useful as overlapping properties than as rigid boxes.'
  ],
  callout:'Select among all 20 amino acids, filter by side-chain class, and compare their molecular structures and annotated properties.',
  questions:[
   {q:'Which pair is generally negatively charged near neutral pH?',options:['Asp and Glu','Leu and Ile','Ser and Thr','Phe and Trp'],correct:0,why:'Aspartate and glutamate contain ionizable carboxyl side chains.'},
   {q:'Which amino acid contains a thiol group?',options:['Methionine','Cysteine','Valine','Asparagine'],correct:1,why:'Cysteine bears an -SH group; methionine has a thioether.'}
  ],
  apply:{kind:'choice',title:'Predict an interaction',prompt:'A protein pocket has a negatively charged glutamate side chain. Which amino acid is most likely to form an attractive salt bridge near pH 7?',options:['Lysine','Leucine','Glycine','Phenylalanine'],correct:0,why:'Lysine has a positively charged ammonium side chain that can interact with glutamate carboxylate.'},
  key:['Know the 20 names and one-letter/three-letter codes.','Charge is pH- and environment-dependent.','Hydrophobic, polar, aromatic, and special categories can overlap.']
 },
 ionization:{
  intro:'Each ionizable group exists in a pH-dependent protonation equilibrium. pKa is the pH at which the protonated and deprotonated forms of that group have equal population.',
  points:[
   'Below the relevant pKa a group is more protonated; above it, more deprotonated.',
   'An amino group contributes approximately +1 when protonated, while a carboxylate contributes approximately -1 when deprotonated.',
   'The isoelectric point (pI) is the pH at which the mean net charge of a free amino acid is zero.',
   'For amino acids with titratable side chains, the pI does NOT always equal the average of the backbone pKa values.'
  ],
  callout:'Move the pH slider to see the modeled average charge of a free amino acid. Compare glycine, aspartate, lysine, and histidine.',
  questions:[
   {q:'At pH well above a carboxyl pKa, the group is mainly…',options:['COOH','COO−','NH3+','Neutral amide'],correct:1,why:'Carboxyl groups lose H+ above their pKa and become carboxylates.'},
   {q:'The isoelectric point is defined by…',options:['Equal amino and carboxyl pKa values','Zero average net molecular charge','Maximum positive charge','Complete absence of protons'],correct:1,why:'The average net charge is zero at pI, though individual microspecies can be charged.'}
  ],
  apply:{kind:'pi',title:'Calculate glycine pI',prompt:'Using the free glycine pKa values 2.34 (carboxyl) and 9.60 (ammonium), calculate pI to two decimal places.',answer:5.97,why:'For glycine, pI = (2.34 + 9.60) / 2 = 5.97.'},
  key:['pH relative to pKa predicts protonation tendency.','Ionizable side chains change the charge-versus-pH curve.','pI is not the same thing as physiological pH.']
 },
 peptides:{
  intro:'Amino acids join through amide (peptide) bonds between the alpha-carboxyl group of one residue and the alpha-amino group of the next. Polypeptides have an N-to-C direction.',
  points:[
   'A polypeptide with n amino acid residues has n - 1 peptide bonds when it is linear and unbranched.',
   'Peptide bond resonance gives restricted rotation and a nearly planar peptide unit; rotations about phi and psi determine backbone conformations.',
   'Sequence notation is written from N terminus to C terminus. The amino acid side chains are not consumed to form the usual peptide backbone.',
   'For free peptide charge calculations, ionizable N/C termini and side chains contribute; internal backbone amides are not treated as free ammonium and carboxylate groups.'
  ],
  callout:'Build a short sequence and count its peptide bonds. The sequence diagram is a schematic backbone, not an atom-complete molecular structure.',
  questions:[
   {q:'How many peptide bonds are in a linear tetrapeptide?',options:['2','3','4','5'],correct:1,why:'A linear chain of four residues has three connecting peptide bonds.'},
   {q:'Standard polypeptide sequences are read in which direction?',options:['C to N','N to C','Either with no convention','3′ to 5′'],correct:1,why:'Protein sequence notation runs from amino (N) terminus to carboxyl (C) terminus.'}
  ],
  apply:{kind:'bonds',title:'Connect residues',prompt:'If you join six amino acid residues into one linear unbranched peptide, how many peptide bonds are formed?',answer:5,why:'n - 1 = 6 - 1 = 5 peptide bonds.'},
  key:['Peptide bonds link consecutive residues.','The backbone has N→C directionality.','The peptide group is resonance-stabilized and approximately planar.']
 },
 modifications:{
  intro:'Biochemical function can be tuned by modifying amino acid residues after translation. Certain nonstandard amino acids can also be inserted during translation.',
  points:[
   'Phosphorylation of Ser, Thr, or Tyr introduces a phosphate group and often changes local charge and molecular recognition.',
   'Hydroxylation of proline residues contributes to collagen stability in specific protein contexts.',
   'Lysine acetylation neutralizes the positive charge of its side-chain ammonium in the modified form.',
   'Selenocysteine is a genetically encoded noncanonical amino acid in certain proteins, introduced using specialized translation machinery.'
  ],
  callout:'Choose a modification to compare the unmodified residue with the modified chemical group and its typical consequences.',
  questions:[
   {q:'Which residues are common targets for protein phosphorylation?',options:['Ser, Thr, and Tyr','Only Gly','Only Ala and Val','Only Asp and Glu'],correct:0,why:'Serine, threonine, and tyrosine hydroxyl groups are common phosphorylation targets.'},
   {q:'Acetylation of the ε-amino group of lysine generally does what to its charge?',options:['Makes it more positive','Neutralizes its usual positive charge','Creates a negative phosphate','Leaves the ammonium group unchanged'],correct:1,why:'Nε-acetyllysine contains a neutral amide instead of a protonated primary amine.'}
  ],
  apply:{kind:'choice',title:'Predict the effect of a modification',prompt:'A lysine side chain in a histone is acetylated. What is the most direct chemical consequence?',options:['Loss of its usual positive side-chain charge','Formation of a disulfide bridge','Creation of a carboxylate side chain','Hydrolysis of the peptide backbone'],correct:0,why:'Acetylation converts lysine’s terminal amine into an amide, reducing electrostatic attraction to negatively charged DNA.'},
  key:['Modification changes chemistry without necessarily changing the encoded primary sequence.','Phosphorylation, acetylation, and hydroxylation are distinct transformations.','Selenocysteine is noncanonical but genetically encoded in selected organisms.']
 }
};
export const modifications=[
 {id:'phosphoserine',title:'Serine phosphorylation',before:'Ser–CH2–OH',after:'Ser–CH2–O–PO3 (ionized at neutral pH)',effect:'Adds a phosphate group, typically increasing negative charge and altering interactions.',residue:'Ser'},
 {id:'acetyllysine',title:'Lysine acetylation',before:'Lys–(CH2)4–NH3+',after:'Lys–(CH2)4–NH–CO–CH3',effect:'Replaces a positively charged side-chain ammonium group with a neutral amide.',residue:'Lys'},
 {id:'hydroxyproline',title:'Proline hydroxylation',before:'Proline pyrrolidine ring',after:'Hydroxylated proline ring',effect:'Can increase collagen stability by altering local stereoelectronic and hydration effects.',residue:'Pro'},
 {id:'selenocysteine',title:'Selenocysteine incorporation',before:'Cysteine –CH2–SH',after:'Selenocysteine –CH2–SeH',effect:'Introduces selenium-containing chemistry; genetically encoded at certain recoded UGA codons.',residue:'Cys'}
];
export const ionizationExamples={
 G:{carboxyl:2.34,amino:9.60},
 A:{carboxyl:2.34,amino:9.69},
 D:{carboxyl:1.88,amino:9.60,side:{type:'acid',pKa:3.65}},
 E:{carboxyl:2.19,amino:9.67,side:{type:'acid',pKa:4.25}},
 K:{carboxyl:2.18,amino:8.95,side:{type:'base',pKa:10.53}},
 R:{carboxyl:2.17,amino:9.04,side:{type:'base',pKa:12.48}},
 H:{carboxyl:1.82,amino:9.17,side:{type:'base',pKa:6.00}},
 C:{carboxyl:1.96,amino:10.28,side:{type:'acid',pKa:8.18}},
 Y:{carboxyl:2.20,amino:9.11,side:{type:'acid',pKa:10.07}}
};
export const acidFraction=(ph,pKa)=>1/(1+10**(pKa-ph));
export const baseFraction=(ph,pKa)=>1/(1+10**(ph-pKa));
export function netCharge(letter,ph){
 const p=ionizationExamples[letter]||ionizationExamples.G;
 return baseFraction(ph,p.amino)-acidFraction(ph,p.carboxyl)+
 (p.side?(p.side.type==='base'?baseFraction(ph,p.side.pKa):-acidFraction(ph,p.side.pKa)):0);
}
export function isoelectricPoint(letter){
 let a=0,b=14;for(let i=0;i<80;i++){let mid=(a+b)/2;if(netCharge(letter,mid)>0)a=mid;else b=mid;}return(a+b)/2;
}


/** Guided checkpoints for the free-amino-acid ionization lab. */
export const phPresets=[2,7,12];
export function explainChargeAtPh(letter,ph){
 const p=ionizationExamples[letter]||ionizationExamples.G;
 const carbox=acidFraction(ph,p.carboxyl)*100;
 const amine=baseFraction(ph,p.amino)*100;
 const groupStatus=(value,pKa,above,below)=>{
  if(Math.abs(value-pKa)<.15)return 'about equally '+above+' and '+below;
  return value>pKa?'mostly '+above:'mostly '+below;
 };
 const carboxState=groupStatus(ph,p.carboxyl,'COO−','COOH');
 const amineState=groupStatus(ph,p.amino,'NH₂','NH₃⁺');
 const side=p.side?(
  p.side.type==='acid'
   ?'Side-chain carboxyl/thiol/phenol group: about '+Math.round(acidFraction(ph,p.side.pKa)*100)+'% deprotonated at this pH.'
   :'Basic side chain: about '+Math.round(baseFraction(ph,p.side.pKa)*100)+'% protonated at this pH.'
 ):'This example has no ionizable side chain in the model.';
 const net=netCharge(letter,ph);
 return {
  carboxylPercent:Math.round(carbox),
  aminoPercent:Math.round(amine),
  netCharge:net,
  summary:'At pH '+ph.toFixed(1)+', the α-carboxyl group is '+carboxState+', while the α-amino group is '+amineState+'. '+side+
   ' Together these populations produce an estimated average net charge of '+(net>0?'+':'')+net.toFixed(2)+'.',
 };
}
