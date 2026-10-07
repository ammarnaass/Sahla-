"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Crown,
  Store,
  CreditCard,
  Brain,
  ShieldAlert,
  MapPin,
  Check,
  Key,
  Mail,
  User,
  Phone,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import {
  ADMIN_ROLES_META,
  ADMIN_PERMISSIONS,
  type AdminRoleType,
} from "@/server/config/constants";

interface AdminMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    name: string;
    email: string;
    phone?: string;
    password?: string;
    adminRole: AdminRoleType;
    customPermissions: string[];
    assignedWilayas?: number[];
  }) => Promise<void>;
  editAdmin?: any | null;
  isSaving: boolean;
}

const ROLE_ICONS: Record<AdminRoleType, React.ComponentType<{ size?: number; className?: string }>> = {
  SUPER_ADMIN: Crown,
  OPERATIONS_ADMIN: Store,
  FINANCE_ADMIN: CreditCard,
  AI_OPS_ADMIN: Brain,
  SECURITY_AUDITOR: ShieldAlert,
  REGIONAL_SUPERVISOR: MapPin,
};

const PERMISSION_LABELS: Record<string, string> = {
  "analytics:view": "استعراض رادار الـ 58 ولاية والمؤشرات",
  "analytics:deep_metrics": "الاطلاع على الأرباح والـ MRR/ARR",
  "shops:manage": "تفعيل وتجميد وتعديل الأكشاك",
  "shops:topup_points": "شحن النقاط الميدانية للمحلات",
  "invoices:manage": "إصدار وإدارة فواتير B2B الرسمية",
  "wholesale:manage": "توليد كروت الشحن بالجملة للموزعين",
  "ai:manage_providers": "فحص وضبط مزودي الـ AI والمفاتيح",
  "ai:manage_content": "إدارة بنك الامتحانات واستوديو البحوث",
  "admins:manage": "إضافة وتعديل وحذف المشرفين",
  "admins:reset_password": "إعادة تعيين كلمات مرور المشرفين",
  "audit:view_logs": "مراجعة سجلات التدقيق الأمني",
  "broadcast:send": "إرسال البث والتعميم الوطني العاجل",
};

export function AdminMemberModal({
  isOpen,
  onClose,
  onSave,
  editAdmin,
  isSaving,
}: AdminMemberModalProps) {
  const isEditing = !!editAdmin;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<AdminRoleType>("OPERATIONS_ADMIN");
  const [customPermissions, setCustomPermissions] = useState<string[]>([]);
  const [showCustomPerms, setShowCustomPerms] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (editAdmin) {
      setName(editAdmin.name || "");
      setEmail(editAdmin.email || "");
      setPhone(editAdmin.phone || "");
      setPassword("");
      const r = (editAdmin.adminRole as AdminRoleType) || "OPERATIONS_ADMIN";
      setSelectedRole(r);
      const perms = editAdmin.customPermissions?.length
        ? editAdmin.customPermissions
        : ADMIN_ROLES_META[r]?.defaultPermissions || [];
      setCustomPermissions(perms);
    } else {
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setSelectedRole("OPERATIONS_ADMIN");
      setCustomPermissions(ADMIN_ROLES_META.OPERATIONS_ADMIN.defaultPermissions);
      setShowCustomPerms(false);
    }
    setErrorMsg("");
  }, [editAdmin, isOpen]);

  if (!isOpen) return null;

  const handleRoleSelect = (roleKey: AdminRoleType) => {
    setSelectedRole(roleKey);
    setCustomPermissions(ADMIN_ROLES_META[roleKey]?.defaultPermissions || []);
  };

  const togglePermission = (perm: string) => {
    setCustomPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim()) {
      setErrorMsg("يرجى إدخال اسم المشرف الكامل");
      return;
    }
    if (!email.trim()) {
      setErrorMsg("يرجى إدخال البريد الإلكتروني الرسمي");
      return;
    }
    if (!isEditing && (!password || password.length < 6)) {
      setErrorMsg("كلمة المرور يجب أن لا تقل عن 6 خانات");
      return;
    }

    try {
      await onSave({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || undefined,
        password: password ? password : undefined,
        adminRole: selectedRole,
        customPermissions,
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "فشل حفظ بيانات المشرف");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-2xl max-h-[90vh] bg-card border border-border rounded-2xl shadow-2xl overflow-y-auto p-6 text-right font-sans"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 className="text-base font-black font-cairo text-foreground">
                {isEditing ? "تعديل بيانات المشرف والرتبة" : "إضافة مشرف جديد لطاقم القيادة"}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                تعيين الصلاحيات الحبيبية وتحديد نطاق المسؤوليات في المنظومة الوطنية
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 pt-4">
          {/* Basic Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5 font-cairo">
                الاسم واللقب: *
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="محمد بلقاسم"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full py-2.5 pr-9 pl-3 rounded-xl bg-muted/40 border border-border focus:outline-none focus:border-amber-500 text-xs text-foreground"
                />
                <User size={16} className="absolute right-3 top-3 text-muted-foreground" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5 font-cairo">
                البريد الإلكتروني: *
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="admin.ops@sahla.dz"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isEditing}
                  required
                  dir="ltr"
                  className="w-full py-2.5 pr-9 pl-3 rounded-xl bg-muted/40 border border-border focus:outline-none focus:border-amber-500 text-xs text-foreground disabled:opacity-60"
                />
                <Mail size={16} className="absolute right-3 top-3 text-muted-foreground" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5 font-cairo">
                رقم الهاتف (الجزائر):
              </label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="0550-12-34-56"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  dir="ltr"
                  className="w-full py-2.5 pr-9 pl-3 rounded-xl bg-muted/40 border border-border focus:outline-none focus:border-amber-500 text-xs text-foreground"
                />
                <Phone size={16} className="absolute right-3 top-3 text-muted-foreground" />
              </div>
            </div>

            {!isEditing && (
              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5 font-cairo">
                  كلمة المرور الابتدائية: *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required={!isEditing}
                    dir="ltr"
                    className="w-full py-2.5 pr-9 pl-3 rounded-xl bg-muted/40 border border-border focus:outline-none focus:border-amber-500 text-xs text-foreground"
                  />
                  <Key size={16} className="absolute right-3 top-3 text-muted-foreground" />
                </div>
              </div>
            )}
          </div>

          {/* Role Selection Cards */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-2 font-cairo">
              اختيار الدور القيادي (Admin Role):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(Object.keys(ADMIN_ROLES_META) as AdminRoleType[]).map((rKey) => {
                const meta = ADMIN_ROLES_META[rKey];
                const IconComp = ROLE_ICONS[rKey] || ShieldAlert;
                const isSelected = selectedRole === rKey;
                const isRootDisabled = isEditing && editAdmin?.isRoot && rKey !== "SUPER_ADMIN";

                return (
                  <button
                    key={rKey}
                    type="button"
                    disabled={isRootDisabled}
                    onClick={() => handleRoleSelect(rKey)}
                    className={`p-3 rounded-xl border text-right transition-all flex items-start gap-3 cursor-pointer select-none ${
                      isSelected
                        ? "bg-amber-500/10 border-amber-500 ring-1 ring-amber-500 shadow-sm"
                        : "bg-card hover:bg-muted/50 border-border"
                    } ${isRootDisabled ? "opacity-40 cursor-not-allowed" : ""}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected
                          ? "bg-amber-500 text-slate-950 font-bold"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <IconComp size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-xs text-foreground">{meta.titleAr}</span>
                        {isSelected && <Check size={14} className="text-amber-500 shrink-0" />}
                      </div>
                      <p className="text-[10px] text-muted-foreground line-clamp-2 mt-0.5 leading-snug">
                        {meta.descriptionAr}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Permissions Accordion */}
          <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sparkles size={15} className="text-amber-500" />
                <span className="text-xs font-bold text-foreground">
                  مصفوفة الصلاحيات الحبيبية ({customPermissions.length} مفعلة)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowCustomPerms(!showCustomPerms)}
                className="text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
              >
                {showCustomPerms ? "إخفاء التفاصيل ▲" : "تخصيص الصلاحيات ▼"}
              </button>
            </div>

            {showCustomPerms && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-border/70">
                {Object.values(ADMIN_PERMISSIONS).map((perm) => {
                  const isChecked = customPermissions.includes(perm);
                  return (
                    <label
                      key={perm}
                      className="flex items-center gap-2 p-2 rounded-lg bg-card/60 hover:bg-card border border-border/60 text-[11px] cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => togglePermission(perm)}
                        className="rounded border-border text-amber-500 focus:ring-amber-500"
                      />
                      <span className="text-foreground leading-tight">
                        {PERMISSION_LABELS[perm] || perm}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSaving}
              className="rounded-xl text-xs"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-slate-950 font-cairo cursor-pointer"
            >
              {isSaving ? "جاري الحفظ..." : isEditing ? "حفظ التعديلات ✓" : "إضافة المشرف للمنظومة ✓"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
