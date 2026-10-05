"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import type { StaffMember } from "@/hooks/dashboard/useStaffState";

interface StaffMembersListProps {
  staffList: StaffMember[];
  onOpenAddModal: () => void;
  onRemoveStaff: (id: string) => void;
}

export function StaffMembersList({
  staffList,
  onOpenAddModal,
  onRemoveStaff,
}: StaffMembersListProps) {
  return (
    <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-extrabold text-white">
            طاقم عمل المحل والموظفين المفوضين ({staffList.length}) 👥
          </h3>
          <p className="text-xs text-slate-400">
            أضف عمال الكاونتر برقم هاتفهم ليتمكنوا من تسجيل الدخول والعمل دون كلمة مرور
          </p>
        </div>

        <Button
          variant="outline"
          onClick={onOpenAddModal}
          className="text-xs py-2 px-4 self-start sm:self-auto"
        >
          إضافة موظف جديد +
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-right text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-bold bg-slate-950/40">
              <th className="py-3 px-4">اسم الموظف</th>
              <th className="py-3 px-4">رقم الهاتف</th>
              <th className="py-3 px-4">الرتبة والدور</th>
              <th className="py-3 px-4">تاريخ الإضافة</th>
              <th className="py-3 px-4 text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {staffList.map((staff) => (
              <tr key={staff.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px]">
                    👤
                  </span>
                  <span>{staff.name}</span>
                </td>
                <td className="py-3 px-4 font-mono text-slate-300" dir="ltr">
                  {staff.phone}
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    موظف كاونتر (STAFF)
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-400 text-[11px] font-mono">
                  {staff.addedAt}
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => onRemoveStaff(staff.id)}
                    className="px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors text-[11px] font-bold"
                  >
                    إلغاء الوصول ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
