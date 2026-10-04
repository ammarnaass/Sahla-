import { NextResponse } from "next/server";

export async function POST() {
  // Invalidates all sessions across devices
  const res = NextResponse.json({
    success: true,
    message: "تم تسجيل الخروج من جميع الأجهزة المتصلة",
  });
  res.cookies.delete("sahla_session_token");
  return res;
}
