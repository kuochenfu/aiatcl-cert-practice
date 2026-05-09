import "./styles.css";
import { allQuestions, readingSets } from "./questionBank";
import {
  type AnswerState,
  type Choice,
  type Question,
  examRules,
  isCorrect,
  scoreExam,
  sectionLabel
} from "./exam";

type ViewMode = "intro" | "exam" | "review";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("App root was not found.");
}

let answers: AnswerState = {};
let viewMode: ViewMode = "intro";
let submitted = false;
let startedAt = 0;
let remainingSeconds = examRules.durationMinutes * 60;
let timerId: number | undefined;

const questionIndex = new Map(allQuestions.map((question, index) => [question.id, index + 1]));

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
};

const answeredCount = (): number =>
  allQuestions.filter((question) => (answers[question.id] ?? []).length > 0).length;

const beginExam = (): void => {
  answers = {};
  submitted = false;
  viewMode = "exam";
  remainingSeconds = examRules.durationMinutes * 60;
  startedAt = Date.now();
  window.clearInterval(timerId);
  timerId = window.setInterval(() => {
    const elapsed = Math.floor((Date.now() - startedAt) / 1000);
    remainingSeconds = Math.max(examRules.durationMinutes * 60 - elapsed, 0);
    if (remainingSeconds === 0 && !submitted) {
      submitExam();
      return;
    }
    render();
  }, 1000);
  render();
};

const submitExam = (): void => {
  submitted = true;
  viewMode = "review";
  window.clearInterval(timerId);
  render();
};

const restart = (): void => {
  window.clearInterval(timerId);
  answers = {};
  submitted = false;
  viewMode = "intro";
  remainingSeconds = examRules.durationMinutes * 60;
  render();
};

const toggleAnswer = (question: Question, choice: Choice["id"]): void => {
  const existing = answers[question.id] ?? [];
  if (question.kind === "multiple") {
    answers = {
      ...answers,
      [question.id]: existing.includes(choice)
        ? existing.filter((item) => item !== choice)
        : [...existing, choice]
    };
  } else {
    answers = { ...answers, [question.id]: [choice] };
  }
  render();
};

const renderIntro = (): string => `
  <section class="hero">
    <div class="hero-copy">
      <p class="eyebrow">AIATCL™ 素養級認證練習</p>
      <h1>50 分鐘完成一份符合官方題型比例的練習測驗</h1>
      <p class="lead">依據 syllabus v.7 的測驗規則建立：單選 15 題、多選 5 題、閱讀題組 20 題，每題 2.5 分，80 分通過。</p>
    </div>
    <div class="exam-panel">
      <dl class="rule-grid">
        <div><dt>總題數</dt><dd>${examRules.totalQuestions}</dd></div>
        <div><dt>時間</dt><dd>${examRules.durationMinutes} 分鐘</dd></div>
        <div><dt>通過</dt><dd>${examRules.passScore} 分</dd></div>
        <div><dt>容錯</dt><dd>最多錯 ${examRules.maxWrongToPass} 題</dd></div>
      </dl>
      <button class="primary-action" data-action="begin">開始練習</button>
    </div>
  </section>
  <section class="scope-band">
    <h2>測驗範圍</h2>
    <div class="scope-grid">
      ${[
        "人工智慧概念與歷程",
        "機器學習任務與流程",
        "深度學習與遷移學習",
        "聯邦學習、雲端與邊緣運算",
        "AI 輔助數位孿生",
        "生成式 AI、Prompt、RAG",
        "AI 倫理、治理與資安"
      ]
        .map((item) => `<span>${item}</span>`)
        .join("")}
    </div>
  </section>
`;

const renderQuestion = (question: Question): string => {
  const selected = answers[question.id] ?? [];
  const correct = submitted ? isCorrect(question, selected) : undefined;
  return `
    <article class="question-card ${submitted ? (correct ? "correct" : "wrong") : ""}" id="${question.id}">
      <div class="question-meta">
        <span>第 ${questionIndex.get(question.id)} 題</span>
        <span>${sectionLabel(question.kind)}</span>
        <span>${question.topic}</span>
        <span>難度 ${question.difficulty}</span>
      </div>
      <h3>${question.prompt}</h3>
      <div class="choices" role="group" aria-label="${question.prompt}">
        ${question.choices
          .map((choice) => {
            const active = selected.includes(choice.id);
            const answer = submitted && question.answer.includes(choice.id);
            return `
              <button class="choice ${active ? "selected" : ""} ${answer ? "answer" : ""}" data-question="${question.id}" data-choice="${choice.id}" ${submitted ? "disabled" : ""}>
                <span class="choice-key">${choice.id}</span>
                <span>${choice.text}</span>
              </button>
            `;
          })
          .join("")}
      </div>
      ${
        submitted
          ? `<p class="explanation"><strong>${correct ? "答對" : "需複習"}：</strong>${question.explanation}</p>`
          : ""
      }
    </article>
  `;
};

const renderExam = (): string => `
  <header class="sticky-status">
    <div>
      <p class="eyebrow">練習中</p>
      <h1>AIATCL 模擬測驗</h1>
    </div>
    <div class="status-metrics">
      <span>${answeredCount()} / ${examRules.totalQuestions} 已作答</span>
      <strong>${formatTime(remainingSeconds)}</strong>
      <button class="secondary-action" data-action="submit">交卷</button>
    </div>
  </header>
  <section class="question-section">
    <h2>單選題</h2>
    ${allQuestions.filter((question) => question.kind === "single").map(renderQuestion).join("")}
  </section>
  <section class="question-section">
    <h2>多選題</h2>
    ${allQuestions.filter((question) => question.kind === "multiple").map(renderQuestion).join("")}
  </section>
  <section class="question-section">
    <h2>閱讀題組</h2>
    ${readingSets
      .map(
        (set) => `
          <article class="passage">
            <h3>${set.title}</h3>
            <p>${set.passage}</p>
          </article>
          ${set.questions.map(renderQuestion).join("")}
        `
      )
      .join("")}
  </section>
`;

const renderReview = (): string => {
  const report = scoreExam(allQuestions, answers);
  return `
    <header class="review-hero ${report.passed ? "passed" : "failed"}">
      <div>
        <p class="eyebrow">${report.passed ? "已達通過標準" : "尚未通過"}</p>
        <h1>${report.score.toFixed(1)} 分</h1>
        <p class="lead">答對 ${report.correct} 題，錯 ${report.wrong} 題。官方標準為 80 分通過，最多可錯 ${examRules.maxWrongToPass} 題。</p>
      </div>
      <button class="primary-action" data-action="restart">再練一次</button>
    </header>
    <section class="score-grid">
      ${report.sections
        .map(
          (section) => `
            <div>
              <dt>${sectionLabel(section.kind)}</dt>
              <dd>${section.correct} / ${section.total}</dd>
            </div>
          `
        )
        .join("")}
    </section>
    ${renderExam()}
  `;
};

const render = (): void => {
  if (viewMode === "intro") {
    app.innerHTML = renderIntro();
  } else if (viewMode === "review") {
    app.innerHTML = renderReview();
  } else {
    app.innerHTML = renderExam();
  }
};

app.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const actionButton = target.closest<HTMLButtonElement>("[data-action]");
  if (actionButton) {
    const action = actionButton.dataset.action;
    if (action === "begin") beginExam();
    if (action === "submit") submitExam();
    if (action === "restart") restart();
    return;
  }

  const choiceButton = target.closest<HTMLButtonElement>("[data-question][data-choice]");
  if (!choiceButton || submitted) return;

  const question = allQuestions.find((item) => item.id === choiceButton.dataset.question);
  const choice = choiceButton.dataset.choice as Choice["id"] | undefined;
  if (question && choice) {
    toggleAnswer(question, choice);
  }
});

render();
