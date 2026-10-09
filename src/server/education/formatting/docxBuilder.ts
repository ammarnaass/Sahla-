/**
 * 📄 True Native Microsoft Word (.docx) Builder
 * مواصفة الصور والترقيم والتنسيق للبحوث والمذكرات (النسخة 1.0 - الجزائر)
 *
 * الميزات:
 * 1. إنتاج ملف DOCX حقيقي ثنائي (Binary) عبر مكتبة docx الرسمية.
 * 2. تقسيم الوثيقة إلى أقسام حقيقية (Sections):
 *    - القسم 1: الغلاف الرسمي (بلا ترقيم وبلا رأس وتذييل).
 *    - القسم 2: التمهيد (إهداء، شكر، ملخصات، فهرس المحتويات TOC، قائمة الأشكال، قائمة الجداول) بترقيم مستقل.
 *    - القسم 3: المتن (المقدمة، الفصول، الخاتمة) يبدأ من الصفحة 1 بترقيم عددي (1، 2، 3...).
 * 3. صور حقيقية (ImageRun) مع التحجيم الذكي وحساب DPI وKeep-with-next مع التعليق.
 * 4. حقول الترقيم التلقائي للأشكال والجداول (SequentialIdentifier).
 * 5. فهارس حقيقية (Table of Contents) قابلة للتحديث التلقائي في Word.
 * 6. إطار زخرفي للصفحات (Page Borders) للبحوث المدرسية عند تفعيله.
 */

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Header,
  Footer,
  PageNumber,
  AlignmentType,
  SectionType,
  NumberFormat,
  TableOfContents,
  HeadingLevel,
  SequentialIdentifier,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  ImageRun,
} from "docx";
import { DocumentBlock, DocumentAsset, LayoutSettings, CoverTemplateData } from "./types";
import { CoverTemplates } from "./templates/coverTemplates";
import { ImageProcessor } from "./skills/imageProcessor";

export interface DocxBuilderOptions {
  title: string;
  settings: LayoutSettings;
  blocks: DocumentBlock[];
  assets: DocumentAsset[];
  coverData?: Partial<CoverTemplateData>;
  includeFiguresList?: boolean;
  includeTablesList?: boolean;
}

export class DocxBuilder {
  public static async buildDocxBuffer(options: DocxBuilderOptions): Promise<Buffer> {
    const {
      title,
      settings,
      blocks,
      assets,
      coverData,
      includeFiguresList = true,
      includeTablesList = true,
    } = options;

    const font = settings.font_family || "Traditional Arabic";
    const fontSizeHalfPts = Math.round((settings.font_size_pt || 14) * 2);
    const lineSpacing = Math.round((settings.line_spacing || 1.5) * 240); // 240 = single, 360 = 1.5

    // Helper: فقرة عربية سليمة الاتجاه
    const rtlPara = (text: string, size = fontSizeHalfPts, opts: any = {}) =>
      new Paragraph({
        bidirectional: true,
        alignment: opts.alignment || AlignmentType.JUSTIFIED,
        spacing: { line: lineSpacing, after: opts.spacingAfter ?? 120, before: opts.spacingBefore ?? 0 },
        keepNext: Boolean(opts.keepNext),
        pageBreakBefore: Boolean(opts.pageBreakBefore),
        children: [
          new TextRun({
            text,
            font,
            size,
            rightToLeft: true,
            bold: Boolean(opts.bold),
            italics: Boolean(opts.italics),
            color: opts.color || "111827",
          }),
        ],
      });

    // Helper: تذييل الصفحة برقم الصفحة في المنتصف
    const footerNumber = () =>
      new Footer({
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                children: [PageNumber.CURRENT],
                font,
                size: 22,
                color: "475569",
              }),
            ],
          }),
        ],
      });

    // Helper: رأس الصفحة بعنوان الفصل
    const headerTitle = (headerText: string) =>
      new Header({
        children: [
          new Paragraph({
            bidirectional: true,
            alignment: AlignmentType.RIGHT,
            border: {
              bottom: { style: BorderStyle.SINGLE, size: 4, color: "059669" },
            },
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: headerText,
                font,
                size: 20,
                color: "059669",
                bold: true,
                rightToLeft: true,
              }),
            ],
          }),
        ],
      });

    // إعدادات حجم وهوامش الصفحة A4
    const pageProps = (
      startPage?: number,
      numFmt?: (typeof NumberFormat)[keyof typeof NumberFormat],
      applyBorder = false
    ) => ({
      page: {
        size: { width: 11906, height: 16838 }, // A4
        margin: {
          top: Math.round((settings.margins_mm?.top || 25) * 56.7),
          bottom: Math.round((settings.margins_mm?.bottom || 25) * 56.7),
          left: Math.round((settings.margins_mm?.left || 20) * 56.7),
          right: Math.round((settings.margins_mm?.right || 30) * 56.7), // هامش التجليد يميناً
        },
        pageNumbers: startPage
          ? { start: startPage, formatType: numFmt ?? NumberFormat.DECIMAL }
          : undefined,
        borders:
          applyBorder && settings.decorative_frame
            ? {
                pageBorders: { offsetFrom: "page" as const },
                top: { style: BorderStyle.DOUBLE, size: 8, color: "047857" },
                bottom: { style: BorderStyle.DOUBLE, size: 8, color: "047857" },
                left: { style: BorderStyle.DOUBLE, size: 8, color: "047857" },
                right: { style: BorderStyle.DOUBLE, size: 8, color: "047857" },
              }
            : undefined,
      },
    });

    // 1. القسم الأول: الغلاف الرسمي (بلا ترقيم وبلا رأس وتذييل)
    const coverBlock = blocks.find((b) => b.type === "cover");
    let coverElements: (Paragraph | Table)[] = [];

    if (coverData) {
      coverElements = CoverTemplates.buildCoverElements(
        {
          template_type: coverData.template_type || "university_master",
          title: title || coverData.title || "عنوان البحث",
          institution_name: coverData.institution_name || "المؤسسة التعليمية",
          student_names: coverData.student_names || ["اسم الطالب"],
          supervisor_name: coverData.supervisor_name || "الأستاذ المشرف",
          academic_year: coverData.academic_year || "2025 / 2026 م",
          ...coverData,
        },
        font
      );
    } else {
      // الغلاف الافتراضي
      coverElements = [
        new Paragraph({ spacing: { before: 400 } }),
        rtlPara("الجمهورية الجزائرية الديمقراطية الشعبية", 26, { alignment: AlignmentType.CENTER, bold: true }),
        rtlPara("وزارة التعليم العالي والبحث العلمي", 24, { alignment: AlignmentType.CENTER, bold: true }),
        new Paragraph({ spacing: { after: 600 } }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 400, after: 600 },
          border: {
            top: { style: BorderStyle.SINGLE, size: 4, color: "059669" },
            bottom: { style: BorderStyle.SINGLE, size: 4, color: "059669" },
          },
          children: [
            new TextRun({
              text: title,
              font,
              size: 40,
              bold: true,
              rightToLeft: true,
              color: "064E3B",
            }),
          ],
        }),
        new Paragraph({ spacing: { after: 1000 } }),
        rtlPara(coverBlock?.content.text || "مذكرة تخرج أكاديمية لنيل شهادة الماستر", 26, {
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({ spacing: { after: 1200 } }),
        rtlPara("السنة الجامعية: 2025 / 2026 م", 24, { alignment: AlignmentType.CENTER, bold: true }),
      ];
    }

    // 2. القسم الثاني: التمهيد والفهارس (ترقيم روماني أو أبجدي مستقل)
    const hasFigures = blocks.some((b) => b.type === "figure");
    const hasTables = blocks.some((b) => b.type === "table");

    const frontChildren: (Paragraph | TableOfContents)[] = [
      new Paragraph({
        bidirectional: true,
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { before: 300, after: 200 },
        children: [new TextRun({ text: "فهرس المحتويات العام", font, size: 36, bold: true, rightToLeft: true })],
      }),
      new TableOfContents("المحتويات", {
        hyperlink: true,
        headingStyleRange: "1-3",
      }),
      new Paragraph({ spacing: { after: 400 } }),
    ];

    if (includeFiguresList && hasFigures) {
      frontChildren.push(
        new Paragraph({
          bidirectional: true,
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          pageBreakBefore: true,
          spacing: { before: 300, after: 200 },
          children: [new TextRun({ text: "قائمة الأشكال والمخططات", font, size: 34, bold: true, rightToLeft: true })],
        }),
        new TableOfContents("الأشكال", {
          hyperlink: true,
          captionLabel: "Figure",
        }),
        new Paragraph({ spacing: { after: 300 } })
      );
    }

    if (includeTablesList && hasTables) {
      frontChildren.push(
        new Paragraph({
          bidirectional: true,
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          pageBreakBefore: true,
          spacing: { before: 300, after: 200 },
          children: [new TextRun({ text: "قائمة الجداول الإحصائية", font, size: 34, bold: true, rightToLeft: true })],
        }),
        new TableOfContents("الجداول", {
          hyperlink: true,
          captionLabel: "Table",
        }),
        new Paragraph({ spacing: { after: 300 } })
      );
    }

    // 3. القسم الثالث: المتن والفصول (ترقيم عددي يبدأ من 1)
    const bodyChildren: (Paragraph | Table)[] = [];
    let currentChapterHeader = title;

    for (const block of blocks) {
      if (block.type === "cover") continue;

      if (block.type === "heading") {
        const lvl = block.content.level || 1;
        const headingMap = {
          1: HeadingLevel.HEADING_1,
          2: HeadingLevel.HEADING_2,
          3: HeadingLevel.HEADING_3,
          4: HeadingLevel.HEADING_4,
        };

        if (lvl === 1 && block.content.text) {
          currentChapterHeader = block.content.text;
        }

        bodyChildren.push(
          new Paragraph({
            bidirectional: true,
            heading: headingMap[lvl] || HeadingLevel.HEADING_1,
            keepNext: true,
            pageBreakBefore: lvl === 1 || block.page_break_before,
            spacing: { before: lvl === 1 ? 400 : 250, after: 150 },
            children: [
              new TextRun({
                text: block.content.text || "",
                font,
                size: lvl === 1 ? 36 : lvl === 2 ? 30 : 26,
                bold: true,
                rightToLeft: true,
                color: lvl === 1 ? "065F46" : "0F766E",
              }),
            ],
          })
        );
      } else if (block.type === "paragraph") {
        bodyChildren.push(
          rtlPara(block.content.text || "", fontSizeHalfPts, {
            keepNext: block.keep_with_next,
            pageBreakBefore: block.page_break_before,
            alignment: block.style?.alignment === "center" ? AlignmentType.CENTER : AlignmentType.JUSTIFIED,
            bold: block.style?.bold,
            italics: block.style?.italic,
          })
        );
      } else if (block.type === "figure") {
        const figCaption = block.content.caption || "شكل توضيحي";
        const figSource = block.content.source_attribution || "ويكيميديا كومنز";

        // Find associated asset
        const asset =
          assets.find((a) => a.id === block.content.asset_id) ||
          assets.find((a) => a.figure_number === block.content.figure_number) ||
          assets[0];

        try {
          if (asset && (asset.file_url || asset.url)) {
            const processed = await ImageProcessor.processAssetForDocx(
              asset,
              block.style?.size_ratio || "full"
            );

            bodyChildren.push(
              new Paragraph({
                alignment: AlignmentType.CENTER,
                keepNext: true,
                pageBreakBefore: block.page_break_before,
                spacing: { before: 200, after: 100 },
                children: [
                  new ImageRun({
                    type: (processed.type === "jpeg" || processed.type === "jpg") ? "jpg" : "png",
                    data: processed.buffer,
                    transformation: {
                      width: processed.renderWidthPx,
                      height: processed.renderHeightPx,
                    },
                  }),
                ],
              })
            );
          } else {
            // Visual fallback box if no file URL is ready
            bodyChildren.push(
              new Paragraph({
                alignment: AlignmentType.CENTER,
                keepNext: true,
                pageBreakBefore: block.page_break_before,
                spacing: { before: 200, after: 80 },
                border: {
                  top: { style: BorderStyle.SINGLE, size: 2, color: "10B981" },
                  bottom: { style: BorderStyle.SINGLE, size: 2, color: "10B981" },
                },
                children: [
                  new TextRun({
                    text: `[ شكل بياني: ${figCaption} ]`,
                    font,
                    size: 22,
                    color: "059669",
                    bold: true,
                    rightToLeft: true,
                  }),
                ],
              })
            );
          }
        } catch (imgErr: any) {
          console.warn("[DocxBuilder] Failed to embed image, falling back:", imgErr?.message);
          bodyChildren.push(
            new Paragraph({
              alignment: AlignmentType.CENTER,
              keepNext: true,
              children: [
                new TextRun({
                  text: `[ ${figCaption} ]`,
                  font,
                  size: 22,
                  color: "059669",
                  bold: true,
                  rightToLeft: true,
                }),
              ],
            })
          );
        }

        // Figure Caption with SEQ Figure
        bodyChildren.push(
          new Paragraph({
            bidirectional: true,
            alignment: AlignmentType.CENTER,
            keepNext: true,
            spacing: { after: 60 },
            children: [
              new TextRun({ text: "الشكل ", font, size: 24, bold: true, rightToLeft: true }),
              new SequentialIdentifier("Figure"),
              new TextRun({ text: `: ${figCaption}`, font, size: 24, rightToLeft: true }),
            ],
          })
        );

        // Source Attribution
        bodyChildren.push(
          rtlPara(`المصدر: ${figSource}`, 20, {
            alignment: AlignmentType.CENTER,
            color: "64748B",
            italics: true,
          })
        );
      } else if (block.type === "table" && block.content.table_data) {
        const tdata = block.content.table_data;
        const tableCaption = block.content.caption || "بيانات إحصائية";

        // Table Caption above table with SEQ Table
        bodyChildren.push(
          new Paragraph({
            bidirectional: true,
            alignment: AlignmentType.RIGHT,
            keepNext: true,
            pageBreakBefore: block.page_break_before,
            spacing: { before: 200, after: 80 },
            children: [
              new TextRun({ text: "الجدول ", font, size: 24, bold: true, rightToLeft: true }),
              new SequentialIdentifier("Table"),
              new TextRun({ text: `: ${tableCaption}`, font, size: 24, rightToLeft: true }),
            ],
          })
        );

        const rows: TableRow[] = [];

        // Header Row
        rows.push(
          new TableRow({
            tableHeader: true,
            cantSplit: true,
            children: tdata.headers.map(
              (h) =>
                new TableCell({
                  width: { size: Math.round(100 / tdata.headers.length), type: WidthType.PERCENTAGE },
                  children: [rtlPara(h, 22, { bold: true, alignment: AlignmentType.CENTER, color: "FFFFFF" })],
                  shading: { fill: "047857" },
                })
            ),
          })
        );

        // Data Rows
        tdata.rows.forEach((r, rIdx) => {
          rows.push(
            new TableRow({
              cantSplit: true,
              children: r.map(
                (cell) =>
                  new TableCell({
                    width: { size: Math.round(100 / r.length), type: WidthType.PERCENTAGE },
                    children: [rtlPara(String(cell), 22, { alignment: AlignmentType.CENTER })],
                    shading: rIdx % 2 === 1 ? { fill: "F8FAFC" } : undefined,
                  })
              ),
            })
          );
        });

        bodyChildren.push(
          new Table({
            rows,
            width: { size: 100, type: WidthType.PERCENTAGE },
          })
        );

        // Source Attribution below table
        if (block.content.source_attribution) {
          bodyChildren.push(
            rtlPara(`المصدر: ${block.content.source_attribution}`, 20, {
              alignment: AlignmentType.CENTER,
              color: "64748B",
              italics: true,
            })
          );
        }
      } else if (block.type === "list" && block.content.list_items) {
        block.content.list_items.forEach((item, itemIdx) => {
          const bullet = block.content.is_ordered ? `${itemIdx + 1}. ` : "• ";
          bodyChildren.push(
            rtlPara(`${bullet}${item}`, fontSizeHalfPts, {
              spacingAfter: 60,
              alignment: AlignmentType.RIGHT,
            })
          );
        });
      } else if (block.type === "quote" && block.content.text) {
        bodyChildren.push(
          new Paragraph({
            bidirectional: true,
            alignment: AlignmentType.RIGHT,
            spacing: { line: lineSpacing, before: 120, after: 120 },
            border: {
              right: { style: BorderStyle.SINGLE, size: 8, color: "059669" },
            },
            indent: { right: 360, left: 360 },
            children: [
              new TextRun({
                text: block.content.text,
                font,
                size: fontSizeHalfPts,
                italics: true,
                rightToLeft: true,
                color: "374151",
              }),
            ],
          })
        );
      } else if (block.type === "divider") {
        bodyChildren.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 200 },
            children: [
              new TextRun({
                text: "*  *  *",
                font,
                size: 24,
                color: "9CA3AF",
              }),
            ],
          })
        );
      }
    }

    // تجميع الوثيقة بالأقسام الثلاثة المستقلة
    const doc = new Document({
      features: { updateFields: true },
      sections: [
        // 1. الغلاف (بلا ترقيم)
        {
          properties: { ...pageProps(undefined, undefined, false) },
          children: coverElements,
        },
        // 2. التمهيد (ترقيم أ، ب، ج أو روماني مستقل)
        {
          properties: {
            type: SectionType.NEXT_PAGE,
            ...pageProps(1, NumberFormat.LOWER_ROMAN, false),
          },
          footers: { default: footerNumber() },
          children: frontChildren,
        },
        // 3. المتن (ترقيم عددي يبدأ من الصفحة 1 مع الرأس والتذييل وإطار زخرفي إن طُلب)
        {
          properties: {
            type: SectionType.NEXT_PAGE,
            ...pageProps(1, NumberFormat.DECIMAL, true),
          },
          headers: { default: headerTitle(currentChapterHeader) },
          footers: { default: footerNumber() },
          children: bodyChildren,
        },
      ],
    });

    return await Packer.toBuffer(doc);
  }
}
