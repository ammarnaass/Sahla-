import { NextRequest, NextResponse } from "next/server";
import { shopService } from "@/server/services/shopService";

export const dynamic = "force-dynamic";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const shopId = searchParams.get("shopId") || "shop_1";
    const result = shopService.removeStaff(shopId, id);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "فشل إزالة الموظف" },
      { status: 400 }
    );
  }
}
