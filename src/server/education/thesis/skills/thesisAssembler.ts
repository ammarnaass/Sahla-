/**
 * 📚 Skill: thesis-assembler (مجمّع ومنسّق المذكرة الأكاديمية الكاملة)
 * مواصفة استوديو المذكرات (PRD النسخة 1.0 - الجزائر)
 * 
 * المخرجات:
 * - وثيقة متكاملة بالترتيب الصارم لملف المؤسسة
 * - تجهيز محتوى DOCX / HTML جاهز للطباعة والتصدير بجودة A4 و 300DPI
 * - ترقيم الأقسام والفهارس وقائمة المراجع المنسقة
 */

import {
  ThesisProject,
  ThesisPlan,
  WrittenChapter,
  ThesisSource,
  InstitutionProfile,
} from "../types";
import { IntroConclusionResult } from "./introConclusionWriter";
import { TrilingualAbstracts } from "./abstractTranslator";
import { CitationFormatter } from "./citationFormatter";

export interface AssembledThesisDocument {
  thesis_id: string;
  title: string;
  html_document: string;
  total_words: number;
  total_pages_estimate: number;
  chapters_count: number;
  sources_count: number;
  assembled_at: string;
}

export class ThesisAssembler {
  public static assemble(params: {
    project: ThesisProject;
    profile: InstitutionProfile;
    plan: ThesisPlan;
    chapters: WrittenChapter[];
    sources: ThesisSource[];
    introConclusion: IntroConclusionResult;
    abstracts: TrilingualAbstracts;
  }): AssembledThesisDocument {
    const {
      project,
      profile,
      plan,
      chapters,
      sources,
      introConclusion,
      abstracts,
    } = params;

    // تنسيق قائمة المراجع
    const bibliography = CitationFormatter.formatBibliography(
      sources,
      profile.citation.style || project.citation_style
    );

    let totalWords = 0;
    chapters.forEach((c) => (totalWords += c.word_count));

    const totalPagesEstimate = Math.max(1, Math.round(totalWords / 350) + 12); // +12 for front & back matter

    const headerRepublic = profile.cover.header[0] || "الجمهورية الجزائرية الديمقراطية الشعبية";
    const headerMinistry = profile.cover.header[1] || "وزارة التعليم العالي والبحث العلمي";

    // 1. Cover Page HTML
    const coverHtml = `
      <div class="page cover-page">
        <div class="official-header">
          <p class="republic-text">${headerRepublic}</p>
          <p class="ministry-text">${headerMinistry}</p>
          <h3 class="univ-name">${project.university}</h3>
          <h4 class="faculty-name">${project.faculty}</h4>
          ${project.department ? `<p class="dept-name">قسم ${project.department}</p>` : ""}
        </div>

        <div class="thesis-badge">
          <p class="degree-badge">${profile.degree_title_ar || "مذكرة تخرج لنيل شهادة الماستر"}</p>
          <p class="specialty-text">تخصص: <strong>${project.specialty}</strong></p>
        </div>

        <div class="title-frame">
          <p class="theme-label">الموضوع:</p>
          <h1 class="thesis-main-title">${project.title}</h1>
        </div>

        <div class="actors-grid">
          <div class="actor-col student-col">
            <p class="actor-role">إعداد الطالب(ة) الباحث:</p>
            <p class="actor-name"><strong>${project.student_name}</strong></p>
          </div>
          <div class="actor-col supervisor-col">
            <p class="actor-role">تحت إشراف الأستاذ المؤطر:</p>
            <p class="actor-name"><strong>${project.supervisor_name}</strong></p>
          </div>
        </div>

        ${
          project.jury_members && project.jury_members.length > 0
            ? `
          <div class="jury-section">
            <p class="jury-title">أعضاء لجنة المناقشة الموقرة:</p>
            <ul class="jury-list">
              ${project.jury_members.map((j) => `<li>${j}</li>`).join("")}
            </ul>
          </div>
        `
            : ""
        }

        <div class="academic-year-box">
          <p class="year-text">السنة الجامعية: <strong>${project.academic_year}</strong></p>
        </div>
      </div>
      <div class="page-break"></div>
    `;

    // 2. Dedication & Acknowledgments
    const frontMatterHtml = `
      <div class="page front-matter dedication-page">
        <h2 class="section-title center">إهــــداء</h2>
        <div class="formal-text-box">
          <p class="poetic-text">إلى من بلغ الرسالة وأدى الأمانة، نبينا محمد صلى الله عليه وسلم...</p>
          <p class="poetic-text">إلى الوالدين الكريمين، نبع العطاء وسند المسيرة، حفظهما الله وأطال في عمرهما...</p>
          <p class="poetic-text">إلى كل من ساندنا بكلمة طيبة أو توجيه صادق في مسارنا الجامعي والعلمي.</p>
        </div>
      </div>
      <div class="page-break"></div>

      <div class="page front-matter acknowledgments-page">
        <h2 class="section-title center">شكر وعـرفـان</h2>
        <div class="formal-text-box">
          <p>الحمد لله الذي وفقنا وأعاننا على إتمام هذا العمل العلمي المتواضع.</p>
          <p>نتقدم بجزيل الشكر وخالص الامتنان إلى الأستاذ الفاضل المشرف: <strong>${project.supervisor_name}</strong>، على سعة صدره وتوجيهاته القيمة التي أنارت مسار هذا البحث.</p>
          <p>كما نتوجه بأسمى عبارات التقدير والاحترام إلى السادة أعضاء لجنة المناقشة الموقرة لتفضلهم بقراءة وتقييم هذه المذكرة وإثرائها بملاحظاتهم السديدة، ولكافة أساتذة ${project.faculty} بـ ${project.university}.</p>
        </div>
      </div>
      <div class="page-break"></div>
    `;

    // 3. Trilingual Abstracts
    const abstractsHtml = `
      <div class="page abstracts-page">
        <div class="abstract-block ar">
          <h2 class="section-title">ملخص المذكرة</h2>
          <p class="abstract-text">${abstracts.arabic.text}</p>
          <p class="keywords-line"><strong>الكلمات المفتاحية:</strong> ${abstracts.arabic.keywords.join(" · ")}</p>
        </div>

        <hr class="abstract-divider" />

        <div class="abstract-block fr" dir="ltr">
          <h2 class="section-title-ltr">Résumé</h2>
          <p class="abstract-text-ltr">${abstracts.french.text}</p>
          <p class="keywords-line-ltr"><strong>Mots-clés:</strong> ${abstracts.french.keywords.join(" · ")}</p>
        </div>

        <hr class="abstract-divider" />

        <div class="abstract-block en" dir="ltr">
          <h2 class="section-title-ltr">Abstract</h2>
          <p class="abstract-text-ltr">${abstracts.english.text}</p>
          <p class="keywords-line-ltr"><strong>Keywords:</strong> ${abstracts.english.keywords.join(" · ")}</p>
        </div>
      </div>
      <div class="page-break"></div>
    `;

    // 4. Table of Contents (TOC)
    const tocHtml = `
      <div class="page toc-page">
        <h2 class="section-title center">فهرس المحتويات العام</h2>
        <div class="toc-container">
          <div class="toc-item front"><span class="toc-title">شكر وعرفان وإهداء</span><span class="toc-dots"></span><span class="toc-pg">أ - ب</span></div>
          <div class="toc-item front"><span class="toc-title">الملخصات الثلاثية (عربي، فرنسي، إنجليزي)</span><span class="toc-dots"></span><span class="toc-pg">ج</span></div>
          <div class="toc-item major"><span class="toc-title">المقدمة العامة</span><span class="toc-dots"></span><span class="toc-pg">1</span></div>
          ${chapters
            .map(
              (c, idx) => `
            <div class="toc-item chapter-header">
              <span class="toc-title">الفصل ${idx + 1}: ${c.title}</span>
              <span class="toc-dots"></span>
              <span class="toc-pg">${idx * 15 + 7}</span>
            </div>
            ${c.sections
              .map(
                (s, si) => `
              <div class="toc-item section-sub">
                <span class="toc-title">${s.title}</span>
                <span class="toc-dots"></span>
                <span class="toc-pg">${idx * 15 + 7 + si * 4}</span>
              </div>
            `
              )
              .join("")}
          `
            )
            .join("")}
          <div class="toc-item major"><span class="toc-title">الخاتمة العامة والتوصيات</span><span class="toc-dots"></span><span class="toc-pg">${chapters.length * 15 + 8}</span></div>
          <div class="toc-item major"><span class="toc-title">قائمة المصادر والمراجع المعتمدة</span><span class="toc-dots"></span><span class="toc-pg">${chapters.length * 15 + 12}</span></div>
          <div class="toc-item major"><span class="toc-title">الملاحق والفهارس التكميلية</span><span class="toc-dots"></span><span class="toc-pg">${chapters.length * 15 + 16}</span></div>
        </div>
      </div>
      <div class="page-break"></div>
    `;

    // 5. General Introduction
    const gi = introConclusion.general_intro;
    const introHtml = `
      <div class="page intro-page">
        <h2 class="chapter-main-title">المقدمة العامة</h2>
        <div class="academic-body">
          <h3 class="subheading">أولاً: الإطار العام وأهمية البحث</h3>
          <p>${gi.context_and_importance}</p>

          <h3 class="subheading">ثانياً: الإشكالية المركزية والتساؤلات الفرعية</h3>
          <p><strong>الإشكالية الجوهرية:</strong> ${gi.problem_statement}</p>
          <p>وانطلاقاً من هذه الإشكالية، تطرح الدراسة الأسئلة الفرعية التالية:</p>
          <ul>
            ${gi.sub_questions.map((q) => `<li>${q}</li>`).join("")}
          </ul>

          <h3 class="subheading">ثالثاً: الفرضيات العلمية للدراسة</h3>
          <ul>
            ${gi.hypotheses.map((h) => `<li>${h}</li>`).join("")}
          </ul>

          <h3 class="subheading">رابعاً: دوافع اختيار الموضوع وأهدافه</h3>
          <p>${gi.reasons_for_choice}</p>
          <p>وتتمثل الأهداف الأساسية المتوخاة في:</p>
          <ul>
            ${gi.objectives.map((o) => `<li>${o}</li>`).join("")}
          </ul>

          <h3 class="subheading">خامساً: المنهج المعتمد وأدوات البحث العلمي</h3>
          <p>${gi.methodology_and_tools}</p>

          <h3 class="subheading">سادساً: حدود الدراسة والدراسات السابقة</h3>
          <p><strong>الحدود:</strong> المكانية (${gi.scope.spatial || "الجزائر"})، الزمانية (${gi.scope.temporal || "المرحلة الحالية"})، والموضوعية (${gi.scope.thematic || "المتغيرات المحددة"}).</p>
          <p><strong>الدراسات السابقة:</strong> ${gi.previous_studies_summary}</p>

          <h3 class="subheading">سابعاً: هيكل وبناء المذكرة</h3>
          <p>${gi.outline_narrative}</p>
        </div>
      </div>
      <div class="page-break"></div>
    `;

    // 6. Chapters Content
    const chaptersHtml = chapters
      .map((ch, idx) => {
        return `
        <div class="page chapter-page">
          <div class="chapter-header-banner">
            <span class="chapter-tag">الفصل ${idx + 1}</span>
            <h2 class="chapter-title-text">${ch.title}</h2>
          </div>
          <div class="academic-body">
            ${ch.sections
              .map((sec) => {
                return `
                <div class="section-block">
                  <h3 class="section-heading">${sec.title}</h3>
                  ${sec.paragraphs
                    .map((p) => {
                      const inTextCite = p.cites
                        .map((cid) => bibliography.in_text_mapping[cid] || `[${cid}]`)
                        .join(" ");
                      return `<p class="academic-p">${p.text} ${inTextCite ? `<span class="cite-tag">${inTextCite}</span>` : ""}</p>`;
                    })
                    .join("")}
                </div>
              `;
              })
              .join("")}
          </div>
        </div>
        <div class="page-break"></div>
      `;
      })
      .join("");

    // 7. General Conclusion
    const gc = introConclusion.general_conclusion;
    const conclusionHtml = `
      <div class="page conclusion-page">
        <h2 class="chapter-main-title">الخاتمة العامة والتوصيات</h2>
        <div class="academic-body">
          <h3 class="subheading">أولاً: خلاصة النتائج المتوصل إليها</h3>
          <ul>
            ${gc.findings.map((f) => `<li>${f}</li>`).join("")}
          </ul>

          <h3 class="subheading">ثانياً: التحقق من الفرضيات العلمية</h3>
          ${gc.hypotheses_evaluation
            .map(
              (h) => `
            <div class="hypothesis-card">
              <p><strong>الفرضية:</strong> "${h.hypothesis}"</p>
              <p><strong>الحكم العلمي:</strong> <span class="verdict-${h.verdict}">${h.verdict === "confirmed" ? "محققة كلياً" : h.verdict === "refuted" ? "منفية" : "محققة جزئياً"}</span></p>
              <p class="explanation">${h.explanation}</p>
            </div>
          `
            )
            .join("")}

          <h3 class="subheading">ثالثاً: التوصيات والمقترحات العملية</h3>
          <ul>
            ${gc.recommendations.map((r) => `<li>${r}</li>`).join("")}
          </ul>

          <h3 class="subheading">رابعاً: آفاق البحث والدراسات المستقبلية</h3>
          <ul>
            ${gc.future_perspectives.map((fp) => `<li>${fp}</li>`).join("")}
          </ul>
        </div>
      </div>
      <div class="page-break"></div>
    `;

    // 8. Bibliography
    const referencesHtml = `
      <div class="page references-page">
        <h2 class="chapter-main-title">قائمة المصادر والمراجع المعتمدة</h2>
        <p class="citation-method-note">تم توثيق وترتيب المراجع وفق المعيار الأكاديمي المعتمد: <strong>${profile.citation.style}</strong></p>

        <div class="references-list-categorized">
          ${
            bibliography.categorized.books_ar.length > 0
              ? `
            <h3 class="ref-category-title">أولاً: الكتب والمؤلفات العامة</h3>
            <ol class="ref-list">
              ${bibliography.categorized.books_ar.map((b) => `<li>${b.citation_text}</li>`).join("")}
            </ol>
          `
              : ""
          }

          ${
            bibliography.categorized.articles_asjp.length > 0
              ? `
            <h3 class="ref-category-title">ثانياً: الدوريات والمقالات العلمية المحكمة (ASJP)</h3>
            <ol class="ref-list">
              ${bibliography.categorized.articles_asjp.map((a) => `<li>${a.citation_text}</li>`).join("")}
            </ol>
          `
              : ""
          }

          ${
            bibliography.categorized.official_documents.length > 0
              ? `
            <h3 class="ref-category-title">ثالثاً: التقارير والوثائق الرسمية والنصوص القانونية</h3>
            <ol class="ref-list">
              ${bibliography.categorized.official_documents.map((o) => `<li>${o.citation_text}</li>`).join("")}
            </ol>
          `
              : ""
          }

          ${
            bibliography.categorized.foreign_references.length > 0
              ? `
            <h3 class="ref-category-title">رابعاً: المراجع باللغات الأجنبية (Références en langues étrangères)</h3>
            <ol class="ref-list" dir="ltr">
              ${bibliography.categorized.foreign_references.map((f) => `<li>${f.citation_text}</li>`).join("")}
            </ol>
          `
              : ""
          }
        </div>
      </div>
    `;

    // Complete HTML Document formatted with Office Word A4 styles
    const fullHtml = `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>${project.title}</title>
  <style>
    @page Section1 {
      size: 595.3pt 841.9pt; /* A4 */
      margin: 70.85pt 70.85pt 70.85pt 85.05pt; /* Top/Bottom: 25mm, Start: 30mm, End: 25mm */
      mso-header-margin: 35.4pt;
      mso-footer-margin: 35.4pt;
    }
    div.Section1 { page: Section1; }
    body {
      font-family: 'Amiri', 'Traditional Arabic', 'Times New Roman', serif;
      direction: rtl;
      text-align: right;
      color: #111827;
      line-height: 1.6;
      font-size: 13pt;
      background-color: #ffffff;
      margin: 0;
      padding: 0;
    }
    .page-break { page-break-after: always; clear: both; }
    .center { text-align: center; }
    .official-header { text-align: center; margin-bottom: 25px; border-bottom: 2px solid #059669; padding-bottom: 15px; }
    .republic-text { font-size: 13pt; font-weight: bold; margin: 0; color: #1e293b; }
    .ministry-text { font-size: 12pt; font-weight: bold; margin: 4px 0; color: #334155; }
    .univ-name { font-size: 15pt; font-weight: bold; color: #047857; margin: 6px 0; }
    .faculty-name { font-size: 13pt; margin: 4px 0; color: #1e293b; }
    .dept-name { font-size: 11pt; color: #475569; }
    .thesis-badge { text-align: center; margin: 20px 0; }
    .degree-badge { font-size: 14pt; font-weight: bold; color: #065f46; margin: 0; }
    .specialty-text { font-size: 12pt; margin: 4px 0; }
    .title-frame { border: 3px double #059669; background-color: #f0fdf4; padding: 25px; margin: 30px 0; border-radius: 8px; text-align: center; }
    .theme-label { font-size: 12pt; color: #047857; margin-bottom: 5px; font-weight: bold; }
    .thesis-main-title { font-size: 20pt; font-weight: bold; color: #064e3b; margin: 0; line-height: 1.4; }
    .actors-grid { display: flex; justify-content: space-between; margin: 35px 10px; }
    .actor-col { width: 48%; }
    .actor-role { font-size: 11pt; color: #475569; margin-bottom: 4px; }
    .actor-name { font-size: 13pt; color: #0f172a; margin: 0; }
    .jury-section { margin: 25px 0; padding: 12px; background-color: #f8fafc; border-radius: 6px; font-size: 11pt; }
    .academic-year-box { text-align: center; margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 12px; font-size: 12pt; font-weight: bold; color: #334155; }
    .section-title { font-size: 18pt; font-weight: bold; color: #047857; margin-bottom: 20px; }
    .chapter-main-title { font-size: 20pt; font-weight: bold; color: #047857; border-bottom: 2px solid #10b981; padding-bottom: 10px; margin-bottom: 25px; text-align: center; }
    .chapter-header-banner { background-color: #ecfdf5; border-right: 5px solid #059669; padding: 15px; margin-bottom: 25px; border-radius: 4px; }
    .chapter-tag { font-size: 11pt; font-weight: bold; color: #047857; text-transform: uppercase; }
    .chapter-title-text { font-size: 18pt; font-weight: bold; color: #064e3b; margin: 5px 0 0 0; }
    .subheading { font-size: 14pt; font-weight: bold; color: #1e293b; margin-top: 20px; margin-bottom: 10px; }
    .section-heading { font-size: 15pt; font-weight: bold; color: #0f766e; margin-top: 25px; margin-bottom: 12px; }
    .academic-p { text-align: justify; text-justify: inter-word; line-height: 1.7; margin-bottom: 14px; text-indent: 20px; }
    .cite-tag { color: #047857; font-weight: bold; font-size: 10.5pt; }
    .toc-container { margin-top: 20px; }
    .toc-item { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 8px; font-size: 12pt; }
    .toc-item.major { font-weight: bold; color: #047857; margin-top: 10px; }
    .toc-item.chapter-header { font-weight: bold; color: #065f46; margin-top: 12px; }
    .toc-item.section-sub { padding-right: 20px; color: #334155; }
    .toc-dots { flex: 1; border-bottom: 1px dotted #94a3b8; margin: 0 10px; }
    .ref-category-title { font-size: 13.5pt; font-weight: bold; color: #047857; margin-top: 20px; border-bottom: 1px solid #cbd5e1; padding-bottom: 5px; }
    .ref-list { padding-right: 25px; line-height: 1.6; }
    .ref-list li { margin-bottom: 8px; text-align: justify; }
    .hypothesis-card { background-color: #f8fafc; border: 1px solid #e2e8f0; border-right: 4px solid #059669; padding: 12px; margin-bottom: 12px; border-radius: 4px; }
    .verdict-confirmed { color: #047857; font-weight: bold; }
    .verdict-refuted { color: #b91c1c; font-weight: bold; }
    .verdict-partially_confirmed { color: #d97706; font-weight: bold; }
  </style>
</head>
<body>
  <div class="Section1">
    ${coverHtml}
    ${frontMatterHtml}
    ${abstractsHtml}
    ${tocHtml}
    ${introHtml}
    ${chaptersHtml}
    ${conclusionHtml}
    ${referencesHtml}
  </div>
</body>
</html>`;

    return {
      thesis_id: project.id,
      title: project.title,
      html_document: fullHtml,
      total_words: totalWords,
      total_pages_estimate: totalPagesEstimate,
      chapters_count: chapters.length,
      sources_count: sources.length,
      assembled_at: new Date().toISOString(),
    };
  }
}
