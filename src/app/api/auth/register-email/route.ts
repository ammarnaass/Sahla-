import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/server/services/authService";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = authService.registerWithEmail(body);

    const response = NextResponse.json(result);
    response.cookies.set("sahla_session_token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "فشل تسجيل المحل الجديد" },
      { status: 400 }
    );
  }
}
