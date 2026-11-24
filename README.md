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
