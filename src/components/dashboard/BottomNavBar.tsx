"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Sparkles,
  FileText,
  Wallet,
  Settings,
  Crown,
} from "lucide-react";

interface BottomNavBarProps {
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
}

export function BottomNavBar({ activeTab = "overview", onSelectTab }: BottomNavBarProps) {
  const { session } = useAuth();
  const isEmployee = session?.user?.role === "EMPLOYEE" || session?.user?.role === "STAFF";
  const isSuperAdmin = session?.user?.role === "SUPER_ADMIN";

  const allNavItems = [
    {
      id: "overview",
      label: "الرئيسية",
      icon: LayoutDashboard,
    },
    {
      id: "services",
      label: "الخدمات",
      icon: Sparkles,
      badge: "جديد",
    },
    {
      id: "documents",
      label: "الوثائق",
      icon: FileText,
    },
    {
      id: "wallet",
      label: "المحفظة",
      hideForEmployee: true,
      icon: Wallet,
    },
    {
      id: isSuperAdmin ? "superadmin" : "settings",
      label: isSuperAdmin ? "الإدارة" : "الطباعة",
      icon: isSuperAdmin ? Crown : Settings,
    },
  ];

  const visibleNavItems = allNavItems.filter((item) => {
    if (item.hideForEmployee && isEmployee) return false;
    return true;
  });

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-background/95 backdrop-blur-md border-t border-border md:hidden safe-bottom pb-safe">
      <div className="flex items-center justify-around h-16 px-1">
        {visibleNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab && onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center flex-1 min-h-[44px] py-1 transition-all select-none relative cursor-pointer active:scale-95 ${
                isActive
                  ? "text-primary font-black"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="relative">
                <Icon
                  size={19}
                  className={`transition-transform ${isActive ? "scale-110 text-primary" : ""}`}
                />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary" />
                )}
              </div>
              <span className={`text-[10px] mt-1 tracking-tight ${isActive ? "font-bold" : "font-medium"}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-6 h-0.5 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
