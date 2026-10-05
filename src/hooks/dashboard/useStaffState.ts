"use client";

import { useState } from "react";

export interface StaffMember {
  id: string;
  name: string;
  phone: string;
  role: "STAFF" | "ADMIN";
  addedAt: string;
}

const INITIAL_STAFF: StaffMember[] = [
  {
    id: "staff_1",
    name: "كريم بن مهيدي",
    phone: "0661 99 88 77",
    role: "STAFF",
    addedAt: "2026-09-15",
  },
];

export function useStaffState(initialShopName = "مكتبة الأمل الرقمية", initialOwnerName = "أحمد بوعزيز") {
  // Shop Profile State
  const [shopName, setShopName] = useState(initialShopName);
  const [ownerName, setOwnerName] = useState(initialOwnerName);
  const [wilayaCode, setWilayaCode] = useState(16);
  const [commune, setCommune] = useState("الجزائر الوسطى");
  const [activityType, setActivityType] = useState("KIOSK");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Staff members state
  const [staffList, setStaffList] = useState<StaffMember[]>(INITIAL_STAFF);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffPhone, setNewStaffPhone] = useState("");
  const [staffError, setStaffError] = useState("");

  const saveShopProfile = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const addStaff = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newStaffName.trim() || !newStaffPhone.trim()) {
      setStaffError("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    const member: StaffMember = {
      id: `staff_${Date.now()}`,
      name: newStaffName.trim(),
      phone: newStaffPhone.trim(),
      role: "STAFF",
      addedAt: new Date().toISOString().split("T")[0],
    };

    setStaffList((prev) => [...prev, member]);
    setNewStaffName("");
    setNewStaffPhone("");
    setStaffError("");
    setShowAddStaffModal(false);
  };

  const removeStaff = (id: string) => {
    if (
      confirm("هل أنت متأكد من إلغاء وصول هذا الموظف؟ لن يتمكن من فتح حساب المحل بعد الآن.")
    ) {
      setStaffList((prev) => prev.filter((s) => s.id !== id));
    }
  };

  return {
    shopName,
    setShopName,
    ownerName,
    setOwnerName,
    wilayaCode,
    setWilayaCode,
    commune,
    setCommune,
    activityType,
    setActivityType,
    saveSuccess,
    saveShopProfile,
    staffList,
    showAddStaffModal,
    setShowAddStaffModal,
    newStaffName,
    setNewStaffName,
    newStaffPhone,
    setNewStaffPhone,
    staffError,
    addStaff,
    removeStaff,
  };
}
