import { NextResponse } from "next/server";
import { EDUCATION_CONFIG } from "@/server/education/config";

export async function GET() {
  return NextResponse.json({
    currency: "points",
    rule: "سعر النقاط ≥ 3 × متوسط التكلفة الفعلية للخدمة (يُراجع دورياً)",
    pricing: {
      research_plans: {
        creation: EDUCATION_CONFIG.pricing.planCreation,
        description: "إنشاء ومراجعة خطة وعناوين البحث (مجانية)",
      },
      research_jobs: {
        by_pages: EDUCATION_CONFIG.pricing.pointsByPageCount,
        math_latex_add_on: 2,
        section_regenerate_free_limit: EDUCATION_CONFIG.pricing.freeSectionRegenerateLimit,
        section_regenerate_extra_cost: EDUCATION_CONFIG.pricing.extraSectionRegenerateCost,
      },
      exams: {
        exam_view_download: 0,
        solution_unlock: EDUCATION_CONFIG.pricing.examSolutionUnlock,
        bundle_compilation: 3,
      },
    },
    limits: {
      max_concurrent_jobs: EDUCATION_CONFIG.concurrency.maxConcurrentJobsPerShop,
      rate_limit_per_minute: EDUCATION_CONFIG.concurrency.rateLimitPerMinute,
      data_retention_hours: EDUCATION_CONFIG.privacy.studentDataRetentionHours,
    },
  });
}
