# Biochemistry Learning Platform

A modular **undergraduate biochemistry learning platform** with a 28-chapter textbook outline, a reusable interactive-tool library, and a metabolic pathway explorer. Built with React and Vite, deployed with GitHub Pages.

## What works today (v0.2)

**Course navigation**
- Home dashboard and all six textbook parts (28 chapter titles).
- Clickable chapter-outline previews for chapters not yet implemented.
- A main Interactive Tools library, Metabolic Pathway Explorer directory, Practice, local Progress, and Reference Library pages.
- Direct links using URL hashes so GitHub Pages deep links can be refreshed.

**Chapter 4 — Amino Acids and Their Properties**
- **Preserved from v0.1**, including Learn, Explore, Practice, Apply, Review.
- Its glycine pH explorer, quiz, pI exercise, and original local progress storage remain available from the Textbook / Chapter 4 view.

**Metabolic Pathway Explorer**
- A reusable pathway directory grouped by carbohydrate, energy, lipid, amino acid, and nucleotide metabolism.
- **Glycolysis — first working example:** 10 reactions, 11 named metabolites, actual enzyme identities, a clickable/zoomable/pannable SVG reaction map, reaction/metabolite detail panel, guided step navigation, challenge questions, and ATP/NADH bookkeeping.
- Chemistry model explicitly represents the step-4 split to DHAP + G3P and step-5 DHAP conversion to G3P. Steps 6–10 use a multiplicity of two per starting glucose.
- Selected reactions and practice responses can be saved locally. Future pathway cards open transparent **planned** previews; they are not working simulations.

**Future modules (not yet built)** include gluconeogenesis, pyruvate oxidation, citric acid cycle, pentose phosphate pathway, glycogen metabolism, fatty acid metabolism, urea cycle, nucleotide metabolism, enzyme kinetics, molecular structures, and more. The platform outlines their location and chapter associations.

## Run locally

Node.js 22 (or compatible Node 20+) and npm:

```bash
npm install
npm run test:content
npm run dev
npm run build
```

Open the local URL printed by Vite after `npm run dev`.

## Key files

| Location | Purpose |
| --- | --- |
| `src/Platform.jsx` | Overall navigation, textbook catalog, tool library, progress and placeholder pages |
| `src/courseCatalog.js` | Editable 28-chapter outline, tool registry, pathway categories, and future pathways |
| `src/Chapter4.jsx` | Original Chapter 4 component, preserved from the initial release |
| `src/chapter4.js` | Original Chapter 4 lesson content and questions |
| `src/metabolism/pathways.js` | Pathway data contract and glycolysis metabolite/reaction definitions |
| `src/metabolism/PathwayCanvas.jsx` | Generic canvas interaction, SVG positions, pan, zoom, and selection |
| `src/metabolism/MetabolicExplorer.jsx` | Explorer modes, detail panels, energy accounting, and questions |
| `src/platform.css` | New platform and explorer styling |
| `src/styles.css` | Original Chapter 4 styling |
| `scripts/check-content.mjs` | Data-contract checks for chapter catalog and glycolysis energy accounting |

### Adding another metabolic pathway

1. Add its entry to `pathwayCatalog` in `src/courseCatalog.js`.
2. Add a structured module with **stable metabolite and reaction IDs**, substrate and product references, stoichiometry, compartment, and phase/energy conventions where relevant.
3. Add a readable pathway layout. Avoid automatically treating ATP, water, and ubiquitous cofactors as network links.
4. Link the new module to the Explorer router and relevant textbook chapters.
5. Add validation tests for that pathway's reactions and conservation relationships.

The current SVG positions are **glycolysis-specific**; the UI and pathway data structure can be extended to accept separate layouts for future pathways. Full inter-pathway network rendering is **not yet implemented**.

## Scientific scope

This is an undergraduate **educational schematic**, not a detailed reaction- or atom-balanced network database and not a quantitative kinetic/flux simulator. Reaction equations omit some proton/water balancing details for readability. The stage-by-stage ATP and NADH totals are per **one original glucose**, not per one triose.

Sources for reviewing glycolysis:
- [NCBI Bookshelf — Biochemistry, Glycolysis](https://www.ncbi.nlm.nih.gov/books/NBK482303/)
- [Reactome — Glycolysis (human)](https://reactome.org/content/detail/R-HSA-70171)

Prior to classroom use, instructors should review data and explanations for their course context.

## Deployment

The Vite base path is `/biochemistry-learning-platform/`, and GitHub Actions deploys it to GitHub Pages (configured under Settings → Pages to use GitHub Actions).

Expected site: https://sharears.github.io/biochemistry-learning-platform/

Progress is stored only in browser `localStorage`. There are **no student accounts, instructor accounts, server-side grades, or cross-device synchronization**. Do not rely on it for official course records without an appropriate privacy, security, accessibility, and university policy review.


## v0.3 — Topic-first course structure (November 2026)

This revision implements **Part → Chapter → Topic** in the left sidebar and puts
**Learn · Explore · Practice · Apply · Review tabs INSIDE each topic**.

- Every chapter has an editable topic outline in \`src/topicCatalog.js\`. Planned chapters display topic pages honestly marked as planned.
- Chapter 4 now opens a chapter index listing **five fully interactive amino-acid topics**. Each topic has five working learning stages, its own practice questions, an application problem, and review checkboxes.
- In Learn, interactive chemistry is embedded next to the explanations. The same interactive components are reused in Explore for independent investigation.
- **2D connectivity and rotatable 3D ball-and-stick models of all 20 standard free amino acids**, generated offline from RDKit depictions/ETKDG conformers. The 3D conformers are illustrative and computational, not experimentally determined. Explicit H and stereochemical wedge/dash bonds are not drawn in 2D.
- Topic modules include side-chain comparisons, acid-base pH/charge exploration, a peptide-sequence builder, and side-chain modification comparisons.
- Student responses and marked stages save to browser \`localStorage\` under \`biochem-topics-v1\` (no account or cloud sync). The original Chapter 4 files remain in the repository and its older \`biochem-chapter4-v1\` progress is preserved but not automatically migrated.
- Glycolysis is accessible from **Chapter 14 → Glycolysis reaction pathway → Learn**, while old direct tool URLs continue to work as compatibility links. The metabolic pathway implementation was not replaced.
- The navigation no longer requires a standalone Interactive Tools menu; components are reusable code and appear in relevant learning topics.

**Source files:** \`src/amino/AminoChapter.jsx\`, \`src/amino/MoleculeViewer.jsx\`,
\`src/amino/aminoData.js\`, \`src/amino/moleculeGraphs.js\`, \`src/amino/amino.css\`, and \`src/topicCatalog.js\`.

This is still a teaching prototype. Its 3D conformers show an example geometry, not the distribution of molecular conformations in solution. Its simple acid-base calculations are for free amino acids, not peptide residues or experimental titration curves.


## v0.4 — Two interactive improvements (November 2026)

- **Topic 4.2 — Compare two amino acids:** students can select any two of the 20 standard amino acids, swap them, and switch both molecule canvases between 2D and rotatable 3D. A comparison table shows side-chain chemistry, polarity, common charge near pH 7, and characteristic properties. The original individual amino-acid browser remains inside an optional expandable section.
- **Topic 4.3 — pH presets:** one-click pH 2, 7, and 12 buttons work alongside the existing slider. The explanatory panel updates with each amino acid and pH, describing α-carboxyl/α-amino protonation and (where modeled) side-chain behavior, with fractions and computed average net charge.

The presets are shortcuts to the existing free-amino-acid equilibrium model, not experimentally measured curves. The charge labels in the comparison table are approximations for **side chains near pH 7**, not whole molecular charge.


## v0.5 — Explain charge and visualize pH-dependent structure (November 2026)

Topic 4.3 now teaches charge and structure in the **same existing interactive pH lab**:

1. Directly under the pH slider, a **2D / rotatable 3D amino acid viewer** uses the existing molecular graphs and highlights each ionizable atom using its predominant protonation state (e.g., NH₃⁺ ↔ NH₂, OH ↔ O⁻). This supports glycine, alanine, aspartate, glutamate, lysine, arginine, histidine, cysteine, and tyrosine—the nine free amino acids already supported by the lab. The group table shows both protonated and deprotonated percentages, and warns when populations are mixed near pKa.
2. Below the Average Net Charge result, the expandable **“How is this calculated?”** panel shows Henderson–Hasselbalch equations, numeric substitution at the current pH, charge contribution from each group, a final sum, and how estimated pI is obtained. All values follow the slider and amino-acid selection without page reload.

Important: the molecular viewer shows one representative **predominant microstate**, which has an integer formal charge, while the reported average net charge is **fractional**, weighted over an ensemble. Acidic/basic site pKa values are approximate and assumed independent. The 3D coordinates are illustrative conformers and are *not* reoptimized when protonation changes. Arg and His ring annotations depict one possible formal resonance/tautomer representation.

Code: \`src/amino/protonation.js\`, \`src/amino/IonizationStructure.jsx\`, and \`src/amino/ChargeCalculation.jsx\`. Additional calculations and atom mapping tests are in \`scripts/check-content.mjs\`.


## v0.6 — Chapters 7 and 8: carbohydrates, lipids and membranes

The Part II curriculum now has three full chapter modules: **Chapter 4 Amino Acids**, **Chapter 7 Carbohydrates and Glycobiology**, and **Chapter 8 Lipids and Biological Membranes**.

**Chapter 7 (four topics):**
- Monosaccharides and stereochemistry: compare D-glucose, D-mannose and D-galactose, show Fischer/Haworth conventions, and toggle alpha/beta anomers.
- Glycosidic linkages: compare maltose, cellobiose, lactose and sucrose, with linkage naming and reducing-end behavior.
- Polysaccharides: interactive structural comparison of amylose, amylopectin, glycogen and cellulose.
- Glycoconjugates: inspect N-linked and O-linked glycoproteins, proteoglycans and glycolipids.

**Chapter 8 (four topics):**
- Fatty acids and lipid classes: compare saturated, cis/trans unsaturated chains and common lipid classes.
- Membrane organization: explore tail saturation and temperature in a conceptual bilayer-packing schematic.
- Membrane transport: change solute concentrations to reason about passive and energy-coupled uphill transport.
- Membrane proteins: compare single-pass, multipass, peripheral and lipid-anchored topologies.

Every topic has five stages: **Learn** (substantive core content, a biochemistry case study, embedded guided interactive), **Explore** (free interactive + investigation prompt), **Practice** (three questions with feedback), **Apply** (a chemical reasoning exercise), and **Review** (self-assessment). Stage progress, practice answers, applications and review checkboxes persist in the same browser-local storage contract as Chapter 4. The textbook, Home, Practice and My Progress pages link to the newly implemented chapters.

The structural and membrane diagrams are educational schematics. They are not atom-complete structures or numerical simulations of membrane physical properties. The course still contains 28 chapters; Chapters 17 and 18 about carbohydrate/lipid **metabolism** remain separate planned modules.

Code lives in \`src/biomolecules/\` and is checked by \`scripts/check-content.mjs\`.
