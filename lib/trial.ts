// 试用与订阅状态：localStorage 实现，仅客户端调用。
// key 前缀 eap_。试用有效期 7 天；localStorage 中存在 eap_plan 即视为已订阅。

const TRIAL_KEY = "eap_trial"; // JSON: { email, startedAt }
const PLAN_KEY = "eap_plan"; // 已订阅的 planId
const TRIAL_DAYS = 7;

export type TrialStatus = "active" | "expired" | "none" | "subscribed";

interface TrialRecord {
  email: string;
  startedAt: number;
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function readTrial(): TrialRecord | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(TRIAL_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<TrialRecord>;
    if (typeof parsed.startedAt !== "number") return null;
    return { email: parsed.email ?? "", startedAt: parsed.startedAt };
  } catch {
    return null;
  }
}

/** 开始试用：记录邮箱与开始时间。 */
export function startTrial(email: string): void {
  if (!isBrowser()) return;
  const record: TrialRecord = { email, startedAt: Date.now() };
  window.localStorage.setItem(TRIAL_KEY, JSON.stringify(record));
}

/** 获取试用状态：active（7 天内）/ expired（超期）/ none（未开始）/ subscribed（已付费）。 */
export function getTrialStatus(): TrialStatus {
  if (!isBrowser()) return "none";
  if (window.localStorage.getItem(PLAN_KEY)) return "subscribed";
  const trial = readTrial();
  if (!trial) return "none";
  const elapsedMs = Date.now() - trial.startedAt;
  return elapsedMs < TRIAL_DAYS * 24 * 3600 * 1000 ? "active" : "expired";
}

/** 试用剩余天数（向上取整，过期为 0）。 */
export function getTrialDaysLeft(): number {
  const trial = readTrial();
  if (!trial) return 0;
  const leftMs = TRIAL_DAYS * 24 * 3600 * 1000 - (Date.now() - trial.startedAt);
  return Math.max(0, Math.ceil(leftMs / (24 * 3600 * 1000)));
}

/** 付费成功后调用：标记已订阅对应套餐。 */
export function markSubscribed(planId: string): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(PLAN_KEY, planId);
}

/** 当前试用邮箱（无试用时返回 null），可用于回填。 */
export function getTrialEmail(): string | null {
  return readTrial()?.email ?? null;
}
