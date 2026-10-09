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

    <!-- الفاصل بين الغلاف والفهرس -->
    <div class="page-break" style="page-break-after: always; mso-special-character: line-break;"></div>

    <!-- ======================================================== -->
    <!-- 2. فهرس وخطة البحث المعتمدة (Table of Contents)          -->
    <!-- ======================================================== -->
    <div class="toc-card">
      <div class="toc-title">
        ${isFrench ? "Table des Matières et Plan de Recherche" : isEnglish ? "Table of Contents & Research Plan" : "فهرس وخطة البحث المعتمدة"}
      </div>

      <div class="toc-summary-box">
        <strong>💡 ملخص منهجي: </strong>
        <span>
          ${
            methodologySummary ||
            `خطة بحث أكاديمي متكامل لمنهاج الجيل الثاني في ${subjectName}، تغطي جوانب نظرية وتطبيقية ميدانية في الجزائر، مع تطبيق أمثلة وشهادات وواقعيات، وتنتهي بمناقشة نتائج وتوصيات عملية موزعة على ${pageCount} صفحات.`
          }
        </span>
      </div>

      <table class="toc-table">
        ${outline
          .map((item, idx) => {
            // Estimate page for each item across pageCount
            const estimatedPage = Math.min(
              pageCount,
              Math.max(2, Math.round(2 + (idx / Math.max(1, totalOutlineItems - 1)) * (pageCount - 2)))
            );
            return `
              <tr>
                <td class="toc-num">${idx + 1}.</td>
                <td class="toc-heading">${item}</td>
                <td class="toc-page">ص ${estimatedPage}</td>
              </tr>
            `;
          })
          .join("")}
      </table>
    </div>

    <!-- الفاصل بين الفهرس وبداية المتن -->
    <div class="page-break" style="page-break-after: always; mso-special-character: line-break;"></div>

    <!-- ======================================================== -->
    <!-- 3. المتن المفصل للأقسام والمحاور (Content Sections)       -->
    <!-- ======================================================== -->
    <div class="body-content">
      ${sections
        .map((sec, sIdx) => {
          const isLastSection = sIdx === sections.length - 1;
          const paras = sec.paragraphs && sec.paragraphs.length > 0
            ? sec.paragraphs
            : sec.content
            ? sec.content.split(/\n\s*\n/).filter((p) => p.trim().length > 0)
            : [];

          return `
            <div class="section-container">
              <div class="section-header">
                ${sIdx + 1}. ${sec.heading}
              </div>
              ${
                paras.length > 0
                  ? paras
                      .map((p) => `<p class="academic-paragraph">${p.trim()}</p>`)
                      .join("")
                  : `<p class="academic-paragraph">${sec.content}</p>`
              }
              ${
                // Insert a visual highlight or note on key sections
                sec.heading.includes("تطبيق") || sec.heading.includes("شواهد") || sec.heading.includes("بيان أول نوفمبر")
                  ? `
                  <div class="highlight-card">
                    <strong>📌 شاهد تاريخي ووطني معتمد: </strong>
                    <span>تؤكد الوثائق الوطنية الرسمية أن بلورة المطالب الاستقلالية ونضال الرواد شكل القاعدة الصلبة التي مهدت لإجماع الشعب الجزائري حول بيان أول نوفمبر 1954 وثورة التحرير المظفرة.</span>
                  </div>
                `
                  : ""
              }
            </div>
            ${
              // Insert page break every couple of sections or when pageCount is high
              (sIdx + 1) % 2 === 0 && !isLastSection && pageCount >= 5
                ? `<div class="page-break" style="page-break-after: always; mso-special-character: line-break;"></div>`
                : ""
            }
          `;
        })
        .join("")}

      <!-- ======================================================== -->
      <!-- 4. قائمة المراجع والمصادر الرسمية المعتمدة               -->
      <!-- ======================================================== -->
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

      <!-- ======================================================== -->
      <!-- 5. أسئلة مراجعة وتثبيت الفهم البيداغوجي                   -->
      <!-- ======================================================== -->
      ${
        reviewQuestions.length > 0
          ? `
        <div class="questions-card">
          <div class="questions-title">
            أسئلة مراجعة وتثبيت الفهم (لتعزيز الاستيعاب والتحضير للامتحانات وتجنب الغش):
          </div>
          <ol class="questions-list">
            ${reviewQuestions.map((q) => `<li>${q}</li>`).join("")}
          </ol>
        </div>
      `
          : ""
      }

      <!-- تذييل المستند -->
      <div class="doc-footer">
        تم إعداد وتنسيق هذا المستند آلياً وفق المعايير الأكاديمية والتربوية الرسمية للجمهورية الجزائرية الديمقراطية الشعبية · سهلة (Sahla 2.0)
        ${watermark ? `<br/><span>${watermark}</span>` : ""}
      </div>
    </div>

  </div>
</body>
</html>`;
}
