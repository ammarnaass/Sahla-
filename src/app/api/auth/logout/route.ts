import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true, message: "تم تسجيل الخروج بنجاح" });
  res.cookies.delete("sahla_session_token");
  return res;
}
