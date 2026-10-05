import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/server/services/authService";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const cookieToken = req.cookies.get("sahla_session_token")?.value;
    if (cookieToken) {
      authService.logout(cookieToken);
    }
    const res = NextResponse.json({ success: true, message: "تم تسجيل الخروج بنجاح" });
    res.cookies.delete("sahla_session_token");
    return res;
  } catch {
    const res = NextResponse.json({ success: true });
    res.cookies.delete("sahla_session_token");
    return res;
  }
}
