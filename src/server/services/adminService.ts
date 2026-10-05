/**
 * 👑 خدمة الإدارة الوطنية للمنصة المركزية (Admin Service)
 * National KPI monitoring, shop status toggle, administrative topups,
 * advanced Wilaya/Financial analytics, and B2B Invoicing management
 */

import { shopRepository, ShopRecord } from "../repositories/shopRepository";
import { userRepository, UserRecord } from "../repositories/userRepository";
import { documentRepository } from "../repositories/documentRepository";
import { walletRepository } from "../repositories/walletRepository";
import { invoiceRepository, InvoiceRecord } from "../repositories/invoiceRepository";
import { SAAS_PLANS } from "../config/constants";

export interface NationalOverviewStats {
  totalShops: number;
  activeShops: number;
  totalPointsInCirculation: number;
  totalPoints: number;
  nationalDocumentsCount: number;
  totalDocs: number;
  estimatedRevenueDZD: number;
  totalRevenueDzd: number;
  activeSubscriptionsCount: number;
  mrrDZD: number;
  arrDZD: number;
  invoicesCount: number;
  paidInvoicesDZD: number;
  pendingInvoicesDZD: number;
}

export interface WilayaStatistic {
  wilayaCode: number;
  wilayaName: string;
  shopsCount: number;
  activeShopsCount: number;
  totalPoints: number;
  percentage: number;
}

export interface AnalyticsReport {
  stats: NationalOverviewStats;
  wilayasDistribution: WilayaStatistic[];
  planBreakdown: {
    planId: string;
    planNameAr: string;
    count: number;
    monthlyPriceDZD: number;
    totalRevenueDZD: number;
  }[];
  activityBreakdown: Record<string, number>;
  recentInvoices: InvoiceRecord[];
}

class AdminService {
  getNationalOverview(): {
    success: boolean;
    stats: NationalOverviewStats;
    saasMetrics: {
      mrrDZD: number;
      arrDZD: number;
      totalSubscribers: number;
      planBreakdown: Record<string, number>;
    };
    shops: ShopRecord[];
    users: UserRecord[];
  } {
    const shops = shopRepository.getAll();
    const users = userRepository.getAll();
    const activeShops = shops.filter((s) => s.status === "ACTIVE").length;
    const totalPoints = shops.reduce((sum, s) => sum + (s.points || 0), 0);
    const totalDocs = documentRepository.totalCount();
    const totalRevenueDZD = totalDocs * 250;
    const activeSubscriptionsCount = shops.filter((s) => s.plan && s.plan !== "STARTER").length;

    // Calculate MRR from subscriptions
    let mrr = 0;
    const planCounts: Record<string, number> = { STARTER: 0, PRO_KIOSK: 0, ENTERPRISE: 0 };
    shops.forEach((shop) => {
      const planId = (shop.plan as "STARTER" | "PRO_KIOSK" | "ENTERPRISE") || "STARTER";
      planCounts[planId] = (planCounts[planId] || 0) + 1;
      const planDef = SAAS_PLANS.find((p) => p.id === planId);
      if (planDef) {
        mrr += planDef.priceMonthlyDZD;
      }
    });

    const invoiceMetrics = invoiceRepository.getMetrics();

    const overviewStats: NationalOverviewStats = {
      totalShops: shops.length,
      activeShops,
      totalPointsInCirculation: totalPoints,
      totalPoints,
      nationalDocumentsCount: totalDocs,
      totalDocs,
      estimatedRevenueDZD: totalRevenueDZD,
      totalRevenueDzd: totalRevenueDZD,
      activeSubscriptionsCount,
      mrrDZD: mrr,
      arrDZD: mrr * 12,
      invoicesCount: invoiceMetrics.invoicesCount,
      paidInvoicesDZD: invoiceMetrics.paidDZD,
      pendingInvoicesDZD: invoiceMetrics.pendingDZD,
    };

    return {
      success: true,
      stats: overviewStats,
      saasMetrics: {
        mrrDZD: mrr,
        arrDZD: mrr * 12,
        totalSubscribers: activeSubscriptionsCount,
        planBreakdown: planCounts,
      },
      shops,
      users,
    };
  }

  getDeepAnalytics(): { success: boolean; analytics: AnalyticsReport } {
    const overview = this.getNationalOverview();
    const shops = overview.shops;

    // Wilayas distribution
    const wilayaMap = new Map<number, { name: string; count: number; active: number; points: number }>();
    shops.forEach((s) => {
      const code = s.wilayaCode || 16;
      const current = wilayaMap.get(code) || {
        name: s.wilaya || `${code} - ولاية جزائرية`,
        count: 0,
        active: 0,
        points: 0,
      };
      current.count += 1;
      if (s.status === "ACTIVE") current.active += 1;
      current.points += s.points || 0;
      wilayaMap.set(code, current);
    });

    const wilayasDistribution: WilayaStatistic[] = Array.from(wilayaMap.entries())
      .map(([code, data]) => ({
        wilayaCode: code,
        wilayaName: data.name,
        shopsCount: data.count,
        activeShopsCount: data.active,
        totalPoints: data.points,
        percentage: shops.length > 0 ? Math.round((data.count / shops.length) * 100) : 0,
      }))
      .sort((a, b) => b.shopsCount - a.shopsCount);

    // Activity breakdown
    const activityMap: Record<string, number> = {};
    shops.forEach((s) => {
      const act = s.activity || "KIOSK";
      activityMap[act] = (activityMap[act] || 0) + 1;
    });

    // Plan breakdown
    const planBreakdown = SAAS_PLANS.map((plan) => {
      const count = shops.filter((s) => (s.plan || "STARTER") === plan.id).length;
      return {
        planId: plan.id,
        planNameAr: plan.nameAr,
        count,
        monthlyPriceDZD: plan.priceMonthlyDZD,
        totalRevenueDZD: count * plan.priceMonthlyDZD,
      };
    });

    const recentInvoices = invoiceRepository.getAll().slice(0, 10);

    return {
      success: true,
      analytics: {
        stats: overview.stats,
        wilayasDistribution,
        planBreakdown,
        activityBreakdown: activityMap,
        recentInvoices,
      },
    };
  }

  getInvoices(filters?: { status?: string; shopId?: string }): { success: boolean; invoices: InvoiceRecord[] } {
    let list = invoiceRepository.getAll();
    if (filters?.status && filters.status !== "ALL") {
      list = list.filter((i) => i.status === filters.status);
    }
    if (filters?.shopId) {
      list = list.filter((i) => i.shopId === filters.shopId);
    }
    return { success: true, invoices: list };
  }

  getInvoiceById(id: string): { success: boolean; invoice: InvoiceRecord } {
    const inv = invoiceRepository.findById(id);
    if (!inv) throw new Error("الفاتورة غير موجودة");
    return { success: true, invoice: inv };
  }

  createInvoice(data: Partial<InvoiceRecord>): { success: boolean; invoice: InvoiceRecord } {
    if (!data.shopId && !data.shopName) throw new Error("بيانات المتجر مطلوبة لإنشاء الفاتورة");
    const invoice = invoiceRepository.create(data);
    return { success: true, invoice };
  }

  updateInvoiceStatus(id: string, status: "PAID" | "PENDING" | "CANCELLED"): { success: boolean; invoice: InvoiceRecord } {
    const updated = invoiceRepository.updateStatus(id, status);
    if (!updated) throw new Error("تعذر العثور على الفاتورة");
    return { success: true, invoice: updated };
  }

  topupShop(shopId: string, points: number = 50): { success: boolean; shop: ShopRecord } {
    if (!shopId) throw new Error("معرف المحل مطلوب");
    const pointsNum = Number(points);
    const shop = shopRepository.updatePoints(shopId, pointsNum);
    if (!shop) throw new Error("المحل غير موجود");

    walletRepository.addLedgerEntry({
      shopId,
      desc: `شحن إداري معتمد من مدير النظام (+${pointsNum} نقطة)`,
      pts: `+${pointsNum}`,
      after: shop.points,
    });

    return { success: true, shop };
  }

  toggleShopStatus(shopId: string): { success: boolean; shop: ShopRecord } {
    if (!shopId) throw new Error("معرف المحل مطلوب");
    const shop = shopRepository.toggleStatus(shopId);
    if (!shop) throw new Error("المحل غير موجود");
    return { success: true, shop };
  }
}

export const adminService = new AdminService();
