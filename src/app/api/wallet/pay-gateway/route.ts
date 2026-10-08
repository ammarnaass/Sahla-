import { NextRequest, NextResponse } from "next/server";
import { walletService } from "@/server/services/walletService";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { shopId = "shop_1791222058320", points, dzdAmount } = await req.json();
    const result = walletService.requestEPayGateway(shopId, Number(points), Number(dzdAmount));
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "فشل معالجة الدفع الإلكتروني" },
      { status: 400 }
    );
  }
}
