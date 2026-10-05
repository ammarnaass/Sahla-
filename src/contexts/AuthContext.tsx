"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { normalizeAlgerianPhone } from "@/lib/auth";

// ─── Types ───
export interface ShopProfile {
  id: string;
  name: string;
  owner?: string;
  ownerName?: string;
  phone?: string;
  wilaya?: string;
  wilayaCode?: number;
  activity?: string;
  activityType?: string;
  points?: number;
  status?: string;
  plan?: string;
  createdAt?: string;
  initialPointsGranted?: number;
}

export interface UserSession {
  token: string;
  user: {
    id: string;
    name: string;
    email?: string | null;
    phone?: string | null;
    formattedPhone?: string;
    role: "SUPER_ADMIN" | "SHOP_ADMIN" | "STAFF" | "OWNER" | "EMPLOYEE";
    shopId?: string | null;
  };
  shop: ShopProfile;
  createdAt: number | string;
  expiresAt?: number | string;
}

export interface PendingOTP {
  phone: string;
  formattedPhone: string;
  code: string;
  carrier: string;
  expiresAt: number;
  resendAfter: number;
}

export interface AuthContextType {
  session: UserSession | null;
  isLoggedIn: boolean;
  isLoading: boolean;

  // Modern Gmail & Password Auth
  loginWithEmail: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string; user?: any; shop?: any }>;
  registerWithEmail: (data: {
    name: string;
    email: string;
    password: string;
    shopName: string;
    wilaya: string;
    activity?: string;
    phone?: string;
  }) => Promise<{ success: boolean; error?: string; user?: any; shop?: any }>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;

  // Legacy Phone / OTP flow helpers
  requestOTP: (phone: string) => {
    success: boolean;
    error?: string;
    demoCode?: string;
    carrier?: string;
    phone?: string;
  };
  verifyOTP: (code: string) => {
    success: boolean;
    error?: string;
    isNewUser?: boolean;
    phone?: string;
    formattedPhone?: string;
    shop?: ShopProfile;
  };
  completeShopRegistration: (data: {
    phone: string;
    shopName: string;
    ownerName: string;
    wilayaCode: number;
    activityType: string;
    consentAgreed: boolean;
  }) => { success: boolean; error?: string; shop?: ShopProfile };

  // State
  pendingOTP: PendingOTP | null;
  failedAttempts: number;
  lockoutUntil: number | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

const SESSION_KEY = "sahla_auth_session";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingOTP, setPendingOTP] = useState<PendingOTP | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);

  // Sync session state to storage
  const saveSession = useCallback((data: UserSession | null) => {
    setSession(data);
    try {
      if (data) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(data));
      } else {
        localStorage.removeItem(SESSION_KEY);
      }
    } catch {
      // Silent
    }
  }, []);

  // Fetch current session from server /api/auth/me
  const refreshSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          const newSession: UserSession = {
            token: data.token || "sahla_active_session",
            user: {
              ...data.user,
              formattedPhone: data.user.phone || "",
            },
            shop: {
              ...data.shop,
              ownerName: data.shop?.owner || data.user.name,
              activityType: data.shop?.activity || "KIOSK",
              points: data.shop?.points ?? 50,
            },
            createdAt: Date.now(),
          };
          saveSession(newSession);
          return;
        }
      }
    } catch {
      // Offline or network error
    }
  }, [saveSession]);

  // Load session on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as UserSession;
        setSession(parsed);
      }
    } catch {
      // Silent
    }

    // Check with server
    refreshSession().finally(() => {
      setIsLoading(false);
    });
  }, [refreshSession]);

  // ─── Modern Email / Gmail & Password Auth ───
  const loginWithEmail = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || "البريد الإلكتروني أو كلمة المرور غير صحيحة" };
      }

      const newSession: UserSession = {
        token: data.token,
        user: {
          ...data.user,
          formattedPhone: data.user.phone || "",
        },
        shop: {
          ...data.shop,
          ownerName: data.shop?.owner || data.user.name,
          activityType: data.shop?.activity || "KIOSK",
          points: data.shop?.points ?? 50,
        },
        createdAt: Date.now(),
      };

      saveSession(newSession);
      return { success: true, user: data.user, shop: data.shop };
    } catch (err: any) {
      return { success: false, error: err.message || "حدث خطأ في الاتصال بالخادم" };
    }
  };

  const registerWithEmail = async (data: {
    name: string;
    email: string;
    password: string;
    shopName: string;
    wilaya: string;
    activity?: string;
    phone?: string;
  }) => {
    try {
      const res = await fetch("/api/auth/register-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        return { success: false, error: resData.error || "تعذر إتمام التسجيل" };
      }

      const newSession: UserSession = {
        token: resData.token,
        user: {
          ...resData.user,
          formattedPhone: resData.user.phone || "",
        },
        shop: {
          ...resData.shop,
          ownerName: resData.shop?.owner || resData.user.name,
          activityType: resData.shop?.activity || "KIOSK",
          points: resData.shop?.points ?? 50,
        },
        createdAt: Date.now(),
      };

      saveSession(newSession);
      return { success: true, user: resData.user, shop: resData.shop };
    } catch (err: any) {
      return { success: false, error: err.message || "تعذر إتمام تسجيل المتجر" };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Silent
    }
    saveSession(null);
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  // ─── Backward-compatible Legacy OTP Helpers ───
  const requestOTP = useCallback((phoneInput: string) => {
    const norm = normalizeAlgerianPhone(phoneInput);
    if (!norm.valid) {
      return { success: false, error: norm.error };
    }

    const code = "123456";
    setPendingOTP({
      phone: norm.raw!,
      formattedPhone: norm.formatted!,
      code,
      carrier: norm.carrier || "موبيليس",
      expiresAt: Date.now() + 120000,
      resendAfter: Date.now() + 30000,
    });

    return {
      success: true,
      demoCode: code,
      carrier: norm.carrier || "موبيليس",
      phone: norm.raw,
    };
  }, []);

  const verifyOTP = useCallback((code: string) => {
    if (!code || code.length !== 6) {
      return { success: false, error: "رمز التحقق يجب أن يتكون من 6 أرقام" };
    }

    const demoPhone = pendingOTP?.phone || "0555123456";
    const demoShop: ShopProfile = {
      id: "shop_1",
      name: "مكتبة النجاح الرقمية",
      ownerName: "أحمد بن علي",
      phone: demoPhone,
      wilaya: "16 - الجزائر العاصمة",
      wilayaCode: 16,
      activity: "KIOSK",
      activityType: "KIOSK",
      points: 250,
      status: "ACTIVE",
    };

    const newSession: UserSession = {
      token: `sahla_session_${Date.now()}`,
      user: {
        id: "user_shop_admin",
        name: "أحمد بن علي",
        email: "najah.kiosk@gmail.com",
        phone: demoPhone,
        formattedPhone: demoPhone,
        role: "SHOP_ADMIN",
        shopId: "shop_1",
      },
      shop: demoShop,
      createdAt: Date.now(),
    };

    saveSession(newSession);
    return { success: true, isNewUser: false, shop: demoShop };
  }, [pendingOTP, saveSession]);

  const completeShopRegistration = useCallback((data: {
    phone: string;
    shopName: string;
    ownerName: string;
    wilayaCode: number;
    activityType: string;
  }) => {
    const newShop: ShopProfile = {
      id: `shop_${Date.now()}`,
      name: data.shopName,
      ownerName: data.ownerName,
      phone: data.phone,
      wilaya: `${data.wilayaCode} - ولاية جزائرية`,
      wilayaCode: data.wilayaCode,
      activity: data.activityType,
      activityType: data.activityType,
      points: 50,
      status: "ACTIVE",
    };

    const newSession: UserSession = {
      token: `sahla_session_${Date.now()}`,
      user: {
        id: `user_${Date.now()}`,
        name: data.ownerName,
        phone: data.phone,
        formattedPhone: data.phone,
        role: "SHOP_ADMIN",
        shopId: newShop.id,
      },
      shop: newShop,
      createdAt: Date.now(),
    };

    saveSession(newSession);
    return { success: true, shop: newShop };
  }, [saveSession]);

  return (
    <AuthContext.Provider
      value={{
        session,
        isLoggedIn: !!session,
        isLoading,
        loginWithEmail,
        registerWithEmail,
        logout,
        refreshSession,
        requestOTP,
        verifyOTP,
        completeShopRegistration,
        pendingOTP,
        failedAttempts,
        lockoutUntil,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
