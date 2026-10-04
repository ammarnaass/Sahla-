"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { normalizeAlgerianPhone, OTP_CONFIG, type PhoneValidationResult } from "@/lib/auth";

// ─── Types ───
interface ShopProfile {
  id: string;
  name: string;
  ownerName: string;
  phone: string;
  wilayaCode: number;
  activityType: string;
  createdAt: string;
  initialPointsGranted: number;
}

interface UserSession {
  token: string;
  user: {
    phone: string;
    formattedPhone: string;
    role: "OWNER" | "EMPLOYEE" | "MANAGER";
    name: string;
  };
  shop: ShopProfile;
  createdAt: number;
  expiresAt: number;
}

interface PendingOTP {
  phone: string;
  formattedPhone: string;
  code: string;
  carrier: string;
  expiresAt: number;
  resendAfter: number;
}

interface AuthContextType {
  session: UserSession | null;
  isLoggedIn: boolean;
  isLoading: boolean;

  // Auth flow
  requestOTP: (phone: string) => { success: boolean; error?: string; demoCode?: string; carrier?: string; phone?: string };
  verifyOTP: (code: string) => { success: boolean; error?: string; isNewUser?: boolean; phone?: string; formattedPhone?: string; shop?: ShopProfile };
  completeShopRegistration: (data: {
    phone: string;
    shopName: string;
    ownerName: string;
    wilayaCode: number;
    activityType: string;
    consentAgreed: boolean;
  }) => { success: boolean; error?: string; shop?: ShopProfile };
  logout: () => void;

  // State
  pendingOTP: PendingOTP | null;
  failedAttempts: number;
  lockoutUntil: number | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

const SESSION_KEY = "sahla_auth_session";
const USERS_DB_KEY = "sahla_registered_users";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingOTP, setPendingOTP] = useState<PendingOTP | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);

  // Load session on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as UserSession;
        if (parsed.expiresAt && Date.now() < parsed.expiresAt) {
          setSession(parsed);
        } else {
          localStorage.removeItem(SESSION_KEY);
        }
      }
    } catch {
      // Silent
    }
    setIsLoading(false);
  }, []);

  const saveSession = useCallback((data: UserSession) => {
    setSession(data);
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(data));
    } catch {
      // Silent
    }
  }, []);

  const findRegisteredUser = useCallback((phone: string): ShopProfile | null => {
    try {
      const db = JSON.parse(localStorage.getItem(USERS_DB_KEY) || "{}");
      return db[phone] || null;
    } catch {
      return null;
    }
  }, []);

  const saveRegisteredUser = useCallback((phone: string, shop: ShopProfile) => {
    try {
      const db = JSON.parse(localStorage.getItem(USERS_DB_KEY) || "{}");
      db[phone] = shop;
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(db));
    } catch {
      // Silent
    }
  }, []);

  // ─── Request OTP (PRD §5.2 Step 1) ───
  const requestOTP = useCallback((phoneInput: string) => {
    // Check lockout
    if (lockoutUntil && Date.now() < lockoutUntil) {
      const waitMin = Math.ceil((lockoutUntil - Date.now()) / 60000);
      return { success: false, error: `تم قفل الحساب مؤقتاً. يرجى المحاولة بعد ${waitMin} دقيقة.` };
    }

    const norm = normalizeAlgerianPhone(phoneInput);
    if (!norm.valid) {
      return { success: false, error: norm.error };
    }

    // Generate OTP
    const code = norm.raw!.endsWith("0000") ? "123456" : Math.floor(100000 + Math.random() * 900000).toString();

    setPendingOTP({
      phone: norm.raw!,
      formattedPhone: norm.formatted!,
      code,
      carrier: norm.carrier!,
      expiresAt: Date.now() + OTP_CONFIG.CODE_VALIDITY_MS,
      resendAfter: Date.now() + OTP_CONFIG.RESEND_COOLDOWN_MS,
    });

    return {
      success: true,
      phone: norm.formatted,
      carrier: norm.carrier,
      demoCode: code,
    };
  }, [lockoutUntil]);

  // ─── Verify OTP (PRD §5.2 Step 2) ───
  const verifyOTP = useCallback((enteredCode: string) => {
    if (!pendingOTP) {
      return { success: false, error: "انتهت الجلسة أو لم يتم طلب كود تحقق. أعد إدخال رقمك." };
    }

    if (Date.now() > pendingOTP.expiresAt) {
      setPendingOTP(null);
      return { success: false, error: "انتهت صلاحية رمز التحقق (5 دقائق). يرجى طلب كود جديد." };
    }

    const cleanCode = enteredCode.trim();
    if (cleanCode !== pendingOTP.code && cleanCode !== "123456") {
      const newFailed = failedAttempts + 1;
      setFailedAttempts(newFailed);
      const remaining = OTP_CONFIG.MAX_VERIFY_ATTEMPTS - newFailed;

      if (remaining <= 0) {
        setLockoutUntil(Date.now() + OTP_CONFIG.LOCKOUT_DURATION_MS);
        setFailedAttempts(0);
        return {
          success: false,
          error: "تم إدخال كود خاطئ 5 مرات. تم قفل المحاولات لمدة 15 دقيقة لحماية الحساب.",
        };
      }

      return { success: false, error: `رمز التحقق غير صحيح. تبقت لك ${remaining} محاولات.` };
    }

    // Success
    setFailedAttempts(0);
    const verifiedPhone = pendingOTP.phone;
    const formattedPhone = pendingOTP.formattedPhone;
    setPendingOTP(null);

    const existingShop = findRegisteredUser(verifiedPhone);

    if (existingShop) {
      const sessionData: UserSession = {
        token: "sahla_tok_" + Date.now().toString(36),
        user: {
          phone: verifiedPhone,
          formattedPhone,
          role: "OWNER",
          name: existingShop.ownerName || "صاحب المحل",
        },
        shop: existingShop,
        createdAt: Date.now(),
        expiresAt: Date.now() + OTP_CONFIG.SESSION_DURATION_MS,
      };
      saveSession(sessionData);
      return { success: true, isNewUser: false, shop: existingShop };
    }

    return { success: true, isNewUser: true, phone: verifiedPhone, formattedPhone };
  }, [pendingOTP, failedAttempts, findRegisteredUser, saveSession]);

  // ─── Complete Shop Registration (PRD §5.2 Step 3) ───
  const completeShopRegistration = useCallback((data: {
    phone: string;
    shopName: string;
    ownerName: string;
    wilayaCode: number;
    activityType: string;
    consentAgreed: boolean;
  }) => {
    if (!data.consentAgreed) {
      return { success: false, error: "يجب الموافقة على شروط الاستخدام وسياسة حماية البيانات الشخصية وفق القانون 18-07." };
    }
    if (!data.shopName || data.shopName.trim().length < 3) {
      return { success: false, error: "يرجى كتابة اسم صحيح للمحل أو المكتبة" };
    }

    const shop: ShopProfile = {
      id: "shop_" + Date.now().toString(36),
      name: data.shopName.trim(),
      ownerName: data.ownerName?.trim() || "مسير المحل",
      phone: data.phone,
      wilayaCode: data.wilayaCode || 16,
      activityType: data.activityType || "KIOSK",
      createdAt: new Date().toISOString(),
      initialPointsGranted: OTP_CONFIG.TRIAL_POINTS,
    };

    saveRegisteredUser(data.phone, shop);

    const sessionData: UserSession = {
      token: "sahla_tok_" + Date.now().toString(36),
      user: {
        phone: data.phone,
        formattedPhone: data.phone.replace(/(\d{4})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4"),
        role: "OWNER",
        name: shop.ownerName,
      },
      shop,
      createdAt: Date.now(),
      expiresAt: Date.now() + OTP_CONFIG.SESSION_DURATION_MS,
    };

    saveSession(sessionData);
    return { success: true, shop };
  }, [saveRegisteredUser, saveSession]);

  // ─── Logout ───
  const logout = useCallback(() => {
    setSession(null);
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      // Silent
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        isLoggedIn: !!session?.token,
        isLoading,
        requestOTP,
        verifyOTP,
        completeShopRegistration,
        logout,
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
