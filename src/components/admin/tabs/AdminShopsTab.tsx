"use client";

import React, { useState } from "react";
import {
  Search,
  Store,
  Coins,
  CheckCircle2,
  XCircle,
  Phone,
  MapPin,
  Zap,
  Download,
  Eye,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import type { ShopRecord } from "@/server/repositories/shopRepository";
import { ShopDetailsModal } from "../modals/ShopDetailsModal";

interface AdminShopsTabProps {
  shops?: ShopRecord[];
  onTopup: (shopId: string, points: number) => void;
  onToggle: (shopId: string) => void;
}

export function AdminShopsTab({ shops = [], onTopup, onToggle }: AdminShopsTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterWilaya, setFilterWilaya] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "FROZEN" | "LOW_POINTS">("ALL");
  const [selectedShop, setSelectedShop] = useState<ShopRecord | null>(null);

  const filteredShops = shops.filter((shop) => {
    // Search
    const matchesSearch =
      shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (shop.phone && shop.phone.includes(searchTerm));

    // Wilaya
    const matchesWilaya = filterWilaya === "ALL" || shop.wilaya === filterWilaya;

    // Status filter
    let matchesStatus = true;
    if (statusFilter === "ACTIVE") matchesStatus = shop.isActive === true;
    if (statusFilter === "FROZEN") matchesStatus = shop.isActive === false;
    if (statusFilter === "LOW_POINTS") matchesStatus = (shop.pointsBalance ?? 0) < 50;

    return matchesSearch && matchesWilaya && matchesStatus;
  });

  const uniqueWilayas = Array.from(new Set(shops.map((s) => s.wilaya))).filter(Boolean);

  const handleExportCSV = () => {
    if (!shops.length) return;
    const headers = "اسم المحل,المسير,الولاية,الهاتف,الرصيد,الباقة,الحالة,تاريخ التسجيل\n";
    const rows = filteredShops
      .map(
        (s) =>
          `"${s.name}","${s.owner}","${s.wilaya}","${s.phone || ""}","${s.pointsBalance ?? 0}","${
            s.plan || "STARTER"
          }","${s.isActive ? "نشط" : "مجمد"}","${new Date(s.createdAt).toISOString()}"`
      )
      .join("\n");

    const csvBlob = new Blob(["\uFEFF" + headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(csvBlob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `sahla_shops_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* ─── Control Bar: Search, Filters & Export ─── */}
      <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full lg:w-96">
            <Search
              size={16}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="ابحث باسم المحل، المسير، أو رقم الهاتف..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-3 pr-10 py-2.5 text-xs sm:text-sm rounded-xl bg-muted/40 border border-border focus:outline-none focus:border-emerald-500 text-foreground"
            />
          </div>

          {/* Wilaya & Export */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-muted-foreground whitespace-nowrap font-cairo">
                الولاية:
              </label>
              <select
                value={filterWilaya}
                onChange={(e) => setFilterWilaya(e.target.value)}
                className="py-2 px-3 text-xs rounded-xl bg-muted/40 border border-border focus:outline-none focus:border-emerald-500 text-foreground cursor-pointer"
              >
                <option value="ALL">كل الولايات ({shops.length})</option>
                {uniqueWilayas.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-muted/60 hover:bg-muted border border-border text-foreground transition-all cursor-pointer font-cairo"
              title="تصدير بيانات الأكشاك إلى Excel / CSV"
            >
              <Download size={14} />
              <span>تصدير CSV</span>
            </button>
          </div>
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 no-scrollbar border-t border-border/60">
          <span className="text-[11px] font-bold text-muted-foreground font-cairo ml-2 shrink-0">
            تصفية الحالة:
          </span>
          {[
            { id: "ALL", label: "الكل", count: shops.length },
            { id: "ACTIVE", label: "النشطة بالسحابة", count: shops.filter((s) => s.isActive).length },
            { id: "FROZEN", label: "المجمدة", count: shops.filter((s) => !s.isActive).length },
            { id: "LOW_POINTS", label: "رصيد منخفض (< 50)", count: shops.filter((s) => (s.pointsBalance ?? 0) < 50).length },
          ].map((chip) => (
            <button
              key={chip.id}
              type="button"
              onClick={() => setStatusFilter(chip.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                statusFilter === chip.id
                  ? "bg-foreground text-background shadow-xs"
                  : "bg-muted/30 hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>{chip.label}</span>
              <span className="mr-1.5 opacity-75 font-mono text-[10px]">({chip.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* ─── Shops DataTable ─── */}
      <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-muted-foreground font-bold">
                <th className="py-3.5 px-4 font-cairo">المحل والمسير</th>
                <th className="py-3.5 px-4 font-cairo">الولاية</th>
                <th className="py-3.5 px-4 font-cairo">الهاتف</th>
                <th className="py-3.5 px-4 font-cairo">رصيد النقاط</th>
                <th className="py-3.5 px-4 font-cairo">الحالة</th>
                <th className="py-3.5 px-4 text-center font-cairo">شحن سريع</th>
                <th className="py-3.5 px-4 text-left font-cairo">الملف والإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredShops.length > 0 ? (
                filteredShops.map((shop) => (
                  <tr
                    key={shop.id}
                    className="hover:bg-muted/20 transition-colors group"
                  >
                    {/* Name & Owner */}
                    <td className="py-3.5 px-4">
                      <div
                        onClick={() => setSelectedShop(shop)}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold shrink-0 group-hover:scale-105 transition-transform">
                          <Store size={18} />
                        </div>
                        <div>
                          <span className="font-bold text-foreground block hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                            {shop.name}
                          </span>
                          <span className="text-[11px] text-muted-foreground">{shop.owner}</span>
                        </div>
                      </div>
                    </td>

                    {/* Wilaya */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-muted-foreground font-medium">
                        <MapPin size={13} className="text-emerald-500" />
                        {shop.wilaya}
                      </span>
                    </td>

                    {/* Phone */}
                    <td className="py-3.5 px-4 font-mono text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Phone size={13} />
                        {shop.phone || "—"}
                      </span>
                    </td>

                    {/* Points Balance */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-black text-sm text-foreground flex items-center gap-1">
                        <Coins size={14} className="text-amber-500" />
                        {(shop.pointsBalance ?? 0).toLocaleString()}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          shop.isActive
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                            : "bg-destructive/15 text-destructive border border-destructive/30"
                        }`}
                      >
                        {shop.isActive ? (
                          <>
                            <CheckCircle2 size={12} /> نشط
                          </>
                        ) : (
                          <>
                            <XCircle size={12} /> مجمد
                          </>
                        )}
                      </span>
                    </td>

                    {/* Quick Topup Buttons */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onTopup(shop.id, 50)}
                          className="px-2 py-1 rounded-lg bg-muted/60 hover:bg-emerald-500/20 hover:text-emerald-600 dark:hover:text-emerald-400 font-mono font-bold text-[11px] border border-border transition-all cursor-pointer shadow-xs active:scale-95"
                          title="شحن 50 نقطة فورياً"
                        >
                          +50
                        </button>
                        <button
                          type="button"
                          onClick={() => onTopup(shop.id, 100)}
                          className="px-2 py-1 rounded-lg bg-muted/60 hover:bg-emerald-500/20 hover:text-emerald-600 dark:hover:text-emerald-400 font-mono font-bold text-[11px] border border-border transition-all cursor-pointer shadow-xs active:scale-95"
                          title="شحن 100 نقطة فورياً"
                        >
                          +100
                        </button>
                      </div>
                    </td>

                    {/* Profile & Actions */}
                    <td className="py-3.5 px-4 text-left">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedShop(shop)}
                          className="p-1.5 rounded-lg bg-muted/50 hover:bg-muted text-foreground border border-border transition-colors cursor-pointer"
                          title="عرض ملف المحل الكامل"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => onToggle(shop.id)}
                          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                            shop.isActive
                              ? "border-destructive/30 text-destructive hover:bg-destructive/10"
                              : "border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
                          }`}
                          title={shop.isActive ? "تجميد الحساب" : "تنشيط الحساب"}
                        >
                          {shop.isActive ? <XCircle size={14} /> : <CheckCircle2 size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-muted-foreground">
                    لا توجد محلات مطابقة لمعايير البحث الحالية
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Shop Profile Modal ─── */}
      {selectedShop && (
        <ShopDetailsModal
          shop={selectedShop}
          onClose={() => setSelectedShop(null)}
          onTopup={onTopup}
          onToggleStatus={(id) => {
            onToggle(id);
            setSelectedShop((prev) => (prev ? { ...prev, isActive: !prev.isActive } : null));
          }}
        />
      )}
    </div>
  );
}
