"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useStaffState, type StaffMember } from "@/hooks/dashboard/useStaffState";
import { StaffStatsHeader } from "./StaffStatsHeader";
import { StaffShopProfileForm } from "./StaffShopProfileForm";
import { StaffMembersList } from "./StaffMembersList";
import { StaffAddModal } from "./StaffAddModal";

export type { StaffMember };

export function StaffAccountTab() {
  const { session, refreshSession } = useAuth();
  const shopId = session?.shop?.id || session?.user?.shopId || "";
  const initialShopName = session?.shop?.name || "";
  const initialOwnerName =
    session?.shop?.ownerName || session?.shop?.owner || session?.user?.name || "";

  const staff = useStaffState(
    initialShopName,
    initialOwnerName,
    shopId,
    async () => {
      await refreshSession();
    }
  );

  return (
    <div className="space-y-8 text-right animate-in fade-in duration-200">
      <StaffStatsHeader staffCount={staff.staffList.length} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <StaffShopProfileForm
          shopName={staff.shopName}
          setShopName={staff.setShopName}
          ownerName={staff.ownerName}
          setOwnerName={staff.setOwnerName}
          wilayaCode={staff.wilayaCode}
          setWilayaCode={staff.setWilayaCode}
          commune={staff.commune}
          setCommune={staff.setCommune}
          activityType={staff.activityType}
          setActivityType={staff.setActivityType}
          saveSuccess={staff.saveSuccess}
          onSave={staff.saveShopProfile}
          isSaving={staff.isSavingProfile}
          error={staff.profileError}
        />

        {/* Security / RBAC Summary Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between space-y-4 transition-colors">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🛡️</span>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">نظام الصلاحيات (RBAC)</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              تضمن منصة سهلة الحماية المالية الكاملة: يمكن لعمال الكاونتر إنجاز الوثائق وطباعتها
              للزبائن دون إمكانية الاطلاع على الرصيد أو سحب الأموال.
            </p>

            <div className="mt-4 space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 transition-colors">
                <span className="font-bold text-slate-900 dark:text-white">أدمن المحل (مالك الحساب):</span> وصول كامل
                للخزينة وتعيين الطاقم.
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 transition-colors">
                <span className="font-bold text-emerald-600 dark:text-emerald-400">الموظف (STAFF):</span> محصور في استوديو
                الوثائق والطباعة.
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 border-t border-slate-200 dark:border-slate-800 pt-3">
            وفق قانون التجارة الإلكترونية 18-05 وقانون 18-07
          </div>
        </div>
      </div>

      <StaffMembersList
        staffList={staff.staffList}
        isLoading={staff.isLoadingStaff}
        onOpenAddModal={() => staff.setShowAddStaffModal(true)}
        onRemoveStaff={staff.removeStaff}
      />

      <StaffAddModal
        isOpen={staff.showAddStaffModal}
        onClose={() => staff.setShowAddStaffModal(false)}
        name={staff.newStaffName}
        setName={staff.setNewStaffName}
        phone={staff.newStaffPhone}
        setPhone={staff.setNewStaffPhone}
        error={staff.staffError}
        onSubmit={staff.addStaff}
        isSubmitting={staff.isAddingStaff}
      />
    </div>
  );
}
