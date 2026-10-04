import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { completed, currentStep, selectedServices, checklist } = body;

    // Persist or return updated state
    return NextResponse.json({
      success: true,
      onboardingState: {
        completed: Boolean(completed),
        currentStep: currentStep || 1,
        selectedServices: selectedServices || [],
        checklist: checklist || {},
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (err: unknown) {
    console.error("Onboarding API error:", err);
    return NextResponse.json(
      { success: false, error: "فشل تحديث حالة الإعداد" },
      { status: 500 }
    );
  }
}
