import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, shopName, ownerName, wilayaCode, activityType, consentAgreed } = body;

    if (!phone || !shopName || !ownerName || !wilayaCode || !activityType) {
      return NextResponse.json(
        { success: false, error: "جميع حقول المحل مطلوبة" },
        { status: 400 }
      );
    }

    if (!consentAgreed) {
      return NextResponse.json(
        { success: false, error: "الموافقة على الشروط والخصوصية إلزامية" },
        { status: 400 }
      );
    }

    const newShop = {
      id: `shop_${Date.now()}`,
      name: shopName,
      ownerName,
      phone,
      wilayaCode,
      activityType,
      initialPointsGranted: 50, // PRD trial points
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      shop: newShop,
      message: "تم إنشاء ملف المحل وإضافة 50 نقطة ترحيبية مجانية",
    });
  } catch (err: unknown) {
    console.error("Shop creation error:", err);
    return NextResponse.json(
      { success: false, error: "فشل حفظ بيانات المحل" },
      { status: 500 }
    );
  }
}
