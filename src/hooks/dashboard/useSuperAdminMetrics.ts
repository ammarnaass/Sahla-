"use client";

import { useState, useMemo } from "react";

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

export const INITIAL_NATIONAL_SHOPS: NationalShop[] = [
  {
    id: "shop_1",
    name: "مكتبة النجاح الرقمية",
    owner: "أحمد بن علي",
    wilaya: "الجزائر",
    wilayaCode: 16,
    phone: "0555 12 34 56",
    points: 150,
    isActive: true,
    docsCount: 420,
  },
  {
    id: "shop_2",
    name: "مقهى إنترنت المستقبل",
    owner: "ياسين عماري",
    wilaya: "وهران",
    wilayaCode: 31,
    phone: "0661 22 33 44",
    points: 85,
    isActive: true,
    docsCount: 310,
  },
  {
    id: "shop_3",
    name: "كيوسك الأوراس للخدمات",
    owner: "فاروق شريف",
    wilaya: "باتنة",
    wilayaCode: 5,
    phone: "0770 99 88 11",
    points: 200,
    isActive: true,
    docsCount: 690,
  },
];

export function useSuperAdminMetrics() {
  const [shops, setShops] = useState<NationalShop[]>(INITIAL_NATIONAL_SHOPS);
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");

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

  const topupShop = (id: string, name: string) => {
    setShops((prev) =>
      prev.map((s) => (s.id === id ? { ...s, points: s.points + 50 } : s))
    );
    setNotice(`✓ تم شحن 50 نقطة إدارية استثنائية لمحل "${name}" بنجاح!`);
    setTimeout(() => setNotice(""), 3500);
  };

  const toggleShopStatus = (id: string) => {
    setShops((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
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
  };
}
