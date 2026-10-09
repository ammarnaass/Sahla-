/**
 * 🛡️ Image Validators (I01-I10) & Layout Validators (F01-F14)
 * مواصفة الصور والترقيم والتنسيق (النسخة 1.0 - الجزائر)
 */

import { DocumentAsset, DocumentBlock, LayoutSettings, LayoutIssue } from "../types";

export class LayoutValidators {
  /**
   * تشغيل الفحص الكامل للصور (I01 إلى I10)
   */
  public static validateImages(
    assets: DocumentAsset[],
    blocks: DocumentBlock[]
  ): LayoutIssue[] {
    const issues: LayoutIssue[] = [];
    const seenUrls = new Set<string>();
    const allText = blocks.map((b) => b.content.text || "").join(" ");

    assets.forEach((asset, idx) => {
      // I01: دقة الصورة كافية للحجم المطبوع
      if (asset.dpi < 150) {
        issues.push({
          id: `iss_i01_${asset.id}`,
          doc_id: asset.doc_id,
          code: "I01",
          severity: "high",
          location: `الشكل رقم (${asset.figure_number || idx + 1})`,
          message: `دقة الصورة (${asset.dpi} DPI) أقل من الحد الأدنى للطباعة الأكاديمية (150 DPI).`,
          suggestion: "استبدال الصورة بنسخة ذات دقة أعلى 300 DPI أو تصغير حجمها الطباعي.",
          created_at: new Date().toISOString(),
        });
      }

      // I02: الترخيص معروف والإسناد مكتمل
      if (!asset.license || asset.license.toLowerCase().includes("unknown") || !asset.author) {
        issues.push({
          id: `iss_i02_${asset.id}`,
          doc_id: asset.doc_id,
          code: "I02",
          severity: "critical",
          location: `الشكل رقم (${asset.figure_number || idx + 1})`,
          message: "ترخيص الصورة غير معروف أو اسم المؤلف غير محدد.",
          suggestion: "استبدال الصورة بمصدر حر الترخيص معتمد من ويكيميديا كومنز أو رسمها بالكود.",
          created_at: new Date().toISOString(),
        });
      }

      // I03: لكل صورة تعليق ونص بديل
      if (!asset.caption || !asset.alt_text) {
        issues.push({
          id: `iss_i03_${asset.id}`,
          doc_id: asset.doc_id,
          code: "I03",
          severity: "high",
          location: `الشكل رقم (${asset.figure_number || idx + 1})`,
          message: "الصورة تفتقر للتعليق العلمي الرسمي أو النص البديل (Alt text).",
          suggestion: "إضافة تعليق توضيحي دقيق أسفل الشكل مع مصدره.",
          created_at: new Date().toISOString(),
        });
      }

      // I04: كل شكل مُشار إليه في المتن
      const figPattern = new RegExp(`الشكل\\s*\\(?${asset.figure_number || idx + 1}\\)?`);
      if (!figPattern.test(allText)) {
        issues.push({
          id: `iss_i04_${asset.id}`,
          doc_id: asset.doc_id,
          code: "I04",
          severity: "medium",
          location: `الشكل رقم (${asset.figure_number || idx + 1})`,
          message: `لا توجد إحالة صريحة في المتن للشكل رقم (${asset.figure_number || idx + 1}).`,
          suggestion: `إضافة إحالة في الفقرة المناسبة: "كما يوضح الشكل (${asset.figure_number || idx + 1})".`,
          created_at: new Date().toISOString(),
        });
      }

      // I06: عدم تكرار الصورة نفسها
      if (asset.url && seenUrls.has(asset.url)) {
        issues.push({
          id: `iss_i06_${asset.id}`,
          doc_id: asset.doc_id,
          code: "I06",
          severity: "medium",
          location: `الشكل رقم (${asset.figure_number || idx + 1})`,
          message: "تم تكرار نفس الصورة في أكثر من موضع بالبحث.",
          suggestion: "استبدال الصورة المتكررة بمخطط أو وثيقة مكملة.",
          created_at: new Date().toISOString(),
        });
      }
      if (asset.url) seenUrls.add(asset.url);
    });

    return issues;
  }

  /**
   * تشغيل الفحص الكامل للتنسيق والترقيم (F01 إلى F14)
   */
  public static validateLayout(
    blocks: DocumentBlock[],
    settings: LayoutSettings
  ): LayoutIssue[] {
    const issues: LayoutIssue[] = [];
    const docId = settings.doc_id;

    // F01: الغلاف بلا ترقيم
    const coverBlock = blocks.find((b) => b.type === "cover");
    if (!coverBlock) {
      issues.push({
        id: `iss_f01_${docId}`,
        doc_id: docId,
        code: "F01",
        severity: "high",
        location: "صفحة الغلاف",
        message: "لم يتم تحديد كتلة الغلاف الرسمي للوثيقة.",
        suggestion: "إنشاء غلاف رسمي بالترويسة المعتمدة للجمهورية والجامعة/المدرسة.",
        created_at: new Date().toISOString(),
      });
    }

    // F04: تسلسل العناوين
    let lastLevel = 0;
    blocks
      .filter((b) => b.type === "heading" && b.content.level)
      .forEach((b) => {
        const lvl = b.content.level || 1;
        if (lastLevel > 0 && lvl > lastLevel + 1) {
          issues.push({
            id: `iss_f04_${b.id}`,
            doc_id: docId,
            code: "F04",
            severity: "medium",
            location: `العنوان: "${b.content.text?.substring(0, 30)}..."`,
            message: `قفز في تسلسل العناوين من المستوى (${lastLevel}) إلى المستوى (${lvl}).`,
            suggestion: `تعديل مستوى العنوان ليكون فرعاً متدرجاً (المستوى ${lastLevel + 1}).`,
            created_at: new Date().toISOString(),
          });
        }
        lastLevel = lvl;
      });

    // F06: لا عنوان يتيم أسفل الصفحة (Keep with next)
    blocks
      .filter((b) => b.type === "heading")
      .forEach((b) => {
        if (!b.keep_with_next) {
          issues.push({
            id: `iss_f06_${b.id}`,
            doc_id: docId,
            code: "F06",
            severity: "high",
            location: `العنوان: "${b.content.text?.substring(0, 30)}..."`,
            message: "العنوان غير محمي بخاصية التلازم مع الفقرة الموالية (Keep with next).",
            suggestion: "تفعيل خاصية keep_with_next لمنع انفصال العنوان في أسفل الصفحة.",
            created_at: new Date().toISOString(),
          });
        }
      });

    // F07: الصورة وتعليقها في الصفحة نفسها (Keep with next)
    blocks
      .filter((b) => b.type === "figure")
      .forEach((b) => {
        if (!b.keep_with_next) {
          issues.push({
            id: `iss_f07_${b.id}`,
            doc_id: docId,
            code: "F07",
            severity: "high",
            location: `الشكل رقم (${b.content.figure_number || 1})`,
            message: "الشكل غير مقترن بتعليقه في نفس الصفحة.",
            suggestion: "تثبيت خاصية Keep with next على عنصر الصورة والتعليق.",
            created_at: new Date().toISOString(),
          });
        }
      });

    // F09: عدم وجود صفحات فارغة بسبب فواصل زائدة
    for (let i = 0; i < blocks.length - 1; i++) {
      if (blocks[i].page_break_before && blocks[i + 1].page_break_before) {
        issues.push({
          id: `iss_f09_${blocks[i].id}`,
          doc_id: docId,
          code: "F09",
          severity: "medium",
          location: `الكتلة رقم ${blocks[i].order_num}`,
          message: "تتالي فاصلين متتابعين للصفحات يسبب صفحة فارغة غير مرغوبة.",
          suggestion: "حذف الفاصل الزائد تلقائياً لضبط تسلسل الصفحات.",
          created_at: new Date().toISOString(),
        });
      }
    }

    return issues;
  }
}
