import Link from "next/link";
import { Pricing } from "@/components/Pricing";

const PAINS = [
  {
    emoji: "😮‍💨",
    title: "差评回复心累",
    desc: "一条差评磨半小时，语气太软被骂、太硬被投诉，回也不是不回也不是。",
  },
  {
    emoji: "📉",
    title: "标题没流量",
    desc: "标题凑满 30 个字还是没曝光，关键词怎么组合全靠玄学。",
  },
  {
    emoji: "🔁",
    title: "客服话术翻来覆去",
    desc: "催付、砍价、售后同一套话术讲一百遍，新人来了又要从头教。",
  },
];

const FEATURES = [
  {
    emoji: "💬",
    title: "差评 AI 回复",
    desc: "粘贴差评内容，一键生成得体又不卑不亢的回复，支持多风格切换。",
    href: "/tools/review-reply" as const,
    coming: false,
  },
  {
    emoji: "🔍",
    title: "标题 SEO 优化",
    desc: "输入商品信息，AI 组合高流量关键词，生成点击率更高的标题。",
    href: "/tools/title-seo" as const,
    coming: false,
  },
  {
    emoji: "🖼️",
    title: "主图卖点文案",
    desc: "一张主图讲清一个卖点，文案排版建议一次给到位。",
    href: null,
    coming: true,
  },
  {
    emoji: "📚",
    title: "客服话术库",
    desc: "催付、议价、售后、差评挽回，常用场景话术开箱即用。",
    href: null,
    coming: true,
  },
];

const FAQS = [
  {
    q: "试用需要绑卡吗？",
    a: "不需要。注册邮箱就开始 7 天免费试用，全功能开放。到试用结束前都不需要输入任何支付信息。",
  },
  {
    q: "我的商品数据安全吗？",
    a: "你输入的商品信息只用于当次 AI 生成，不会用于训练模型，也不会分享给第三方。付费后可随时删除历史记录。",
  },
  {
    q: "支持哪些电商平台？",
    a: "话术和标题逻辑通用，适用于淘宝、京东、拼多多、抖音小店、小红书等主流平台。后续会针对各平台规则做专项优化。",
  },
  {
    q: "试用到期会怎样？",
    a: "试用到期后工具会暂停使用，你的内容不会丢失。随时订阅任意套餐即可继续，历史生成记录都还在。",
  },
];

export default function Home() {
  return (
    <main className="bg-white text-stone-900">
      {/* Hero */}
      <section className="px-4 pb-16 pt-16 text-center sm:pt-24">
        <div className="mx-auto max-w-2xl">
          <span className="inline-block rounded-full bg-orange-100 px-4 py-1.5 text-xs font-semibold text-orange-700 ring-1 ring-orange-200">
            专为中小卖家打造
          </span>
          <h1 className="mt-5 text-3xl font-extrabold leading-tight sm:text-4xl">
            电商小工
            <br />
            <span className="text-orange-600">
              卖家的 AI 小工，差评标题一键搞定
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base leading-7 text-stone-600">
            回差评、写标题、编话术这些磨人的小活，交给 AI 小工三秒搞定，你只管卖货。
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/signup"
              className="w-full rounded-xl bg-orange-600 px-8 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-orange-700 sm:w-auto"
            >
              免费试用 7 天
            </Link>
            <a
              href="#pricing"
              className="w-full rounded-xl bg-stone-100 px-8 py-3.5 text-base font-semibold text-stone-800 transition hover:bg-stone-200 sm:w-auto"
            >
              看看价格
            </a>
          </div>
          <p className="mt-4 text-xs text-stone-500">
            无需绑卡 · 注册即用 · 随时取消
          </p>
        </div>
      </section>

      {/* 痛点区 */}
      <section className="bg-stone-50 px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">
            这些头疼事，是不是每天都在发生
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {PAINS.map((p) => (
              <div
                key={p.title}
                className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200"
              >
                <div className="text-3xl">{p.emoji}</div>
                <h3 className="mt-3 text-base font-bold">{p.title}</h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 功能展示 */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">
            一个小工，顶四个帮手
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="relative rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200"
              >
                {f.coming && (
                  <span className="absolute right-4 top-4 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-200">
                    即将上线
                  </span>
                )}
                <div className="text-3xl">{f.emoji}</div>
                <h3 className="mt-3 text-base font-bold">{f.title}</h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">{f.desc}</p>
                {f.href && !f.coming ? (
                  <Link
                    href={f.href}
                    className="mt-4 inline-block text-sm font-semibold text-orange-600 hover:text-orange-700"
                  >
                    立即试用 →
                  </Link>
                ) : (
                  <span className="mt-4 inline-block text-sm text-stone-400">
                    敬请期待
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 定价 */}
      <Pricing />

      {/* FAQ */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">
            常见问题
          </h2>
          <div className="mt-8 space-y-4">
            {FAQS.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200"
              >
                <summary className="cursor-pointer list-none text-base font-semibold">
                  {f.q}
                </summary>
                <p className="mt-2 text-sm leading-6 text-stone-600">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 底部 CTA */}
      <section className="bg-orange-600 px-4 py-16 text-center">
        <div className="mx-auto max-w-xl">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            今晚的差评，就让 AI 帮你回
          </h2>
          <p className="mt-3 text-sm text-orange-100">
            7 天免费试用，不用绑卡，注册邮箱就能开始
          </p>
          <Link
            href="/signup"
            className="mt-8 inline-block rounded-xl bg-white px-10 py-3.5 text-base font-bold text-orange-700 shadow transition hover:bg-orange-50"
          >
            免费试用 7 天
          </Link>
        </div>
      </section>
    </main>
  );
}
