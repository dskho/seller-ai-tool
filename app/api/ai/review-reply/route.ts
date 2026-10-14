import { chatComplete, LlmConfigError } from "@/lib/llm";
import { sanitize } from "@/lib/adwords";

const SYSTEM_PROMPTS: Record<string, string> = {
  sincere:
    "你是电商平台的资深客服代表，擅长回复买家的差评和中评。请用真诚、共情的语气写一封回复：先诚恳道歉，表达对买家感受的理解，然后给出具体可行的解决方案（如退款、补发、换货），最后邀请买家继续沟通。回复简短自然，控制在 200 字以内，不要使用广告法极限词。",
  humorous:
    "你是电商平台的客服代表，性格幽默风趣。请用轻松风趣但不失礼貌的语气回复买家的差评或中评：用一句得体的幽默化解尴尬，然后真诚给出解决方案（如退款、补发、换货）。幽默有度，绝不冒犯买家。回复简短，控制在 200 字以内，不要使用广告法极限词。",
  professional:
    "你是知名品牌的官方客服，言辞正式得体、富有品牌感。请用专业、稳重的语气回复买家的差评或中评：先正式致歉并表明重视，然后给出清晰的解决方案（如退款、补发、换货），最后以品牌口吻收尾。回复控制在 200 字以内，不要使用广告法极限词。",
};

export async function POST(req: Request) {
  try {
    let body: unknown = null;
    try {
      body = await req.json();
    } catch {
      body = null;
    }
    const b = (body ?? {}) as { review?: unknown; tone?: unknown };
    const review = typeof b.review === "string" ? b.review.trim() : "";
    const tone =
      b.tone === "humorous" || b.tone === "professional" ? b.tone : "sincere";

    if (!review) {
      return Response.json({ ok: false, code: "EMPTY_REVIEW" });
    }
    if (!process.env.LLM_API_KEY) {
      return Response.json({ ok: false, code: "NO_API_KEY" });
    }

    const reply = await chatComplete([
      { role: "system", content: SYSTEM_PROMPTS[tone] },
      { role: "user", content: `买家评价内容：\n${review}` },
    ]);

    const { clean, replaced } = sanitize(reply);
    return Response.json({ ok: true, reply: clean, replaced });
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
