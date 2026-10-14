"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Input } from "@/components/ui";
import {
  getTrialDaysLeft,
  getTrialEmail,
  getTrialStatus,
  startTrial,
} from "@/lib/trial";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  useEffect(() => {
    const status = getTrialStatus();
    if (status === "active") {
      setDaysLeft(getTrialDaysLeft());
      const saved = getTrialEmail();
      if (saved) setEmail(saved);
    } else if (status === "subscribed") {
      router.replace("/tools/review-reply");
    }
  }, [router]);

  const handleStart = () => {
    const trimmed = email.trim();
    if (!isValidEmail(trimmed)) {
      setError("请输入有效的邮箱地址");
      return;
    }
    setError("");
    startTrial(trimmed);
    router.push("/tools/review-reply");
  };

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-stone-50 px-4 py-16">
      <Card className="w-full max-w-md">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-2xl">
            🛠️
          </div>
          <h1 className="mt-4 text-2xl font-bold text-stone-900">
            开始 7 天免费试用
          </h1>
          <p className="mt-2 text-sm text-stone-600">
            注册邮箱即开始，全功能开放，无需绑卡
          </p>
        </div>

        {daysLeft !== null && (
          <div className="mt-6 rounded-xl bg-amber-50 px-4 py-3 text-center text-sm font-medium text-amber-800 ring-1 ring-amber-200">
            你的试用还在进行中，剩余 {daysLeft} 天。
            <button
              onClick={() => router.push("/tools/review-reply")}
              className="ml-1 font-bold text-orange-700 underline"
            >
              直接去使用 →
            </button>
          </div>
        )}

        <form
          className="mt-6"
          onSubmit={(e) => {
            e.preventDefault();
            handleStart();
          }}
        >
          <label className="text-sm font-medium text-stone-700">
            邮箱地址
            <span className="mt-2 block">
              <Input
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="you@example.com"
              />
            </span>
          </label>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          <Button type="submit" className="mt-4 w-full py-3.5 text-base">
            开始 7 天试用
          </Button>
        </form>

        <p className="mt-4 text-center text-xs leading-5 text-stone-500">
          试用到期前可随时订阅，历史生成记录会保留。
          <br />
          我们不会向你的邮箱发送垃圾邮件。
        </p>
      </Card>
    </main>
  );
}
