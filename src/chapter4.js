// Edit this file to expand Chapter 4 without changing the application layout.
export const chapter={
  number:'04',title:'Amino Acids and Their Properties',
  part:'PART II · STRUCTURE AND FUNCTION OF BIOMOLECULES',
  description:'Explore the chemical building blocks of proteins and learn how their structures influence biological function.',
  sections:[
    {id:'learn',label:'Learn',subtitle:'Read and understand'},
    {id:'explore',label:'Explore',subtitle:'Experiment with ideas'},
    {id:'practice',label:'Practice',subtitle:'Check what you know'},
    {id:'apply',label:'Apply',subtitle:'Solve a real problem'},
    {id:'review',label:'Review',subtitle:'Reflect on your learning'}
  ],
  topics:[
    {number:'4.1',title:'Structure and classification of amino acids',text:'Most amino acids found in proteins contain an alpha carbon bonded to an amino group, a carboxyl group, a hydrogen atom, and a variable R group. The R group helps determine each amino acid’s properties.',future:'Add labeled molecular structures, stereochemistry, and individual amino acid cards.'},
    {number:'4.2',title:'Properties of amino acid side chains',text:'Side chains differ in size, polarity, hydrophobicity, charge, and hydrogen-bonding ability. These properties help determine how proteins fold and interact.',future:'Add all 20 side chains with comparisons and structure visualizations.'},
    {number:'4.3',title:'Ionization, pKa, and isoelectric point',text:'Ionizable groups gain or lose protons as pH changes. Their pKa values help predict charge states. At the isoelectric point (pI), the average net charge is zero.',future:'Add examples with ionizable side chains and titration curves.'},
    {number:'4.4',title:'Peptide bonds and polypeptides',text:'Amino acids join through peptide (amide) bonds to form polypeptides. Resonance gives the peptide bond partial double-bond character and limits its rotation.',future:'Add peptide diagrams, backbone geometry, and sequence exercises.'},
    {number:'4.5',title:'Nonstandard amino acids and modifications',text:'Some protein residues are chemically modified, for example through phosphorylation of serine, threonine, or tyrosine. These changes can regulate activity and interactions.',future:'Add modification examples, biological roles, and case studies.'}
  ],
  categories:[
    ['Nonpolar aliphatic','Ala, Val, Leu, Ile','Often support hydrophobic packing'],
    ['Polar uncharged','Ser, Thr, Asn, Gln','Often participate in hydrogen bonding'],
    ['Acidic','Asp, Glu','Usually negatively charged near neutral pH'],
    ['Basic','Lys, Arg','Usually positively charged near neutral pH'],
    ['Aromatic','Phe, Tyr, Trp','Contain aromatic rings']
  ],
  quiz:[
    {id:'q1',q:'What distinguishes one standard amino acid from another?',options:['The alpha carbon','The R group','The peptide bond','The backbone nitrogen'],correct:1,why:'The side chain (R group) differs and provides many of an amino acid’s characteristic properties.'},
    {id:'q2',q:'Which side chain is commonly negatively charged near neutral pH?',options:['Valine','Aspartate','Leucine','Asparagine'],correct:1,why:'Aspartate has a carboxylate side chain that is typically deprotonated near neutral pH.'},
    {id:'q3',q:'What type of bond connects amino acids in a polypeptide?',options:['Glycosidic','Disulfide','Phosphodiester','Peptide (amide)'],correct:3,why:'A peptide bond is an amide linkage between successive amino acid residues.'}
  ],
  application:{question:'Glycine has approximate pKa values of 2.34 (carboxyl group) and 9.60 (ammonium group). Calculate its isoelectric point (pI) to two decimal places.',hint:'Glycine has no ionizable side chain. Average the two pKa values.',answer:5.97,solution:'pI = (2.34 + 9.60) / 2 = 5.97.'},
  objectives:['Recognize the shared structural features of amino acids.','Compare the properties of amino acid side chains.','Explain how pH affects ionization and charge.','Describe the formation and properties of peptide bonds.']
};
