/**
 * 🏛️ Algerian Academic Cover Templates
 * قوالب الأغلفة الرسمية المعتمدة للبحوث والمذكرات في الجزائر
 *
 * القوالب المتاحة:
 * 1. PRIMARY: بحث مدرسي في الطور الابتدائي
 * 2. MIDDLE: بحث مدرسي في الطور المتوسط (التعليم المتوسط)
 * 3. SECONDARY: بحث مدرسي في الطور الثانوي (البكالوريا والشعب)
 * 4. UNIVERSITY_LICENSE: مذكرة تخرج لنيل شهادة الليسانس الأكاديمية
 * 5. UNIVERSITY_MASTER: مذكرة تخرج لنيل شهادة الماستر مع لجنة المناقشة
 * 6. VOCATIONAL: مذكرة تخرج لمراكز ومعاهد التكوين المهني
 */

import {
  Paragraph,
  TextRun,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
} from "docx";
import { CoverTemplateData } from "../types";

export class CoverTemplates {
  /**
   * إنشاء فقرات وجداول صفحة الغلاف الرسمي
   */
  public static buildCoverElements(
    data: CoverTemplateData,
    fontFamily = "Traditional Arabic"
  ): (Paragraph | Table)[] {
    const elements: (Paragraph | Table)[] = [];

    const defaultRepublic = "الجمهورية الجزائرية الديمقراطية الشعبية";
    const republic = data.republic_header || defaultRepublic;

    let defaultMinistry = "وزارة التعليم العالي والبحث العلمي";
    if (data.template_type === "primary" || data.template_type === "middle" || data.template_type === "secondary") {
      defaultMinistry = "وزارة التربية الوطنية";
    } else if (data.template_type === "vocational") {
      defaultMinistry = "وزارة التكوين والتعليم المهنيين";
    }
    const ministry = data.ministry_header || defaultMinistry;

    // Helper: سطر عربي منسق
    const rtlLine = (
      text: string,
      sizePt: number,
      opts: {
        bold?: boolean;
        color?: string;
        spacingBefore?: number;
        spacingAfter?: number;
        alignment?: (typeof AlignmentType)[keyof typeof AlignmentType];
      } = {}
    ) =>
      new Paragraph({
        bidirectional: true,
        alignment: opts.alignment || AlignmentType.CENTER,
        spacing: {
          before: opts.spacingBefore || 60,
          after: opts.spacingAfter || 60,
          line: 280,
        },
        children: [
          new TextRun({
            text,
            font: fontFamily,
            size: Math.round(sizePt * 2), // Half-points in docx
            bold: Boolean(opts.bold),
            color: opts.color || "111827",
            rightToLeft: true,
          }),
        ],
      });

    // 1. ترويسة الجمهورية والوزارة
    elements.push(rtlLine(republic, 14, { bold: true, spacingBefore: 120, spacingAfter: 40 }));
    elements.push(rtlLine(ministry, 13, { bold: true, spacingAfter: 120 }));

    // 2. ترويسة المؤسسة والكلية أو الشعبة
    if (data.institution_name) {
      elements.push(rtlLine(data.institution_name, 13, { bold: true }));
    }
    if (data.faculty_or_division) {
      elements.push(rtlLine(data.faculty_or_division, 12));
    }
    if (data.department_or_year) {
      elements.push(rtlLine(data.department_or_year, 12));
    }
    if (data.specialty) {
      elements.push(rtlLine(`تخصص: ${data.specialty}`, 12));
    }

    // مسافة فاصلة قبل عنوان البحث
    elements.push(new Paragraph({ spacing: { before: 500, after: 200 } }));

    // 3. تصنيف الوثيقة (مذكرة تخرج / بحث مدرسي)
    const docClass =
      data.doc_classification ||
      (data.template_type === "university_master"
        ? "مذكرة تخرج لنيل شهادة الماستر الأكاديمي"
        : data.template_type === "university_license"
        ? "مذكرة تخرج لنيل شهادة الليسانس"
        : data.template_type === "vocational"
        ? "مذكرة تخرج لنيل شهادة تقني سامي"
        : "بحث مدرسي فصلي");

    elements.push(
      rtlLine(docClass, 13, {
        bold: true,
        color: "047857",
        spacingAfter: 200,
      })
    );

    // 4. العنوان الرئيسي للبحث
    elements.push(
      new Paragraph({
        bidirectional: true,
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 200, line: 360 },
        border: {
          top: { style: BorderStyle.SINGLE, size: 6, color: "059669" },
          bottom: { style: BorderStyle.SINGLE, size: 6, color: "059669" },
        },
        children: [
          new TextRun({
            text: data.title || "عنوان البحث",
            font: fontFamily,
            size: 38, // 19pt
            bold: true,
            color: "064E3B",
            rightToLeft: true,
          }),
        ],
      })
    );

    if (data.subtitle) {
      elements.push(rtlLine(data.subtitle, 13, { color: "374151", spacingAfter: 300 }));
    }

    elements.push(new Paragraph({ spacing: { before: 400, after: 200 } }));

    // 5. قسم المشرف والطلبة (عمودان يميناً ويساراً)
    const students = data.student_names && data.student_names.length > 0 ? data.student_names : ["اسم الطالب(ة)"];
    const supervisor = data.supervisor_name || "الأستاذ المشرف";

    // ننشئ جدولاً خفياً بدون حدود لتوزيع المشرف والطلبة
    const noBorder = { style: BorderStyle.NONE, size: 0, color: "auto" };
    const borderNone = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

    const studentsCellChildren: Paragraph[] = [
      rtlLine("إعداد الطالب(ة):", 12, { bold: true, alignment: AlignmentType.RIGHT, color: "065F46" }),
      ...students.map((s) => rtlLine(s, 12, { alignment: AlignmentType.RIGHT, bold: false })),
    ];

    const supervisorCellChildren: Paragraph[] = [
      rtlLine("تحت إشراف الأستاذ:", 12, { bold: true, alignment: AlignmentType.LEFT, color: "065F46" }),
      rtlLine(supervisor, 12, { alignment: AlignmentType.LEFT, bold: false }),
    ];

    if (data.co_supervisor_name) {
      supervisorCellChildren.push(
        rtlLine(`المساعد: ${data.co_supervisor_name}`, 11, { alignment: AlignmentType.LEFT })
      );
    }

    const participantsTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: borderNone,
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              borders: borderNone,
              children: studentsCellChildren,
            }),
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              borders: borderNone,
              children: supervisorCellChildren,
            }),
          ],
        }),
      ],
    });

    elements.push(participantsTable);

    // 6. جدول لجنة المناقشة (خاص بمذكرات الماستر والأطروحات)
    if (data.template_type === "university_master" && data.jury_members && data.jury_members.length > 0) {
      elements.push(new Paragraph({ spacing: { before: 300, after: 100 } }));
      elements.push(rtlLine("أعضاء لجنة المناقشة:", 12, { bold: true, alignment: AlignmentType.RIGHT }));

      const juryRows: TableRow[] = [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 40, type: WidthType.PERCENTAGE },
              children: [rtlLine("الاسم واللقب", 11, { bold: true })],
              shading: { fill: "F3F4F6" },
            }),
            new TableCell({
              width: { size: 30, type: WidthType.PERCENTAGE },
              children: [rtlLine("الرتبة العلمية", 11, { bold: true })],
              shading: { fill: "F3F4F6" },
            }),
            new TableCell({
              width: { size: 30, type: WidthType.PERCENTAGE },
              children: [rtlLine("الصفة", 11, { bold: true })],
              shading: { fill: "F3F4F6" },
            }),
          ],
        }),
        ...data.jury_members.map(
          (m) =>
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 40, type: WidthType.PERCENTAGE },
                  children: [rtlLine(m.name, 11)],
                }),
                new TableCell({
                  width: { size: 30, type: WidthType.PERCENTAGE },
                  children: [rtlLine(m.title, 11)],
                }),
                new TableCell({
                  width: { size: 30, type: WidthType.PERCENTAGE },
                  children: [rtlLine(m.role, 11, { bold: true })],
                }),
              ],
            })
        ),
      ];

      elements.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: juryRows,
        })
      );
    }

    // 7. تذييل الغلاف: السنة الجامعية والولاية
    elements.push(new Paragraph({ spacing: { before: 500, after: 100 } }));
    const yearText =
      data.template_type === "primary" || data.template_type === "middle" || data.template_type === "secondary"
        ? `السنة الدراسية: ${data.academic_year || "2025 / 2026 م"}`
        : `السنة الجامعية: ${data.academic_year || "2025 / 2026 م"}`;

    elements.push(rtlLine(yearText, 12, { bold: true }));
    if (data.wilaya) {
      elements.push(rtlLine(`ولاية ${data.wilaya}`, 11));
    }

    return elements;
  }
}
