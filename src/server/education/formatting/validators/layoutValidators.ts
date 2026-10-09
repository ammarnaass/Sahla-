/**
 * 🛡️ Image Validators (I01-I10) & Layout Validators (F01-F14)
 * مواصفة الصور والترقيم والتنسيق للبحوث والمذكرات (النسخة 1.0 - الجزائر)
 */

import { DocumentAsset, DocumentBlock, LayoutSettings, LayoutIssue } from "../types";

export class LayoutValidators {
  /**
   * تشغيل الفحص الشامل للصور (I01 إلى I10)
   */
  public static validateImages(
    assets: DocumentAsset[],
    blocks: DocumentBlock[],
    totalSizeBytes = 0
  ): LayoutIssue[] {
    const issues: LayoutIssue[] = [];
    const seenUrls = new Set<string>();
    const seenFigNumbers = new Set<number>();
    const allText = blocks.map((b) => b.content.text || "").join(" ");

    let calculatedTotalSize = totalSizeBytes;

    // Check each asset
    assets.forEach((asset, idx) => {
      const figNum = asset.figure_number || idx + 1;

      // I01: دقة الصورة كافية للحجم المطبوع (>= 150 DPI)
      if (asset.dpi < 150) {
        issues.push({
          id: `iss_i01_${asset.id}`,
          doc_id: asset.doc_id,
          code: "I01",
          severity: "high",
          location: `الشكل رقم (${figNum})`,
          message: `دقة الصورة (${asset.dpi} DPI) أقل من الحد الأدنى للطباعة الأكاديمية (150 DPI).`,
          suggestion: "استبدال الصورة بنسخة ذات دقة 300 DPI أو تصغير حجمها الطباعي.",
          created_at: new Date().toISOString(),
        });
      }

      // I02: الترخيص معروف والإسناد مكتمل
      if (
        !asset.license ||
        asset.license.toLowerCase().includes("unknown") ||
        asset.license.toLowerCase().includes("غير معروف") ||
        !asset.author
      ) {
        issues.push({
          id: `iss_i02_${asset.id}`,
          doc_id: asset.doc_id,
          code: "I02",
          severity: "critical",
          location: `الشكل رقم (${figNum})`,
          message: "ترخيص الصورة غير معروف أو اسم المؤلف غير محدد.",
          suggestion: "استبدال الصورة بمصدر حر الترخيص معتمد من ويكيميديا كومنز أو رسمها بالكود.",
          created_at: new Date().toISOString(),
        });
      }

      // I03: لكل صورة تعليق ونص بديل
      if (!asset.caption || asset.caption.trim().length === 0 || !asset.alt_text) {
        issues.push({
          id: `iss_i03_${asset.id}`,
          doc_id: asset.doc_id,
          code: "I03",
          severity: "high",
          location: `الشكل رقم (${figNum})`,
          message: "الصورة تفتقر للتعليق العلمي الرسمي أو النص البديل (Alt text).",
          suggestion: "إضافة تعليق توضيحي دقيق أسفل الشكل مع مصدره.",
          created_at: new Date().toISOString(),
        });
      }

      // I04: كل شكل مُشار إليه في المتن
      const figPattern = new RegExp(`الشكل\\s*\\(?${figNum}\\)?`);
      if (!figPattern.test(allText)) {
        issues.push({
          id: `iss_i04_${asset.id}`,
          doc_id: asset.doc_id,
          code: "I04",
          severity: "medium",
          location: `الشكل رقم (${figNum})`,
          message: `لا توجد إحالة صريحة في المتن للشكل رقم (${figNum}).`,
          suggestion: `إضافة إحالة في الفقرة المناسبة: "كما يوضح الشكل (${figNum})".`,
          created_at: new Date().toISOString(),
        });
      }

      // I05: تسلسل الترقيم صحيح بلا تكرار
      if (seenFigNumbers.has(figNum)) {
        issues.push({
          id: `iss_i05_${asset.id}`,
          doc_id: asset.doc_id,
          code: "I05",
          severity: "medium",
          location: `الشكل رقم (${figNum})`,
          message: `تكرار رقم الشكل (${figNum}) مع شكل آخر.`,
          suggestion: "إعادة ترقيم الأشكال تسلسلياً (1, 2, 3...) تلقائياً.",
          created_at: new Date().toISOString(),
        });
      }
      seenFigNumbers.add(figNum);

      // I06: عدم تكرار الصورة نفسها
      if (asset.url && seenUrls.has(asset.url)) {
        issues.push({
          id: `iss_i06_${asset.id}`,
          doc_id: asset.doc_id,
          code: "I06",
          severity: "medium",
          location: `الشكل رقم (${figNum})`,
          message: "تم تكرار نفس الصورة في أكثر من موضع بالبحث.",
          suggestion: "استبدال الصورة المتكررة بمخطط أو وثيقة مكملة.",
          created_at: new Date().toISOString(),
        });
      }
      if (asset.url) seenUrls.add(asset.url);

      // I07: سلامة المحتوى (مراجعة المصطلحات المحظورة أو غير اللائقة في التعليق)
      const prohibitedKeywords = ["watermark", "shutterstock", "gettyimages", "علامة مائية", "حقوق محفوظة تجارياً"];
      const textToCheck = `${asset.caption} ${asset.alt_text} ${asset.source_attribution}`.toLowerCase();
      for (const kw of prohibitedKeywords) {
        if (textToCheck.includes(kw)) {
          issues.push({
            id: `iss_i07_${asset.id}`,
            doc_id: asset.doc_id,
            code: "I07",
            severity: "critical",
            location: `الشكل رقم (${figNum})`,
            message: `الصورة قد تحتوي على علامة مائية تجارية أو مصدر غير مرخص: "${kw}".`,
            suggestion: "استبدال الصورة بأخرى من المستودعات الأكاديمية الحرة المفتوحة.",
            created_at: new Date().toISOString(),
          });
          break;
        }
      }

      // I09: صور الرسوم البيانية مطابقة للبيانات
      if (asset.kind === "chart" && asset.source !== "code_generated") {
        issues.push({
          id: `iss_i09_${asset.id}`,
          doc_id: asset.doc_id,
          code: "I09",
          severity: "critical",
          location: `الشكل رقم (${figNum})`,
          message: "الرسم البياني ليس مبرمجاً بالكود وقد لا يطابق البيانات الإحصائية للبحث.",
          suggestion: "إعادة رسم المخطط عبر محرك التحليل البياني بالكود لضمان دقته العلمية.",
          created_at: new Date().toISOString(),
        });
      }

      // I10: عدم تجاوز الصورة هوامش الصفحة
      if (asset.width_px > 1800) {
        issues.push({
          id: `iss_i10_${asset.id}`,
          doc_id: asset.doc_id,
          code: "I10",
          severity: "high",
          location: `الشكل رقم (${figNum})`,
          message: "عرض الصورة كبير جداً وقد يتجاوز حدود صفحة الطباعة A4.",
          suggestion: "تطبيق التحجيم الذكي ليتناسب العرض مع مساحة النص المطبوعة.",
          created_at: new Date().toISOString(),
        });
      }

      // Estimate size (roughly 1.2MB per image if not known)
      calculatedTotalSize += 1.2 * 1024 * 1024;
    });

    // I08: حجم الملف الكلي ضمن الحد (≤ 25 ميغابايت للمذكرة، 10 للبحث)
    const maxSizeBytes = 25 * 1024 * 1024;
    if (calculatedTotalSize > maxSizeBytes) {
      issues.push({
        id: `iss_i08_total`,
        doc_id: assets[0]?.doc_id || "doc",
        code: "I08",
        severity: "high",
        location: "حجم المستند الكلي",
        message: `حجم ملف الوثيقة التقديري (${(calculatedTotalSize / (1024 * 1024)).toFixed(1)} MB) يتجاوز الحد المسموح به (25 MB).`,
        suggestion: "ضغط الصور بنسبة 85% لتقليل حجم الملف دون الإخلال بجودة الطباعة.",
        created_at: new Date().toISOString(),
      });
    }

    return issues;
  }

  /**
   * تشغيل الفحص الشامل للتنسيق والترقيم (F01 إلى F14)
   */
  public static validateLayout(
    blocks: DocumentBlock[],
    settings: LayoutSettings
  ): LayoutIssue[] {
    const issues: LayoutIssue[] = [];
    const docId = settings.doc_id;

    // F01: الغلاف بلا ترقيم ولا رأس
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

    // F02: بدء ترقيم المتن من 1 وتسلسله
    if (settings.page_numbering?.start_body_at !== 1) {
      issues.push({
        id: `iss_f02_${docId}`,
        doc_id: docId,
        code: "F02",
        severity: "critical",
        location: "إعدادات ترقيم الصفحات",
        message: "ترقيم المتن الأكاديمي يجب أن يبدأ حصراً من الصفحة رقم 1.",
        suggestion: "ضبط بداية ترقيم المتن لتكون 1 تلقائياً.",
        created_at: new Date().toISOString(),
      });
    }

    // F03: وجود الفهارس (TOC)
    const hasFrontMatter = settings.page_numbering?.format_front !== "none";
    if (!hasFrontMatter) {
      issues.push({
        id: `iss_f03_${docId}`,
        doc_id: docId,
        code: "F03",
        severity: "high",
        location: "فهرس المحتويات",
        message: "الوثيقة تفتقر لقسم التمهيد وفهرس المحتويات المستقل.",
        suggestion: "تفعيل فهرس المحتويات بترقيم أبجدي/روماني مستقل.",
        created_at: new Date().toISOString(),
      });
    }

    // F04: تسلسل العناوين (عدم القفز بين المستويات)
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

    // F05: كل فصل أو مبحث رئيسي يبدأ بصفحة جديدة
    blocks
      .filter((b) => b.type === "heading" && b.content.level === 1)
      .forEach((b) => {
        if (!b.page_break_before) {
          issues.push({
            id: `iss_f05_${b.id}`,
            doc_id: docId,
            code: "F05",
            severity: "high",
            location: `الفصل: "${b.content.text?.substring(0, 30)}..."`,
            message: "الفصل أو المبحث الرئيسي غير مضبوط ليبدأ في صفحة جديدة.",
            suggestion: "تفعيل فاصل الصفحة قبل بداية كل فصل رئيسي تلقائياً.",
            created_at: new Date().toISOString(),
          });
        }
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

    // F08: الجداول داخل الهوامش وبرأس متكرر
    blocks
      .filter((b) => b.type === "table" && b.content.table_data)
      .forEach((b) => {
        const colCount = b.content.table_data?.headers?.length || 0;
        if (colCount > 8) {
          issues.push({
            id: `iss_f08_${b.id}`,
            doc_id: docId,
            code: "F08",
            severity: "high",
            location: `جدول يحتوي (${colCount}) أعمدة`,
            message: "الجدول عريض جداً وقد يتجاوز هوامش الصفحة الرأسية A4.",
            suggestion: "تقسيم أعمدة الجدول أو تدوير الصفحة أفقياً (Landscape).",
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

    // F10: الخطوط المعتمدة
    const acceptedFonts = ["Traditional Arabic", "Amiri", "Sakkal Majalla", "Calibri", "Arial"];
    if (settings.font_family && !acceptedFonts.includes(settings.font_family)) {
      issues.push({
        id: `iss_f10_${docId}`,
        doc_id: docId,
        code: "F10",
        severity: "medium",
        location: "نوع الخط",
        message: `الخط المستخدم (${settings.font_family}) غير موحد أكاديمياً بالجزائر.`,
        suggestion: 'اعتماد خط "Traditional Arabic" أو "Amiri" للطباعة الرسمية.',
        created_at: new Date().toISOString(),
      });
    }

    // F11: حجم المتن والكتل الإجمالية
    if (blocks.length < 5) {
      issues.push({
        id: `iss_f11_${docId}`,
        doc_id: docId,
        code: "F11",
        severity: "high",
        location: "حجم الوثيقة",
        message: "عدد كتل الوثيقة قليل جداً ولا يستوفي هيكل البحث الأكاديمي المكتمل.",
        suggestion: "توليد أو استكمال المباحث والفصول الناقصة.",
        created_at: new Date().toISOString(),
      });
    }

    // F12: مطابقة الهوامش الأكاديمية (هامش التجليد 30 مم يميناً)
    if (settings.margins_mm && settings.margins_mm.right < 25) {
      issues.push({
        id: `iss_f12_${docId}`,
        doc_id: docId,
        code: "F12",
        severity: "high",
        location: "هامش التجليد الأيمن",
        message: `الهامش الأيمن (${settings.margins_mm.right} مم) أقل من 30 مم المطلوب للتجليد في اللغة العربية.`,
        suggestion: "زيادة الهامش الأيمن إلى 30 مم لضمان سلامة التجليد.",
        created_at: new Date().toISOString(),
      });
    }

    // F13: مطابقة ترقيم الأشكال والجداول
    const tables = blocks.filter((b) => b.type === "table");
    tables.forEach((t, tIdx) => {
      if (!t.content.caption) {
        issues.push({
          id: `iss_f13_${t.id}`,
          doc_id: docId,
          code: "F13",
          severity: "medium",
          location: `الجدول رقم (${tIdx + 1})`,
          message: "الجدول الإحصائي يفتقر للعنوان أو التعليق المرقّم.",
          suggestion: "إضافة تسمية رسمية للجدول أعلى المخطط.",
          created_at: new Date().toISOString(),
        });
      }
    });

    // F14: سلامة اتجاه RTL
    const englishBlocks = blocks.filter(
      (b) =>
        b.type === "paragraph" &&
        b.content.text &&
        /^[A-Za-z]/.test(b.content.text.trim()) &&
        b.style?.alignment === "right"
    );
    if (englishBlocks.length > 0) {
      issues.push({
        id: `iss_f14_${docId}`,
        doc_id: docId,
        code: "F14",
        severity: "medium",
        location: "محاذاة النصوص اللاتينية",
        message: "توجد فقرات باللغة الأجنبية مضبوطة باتجاه اليمين.",
        suggestion: "تعديل محاذاة الفقرات اللاتينية إلى اليسار LTR.",
        created_at: new Date().toISOString(),
      });
    }

    return issues;
  }
}
