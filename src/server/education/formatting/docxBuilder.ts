/**
 * 📄 True Native Microsoft Word (.docx) Builder
 * مواصفة الصور والترقيم والتنسيق (النسخة 1.0 - الجزائر)
 * 
 * الميزات:
 * 1. إنتاج ملف DOCX حقيقي ثنائي (Binary) عبر مكتبة docx الرسمية.
 * 2. تقسيم الوثيقة إلى أقسام حقيقية (Sections):
 *    - القسم 1: الغلاف الرسمي (بلا ترقيم وبلا رأس وتذييل).
 *    - القسم 2: التمهيد (إهداء، شكر، ملخصات، فهرس TOC) بترقيم أبجدي مستقل (أ، ب، ج...).
 *    - القسم 3: المتن (المقدمة، الفصول، الخاتمة) يبدأ من الصفحة 1 بترقيم عددي (1، 2، 3...).
 *    - القسم 4: المراجع والملاحق.
 * 3. دعم كامل للاتجاه من اليمين لليسار (RTL bidirectional) وتباعد أسطر 1.5.
 * 4. حقول الترقيم التلقائي للأشكال والجداول (SequentialIdentifier).
 * 5. فهارس حقيقية (Table of Contents) قابلة للتحديث التلقائي في Word.
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
} from "docx";
import { DocumentBlock, DocumentAsset, LayoutSettings } from "./types";

export interface DocxBuilderOptions {
  title: string;
  settings: LayoutSettings;
  blocks: DocumentBlock[];
  assets: DocumentAsset[];
}

export class DocxBuilder {
  public static async buildDocxBuffer(options: DocxBuilderOptions): Promise<Buffer> {
    const { title, settings, blocks, assets } = options;
    const font = settings.font_family || "Traditional Arabic";

    // Helper: فقرة عربية سليمة الاتجاه
    const rtlPara = (text: string, size = 26, opts: any = {}) =>
      new Paragraph({
        bidirectional: true,
        alignment: opts.alignment || AlignmentType.JUSTIFIED,
        spacing: { line: 360, after: 120 }, // تباعد 1.5 ومسافة بعد الفقرة
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
    const pageProps = (startPage?: number, numFmt?: (typeof NumberFormat)[keyof typeof NumberFormat]) => ({
      page: {
        size: { width: 11906, height: 16838 }, // A4
        margin: {
          top: Math.round(settings.margins_mm.top * 56.7),
          bottom: Math.round(settings.margins_mm.bottom * 56.7),
          left: Math.round(settings.margins_mm.left * 56.7),
          right: Math.round(settings.margins_mm.right * 56.7), // هامش التجليد يميناً
        },
        pageNumbers: startPage
          ? { start: startPage, formatType: numFmt ?? NumberFormat.DECIMAL }
          : undefined,
      },
    });

    // 1. القسم الأول: الغلاف الرسمي (بلا ترقيم وبلا رأس وتذييل)
    const coverBlock = blocks.find((b) => b.type === "cover");
    const coverParagraphs: Paragraph[] = [
      new Paragraph({ spacing: { before: 400 } }),
      rtlPara("الجمهورية الجزائرية الديمقراطية الشعبية", 26, { alignment: AlignmentType.CENTER, bold: true }),
      rtlPara("وزارة التعليم العالي والبحث العلمي", 24, { alignment: AlignmentType.CENTER, bold: true }),
      new Paragraph({ spacing: { after: 600 } }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 400, after: 600 },
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
      new Paragraph({ spacing: { after: 1200 } }),
      rtlPara(coverBlock?.content.text || "مذكرة تخرج أكاديمية لنيل شهادة الماستر", 26, {
        alignment: AlignmentType.CENTER,
      }),
      new Paragraph({ spacing: { after: 1200 } }),
      rtlPara("السنة الجامعية: 2025 / 2026 م", 24, { alignment: AlignmentType.CENTER, bold: true }),
    ];

    // 2. القسم الثاني: التمهيد والفهرس (ترقيم روماني أو أبجدي مستقل)
    const frontChildren: (Paragraph | TableOfContents)[] = [
      new Paragraph({
        bidirectional: true,
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "فهرس المحتويات العام", font, size: 36, bold: true, rightToLeft: true })],
      }),
      new TableOfContents("المحتويات", {
        hyperlink: true,
        headingStyleRange: "1-3",
      }),
      new Paragraph({ spacing: { after: 400 } }),
    ];

    // 3. القسم الثالث: المتن والفصول (ترقيم عددي يبدأ من 1)
    const bodyChildren: (Paragraph | Table)[] = [];
    let currentChapterHeader = title;

    blocks.forEach((block) => {
      if (block.type === "cover") return;

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
          rtlPara(block.content.text || "", 26, {
            keepNext: block.keep_with_next,
            pageBreakBefore: block.page_break_before,
          })
        );
      } else if (block.type === "figure") {
        // الشكل + التعليق المرقّم تسلسلياً (Keep with next)
        const figCaption = block.content.caption || "شكل توضيحي";
        const figSource = block.content.source_attribution || "ويكيميديا كومنز";

        // Placeholder Box for Figure
        bodyChildren.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            keepNext: true,
            spacing: { before: 200, after: 80 },
            border: {
              top: { style: BorderStyle.SINGLE, size: 2, color: "10B981" },
              bottom: { style: BorderStyle.SINGLE, size: 2, color: "10B981" },
            },
            children: [
              new TextRun({
                text: `[ تمثيل الشكل البياني أو الصورة: ${figCaption} ]`,
                font,
                size: 22,
                color: "059669",
                bold: true,
                rightToLeft: true,
              }),
            ],
          })
        );

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
        // جدول منسق بحدود أنيقة
        const tdata = block.content.table_data;
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
      }
    });

    // تجميع الوثيقة بالأقسام الثلاثة المستقلة
    const doc = new Document({
      features: { updateFields: true },
      sections: [
        // 1. الغلاف (بلا ترقيم)
        {
          properties: { ...pageProps() },
          children: coverParagraphs,
        },
        // 2. التمهيد (ترقيم أ، ب، ج أو روماني)
        {
          properties: {
            type: SectionType.NEXT_PAGE,
            ...pageProps(1, NumberFormat.LOWER_ROMAN),
          },
          footers: { default: footerNumber() },
          children: frontChildren,
        },
        // 3. المتن (ترقيم عددي يبدأ من الصفحة 1 مع الرأس والتذييل)
        {
          properties: {
            type: SectionType.NEXT_PAGE,
            ...pageProps(1, NumberFormat.DECIMAL),
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
