export type Choice = {
  id: "A" | "B" | "C" | "D";
  text: string;
};

export type QuestionKind = "single" | "multiple" | "reading";

export type Question = {
  id: string;
  kind: QuestionKind;
  prompt: string;
  choices: Choice[];
  answer: Choice["id"][];
  explanation: string;
  topic: string;
  difficulty: "易" | "中" | "難";
  passageId?: string;
};

export type ReadingSet = {
  id: string;
  title: string;
  passage: string;
  questions: Question[];
};

export type ExamPaper = {
  id: string;
  title: string;
  description: string;
  updatedContext: string;
  sourceNotes: string[];
  readingSets: ReadingSet[];
  questions: Question[];
};

export type ExamRules = {
  totalQuestions: number;
  durationMinutes: number;
  pointsPerQuestion: number;
  passScore: number;
  maxWrongToPass: number;
  sectionCounts: Record<QuestionKind, number>;
};

export type AnswerState = Record<string, Choice["id"][]>;

export type SectionSummary = {
  kind: QuestionKind;
  total: number;
  correct: number;
};

export type ScoreReport = {
  score: number;
  correct: number;
  wrong: number;
  passed: boolean;
  sections: SectionSummary[];
  missedQuestionIds: string[];
};

export const examRules: ExamRules = {
  totalQuestions: 40,
  durationMinutes: 50,
  pointsPerQuestion: 2.5,
  passScore: 80,
  maxWrongToPass: 8,
  sectionCounts: {
    single: 15,
    multiple: 5,
    reading: 20
  }
};

export const normalizeAnswer = (answer: Choice["id"][] = []): Choice["id"][] =>
  [...new Set(answer)].sort();

export const isCorrect = (question: Question, answer: Choice["id"][] = []): boolean => {
  const expected = normalizeAnswer(question.answer);
  const actual = normalizeAnswer(answer);
  return expected.length === actual.length && expected.every((choice, index) => choice === actual[index]);
};

export const scoreExam = (questions: Question[], answers: AnswerState): ScoreReport => {
  const missedQuestionIds = questions
    .filter((question) => !isCorrect(question, answers[question.id]))
    .map((question) => question.id);
  const correct = questions.length - missedQuestionIds.length;
  const score = correct * examRules.pointsPerQuestion;
  const sectionKinds: QuestionKind[] = ["single", "multiple", "reading"];
  const sections = sectionKinds.map((kind) => {
    const sectionQuestions = questions.filter((question) => question.kind === kind);
    return {
      kind,
      total: sectionQuestions.length,
      correct: sectionQuestions.filter((question) => isCorrect(question, answers[question.id])).length
    };
  });

  return {
    score,
    correct,
    wrong: missedQuestionIds.length,
    passed: score >= examRules.passScore,
    sections,
    missedQuestionIds
  };
};

export const sectionLabel = (kind: QuestionKind): string => {
  if (kind === "single") return "單選題";
  if (kind === "multiple") return "多選題";
  return "閱讀題組";
};
