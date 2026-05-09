import type { Question, ReadingSet } from "./exam";

const choices = (a: string, b: string, c: string, d: string): Question["choices"] => [
  { id: "A", text: a },
  { id: "B", text: b },
  { id: "C", text: c },
  { id: "D", text: d }
];

export const singleChoiceQuestions: Question[] = [
  {
    id: "S01",
    kind: "single",
    prompt: "在 AI 發展脈絡中，第三波 AI 主要靠什麼方式取得規則？",
    choices: choices("由專家手寫大量判斷規則", "從資料中歸納與學習規律", "完全以硬體電路固定邏輯", "以人工標籤取代所有模型訓練"),
    answer: ["B"],
    explanation: "閱讀資料將第三波 AI 描述為機器學習，核心是從資料歸納出規則。",
    topic: "人工智慧歷程",
    difficulty: "易"
  },
  {
    id: "S02",
    kind: "single",
    prompt: "預測明天溫度最符合哪一類機器學習任務？",
    choices: choices("分類", "迴歸", "分群", "關聯規則"),
    answer: ["B"],
    explanation: "溫度是連續數值，預測連續值屬於迴歸任務。",
    topic: "機器學習任務",
    difficulty: "易"
  },
  {
    id: "S03",
    kind: "single",
    prompt: "客戶流失預測通常最接近下列哪一種任務？",
    choices: choices("分類任務", "影像生成", "語音合成", "資料壓縮"),
    answer: ["A"],
    explanation: "流失與未流失是類別標籤，通常建模為分類問題。",
    topic: "機器學習任務",
    difficulty: "易"
  },
  {
    id: "S04",
    kind: "single",
    prompt: "沒有事先標記資料，想把相似客群自動分成幾組，最符合哪種學習？",
    choices: choices("監督式學習", "非監督式學習", "強化學習", "遷移學習"),
    answer: ["B"],
    explanation: "分群通常在無標籤資料上尋找相似結構，屬非監督式學習。",
    topic: "機器學習方法",
    difficulty: "易"
  },
  {
    id: "S05",
    kind: "single",
    prompt: "強化學習最重視下列哪個概念？",
    choices: choices("以獎勵回饋調整策略", "固定規則永不更新", "只依照 SQL 查詢資料", "以壓縮檔保存模型"),
    answer: ["A"],
    explanation: "強化學習透過環境回饋與獎勵學習行動策略。",
    topic: "機器學習方法",
    difficulty: "中"
  },
  {
    id: "S06",
    kind: "single",
    prompt: "CNN 最常被用於哪類資料或任務？",
    choices: choices("表格排序", "影像辨識與電腦視覺", "文字編碼格式轉換", "資料庫備份"),
    answer: ["B"],
    explanation: "卷積神經網路擅長處理影像的局部特徵與空間結構。",
    topic: "深度學習",
    difficulty: "易"
  },
  {
    id: "S07",
    kind: "single",
    prompt: "遷移學習的主要價值是什麼？",
    choices: choices("讓模型不能重複使用", "利用既有模型知識降低新任務資料與訓練成本", "完全省略資料治理", "只適用於無網路設備"),
    answer: ["B"],
    explanation: "遷移學習將既有任務學到的表示或模型調整到新任務上。",
    topic: "遷移學習",
    difficulty: "中"
  },
  {
    id: "S08",
    kind: "single",
    prompt: "聯邦學習相較集中式訓練的主要優勢是什麼？",
    choices: choices("一定不需要模型", "原始資料可留在各資料持有方以降低隱私風險", "只能訓練影像模型", "完全不需要通訊"),
    answer: ["B"],
    explanation: "聯邦學習讓多方協作訓練，同時避免直接集中原始資料。",
    topic: "聯邦學習",
    difficulty: "中"
  },
  {
    id: "S09",
    kind: "single",
    prompt: "邊緣運算常被採用的原因是什麼？",
    choices: choices("降低即時應用延遲並就近處理資料", "把所有資料永久公開", "讓模型無法更新", "取代所有資安控管"),
    answer: ["A"],
    explanation: "邊緣運算靠近資料產生端，適合低延遲與本地處理情境。",
    topic: "雲端與邊緣運算",
    difficulty: "易"
  },
  {
    id: "S10",
    kind: "single",
    prompt: "AI 輔助數位孿生最適合支援下列哪件事？",
    choices: choices("對實體系統建模、模擬與持續優化", "刪除所有感測器資料", "只製作靜態簡報", "禁止預測性維護"),
    answer: ["A"],
    explanation: "數位孿生透過模型與資料模擬實體系統，支援預測與優化。",
    topic: "數位孿生",
    difficulty: "中"
  },
  {
    id: "S11",
    kind: "single",
    prompt: "Prompt Engineering 指的是什麼？",
    choices: choices("生成式 AI 的硬體製程", "設計提示以引導模型產生特定結果的技巧", "資料庫正規化方法", "模型部署的電費計算"),
    answer: ["B"],
    explanation: "提示工程是與生成式 AI 溝通並引導輸出的技巧。",
    topic: "生成式 AI",
    difficulty: "易"
  },
  {
    id: "S12",
    kind: "single",
    prompt: "RAG 在生成式 AI 應用中的主要目的為何？",
    choices: choices("把檢索到的外部知識加入生成流程", "讓模型停止回答", "將影像轉成黑白", "只改變網頁字型"),
    answer: ["A"],
    explanation: "RAG 是檢索增強生成，常用於補充模型外部或最新知識。",
    topic: "生成式 AI",
    difficulty: "中"
  },
  {
    id: "S13",
    kind: "single",
    prompt: "AIGC 最合理的描述是哪一項？",
    choices: choices("AI 生成內容，例如文字、圖像、音訊或程式碼", "只能由人工手寫的內容", "一種雲端帳單格式", "資料庫索引名稱"),
    answer: ["A"],
    explanation: "AIGC 指 AI Generated Content，可涵蓋多種內容形式。",
    topic: "生成式 AI",
    difficulty: "易"
  },
  {
    id: "S14",
    kind: "single",
    prompt: "模型在不同族群上表現落差很大，最直接涉及哪個 AI 安全議題？",
    choices: choices("偏見與公平性", "螢幕亮度", "網頁快取", "檔名排序"),
    answer: ["A"],
    explanation: "不同族群表現落差可能反映資料或模型偏見，需要公平性治理。",
    topic: "AI 安全",
    difficulty: "中"
  },
  {
    id: "S15",
    kind: "single",
    prompt: "MLOps 的核心目標最接近下列哪一項？",
    choices: choices("管理模型從開發、部署、監控到更新的生命週期", "只負責美化投影片", "禁止模型上線", "將所有資料改成圖片"),
    answer: ["A"],
    explanation: "MLOps 關注機器學習系統的工程化營運、監控與持續交付。",
    topic: "MLOps",
    difficulty: "中"
  }
];

export const multipleChoiceQuestions: Question[] = [
  {
    id: "M01",
    kind: "multiple",
    prompt: "機器學習可依資料是否標記與回饋形式區分為哪些常見學習類型？",
    choices: choices("監督式學習", "非監督式學習", "半監督式學習", "強化學習"),
    answer: ["A", "B", "C", "D"],
    explanation: "四者都是常見的機器學習學習類型或訓練設定。",
    topic: "機器學習方法",
    difficulty: "中"
  },
  {
    id: "M02",
    kind: "multiple",
    prompt: "下列哪些屬於資料科學或機器學習專案常見流程？",
    choices: choices("定義問題與成功指標", "資料蒐集、清理與特徵工程", "模型訓練、評估與部署監控", "完全跳過資料品質檢查"),
    answer: ["A", "B", "C"],
    explanation: "資料品質檢查是必要步驟，不能跳過。",
    topic: "資料科學流程",
    difficulty: "中"
  },
  {
    id: "M03",
    kind: "multiple",
    prompt: "下列哪些是常見深度神經網路或生成模型相關技術？",
    choices: choices("CNN", "RNN", "Transformer", "GAN"),
    answer: ["A", "B", "C", "D"],
    explanation: "四者都常見於深度學習或生成式 AI 的基礎技術脈絡。",
    topic: "深度學習",
    difficulty: "中"
  },
  {
    id: "M04",
    kind: "multiple",
    prompt: "導入生成式 AI 時，哪些是 AI 治理與安全需要關注的風險？",
    choices: choices("個資或機密資料外洩", "幻覺與錯誤資訊", "著作權與授權爭議", "模型輸出永遠正確"),
    answer: ["A", "B", "C"],
    explanation: "生成式 AI 輸出不保證永遠正確，仍需驗證與治理。",
    topic: "AI 安全",
    difficulty: "中"
  },
  {
    id: "M05",
    kind: "multiple",
    prompt: "LLMOps 或生成式 AI 營運通常會涵蓋哪些工作？",
    choices: choices("提示與版本管理", "評測與安全檢查", "監控成本、延遲與品質", "要求使用者永不回饋"),
    answer: ["A", "B", "C"],
    explanation: "使用者回饋可協助改善系統，並非應排除的項目。",
    topic: "LLMOps",
    difficulty: "難"
  }
];

export const readingSets: ReadingSet[] = [
  {
    id: "R-A",
    title: "智慧製造數位孿生",
    passage:
      "某製造廠在關鍵設備上安裝感測器，收集溫度、震動與產量資料。團隊希望建立設備的數位孿生，用來模擬產線狀態、預測故障時間，並在不影響真實產線的情況下測試參數調整。為了降低停機風險，系統需要即時偵測異常，也需要將長期資料送到雲端做模型更新。",
    questions: [
      {
        id: "R01",
        kind: "reading",
        passageId: "R-A",
        prompt: "以感測資料預測設備剩餘可用時間，最接近哪一類任務？",
        choices: choices("迴歸", "文字摘要", "影像生成", "語音辨識"),
        answer: ["A"],
        explanation: "剩餘可用時間是連續數值，通常屬於迴歸或時間序列預測。",
        topic: "數位孿生",
        difficulty: "中"
      },
      {
        id: "R02",
        kind: "reading",
        passageId: "R-A",
        prompt: "在產線端即時偵測異常，最適合優先採用哪種運算方式？",
        choices: choices("邊緣運算", "離線紙本計算", "只靠人工巡檢", "刪除感測器"),
        answer: ["A"],
        explanation: "邊緣運算能就近處理資料，降低即時告警延遲。",
        topic: "雲端與邊緣運算",
        difficulty: "易"
      },
      {
        id: "R03",
        kind: "reading",
        passageId: "R-A",
        prompt: "數位孿生在此案例中的關鍵價值是什麼？",
        choices: choices("以虛擬模型模擬與優化真實產線", "替代所有生產人員", "永久停止資料蒐集", "只產生行銷圖片"),
        answer: ["A"],
        explanation: "數位孿生用虛擬模型連結真實資料，支援模擬、預測和優化。",
        topic: "數位孿生",
        difficulty: "易"
      },
      {
        id: "R04",
        kind: "reading",
        passageId: "R-A",
        prompt: "將長期資料送到雲端重新訓練模型時，最需要納入哪個營運概念？",
        choices: choices("MLOps", "圖靈測試", "手寫規則鎖定", "無資料部署"),
        answer: ["A"],
        explanation: "模型更新、部署和監控屬於 MLOps 生命週期管理。",
        topic: "MLOps",
        difficulty: "中"
      },
      {
        id: "R05",
        kind: "reading",
        passageId: "R-A",
        prompt: "若異常樣本很少，團隊可優先考慮哪種做法提升建模效率？",
        choices: choices("利用既有模型做遷移學習或微調", "刪除所有正常樣本", "只看檔案名稱", "拒絕任何驗證資料"),
        answer: ["A"],
        explanation: "資料有限時，遷移學習可借用既有模型知識。",
        topic: "遷移學習",
        difficulty: "中"
      }
    ]
  },
  {
    id: "R-B",
    title: "醫療院所協作建模",
    passage:
      "多家醫院希望合作建立疾病風險預測模型，但病患資料涉及個資與法規限制，不能直接集中到同一個資料庫。各院資料格式略有不同，且不同年齡與性別族群的樣本量差異很大。專案團隊希望在保護隱私的前提下共享模型改進成果，並定期檢查模型是否對特定族群產生不公平結果。",
    questions: [
      {
        id: "R06",
        kind: "reading",
        passageId: "R-B",
        prompt: "此案例最適合導入哪種協作訓練概念？",
        choices: choices("聯邦學習", "公開所有病歷", "只用單院紙本紀錄", "禁止模型評估"),
        answer: ["A"],
        explanation: "聯邦學習讓各院資料留在本地，同時交換模型更新。",
        topic: "聯邦學習",
        difficulty: "易"
      },
      {
        id: "R07",
        kind: "reading",
        passageId: "R-B",
        prompt: "定期檢查不同族群表現差異，主要是為了管理哪個議題？",
        choices: choices("公平性與偏見", "螢幕解析度", "電腦外殼重量", "資料夾顏色"),
        answer: ["A"],
        explanation: "族群間模型表現差異是偏見與公平性治理的核心議題。",
        topic: "AI 安全",
        difficulty: "易"
      },
      {
        id: "R08",
        kind: "reading",
        passageId: "R-B",
        prompt: "疾病風險高低若被標成高、中、低三類，模型最接近哪種任務？",
        choices: choices("分類", "分群", "機器翻譯", "影像重建"),
        answer: ["A"],
        explanation: "預測離散類別標籤屬分類任務。",
        topic: "機器學習任務",
        difficulty: "易"
      },
      {
        id: "R09",
        kind: "reading",
        passageId: "R-B",
        prompt: "各院資料格式不同時，專案早期最需要重視哪件事？",
        choices: choices("資料治理、清理與特徵定義一致性", "直接跳過資料理解", "只調整網頁顏色", "不記錄資料來源"),
        answer: ["A"],
        explanation: "跨院資料差異需要資料治理與一致的欄位、特徵定義。",
        topic: "資料科學流程",
        difficulty: "中"
      },
      {
        id: "R10",
        kind: "reading",
        passageId: "R-B",
        prompt: "若模型用於醫療輔助決策，下列哪項最符合 AI 治理要求？",
        choices: choices("保留評估紀錄、限制用途並讓專家覆核", "讓模型取代所有醫師判斷且不留紀錄", "公開所有個資", "禁止錯誤回報"),
        answer: ["A"],
        explanation: "高風險場景需要可追溯、可覆核與明確責任分工。",
        topic: "AI 治理",
        difficulty: "難"
      }
    ]
  },
  {
    id: "R-C",
    title: "企業導入生成式 AI",
    passage:
      "一家金融公司想用生成式 AI 建立內部知識助理，協助員工查詢制度文件與產生草稿。由於制度常更新，團隊規劃把文件放入檢索系統，再將相關段落提供給大型語言模型回答。公司同時要求不得把客戶個資輸入外部服務，所有回答都要附上來源，並用一套評測流程追蹤準確率、成本與延遲。",
    questions: [
      {
        id: "R11",
        kind: "reading",
        passageId: "R-C",
        prompt: "把制度文件檢索結果提供給語言模型回答，最符合哪個概念？",
        choices: choices("RAG", "GAN", "OCR", "邊緣排序"),
        answer: ["A"],
        explanation: "RAG 會檢索外部知識，再增強模型生成內容。",
        topic: "生成式 AI",
        difficulty: "易"
      },
      {
        id: "R12",
        kind: "reading",
        passageId: "R-C",
        prompt: "要求回答附上來源，主要是為了降低哪種風險？",
        choices: choices("幻覺與不可追溯", "螢幕反光", "鍵盤磨損", "網頁字體過大"),
        answer: ["A"],
        explanation: "來源引用能協助查證，降低模型幻覺造成的信任風險。",
        topic: "AI 安全",
        difficulty: "中"
      },
      {
        id: "R13",
        kind: "reading",
        passageId: "R-C",
        prompt: "設計提示讓模型用固定格式輸出草稿，屬於哪項能力？",
        choices: choices("Prompt Engineering", "資料庫備援", "電腦視覺分割", "硬體散熱"),
        answer: ["A"],
        explanation: "提示工程可引導模型輸出格式、語氣與內容範圍。",
        topic: "生成式 AI",
        difficulty: "易"
      },
      {
        id: "R14",
        kind: "reading",
        passageId: "R-C",
        prompt: "追蹤準確率、成本與延遲，最接近哪個營運概念？",
        choices: choices("LLMOps", "純手工簽核", "圖靈測試原題", "只做一次性展示"),
        answer: ["A"],
        explanation: "LLMOps 關注生成式 AI 應用的評測、監控、成本與品質。",
        topic: "LLMOps",
        difficulty: "中"
      },
      {
        id: "R15",
        kind: "reading",
        passageId: "R-C",
        prompt: "不得把客戶個資輸入外部服務，主要是因為哪類風險？",
        choices: choices("隱私與資料外洩", "影像解析度下降", "網站配色不一致", "鍵盤快捷鍵衝突"),
        answer: ["A"],
        explanation: "個資與機密資料輸入外部模型服務可能造成資料外洩與合規風險。",
        topic: "AI 安全",
        difficulty: "易"
      }
    ]
  },
  {
    id: "R-D",
    title: "自動駕駛研發團隊",
    passage:
      "自動駕駛新創公司正在開發車載 AI 系統。車輛需要辨識道路標誌、框出行人與車輛，並理解乘客語音指令。研發團隊使用大量標記影像訓練模型，也將部分模型部署在車上以滿足即時反應需求。為了加速新城市上線，他們希望把既有城市訓練好的模型調整到新城市資料上。",
    questions: [
      {
        id: "R16",
        kind: "reading",
        passageId: "R-D",
        prompt: "框出行人與車輛，屬於哪種電腦視覺任務？",
        choices: choices("物件偵測", "文字摘要", "語音合成", "資料分頁"),
        answer: ["A"],
        explanation: "找出物件位置並以框標示，是物件偵測任務。",
        topic: "深度學習任務",
        difficulty: "易"
      },
      {
        id: "R17",
        kind: "reading",
        passageId: "R-D",
        prompt: "理解乘客語音指令，至少會涉及哪個任務？",
        choices: choices("語音辨識", "影像生成", "資料庫索引", "硬碟重組"),
        answer: ["A"],
        explanation: "語音指令需先將聲音轉為文字或語意，涉及語音辨識與 NLP。",
        topic: "AI 應用",
        difficulty: "易"
      },
      {
        id: "R18",
        kind: "reading",
        passageId: "R-D",
        prompt: "使用大量標記影像訓練道路標誌辨識，主要屬於哪種學習？",
        choices: choices("監督式學習", "非監督式學習", "無資料學習", "純規則式排版"),
        answer: ["A"],
        explanation: "有標記影像和正確答案可供模型學習，屬監督式學習。",
        topic: "機器學習方法",
        difficulty: "易"
      },
      {
        id: "R19",
        kind: "reading",
        passageId: "R-D",
        prompt: "將模型部署在車上以滿足即時反應，最符合哪個概念？",
        choices: choices("邊緣運算", "只用遠端批次報表", "永久離線人工判斷", "移除感測器"),
        answer: ["A"],
        explanation: "車載部署讓推論靠近資料來源，降低延遲。",
        topic: "雲端與邊緣運算",
        difficulty: "易"
      },
      {
        id: "R20",
        kind: "reading",
        passageId: "R-D",
        prompt: "把既有城市模型調整到新城市資料上，最符合哪個概念？",
        choices: choices("遷移學習", "刪除模型", "規則式加密", "資料庫正規化"),
        answer: ["A"],
        explanation: "將已學到的模型能力延伸到新但相關的任務或資料域，是遷移學習。",
        topic: "遷移學習",
        difficulty: "中"
      }
    ]
  }
];

export const allQuestions: Question[] = [
  ...singleChoiceQuestions,
  ...multipleChoiceQuestions,
  ...readingSets.flatMap((set) => set.questions)
];
