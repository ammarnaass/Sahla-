"use client";

import React, { useState, useRef, useEffect } from "react";
import { SERVICES_CATALOG, ServiceDefinition } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";

interface QuickSearchProps {
  onSelectService: (service: ServiceDefinition) => void;
}

export function QuickSearch({ onSelectService }: QuickSearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter matching services
  const matches = query.trim()
    ? SERVICES_CATALOG.filter(
        (s) =>
          s.nameAr.toLowerCase().includes(query.toLowerCase()) ||
          s.nameFr.toLowerCase().includes(query.toLowerCase()) ||
          s.code.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  // Close on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full text-right">
      <div className="relative">
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <input
          type="text"
          placeholder="ماذا يطلب زبونك اليوم؟ (مثال: سيرة ذاتية، فاتورة، صورة هوية...)"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full h-13 pr-12 pl-4 rounded-2xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-md transition-all"
        />

        {query && (
          <button
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
          >
            مسح ✕
          </button>
        )}
      </div>

      {/* Instant Dropdown Results */}
      {isOpen && query.trim() && (
        <div className="absolute top-15 inset-x-0 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-40 max-h-72 overflow-y-auto">
          {matches.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-400">
              لم نعثر على خدمة مطابقة لـ «{query}». جرب كلمة أخرى أو تصفح القائمة الكاملة أدناه.
            </div>
          ) : (
            <div className="space-y-1">
              {matches.map((svc) => (
                <div
                  key={svc.code}
                  onClick={() => {
                    onSelectService(svc);
                    setIsOpen(false);
                    setQuery("");
                  }}
                  className="p-3 rounded-xl hover:bg-slate-800/80 cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{svc.icon}</span>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-white">{svc.nameAr}</div>
                      <div className="text-[11px] text-slate-400">{svc.nameFr}</div>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {svc.isFree ? (
                      <Badge variant="free" size="sm">
                        مجاني
                      </Badge>
                    ) : (
                      <Badge variant="primary" size="sm">
                        {svc.pointsCost} نقطة
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
