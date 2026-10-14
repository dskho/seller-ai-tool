// 套餐定义与支付 Provider 抽象
// 演示阶段使用 MockPaymentProvider；接入真实支付时无需改动调用方。

export interface Plan {
  id: "basic" | "pro" | "flagship";
  name: string;
  price: number; // 元/月
  features: string[];
  badge?: string;
}

export const PLANS: Plan[] = [
  {
    id: "basic",
    name: "基础版",
    price: 49,
    features: ["差评 AI 回复", "标题 SEO 优化", "每月 200 次 AI 生成"],
  },
  {
    id: "pro",
    name: "专业版",
    price: 99,
    badge: "最受欢迎",
    features: [
      "无限次 AI 生成",
      "主图卖点文案",
      "客服话术库",
      "含基础版全部功能",
    ],
  },
  {
    id: "flagship",
    name: "旗舰版",
    price: 199,
    features: ["含专业版全部功能", "批量处理", "API 接入", "专属客服"],
  },
];

/** 支付渠道抽象：创建订单返回 orderId，调用方不关心具体支付方式。 */
export interface PaymentProvider {
  name: string;
  createOrder(planId: string, email: string): Promise<{ orderId: string }>;
}

/** 模拟支付：演示环境用。真实接入时替换/新增实现类即可。 */
export class MockPaymentProvider implements PaymentProvider {
  name = "mock";

  async createOrder(
    planId: string,
    email: string,
  ): Promise<{ orderId: string }> {
    // TODO: 待接入微信支付/支付宝。
    // PaymentProvider 接口已抽象好，接入时只需新增实现类
    // （如 WechatPayProvider、AlipayProvider），
    // 在 checkout 页面按用户选择的渠道传入对应实现类，
    // 调用方（createOrder 调用处）无需改动。
    void email;
    return { orderId: `mock-${planId}-${Date.now()}` };
  }
}
