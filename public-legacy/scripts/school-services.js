// Sahla School & Academic Engine (الخدمات المدرسية والبحوث بالذكاء الاصطناعي وبنك الامتحانات)

class SchoolServicesManager {
  constructor() {
    this.currentLevel = 'ALL';
    this.currentSubject = 'ALL';
    this.currentResearchTopic = RESEARCH_TOPICS_DATABASE[0];
  }

  // توليد صفحة الواجهة الرسمية (Page de Garde) والبحث الكامل A4
  renderResearchHTML(researchData) {
    const isArabic = researchData.language === 'ar';
    const dir = isArabic ? 'rtl' : 'ltr';

    return `
      <div class="printable-area research-document-container" dir="${dir}">
        <!-- صفحة الواجهة الرسمية (Page de Garde) -->
        <div class="research-cover-page">
          <div class="cover-header">
            <h3>${isArabic ? 'الجمهورية الجزائرية الديمقراطية الشعبية' : 'République Algérienne Démocratique et Populaire'}</h3>
            <h4>${isArabic ? 'وزارة التربية الوطنية / وزارة التعليم العالي والبحث العلمي' : "Ministère de l'Éducation Nationale / Enseignement Supérieur"}</h4>
            <p>${researchData.schoolName || (isArabic ? 'ثانوية العقيد لطفي' : 'Lycée Colonel Lotfi')} — ${researchData.wilaya || 'الجزائر'}</p>
          </div>

          <div class="cover-emblem">🇩🇿</div>

          <div class="cover-title-box">
            <span class="cover-tag">${isArabic ? 'بحث دراسي في مادة:' : 'Exposé / Recherche :' } ${researchData.subjectCategory || (isArabic ? 'تاريخ وجغرافيا' : 'Sciences')}</span>
            <h1 class="cover-main-title">${researchData.title}</h1>
            <p class="cover-sub-level">${isArabic ? 'المستوى الدراسي:' : 'Niveau :'} <strong>${researchData.level}</strong></p>
          </div>

          <div class="cover-footer-grid">
            <div class="cover-person-box">
              <span class="box-label">${isArabic ? 'من إعداد التلميذ(ة) / الطالب(ة):' : 'Réalisé par :'}</span>
              <strong class="person-name">${researchData.studentName || (isArabic ? 'محمد أمين رحماني' : 'Mohamed Amine Rahmani')}</strong>
              <small>${researchData.className || (isArabic ? 'السنة الثالثة ثانوي' : '3ème Année Secondaire')}</small>
            </div>

            <div class="cover-person-box">
              <span class="box-label">${isArabic ? 'تحت إشراف الأستاذ(ة) المحترم(ة):' : 'Sous la direction de :'}</span>
              <strong class="person-name">${researchData.teacherName || (isArabic ? 'أ. بلقاسم مزيان' : 'Prof. B. Meziene')}</strong>
              <small>${isArabic ? 'أستاذ المادة' : 'Enseignant'}</small>
            </div>
          </div>

          <div class="cover-year-tag">
            ${isArabic ? 'السنة الدراسية:' : 'Année Scolaire :'} <strong>2025 / 2026</strong>
          </div>
        </div>

        <!-- فاصل صفحات للطباعة A4 -->
        <div class="page-break"></div>

        <!-- متن البحث والمحاور والخاتمة والمراجع -->
        <div class="research-body-page">
          <header class="research-body-header">
            <h2>${researchData.title}</h2>
            <div class="plan-summary-badge">${isArabic ? 'خطة البحث والمحاور الأساسية' : 'Plan de Recherche'}</div>
          </header>

          <div class="research-plan-box">
            <h3>${isArabic ? 'فهرس عناصر البحث:' : 'Sommaire :'}</h3>
            <ol>
              ${researchData.plan.map(p => `<li>${p}</li>`).join('')}
            </ol>
          </div>

          <div class="research-text-section">
            <h3>${isArabic ? 'مقدمة ومدخل عام:' : 'Introduction Générale :'}</h3>
            <p class="research-paragraph">${researchData.summaryContent}</p>
          </div>

          <div class="research-text-section">
            <h3>${isArabic ? 'العرض والمناقشة والتحليل:' : 'Développement et Analyse :'}</h3>
            <p class="research-paragraph">
              ${isArabic ? 
                `تُبرز المعطيات الميدانية والوثائق المرجعية أهمية هذا الموضوع وأبعاده الاستراتيجية في الواقع الجزائري المعاصر. ومن خلال تتبع المسارات التاريخية والتقنية، نلاحظ توافقاً وثيقاً مع الرؤية الوطنية التي تسعى إلى ترسيخ المعرفة وبناء أجيال واعية بالرهانات الوطنية والإقليمية والدولية.
                وقد تضافرت الجهود المؤسساتية والأكاديمية لتقديم قراءات معمقة تستشرف الآفاق المستقبلية وتضع الحلول العلمية القابلة للتطبيق والمستدامة.`
                : 
                `L'analyse approfondie des données empiriques et des sources documentaires démontre l'importance capitale de cette thématique dans le contexte actuel. Les résultats soulignent la nécessité d'une approche intégrée conciliant rigueur méthodologique, impératifs d'innovation et conformité aux standards académiques contemporains.`
              }
            </p>
          </div>

          <div class="research-text-section">
            <h3>${isArabic ? 'خاتمة واستنتاجات:' : 'Conclusion :'}</h3>
            <p class="research-paragraph">
              ${isArabic ? 
                `وفي الختام، يتضح جلياً أن البحث في هذا المجال يفتح آفاقاً رحبة لمزيد من التعمق والدراسات التكميلية. إن الاستثمار في المعرفة هو الأساس المتين لكل نهضة حضارية وتنموية، ويبقى واجب الأجيال الصاعدة مواصلة درب الجد والاجتهاد لإعلاء راية العلم والوطن.`
                : 
                `En conclusion, cette étude met en exergue les potentialités remarquables et les perspectives prometteuses dans ce domaine. La synergie entre rigueur scientifique et vision stratégique demeure le garant essentiel de tout progrès pérenne.`
              }
            </p>
          </div>

          <div class="research-references-box">
            <h4>${isArabic ? 'المراجع والمصادر المعتمدة:' : 'Références Bibliographiques :'}</h4>
            <ul>
              <li>1. ${isArabic ? 'منشورات وزارة التربية الوطنية والديوان الوطني للمطبوعات المدرسية (ONPS - الجزائر).' : 'Publications officielles et rapports académiques.'}</li>
              <li>2. ${isArabic ? 'المركز الوطني للبحث في الأنثروبولوجيا الاجتماعية والثقافية (CRASC - وهران).' : 'Recherches et études documentées.'}</li>
              <li>3. ${isArabic ? 'المكتبة الوطنية الجزائرية (الحامة - الجزائر العاصمة).' : 'Archives et bibliothèque nationale d’Algérie.'}</li>
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  // توليد كود HTML لعرض الموضوع أو الحل النموذجي للامتحان
  renderExamHTML(exam, viewMode = 'questions') {
    const isQuestions = viewMode === 'questions';
    return `
      <div class="printable-area exam-document-sheet" dir="rtl">
        <header class="exam-header-banner">
          <div class="exam-header-top">
            <span>الجمهورية الجزائرية الديمقراطية الشعبية</span>
            <span>الديوان الوطني للامتحانات والمسابقات (ONEC)</span>
          </div>
          <div class="exam-main-title">
            <h2>${exam.title}</h2>
            <div class="exam-tags-row">
              <span class="exam-tag">المادة: <strong>${exam.subject}</strong></span>
              <span class="exam-tag">الشعبة/المستوى: <strong>${exam.level}</strong></span>
              <span class="exam-tag">المدة: <strong>${exam.duration}</strong></span>
              <span class="exam-tag">المعامل: <strong>${exam.coefficient}</strong></span>
              <span class="exam-mode-badge ${isQuestions ? 'badge-subject' : 'badge-solution'}">
                ${isQuestions ? '📄 نص الموضوع الرسمي' : '✅ الحل النموذجي وسلّم التنقيط'}
              </span>
            </div>
          </div>
        </header>

        <div class="exam-body-content">
          <pre class="exam-formatted-text">${isQuestions ? exam.questionsText : exam.solutionsText}</pre>
        </div>

        <footer class="exam-footer-banner">
          <span>الصفحة 1 من 1</span>
          <span>منصة سهلة للخدمات الرقمية للمكتبات والكيوسكات 🇩🇿</span>
          <span>بالتوفيق والنجاح لجميع المترشحين</span>
        </footer>
      </div>
    `;
  }
}

const sahlaSchool = new SchoolServicesManager();
