"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Shield,
  Plus,
  Crown,
  Store,
  CreditCard,
  Brain,
  ShieldAlert,
  MapPin,
  Search,
  Filter,
  MoreVertical,
  Key,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
  History,
  Users,
  UserCheck,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminMemberModal } from "../modals/AdminMemberModal";
import { AdminPasswordResetModal } from "../modals/AdminPasswordResetModal";
import {
  ADMIN_ROLES_META,
  type AdminRoleType,
} from "@/server/config/constants";

interface AdminTeamTabProps {
  adminsList?: any[];
  onCreateAdmin?: (data: any) => Promise<void> | void;
  isCreating?: boolean;
}

const ROLE_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  SUPER_ADMIN: Crown,
  OPERATIONS_ADMIN: Store,
  FINANCE_ADMIN: CreditCard,
  AI_OPS_ADMIN: Brain,
  SECURITY_AUDITOR: ShieldAlert,
  REGIONAL_SUPERVISOR: MapPin,
};

export function AdminTeamTab({
  adminsList: initialAdmins = [],
  onCreateAdmin,
  isCreating: externalIsCreating = false,
}: AdminTeamTabProps) {
  // Local state
  const [admins, setAdmins] = useState<any[]>(initialAdmins);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<"team" | "audit">("team");

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>("ALL");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("ALL");

  // Modals state
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<any | null>(null);
  const [isSavingMember, setIsSavingMember] = useState(false);

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [targetResetAdmin, setTargetResetAdmin] = useState<any | null>(null);

  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Fetch latest admins and audit logs
  const fetchAdmins = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/admins");
      const data = await res.json();
      if (data.success && data.admins) {
        setAdmins(data.admins);
      }
    } catch {
      // fallback to initial
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const res = await fetch("/api/admin/audit-logs");
      const data = await res.json();
      if (data.success && data.logs) {
        setAuditLogs(data.logs);
      }
    } catch {
      // silent
    }
  };

  useEffect(() => {
    fetchAdmins();
    fetchAuditLogs();
  }, []);

  useEffect(() => {
    if (initialAdmins && initialAdmins.length > 0 && admins.length === 0) {
      setAdmins(initialAdmins);
    }
  }, [initialAdmins]);

  // KPIs
  const stats = useMemo(() => {
    return {
      total: admins.length,
      active: admins.filter((a) => a.status === "ACTIVE").length,
      suspended: admins.filter((a) => a.status === "SUSPENDED").length,
      superAdmins: admins.filter((a) => a.adminRole === "SUPER_ADMIN" || a.isRoot).length,
    };
  }, [admins]);

  // Filtered Admins
  const filteredAdmins = useMemo(() => {
    return admins.filter((adm) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        adm.name?.toLowerCase().includes(q) ||
        adm.email?.toLowerCase().includes(q) ||
        adm.phone?.includes(q);

      const r = adm.adminRole || (adm.isRoot ? "SUPER_ADMIN" : "OPERATIONS_ADMIN");
      const matchesRole = selectedRoleFilter === "ALL" || r === selectedRoleFilter;

      const s = adm.status || "ACTIVE";
      const matchesStatus = selectedStatusFilter === "ALL" || s === selectedStatusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [admins, searchQuery, selectedRoleFilter, selectedStatusFilter]);

  // Actions
  const handleSaveMember = async (formData: any) => {
    setIsSavingMember(true);
    try {
      if (editingAdmin) {
        // PATCH
        const res = await fetch(`/api/admin/admins/${editingAdmin.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.error || "فشل التحديث");

        setActionNotice(`✓ تم تحديث بيانات المشرف (${formData.name}) بنجاح`);
      } else {
        // POST
        const res = await fetch("/api/admin/admins", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.error || "فشل إنشاء المشرف");

        setActionNotice(`✓ تم إضافة المشرف الجديد (${formData.name}) بنجاح للمنظومة`);
      }

      await fetchAdmins();
      await fetchAuditLogs();
      setIsMemberModalOpen(false);
      setEditingAdmin(null);
    } finally {
      setIsSavingMember(false);
    }
  };

  const handleToggleSuspend = async (admin: any) => {
    if (admin.isRoot) {
      alert("محظور: لا يمكن تجميد الحساب السيادي الرئيسي للمنظومة 👑");
      return;
    }

    const nextStatus = admin.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    const confirmMsg =
      nextStatus === "SUSPENDED"
        ? `هل أنت متأكد من تجميد حساب المشرف (${admin.name})؟ لن يتمكن من الدخول للمنظومة.`
        : `هل تريد إعادة تفعيل حساب المشرف (${admin.name})؟`;

    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await fetch(`/api/admin/admins/${admin.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setActionNotice(
          `✓ تم ${nextStatus === "ACTIVE" ? "تفعيل" : "تجميد"} حساب المشرف (${admin.name})`
        );
        fetchAdmins();
        fetchAuditLogs();
      } else {
        alert(json.error || "فشل تغيير حالة المشرف");
      }
    } catch {
      alert("حدث خطأ في الاتصال بالخادم");
    }
  };

  const handleDeleteAdmin = async (admin: any) => {
    if (admin.isRoot) {
      alert("محظور: لا يمكن حذف الحساب السيادي الرئيسي للمنظومة 👑");
      return;
    }

    if (!window.confirm(`هل أنت متأكد من حذف المشرف (${admin.name}) نهائياً؟ هذا الإجراء لا يمكن التراجع عنه.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/admins/${admin.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        setActionNotice(`✓ تم حذف حساب المشرف (${admin.name}) نهائياً`);
        fetchAdmins();
        fetchAuditLogs();
      } else {
        alert(json.error || "فشل حذف المشرف");
      }
    } catch {
      alert("حدث خطأ في الاتصال بالخادم");
    }
  };

  const handleConfirmResetPassword = async (newPassword?: string): Promise<string> => {
    if (!targetResetAdmin) throw new Error("لا يوجد مشرف محدد");

    const res = await fetch(`/api/admin/admins/${targetResetAdmin.id}/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newPassword }),
    });
    const json = await res.json();
    if (!json.success) {
      throw new Error(json.error || "فشل إعادة تعيين كلمة المرور");
    }

    fetchAuditLogs();
    return json.generatedPassword || newPassword || "••••••••";
  };

  return (
    <div className="space-y-6 text-right animate-fadeIn" dir="rtl">
      {/* Notice Alert */}
      {actionNotice && (
        <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-between">
          <span>{actionNotice}</span>
          <button
            type="button"
            onClick={() => setActionNotice(null)}
            className="text-xs hover:underline cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* 1. Header & KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-card border border-border shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">إجمالي الطاقم</span>
            <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
              <Users size={16} />
            </div>
          </div>
          <div className="text-2xl font-black text-foreground font-mono mt-2">{stats.total}</div>
          <span className="text-[10px] text-muted-foreground mt-0.5 block">مشرف مسجل بالمنظومة</span>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">المشرفون النشطون</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-600">
              <UserCheck size={16} />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-2">
            {stats.active}
          </div>
          <span className="text-[10px] text-muted-foreground mt-0.5 block">صلاحيات كاملة مفعلة</span>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-amber-600 dark:text-amber-400 font-bold">المدراء السياديون</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-600">
              <Crown size={16} />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono mt-2">
            {stats.superAdmins}
          </div>
          <span className="text-[10px] text-muted-foreground mt-0.5 block">إدارة مركزية كاملة</span>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-red-600 dark:text-red-400 font-bold">الحسابات الموقوفة</span>
            <div className="w-8 h-8 rounded-xl bg-red-500/15 flex items-center justify-center text-red-600">
              <Lock size={16} />
            </div>
          </div>
          <div className="text-2xl font-black text-red-600 dark:text-red-400 font-mono mt-2">
            {stats.suspended}
          </div>
          <span className="text-[10px] text-muted-foreground mt-0.5 block">تم تجميد الدخول</span>
        </div>
      </div>

      {/* 2. Sub-Tabs & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-card border border-border">
        {/* Sub Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/50 border border-border/60">
          <button
            type="button"
            onClick={() => setActiveSubTab("team")}
            className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === "team"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ShieldCheck size={15} />
            <span>طاقم الإدارة والصلاحيات</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-muted">
              {admins.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab("audit")}
            className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === "audit"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <History size={15} />
            <span>سجل التدقيق الأمني (Audit Logs)</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-muted">
              {auditLogs.length}
            </span>
          </button>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => {
              setEditingAdmin(null);
              setIsMemberModalOpen(true);
            }}
            className="rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-slate-950 font-cairo flex items-center gap-1.5 shadow-sm"
          >
            <Plus size={16} />
            <span>إضافة مشرف جديد</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              fetchAdmins();
              fetchAuditLogs();
            }}
            className="rounded-xl text-xs font-bold h-9 px-2.5"
            title="تحديث البيانات"
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          </Button>
        </div>
      </div>

      {/* 3. Team Management View */}
      {activeSubTab === "team" ? (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="البحث بالاسم، البريد أو الهاتف..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 pr-9 pl-3 rounded-xl bg-card border border-border focus:outline-none focus:border-amber-500 text-xs text-foreground"
              />
              <Search size={15} className="absolute right-3 top-2.5 text-muted-foreground" />
            </div>

            {/* Role Filter */}
            <div className="relative">
              <select
                value={selectedRoleFilter}
                onChange={(e) => setSelectedRoleFilter(e.target.value)}
                className="w-full py-2 px-3 rounded-xl bg-card border border-border focus:outline-none focus:border-amber-500 text-xs text-foreground cursor-pointer"
              >
                <option value="ALL">جميع الأدوار القيادية</option>
                {Object.keys(ADMIN_ROLES_META).map((rKey) => (
                  <option key={rKey} value={rKey}>
                    {ADMIN_ROLES_META[rKey as AdminRoleType]?.titleAr || rKey}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="w-full py-2 px-3 rounded-xl bg-card border border-border focus:outline-none focus:border-amber-500 text-xs text-foreground cursor-pointer"
              >
                <option value="ALL">جميع الحالات</option>
                <option value="ACTIVE">نشط ومصرح 🟢</option>
                <option value="SUSPENDED">موقوف ومجمد 🔴</option>
              </select>
            </div>
          </div>

          {/* Table / Cards Container */}
          <div className="rounded-2xl bg-card border border-border shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-muted/40 border-b border-border text-muted-foreground font-bold font-cairo">
                    <th className="py-3 px-4">المشرف والمعلومات</th>
                    <th className="py-3 px-4">الدور والرتبة القيادية</th>
                    <th className="py-3 px-4">الصلاحيات</th>
                    <th className="py-3 px-4">الحالة</th>
                    <th className="py-3 px-4 text-left">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredAdmins.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-muted-foreground">
                        لا يوجد مشرفون يطابقون خيارات البحث والفلترة.
                      </td>
                    </tr>
                  ) : (
                    filteredAdmins.map((adm) => {
                      const rKey = adm.adminRole || (adm.isRoot ? "SUPER_ADMIN" : "OPERATIONS_ADMIN");
                      const roleMeta = ADMIN_ROLES_META[rKey as AdminRoleType];
                      const IconComp = ROLE_ICONS[rKey] || Shield;
                      const isSuper = rKey === "SUPER_ADMIN" || adm.isRoot;
                      const isActive = adm.status !== "SUSPENDED";

                      return (
                        <tr key={adm.id} className="hover:bg-muted/30 transition-colors">
                          {/* Member info */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                                  isSuper
                                    ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                                    : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                                }`}
                              >
                                <IconComp size={16} />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-foreground truncate">{adm.name}</span>
                                  {adm.isRoot && (
                                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold border border-amber-500/40">
                                      جذري 👑
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-muted-foreground font-mono truncate" dir="ltr">
                                  {adm.email}
                                </div>
                                {adm.phone && (
                                  <div className="text-[10.5px] text-muted-foreground/80 font-mono" dir="ltr">
                                    {adm.phone}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Role */}
                          <td className="py-3.5 px-4">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border bg-muted/60 border-border">
                              <IconComp size={13} className="text-amber-500" />
                              <span>{roleMeta?.titleAr || rKey}</span>
                            </div>
                          </td>

                          {/* Permissions */}
                          <td className="py-3.5 px-4">
                            <div className="text-muted-foreground">
                              {adm.isRoot || rKey === "SUPER_ADMIN" ? (
                                <span className="font-bold text-amber-600 dark:text-amber-400 text-[11px]">
                                  سيادية كاملة (12) 🔒
                                </span>
                              ) : (
                                <span className="text-[11px]">
                                  {adm.customPermissions?.length || roleMeta?.defaultPermissions?.length || 4} صلاحيات مفعلة
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                                isActive
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                  : "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  isActive ? "bg-emerald-500 animate-pulse" : "bg-red-500"
                                }`}
                              />
                              <span>{isActive ? "نشط ومصرح" : "موقوف مؤقتاً"}</span>
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-left">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Edit Button */}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setEditingAdmin(adm);
                                  setIsMemberModalOpen(true);
                                }}
                                className="h-8 px-2 text-xs rounded-lg hover:bg-muted"
                                title="تعديل الرتبة والبيانات"
                              >
                                <Edit2 size={13} />
                              </Button>

                              {/* Reset Password Button */}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setTargetResetAdmin(adm);
                                  setIsResetModalOpen(true);
                                }}
                                className="h-8 px-2 text-xs rounded-lg hover:bg-muted text-amber-600 dark:text-amber-400"
                                title="إعادة تعيين كلمة المرور"
                              >
                                <Key size={13} />
                              </Button>

                              {/* Suspend/Activate Toggle Button */}
                              {!adm.isRoot && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleToggleSuspend(adm)}
                                  className={`h-8 px-2 text-xs rounded-lg hover:bg-muted ${
                                    isActive ? "text-red-500" : "text-emerald-500"
                                  }`}
                                  title={isActive ? "تجميد الحساب" : "تفعيل الحساب"}
                                >
                                  {isActive ? <Lock size={13} /> : <Unlock size={13} />}
                                </Button>
                              )}

                              {/* Delete Button */}
                              {!adm.isRoot && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDeleteAdmin(adm)}
                                  className="h-8 px-2 text-xs rounded-lg hover:bg-red-500/10 text-red-500"
                                  title="حذف المشرف"
                                >
                                  <Trash2 size={13} />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* 4. Audit Logs View */
        <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <History size={18} className="text-amber-500" />
              <h3 className="font-bold text-sm text-foreground font-cairo">
                سجل التدقيق الأمني والعمليات الإدارية (Audit Trail)
              </h3>
            </div>
            <span className="text-xs text-muted-foreground font-mono">
              {auditLogs.length} حركة مسجلة
            </span>
          </div>

          <div className="space-y-2.5">
            {auditLogs.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                لا توجد سجلات تدقيق حالياً.
              </div>
            ) : (
              auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-muted/30 border border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                      <ShieldAlert size={14} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-foreground">
                        {log.descriptionAr}
                      </div>
                      <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
                        بواسطة: {log.actorName} ({log.actorRole})
                      </div>
                    </div>
                  </div>

                  <div className="text-[10.5px] font-mono text-muted-foreground sm:text-left">
                    {new Date(log.timestamp).toLocaleString("ar-DZ")}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      <AdminMemberModal
        isOpen={isMemberModalOpen}
        onClose={() => {
          setIsMemberModalOpen(false);
          setEditingAdmin(null);
        }}
        onSave={handleSaveMember}
        editAdmin={editingAdmin}
        isSaving={isSavingMember}
      />

      <AdminPasswordResetModal
        isOpen={isResetModalOpen}
        onClose={() => {
          setIsResetModalOpen(false);
          setTargetResetAdmin(null);
        }}
        admin={targetResetAdmin}
        onConfirmReset={handleConfirmResetPassword}
      />
    </div>
  );
}
