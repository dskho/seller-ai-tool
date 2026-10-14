import Link from "next/link";
import { Badge } from "@/components/ui";
import { PLANS } from "@/lib/payment";

export function Pricing() {
  return (
    <section id="pricing" className="bg-stone-50 py-16">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="text-center text-2xl font-bold text-stone-900 sm:text-3xl">
          简单透明的价格
        </h2>
        <p className="mt-2 text-center text-sm text-stone-600">
          先免费试 7 天，觉得好用再掏钱
        </p>

        {/* 7 天试用说明条 */}
        <div className="mx-auto mt-6 flex max-w-2xl items-center justify-center gap-2 rounded-xl bg-amber-100 px-4 py-3 text-sm font-medium text-amber-900 ring-1 ring-amber-200">
          <span>🎉</span>
          <span>7 天免费试用：注册邮箱即开始，无需绑卡，全功能开放</span>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {PLANS.map((plan) => {
            const highlighted = plan.id === "pro";
            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 transition ${
                  highlighted
                    ? "ring-2 ring-orange-600 sm:-translate-y-2"
                    : "ring-stone-200"
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge>{plan.badge}</Badge>
                  </span>
                )}
                <h3 className="text-lg font-bold text-stone-900">{plan.name}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-stone-900">
                    {plan.price}
                  </span>
                  <span className="text-sm text-stone-500">元/月</span>
                </div>
                <ul className="mt-4 flex-1 space-y-2.5">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm text-stone-700"
                    >
                      <span className="mt-0.5 text-orange-600">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/checkout?plan=${plan.id}`}
                  className={`mt-6 rounded-xl px-6 py-3 text-center text-sm font-semibold transition ${
                    highlighted
                      ? "bg-orange-600 text-white hover:bg-orange-700"
                      : "bg-stone-100 text-stone-800 hover:bg-stone-200"
                  }`}
                >
                  选择{plan.name}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
