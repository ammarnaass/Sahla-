import { NextRequest, NextResponse } from "next/server";
import { printBridgeService } from "@/server/services/printBridgeService";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = printBridgeService.dispatchPrintJob(body);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "فشل إرسال مهمة الطباعة" },
      { status: 400 }
    );
  }
}
