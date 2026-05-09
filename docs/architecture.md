# AIATCL Practice Page Architecture

## Goals

- Model the AIATCL literacy certification practice test in TypeScript-native data structures.
- Match the syllabus rules: 40 questions, 50 minutes, 2.5 points per question, pass at 80, with 15 single-choice, 5 multiple-choice, and 20 reading-group questions.
- Keep source materials reproducible under `docs/raw`, including a machine-readable link manifest and downloaded external references.
- Build a static single-page app that can run locally and be deployed as plain frontend assets.

## Structure

- `scripts/download-materials.ts`: Extracted source-link manifest downloader. It downloads the PDF-linked resources into `docs/raw/downloaded` and writes `docs/raw/materials-manifest.json`.
- `src/exam.ts`: Exam rules, scoring helpers, answer comparison, and section summaries.
- `src/questionBank.ts`: TypeScript question bank generated from the syllabus scope and reading PDF topics.
- `src/main.ts`: Browser state, rendering, timer, answer capture, grading flow, and review mode.
- `src/styles.css`: App layout and interaction styling.

## Data Model

The core domain model separates exam behavior from presentation:

- `ExamRules`: duration, points, pass score, allowed misses, and required section counts.
- `Question`: one single-choice, multiple-choice, or reading-group item.
- `ReadingSet`: shared passage plus its child questions.
- `AnswerState`: user answers keyed by question id.
- `ScoreReport`: score, correctness, pass/fail, and section-level breakdown.

This keeps the page easy to extend later with multiple generated exams, seeded randomization, import/export, or a server-side question generator while preserving the official test distribution.

## Generation Strategy

The first exam set is deterministic and source-aligned:

- Single-choice questions cover AI history, ML task types, deep learning, transfer learning, cloud/edge, digital twins, GenAI, prompt engineering, RAG, and AI safety.
- Multiple-choice questions cover learning paradigms, project workflow, neural network types, governance risks, and LLMOps.
- Reading questions are grouped into four scenarios: smart manufacturing, healthcare federated learning, enterprise GenAI rollout, and autonomous driving.

Future generation can add a TypeScript content pipeline that ingests extracted PDF text, maps chunks to syllabus objectives, and emits validated `Question[]` modules.
