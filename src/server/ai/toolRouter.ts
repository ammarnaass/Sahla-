/**
 * 🔧 AI Admin Engine — Tool Router (منفذ الأوامر الإدارية)
 * Provides Function Calling definitions and execution for Gemini.
 * Write operations require explicit confirmation.
 */

import { adminService } from "@/server/services/adminService";
import { shopRepository } from "@/server/repositories/shopRepository";
import { documentRepository } from "@/server/repositories/documentRepository";
import { Type } from "@google/genai";
import { ContextBuilder } from "./contextBuilder";
import type { AdminAITool, ToolDefinition, ToolExecutionResult } from "./types";

/** Tool definitions for Gemini Function Calling */
export const AI_TOOL_DEFINITIONS: ToolDefinition[] = [
  {
    name: "get_national_overview",
    description: "جلب المؤشرات الوطنية الشاملة لمنصة سهلة: عدد المحلات، النقاط، الوثائق، الإيرادات، MRR، ARR",
    parameters: {},
    is_write_operation: false,
  },
  {
    name: "get_shop_details",
    description: "جلب تفاصيل محل معين بالمعرف أو البحث بالاسم",
    parameters: {
      shop_id: { type: "string", description: "معرف المحل (مثل shop_1)", required: false },
      shop_name: { type: "string", description: "اسم المحل للبحث", required: false },
    },
    is_write_operation: false,
  },
  {
    name: "get_wilaya_stats",
    description: "جلب إحصائيات ولاية محددة بالرمز (1-58)",
    parameters: {
      wilaya_code: { type: "number", description: "رمز الولاية (1-58)", required: true },
    },
    is_write_operation: false,
  },
  {
    name: "search_shops",
    description: "البحث في المحلات بالاسم أو الولاية أو النشاط",
    parameters: {
      query: { type: "string", description: "كلمة البحث", required: true },
      filter_status: { type: "string", description: "تصفية بالحالة", required: false, enum: ["ACTIVE", "INACTIVE", "ALL"] },
    },
    is_write_operation: false,
  },
  {
    name: "topup_shop",
    description: "شحن نقاط لمحل معين — يتطلب تأكيد المدير",
    parameters: {
      shop_id: { type: "string", description: "معرف المحل", required: true },
      points: { type: "number", description: "عدد النقاط للشحن", required: true },
    },
    is_write_operation: true,
  },
  {
    name: "toggle_shop_status",
    description: "تغيير حالة محل (تنشيط/تعطيل) — يتطلب تأكيد المدير",
    parameters: {
      shop_id: { type: "string", description: "معرف المحل", required: true },
    },
    is_write_operation: true,
  },
  {
    name: "get_revenue_trends",
    description: "جلب اتجاهات الإيرادات وتوزيع الخطط",
    parameters: {},
    is_write_operation: false,
  },
  {
    name: "get_document_stats",
    description: "جلب إحصائيات الوثائق المنتجة",
    parameters: {},
    is_write_operation: false,
  },
];

/**
 * Convert tool definitions to Gemini Function Declarations format.
 */
export function getGeminiFunctionDeclarations() {
  return AI_TOOL_DEFINITIONS.map((tool) => {
    const properties: Record<string, any> = {};
    const required: string[] = [];

    Object.entries(tool.parameters).forEach(([key, param]) => {
      const prop: any = {
        type: param.type === "number" ? Type.NUMBER : Type.STRING,
        description: param.description,
      };
      if (param.enum) {
        prop.enum = param.enum;
      }
      properties[key] = prop;
      if (param.required) {
        required.push(key);
      }
    });

    return {
      name: tool.name,
      description: tool.description,
      parameters:
        Object.keys(properties).length > 0
          ? {
              type: Type.OBJECT,
              properties,
              required: required.length > 0 ? required : undefined,
            }
          : undefined,
    };
  });
}

/**
 * Execute a tool call and return the result.
 * Write operations are only executed if confirmed=true.
 */
export function executeTool(
  toolName: AdminAITool,
  params: Record<string, any>,
  confirmed: boolean = false
): ToolExecutionResult {
  try {
    switch (toolName) {
      case "get_national_overview": {
        const ctx = ContextBuilder.buildFullContext();
        return {
          tool: toolName,
          success: true,
          data: ctx,
          summary_ar: `المؤشرات الوطنية: ${ctx.totalShops} محل (${ctx.activeShops} نشط) | MRR: ${ctx.mrrDZD.toLocaleString()} د.ج | ${ctx.totalDocs.toLocaleString()} وثيقة`,
        };
      }

      case "get_shop_details": {
        let shop = null;
        if (params.shop_id) {
          shop = shopRepository.findById(params.shop_id);
        } else if (params.shop_name) {
          const all = shopRepository.getAll();
          shop = all.find((s) =>
            s.name.includes(params.shop_name) || params.shop_name.includes(s.name)
          ) || null;
        }

        if (!shop) {
          return {
            tool: toolName,
            success: false,
            data: null,
            summary_ar: "لم يُعثر على المحل المطلوب",
          };
        }

        const shopCtx = ContextBuilder.buildShopContext(shop.id);
        return {
          tool: toolName,
          success: true,
          data: shopCtx,
          summary_ar: shopCtx?.summary_ar || `محل: ${shop.name}`,
        };
      }

      case "get_wilaya_stats": {
        const code = Number(params.wilaya_code);
        if (!code || code < 1 || code > 58) {
          return {
            tool: toolName,
            success: false,
            data: null,
            summary_ar: "رمز الولاية غير صالح (يجب أن يكون بين 1 و58)",
          };
        }
        const wilayaCtx = ContextBuilder.buildWilayaContext(code);
        return {
          tool: toolName,
          success: true,
          data: wilayaCtx,
          summary_ar: wilayaCtx.summary_ar,
        };
      }

      case "search_shops": {
        const query = (params.query || "").toLowerCase();
        const statusFilter = params.filter_status || "ALL";
        let shops = shopRepository.getAll();

        if (statusFilter !== "ALL") {
          shops = shops.filter((s) => s.status === statusFilter);
        }

        const results = shops.filter(
          (s) =>
            s.name.toLowerCase().includes(query) ||
            (s.wilaya || "").toLowerCase().includes(query) ||
            (s.activity || "").toLowerCase().includes(query) ||
            (s.owner || "").toLowerCase().includes(query)
        );

        return {
          tool: toolName,
          success: true,
          data: results.map((s) => ({
            id: s.id,
            name: s.name,
            wilaya: s.wilaya,
            status: s.status,
            points: s.points,
            plan: s.plan,
          })),
          summary_ar: `نتائج البحث عن "${params.query}": ${results.length} محل`,
        };
      }

      case "topup_shop": {
        if (!confirmed) {
          const shop = shopRepository.findById(params.shop_id);
          return {
            tool: toolName,
            success: false,
            data: {
              requires_confirmation: true,
              shop_id: params.shop_id,
              shop_name: shop?.name || "غير معروف",
              points: params.points,
            },
            summary_ar: `⚠️ تأكيد مطلوب: شحن ${params.points} نقطة لمحل "${shop?.name || params.shop_id}"`,
          };
        }

        const result = adminService.topupShop(params.shop_id, params.points);
        return {
          tool: toolName,
          success: result.success,
          data: result,
          summary_ar: `✅ تم شحن ${params.points} نقطة لمحل "${result.shop.name}" بنجاح. الرصيد الجديد: ${result.shop.points} نقطة`,
        };
      }

      case "toggle_shop_status": {
        if (!confirmed) {
          const shop = shopRepository.findById(params.shop_id);
          const currentStatus = shop?.status === "ACTIVE" ? "نشط" : "متوقف";
          const newStatus = shop?.status === "ACTIVE" ? "تعطيل" : "تنشيط";
          return {
            tool: toolName,
            success: false,
            data: {
              requires_confirmation: true,
              shop_id: params.shop_id,
              shop_name: shop?.name || "غير معروف",
              current_status: currentStatus,
              action: newStatus,
            },
            summary_ar: `⚠️ تأكيد مطلوب: ${newStatus} محل "${shop?.name || params.shop_id}" (حالياً: ${currentStatus})`,
          };
        }

        const result = adminService.toggleShopStatus(params.shop_id);
        const newStatus = result.shop.status === "ACTIVE" ? "نشط" : "متوقف";
        return {
          tool: toolName,
          success: result.success,
          data: result,
          summary_ar: `✅ تم تغيير حالة محل "${result.shop.name}" إلى: ${newStatus}`,
        };
      }

      case "get_revenue_trends": {
        const analytics = adminService.getDeepAnalytics();
        return {
          tool: toolName,
          success: true,
          data: {
            planBreakdown: analytics.analytics.planBreakdown,
            stats: analytics.analytics.stats,
          },
          summary_ar: `تحليل الإيرادات: MRR ${analytics.analytics.stats.mrrDZD.toLocaleString()} د.ج | ${analytics.analytics.planBreakdown.length} خطط`,
        };
      }

      case "get_document_stats": {
        const totalDocs = documentRepository.totalCount();
        return {
          tool: toolName,
          success: true,
          data: { totalDocuments: totalDocs, estimatedRevenueDZD: totalDocs * 250 },
          summary_ar: `إحصائيات الوثائق: ${totalDocs.toLocaleString()} وثيقة | إيرادات تقديرية: ${(totalDocs * 250).toLocaleString()} د.ج`,
        };
      }

      default:
        return {
          tool: toolName,
          success: false,
          data: null,
          summary_ar: `الأداة "${toolName}" غير معروفة`,
        };
    }
  } catch (err: any) {
    return {
      tool: toolName,
      success: false,
      data: null,
      summary_ar: `خطأ في تنفيذ "${toolName}": ${err?.message || "خطأ غير معروف"}`,
    };
  }
}
