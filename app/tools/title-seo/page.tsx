"use client";

import { useState } from "react";
import { PaywallGate } from "@/components/Paywall";
import { Button, Card, Input, CopyButton, Badge } from "@/components/ui";

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

function TitleSeoTool() {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [versions, setVersions] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [noApiKey, setNoApiKey] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    if (!title.trim() || loading) return;
    setLoading(true);
    setVersions([]);
    setKeywords([]);
    setNoApiKey(false);
    setError("");
    try {
      const res = await fetch("/api/ai/title-seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim() }),
      });
      const data = (await res.json()) as {
        ok: boolean;
        code?: string;
        versions?: string[];
        keywords?: string[];
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
      setVersions(data.versions ?? []);
      setKeywords(data.keywords ?? []);
    } catch {
      setError("网络请求失败，请检查网络后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">标题优化</h1>
        <p className="mt-1 text-sm text-stone-500">
          输入商品标题，AI 生成 3 个优化版本和搜索关键词。
        </p>
      </div>

      {noApiKey && <NoApiKeyCard />}

      <Card>
        <p className="mb-2 text-sm font-medium text-stone-900">商品标题</p>
        <Input
          value={title}
          onChange={setTitle}
          placeholder="例如：白色陶瓷马克杯 350ml 家用咖啡杯"
        />
        <Button
          onClick={generate}
          disabled={loading || !title.trim()}
          className="mt-4 w-full"
        >
          {loading ? "优化中…" : "生成优化标题"}
        </Button>
      </Card>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <p className="text-sm text-red-700">{error}</p>
        </Card>
      )}

      {versions.length > 0 && (
        <div className="space-y-3">
          {versions.map((v, i) => (
            <Card key={i}>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium text-stone-900">
                  优化版本 {i + 1}
                </p>
                <CopyButton text={v} />
              </div>
              <p className="text-sm leading-7 text-stone-800">{v}</p>
            </Card>
          ))}
        </div>
      )}

      {keywords.length > 0 && (
        <Card>
          <p className="mb-3 text-sm font-medium text-stone-900">搜索关键词</p>
          <div className="flex flex-wrap gap-2">
            {keywords.map((k) => (
              <Badge key={k}>{k}</Badge>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

export default function TitleSeoPage() {
  return (
    <PaywallGate>
      <TitleSeoTool />
    </PaywallGate>
  );
}
