import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";

const outputDir = "docs/raw/downloaded";
const manifestPath = "docs/raw/materials-manifest.json";

type SourceLink = {
  url: string;
  source: "syllabus" | "reading";
  note: string;
};

type DownloadResult = SourceLink & {
  ok: boolean;
  status?: number;
  contentType?: string | null;
  file?: string;
  error?: string;
};

const links: SourceLink[] = [
  { url: "https://reurl.cc/DlOrN5", source: "syllabus", note: "AI literacy pre-test reading material short link" },
  { url: "https://aiacademy.tw/admission-genai7-tp/", source: "syllabus", note: "Taiwan AI Academy GenAI course page" },
  { url: "https://www.books.com.tw/products/0010987707", source: "syllabus", note: "AI safety reference book" },
  { url: "https://www.amazon.co.uk/Introduction-Generative-AI-Societal-Overview/dp/1633437191", source: "syllabus", note: "Introduction to Generative AI reference book" },
  { url: "https://www.tenlong.com.tw/products/9787121439261", source: "syllabus", note: "AI safety technical reference" },
  { url: "https://www.books.com.tw/products/0010975738?sloc=main", source: "syllabus", note: "Fei-Fei Li AI memoir reference" },
  { url: "https://www.tenlong.com.tw/products/9789865021924", source: "syllabus", note: "Deep Learning traditional Chinese edition" },
  { url: "https://www.books.com.tw/products/0010821934", source: "syllabus", note: "Artificial intelligence in Taiwan reference" },
  { url: "https://speech.ee.ntu.edu.tw/%7Ehylee/ml/2023-spring.php", source: "syllabus", note: "NTU Hung-yi Lee machine learning course" },
  { url: "https://www.iii.org.tw/Publish/DownloadPages_download.aspx?dp_sqno=26", source: "syllabus", note: "III enterprise GenAI literacy guide" },
  { url: "https://speech.ee.ntu.edu.tw/%7Ehylee/genai/2024-spring.php", source: "syllabus", note: "NTU Hung-yi Lee generative AI course" },
  { url: "https://learnprompting.org/zh-tw/docs/intro", source: "syllabus", note: "Learn Prompting introduction" },
  { url: "https://www.books.com.tw/products/0010922085", source: "syllabus", note: "Manufacturing data science reference" },
  { url: "https://www.tenlong.com.tw/products/9786267273852", source: "syllabus", note: "Data science introductory reference" },
  { url: "https://www.books.com.tw/products/0010905287", source: "syllabus", note: "Statistical practice for data science reference" },
  { url: "https://finance.yahoo.com/news/ceos-revolution-coming-140021597.html", source: "reading", note: "AI era and industrial change source" },
  { url: "https://blogs.nvidia.com.tw/2016/07/whats-difference-artificial-intelligence-machine-learning-deep-learning-ai/", source: "reading", note: "AI, ML, and deep learning distinction" },
  { url: "https://www.techleer.com/articles/203-machine-learning-algorithm-backbone-of-emerging-technologies/", source: "reading", note: "Machine learning algorithms overview" },
  { url: "https://becominghuman.ai/the-very-basics-of-reinforcement-learning-154f28a7907129", source: "reading", note: "Reinforcement learning basics" },
  { url: "https://learn.microsoft.com/zh-tw/dotnet/machine-learning/automated-machine-learning-mlnet", source: "reading", note: "Automated ML concept" },
  { url: "https://www.researchgate.net/figure/Artificial-neural-network-architecture-ANN-i-h-1-h-2-h-n-o_fig1_321259051", source: "reading", note: "Artificial neural network architecture diagram" },
  { url: "https://github.com/jonbruner/generative-adversarial-networks/blob/master/gan-notebook.ipynb", source: "reading", note: "GAN notebook" },
  { url: "https://en.wikipedia.org/wiki/Midjourney", source: "reading", note: "Midjourney reference; normalized from extracted slide text" },
  { url: "https://www.jonpeddie.com/news/llama-2-to-run-locally-for-you-with-snapdragon", source: "reading", note: "Local Llama 2 reference; normalized from extracted slide text" },
  { url: "https://medium.com/@bakingai/llmops-the-future-of-mlops-for-generative-ai-aed95decf21e92", source: "reading", note: "LLMOps reference" }
];

const extensionFor = (url: string, contentType: string | null): string => {
  const fromUrl = extname(new URL(url).pathname);
  if (fromUrl && fromUrl.length <= 8) return fromUrl;
  if (contentType?.includes("pdf")) return ".pdf";
  if (contentType?.includes("json")) return ".json";
  if (contentType?.includes("text/plain")) return ".txt";
  return ".html";
};

const safeStem = (url: string): string => {
  const parsed = new URL(url);
  const slug = `${parsed.hostname}${parsed.pathname}`
    .replace(/^www\./, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
  const hash = createHash("sha1").update(url).digest("hex").slice(0, 8);
  return `${slug}-${hash}`;
};

const download = async (link: SourceLink): Promise<DownloadResult> => {
  try {
    const response = await fetch(link.url, {
      redirect: "follow",
      headers: {
        "user-agent": "aiatcl-cert-practice-material-downloader/0.1"
      }
    });
    const contentType = response.headers.get("content-type");
    const extension = extensionFor(response.url, contentType);
    const file = join(outputDir, `${safeStem(link.url)}${extension}`);
    const body = new Uint8Array(await response.arrayBuffer());
    await writeFile(file, body);
    return {
      ...link,
      ok: response.ok,
      status: response.status,
      contentType,
      file
    };
  } catch (error) {
    return {
      ...link,
      ok: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

await mkdir(outputDir, { recursive: true });

const results: DownloadResult[] = [];
for (const link of links) {
  console.log(`Downloading ${link.url}`);
  results.push(await download(link));
}

await writeFile(
  manifestPath,
  `${JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2)}\n`
);

const okCount = results.filter((result) => result.ok).length;
console.log(`Downloaded ${okCount}/${results.length} resources. Manifest: ${manifestPath}`);
