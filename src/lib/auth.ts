// Sahla Algerian Phone Validation & OTP Engine (محرك التحقق من الهاتف الجزائري)
// PRD Section 5: OTP Authentication

export interface PhoneValidationResult {
  valid: boolean;
  error?: string;
  raw?: string;
  formatted?: string;
  international?: string;
  carrier?: "Ooredoo" | "Mobilis" | "Djezzy";
}

/**
 * Normalize and validate an Algerian phone number.
 * Accepts formats: 0555123456, +213555123456, 00213555123456, 555123456
 */
export function normalizeAlgerianPhone(rawPhone: string): PhoneValidationResult {
  if (!rawPhone || rawPhone.trim().length === 0) {
    return { valid: false, error: "يرجى إدخال رقم الهاتف" };
  }

  let cleaned = rawPhone.replace(/[\s\-.()+]/g, "");

  // Convert international to local
  if (cleaned.startsWith("213") && cleaned.length >= 12) {
    cleaned = "0" + cleaned.substring(3);
  } else if (cleaned.length === 9 && /^[567]/.test(cleaned)) {
    cleaned = "0" + cleaned;
  }

  // Validate Algerian mobile: 05 (Ooredoo), 06 (Mobilis), 07 (Djezzy)
  const regex = /^0[567]\d{8}$/;
  if (!regex.test(cleaned)) {
    return {
      valid: false,
      error: "رقم غير صحيح. يجب أن يبدأ بـ 05، 06، أو 07 ويتكون من 10 أرقام (مثال: 0555 12 34 56)",
    };
  }

  const carrier: PhoneValidationResult["carrier"] = cleaned.startsWith("05")
    ? "Ooredoo"
    : cleaned.startsWith("06")
      ? "Mobilis"
      : "Djezzy";

  const formatted = cleaned.replace(/(\d{4})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4");
  const international =
    "+213 " + cleaned.substring(1).replace(/(\d{3})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4");

  return { valid: true, raw: cleaned, formatted, international, carrier };
}

/**
 * Generate a 6-digit OTP code.
 * Demo codes: numbers ending in 0000 always get "123456"
 */
export function generateOTP(phone: string): string {
  if (phone.endsWith("0000")) return "123456";
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Rate limiting constants (PRD Section 5.4)
export const OTP_CONFIG = {
  CODE_LENGTH: 6,
  CODE_VALIDITY_MS: 5 * 60 * 1000,         // 5 minutes
  RESEND_COOLDOWN_MS: 60 * 1000,            // 60 seconds
  MAX_VERIFY_ATTEMPTS: 5,
  LOCKOUT_DURATION_MS: 15 * 60 * 1000,      // 15 minutes
  MAX_REQUESTS_PER_HOUR: 5,
  SESSION_DURATION_MS: 30 * 24 * 60 * 60 * 1000, // 30 days
  MAX_ACTIVE_DEVICES: 2,
  TRIAL_POINTS: 50,
} as const;
