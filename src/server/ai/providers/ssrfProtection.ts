/**
 * 🛡️ Sahla SaaS - SSRF Protection for Custom AI Provider Endpoints
 * Technical Spec v1.0 Section 4.1 & 7
 * Rejects non-https, local loopback, link-local, and private RFC1918 subnets.
 */

export interface UrlValidationResult {
  valid: boolean;
  error?: string;
  normalizedUrl?: string;
}

export function validateBaseUrl(
  urlStr?: string,
  options?: { allowLocal?: boolean }
): UrlValidationResult {
  if (!urlStr || typeof urlStr !== "string" || !urlStr.trim()) {
    return { valid: true, normalizedUrl: "" }; // Optional base_url falls back to default provider endpoint
  }

  const cleanUrl = urlStr.trim();
  let parsed: URL;
  try {
    parsed = new URL(cleanUrl);
  } catch {
    return { valid: false, error: "صيغة الرابط غير صحيحة، يجب إدخال رابط ويب مكتمل" };
  }

  const isLocalAllowed = Boolean(options?.allowLocal);

  // 1. Protocol check
  if (!isLocalAllowed && parsed.protocol !== "https:") {
    return { valid: false, error: "يجب أن يبدأ العنوان ببروتوكول آمن https:// حصراً" };
  }
  if (isLocalAllowed && parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return { valid: false, error: "يجب أن يبدأ العنوان بـ http:// أو https://" };
  }

  const hostname = parsed.hostname.toLowerCase();

  // Always block cloud metadata endpoints regardless of allowLocal
  if (
    hostname === "169.254.169.254" ||
    hostname === "metadata.google.internal" ||
    hostname.endsWith(".onion")
  ) {
    return { valid: false, error: "عناوين خوادم البيانات الحساسة للسحابة (Metadata) محظورة تماماً" };
  }

  // If local is explicitly allowed, skip loopback and private IP checks
  if (!isLocalAllowed) {
    // 2. Reject localhost & special names
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "0.0.0.0" ||
      hostname === "::1" ||
      hostname.endsWith(".localhost") ||
      hostname.endsWith(".local") ||
      hostname.endsWith(".internal") ||
      hostname.endsWith(".corp")
    ) {
      return { valid: false, error: "عناوين النطاقات المحلية والداخلية محظورة لحماية الخادم (SSRF)" };
    }

    // 3. Reject private IP ranges
    const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const match = hostname.match(ipv4Regex);
    if (match) {
      const p1 = parseInt(match[1]);
      const p2 = parseInt(match[2]);
      // 10.0.0.0/8
      if (p1 === 10) return { valid: false, error: "عناوين IP الخاصة (10.0.0.0/8) محظورة" };
      // 172.16.0.0/12
      if (p1 === 172 && p2 >= 16 && p2 <= 31) return { valid: false, error: "عناوين IP الخاصة (172.16.0.0/12) محظورة" };
      // 192.168.0.0/16
      if (p1 === 192 && p2 === 168) return { valid: false, error: "عناوين IP الخاصة (192.168.0.0/16) محظورة" };
      // 169.254.0.0/16 (AWS metadata / Link-local)
      if (p1 === 169 && p2 === 254) return { valid: false, error: "عناوين السحابة الحساسة (169.254.169.254) محظورة" };
      // 127.0.0.0/8
      if (p1 === 127) return { valid: false, error: "عناوين الاسترجاع المحلي محظورة" };
      // 0.0.0.0/8
      if (p1 === 0) return { valid: false, error: "عناوين الشبكة الصفرية محظورة" };
    }

    // 4. Reject non-standard ports for public endpoints
    if (parsed.port && parsed.port !== "443") {
      return { valid: false, error: "يُسمح بالمنفذ القياسي 443 فقط لروابط HTTPS الخارجية" };
    }
  }

  const normalized = `${parsed.origin}${parsed.pathname.replace(/\/+$/, "")}`;
  return { valid: true, normalizedUrl: normalized };
}
