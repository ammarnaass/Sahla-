"use client";

import { useState, useEffect, useCallback } from "react";

export interface StaffMember {
  id: string;
  name: string;
  phone: string;
  role: "STAFF" | "ADMIN" | string;
  addedAt: string;
}

export function useStaffState(
  initialShopName = "",
  initialOwnerName = "",
  shopId = "",
  onProfileUpdated?: (updatedShop: any) => void
) {
  // Shop Profile State
  const [shopName, setShopName] = useState(initialShopName);
  const [ownerName, setOwnerName] = useState(initialOwnerName);
  const [wilayaCode, setWilayaCode] = useState(16);
  const [commune, setCommune] = useState("الجزائر الوسطى");
  const [activityType, setActivityType] = useState("KIOSK");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState("");

  // Staff members state (real dynamic data, no hardcoded dummy items)
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [isLoadingStaff, setIsLoadingStaff] = useState(false);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffPhone, setNewStaffPhone] = useState("");
  const [staffError, setStaffError] = useState("");
  const [isAddingStaff, setIsAddingStaff] = useState(false);

  // Sync state if session loads after initial render
  useEffect(() => {
    if (initialShopName && !shopName) setShopName(initialShopName);
    if (initialOwnerName && !ownerName) setOwnerName(initialOwnerName);
  }, [initialShopName, initialOwnerName, shopName, ownerName]);

  // 1. Fetch real shop profile from backend
  const fetchShopProfile = useCallback(async () => {
    if (!shopId) return;
    try {
      const res = await fetch(`/api/shops/profile?shopId=${encodeURIComponent(shopId)}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (data.success && data.shop) {
        if (data.shop.name) setShopName(data.shop.name);
        if (data.shop.owner) setOwnerName(data.shop.owner);
        if (data.shop.wilayaCode) setWilayaCode(Number(data.shop.wilayaCode));
        if (data.shop.commune) setCommune(data.shop.commune);
        if (data.shop.activity) setActivityType(data.shop.activity);
      }
    } catch {
      // Keep initial
    }
  }, [shopId]);

  // 2. Fetch real staff list from backend
  const fetchStaffList = useCallback(async () => {
    if (!shopId) return;
    try {
      setIsLoadingStaff(true);
      const res = await fetch(`/api/shop/staff?shopId=${encodeURIComponent(shopId)}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.staff)) {
        setStaffList(data.staff);
      }
    } catch {
      // Silent error
    } finally {
      setIsLoadingStaff(false);
    }
  }, [shopId]);

  useEffect(() => {
    if (shopId) {
      fetchShopProfile();
      fetchStaffList();
    }
  }, [shopId, fetchShopProfile, fetchStaffList]);

  // 3. Save shop profile to backend database
  const saveShopProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setProfileError("");
    setIsSavingProfile(true);

    try {
      const res = await fetch("/api/shops/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shopId,
          name: shopName.trim(),
          owner: ownerName.trim(),
          wilayaCode,
          commune: commune.trim(),
          activity: activityType,
        }),
      });

      const data = await res.json();
      if (data.success && data.shop) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
        if (onProfileUpdated) {
          onProfileUpdated(data.shop);
        }
      } else {
        setProfileError(data.error || "فشل حفظ بيانات المحل");
      }
    } catch {
      setProfileError("تعذر الاتصال بالخادم لحفظ التعديلات");
    } finally {
      setIsSavingProfile(false);
    }
  };

  // 4. Add real staff member to backend database
  const addStaff = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setStaffError("");

    if (!newStaffName.trim() || !newStaffPhone.trim()) {
      setStaffError("يرجى ملء جميع الحقول المطلوبة (الاسم ورقم الهاتف)");
      return;
    }

    setIsAddingStaff(true);
    try {
      const res = await fetch("/api/shop/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shopId,
          name: newStaffName.trim(),
          phone: newStaffPhone.trim(),
        }),
      });

      const data = await res.json();
      if (data.success && data.staffMember) {
        setStaffList((prev) => [...prev, data.staffMember]);
        setNewStaffName("");
        setNewStaffPhone("");
        setStaffError("");
        setShowAddStaffModal(false);
      } else {
        setStaffError(data.error || "فشل إضافة الموظف");
      }
    } catch {
      setStaffError("حدث خطأ في الاتصال بالخادم أثناء إضافة الموظف");
    } finally {
      setIsAddingStaff(false);
    }
  };

  // 5. Remove real staff member from backend database
  const removeStaff = async (id: string) => {
    if (
      !confirm("هل أنت متأكد من إلغاء وصول هذا الموظف؟ لن يتمكن من فتح حساب المحل بعد الآن.")
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/shop/staff/${encodeURIComponent(id)}?shopId=${encodeURIComponent(shopId)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setStaffList((prev) => prev.filter((s) => s.id !== id));
      } else {
        alert(data.error || "فشل حذف الموظف");
      }
    } catch {
      alert("تعذر الاتصال بالخادم لحذف الموظف");
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
    isSavingProfile,
    profileError,
    saveShopProfile,
    staffList,
    isLoadingStaff,
    showAddStaffModal,
    setShowAddStaffModal,
    newStaffName,
    setNewStaffName,
    newStaffPhone,
    setNewStaffPhone,
    staffError,
    isAddingStaff,
    addStaff,
    removeStaff,
    refreshStaff: fetchStaffList,
    refreshProfile: fetchShopProfile,
  };
}
