/**
 * 🎓 Sahla Algerian Educational Research & Thesis HTML/Word Design Engine
 * محرك تصميم وتوليد ملفات HTML و Word الرسمية للبحوث المدرسية ومذكرات التخرج الجزائريّة
 * 
 * الميزات:
 * 1. صفحة غلاف جزائرية رسمية بمعايير وزارة التربية الوطنية ووزارة التعليم العالي (إطار زمردي مزدوج، شعار الجمهورية).
 * 2. فهرس وخطة عمل تفصيلية لجميع المحاور المعتمدة مع ترقيم الصفحات ومحاذاة أكاديمية.
 * 3. متن دراسي وأكاديمي مفصل لكل محور من المحاور المقررة مع شواهد ووقائع وتواريخ جزائرية موثقة.
 * 4. توافق تام مع Microsoft Word (.doc) عبر XML Namespaces (w:WordDocument) و @page Section1 A4.
 * 5. تصميم متجاوب للطباعة المباشرة A4 مع ترويسات وتذييلات وهوامش 20 مم.
 */

export interface ResearchHtmlSection {
  id?: string;
  heading: string;
  content: string;
  paragraphs?: string[];
  highlightBox?: string;
}

export interface ResearchHtmlOptions {
  topic: string;
  title?: string;
  docKind?: "RESEARCH" | "THESIS" | "SUMMARY" | "PEDAGOGIC";
  level?: string;
  grade?: string;
  subject?: string;
  subjectName?: string;
  pageCount?: number;
  styleLevel?: "SIMPLE" | "MODERATE" | "ADVANCED";
  coverTemplate?: "OFFICIAL" | "CLASSIC" | "MODERN";
  language?: "ar" | "fr" | "en";
  studentName?: string;
  schoolName?: string;
  directorate?: string;
  teacherName?: string;
  university?: string;
  faculty?: string;
  specialty?: string;
  teacherRequirements?: string;
  outline: string[];
  sections: ResearchHtmlSection[];
  references?: string[];
  reviewQuestions?: string[];
  year?: string;
  methodologySummary?: string;
  watermark?: string;
}

export function renderResearchHtmlDocument(options: ResearchHtmlOptions): string {
  const {
    topic,
    title,
    docKind = "RESEARCH",
    level = "MIDDLE",
    grade = "4AM",
    subjectName = "التاريخ والجغرافيا",
    pageCount = 10,
    language = "ar",
    studentName = "تلميذ المؤسسة",
    schoolName = "المؤسسة التعليمية الجزائرية",
    directorate = "مديرية التربية لولاية الجزائر (16)",
    teacherName = "الأستاذ المشرف",
    university = "الجامعة الجزائرية",
    faculty = "",
    specialty = "",
    teacherRequirements = "",
    outline = [],
    sections = [],
    references = [],
    reviewQuestions = [],
    year = "2025 / 2026 م",
    methodologySummary,
    watermark,
  } = options;

  const isThesis = docKind === "THESIS";
  const isFrench = language === "fr";
  const isEnglish = language === "en";
  const isLtr = isFrench || isEnglish;

  const docPrefix = isThesis
    ? "مذكرة تخرج"
    : docKind === "PEDAGOGIC"
    ? "مذكرة بيداغوجية"
    : docKind === "SUMMARY"
    ? "ملخص درس"
    : "بحث مدرسي";

  const fullDocTitle = title || `${docPrefix}: ${topic}`;

  // Headers
  const countryHeader = isFrench
    ? "République Algérienne Démocratique et Populaire"
    : isEnglish
    ? "People's Democratic Republic of Algeria"
    : "الجمهورية الجزائرية الديمقراطية الشعبية";

  const ministryHeader = isThesis
    ? (isFrench
        ? "Ministère de l'Enseignement Supérieur et de la Recherche Scientifique"
        : isEnglish
        ? "Ministry of Higher Education and Scientific Research"
        : "وزارة التعليم العالي والبحث العلمي")
    : (isFrench
        ? "Ministère de l'Éducation Nationale"
        : isEnglish
        ? "Ministry of National Education"
        : "وزارة التربية الوطنية");

  // Format Level text
  const levelText =
    level === "PRIMARY"
      ? "الطور الابتدائي"
      : level === "SECONDARY"
      ? "الطور الثانوي"
      : level === "UNIVERSITY"
      ? "التعليم العالي والجامعي"
      : "الطور المتوسط";

  // Clean teacher requirements
  const cleanTeacherReq = teacherRequirements.trim();

  // Distribute outline across estimated pages
  const totalOutlineItems = outline.length;

  return `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office'
      xmlns:w='urn:schemas-microsoft-com:office:word'
      xmlns:m='http://schemas.microsoft.com/office/2004/12/omml'
      xmlns='http://www.w3.org/TR/REC-html40'
      lang="${language}" dir="${isLtr ? "ltr" : "rtl"}">
<head>
  <meta charset="utf-8">
  <title>${fullDocTitle}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
      <w:PunctuationKerning/>
      <w:ValidateAgainstSchemas/>
      <w:SaveIfXMLInvalid>false</w:SaveIfXMLInvalid>
      <w:IgnoreMarketErrors>false</w:IgnoreMarketErrors>
      <w:Compatibility>
        <w:UseWord2013TrackBottomHyphenation/>
      </w:Compatibility>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    /* ======================================================== */
    /* 📄 A4 Print Specifications & Microsoft Word Compatibility */
    /* ======================================================== */
    @page {
      size: 210mm 297mm; /* A4 Portrait */
      margin: 20mm 20mm 20mm 20mm;
      mso-header-margin: 35.4pt;
      mso-footer-margin: 35.4pt;
    }
    @page Section1 {
      size: 595.3pt 841.9pt; /* 210mm x 297mm in Word pt */
      margin: 56.7pt 56.7pt 56.7pt 56.7pt; /* 20mm */
      mso-header-margin: 35.4pt;
      mso-footer-margin: 35.4pt;
    }
    div.Section1 {
      page: Section1;
    }

    body {
      font-family: 'Amiri', 'Traditional Arabic', 'Arial', 'Calibri', serif;
      direction: ${isLtr ? "ltr" : "rtl"};
      text-align: ${isLtr ? "left" : "right"};
      color: #0f172a;
      line-height: 1.75;
      font-size: 12pt;
      background-color: #ffffff;
      margin: 0;
      padding: 0;
    }

    .page-break {
      page-break-after: always;
      break-after: page;
      clear: both;
    }

    /* ======================================================== */
    /* 🇩🇿 الغلاف الجزائري الرسمي                                 */
    /* ======================================================== */
    .cover-container {
      box-sizing: border-box;
      min-height: 250mm;
      border: 4px double #059669;
      padding: 35px 30px;
      margin-bottom: 20px;
      text-align: center;
      background: #ffffff;
    }

    .republic-header {
      font-size: 15pt;
      font-weight: bold;
      color: #0f172a;
      margin: 0 0 4px 0;
      letter-spacing: 0.5px;
    }

    .ministry-header {
      font-size: 13.5pt;
      font-weight: bold;
      color: #047857;
      margin: 4px 0 12px 0;
    }

    .institution-header {
      font-size: 11pt;
      color: #334155;
      margin-bottom: 30px;
    }

    .title-banner {
      border: 3px double #10b981;
      background-color: #f0fdf4;
      border-radius: 12px;
      padding: 28px 20px;
      margin: 30px 0;
      text-align: center;
    }

    .doc-type-badge {
      display: inline-block;
      font-size: 11pt;
      font-weight: bold;
      color: #065f46;
      text-transform: uppercase;
      margin-bottom: 8px;
    }

    .main-document-title {
      font-size: 24pt;
      font-weight: 800;
      color: #064e3b;
      margin: 10px 0;
      line-height: 1.35;
    }

    .curriculum-seal {
      display: inline-block;
      margin-top: 10px;
      background-color: #d1fae5;
      color: #065f46;
      border: 1px solid #10b981;
      padding: 5px 14px;
      border-radius: 20px;
      font-size: 10.5pt;
      font-weight: bold;
    }

    .meta-table {
      width: 100%;
      margin-top: 45px;
      border-collapse: collapse;
      text-align: ${isLtr ? "left" : "right"};
    }

    .meta-table td {
      width: 50%;
      vertical-align: top;
      padding: 10px 14px;
    }

    .meta-label {
      font-size: 11pt;
      font-weight: bold;
      color: #047857;
      margin-bottom: 4px;
    }

    .meta-name {
      font-size: 13pt;
      font-weight: bold;
      color: #0f172a;
    }

    .teacher-instructions-box {
      margin-top: 25px;
      background-color: #f8fafc;
      border: 1px dashed #059669;
      border-radius: 8px;
      padding: 12px 18px;
      font-size: 11pt;
      color: #334155;
      text-align: ${isLtr ? "left" : "right"};
    }

    .year-footer {
      margin-top: 55px;
      font-size: 12pt;
      color: #475569;
      font-weight: bold;
    }

    /* ======================================================== */
    /* 📄 ترويسة الصفحة A4 (Page Header Line)                   */
    /* ======================================================== */
    .page-header-line {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1.5px solid #cbd5e1;
      padding-bottom: 6px;
      margin-bottom: 18px;
      font-size: 9.5pt;
      color: #64748b;
      font-weight: bold;
    }

    .page-header-num {
      font-family: Arial, sans-serif;
      color: #065f46;
      background-color: #f0fdf4;
      padding: 2px 8px;
      border-radius: 4px;
      border: 1px solid #a7f3d0;
    }

    /* ======================================================== */
    /* 📋 فهرس وخطة البحث (Table of Contents)                   */
    /* ======================================================== */
    .toc-card {
      border: 2px solid #e2e8f0;
      background-color: #ffffff;
      border-radius: 8px;
      padding: 25px 30px;
      margin-bottom: 25px;
    }

    .toc-title {
      font-size: 17pt;
      font-weight: bold;
      color: #065f46;
      border-bottom: 2px solid #059669;
      padding-bottom: 8px;
      margin: 0 0 16px 0;
      text-align: center;
    }

    .toc-summary-box {
      background-color: #f0fdf4;
      border-right: 4px solid #10b981;
      border-left: ${isLtr ? "4px solid #10b981" : "none"};
      padding: 12px 16px;
      font-size: 11pt;
      color: #065f46;
      margin-bottom: 20px;
      border-radius: 4px;
    }

    .toc-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12pt;
    }

    .toc-table tr {
      border-bottom: 1px dotted #cbd5e1;
    }

    .toc-table td {
      padding: 8px 6px;
    }

    .toc-num {
      width: 35px;
      font-weight: bold;
      color: #047857;
    }

    .toc-heading {
      font-weight: bold;
      color: #1e293b;
    }

    .toc-dots {
      border-bottom: 1px dotted #94a3b8;
    }

    .toc-page {
      width: 60px;
      text-align: ${isLtr ? "right" : "left"};
      font-weight: bold;
      color: #64748b;
      font-family: Arial, sans-serif;
    }

    /* ======================================================== */
    /* 📖 المتن والأقسام الأكاديمية (Body Sections)             */
    /* ======================================================== */
    .section-container {
      margin-bottom: 28px;
    }

    .section-header {
      font-size: 15pt;
      font-weight: bold;
      color: #064e3b;
      background-color: #f8fafc;
      border-right: 5px solid #059669;
      border-left: ${isLtr ? "5px solid #059669" : "none"};
      padding: 8px 14px;
      margin: 22px 0 12px 0;
      border-radius: 4px;
    }

    .academic-paragraph {
      font-size: 12.5pt;
      line-height: 1.85;
      text-align: justify;
      text-justify: inter-word;
      text-indent: 25px;
      margin: 12px 0;
      color: #1e293b;
    }

    .highlight-card {
      background-color: #f0fdf4;
      border: 1px solid #a7f3d0;
      border-right: 4px solid #059669;
      border-left: ${isLtr ? "4px solid #059669" : "none"};
      border-radius: 6px;
      padding: 12px 16px;
      margin: 14px 0;
      font-size: 11.5pt;
      color: #064e3b;
    }

    /* ======================================================== */
    /* 📚 المراجع والأسئلة البيداغوجية                           */
    /* ======================================================== */
    .references-card {
      background-color: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 18px 22px;
      margin-top: 25px;
    }

    .references-title {
      font-size: 14pt;
      font-weight: bold;
      color: #1e293b;
      margin: 0 0 10px 0;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 6px;
    }

    .references-list {
      margin: 0;
      padding-right: 22px;
      padding-left: ${isLtr ? "22px" : "0"};
      font-size: 11pt;
      line-height: 1.9;
      color: #334155;
    }

    .questions-card {
      background-color: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 8px;
      padding: 18px 22px;
      margin-top: 22px;
    }

    .questions-title {
      font-size: 14pt;
      font-weight: bold;
      color: #1e40af;
      margin: 0 0 10px 0;
      border-bottom: 1px solid #dbeafe;
      padding-bottom: 6px;
    }

    .questions-list {
      margin: 0;
      padding-right: 22px;
      padding-left: ${isLtr ? "22px" : "0"};
      font-size: 11pt;
      line-height: 1.8;
      color: #1e3a8a;
    }

    .doc-footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 15px;
      border-top: 1px solid #e2e8f0;
      font-size: 10pt;
      color: #94a3b8;
    }
  </style>
</head>
<body>
  <div class="Section1">

    <!-- ======================================================== -->
    <!-- 1. صفحة الغلاف الرسمية الجزائريّة                          -->
    <!-- ======================================================== -->
    <div class="cover-container">
      <div class="republic-header">${countryHeader}</div>
      <div class="ministry-header">${ministryHeader}</div>
      <div class="institution-header">
        ${
          isThesis
            ? `<span>${university}</span> · <span>${faculty || "كلية العلوم الإنسانية والاجتماعية"}</span>${specialty ? ` · <span>تخصص: ${specialty}</span>` : ""}`
            : `<span>${directorate}</span> · <span>${schoolName}</span>`
        }
      </div>

      <div class="title-banner">
        <div class="doc-type-badge">
          ${
            isThesis
              ? "مذكرة تخرج لنيل شهادة التخرج الجامعية الأكاديمية"
              : `بحث مدرسي رسمي في مادة: ${subjectName}`
          }
        </div>
        <div class="main-document-title">${topic}</div>
        <div style="font-size: 11pt; color: #475569; margin-top: 8px;">
          ${
            isThesis
              ? `الميدان والفرع: ${subjectName} · عدد الصفحات: ${pageCount} صفحات`
              : `الطور: ${levelText} · المستوى: ${grade} · عدد الصفحات: ${pageCount} صفحات`
          }
        </div>
        <div class="curriculum-seal">
          ✓ يوافق المنهاج الوطني الجزائري الرسمي (الجيل الثاني)
        </div>
      </div>

      <table class="meta-table">
        <tr>
          <td>
            <div class="meta-label">
              ${isThesis ? "إعداد الطالب(ة) الباحث:" : "إعداد التلميذ(ة):"}
            </div>
            <div class="meta-name">${studentName}</div>
          </td>
          <td style="text-align: ${isLtr ? "right" : "left"};">
            <div class="meta-label">
              ${isThesis ? "تحت إشراف الأستاذ(ة) المؤطر(ة):" : "تحت إشراف الأستاذ(ة):"}
            </div>
            <div class="meta-name">${teacherName}</div>
          </td>
        </tr>
      </table>

      ${
        cleanTeacherReq
          ? `
        <div class="teacher-instructions-box">
          <strong>توجيهات وعناصر خاصة من الأستاذ المشرف:</strong>
          <div style="margin-top: 4px; font-weight: normal; color: #1e293b;">${cleanTeacherReq}</div>
        </div>
      `
          : ""
      }

      <div class="year-footer">
        ${isThesis ? "السنة الجامعية:" : "الموسم الدراسي:"} ${year}
      </div>
    </div>

    ${(() => {
      // Helper function to calculate exact page number for each outline item
      const getPageNumber = (idx: number): number => {
        if (pageCount <= 1) return 1;
        if (pageCount === 2) return 2;
        if (pageCount === 3) {
          return idx <= 1 ? 2 : 3;
        }
        if (pageCount === 5) {
          if (idx === 0) return 2; // Intro
          if (idx === 1 || idx === 2) return 3; // Section 1 & 2
          if (idx === 3) return 4; // Section 3
          return 5; // Conclusion & References
        }
        // General distribution for pageCount >= 4
        if (idx === 0) return 2;
        const totalItems = outline.length;
        const lastCount = totalItems >= 5 ? 2 : 1;
        if (idx >= totalItems - lastCount) return pageCount;
        const middleItems = totalItems - 1 - lastCount;
        const middlePages = pageCount - 2;
        const middleIdx = idx - 1;
        const assignedPage = 3 + Math.floor((middleIdx / Math.max(1, middleItems)) * middlePages);
        return Math.min(pageCount - 1, Math.max(3, assignedPage));
      };

      // Header helper for each content page
      const renderPageHeader = (pageNum: number) => `
        <div class="page-header-line">
          <span>${isThesis ? university || "الجامعة الجزائرية" : schoolName || "المؤسسة التعليمية"}</span>
          <span style="font-weight: 800; color: #1e293b;">${topic}</span>
          <span class="page-header-num">ص ${pageNum} من ${pageCount}</span>
        </div>
      `;

      // Helper to render a section
      const renderSectionHtml = (sec: ResearchHtmlSection, sIdx: number) => {
        const paras = sec.paragraphs && sec.paragraphs.length > 0
          ? sec.paragraphs
          : sec.content
          ? sec.content.split(/\n\s*\n/).filter((p) => p.trim().length > 0)
          : [];

        const defaultHighlight =
          topic.includes("عبد القادر") || topic.includes("الأمير")
            ? `📌 شاهد تاريخي وسيادي معتمد: أسس الأمير عبد القادر أول مصانع الأسلحة وسك عملة «المحمدية» عام 1839م، وأصدر عام 1843م ميثاق معاملة أسرى الحرب الذي سبق اتفاقيات جنيف الدولية بعقود.`
            : topic.includes("مصالي") || topic.includes("نوفمبر") || topic.includes("الثورة")
            ? `📌 شاهد وطني معتمد: شكل نضال الرواد وتأسيس المنظمة الخاصة (OS 1947م) القاعدة الصلبة التي مهدت لإجماع الشعب الجزائري حول بيان أول نوفمبر 1954م واسترجاع السيادة.`
            : `📌 إضاءة بيداغوجية معتمدة: يربط المنهاج الوطني الجزائري بين المفاهيم النظرية المقررة والشواهد الحية المستمدة من البيئة والواقع الجزائري.`;

        const highlightText = sec.highlightBox || defaultHighlight;

        return `
          <div class="section-container">
            <div class="section-header">
              ${sIdx + 1}. ${sec.heading}
            </div>
            ${
              paras.length > 0
                ? paras.map((p) => `<p class="academic-paragraph">${p.trim()}</p>`).join("")
                : `<p class="academic-paragraph">${sec.content}</p>`
            }
            ${
              (sec.highlightBox || sIdx === 1 || sec.heading.includes("المبحث الأول") || sec.heading.includes("المبحث الثالث"))
                ? `
                <div class="highlight-card">
                  <span>${highlightText}</span>
                </div>
              `
                : ""
            }
          </div>
        `;
      };

      // Table of Contents HTML
      const renderTocHtml = () => `
        <div class="toc-card">
          <div class="toc-title">
            ${isFrench ? "Table des Matières et Plan de Recherche" : isEnglish ? "Table of Contents & Research Plan" : "فهرس وخطة البحث المعتمدة"}
          </div>

          <div class="toc-summary-box">
            <strong>💡 ملخص منهجي: </strong>
            <span>
              ${
                methodologySummary ||
                `خطة بحث أكاديمي متكامل لمنهاج الجيل الثاني في ${subjectName}، مصممة بدقة لتستوفي ${pageCount} صفحات وفق المعايير الرسمية لوزارة التربية الوطنية.`
              }
            </span>
          </div>

          <table class="toc-table">
            ${outline
              .map((item, idx) => `
                <tr>
                  <td class="toc-num">${idx + 1}.</td>
                  <td class="toc-heading">${item}</td>
                  <td class="toc-page">ص ${getPageNumber(idx)}</td>
                </tr>
              `)
              .join("")}
          </table>
        </div>
      `;

      // References and review questions HTML
      const renderReferencesAndQuestions = () => `
        ${
          references.length > 0
            ? `
          <div class="references-card">
            <div class="references-title">
              ${isFrench ? "Références officielles et sources :" : isEnglish ? "Official References & Sources:" : "قائمة المراجع والمصادر الوطنية المعتمدة:"}
            </div>
            <ol class="references-list">
              ${references.map((ref) => `<li>${ref}</li>`).join("")}
            </ol>
          </div>
        `
            : ""
        }
        ${
          reviewQuestions.length > 0
            ? `
          <div class="questions-card">
            <div class="questions-title">
              أسئلة مراجعة وتثبيت الفهم البيداغوجي (لتعزيز الاستيعاب والتحضير للامتحانات):
            </div>
            <ol class="questions-list">
              ${reviewQuestions.map((q) => `<li>${q}</li>`).join("")}
            </ol>
          </div>
        `
            : ""
        }
        <div class="doc-footer">
          تم إعداد وتنسيق هذا المستند آلياً وفق المعايير الأكاديمية والتربوية الرسمية للجمهورية الجزائرية الديمقراطية الشعبية · سهلة (Sahla 2.0)
          ${watermark ? `<br/><span>${watermark}</span>` : ""}
        </div>
      `;

      // ----------------------------------------------------
      // Modular rendering by target page count
      // ----------------------------------------------------
      if (pageCount <= 1) {
        // Single page document
        return `
          <div class="body-content">
            ${sections.map((sec, idx) => renderSectionHtml(sec, idx)).join("")}
            ${renderReferencesAndQuestions()}
          </div>
        `;
      }

      if (pageCount === 2) {
        return `
          <!-- فاصل بعد الغلاف -->
          <div class="page-break" style="page-break-after: always; mso-special-character: line-break;"></div>
          <!-- صفحة 2: الفهرس والمتن الكامل -->
          <div class="body-content">
            ${renderPageHeader(2)}
            ${renderTocHtml()}
            ${sections.map((sec, idx) => renderSectionHtml(sec, idx)).join("")}
            ${renderReferencesAndQuestions()}
          </div>
        `;
      }

      if (pageCount === 3) {
        const sec1 = sections[0];
        const sec2 = sections[1];
        const restSecs = sections.slice(2);

        return `
          <!-- فاصل بعد الغلاف -->
          <div class="page-break" style="page-break-after: always; mso-special-character: line-break;"></div>
          <!-- صفحة 2: الفهرس والمقدمة -->
          <div class="body-content">
            ${renderPageHeader(2)}
            ${renderTocHtml()}
            ${sec1 ? renderSectionHtml(sec1, 0) : ""}
            ${sec2 ? renderSectionHtml(sec2, 1) : ""}
          </div>

          <!-- فاصل بعد صفحة 2 -->
          <div class="page-break" style="page-break-after: always; mso-special-character: line-break;"></div>
          <!-- صفحة 3: بقية المتن والخاتمة والمراجع -->
          <div class="body-content">
            ${renderPageHeader(3)}
            ${restSecs.map((sec, idx) => renderSectionHtml(sec, idx + 2)).join("")}
            ${renderReferencesAndQuestions()}
          </div>
        `;
      }

      if (pageCount === 5) {
        // EXACT 5-PAGE ARCHITECTURE (Page 1: Cover, Page 2: TOC + Intro, Page 3: Sec 1 & 2, Page 4: Sec 3, Page 5: Conclusion & Refs)
        const secIntro = sections[0] || { heading: outline[0] || "المقدمة", content: "" };
        const sec1 = sections[1] || { heading: outline[1] || "المبحث الأول", content: "" };
        const sec2 = sections[2] || { heading: outline[2] || "المبحث الثاني", content: "" };
        const sec3 = sections[3] || { heading: outline[3] || "المبحث الثالث", content: "" };
        const secConcl = sections[4] || { heading: outline[4] || "الخاتمة", content: "" };

        return `
          <!-- فاصل بعد صفحة الغلاف (صفحة 1) -->
          <div class="page-break" style="page-break-after: always; mso-special-character: line-break;"></div>

          <!-- صفحة 2: الفهرس والمقدمة المنهجية وطرح الإشكالية -->
          <div class="body-content">
            ${renderPageHeader(2)}
            ${renderTocHtml()}
            ${renderSectionHtml(secIntro, 0)}
          </div>

          <!-- فاصل بعد صفحة 2 -->
          <div class="page-break" style="page-break-after: always; mso-special-character: line-break;"></div>

          <!-- صفحة 3: المبحث الأول والمبحث الثاني والشواهد التاريخية -->
          <div class="body-content">
            ${renderPageHeader(3)}
            ${renderSectionHtml(sec1, 1)}
            ${renderSectionHtml(sec2, 2)}
          </div>

          <!-- فاصل بعد صفحة 3 -->
          <div class="page-break" style="page-break-after: always; mso-special-character: line-break;"></div>

          <!-- صفحة 4: المبحث الثالث والأبعاد المؤسساتية والتحليلية -->
          <div class="body-content">
            ${renderPageHeader(4)}
            ${renderSectionHtml(sec3, 3)}
          </div>

          <!-- فاصل بعد صفحة 4 -->
          <div class="page-break" style="page-break-after: always; mso-special-character: line-break;"></div>

          <!-- صفحة 5: الخاتمة وحوصلة النتائج وقائمة المراجع وأسئلة المراجعة -->
          <div class="body-content">
            ${renderPageHeader(5)}
            ${renderSectionHtml(secConcl, 4)}
            ${renderReferencesAndQuestions()}
          </div>
        `;
      }

      // General case for pageCount >= 4 (such as 10 pages)
      const pagesMap: Record<number, ResearchHtmlSection[]> = {};
      for (let p = 2; p <= pageCount; p++) pagesMap[p] = [];

      sections.forEach((sec, idx) => {
        const assignedPage = getPageNumber(idx);
        if (!pagesMap[assignedPage]) pagesMap[assignedPage] = [];
        pagesMap[assignedPage].push(sec);
      });

      let multiPageHtml = "";
      for (let p = 2; p <= pageCount; p++) {
        const isFirstContent = p === 2;
        const isLastPage = p === pageCount;
        const pageSections = pagesMap[p] || [];

        multiPageHtml += `
          <!-- فاصل قبل صفحة ${p} -->
          <div class="page-break" style="page-break-after: always; mso-special-character: line-break;"></div>
          <div class="body-content">
            ${renderPageHeader(p)}
            ${isFirstContent ? renderTocHtml() : ""}
            ${pageSections.map((sec, sIdx) => renderSectionHtml(sec, sIdx)).join("")}
            ${isLastPage ? renderReferencesAndQuestions() : ""}
          </div>
        `;
      }

      return multiPageHtml;
    })()}

  </div>
</body>
</html>`;
}
