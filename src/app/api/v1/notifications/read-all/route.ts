import { NextRequest, NextResponse } from "next/server";
import { markAllAsRead } from "@/server/notifications/dispatcher";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const shopId = body?.shopId || "shop_1";

    const result = markAllAsRead(shopId);
    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to mark all notifications as read" },
      { status: 500 }
    );
  }
}
