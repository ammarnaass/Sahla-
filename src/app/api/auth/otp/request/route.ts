import { NextRequest, NextResponse } from "next/server";
import { normalizeAlgerianPhone, generateOTP, OTP_CONFIG } from "@/lib/auth";

// In-memory rate-limiter & request tracker
interface RateLimitRecord {
  count: number;
  resetAt: number;
}
const phoneRateLimits = new Map<string, RateLimitRecord>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, channel = "SMS" } = body;

    if (!phone) {
      return NextResponse.json(
        { success: false, error: "رقم الهاتف مطلوب" },
        { status: 400 }
      );
    }

    const validation = normalizeAlgerianPhone(phone);
    if (!validation.valid || !validation.raw) {
      return NextResponse.json(
        { success: false, error: validation.error || "رقم هاتف جزائري غير صالح" },
        { status: 400 }
      );
    }

    const normalized = validation.raw;
    const now = Date.now();

    // Check rate limit: 5 requests per hour
    const rateRecord = phoneRateLimits.get(normalized);
    if (rateRecord && now < rateRecord.resetAt) {
      if (rateRecord.count >= OTP_CONFIG.MAX_REQUESTS_PER_HOUR) {
        const remainingMinutes = Math.ceil((rateRecord.resetAt - now) / (60 * 1000));
        return NextResponse.json(
          {
            success: false,
            error: `تجاوزت الحد المسموح من طلبات OTP. يرجى الانتظار ${remainingMinutes} دقيقة.`,
          },
          { status: 429 }
        );
      }
      rateRecord.count += 1;
    } else {
      phoneRateLimits.set(normalized, {
        count: 1,
        resetAt: now + 60 * 60 * 1000,
      });
    }

    // Generate 6-digit OTP
    const code = generateOTP();

    // In a production environment with SMS gateway credentials:
    // await sendSmsGateway(normalized, `رمز التحقق الخاص بك في سهلة: ${code}`);
    console.log(`[Sahla Auth API] OTP generated for ${normalized}: ${code} (Channel: ${channel})`);

    return NextResponse.json({
      success: true,
      phone: normalized,
      formattedPhone: validation.formatted,
      carrier: validation.carrier,
      channel,
      expiresInSeconds: OTP_CONFIG.EXPIRY_MINUTES * 60,
      // For development / demo ease
      demoCode: code,
    });
  } catch (err: unknown) {
    console.error("OTP Request error:", err);
    return NextResponse.json(
      { success: false, error: "حدث خطأ غير متوقع في الخادم" },
      { status: 500 }
    );
  }
}
