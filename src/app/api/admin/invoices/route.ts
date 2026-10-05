import { NextRequest, NextResponse } from "next/server";
import { adminService } from "@/server/services/adminService";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || undefined;
    const shopId = searchParams.get("shopId") || undefined;

    const result = adminService.getInvoices({ status, shopId });
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "فشل جلب الفواتير" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = adminService.createInvoice(body);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "فشل إنشاء الفاتورة" },
      { status: 400 }
    );
  }
}
