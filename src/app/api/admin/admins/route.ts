import { NextRequest, NextResponse } from "next/server";
import { userRepository } from "@/server/repositories/userRepository";
import { ROLES } from "@/server/config/constants";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const allUsers = userRepository.getAll();
    const admins = allUsers
      .filter((u) => u.role === ROLES.SUPER_ADMIN)
      .map(({ password, ...safeUser }) => safeUser);

    return NextResponse.json({ success: true, admins });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "فشل جلب مديري النظام" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, phone } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: "اسم مدير النظام مطلوب" }, { status: 400 });
    }
    if (!email || !email.trim()) {
      return NextResponse.json({ success: false, error: "البريد الإلكتروني (جيميل) مطلوب" }, { status: 400 });
    }
    if (!password || password.length < 6) {
      return NextResponse.json({ success: false, error: "كلمة المرور يجب أن لا تقل عن 6 خانات" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = userRepository.findByEmail(cleanEmail);
    if (existing) {
      return NextResponse.json(
        { success: false, error: "هذا البريد الإلكتروني مسجل بالفعل لمستخدم آخر" },
        { status: 400 }
      );
    }

    const newAdmin = userRepository.create({
      name: name.trim(),
      email: cleanEmail,
      phone: phone?.trim() || null,
      password: password,
      role: ROLES.SUPER_ADMIN,
      shopId: null,
    });

    const { password: _, ...safeAdmin } = newAdmin;
    return NextResponse.json({
      success: true,
      message: "تم إنشاء حساب مدير النظام بنجاح 🛡️",
      admin: safeAdmin,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "فشل إنشاء حساب مدير النظام" },
      { status: 500 }
    );
  }
}
