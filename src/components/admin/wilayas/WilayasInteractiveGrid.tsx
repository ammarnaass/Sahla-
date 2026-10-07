"use client";

import React, { useState, useMemo } from "react";
import {
  MapPin,
  Search,
  Store,
  Coins,
  TrendingUp,
  Activity,
  Layers,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { ALGERIAN_WILAYAS } from "@/lib/constants";

export interface WilayaData {
  wilayaCode: number;
  wilayaName: string;
  shopsCount: number;
  activeShopsCount: number;
  totalPoints: number;
  percentage: number;
}

interface WilayasInteractiveGridProps {
  distribution: WilayaData[];
  onSelectWilaya?: (wilaya: WilayaData) => void;
}

// Regional classifications for Algerian Wilayas
const REGIONS = {
  ALL: { id: "ALL", nameAr: "كل الولايات (58)" },
  CENTRE: {
    id: "CENTRE",
    nameAr: "الوسط",
    codes: [16, 9, 35, 42, 26, 44, 10, 15],
  },
  EST: {
    id: "EST",
    nameAr: "الشرق",
    codes: [25, 23, 19, 5, 6, 18, 21, 24, 12, 4, 40, 41, 36, 43],
  },
  OUEST: {
    id: "OUEST",
    nameAr: "الغرب",
    codes: [31, 13, 27, 22, 29, 46, 48, 2, 20],
  },
  PLATEAUX: {
    id: "PLATEAUX",
    nameAr: "الهضاب العليا",
    codes: [34, 28, 17, 14, 38, 32, 45, 51],
  },
  SUD: {
    id: "SUD",
    nameAr: "الجنوب الكبير",
    codes: [
      1, 3, 7, 8, 11, 30, 33, 37, 39, 47, 49, 50, 52, 53, 54, 55, 56, 57, 58,
    ],
  },
} as const;

type RegionKey = keyof typeof REGIONS;

export function WilayasInteractiveGrid({
  distribution = [],
  onSelectWilaya,
}: WilayasInteractiveGridProps) {
  const [selectedRegion, setSelectedRegion] = useState<RegionKey>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"code" | "shops" | "points">("shops");
  const [isExpanded, setIsExpanded] = useState(false);

  // Map 58 wilayas merging existing distribution stats
  const fullWilayasList = useMemo(() => {
    const distMap = new Map<number, WilayaData>();
    distribution.forEach((d) => distMap.set(d.wilayaCode, d));

    return ALGERIAN_WILAYAS.map((w) => {
      const existing = distMap.get(w.code);
      if (existing) {
        return {
          ...existing,
          nameFr: w.nameFr,
        };
      }
      return {
        wilayaCode: w.code,
        wilayaName: w.nameAr,
        nameFr: w.nameFr,
        shopsCount: 0,
        activeShopsCount: 0,
        totalPoints: 0,
        percentage: 0,
      };
    });
  }, [distribution]);

  // Filter by region and search
  const filteredList = useMemo(() => {
    return fullWilayasList
      .filter((w) => {
        // Region filter
        if (selectedRegion !== "ALL") {
          const regionCodes = (REGIONS[selectedRegion] as any).codes || [];
          if (!regionCodes.includes(w.wilayaCode)) return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchNameAr = w.wilayaName.includes(q);
          const matchNameFr = (w as any).nameFr?.toLowerCase().includes(q);
          const matchCode = w.wilayaCode.toString() === q || w.wilayaCode.toString().padStart(2, "0") === q;
          return matchNameAr || matchNameFr || matchCode;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "shops") return b.shopsCount - a.shopsCount;
        if (sortBy === "points") return b.totalPoints - a.totalPoints;
        return a.wilayaCode - b.wilayaCode;
      });
  }, [fullWilayasList, selectedRegion, searchQuery, sortBy]);

  // Overall statistics
  const activeWilayasCount = fullWilayasList.filter((w) => w.shopsCount > 0).length;
  const topWilaya = fullWilayasList.reduce(
    (max, w) => (w.shopsCount > max.shopsCount ? w : max),
    fullWilayasList[0] || { wilayaName: "الجزائر", shopsCount: 0 }
  );

  const displayedList = isExpanded ? filteredList : filteredList.slice(0, 12);

  return (
    <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-6">
      {/* Header and Quick Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <MapPin size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground font-cairo flex items-center gap-2">
                مصفوفة تغطية الـ 58 ولاية جزائرية
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {activeWilayasCount} / 58 ولاية نشطة
                </span>
              </h3>
              <p className="text-xs text-muted-foreground font-cairo">
                المتابعة الميدانية اللحظية لتوزيع الأكشاك ومقاهي الإنترنت واستهلاك نقاط الطباعة
              </p>
            </div>
          </div>
        </div>

        {/* Top Performer Badge */}
        <div className="flex items-center gap-3 bg-muted/40 p-2.5 rounded-xl border border-border text-xs">
          <div className="flex items-center gap-1.5 font-bold text-muted-foreground">
            <Activity size={14} className="text-amber-500" />
            <span>الولاية المتصدرة:</span>
          </div>
          <span className="font-bold text-foreground bg-card px-2.5 py-1 rounded-lg border border-border">
            {topWilaya.wilayaName} ({topWilaya.shopsCount} كشك)
          </span>
        </div>
      </div>

      {/* Region Selector & Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        {/* Regions Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {Object.entries(REGIONS).map(([key, reg]) => {
            const isSelected = selectedRegion === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedRegion(key as RegionKey)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? "bg-foreground text-background shadow-xs"
                    : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/60"
                }`}
              >
                {reg.nameAr}
              </button>
            );
          })}
        </div>

        {/* Search & Sort */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-56">
            <Search
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="ابحث بالاسم أو الرمز..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-3 pr-8 py-1.5 text-xs rounded-xl bg-muted/30 border border-border focus:outline-none focus:border-emerald-500 text-foreground"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="py-1.5 px-2.5 text-xs rounded-xl bg-muted/30 border border-border text-foreground font-medium focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="shops">الأكثر أكشاكاً</option>
            <option value="points">الأعلى استهلاكاً</option>
            <option value="code">رقم الولاية (01-58)</option>
          </select>
        </div>
      </div>

      {/* Wilayas Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
        {displayedList.map((wilaya) => {
          const hasShops = wilaya.shopsCount > 0;
          const codeFormatted = wilaya.wilayaCode.toString().padStart(2, "0");

          return (
            <div
              key={wilaya.wilayaCode}
              onClick={() => onSelectWilaya?.(wilaya)}
              className={`p-3.5 rounded-xl border transition-all relative group cursor-pointer ${
                hasShops
                  ? "bg-card hover:bg-muted/30 border-border hover:border-emerald-500/50 shadow-xs"
                  : "bg-muted/10 border-border/50 opacity-70 hover:opacity-100 hover:bg-muted/20"
              }`}
            >
              {/* Top row: Code + Name */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-muted text-foreground font-mono font-black text-xs flex items-center justify-center border border-border">
                    {codeFormatted}
                  </span>
                  <div>
                    <h4 className="font-bold text-xs text-foreground font-cairo line-clamp-1">
                      {wilaya.wilayaName}
                    </h4>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {(wilaya as any).nameFr}
                    </span>
                  </div>
                </div>

                {hasShops && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="نشط على الشبكة" />
                )}
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-border/60 text-[11px]">
                <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                  <Store size={12} className="text-emerald-500" />
                  <span>{wilaya.shopsCount} كشك</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground font-mono font-medium justify-end">
                  <Coins size={12} className="text-amber-500" />
                  <span>{wilaya.totalPoints.toLocaleString()} ن</span>
                </div>
              </div>

              {/* Progress Bar (Share of National Activity) */}
              <div className="mt-2.5">
                <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(Math.max(wilaya.percentage * 2.5, hasShops ? 15 : 0), 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expand/Collapse Button */}
      {filteredList.length > 12 && (
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-muted/50 hover:bg-muted text-foreground border border-border transition-all cursor-pointer"
          >
            {isExpanded ? (
              <>
                <ChevronUp size={14} />
                <span>طي القائمة وعرض أهم الولايات</span>
              </>
            ) : (
              <>
                <ChevronDown size={14} />
                <span>عرض باقي الـ 58 ولاية بالكامل ({filteredList.length - 12} ولاية إضافية)</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
