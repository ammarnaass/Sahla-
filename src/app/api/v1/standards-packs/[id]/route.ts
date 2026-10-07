import { NextRequest, NextResponse } from "next/server";
import { StandardsPackRepository } from "@/server/education/guidance/standardsPacks";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const pack = StandardsPackRepository.getPackById(id);

    if (!pack) {
      return NextResponse.json(
        { error: { code: "pack_not_found", message: `حزمة المعايير غير موجودة: ${id}` } },
        { status: 404 }
      );
    }

    return NextResponse.json(pack);
  } catch (err: any) {
    return NextResponse.json(
      { error: { code: "pack_fetch_failed", message: err?.message } },
      { status: 500 }
    );
  }
}
