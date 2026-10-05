import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/server/services/authService";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const cookieToken = req.cookies.get("sahla_session_token")?.value;
    const authHeader = req.headers.get("authorization");
    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
    const token = cookieToken || bearerToken;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "لا توجد جلسة نشطة" },
        { status: 401 }
      );
    }

    const session = authService.getSession(token);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "الجلسة منتهية أو غير صالحة" },
        { status: 401 }
      );
    }

    return NextResponse.json(session);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "فشل التحقق من الجلسة" },
      { status: 500 }
    );
  }
}
