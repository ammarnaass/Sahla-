import { NextRequest, NextResponse } from "next/server";
import { shopService } from "@/server/services/shopService";

import { authService } from "@/server/services/authService";

export const dynamic = "force-dynamic";

function resolveShopId(req: NextRequest, explicitShopId?: string | null): string | null {
  if (explicitShopId && explicitShopId.trim()) return explicitShopId.trim();
  const cookieToken = req.cookies.get("sahla_session_token")?.value;
  const authHeader = req.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
  const token = cookieToken || bearerToken;
  if (token) {
    const session = authService.getSession(token);
    if (session?.shop?.id) return session.shop.id;
    if (session?.user?.shopId) return session.user.shopId;
  }
  return null;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const shopId = resolveShopId(req, searchParams.get("shopId"));
    if (!shopId) {
      return NextResponse.json(
        { success: false, error: "معرف المحل مطلوب لجلب قائمة الموظفين" },
        { status: 400 }
      );
    }
    const staff = shopService.getStaff(shopId);
    return NextResponse.json({ success: true, staff });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "فشل جلب قائمة الموظفين" },
      { status: 400 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const shopId = resolveShopId(req, body.shopId);
    if (!shopId) {
      return NextResponse.json(
        { success: false, error: "معرف المحل مطلوب لإضافة موظف" },
        { status: 400 }
      );
    }
    const { name, phone } = body;
    const staffMember = shopService.addStaff(shopId, { name, phone });
    return NextResponse.json({ success: true, staffMember });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "فشل إضافة الموظف" },
      { status: 400 }
    );
  }
}
