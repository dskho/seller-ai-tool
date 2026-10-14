"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui";
import { getTrialStatus, type TrialStatus } from "@/lib/trial";

/**
 * 付费墙门卫：仅 trial active 或 subscribed 时渲染 children。
 * expired / none 时渲染付费墙卡片，绝不直接渲染 children。
 */
export function PaywallGate({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<TrialStatus | null>(null);

  useEffect(() => {
    setStatus(getTrialStatus());
  }, []);

  // localStorage 尚未读取时先渲染骨架屏，避免服务端/客户端闪烁
  if (status === null) {
    return (
      <Card className="mx-auto max-w-md">
        <div className="h-4 w-2/3 animate-pulse rounded bg-stone-200" />
        <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-stone-200" />
      </Card>
    );
  }

  if (status === "active" || status === "subscribed") {
    return <>{children}</>;
  }

  return (
    <Card className="mx-auto max-w-md text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-xl">
        🔒
      </div>
      <h2 className="mt-4 text-xl font-bold text-stone-900">
        {status === "expired" ? "免费试用已到期" : "先开启免费试用"}
      </h2>
      <p className="mt-2 text-sm leading-6 text-stone-600">
        {status === "expired"
          ? "你的 7 天免费试用已经结束了。升级订阅，继续让 AI 帮你回差评、写标题、搞话术。"
          : "这个功能需要试用或订阅后使用。注册邮箱即可开始 7 天免费试用，无需绑卡。"}
      </p>
      <div className="mt-6 flex flex-col gap-3">
        <Link
          href="/signup"
          className="rounded-xl bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
        >
          免费试用 7 天
        </Link>
        <Link
          href="/checkout"
          className="rounded-xl bg-stone-100 px-6 py-3 text-sm font-semibold text-stone-800 transition hover:bg-stone-200"
        >
          查看套餐
        </Link>
      </div>
      <p className="mt-4 text-xs text-stone-500">无需绑卡，随时可以取消</p>
    </Card>
  );
}
