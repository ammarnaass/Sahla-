/**
 * 💼 خدمة الاشتراكات وإدارة الـ SaaS المتعدد للمستأجرين (Subscription & SaaS Engine)
 * Plan management, quota enforcement, wholesale scratch card generation & MRR tracking
 */

import { shopRepository, ShopRecord } from "../repositories/shopRepository";
import { walletRepository, CardRecord } from "../repositories/walletRepository";
import { SAAS_PLANS, SaaSPlan } from "../config/constants";

export interface SaasMetrics {
  mrrDZD: number;
  totalSubscribers: number;
  planBreakdown: Record<string, number>;
  totalPointsGranted: number;
}

class SubscriptionService {
  getPlans(): SaaSPlan[] {
    return SAAS_PLANS;
  }

  getPlanById(planId: string): SaaSPlan | undefined {
    return SAAS_PLANS.find((p) => p.id === planId);
  }

  upgradePlan(
    shopId: string,
    targetPlanId: "STARTER" | "PRO_KIOSK" | "ENTERPRISE",
    paymentMethod: "CIB_EDAHABIA" | "MANUAL_INVOICE" | "POINTS" = "CIB_EDAHABIA"
  ): {
    success: boolean;
    shop: ShopRecord;
    plan: SaaSPlan;
    invoiceRef: string;
    pointsGranted: number;
  } {
    const plan = this.getPlanById(targetPlanId);
    if (!plan) throw new Error("خطة الاشتراك المحددة غير صالحة");

    const invoiceRef = `SAAS-${targetPlanId.slice(0, 3)}-${Date.now().toString().slice(-6)}`;
    const shop = shopRepository.updatePlan(shopId, targetPlanId, 30);
    if (!shop) throw new Error("المحل التجاري غير موجود");

    // Credit monthly quota points associated with the plan
    let updatedShop = shop;
    if (plan.monthlyPoints > 0) {
      updatedShop = shopRepository.updatePoints(shopId, plan.monthlyPoints)!;
      walletRepository.addLedgerEntry({
        shopId,
        desc: `تفعيل خطة [${plan.nameAr}] وشحن ${plan.monthlyPoints} نقطة مشمولة (${invoiceRef})`,
        pts: `+${plan.monthlyPoints}`,
        after: updatedShop.points,
      });
    }

    return {
      success: true,
      shop: updatedShop,
      plan,
      invoiceRef,
      pointsGranted: plan.monthlyPoints,
    };
  }

  checkDeviceQuota(shopId: string, currentDeviceCount: number): { allowed: boolean; max: number } {
    const shop = shopRepository.findById(shopId);
    const plan = this.getPlanById(shop?.plan || "STARTER") || SAAS_PLANS[0];
    return {
      allowed: currentDeviceCount <= plan.maxDevices,
      max: plan.maxDevices,
    };
  }

  checkStaffQuota(shopId: string, currentStaffCount: number): { allowed: boolean; max: number } {
    const shop = shopRepository.findById(shopId);
    const plan = this.getPlanById(shop?.plan || "STARTER") || SAAS_PLANS[0];
    return {
      allowed: currentStaffCount < plan.maxStaff,
      max: plan.maxStaff,
    };
  }

  generateWholesaleBatch(
    pointsPerCard: number = 100,
    count: number = 20,
    priceDZD: number = 1000
  ): {
    batchNumber: string;
    count: number;
    pointsPerCard: number;
    priceDZD: number;
    cards: CardRecord[];
  } {
    const batchNumber = `BATCH-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(
      100 + Math.random() * 900
    )}`;
    const cards = walletRepository.generateBatchCards(count, pointsPerCard, priceDZD, batchNumber);

    return {
      batchNumber,
      count: cards.length,
      pointsPerCard,
      priceDZD,
      cards,
    };
  }

  getMetrics(): SaasMetrics {
    const shops = shopRepository.getAll();
    let mrrDZD = 0;
    const planBreakdown: Record<string, number> = {
      STARTER: 0,
      PRO_KIOSK: 0,
      ENTERPRISE: 0,
    };

    shops.forEach((shop) => {
      const planId = shop.plan || "STARTER";
      planBreakdown[planId] = (planBreakdown[planId] || 0) + 1;
      const plan = this.getPlanById(planId);
      if (plan) {
        mrrDZD += plan.priceMonthlyDZD;
      }
    });

    const totalSubscribers = shops.filter((s) => s.plan && s.plan !== "STARTER").length;
    const totalPointsGranted = shops.reduce((sum, s) => sum + (s.points || 0), 0);

    return {
      mrrDZD,
      totalSubscribers,
      planBreakdown,
      totalPointsGranted,
    };
  }
}

export const subscriptionService = new SubscriptionService();
