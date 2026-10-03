// Sahla CV & Cover Letter Engine (منشئ السير الذاتية ورسائل التحفيز)

class CVBuilderManager {
  constructor() {
    this.currentLanguage = 'ar'; // 'ar', 'fr', 'en'
    this.currentTemplate = 'admin'; // 'admin', 'modern', 'executive'
    this.sampleData = {
      fullName: 'أمين بلحاج',
      jobTitle: 'مهندس برمجيات ومسير أنظمة معلومات',
      phone: '0661 23 45 67',
      email: 'amine.belhadj@email.dz',
      address: 'حي 1000 مسكن، باب الزوار',
      wilaya: 'الجزائر العاصمة',
      birthDate: '15/08/1996',
      militaryStatus: 'معفى من التزامات الخدمة الوطنية (بطاقة صفراء)',
      drivingLicense: 'صنف ب (Permis B)',
      summary: 'مهندس برمجيات ذو خبرة تفوق 5 سنوات في تطوير الأنظمة الرقمية وإدارة قواعد البيانات. شغوف بالتحول الرقمي للخدمات، أتمتع بقدرة عالية على القيادة والتواصل وحل المشكلات المعقدة والعمل ضمن فرق متعددة التخصصات.',
      experiences: [
        {
          role: 'مهندس تطوير برمجيات أول',
          company: 'مؤسسة الحلول الرقمية الذكية (Sarl)',
          period: '2022 - حتى الآن',
          description: 'قيادة فريق برمجة وتطوير منصات إدارية محلية، وتحسين أداء التطبيقات بنسبة 40% وتكامل الأنظمة مع بوابات الدفع الإلكتروني الجزائرية.'
        },
        {
          role: 'مطور واجهات ومواقع ويب',
          company: 'وكالة الإبداع للخدمات الإعلانية',
          period: '2019 - 2022',
          description: 'تصميم وتنفيذ أكثر من 25 موقعاً وتطبيقاً إدارياً وتجارياً متوافقاً مع الهواتف الذكية مع مراعاة سرعة التحميل وتجربة المستخدم.'
        }
      ],
      education: [
        {
          degree: 'شهادة ماستر أكاديمي في هندسة البرمجيات',
          school: 'جامعة العلوم والتكنولوجيا هواري بومدين (USTHB)',
          year: '2019'
        },
        {
          degree: 'شهادة ليسانس في الإعلام الآلي',
          school: 'جامعة العلوم والتكنولوجيا هواري بومدين',
          year: '2017'
        },
        {
          degree: 'شهادة البكالوريا - شعبة تقني رياضي',
          school: 'ثانوية العقيد لطفي',
          year: '2014'
        }
      ],
      skills: ['إدارة المشاريع الرقمية', 'Next.js & React', 'PostgreSQL & SQL', 'تطوير واجهات API', 'الأمن السيبراني وحماية البيانات', 'حل النزاعات والعمل الجماعي'],
      languages: [
        { lang: 'العربية', level: 'اللغة الأم (إتقان تام)' },
        { lang: 'الفرنسية', level: 'ممتاز (قراءة وكتابة ومحادثة)' },
        { lang: 'الإنجليزية', level: 'جيد جداً (لغة مهنية وتقنية)' }
      ]
    };
  }

  // ترجمة العناوين الرئيسية حسب اللغة المختارة
  getLabels(lang) {
    const labels = {
      ar: {
        personalInfo: 'المعلومات الشخصية',
        summary: 'الملف الشخصي والهدف المهني',
        experiences: 'الخبرة المهنية',
        education: 'التعليم والشهادات',
        skills: 'المهارات والقدرات',
        languages: 'اللغات',
        military: 'الوضعية تجاه الخدمة الوطنية',
        license: 'رخصة السياقة',
        phone: 'الهاتف',
        email: 'البريد الإلكتروني',
        address: 'العنوان',
        wilaya: 'الولاية'
      },
      fr: {
        personalInfo: 'Informations Personnelles',
        summary: 'Profil Professionnel',
        experiences: 'Expérience Professionnelle',
        education: 'Formation & Diplômes',
        skills: 'Compétences',
        languages: 'Langues',
        military: 'Situation vis-à-vis du service national',
        license: 'Permis de conduire',
        phone: 'Téléphone',
        email: 'Email',
        address: 'Adresse',
        wilaya: 'Wilaya'
      },
      en: {
        personalInfo: 'Personal Information',
        summary: 'Professional Summary',
        experiences: 'Work Experience',
        education: 'Education & Qualifications',
        skills: 'Skills & Competencies',
        languages: 'Languages',
        military: 'National Service Status',
        license: 'Driving License',
        phone: 'Phone',
        email: 'Email',
        address: 'Address',
        wilaya: 'Wilaya'
      }
    };
    return labels[lang] || labels.ar;
  }

  // توليد كود HTML الكامل للسيرة الذاتية بحجم A4
  renderCVHTML(data, template = this.currentTemplate, lang = this.currentLanguage) {
    const lbl = this.getLabels(lang);
    const dir = lang === 'ar' ? 'rtl' : 'ltr';

    if (template === 'admin') {
      // 1. القالب الإداري الجزائري الرسمي (Classic Algerian Clean)
      return `
        <div class="cv-a4-sheet cv-template-admin" dir="${dir}">
          <header class="cv-admin-header">
            <h1 class="cv-name">${data.fullName}</h1>
            <p class="cv-title-tag">${data.jobTitle}</p>
            <div class="cv-contacts-bar">
              <span>📞 ${data.phone}</span>
              <span>✉️ ${data.email}</span>
              <span>📍 ${data.address} - ${data.wilaya}</span>
            </div>
            <div class="cv-official-tags">
              ${data.militaryStatus ? `<span class="badge-tag">🎖️ ${data.militaryStatus}</span>` : ''}
              ${data.drivingLicense ? `<span class="badge-tag">🚗 ${data.drivingLicense}</span>` : ''}
              ${data.birthDate ? `<span class="badge-tag">📅 تاريخ الميلاد: ${data.birthDate}</span>` : ''}
            </div>
          </header>

          <section class="cv-section">
            <h2 class="cv-section-title">${lbl.summary}</h2>
            <p class="cv-summary-text">${data.summary}</p>
          </section>

          <section class="cv-section">
            <h2 class="cv-section-title">${lbl.experiences}</h2>
            <div class="cv-items-list">
              ${data.experiences.map(exp => `
                <div class="cv-item">
                  <div class="cv-item-head">
                    <span class="cv-item-title">${exp.role}</span>
                    <span class="cv-item-period">${exp.period}</span>
                  </div>
                  <div class="cv-item-sub">${exp.company}</div>
                  <p class="cv-item-desc">${exp.description}</p>
                </div>
              `).join('')}
            </div>
          </section>

          <section class="cv-section">
            <h2 class="cv-section-title">${lbl.education}</h2>
            <div class="cv-items-list">
              ${data.education.map(edu => `
                <div class="cv-item">
                  <div class="cv-item-head">
                    <span class="cv-item-title">${edu.degree}</span>
                    <span class="cv-item-period">${edu.year}</span>
                  </div>
                  <div class="cv-item-sub">${edu.school}</div>
                </div>
              `).join('')}
            </div>
          </section>

          <div class="cv-two-cols">
            <section class="cv-section">
              <h2 class="cv-section-title">${lbl.skills}</h2>
              <ul class="cv-skills-grid">
                ${data.skills.map(s => `<li>✓ ${s}</li>`).join('')}
              </ul>
            </section>
            <section class="cv-section">
              <h2 class="cv-section-title">${lbl.languages}</h2>
              <ul class="cv-langs-list">
                ${data.languages.map(l => `<li><strong>${l.lang}:</strong> ${l.level}</li>`).join('')}
              </ul>
            </section>
          </div>
        </div>
      `;
    } else if (template === 'modern') {
      // 2. القالب العصري (Modern 2-Column Sidebar)
      return `
        <div class="cv-a4-sheet cv-template-modern" dir="${dir}">
          <aside class="cv-modern-sidebar">
            <div class="cv-sidebar-avatar">
              <div class="avatar-circle">${data.fullName.slice(0, 2)}</div>
            </div>
            <h2 class="cv-sidebar-name">${data.fullName}</h2>
            <p class="cv-sidebar-title">${data.jobTitle}</p>

            <div class="cv-sidebar-block">
              <h3>${lbl.personalInfo}</h3>
              <p>📞 ${data.phone}</p>
              <p>✉️ ${data.email}</p>
              <p>📍 ${data.wilaya}</p>
              ${data.drivingLicense ? `<p>🚗 ${data.drivingLicense}</p>` : ''}
              ${data.militaryStatus ? `<p>🎖️ ${data.militaryStatus}</p>` : ''}
            </div>

            <div class="cv-sidebar-block">
              <h3>${lbl.skills}</h3>
              <div class="skill-pills">
                ${data.skills.map(s => `<span class="skill-pill">${s}</span>`).join('')}
              </div>
            </div>

            <div class="cv-sidebar-block">
              <h3>${lbl.languages}</h3>
              ${data.languages.map(l => `
                <div class="lang-row">
                  <span>${l.lang}</span>
                  <small>${l.level}</small>
                </div>
              `).join('')}
            </div>
          </aside>

          <main class="cv-modern-main">
            <section class="cv-modern-section">
              <h2 class="modern-sec-title">${lbl.summary}</h2>
              <p>${data.summary}</p>
            </section>

            <section class="cv-modern-section">
              <h2 class="modern-sec-title">${lbl.experiences}</h2>
              ${data.experiences.map(exp => `
                <div class="modern-timeline-item">
                  <div class="timeline-dot"></div>
                  <div class="timeline-content">
                    <div class="timeline-head">
                      <strong>${exp.role}</strong>
                      <span class="timeline-date">${exp.period}</span>
                    </div>
                    <div class="timeline-company">${exp.company}</div>
                    <p>${exp.description}</p>
                  </div>
                </div>
              `).join('')}
            </section>

            <section class="cv-modern-section">
              <h2 class="modern-sec-title">${lbl.education}</h2>
              ${data.education.map(edu => `
                <div class="modern-timeline-item">
                  <div class="timeline-dot"></div>
                  <div class="timeline-content">
                    <div class="timeline-head">
                      <strong>${edu.degree}</strong>
                      <span class="timeline-date">${edu.year}</span>
                    </div>
                    <div class="timeline-company">${edu.school}</div>
                  </div>
                </div>
              `).join('')}
            </section>
          </main>
        </div>
      `;
    } else {
      // 3. القالب التنفيذي (Executive Header)
      return `
        <div class="cv-a4-sheet cv-template-executive" dir="${dir}">
          <header class="cv-exec-header">
            <div class="exec-brand-bar"></div>
            <div class="exec-head-content">
              <h1 class="exec-name">${data.fullName}</h1>
              <p class="exec-title">${data.jobTitle}</p>
              <div class="exec-contacts">
                <span>📍 ${data.address} - ${data.wilaya}</span>
                <span>📞 ${data.phone}</span>
                <span>✉️ ${data.email}</span>
              </div>
            </div>
          </header>

          <div class="exec-body">
            <section class="exec-section">
              <h2 class="exec-sec-title">${lbl.summary}</h2>
              <p class="exec-summary">${data.summary}</p>
            </section>

            <section class="exec-section">
              <h2 class="exec-sec-title">${lbl.experiences}</h2>
              ${data.experiences.map(exp => `
                <div class="exec-exp-box">
                  <div class="exec-exp-head">
                    <span class="exec-role">${exp.role} — <em>${exp.company}</em></span>
                    <span class="exec-period">${exp.period}</span>
                  </div>
                  <p class="exec-desc">${exp.description}</p>
                </div>
              `).join('')}
            </section>

            <section class="exec-section">
              <h2 class="exec-sec-title">${lbl.education}</h2>
              ${data.education.map(edu => `
                <div class="exec-edu-box">
                  <span class="exec-degree">${edu.degree}</span>
                  <span class="exec-school">${edu.school} (${edu.year})</span>
                </div>
              `).join('')}
            </section>

            <div class="exec-footer-row">
              <div class="exec-col">
                <h3 class="exec-sub-title">${lbl.skills}</h3>
                <div class="exec-tags">
                  ${data.skills.map(s => `<span class="exec-tag">${s}</span>`).join('')}
                </div>
              </div>
              <div class="exec-col">
                <h3 class="exec-sub-title">${lbl.languages}</h3>
                <ul class="exec-langs">
                  ${data.languages.map(l => `<li><strong>${l.lang}:</strong> ${l.level}</li>`).join('')}
                </ul>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  }

  // توليد رسالة تحفيز بالذكاء الاصطناعي (AI Cover Letter / Lettre de Motivation)
  generateMotivationLetter(data, targetCompany, targetRole, lang = 'ar') {
    if (lang === 'fr') {
      return `Objet : Candidature au poste de ${targetRole || data.jobTitle}\n\nMadame, Monsieur,\n\nActuellement à la recherche d'une nouvelle opportunité professionnelle, c'est avec un vif intérêt que je vous soumets ma candidature pour le poste de ${targetRole || data.jobTitle} au sein de ${targetCompany || 'votre prestigieuse entreprise'}.\n\nTitulaire d'un diplôme en ${data.education[0]?.degree || 'mon domaine'} et fort d'une expérience de plusieurs années notamment chez ${data.experiences[0]?.company || 'mon précédent employeur'}, j'ai acquis une solide maîtrise de compétences clés telles que : ${data.skills.slice(0, 3).join(', ')}.\n\nRigoureux, dynamique et doté d'un excellent esprit d'équipe, je suis convaincu que mon profil saura répondre à vos exigences et contribuer activement à vos futurs succès.\n\nJe reste à votre entière disposition pour tout entretien.\n\nVeuillez agréer, Madame, Monsieur, l'expression de mes salutations distinguées.\n\n${data.fullName}\nTél : ${data.phone}`;
    }

    return `إلى السيد / المدير العام لمؤسسة ${targetCompany || '[اسم المؤسسة أو الشركة]'}\nالموضوع: ترشح لشغل منصب ${targetRole || data.jobTitle}\n\nيشرفني أن أتقدم إلى سيادتكم المحترمة بطلبي هذا قصد إبداء رغبتي الصادقة في الالتحاق بفريق عملكم المتميز لشغل منصب ${targetRole || data.jobTitle}.\n\nإن حصولي على ${data.education[0]?.degree || 'مؤهلات علمية عليا'} وتجربتي الميدانية في ${data.experiences[0]?.company || 'ميدان التخصص'}، مكنتني من اكتساب مهارات عملية متينة في مجالات: ${data.skills.slice(0, 3).join('، ')}، فضلاً عن قدرتي العالية على التأقلم والعمل تحت الضغط وتقديم حلول مبتكرة تسهم في تطوير الأداء.\n\nإن السمعة المرموقة التي تحظى بها مؤسستكم وطموحاتها الرائدة هي ما يدفعني بقوة للانضمام إليكم والمساهمة بكل تفانٍ في تحقيق أهدافكم المسطرة.\n\nفي انتظار فرصة لقاء سيادتكم في مقابلة عمل، تفضلوا سيدي المدير بقبول فائق عبارات التقدير والاحترام.\n\nالمعني بالأمر: ${data.fullName}\nرقم الهاتف: ${data.phone}\nالعنوان: ${data.address} - ${data.wilaya}`;
  }
}

const sahlaCV = new CVBuilderManager();
