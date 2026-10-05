/**
 * 🖨️ Skill 5.8: formatter-renderer (التنسيق والتصدير المطبوع - معايير المدرسة الجزائرية v2.0)
 * Compiles structured JSON research into print-ready HTML/A4 adhering to official Algerian formatting:
 * 1. Official hierarchy: الجمهورية، الوزارة، مديرية التربية، المؤسسة، السنة الدراسية (2026/2027).
 * 2. Trilingual support (Arabic, French, English).
 * 3. Unit grounding badge (يوافق المنهاج الوطني الجزائري).
 * 4. A4 typography, proper margins for binding, and Western numerals for scientific equations.
 */

import { FinalResearchDocument } from "../types";

export interface FormatterRendererInput {
  document: FinalResearchDocument;
  watermark?: string;
}

export interface FormatterRendererOutput {
  html: string;
  pages_estimated: number;
}

export function runFormatterRenderer(input: FormatterRendererInput): FormatterRendererOutput {
  const { document, watermark } = input;
  const { cover, outline, sections, references, study_aids, meta } = document;
  const isFrench = meta.language === "fr";
  const isEnglish = meta.language === "en";

  const countryHeader = isFrench
    ? "République Algérienne Démocratique et Populaire"
    : isEnglish
    ? "People's Democratic Republic of Algeria"
    : "الجمهورية الجزائرية الديمقراطية الشعبية";

  const ministryHeader = isFrench
    ? "Ministère de l'Éducation Nationale"
    : isEnglish
    ? "Ministry of National Education"
    : "وزارة التربية الوطنية";

  const directorate = cover.directorate || "مديرية التربية لولاية الجزائر (16)";
  const schoolName = cover.school || "المؤسسة التعليمية";
  const schoolYear = cover.year || "2026 / 2027";

  const html = `
    <div class="sahla-document-render" dir="${isFrench || isEnglish ? "ltr" : "rtl"}" style="font-family: 'Amiri', 'Traditional Arabic', serif; line-height: 1.6; color: #1e293b;">
      <!-- صفحة الغلاف الرسمية الجزائريّة -->
      <div class="page-cover" style="page-break-after: always; text-align: center; padding: 40px 25px; border: 4px double #059669; min-height: 297mm; box-sizing: border-box;">
        <h3 style="margin: 0; color: #1e293b; font-size: 18px; font-weight: bold;">${countryHeader}</h3>
        <h4 style="margin: 6px 0 15px 0; color: #047857; font-size: 16px;">${ministryHeader}</h4>
        <div style="font-size: 14px; color: #334155; margin-bottom: 25px;">
          <span>${directorate}</span> · <span>${schoolName}</span>
        </div>
        
        <div style="background-color: #f0fdf4; border: 2px solid #10b981; padding: 25px; border-radius: 12px; margin: 35px 0;">
          <span style="font-size: 13px; color: #065f46; font-weight: bold; text-transform: uppercase;">
            ${isFrench ? "Recherche scolaire en :" : isEnglish ? "School Research in:" : "بحث مدرسي في مادة:"} ${meta.subject}
          </span>
          <h1 style="font-size: 26px; color: #064e3b; margin: 12px 0; line-height: 1.4;">${cover.title}</h1>
          <div style="font-size: 13px; color: #475569; margin-top: 8px;">
            <span>${isFrench ? "Niveau :" : isEnglish ? "Level:" : "المستوى:"} ${meta.stage} · ${meta.level}</span>
            ${
              meta.unit_title
                ? `<div style="display: inline-block; margin-top: 6px; padding: 4px 10px; background-color: #d1fae5; color: #065f46; border-radius: 20px; font-size: 11px; font-weight: bold;">
                    ✓ يوافق المنهاج الجزائري · مقطع: ${meta.unit_title}
                  </div>`
                : ""
            }
          </div>
        </div>

        <table style="width: 100%; margin-top: 45px; font-size: 14px; border-collapse: collapse;">
          <tr>
            <td style="text-align: ${isFrench || isEnglish ? "left" : "right"}; width: 50%; vertical-align: top;">
              <strong style="color: #065f46;">${isFrench ? "Présenté par :" : isEnglish ? "Prepared by:" : "إعداد التلميذ(ة):"}</strong><br/>
              <span style="font-size: 15px; font-weight: 600;">${cover.student || "تلميذ المؤسسة"}</span>
            </td>
            <td style="text-align: ${isFrench || isEnglish ? "right" : "left"}; width: 50%; vertical-align: top;">
              <strong style="color: #065f46;">${isFrench ? "Sous la direction de :" : isEnglish ? "Supervised by:" : "تحت إشراف الأستاذ(ة):"}</strong><br/>
              <span style="font-size: 15px; font-weight: 600;">${cover.teacher || "الأستاذ المشرف"}</span>
            </td>
          </tr>
        </table>

        ${
          meta.teacher_requirements
            ? `
          <div style="margin-top: 30px; text-align: ${isFrench || isEnglish ? "left" : "right"}; background-color: #f8fafc; border: 1px dashed #94a3b8; padding: 10px 15px; border-radius: 6px; font-size: 12px; color: #475569;">
            <strong>العناصر المعتمدة وفق توجيهات الأستاذ المشرف:</strong>
            <p style="margin: 4px 0 0 0;">${meta.teacher_requirements}</p>
          </div>
        `
            : ""
        }

        <div style="margin-top: 55px; font-size: 13px; color: #64748b; font-weight: 600;">
          ${isFrench ? "Année scolaire :" : isEnglish ? "School year:" : "الموسم الدراسي:"} ${schoolYear}
        </div>
      </div>

      <!-- الفهرس والمحتوى الداخلي -->
      <div class="page-body" style="padding: 25px 0;">
        <h2 style="color: #065f46; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; font-size: 20px;">
          ${isFrench ? "Plan de la recherche" : isEnglish ? "Table of Contents" : "خطة وفهرس البحث"}
        </h2>
        <ol style="margin-bottom: 35px; line-height: 1.8; color: #334155; font-size: 14px;">
          ${outline.map((o) => `<li><strong>${o.title}</strong></li>`).join("")}
        </ol>

        <!-- الأقسام والفقرات -->
        ${sections
          .map(
            (sec) => `
          <div style="margin-bottom: 30px;">
            <h3 style="color: #047857; margin-bottom: 10px; font-size: 17px; border-right: 4px solid #10b981; padding-right: 8px;">
              ${sec.title}
            </h3>
            ${sec.blocks
              .map((b) => {
                if (b.type === "paragraph")
                  return `<p style="text-align: justify; text-indent: 20px; line-height: 1.8; font-size: 14px; margin-bottom: 12px;">${b.text}</p>`;
                if (b.type === "list" && b.items)
                  return `<ul style="margin: 8px 0 14px 20px; line-height: 1.7; font-size: 13.5px;">${b.items
                    .map((it) => `<li>${it}</li>`)
                    .join("")}</ul>`;
                if (b.type === "term")
                  return `<div style="background:#f8fafc; padding:10px 14px; border-right:3px solid #059669; margin:10px 0; border-radius:4px; font-size:13px;"><strong>${b.term}:</strong> ${b.definition}</div>`;
                if (b.type === "table" && b.rows)
                  return `
                    <table style="width:100%; border-collapse:collapse; margin:14px 0; font-size:13px;">
                      ${b.rows
                        .map(
                          (row, rIdx) => `
                        <tr style="${rIdx === 0 ? "background:#f1f5f9; font-weight:bold;" : "border-bottom:1px solid #e2e8f0;"}">
                          ${row.map((cell) => `<td style="padding:8px 10px; border:1px solid #cbd5e1;">${cell}</td>`).join("")}
                        </tr>
                      `
                        )
                        .join("")}
                    </table>
                  `;
                return "";
              })
              .join("")}
          </div>
        `
          )
          .join("")}

        <!-- المراجع الرسمية المعتمدة -->
        <div style="margin-top: 35px; background: #f8fafc; padding: 18px; border-radius: 8px; border: 1px solid #cbd5e1;">
          <h4 style="margin: 0 0 10px 0; color: #334155; font-size: 15px;">
            ${isFrench ? "Références officielles :" : isEnglish ? "Official References:" : "قائمة المراجع والمصادر الرسمية المعتمدة:"}
          </h4>
          <ul style="font-size: 12.5px; color: #475569; margin: 0; padding-right: 20px; line-height: 1.8;">
            ${references.map((r) => `<li>${r.title} ${r.publisher ? `(${r.publisher})` : ""} - [مرجع معتمد]</li>`).join("")}
          </ul>
        </div>

        ${
          study_aids
            ? `
          <div style="margin-top: 25px; background: #eff6ff; padding: 18px; border-radius: 8px; border: 1px solid #bfdbfe;">
            <h4 style="margin: 0 0 10px 0; color: #1e40af; font-size: 15px;">
              أسئلة مراجعة وتلخيص مفاهيمي (مساعدات دراسية لتعزيز الفهم والاستيعاب):
            </h4>
            <ul style="font-size: 12.5px; color: #1e3a8a; margin: 0; padding-right: 20px; line-height: 1.8;">
              ${study_aids.questions.map((q) => `<li>${q}</li>`).join("")}
            </ul>
          </div>
        `
            : ""
        }
      </div>
    </div>
  `;

  return {
    html,
    pages_estimated: Math.max(1, meta.pages || outline.length),
  };
}
