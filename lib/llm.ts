// 服务端专用：封装 OpenAI 兼容的 Chat Completions 接口
// 注意：不要加 "use client"，只能在服务端组件 / Route Handler 中使用。

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/** LLM 配置缺失（未设置 LLM_API_KEY）时抛出的错误 */
export class LlmConfigError extends Error {
  constructor(message = "未配置 LLM_API_KEY 环境变量") {
    super(message);
    this.name = "LlmConfigError";
  }
}

const TIMEOUT_MS = 60_000;

/**
 * 调用 OpenAI 兼容的 /chat/completions，返回助手消息的文本内容。
 * 环境变量：LLM_API_KEY（必填）、LLM_BASE_URL（默认 https://api.openai.com/v1）、
 * LLM_MODEL（默认 gpt-4o-mini）。
 */
export async function chatComplete(
  messages: ChatMessage[],
  opts?: { temperature?: number }
): Promise<string> {
  const apiKey = process.env.LLM_API_KEY;
  if (!apiKey) {
    throw new LlmConfigError();
  }
  const baseUrl = (process.env.LLM_BASE_URL || "https://api.openai.com/v1").replace(
    /\/+$/,
    ""
  );
  const model = process.env.LLM_MODEL || "gpt-4o-mini";

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: opts?.temperature ?? 0.7,
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      let detail = "";
      try {
        detail = await res.text();
      } catch {
        // 忽略读取错误体
      }
      throw new Error(`LLM 请求失败（${res.status}）${detail.slice(0, 200)}`);
    }

    const data: unknown = await res.json();
    const content = (
      data as { choices?: { message?: { content?: unknown } }[] }
    )?.choices?.[0]?.message?.content;
    if (typeof content !== "string" || !content.trim()) {
      throw new Error("LLM 返回内容为空");
    }
    return content.trim();
  } catch (e) {
    if (e instanceof Error && e.name === "AbortError") {
      throw new Error("LLM 请求超时（60 秒）");
    }
    throw e;
  } finally {
    clearTimeout(timer);
  }
}
