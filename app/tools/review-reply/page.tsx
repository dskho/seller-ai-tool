"use client";

import { useState } from "react";
import { PaywallGate } from "@/components/Paywall";
import { Button, Card, Textarea, CopyButton, Badge } from "@/components/ui";

type Tone = "sincere" | "humorous" | "professional";

const TONES: { value: Tone; label: string; desc: string }[] = [
  { value: "sincere", label: "诚恳", desc: "真诚道歉，共情给方案" },
  { value: "humorous", label: "幽默", desc: "轻松风趣，不失礼貌" },
  { value: "professional", label: "专业", desc: "正式得体，有品牌感" },
];

function NoApiKeyCard() {
  return (
    <Card className="border-amber-200 bg-amber-50">
      <p className="text-sm font-semibold text-amber-900">尚未配置 AI 服务</p>
      <p className="mt-2 text-sm leading-6 text-amber-800">
        尚未配置 API Key，请在 Vercel 环境变量或 .env.local 中设置 LLM_API_KEY
      </p>
    </Card>
  );
}

function ReviewReplyTool() {
  const [review, setReview] = useState("");
  const [tone, setTone] = useState<Tone>("sincere");
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState("");
  const [replaced, setReplaced] = useState<string[]>([]);
  const [noApiKey, setNoApiKey] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    if (!review.trim() || loading) return;
    setLoading(true);
    setReply("");
    setReplaced([]);
    setNoApiKey(false);
    setError("");
    try {
      const res = await fetch("/api/ai/review-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review: review.trim(), tone }),
      });
      const data = (await res.json()) as {
        ok: boolean;
        code?: string;
        reply?: string;
        replaced?: string[];
        message?: string;
      };
      if (!data.ok) {
        if (data.code === "NO_API_KEY") {
          setNoApiKey(true);
        } else {
          setError(data.message || "生成失败，请稍后重试");
        }
        return;
      }
      setReply(data.reply ?? "");
      setReplaced(data.replaced ?? []);
    } catch {
      setError("网络请求失败，请检查网络后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">差评回复</h1>
        <p className="mt-1 text-sm text-stone-500">
          粘贴买家评价，选择语气，AI 帮你写出得体的回复。
        </p>
      </div>

      {noApiKey && <NoApiKeyCard />}

      <Card>
        <p className="mb-2 text-sm font-medium text-stone-900">买家评价</p>
        <Textarea
          value={review}
          onChange={setReview}
          placeholder="例如：质量太差了，收到就坏了，客服还不理人，差评！"
          rows={5}
        />

        <p className="mb-2 mt-4 text-sm font-medium text-stone-900">回复语气</p>
        <div className="grid grid-cols-3 gap-2">
          {TONES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setTone(t.value)}
              className={`rounded-xl px-3 py-2.5 text-center ring-1 ring-inset transition-colors ${
                tone === t.value
                  ? "bg-orange-50 ring-2 ring-orange-600"
                  : "bg-white ring-stone-200 hover:bg-stone-50"
              }`}
            >
              <span
                className={`block text-sm font-medium ${
                  tone === t.value ? "text-orange-700" : "text-stone-900"
                }`}
              >
                {t.label}
              </span>
              <span className="mt-0.5 block text-xs text-stone-500">{t.desc}</span>
            </button>
          ))}
        </div>

        <Button
          onClick={generate}
          disabled={loading || !review.trim()}
          className="mt-4 w-full"
        >
          {loading ? "生成中…" : "生成回复"}
        </Button>
      </Card>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <p className="text-sm text-red-700">{error}</p>
        </Card>
      )}

      {reply && (
        <Card>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-stone-900">AI 回复</p>
            <CopyButton text={reply} />
          </div>
          <p className="whitespace-pre-wrap text-sm leading-7 text-stone-800">
            {reply}
          </p>
          {replaced.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-stone-100 pt-3">
              <span className="text-xs text-stone-500">
                已自动过滤极限词：
              </span>
              {replaced.map((w) => (
                <Badge key={w}>{w}</Badge>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

export default function ReviewReplyPage() {
  return (
    <PaywallGate>
      <ReviewReplyTool />
    </PaywallGate>
  );
}
