import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/server/services/authService";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const result = authService.loginWithEmail(email, password);

    const response = NextResponse.json(result);
    // Set secure cookie for session
    response.cookies.set("sahla_session_token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "فشل تسجيل الدخول" },
      { status: 400 }
    );
  }
}
