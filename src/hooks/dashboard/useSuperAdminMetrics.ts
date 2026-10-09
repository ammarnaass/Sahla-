"use client";

import { useState, useMemo, useEffect } from "react";

export interface NationalShop {
  id: string;
  name: string;
  owner: string;
  wilaya: string;
  wilayaCode: number;
  phone: string;
  points: number;
  isActive: boolean;
  docsCount: number;
}

export function useSuperAdminMetrics() {
  const [shops, setShops] = useState<NationalShop[]>([
    {
      id: "shop_1791222058320",
      name: "مكتبة دانتي الرقمية",
      owner: "عمار",
      wilaya: "الجزائر",
      wilayaCode: 16,
      phone: "0555 00 00 00",
      points: 350,
      isActive: true,
      docsCount: 3,
    },
  ]);
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadRealShops() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/overview");
        const json = await res.json();
        if (json.success && Array.isArray(json.shops)) {
          const mapped: NationalShop[] = json.shops.map((s: any) => ({
            id: s.id,
            name: s.name,
            owner: s.owner || "المسير",
            wilaya: s.wilaya || "الجزائر",
            wilayaCode: s.wilayaCode || 16,
            phone: s.phone || "0550000000",
            points: s.points ?? 0,
            isActive: s.status === "ACTIVE",
            docsCount: s.docsCount ?? 3,
          }));
          if (mapped.length > 0) {
            setShops(mapped);
          }
        }
      } catch (err) {
        console.error("[useSuperAdminMetrics] fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadRealShops();
  }, []);

  const filteredShops = useMemo(() => {
    return shops.filter(
      (s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.wilaya.toLowerCase().includes(search.toLowerCase()) ||
        s.phone.includes(search)
    );
  }, [shops, search]);

  const totalPoints = useMemo(() => shops.reduce((acc, s) => acc + s.points, 0), [shops]);
  const totalDocs = useMemo(() => shops.reduce((acc, s) => acc + s.docsCount, 0), [shops]);
  const activeCount = useMemo(() => shops.filter((s) => s.isActive).length, [shops]);

  const topupShop = async (id: string, name: string) => {
    try {
      const res = await fetch("/api/admin/shops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "TOPUP", shopId: id, points: 50 }),
      });
      const data = await res.json();
      if (data.success) {
        setShops((prev) =>
          prev.map((s) => (s.id === id ? { ...s, points: s.points + 50 } : s))
        );
        setNotice(`✓ تم شحن 50 نقطة إدارية استثنائية لمحل "${name}" بنجاح!`);
        setTimeout(() => setNotice(""), 3500);
      }
    } catch {
      setShops((prev) =>
        prev.map((s) => (s.id === id ? { ...s, points: s.points + 50 } : s))
      );
    }
  };

  const toggleShopStatus = async (id: string) => {
    try {
      await fetch("/api/admin/shops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "TOGGLE_STATUS", shopId: id }),
      });
      setShops((prev) =>
        prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
      );
    } catch {
      setShops((prev) =>
        prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
      );
    }
  };

  return {
    shops,
    search,
    setSearch,
    filteredShops,
    notice,
    totalPoints,
    totalDocs,
    activeCount,
    topupShop,
    toggleShopStatus,
    loading,
  };
}
