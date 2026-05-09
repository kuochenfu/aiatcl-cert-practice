import "./styles.css";
import { examPapers } from "./questionBank";
import {
  type AnswerState,
  type Choice,
  type ExamPaper,
  type Question,
  examRules,
  isCorrect,
  scoreExam,
  sectionLabel
} from "./exam";

type ViewMode = "intro" | "exam" | "review";
type StoredMiss = {
  questionId: string;
  paperId: string;
  missedAt: string;
};

type StudyResource = {
  title: string;
  description: string;
  url: string;
};

type TopicSummary = {
  topic: string;
  total: number;
  correct: number;
};

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
let selectedPaperId = examPapers[0].id;
let questionOrder: string[] = [];
let choiceOrder: Record<string, Choice["id"][]> = {};
let reviewModeLabel = "";

const missesStorageKey = "aiatcl-cert-practice-misses";

const currentPaper = (): ExamPaper =>
  examPapers.find((paper) => paper.id === selectedPaperId) ?? examPapers[0];

const selectedPaper = (): ExamPaper | undefined =>
  examPapers.find((paper) => paper.id === selectedPaperId);

const baseQuestions = (): Question[] => currentPaper().questions;

const allQuestions = (): Question[] => examPapers.flatMap((paper) => paper.questions);

const getOrderedQuestions = (paper: ExamPaper = currentPaper()): Question[] => {
  if (selectedPaperId === "miss-book") {
    const byId = new Map(allQuestions().map((question) => [question.id, question]));
    return questionOrder
      .map((questionId) => byId.get(questionId))
      .filter((question): question is Question => Boolean(question));
  }
  const fallback = paper.questions;
  if (questionOrder.length === 0) return fallback;
  const byId = new Map(fallback.map((question) => [question.id, question]));
  const ordered = questionOrder
    .map((questionId) => byId.get(questionId))
    .filter((question): question is Question => Boolean(question));
  return ordered.length > 0 ? ordered : fallback;
};

const currentQuestions = (): Question[] => getOrderedQuestions();

const questionNumber = (questionId: string): number =>
  currentQuestions().findIndex((question) => question.id === questionId) + 1;

const shuffle = <T>(items: T[]): T[] => {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
};

const buildChoiceOrder = (questions: Question[]): Record<string, Choice["id"][]> =>
  Object.fromEntries(questions.map((question) => [question.id, shuffle(question.choices.map((choice) => choice.id))]));

const orderedChoices = (question: Question): Question["choices"] => {
  const orderedIds = choiceOrder[question.id] ?? question.choices.map((choice) => choice.id);
  return orderedIds
    .map((choiceId) => question.choices.find((choice) => choice.id === choiceId))
    .filter((choice): choice is Choice => Boolean(choice));
};

const loadMisses = (): StoredMiss[] => {
  try {
    const parsed = JSON.parse(localStorage.getItem(missesStorageKey) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveMisses = (misses: StoredMiss[]): void => {
  localStorage.setItem(missesStorageKey, JSON.stringify(misses.slice(-120)));
};

const missedQuestionIds = (): Set<string> => new Set(loadMisses().map((miss) => miss.questionId));

const updateMissBook = (): void => {
  const existing = new Map(loadMisses().map((miss) => [miss.questionId, miss]));
  const now = new Date().toISOString();
  currentQuestions().forEach((question) => {
    if (!isCorrect(question, answers[question.id])) {
      existing.set(question.id, {
        questionId: question.id,
        paperId: selectedPaperId,
        missedAt: now
      });
    } else {
      existing.delete(question.id);
    }
  });
  saveMisses([...existing.values()]);
};

const clearMissBook = (): void => {
  localStorage.removeItem(missesStorageKey);
  if (viewMode === "intro") render();
};

const missBookQuestions = (): Question[] => {
  const missIds = missedQuestionIds();
  return allQuestions().filter((question) => missIds.has(question.id));
};

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
};

const answeredCount = (): number =>
  currentQuestions().filter((question) => (answers[question.id] ?? []).length > 0).length;

const topicSummaries = (questions: Question[], currentAnswers: AnswerState): TopicSummary[] => {
  const summaries = new Map<string, TopicSummary>();
  questions.forEach((question) => {
    const summary = summaries.get(question.topic) ?? { topic: question.topic, total: 0, correct: 0 };
    summary.total += 1;
    if (isCorrect(question, currentAnswers[question.id])) summary.correct += 1;
    summaries.set(question.topic, summary);
  });
  return [...summaries.values()].sort((a, b) => a.correct / a.total - b.correct / b.total);
};

const studyResources: StudyResource[] = [
  {
    title: "AIATCL 測驗規則",
    description: "確認題數、時間、配分、通過標準與官方認證資訊。",
    url: "https://aiacademy.tw/aiatcl/"
  },
  {
    title: "NIST AI Risk Management Framework",
    description: "補強可信任 AI、風險管理、治理流程與生成式 AI profile。",
    url: "https://www.nist.gov/itl/ai-risk-management-framework"
  },
  {
    title: "EU AI Act Implementation Timeline",
    description: "掌握 2026 前後透明度、高風險系統與 AI literacy 時程。",
    url: "https://ai-act-service-desk.ec.europa.eu/en/ai-act/timeline/timeline-implementation-eu-ai-act"
  },
  {
    title: "OWASP LLM & Prompt Injection",
    description: "複習提示注入、敏感資訊揭露、RAG 信任邊界與 LLM 應用安全。",
    url: "https://owasp.org/www-project-top-10-for-large-language-model-applications/"
  },
  {
    title: "Learn Prompting",
    description: "補強提示工程、角色設定、限制條件與拒答策略。",
    url: "https://learnprompting.org/zh-tw/docs/intro"
  }
];

const formatChoiceIds = (choiceIds: Choice["id"][] = []): string =>
  choiceIds.length === 0 ? "未作答" : [...choiceIds].sort().join("、");

const choiceText = (question: Question, choiceId: Choice["id"]): string =>
  question.choices.find((choice) => choice.id === choiceId)?.text ?? choiceId;

const topicStudyNotes: Record<string, string> = {
  "AI 安全":
    "AI 安全題常考的是風險辨識：個資外洩、模型幻覺、偏見、資料中毒、提示注入都不是單靠模型變大就能解決。答題時先判斷風險發生在哪裡：資料輸入、模型訓練、檢索資料、輸出使用，或上線後監控。",
  "AI 治理":
    "AI 治理重點是責任與流程，而不是單一技術。高影響場景通常需要風險分級、紀錄、監控、人工覆核、申訴管道與事故處理；透明度題則常和告知使用者、標示 AI 生成內容、來源可追溯有關。",
  "AI 資安":
    "LLM 資安題要分清楚提示注入、敏感資訊揭露、不安全輸出處理與資料中毒。若題目提到外部文件、網頁、評論被檢索進模型上下文，通常要想到間接提示注入與 RAG 信任邊界。",
  "AutoML":
    "AutoML 是自動化建模流程的一部分，例如模型選擇、特徵處理、超參數搜尋。它不能替代問題定義、資料治理、公平性檢查、部署監控與責任判斷。",
  "LLMOps":
    "LLMOps 會比傳統 MLOps 多處理提示版本、RAG 檢索品質、輸出安全、幻覺評測、成本與延遲。看到生成式 AI 應用上線後的品質、成本、安全監控，多半是在考 LLMOps。",
  "MLOps":
    "MLOps 關注模型生命週期：版本控管、部署、監控、資料漂移、回訓、回滾與事件處理。若題目從原型走到正式服務，或上線後效果下降，通常不是單純換模型，而是 MLOps 問題。",
  "Prompt Engineering":
    "提示工程不是訓練模型，而是設計任務、角色、限制、輸出格式、上下文與拒答規則。教育、客服、文件草稿題常考如何用提示避免代寫、硬答或越權輸出。",
  "人工智慧概念":
    "AI 素養不只是會使用工具，而是理解 AI 能力、限制、風險與負責任使用。遇到使用者過度相信模型、不了解資料風險、無法查證輸出時，通常是在考 AI literacy。",
  "數位孿生":
    "數位孿生不是一般 dashboard。它會把實體系統資料連到模型，用於模擬、預測、最佳化或測試假設；若題目只是在看歷史報表，就不算完整的數位孿生能力。",
  "機器學習任務":
    "先看預測目標：連續數值多是迴歸，離散類別多是分類，沒有標籤找群體結構是分群。若還牽涉時間順序，可以是時間序列預測；若依獎懲學策略，才偏強化學習。",
  "機器學習方法":
    "監督式學習需要標記答案；非監督式學習找資料結構；強化學習靠獎勵回饋學策略；聯邦學習是多方資料不集中時共同訓練。答題時不要只看資料型態，要看訓練訊號。",
  "機器學習概念":
    "訓練集表現好不代表上線表現好。常見問題包含過擬合、資料分布差異、資料漂移、標籤定義改變與環境變化。正式服務要靠驗證集、測試集與上線監控確認泛化能力。",
  "深度學習":
    "CNN 常見於影像局部特徵；Transformer 擅長處理序列與上下文；語音、影像、文字任務都可能用深度學習。答題時先辨識輸入資料型態與輸出需求。",
  "深度學習任務":
    "影像分類只判斷整張圖類別；物件偵測要框出位置與類別；影像分割要到像素級區域。題目若出現框出、定位、標示位置，通常不是單純分類。",
  "生成式 AI":
    "生成式 AI 題常考 Prompt、RAG、AIGC、embedding、幻覺。RAG 是拿外部資料補上下文，embedding 是把內容轉成向量做語意檢索，來源引用與拒答可以降低幻覺誤用。",
  "聯邦學習":
    "聯邦學習適合多方不能集中原始資料的情境，但不代表完全無隱私風險。仍要注意資料分布不一致、通訊成本、模型更新洩漏與安全聚合等治理問題。",
  "資料科學流程":
    "資料科學不是直接丟模型。常見流程包含定義問題與指標、資料蒐集、清理、特徵工程、切分資料、訓練、評估、部署與監控。資料品質常是模型效果上限。",
  "遷移學習":
    "遷移學習適合新任務資料較少、但已有相關任務的預訓練模型時使用。它不是直接免驗證，仍需要用新場域資料微調、測試，確認沒有 domain shift 問題。",
  "雲端與邊緣運算":
    "雲端適合集中訓練、跨場域分析與大規模運算；邊緣適合低延遲、斷線韌性與就近處理。即時告警、車載、工廠現場與農場控制常偏邊緣推論。"
};

const studyNoteFor = (question: Question): string =>
  topicStudyNotes[question.topic] ??
  "先判斷題目在問概念定義、任務類型、導入流程、上線營運或風險治理。認證題常用情境包裝名詞，關鍵是找出輸入資料、目標輸出、限制條件與責任邊界。";

const renderWrongAnswerStudy = (question: Question, selected: Choice["id"][]): string => {
  const missedCorrect = question.answer.filter((choiceId) => !selected.includes(choiceId));
  const extraSelected = selected.filter((choiceId) => !question.answer.includes(choiceId));
  const correctTexts = question.answer
    .map((choiceId) => `${choiceId}. ${choiceText(question, choiceId)}`)
    .join(" / ");
  const selectedTexts =
    selected.length === 0
      ? "未作答"
      : selected.map((choiceId) => `${choiceId}. ${choiceText(question, choiceId)}`).join(" / ");

  return `
    <div class="study-note">
      <div>
        <strong>正解</strong>
        <p>${formatChoiceIds(question.answer)}：${correctTexts}</p>
      </div>
      <div>
        <strong>你的選擇</strong>
        <p>${selectedTexts}</p>
      </div>
      ${
        missedCorrect.length > 0
          ? `<p><strong>漏掉的關鍵：</strong>${missedCorrect
              .map((choiceId) => `${choiceId} 是題目限制下最符合的選項`)
              .join("；")}。</p>`
          : ""
      }
      ${
        extraSelected.length > 0
          ? `<p><strong>容易誤選的地方：</strong>${extraSelected
              .map((choiceId) => `${choiceId} 雖然看似相關，但不符合本題的主要目標或限制`)
              .join("；")}。</p>`
          : ""
      }
      <p><strong>補強知識：</strong>${studyNoteFor(question)}</p>
    </div>
  `;
};

const prepareAttempt = (questions: Question[], label = ""): void => {
  questionOrder = [
    ...shuffle(questions.filter((question) => question.kind === "single")).map((question) => question.id),
    ...shuffle(questions.filter((question) => question.kind === "multiple")).map((question) => question.id),
    ...shuffle(questions.filter((question) => question.kind === "reading")).map((question) => question.id)
  ];
  choiceOrder = buildChoiceOrder(questions);
  reviewModeLabel = label;
};

const beginExam = (paperId: string = selectedPaperId): void => {
  selectedPaperId = paperId;
  prepareAttempt(baseQuestions());
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

const beginMissBook = (): void => {
  const missed = missBookQuestions();
  if (missed.length === 0) return;
  selectedPaperId = "miss-book";
  questionOrder = shuffle(missed).map((question) => question.id);
  choiceOrder = buildChoiceOrder(missed);
  reviewModeLabel = `錯題本 ${missed.length} 題`;
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
  updateMissBook();
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
      <h1>5 份符合官方題型比例的 2026 衝刺測驗</h1>
      <p class="lead">依據 syllabus v.7 與 2026 可查公開資訊建立：單選 15 題、多選 5 題、閱讀題組 20 題，每題 2.5 分，80 分通過。</p>
    </div>
    <div class="exam-panel">
      <dl class="rule-grid">
        <div><dt>總題數</dt><dd>${examRules.totalQuestions}</dd></div>
        <div><dt>時間</dt><dd>${examRules.durationMinutes} 分鐘</dd></div>
        <div><dt>通過</dt><dd>${examRules.passScore} 分</dd></div>
        <div><dt>容錯</dt><dd>最多錯 ${examRules.maxWrongToPass} 題</dd></div>
      </dl>
      <button class="primary-action" data-action="begin" data-paper-id="${selectedPaperId}">開始目前選擇</button>
    </div>
  </section>
  <section class="scope-band">
    <h2>選擇測驗卷</h2>
    <div class="paper-grid">
      ${examPapers
        .map(
          (paper, index) => `
            <button class="paper-option ${paper.id === selectedPaperId ? "active" : ""}" data-action="begin" data-paper-id="${paper.id}">
              <span>卷 ${index + 1}</span>
              <strong>${paper.title}</strong>
              <small>${paper.description}</small>
            </button>
          `
        )
        .join("")}
    </div>
  </section>
  <section class="scope-band">
    <h2>錯題本</h2>
    <div class="miss-book-panel">
      <div>
        <strong>${missBookQuestions().length} 題待複習</strong>
        <p>交卷後答錯或未作答的題目會自動加入錯題本；下次答對會自動移除。</p>
      </div>
      <div class="panel-actions">
        <button class="secondary-action" data-action="miss-book" ${missBookQuestions().length === 0 ? "disabled" : ""}>只練錯題</button>
        <button class="ghost-action" data-action="clear-misses" ${missBookQuestions().length === 0 ? "disabled" : ""}>清空錯題</button>
      </div>
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
        "AI 倫理、治理與資安",
        "2026 AI 治理、EU AI Act、NIST AI RMF、OWASP LLM 風險"
      ]
        .map((item) => `<span>${item}</span>`)
        .join("")}
    </div>
  </section>
  <section class="scope-band">
    <h2>延伸閱讀</h2>
    <div class="resource-grid">
      ${studyResources
        .map(
          (resource) => `
            <a class="resource-card" href="${resource.url}" target="_blank" rel="noreferrer">
              <strong>${resource.title}</strong>
              <span>${resource.description}</span>
            </a>
          `
        )
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
        <span>第 ${questionNumber(question.id)} 題</span>
        <span>${sectionLabel(question.kind)}</span>
        <span>${question.topic}</span>
        <span>難度 ${question.difficulty}</span>
      </div>
      <h3>${question.prompt}</h3>
      <div class="choices" role="group" aria-label="${question.prompt}">
        ${orderedChoices(question)
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
          ? `<div class="explanation">
              <p><strong>${correct ? "答對" : "需複習"}：</strong>${question.explanation}</p>
              ${correct ? "" : renderWrongAnswerStudy(question, selected)}
            </div>`
          : ""
      }
    </article>
  `;
};

const renderExam = (): string => `
  <header class="sticky-status">
    <div>
      <p class="eyebrow">練習中</p>
      <h1>${reviewModeLabel || currentPaper().title}</h1>
    </div>
    <div class="status-metrics">
      <span>${answeredCount()} / ${currentQuestions().length} 已作答</span>
      <strong>${formatTime(remainingSeconds)}</strong>
      <button class="secondary-action" data-action="submit" ${submitted ? "disabled" : ""}>交卷</button>
    </div>
  </header>
  <section class="source-note">
    <strong>${reviewModeLabel || currentPaper().description}</strong>
    <span>${selectedPaperId === "miss-book" ? "錯題本會隨答題結果更新：答對移除，答錯保留。" : currentPaper().updatedContext}</span>
  </section>
  <section class="question-section">
    <h2>單選題</h2>
    ${currentQuestions().filter((question) => question.kind === "single").map(renderQuestion).join("")}
  </section>
  <section class="question-section">
    <h2>多選題</h2>
    ${currentQuestions().filter((question) => question.kind === "multiple").map(renderQuestion).join("")}
  </section>
  <section class="question-section">
    <h2>閱讀題組</h2>
    ${currentPaper()
      .readingSets
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

const renderTopicAnalysis = (questions: Question[], currentAnswers: AnswerState): string => {
  const summaries = topicSummaries(questions, currentAnswers);
  return `
    <section class="topic-analysis">
      <h2>領域分析</h2>
      <div class="topic-grid">
        ${summaries
          .map((summary) => {
            const percent = Math.round((summary.correct / summary.total) * 100);
            return `
              <div class="topic-card ${percent < 70 ? "weak" : ""}">
                <div>
                  <strong>${summary.topic}</strong>
                  <span>${summary.correct} / ${summary.total}</span>
                </div>
                <div class="topic-bar" aria-label="${summary.topic} ${percent}%">
                  <span style="width: ${percent}%"></span>
                </div>
                <p>${percent < 70 ? studyNoteFor(questions.find((question) => question.topic === summary.topic) ?? questions[0]) : "這個領域掌握度不錯，複習時可改看易混淆概念。"}</p>
              </div>
            `;
          })
          .join("")}
      </div>
    </section>
  `;
};

const renderReview = (): string => {
  const report = scoreExam(currentQuestions(), answers);
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
    ${renderTopicAnalysis(currentQuestions(), answers)}
    <section class="source-note">
      <strong>本卷參考更新脈絡</strong>
      <span>${selectedPaper()?.sourceNotes.join(" / ") ?? "錯題本由各測驗卷錯題彙整而成，請回到原題解析與領域分析補強薄弱概念。"}</span>
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
    if (action === "begin") beginExam(actionButton.dataset.paperId);
    if (action === "miss-book") beginMissBook();
    if (action === "clear-misses") clearMissBook();
    if (action === "submit") submitExam();
    if (action === "restart") restart();
    return;
  }

  const choiceButton = target.closest<HTMLButtonElement>("[data-question][data-choice]");
  if (!choiceButton || submitted) return;

  const question = currentQuestions().find((item) => item.id === choiceButton.dataset.question);
  const choice = choiceButton.dataset.choice as Choice["id"] | undefined;
  if (question && choice) {
    toggleAnswer(question, choice);
  }
});

render();
