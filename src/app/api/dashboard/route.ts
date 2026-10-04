import { NextRequest, NextResponse } from "next/server";
import { SERVICES_CATALOG } from "@/lib/constants";

export async function GET(req: NextRequest) {
  try {
    // In full backend, fetch from Prisma db using session token.
    // For fast reliable response:
    return NextResponse.json({
      success: true,
      balancePoints: 50,
      frequentServices: SERVICES_CATALOG.slice(0, 4),
      recentDocuments: [
        {
          id: "doc_init_1",
          title: "سيرة ذاتية — نموذج احترافي عربي/فرنسي",
          type: "CV",
          customerName: "أحمد بن علي",
          createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          salePrice: 200,
        },
      ],
      dailySummary: {
        docsCount: 1,
        pointsUsed: 10,
        estimatedProfitDZD: 170, // 200 DZD sale price - 30 DZD points cost
      },
    });
  } catch (err: unknown) {
    console.error("Dashboard API error:", err);
    return NextResponse.json(
      { success: false, error: "تعذر تحميل بيانات لوحة التحكم" },
      { status: 500 }
    );
  }
}
