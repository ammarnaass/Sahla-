import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureFormattingTables } from "@/server/education/formatting/dbMigration";
import { DocumentAsset } from "@/server/education/formatting/types";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    ensureFormattingTables();
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ error: "معرّف المستند مفقود" }, { status: 400 });
    }

    const body = await req.json();
    const { caption, file_url, alt_text, author, license_ack } = body;

    if (!file_url) {
      return NextResponse.json({ error: "رابط أو بيانات الملف مطلوبة (file_url)" }, { status: 400 });
    }

    const assetId = `a_usr_${Date.now()}`;
    const asset: DocumentAsset = {
      id: assetId,
      doc_id: id,
      kind: "user_upload",
      source: "user",
      license: license_ack ? "User Owned / Rights Confirmed" : "User Uploaded",
      author: author || "المستخدم / الباحث",
      file_url,
      width_px: 1200,
      height_px: 800,
      dpi: 300,
      alt_text: alt_text || caption || "صورة مرفوعة من قبل المستخدم",
      caption: caption || "صورة توضيحية من إعداد الباحث",
      source_attribution: "تصوير / إعداد شخصي للباحث",
      status: "selected",
      created_at: new Date().toISOString(),
    };

    db.prepare(`
      INSERT INTO document_assets (
        id, doc_id, kind, source, license, author, url, file_url,
        width_px, height_px, dpi, alt_text, caption, source_attribution,
        status, created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      asset.id,
      asset.doc_id,
      asset.kind,
      asset.source,
      asset.license,
      asset.author,
      null,
      asset.file_url || null,
      asset.width_px,
      asset.height_px,
      asset.dpi,
      asset.alt_text,
      asset.caption,
      asset.source_attribution,
      asset.status,
      asset.created_at
    );

    return NextResponse.json({
      success: true,
      asset,
      note: "تم رفع وتوثيق الصورة بنجاح مع إقرار الملكية الأكاديمية.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "تعذر رفع الصورة" },
      { status: 500 }
    );
  }
}
