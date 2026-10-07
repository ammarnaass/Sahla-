"use client";

import React, { useState } from "react";
import { Search, Store, Coins, CheckCircle2, XCircle, Phone, MapPin, Zap } from "lucide-react";
import type { ShopRecord } from "@/server/repositories/shopRepository";

interface AdminShopsTabProps {
  shops?: ShopRecord[];
  onTopup: (shopId: string, points: number) => void;
  onToggle: (shopId: string) => void;
}

export function AdminShopsTab({ shops = [], onTopup, onToggle }: AdminShopsTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterWilaya, setFilterWilaya] = useState<string>("ALL");

  const filteredShops = shops.filter((shop) => {
    const matchesSearch =
      shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (shop.phone && shop.phone.includes(searchTerm));
    const matchesWilaya = filterWilaya === "ALL" || shop.wilaya === filterWilaya;
    return matchesSearch && matchesWilaya;
  });

  const uniqueWilayas = Array.from(new Set(shops.map((s) => s.wilaya))).filter(Boolean);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Search & Filters */}
      <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="ابحث باسم المحل، المسير، أو الهاتف..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-3 pr-10 py-2.5 text-xs sm:text-sm rounded-xl bg-muted/40 border border-border focus:outline-none focus:border-emerald-500 text-foreground"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs font-bold text-muted-foreground whitespace-nowrap">الولاية:</label>
          <select
            value={filterWilaya}
            onChange={(e) => setFilterWilaya(e.target.value)}
            className="w-full sm:w-48 py-2 px-3 text-xs rounded-xl bg-muted/40 border border-border focus:outline-none focus:border-emerald-500 text-foreground"
          >
            <option value="ALL">كل الولايات ({shops.length})</option>
            {uniqueWilayas.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Shops Table */}
      <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-muted-foreground font-bold">
                <th className="py-3.5 px-4">المحل والمسير</th>
                <th className="py-3.5 px-4">الولاية</th>
                <th className="py-3.5 px-4">الهاتف</th>
                <th className="py-3.5 px-4">رصيد النقاط</th>
                <th className="py-3.5 px-4">الحالة</th>
                <th className="py-3.5 px-4 text-center">شحن سريع</th>
                <th className="py-3.5 px-4 text-left">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredShops.length > 0 ? (
                filteredShops.map((shop) => (
                  <tr key={shop.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold shrink-0">
                          <Store size={18} />
                        </div>
                        <div>
                          <span className="font-bold text-foreground block">{shop.name}</span>
                          <span className="text-[11px] text-muted-foreground">{shop.owner}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-muted-foreground font-medium">
                        <MapPin size={13} className="text-emerald-500" />
                        {shop.wilaya}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Phone size={13} />
                        {shop.phone || "—"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-black text-sm text-foreground flex items-center gap-1">
                        <Coins size={14} className="text-amber-500" />
                        {(shop.pointsBalance ?? 0).toLocaleString()}
                      </span>
                    </td>
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
                            <XCircle size={12} /> مجمّد
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onTopup(shop.id, 50)}
                          className="px-2 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-[11px] transition"
                        >
                          +50
                        </button>
                        <button
                          onClick={() => onTopup(shop.id, 100)}
                          className="px-2 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-[11px] transition"
                        >
                          +100
                        </button>
                        <button
                          onClick={() => onTopup(shop.id, 500)}
                          className="px-2 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-600 dark:text-amber-400 font-mono font-bold text-[11px] transition"
                        >
                          +500
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-left">
                      <button
                        onClick={() => onToggle(shop.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition border ${
                          shop.isActive
                            ? "text-destructive border-destructive/30 hover:bg-destructive/10"
                            : "text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10"
                        }`}
                      >
                        {shop.isActive ? "تجميد" : "تفعيل"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-muted-foreground font-cairo">
                    لا توجد محلات مطابقة لمعايير البحث
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
