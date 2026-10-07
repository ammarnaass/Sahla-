import { NextRequest, NextResponse } from "next/server";
import { userRepository } from "@/server/repositories/userRepository";
import { adminAuditLogRepository } from "@/server/repositories/adminAuditLogRepository";
import { ROLES, ADMIN_ROLES, ADMIN_ROLES_META, ADMIN_PERMISSIONS, AdminRoleType } from "@/server/config/constants";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.toLowerCase().trim();
    const roleFilter = searchParams.get("role");
    const statusFilter = searchParams.get("status");

    const allUsers = userRepository.getAll();
    let admins = allUsers
      .filter((u) => u.role === ROLES.SUPER_ADMIN)
      .map(({ password, ...safeUser }) => ({
        ...safeUser,
        adminRole: safeUser.adminRole || (safeUser.isRoot ? "SUPER_ADMIN" : "OPERATIONS_ADMIN"),
        status: safeUser.status || "ACTIVE",
        isRoot: safeUser.isRoot ?? (safeUser.email === "admin@sahla.dz"),
        customPermissions: safeUser.customPermissions || [],
        assignedWilayas: safeUser.assignedWilayas || [],
      }));

    // Calculate Stats
    const stats = {
      total: admins.length,
      active: admins.filter((a) => a.status === "ACTIVE").length,
      suspended: admins.filter((a) => a.status === "SUSPENDED").length,
      rolesBreakdown: admins.reduce((acc, curr) => {
        const r = curr.adminRole || "SUPER_ADMIN";
        acc[r] = (acc[r] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };

    // Filter
    if (search) {
      admins = admins.filter(
        (a) =>
          a.name.toLowerCase().includes(search) ||
          (a.email && a.email.toLowerCase().includes(search)) ||
          (a.phone && a.phone.includes(search))
      );
    }

    if (roleFilter && roleFilter !== "ALL") {
      admins = admins.filter((a) => a.adminRole === roleFilter);
    }

    if (statusFilter && statusFilter !== "ALL") {
      admins = admins.filter((a) => a.status === statusFilter);
    }

    return NextResponse.json({
      success: true,
      admins,
      stats,
      rolesMeta: ADMIN_ROLES_META,
      permissions: ADMIN_PERMISSIONS,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "فشل جلب طاقم المشرفين" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, phone, adminRole, customPermissions, assignedWilayas } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: "اسم المشرف مطلوب" }, { status: 400 });
    }
    if (!email || !email.trim()) {
      return NextResponse.json({ success: false, error: "البريد الإلكتروني مطلوب" }, { status: 400 });
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

    const targetAdminRole: AdminRoleType =
      adminRole && ADMIN_ROLES[adminRole as keyof typeof ADMIN_ROLES]
        ? (adminRole as AdminRoleType)
        : "OPERATIONS_ADMIN";

    const newAdmin = userRepository.create({
      name: name.trim(),
      email: cleanEmail,
      phone: phone?.trim() || null,
      password: password,
      role: ROLES.SUPER_ADMIN,
      adminRole: targetAdminRole,
      customPermissions: Array.isArray(customPermissions) ? customPermissions : [],
      assignedWilayas: Array.isArray(assignedWilayas) ? assignedWilayas : [],
      status: "ACTIVE",
      isRoot: false,
      shopId: null,
    });

    // Audit Logging
    adminAuditLogRepository.log({
      actorId: "user_super_admin",
      actorName: "مدير منصة سهلة المركزي",
      actorRole: "SUPER_ADMIN",
      action: "CREATE_ADMIN",
      targetId: newAdmin.id,
      targetType: "ADMIN",
      descriptionAr: `إضافة مشرف جديد: ${newAdmin.name} (${newAdmin.email}) برتبة ${ADMIN_ROLES_META[targetAdminRole]?.titleAr || targetAdminRole}`,
      metadata: { role: targetAdminRole, email: cleanEmail },
    });

    const { password: _, ...safeAdmin } = newAdmin;
    return NextResponse.json({
      success: true,
      message: "تم إنشاء حساب المشرف بنجاح 🛡️",
      admin: safeAdmin,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "فشل إنشاء حساب المشرف" },
      { status: 500 }
    );
  }
}
