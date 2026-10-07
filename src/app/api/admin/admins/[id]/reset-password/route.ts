import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { userRepository } from "@/server/repositories/userRepository";
import { adminAuditLogRepository } from "@/server/repositories/adminAuditLogRepository";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const admin = userRepository.findById(id);

    if (!admin || admin.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "المشرف غير موجود" },
        { status: 404 }
      );
    }

    const body = await req.json().catch(() => ({}));
    let newPassword = body.newPassword;

    // Auto-generate strong secure temporary password if not provided
    if (!newPassword || newPassword.length < 6) {
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
      newPassword = Array.from({ length: 10 }, () => chars[crypto.randomInt(chars.length)]).join("");
    }

    const updated = userRepository.update(id, {
      password: newPassword,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "فشل إعادة تعيين كلمة المرور" },
        { status: 500 }
      );
    }

    // Audit Logging
    adminAuditLogRepository.log({
      actorId: "user_super_admin",
      actorName: "مدير منصة سهلة المركزي",
      actorRole: "SUPER_ADMIN",
      action: "RESET_PASSWORD",
      targetId: id,
      targetType: "ADMIN",
      descriptionAr: `إعادة تعيين كلمة مرور المشرف: ${admin.name} (${admin.email || ""})`,
    });

    return NextResponse.json({
      success: true,
      message: "تم إعادة تعيين كلمة المرور بنجاح 🔑",
      generatedPassword: newPassword,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "فشل إعادة تعيين كلمة المرور" },
      { status: 500 }
    );
  }
}
