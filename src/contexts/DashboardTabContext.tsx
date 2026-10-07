"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type TabType =
  | "overview"
  | "services"
  | "school-research"
  | "exams"
  | "documents"
  | "wallet"
  | "account"
  | "settings"
  | "superadmin";

interface DashboardTabContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const DashboardTabContext = createContext<DashboardTabContextType | null>(null);

export function DashboardTabProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTabState] = useState<TabType>("overview");

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (
        [
          "overview",
          "services",
          "school-research",
          "exams",
          "documents",
          "wallet",
          "account",
          "settings",
          "superadmin",
        ].includes(hash)
      ) {
        setActiveTabState(hash as TabType);
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const setActiveTab = (tab: TabType) => {
    setActiveTabState(tab);
    window.location.hash = tab === "overview" ? "" : tab;
  };

  return (
    <DashboardTabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </DashboardTabContext.Provider>
  );
}

export function useDashboardTab() {
  const ctx = useContext(DashboardTabContext);
  if (!ctx) {
    // Fallback if rendered outside provider
    return {
      activeTab: "overview" as TabType,
      setActiveTab: () => {},
    };
  }
  return ctx;
}
