"use client";

import React, { useState, useRef, useEffect } from "react";
import { SERVICES_CATALOG, ServiceDefinition } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";
import { getServiceIcon } from "@/components/ui/Icons";

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
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
          <Search size={18} />
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
          className="w-full h-12 pr-11 pl-20 rounded-2xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-xs transition-all font-medium"
        />

        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setIsOpen(false);
              }}
              className="text-xs text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted transition-colors cursor-pointer"
              title="مسح البحث"
            >
              <X size={14} />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground bg-muted rounded border border-border">
              /
            </kbd>
          )}
        </div>
      </div>

      {/* Instant Dropdown Results */}
      {isOpen && query.trim() && (
        <div className="absolute top-14 inset-x-0 bg-card border border-border rounded-2xl shadow-xl p-2 z-40 max-h-72 overflow-y-auto no-scrollbar animate-in fade-in-50 duration-150">
          {matches.length === 0 ? (
            <div className="p-4 text-center text-xs text-muted-foreground font-cairo">
              لم نعثر على خدمة مطابقة لـ «{query}». جرب كتابة كلمة أخرى بالعربية أو الفرنسية.
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
                  className="p-2.5 sm:p-3 rounded-xl hover:bg-muted/80 cursor-pointer flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center shrink-0 text-foreground group-hover:scale-105 transition-transform border border-border">
                      {getServiceIcon(svc.code, 18)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate">
                        {svc.nameAr}
                      </div>
                      <div className="text-[10px] text-muted-foreground font-mono truncate">
                        {svc.nameFr}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 mr-2">
                    {svc.isFree ? (
                      <Badge variant="outline" className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                        مجاني
                      </Badge>
                    ) : (
                      <Badge variant="primary" className="text-[10px] font-mono font-bold">
                        {svc.pointsCost} ن
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
