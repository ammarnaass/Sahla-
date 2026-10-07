import { NextRequest, NextResponse } from "next/server";
import { userRepository } from "@/server/repositories/userRepository";
import { adminAuditLogRepository } from "@/server/repositories/adminAuditLogRepository";
import { ADMIN_ROLES, ADMIN_ROLES_META, AdminRoleType } from "@/server/config/constants";

export const dynamic = "force-dynamic";

export async function GET(
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

    const { password: _, ...safeAdmin } = admin;
    return NextResponse.json({ success: true, admin: safeAdmin });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "فشل جلب بيانات المشرف" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const admin = userRepository.findById(id);

    if (!admin || admin.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "المشرف غير موجود" },
        { status: 404 }
      );
    }

    const isRoot = admin.isRoot || admin.email === "admin@sahla.dz";

    // Protect Root Sovereign Admin
    if (isRoot) {
      if (body.status === "SUSPENDED") {
        return NextResponse.json(
          { success: false, error: "لا يمكن تجميد الحساب السيادي الرئيسي للمنظومة 🔒" },
          { status: 403 }
        );
      }
      if (body.adminRole && body.adminRole !== "SUPER_ADMIN") {
        return NextResponse.json(
          { success: false, error: "لا يمكن تغيير رتبة الحساب السيادي الرئيسي 👑" },
          { status: 403 }
        );
      }
    }

    const updates: Record<string, any> = {};

    if (body.name && body.name.trim()) updates.name = body.name.trim();
    if (body.phone !== undefined) updates.phone = body.phone ? body.phone.trim() : null;

    if (body.adminRole && ADMIN_ROLES[body.adminRole as keyof typeof ADMIN_ROLES]) {
      updates.adminRole = body.adminRole as AdminRoleType;
    }

    if (Array.isArray(body.customPermissions)) {
      updates.customPermissions = body.customPermissions;
    }

    if (Array.isArray(body.assignedWilayas)) {
      updates.assignedWilayas = body.assignedWilayas;
    }

    if (body.status === "ACTIVE" || body.status === "SUSPENDED") {
      updates.status = body.status;
    }

    const updated = userRepository.update(id, updates);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "تعذر تحديث بيانات المشرف" },
        { status: 500 }
      );
    }

    // Audit Log
    const changesDesc: string[] = [];
    if (updates.status) changesDesc.push(`الحالة إلى ${updates.status === "ACTIVE" ? "نشط" : "موقوف"}`);
    if (updates.adminRole) changesDesc.push(`الدور إلى ${ADMIN_ROLES_META[updates.adminRole as AdminRoleType]?.titleAr || updates.adminRole}`);

    adminAuditLogRepository.log({
      actorId: "user_super_admin",
      actorName: "مدير منصة سهلة المركزي",
      actorRole: "SUPER_ADMIN",
      action: updates.status === "SUSPENDED" ? "SUSPEND_ADMIN" : "UPDATE_ADMIN",
      targetId: updated.id,
      targetType: "ADMIN",
      descriptionAr: `تعديل بيانات المشرف ${updated.name}: ${changesDesc.join("، ") || "تحديث البيانات"}`,
      metadata: updates,
    });

    const { password: _, ...safeAdmin } = updated;
    return NextResponse.json({
      success: true,
      message: "تم تحديث بيانات المشرف بنجاح ✓",
      admin: safeAdmin,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "فشل تحديث بيانات المشرف" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Protect Root Sovereign Admin
    if (admin.isRoot || admin.email === "admin@sahla.dz" || admin.id === "user_super_admin") {
      return NextResponse.json(
        { success: false, error: "محظور تماماً: لا يمكن حذف الحساب السيادي الرئيسي للمنصة 👑" },
        { status: 403 }
      );
    }

    const deleted = userRepository.delete(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "فشل حذف حساب المشرف" },
        { status: 500 }
      );
    }

    // Audit Log
    adminAuditLogRepository.log({
      actorId: "user_super_admin",
      actorName: "مدير منصة سهلة المركزي",
      actorRole: "SUPER_ADMIN",
      action: "DELETE_ADMIN",
      targetId: id,
      targetType: "ADMIN",
      descriptionAr: `حذف حساب المشرف: ${admin.name} (${admin.email || ""})`,
      metadata: { deletedAdminId: id, name: admin.name, email: admin.email },
    });

    return NextResponse.json({
      success: true,
      message: "تم حذف حساب المشرف بنجاح 🗑️",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "فشل حذف حساب المشرف" },
      { status: 500 }
    );
  }
}
