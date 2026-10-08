/**
 * 📄 Sahla Educational Word (.docx / .doc) Export Utility
 * Generates an editable Microsoft Word document formatted according to Algerian Ministry standards.
 */

export interface ExportWordOptions {
  title: string;
  topic: string;
  level: string;
  grade: string;
  subject: string;
  docKind?: "RESEARCH" | "THESIS" | "SUMMARY" | "PEDAGOGIC";
  university?: string;
  faculty?: string;
  specialty?: string;
  studentName?: string;
  schoolName?: string;
  teacherName?: string;
  outline: string[];
  sections: Array<{ heading: string; content: string }>;
  references: string[];
  reviewQuestions?: string[];
  watermark?: string;
}

export function exportResearchToWord(options: ExportWordOptions) {
  const {
    title,
    topic,
    grade,
    subject,
    docKind = "RESEARCH",
    university = "",
    faculty = "",
    specialty = "",
    studentName = "التلميذ",
    schoolName = "المؤسسة التعليمية",
    teacherName = "الأستاذ المشرف",
    outline,
    sections,
    references,
    reviewQuestions = [],
    watermark,
  } = options;

  const isThesis = docKind === "THESIS";

  const htmlContent = `
    <!DOCTYPE html>
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${title}</title>
      <style>
        @page Section1 {
          size: 595.3pt 841.9pt; /* A4 */
          margin: 70.85pt 70.85pt 70.85pt 70.85pt;
          mso-header-margin: 35.4pt;
          mso-footer-margin: 35.4pt;
        }
        div.Section1 { page: Section1; }
        body {
          font-family: 'Amiri', 'Traditional Arabic', 'Arial', sans-serif;
          direction: rtl;
          text-align: right;
          color: #1a1a1a;
          line-height: 1.6;
        }
        .cover-page {
          text-align: center;
          page-break-after: always;
          padding-top: 40px;
        }
        .ministry-header {
          font-size: 13pt;
          font-weight: bold;
          margin-bottom: 5px;
          color: #2b3a4a;
        }
        .republic {
          font-size: 12pt;
          margin-bottom: 40px;
          color: #4a5568;
        }
        .title-box {
          border: 3px double #059669;
          background-color: #f0fdf4;
          padding: 25px;
          margin: 40px 0;
          border-radius: 8px;
        }
        .main-title {
          font-size: 22pt;
          font-weight: bold;
          color: #065f46;
          margin: 0;
        }
        .meta-table {
          width: 100%;
          margin-top: 60px;
          border-collapse: collapse;
        }
        .meta-table td {
          padding: 12px;
          font-size: 12pt;
        }
        .meta-label {
          font-weight: bold;
          color: #1e293b;
        }
        .toc {
          page-break-after: always;
          margin-top: 30px;
        }
        .section-title {
          font-size: 15pt;
          font-weight: bold;
          color: #047857;
          border-bottom: 2px solid #a7f3d0;
          padding-bottom: 4px;
          margin-top: 25px;
        }
        .content-p {
          font-size: 12pt;
          text-align: justify;
          margin: 12px 0;
          text-indent: 20px;
        }
        .ref-box {
          background-color: #f8fafc;
          border: 1px solid #cbd5e1;
          padding: 15px;
          border-radius: 6px;
          margin-top: 25px;
        }
        .questions-box {
          background-color: #eff6ff;
          border: 1px solid #bfdbfe;
          padding: 15px;
          border-radius: 6px;
          margin-top: 20px;
        }
        .watermark-footer {
          font-size: 9pt;
          color: #94a3b8;
          text-align: center;
          margin-top: 40px;
        }
      </style>
    </head>
    <body>
      <div class="Section1">
        <!-- صفحة الغلاف الرسمية -->
        <div class="cover-page">
          <div class="republic">الجمهورية الجزائرية الديمقراطية الشعبية</div>
          <div class="ministry-header">
            ${isThesis ? "وزارة التعليم العالي والبحث العلمي" : "وزارة التربية الوطنية"}
          </div>
          <div style="font-size: 11pt; color: #475569; margin-bottom: 4px;">
            ${
              isThesis
                ? `${university || "الجامعة الجزائرية"}${faculty ? ` · ${faculty}` : ""}`
                : `مديرية التربية والتعليم · ${schoolName || "المؤسسة التعليمية"}`
            }
          </div>
          ${
            isThesis && specialty
              ? `<div style="font-size: 10.5pt; color: #64748b; margin-bottom: 8px;">القسم / التخصص: ${specialty}</div>`
              : ""
          }

          <div class="title-box">
            <div style="font-size: 12pt; color: #059669; font-weight: bold; margin-bottom: 8px;">
              ${
                isThesis
                  ? "مذكرة تخرج لنيل شهادة التخرج الجامعية (ليسانس / ماستر / تقني سامي)"
                  : `بحث مدرسي في مادة: ${subject}`
              }
            </div>
            <div class="main-title">${topic}</div>
            <div style="font-size: 11pt; color: #475569; margin-top: 8px;">
              ${isThesis ? `الميدان والفرع: ${subject}` : `المستوى: ${grade}`}
            </div>
          </div>

          <table class="meta-table">
            <tr>
              <td style="text-align: right; width: 50%;">
                <span class="meta-label">${isThesis ? "إعداد الطالب(ة) الباحث:" : "إعداد التلميذ(ة):"}</span><br/>
                <span style="font-size: 13pt; font-weight: bold;">${studentName}</span>
              </td>
              <td style="text-align: left; width: 50%;">
                <span class="meta-label">${isThesis ? "تحت إشراف الأستاذ(ة) المؤطر(ة):" : "تحت إشراف الأستاذ(ة):"}</span><br/>
                <span style="font-size: 13pt; font-weight: bold;">${teacherName}</span>
              </td>
            </tr>
            <tr>
              <td colspan="2" style="text-align: center; padding-top: 40px; color: #64748b;">
                ${isThesis ? "السنة الجامعية: 2025 / 2026 م" : "الموسم الدراسي: 2025 / 2026 م"}
              </td>
            </tr>
          </table>
        </div>

        <!-- خطة وفهرس البحث -->
        <div class="toc">
          <h2 style="color: #0f172a; text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">فهرس وخطة البحث</h2>
          <ol style="font-size: 12pt; line-height: 2;">
            ${outline.map((item) => `<li>${item}</li>`).join("")}
          </ol>
        </div>

        <!-- محتوى البحث -->
        <div>
          ${sections
            .map(
              (sec) => `
            <div class="section-title">${sec.heading}</div>
            <p class="content-p">${sec.content}</p>
          `
            )
            .join("")}
        </div>

        <!-- المراجع الرسمية المعتمدة -->
        <div class="ref-box">
          <h3 style="color: #334155; margin-top: 0;">قائمة المراجع والمصادر الرسمية:</h3>
          <ul style="font-size: 10.5pt; color: #475569;">
            ${references.map((ref) => `<li>${ref}</li>`).join("")}
          </ul>
        </div>

        <!-- أسئلة المراجعة البيداغوجية -->
        ${
          reviewQuestions.length > 0
            ? `
          <div class="questions-box">
            <h3 style="color: #1e40af; margin-top: 0;">أسئلة مراجعة ومفردات الدرس (لتحفيز الفهم والمناقشة):</h3>
            <ol style="font-size: 10.5pt; color: #1e3a8a;">
              ${reviewQuestions.map((q) => `<li>${q}</li>`).join("")}
            </ol>
          </div>
        `
            : ""
        }

        ${
          watermark
            ? `<div class="watermark-footer">${watermark}</div>`
            : ""
        }
      </div>
    </body>
    </html>
  `;

  // Create downloadable Blob with Word MIME type
  const blob = new Blob(["\ufeff", htmlContent], {
    type: "application/msword;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title.replace(/[/\\?%*:|"<>]/g, "-")}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
