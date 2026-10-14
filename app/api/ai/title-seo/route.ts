import { chatComplete, LlmConfigError } from "@/lib/llm";

const SYSTEM_PROMPT =
  "你是中国电商平台的标题优化专家。用户会给你一个商品标题，你必须只输出纯 JSON（不要代码块标记、不要多余文字），格式如下：\n" +
  '{"versions":["优化版本1","优化版本2","优化版本3"],"keywords":["关键词1","关键词2",...]}\n' +
  "要求：versions 是 3 个不同风格的优化标题（突出卖点、符合搜索习惯、不要广告法极限词，每个 30 字以内）；" +
  "keywords 是 6-10 个可用于搜索优化的核心关键词（数组，不超过 10 个）。";

/** 容错解析模型返回的 JSON */
function parseJsonLoose(raw: string): { versions: string[]; keywords: string[] } {
  let text = raw.trim();
  // 去掉可能的 ```json 代码块
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (fenced) text = fenced[1].trim();
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("模型返回格式异常");
  const obj = JSON.parse(text.slice(start, end + 1)) as {
    versions?: unknown;
    keywords?: unknown;
  };
  const versions = Array.isArray(obj.versions)
    ? obj.versions.filter((v): v is string => typeof v === "string").slice(0, 3)
    : [];
  const keywords = Array.isArray(obj.keywords)
    ? obj.keywords.filter((k): k is string => typeof k === "string").slice(0, 10)
    : [];
  if (versions.length === 0) throw new Error("模型返回格式异常");
  return { versions, keywords };
}

export async function POST(req: Request) {
  try {
    let body: unknown = null;
    try {
      body = await req.json();
    } catch {
      body = null;
    }
    const b = (body ?? {}) as { title?: unknown };
    const title = typeof b.title === "string" ? b.title.trim() : "";

    if (!title) {
      return Response.json({ ok: false, code: "EMPTY_TITLE" });
    }
    if (!process.env.LLM_API_KEY) {
      return Response.json({ ok: false, code: "NO_API_KEY" });
    }

    const raw = await chatComplete(
      [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `商品标题：${title}` },
      ],
      { temperature: 0.8 }
    );

    const { versions, keywords } = parseJsonLoose(raw);
    return Response.json({ ok: true, versions, keywords });
  } catch (e) {
    if (e instanceof LlmConfigError) {
      return Response.json({ ok: false, code: "NO_API_KEY" });
    }
    return Response.json({
      ok: false,
      code: "LLM_ERROR",
      message: e instanceof Error ? e.message : String(e),
    });
  }
}
