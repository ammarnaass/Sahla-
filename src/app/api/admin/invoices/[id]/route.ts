import { NextRequest, NextResponse } from "next/server";
import { adminService } from "@/server/services/adminService";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = adminService.getInvoiceById(id);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "فشل العثور على الفاتورة" },
      { status: 404 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (!status || !["PAID", "PENDING", "CANCELLED"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "حالة الفاتورة غير صالحة" },
        { status: 400 }
      );
    }

    const result = adminService.updateInvoiceStatus(id, status);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "فشل تحديث الفاتورة" },
      { status: 400 }
    );
  }
}
