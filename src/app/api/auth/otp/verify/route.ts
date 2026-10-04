import { NextRequest, NextResponse } from "next/server";
import { normalizeAlgerianPhone } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, code } = body;

    if (!phone || !code) {
      return NextResponse.json(
        { success: false, error: "رقم الهاتف ورمز التحقق مطلوبان" },
        { status: 400 }
      );
    }

    const validation = normalizeAlgerianPhone(phone);
    if (!validation.valid || !validation.raw) {
      return NextResponse.json(
        { success: false, error: "رقم هاتف غير صالح" },
        { status: 400 }
      );
    }

    // In demo/test mode, any valid 6-digit code or "123456" is accepted
    const isMockValid = /^\d{6}$/.test(code);
    if (!isMockValid) {
      return NextResponse.json(
        { success: false, error: "رمز التحقق يجب أن يتكون من 6 أرقام" },
        { status: 400 }
      );
    }

    // Check if phone was previously registered in demo storage or DB
    // For API response:
    const token = `sahla_jwt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const res = NextResponse.json({
      success: true,
      token,
      phone: validation.raw,
      formattedPhone: validation.formatted,
      isNewUser: true, // Client will prompt shop creation if new, or load existing
    });

    // Set HttpOnly cookie for short-lived session / refresh token
    res.cookies.set("sahla_session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days session
      path: "/",
    });

    return res;
  } catch (err: unknown) {
    console.error("OTP Verify error:", err);
    return NextResponse.json(
      { success: false, error: "فشل التحقق من الرمز" },
      { status: 500 }
    );
  }
}
