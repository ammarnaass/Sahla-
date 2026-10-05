import { NextResponse } from "next/server";
import { subscriptionService } from "@/server/services/subscriptionService";

export const dynamic = "force-dynamic";

export async function GET() {
  const plans = subscriptionService.getPlans();
  return NextResponse.json({ success: true, plans });
}
