import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureThesisStudioTables } from "@/server/education/thesis/dbMigration";
import { ThesisService } from "@/server/education/thesis/thesisService";
import { trackEvent } from "@/lib/analytics";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    ensureThesisStudioTables();
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ error: "معرّف المذكرة مفقود" }, { status: 400 });
    }

    const thesis = ThesisService.getThesis(id);
    if (!thesis) {
      return NextResponse.json({ error: "مشروع المذكرة غير موجود" }, { status: 404 });
    }

    const body = await req.json();
    const { filename, records, columns } = body;

    if (!Array.isArray(records) || records.length === 0) {
      return NextResponse.json({ error: "يرجى تقديم مصفوفة بيانات صالحة (records)" }, { status: 400 });
    }

    const datasetId = `ds_${id}_${Date.now()}`;
    const detectedColumns = columns || (records[0] ? Object.keys(records[0]) : []);

    db.prepare(`
      INSERT INTO thesis_datasets (
        id, thesis_id, filename, file_size, row_count, column_count, schema_json, uploaded_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `).run(
      datasetId,
      id,
      filename || "dataset.csv",
      JSON.stringify(records).length,
      records.length,
      detectedColumns.length,
      JSON.stringify({ columns: detectedColumns, sample: records.slice(0, 3) })
    );

    // Update thesis has_dataset flag
    db.prepare(`UPDATE theses SET has_dataset = 1, dataset_filename = ? WHERE id = ?`).run(
      filename || "dataset.csv",
      id
    );

    trackEvent("thesis_dataset_uploaded", {
      thesisId: id,
      datasetId,
      rowCount: records.length,
    });

    return NextResponse.json({
      success: true,
      dataset_id: datasetId,
      row_count: records.length,
      columns: detectedColumns,
      note: `تم رفع وتدقيق مجموعة البيانات الميدانية (${records.length} سطراً). يمكنك تشغيل التحليل الإحصائي الآن.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "تعذر حفظ مجموعة البيانات" },
      { status: 500 }
    );
  }
}
