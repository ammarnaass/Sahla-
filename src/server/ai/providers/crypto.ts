import crypto from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const SECRET =
  process.env.AI_PROVIDER_KEK ||
  process.env.ENCRYPTION_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  "sahla-saas-national-ai-gateway-secure-salt-2026";

// Derive 32-byte key from secret
const KEY = crypto.createHash("sha256").update(SECRET).digest();

/**
 * Encrypt a plain API key using AES-256-GCM
 */
export function encryptKey(plainText: string): string {
  if (!plainText || !plainText.trim()) return "";
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  let encrypted = cipher.update(plainText.trim(), "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");

  return `${iv.toString("hex")}:${authTag}:${encrypted}`;
}

/**
 * Decrypt an AES-256-GCM encrypted API key
 */
export function decryptKey(cipherText: string): string {
  if (!cipherText || !cipherText.includes(":")) return cipherText || "";
  try {
    const [ivHex, authTagHex, encrypted] = cipherText.split(":");
    if (!ivHex || !authTagHex || !encrypted) return cipherText;

    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");
    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (err) {
    console.error("[crypto:decryptKey] decryption error:", err);
    return "";
  }
}

/**
 * Extract last 4 characters for safe display
 */
export function extractLast4(rawKey: string): string {
  if (!rawKey) return "";
  const clean = rawKey.trim();
  return clean.length >= 4 ? clean.slice(-4) : clean;
}

/**
 * Mask an API key for safe UI display (e.g. ••••••••a1b2 per PRD Section 3.1 & 7)
 */
export function maskKey(rawKeyOrLast4: string): string {
  if (!rawKeyOrLast4 || !rawKeyOrLast4.trim()) return "";
  const last4 = rawKeyOrLast4.length <= 4 ? rawKeyOrLast4 : rawKeyOrLast4.slice(-4);
  return `••••••••${last4}`;
}
