"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button, Card } from "@/components/ui";
import { PLANS, MockPaymentProvider } from "@/lib/payment";
import { markSubscribed } from "@/lib/trial";

type PayState = "idle" | "processing" | "success";

function CheckoutInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get("plan") ?? "pro";
  const plan = PLANS.find((p) => p.id === planId) ?? PLANS[1];

  const [state, setState] = useState<PayState>("idle");
  const [channel, setChannel] = useState<string | null>(null);
  const [orderId, setOrderId] = useState("");

  const handlePay = async (method: "微信支付" | "支付宝") => {
    setChannel(method);
    setState("processing");
    const provider = new MockPaymentProvider();
    const { orderId } = await provider.createOrder(plan.id, "");
    // 演示：1.5 秒"处理中"后标记订阅成功
    await new Promise((r) => setTimeout(r, 1500));
    setOrderId(orderId);
    markSubscribed(plan.id);
    setState("success");
  };

  if (state === "success") {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-stone-50 px-4 py-16">
        <Card className="w-full max-w-md text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-3xl">
            ✓
          </div>
          <h1 className="mt-4 text-2xl font-bold text-stone-900">订阅成功</h1>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            你已订阅「{plan.name}」（{plan.price} 元/月）
            <br />
            订单号：{orderId}
          </p>
          <Button
            onClick={() => router.push("/tools/review-reply")}
            className="mt-6 w-full py-3.5 text-base"
          >
            去使用工具
          </Button>
          <Link
            href="/"
            className="mt-3 inline-block text-sm text-stone-500 hover:text-stone-700"
          >
            返回首页
          </Link>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-stone-50 px-4 py-16">
      <div className="w-full max-w-md">
        <p className="mb-4 text-center text-xs text-stone-500">
          演示环境，尚未接入真实支付
        </p>
        <Card>
          <h1 className="text-xl font-bold text-stone-900">确认订单</h1>

          {/* 订单摘要 */}
          <div className="mt-5 rounded-xl bg-stone-50 p-5 ring-1 ring-stone-200">
            <p className="font-bold text-stone-900">
              电商小工 · {plan.name}
              {plan.badge && (
                <span className="ml-2 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-700">
                  {plan.badge}
                </span>
              )}
            </p>
            <p className="mt-1 text-xs text-stone-500">
              {plan.features.slice(0, 3).join(" · ")}
            </p>
            <div className="mt-4 flex items-baseline justify-between border-t border-stone-200 pt-4">
              <span className="text-sm text-stone-600">应付金额</span>
              <span className="text-2xl font-extrabold text-orange-600">
                ¥{plan.price}
                <span className="text-sm font-normal text-stone-500">/月</span>
              </span>
            </div>
          </div>

          {/* 切换套餐 */}
          <div className="mt-4 flex gap-2">
            {PLANS.map((p) => (
              <Link
                key={p.id}
                href={`/checkout?plan=${p.id}`}
                className={`flex-1 rounded-xl px-3 py-2 text-center text-sm font-medium ring-1 transition ${
                  p.id === plan.id
                    ? "bg-orange-50 text-orange-700 ring-orange-300"
                    : "bg-white text-stone-600 ring-stone-200 hover:bg-stone-50"
                }`}
              >
                {p.name}
                <br />
                <span className="text-xs">¥{p.price}/月</span>
              </Link>
            ))}
          </div>

          {/* Mock 支付区（品牌色按钮保留原生实现） */}
          <div className="mt-6 space-y-3">
            <button
              onClick={() => handlePay("微信支付")}
              disabled={state === "processing"}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
            >
              {state === "processing" && channel === "微信支付" ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  处理中…
                </>
              ) : (
                "微信支付（模拟）"
              )}
            </button>
            <button
              onClick={() => handlePay("支付宝")}
              disabled={state === "processing"}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              {state === "processing" && channel === "支付宝" ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  处理中…
                </>
              ) : (
                "支付宝（模拟）"
              )}
            </button>
          </div>

          <p className="mt-4 text-center text-xs text-stone-500">
            订阅后可随时取消，按月续费
          </p>
        </Card>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[70vh] items-center justify-center bg-stone-50 px-4 py-16">
          <div className="w-full max-w-md animate-pulse rounded-2xl bg-white p-8 shadow-sm ring-1 ring-stone-200">
            <div className="h-6 w-1/3 rounded bg-stone-200" />
            <div className="mt-5 h-24 rounded-xl bg-stone-100" />
            <div className="mt-4 h-12 rounded-xl bg-stone-100" />
          </div>
        </main>
      }
    >
      <CheckoutInner />
    </Suspense>
  );
}
