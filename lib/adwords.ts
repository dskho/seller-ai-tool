// 广告法极限词过滤：把生成内容里的极限词替换为温和表达。

/** 极限词列表（至少包含这些，排序不作语义保证） */
export const BANNED_WORDS: string[] = [
  "最",
  "第一",
  "顶级",
  "首选",
  "极致",
  "绝无仅有",
  "史无前例",
  "销量冠军",
  "全网最低",
  "永久",
  "独家",
  "独一无二",
  "百分百",
  "100%",
  "国家级",
  "世界级",
  "最高",
  "最低",
  "首创",
  "首家",
  "第一品牌",
  "领导品牌",
  "至尊",
  "巅峰",
];

/** 极限词 → 温和替换词 */
const REPLACEMENTS: Record<string, string> = {
  最: "非常",
  第一: "出色",
  顶级: "高品质",
  首选: "值得选择",
  极致: "非常",
  绝无仅有: "独特",
  史无前例: "少见",
  销量冠军: "热销",
  全网最低: "优惠价",
  永久: "长久",
  独家: "特色",
  独一无二: "独特",
  百分百: "很高",
  "100%": "很高",
  国家级: "高水准",
  世界级: "高水准",
  最高: "出色",
  最低: "优惠",
  首创: "新颖",
  首家: "早期",
  第一品牌: "深受喜爱",
  领导品牌: "深受喜爱",
  至尊: "尊贵",
  巅峰: "出色",
};

export function sanitize(text: string): { clean: string; replaced: string[] } {
  const replaced: string[] = [];
  // 先替换长词，避免短词先命中破坏长词（如"第一品牌"里的"第一"）
  const words = [...new Set(BANNED_WORDS)].sort((a, b) => b.length - a.length);
  let clean = text;
  for (const word of words) {
    if (!clean.includes(word)) continue;
    const target = REPLACEMENTS[word] ?? "非常";
    clean = clean.split(word).join(target);
    replaced.push(word);
  }
  return { clean, replaced };
}
