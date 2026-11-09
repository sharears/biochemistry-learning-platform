# Biochemistry Learning Platform

A modular undergraduate biochemistry course prototype. The first implemented module is **Chapter 4 — Amino Acids and Their Properties**.

## The five learning stages

- **Learn:** Five subsection outlines (4.1–4.5), starter explanations and a side-chain reference table.
- **Explore:** A working pH-dependent glycine charge-state demonstration.
- **Practice:** Three multiple-choice questions with immediate feedback.
- **Apply:** An isoelectric-point calculation with a hint and answer check.
- **Review:** Learning-objective checklist, quiz summary, and progress reset.

The content is deliberately introductory. Each stage includes a place for future material.

## Run locally

Requires Node.js 20 or later. Clone the repository and run:

1. npm install
2. npm run dev
3. npm run build (to produce a deployment build)

## Expand the course

- Edit `src/chapter4.js` for lesson text, questions, objectives, and examples.
- Edit `src/main.jsx` for user interactions and section layout.
- Edit `src/styles.css` for visual styling.

Progress and selected answers are saved in browser localStorage. **There are no student accounts, backend, or cross-device synchronization yet.** It is a student-facing prototype, not a graded course system.

## GitHub Pages

The app is configured to deploy under the repository path `/biochemistry-learning-platform/`. An Actions workflow is included. In repository **Settings → Pages**, choose **GitHub Actions** as the source (if available on your plan) and run the deployment workflow. Expected URL once deployed: https://sharears.github.io/biochemistry-learning-platform/.

**Note:** GitHub Pages availability for a private repository depends on the account plan. Publishing the repository or using another static host may be necessary. Check university accessibility and student-privacy requirements before collecting identifiable learning records.
