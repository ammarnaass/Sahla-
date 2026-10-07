/**
 * 🔍 AI Admin Engine — Context Builder (جامع السياق الوطني)
 * Aggregates data from all repositories to build a compressed context snapshot
 * that gets injected into every AI prompt.
 */

import { adminService } from "@/server/services/adminService";
import { shopRepository } from "@/server/repositories/shopRepository";
import { documentRepository } from "@/server/repositories/documentRepository";
import { walletRepository } from "@/server/repositories/walletRepository";
import { invoiceRepository } from "@/server/repositories/invoiceRepository";
import type { AdminContextSnapshot } from "./types";

export class ContextBuilder {
  /**
   * Build a full national context snapshot for the AI engine.
   * This is the primary data source injected into every prompt.
   */
  static buildFullContext(): AdminContextSnapshot {
    const overview = adminService.getNationalOverview();
    const analytics = adminService.getDeepAnalytics();
    const stats = overview.stats;
    const shops = overview.shops;

    // Top wilayas by shop count
    const topWilayas = analytics.analytics.wilayasDistribution
      .slice(0, 10)
      .map((w) => ({
        name: w.wilayaName,
        code: w.wilayaCode,
        count: w.shopsCount,
        active: w.activeShopsCount,
      }));

    // Plan breakdown
    const planBreakdown = analytics.analytics.planBreakdown.map((p) => ({
      planId: p.planId,
      planNameAr: p.planNameAr,
      count: p.count,
      revenueDZD: p.totalRevenueDZD,
    }));

    // Detect alerts
    const alerts: string[] = [];

    // Alert: shops with zero balance
    const zeroBalanceShops = shops.filter((s) => (s.points || 0) <= 0 && s.status === "ACTIVE");
    if (zeroBalanceShops.length > 0) {
      alerts.push(`⚠️ ${zeroBalanceShops.length} محل نشط برصيد صفر يحتاج شحن عاجل`);
    }

    // Alert: inactive shops
    const inactiveShops = shops.filter((s) => s.status !== "ACTIVE");
    if (inactiveShops.length > 0) {
      alerts.push(`🔴 ${inactiveShops.length} محل غير نشط (متوقف أو معلق)`);
    }

    // Alert: high concentration in one wilaya
    if (topWilayas.length > 0 && topWilayas[0].count > shops.length * 0.5) {
      alerts.push(`📍 تركيز عالي: أكثر من 50% من المحلات في ولاية ${topWilayas[0].name}`);
    }

    // Alert: pending invoices
    if (stats.pendingInvoicesDZD > 0) {
      alerts.push(`💳 فواتير معلقة بقيمة ${stats.pendingInvoicesDZD.toLocaleString()} د.ج`);
    }

    return {
      totalShops: stats.totalShops,
      activeShops: stats.activeShops,
      inactiveShops: stats.totalShops - stats.activeShops,
      totalPoints: stats.totalPoints,
      totalDocs: stats.totalDocs,
      mrrDZD: stats.mrrDZD,
      arrDZD: stats.arrDZD,
      activeSubscriptions: stats.activeSubscriptionsCount,
      invoicesCount: stats.invoicesCount,
      paidInvoicesDZD: stats.paidInvoicesDZD,
      pendingInvoicesDZD: stats.pendingInvoicesDZD,
      topWilayas,
      planBreakdown,
      activityBreakdown: analytics.analytics.activityBreakdown,
      recentAlerts: alerts,
      snapshot_at: new Date().toISOString(),
    };
  }

  /**
   * Build a context focused on a specific shop
   */
  static buildShopContext(shopId: string): {
    shop: any;
    walletHistory: any[];
    summary_ar: string;
  } | null {
    const shop = shopRepository.findById(shopId);
    if (!shop) return null;

    const walletHistory = walletRepository.getLedger(shopId).slice(0, 10);

    return {
      shop,
      walletHistory,
      summary_ar: `محل "${shop.name}" | الولاية: ${shop.wilaya} | الحالة: ${shop.status === "ACTIVE" ? "نشط" : "متوقف"} | الرصيد: ${shop.points} نقطة | الخطة: ${shop.plan || "STARTER"}`,
    };
  }

  /**
   * Build context for a specific wilaya
   */
  static buildWilayaContext(wilayaCode: number): {
    shops: any[];
    totalShops: number;
    activeShops: number;
    totalPoints: number;
    summary_ar: string;
  } {
    const allShops = shopRepository.getAll();
    const wilayaShops = allShops.filter((s) => s.wilayaCode === wilayaCode);
    const active = wilayaShops.filter((s) => s.status === "ACTIVE");
    const totalPts = wilayaShops.reduce((sum, s) => sum + (s.points || 0), 0);

    return {
      shops: wilayaShops,
      totalShops: wilayaShops.length,
      activeShops: active.length,
      totalPoints: totalPts,
      summary_ar: `ولاية (${wilayaCode}): ${wilayaShops.length} محل (${active.length} نشط) | إجمالي النقاط: ${totalPts}`,
    };
  }

  /**
   * Format context snapshot as a compressed text block for prompt injection
   */
  static formatContextForPrompt(ctx: AdminContextSnapshot): string {
    const lines: string[] = [
      "═══ بيانات المنصة المباشرة ═══",
      "",
      "📊 المؤشرات الوطنية:",
      `• إجمالي المحلات: ${ctx.totalShops} (${ctx.activeShops} نشط، ${ctx.inactiveShops} متوقف)`,
      `• إجمالي النقاط المتداولة: ${ctx.totalPoints.toLocaleString()} نقطة`,
      `• إجمالي الوثائق المنتجة: ${ctx.totalDocs.toLocaleString()} وثيقة`,
      `• الإيراد الشهري المتكرر (MRR): ${ctx.mrrDZD.toLocaleString()} د.ج`,
      `• الإيراد السنوي المتكرر (ARR): ${ctx.arrDZD.toLocaleString()} د.ج`,
      `• الاشتراكات النشطة: ${ctx.activeSubscriptions}`,
      `• الفواتير: ${ctx.invoicesCount} (مدفوعة: ${ctx.paidInvoicesDZD.toLocaleString()} د.ج | معلقة: ${ctx.pendingInvoicesDZD.toLocaleString()} د.ج)`,
      "",
      "🗺️ أبرز الولايات:",
      ...ctx.topWilayas.map(
        (w, i) => `  ${i + 1}. ${w.name} (${w.code}): ${w.count} محل (${w.active} نشط)`
      ),
      "",
      "📋 توزيع الخطط:",
      ...ctx.planBreakdown.map(
        (p) => `  • ${p.planNameAr}: ${p.count} محل → ${p.revenueDZD.toLocaleString()} د.ج/شهر`
      ),
      "",
      "🏢 توزيع النشاطات:",
      ...Object.entries(ctx.activityBreakdown).map(
        ([act, count]) => `  • ${act}: ${count} محل`
      ),
    ];

    if (ctx.recentAlerts.length > 0) {
      lines.push("", "🚨 تنبيهات:", ...ctx.recentAlerts.map((a) => `  ${a}`));
    }

    lines.push("", `⏱️ آخر تحديث: ${new Date(ctx.snapshot_at).toLocaleString("ar-DZ")}`);

    return lines.join("\n");
  }
}
