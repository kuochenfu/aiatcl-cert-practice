# AIATCL Cert Practice

TypeScript-native practice page for the AIATCL literacy certification format.

Live demo:

https://kuochenfu.github.io/aiatcl-cert-practice/

## What It Includes

- 5 complete 40-question practice exams matching the syllabus rules.
- 50-minute timer.
- 15 single-choice questions.
- 5 multiple-choice questions.
- 20 reading-group questions.
- Automatic scoring at 2.5 points per question.
- Pass threshold at 80 points.
- Review mode with explanations and wrong-answer study notes.
- Local wrong-question notebook.
- Topic-level score analysis.
- Shuffled questions and choices for each attempt.
- Curated reference links for follow-up study.

## Local Development

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite.

## Build

```bash
npm run build
```

## Source Materials

The app was generated from local source PDFs placed under `docs/raw`. Those raw PDFs and downloaded web materials are intentionally ignored for public publishing because they may contain third-party copyrighted content.

Use the local downloader only when you have the right to access and store those materials:

```bash
npm run download:materials
```
