// Sahla Tax Declarations Engine (محرك التصاريح الجبائية الرسمية G50 و G12 - DGI)

class TaxDeclarationsManager {
  constructor() {
    this.currentG50 = JSON.parse(JSON.stringify(DEFAULT_G50_SAMPLE));
    this.currentG12 = JSON.parse(JSON.stringify(DEFAULT_G12_SAMPLE));
    this.activeType = 'G50'; // 'G50' أو 'G12'
  }

  // حساب مستحقات التصريح الجبائي G50
  calculateG50(data) {
    const ca9 = parseFloat(data.caTva9) || 0;
    const ca19 = parseFloat(data.caTva19) || 0;
    const caEx = parseFloat(data.caExonere) || 0;
    const deductions = parseFloat(data.deductionsAchats) || 0;
    const precompteAnt = parseFloat(data.precompteAnterieur) || 0;

    const tva9 = Math.round(ca9 * 0.09);
    const tva19 = Math.round(ca19 * 0.19);
    const tvaBrute = tva9 + tva19;
    const totalDeductions = deductions + precompteAnt;
    const tvaNette = Math.max(0, tvaBrute - totalDeductions);
    const precompteNouveau = Math.max(0, totalDeductions - tvaBrute);

    const tapRate = parseFloat(data.tapRate) || 0;
    const caTap = parseFloat(data.caTap) || (ca9 + ca19 + caEx);
    const tap = Math.round(caTap * (tapRate / 100));

    const irgSalaires = parseFloat(data.irgSalairesRetenue) || 0;
    const loyersRetenue = parseFloat(data.loyersRetenue) || 0;
    const timbre = parseFloat(data.droitsTimbre) || 0;

    const totalGeneral = tvaNette + tap + irgSalaires + loyersRetenue + timbre;

    return {
      tva9,
      tva19,
      tvaBrute,
      totalDeductions,
      tvaNette,
      precompteNouveau,
      tap,
      irgSalaires,
      loyersRetenue,
      timbre,
      totalGeneral
    };
  }

  // حساب مستحقات تصريح الضريبة الجزافية الوحيدة G12 (IFU)
  calculateG12(data) {
    const caComm = parseFloat(data.caCommercial) || 0;
    const caServ = parseFloat(data.caServices) || 0;

    const impotComm = Math.round(caComm * 0.05); // 5% تجارة
    const impotServ = Math.round(caServ * 0.12); // 12% خدمات

    const totalCalcule = impotComm + impotServ;
    const MINIMUM_LEGAL = 10000; // الحد الأدنى القانوني 10,000 دج
    const totalDu = Math.max(MINIMUM_LEGAL, totalCalcule);
    const isMinApplied = totalCalcule < MINIMUM_LEGAL;

    const isTranches = data.paymentMode === 'TRANCHES';
    const tranche1 = isTranches ? Math.round(totalDu * 0.5) : totalDu;
    const tranche2 = isTranches ? Math.round(totalDu * 0.25) : 0;
    const tranche3 = isTranches ? (totalDu - tranche1 - tranche2) : 0;

    return {
      impotComm,
      impotServ,
      totalCalcule,
      MINIMUM_LEGAL,
      totalDu,
      isMinApplied,
      isTranches,
      tranche1,
      tranche2,
      tranche3
    };
  }

  // توليد كود HTML للتصريح الجبائي الرسمي Série G N° 50 (A4)
  renderG50HTML(data) {
    const calc = this.calculateG50(data);
    const tafqeetAr = typeof numberToArabicWords === 'function' ? numberToArabicWords(calc.totalGeneral) : '';
    const tafqeetFr = typeof numberToFrenchWords === 'function' ? numberToFrenchWords(calc.totalGeneral) : '';

    return `
      <div class="printable-area tax-g50-sheet" dir="rtl">
        <!-- ترويسة وزارة المالية والمديرية العامة للضرائب -->
        <header class="dgi-header-banner">
          <div class="dgi-top-row">
            <span>الجمهورية الجزائرية الديمقراطية الشعبية</span>
            <span>RÉPUBLIQUE ALGÉRIENNE DÉMOCRATIQUE ET POPULAIRE</span>
          </div>
          <div class="dgi-sub-row">
            <strong>وزارة المالية · المديرية العامة للضرائب (DGI)</strong>
            <span>MINISTÈRE DES FINANCES · DIRECTION GÉNÉRALE DES IMPÔTS</span>
          </div>
          <div class="dgi-title-box">
            <h1>تصريح بالضرائب والرسوم المقتطعة من المصدر · Série G N° 50</h1>
            <p>DÉCLARATION MENSUELLE / TRIMESTRIELLE DE VERSEMENT DES IMPÔTS ET TAXES</p>
            <div class="period-badge">
              <span>الفترة المصرح بها: <strong>${data.periodValue} (${data.periodMonthYear})</strong></span>
              <span>النظام الجبائي: <strong>${data.regime}</strong></span>
            </div>
          </div>
        </header>

        <!-- بيانات المصالح الجبائية والمكلف بالضريبة -->
        <div class="dgi-ident-grid">
          <div class="dgi-admin-box">
            <span class="box-title">المصالح الجبائية المختصة:</span>
            <div>المديرية الولائية: <strong>${data.directionWilaya}</strong></div>
            <div>قباضة الضرائب: <strong>${data.recette}</strong></div>
            <div>المركز / المفتشية: <strong>${data.inspection}</strong></div>
          </div>

          <div class="dgi-taxpayer-box">
            <span class="box-title">هوية المكلف بالضريبة (Redevable):</span>
            <div class="taxpayer-name"><strong>${data.companyName}</strong></div>
            <div>النشاط: ${data.activity}</div>
            <div>العنوان: ${data.address}</div>
            <div class="ids-row">
              <span>NIF: <strong class="mono-code">${data.nif}</strong></span>
              <span>NIS: <strong class="mono-code">${data.nis}</strong></span>
              <span>Article: <strong class="mono-code">${data.article}</strong></span>
            </div>
          </div>
        </div>

        <!-- جدول 1: الرسم على القيمة المضافة (TVA) -->
        <div class="dgi-section-table">
          <div class="table-head-bar">
            <span>أولاً: الرسم على القيمة المضافة (TAXE SUR LA VALEUR AJOUTÉE - TVA)</span>
          </div>
          <table class="dgi-table">
            <thead>
              <tr>
                <th>البيان (Désignation)</th>
                <th style="text-align:left;">رقم الأعمال الخاضع (CA)</th>
                <th style="text-align:center;">المعدل (Taux)</th>
                <th style="text-align:left;">الرسم المستحق (TVA Brute)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>عمليات خاضعة للمعدل المخفض (Taux Réduit)</td>
                <td style="text-align:left;">${(data.caTva9 || 0).toLocaleString()} دج</td>
                <td style="text-align:center;">9%</td>
                <td style="text-align:left; font-weight:700;">${calc.tva9.toLocaleString()} دج</td>
              </tr>
              <tr>
                <td>عمليات خاضعة للمعدل العام (Taux Normal)</td>
                <td style="text-align:left;">${(data.caTva19 || 0).toLocaleString()} دج</td>
                <td style="text-align:center;">19%</td>
                <td style="text-align:left; font-weight:700;">${calc.tva19.toLocaleString()} دج</td>
              </tr>
              <tr class="subtotal-row">
                <td colspan="3">مجموع الرسم المحصل الإجمالي (Total TVA Collectée)</td>
                <td style="text-align:left; font-weight:800; color:#059669;">${calc.tvaBrute.toLocaleString()} دج</td>
              </tr>
              <tr>
                <td colspan="3">يخصم: الرسم القابل للخصم على المشتريات (Déductions s/ Achats) + رصيد سابق (Précompte)</td>
                <td style="text-align:left; color:#dc2626;">- ${calc.totalDeductions.toLocaleString()} دج</td>
              </tr>
              <tr class="highlight-net-row">
                <td colspan="3"><strong>الرسم على القيمة المضافة الصافي الواجب دفعه (TVA Nette à Payer)</strong></td>
                <td style="text-align:left; font-weight:900; font-size:14px;">${calc.tvaNette.toLocaleString()} دج</td>
              </tr>
              ${calc.precompteNouveau > 0 ? `
              <tr style="background:#fef3c7; color:#92400e;">
                <td colspan="3">فائض رسم يرحل للشهر القادم (Précompte à reporter)</td>
                <td style="text-align:left; font-weight:800;">${calc.precompteNouveau.toLocaleString()} دج</td>
              </tr>` : ''}
            </tbody>
          </table>
        </div>

        <!-- جدول 2: الاقتطاعات من المصدر والرسوم الأخرى (IRG Salaires / Timbre / Loyers) -->
        <div class="dgi-section-table">
          <div class="table-head-bar">
            <span>ثانياً: الاقتطاعات الجبائية ورسوم الطابع (AUTRES IMPÔTS, DROITS ET TAXES)</span>
          </div>
          <table class="dgi-table">
            <thead>
              <tr>
                <th>طبيعة الرسم أو الضريبة</th>
                <th>الأساس الخاضع (Base)</th>
                <th style="text-align:center;">المعدل</th>
                <th style="text-align:left;">المبلغ الصافي المستحق</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>الضريبة على الدخل الإجمالي - صنف الأجور (IRG Salaires)</td>
                <td>كتلة أجور: ${(data.masseSalariale || 0).toLocaleString()} دج</td>
                <td style="text-align:center;">سلم تصاعدي</td>
                <td style="text-align:left; font-weight:700;">${calc.irgSalaires.toLocaleString()} دج</td>
              </tr>
              <tr>
                <td>رسم الطابع الجبائي للمقبوضات نقدًا (Droits de Timbre)</td>
                <td>مقبوضات نقدية: ${(data.caEspeces || 0).toLocaleString()} دج</td>
                <td style="text-align:center;">1% (قانون المالية)</td>
                <td style="text-align:left; font-weight:700;">${calc.timbre.toLocaleString()} دج</td>
              </tr>
              <tr>
                <td>اقتطاع من المصدر على إيجار العقارات (Retenue Loyers 15%)</td>
                <td>مبلغ الإيجار: ${(data.loyersMontant || 0).toLocaleString()} دج</td>
                <td style="text-align:center;">15%</td>
                <td style="text-align:left; font-weight:700;">${calc.loyersRetenue.toLocaleString()} دج</td>
              </tr>
              <tr>
                <td>الرسم على النشاط المهني (TAP)</td>
                <td>رقم الأعمال: ${(data.caTap || 0).toLocaleString()} دج</td>
                <td style="text-align:center;">${data.tapRate}%</td>
                <td style="text-align:left; font-weight:700;">${calc.tap.toLocaleString()} دج</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- صندوق المجموع الإجمالي والتفقيط الرسمي -->
        <div class="dgi-total-box">
          <div class="total-figures-row">
            <span>المجموع الإجمالي للضرائب الواجب دفعها (TOTAL GÉNÉRAL À PAYER):</span>
            <strong class="total-big-val">${calc.totalGeneral.toLocaleString()} دج</strong>
          </div>
          <div class="total-tafqeet-text">
            <div>${tafqeetAr}</div>
            <div style="font-family:sans-serif; font-size:11px; color:#475569; margin-top:2px;">${tafqeetFr}</div>
          </div>
        </div>

        <!-- مساحة التأشيرات والأختام الرسمية -->
        <div class="dgi-validation-grid">
          <div class="dgi-val-box">
            <span class="val-header">خاص بالمكلف بالضريبة (Cadre réservé au redevable)</span>
            <p>أصرح بصحة المعطيات الواردة في هذا الجدول ومطابقتها لدفاتري المحاسبية.</p>
            <div class="val-bottom">
              <span>حرر بـ: ........................ في: ..../..../2026</span>
              <span class="sign-tag">ختم وتوقيع المكلف</span>
            </div>
          </div>

          <div class="dgi-val-box">
            <span class="val-header">خاص بقباضة الضرائب (Cadre réservé à la Recette)</span>
            <div class="recette-data-mock">
              <span>وصل رقم (Quittance N°): ....................</span>
              <span>تاريخ الدفع: ..../..../2026</span>
              <span>طريقة الدفع: [ ] شيك  [ ] نقداً  [ ] تحويل بنكي</span>
              <div class="stamp-circle-dgi">قباضة الضرائب · التأشيرة والخاتم</div>
            </div>
          </div>
        </div>

        <footer class="dgi-footer-note">
          <span>يجب إيداع هذا التصريح ودفع المبالغ المستحقة في أجل أقصاه اليوم العشرون (20) من الشهر الموالي للفترة المعتبرة.</span>
          <span>منصة سهلة · معتمد لمكاتب المحاسبة والخدمات العمومية</span>
        </footer>
      </div>
    `;
  }

  // توليد كود HTML لتصريح الضريبة الجزافية الوحيدة G12 (A4)
  renderG12HTML(data) {
    const calc = this.calculateG12(data);
    const tafqeetAr = typeof numberToArabicWords === 'function' ? numberToArabicWords(calc.totalDu) : '';

    return `
      <div class="printable-area tax-g12-sheet" dir="rtl">
        <!-- ترويسة مصلحة الضرائب G12 -->
        <header class="dgi-header-banner g12-header">
          <div class="dgi-top-row">
            <span>الجمهورية الجزائرية الديمقراطية الشعبية · وزارة المالية</span>
            <span>المديرية العامة للضرائب (DGI)</span>
          </div>
          <div class="dgi-title-box">
            <h1>تصريح الضريبة الجزافية الوحيدة (IFU) · Série G N° 12</h1>
            <p>DÉCLARATION DE L'IMPÔT FORFAITAIRE UNIQUE · EXERCICE ${data.taxYear}</p>
            <span class="ifu-badge">مخصص للمؤسسات الفردية، التجار، الحرفيين، والمهن غير التجارية</span>
          </div>
        </header>

        <!-- الهوية الجبائية -->
        <div class="dgi-ident-grid">
          <div class="dgi-admin-box">
            <span class="box-title">المصالح الجبائية المختصة:</span>
            <div>ولاية: <strong>${data.wilaya}</strong></div>
            <div>المفتشية: <strong>${data.inspection}</strong></div>
            <div>القباضة: <strong>${data.recette}</strong></div>
          </div>

          <div class="dgi-taxpayer-box">
            <span class="box-title">المكلف بالضريبة (Artisan / Commerçant):</span>
            <div class="taxpayer-name"><strong>${data.artisanName}</strong></div>
            <div>النشاط: ${data.activity}</div>
            <div>العنوان: ${data.address}</div>
            <div class="ids-row">
              <span>NIF: <strong class="mono-code">${data.nif}</strong></span>
              <span>Article: <strong class="mono-code">${data.article}</strong></span>
              <span>RC: <strong class="mono-code">${data.rc}</strong></span>
            </div>
          </div>
        </div>

        <!-- جدول حساب الضريبة الجزافية الوحيدة -->
        <div class="dgi-section-table">
          <div class="table-head-bar">
            <span>رقم الأعمال الخاضع وحساب الضريبة المستحقة (Calcul de l'IFU)</span>
          </div>
          <table class="dgi-table">
            <thead>
              <tr>
                <th>طبيعة النشاط (Nature de l'activité)</th>
                <th style="text-align:left;">رقم الأعمال التقديري (CA Prévisionnel)</th>
                <th style="text-align:center;">المعدل الجبائي</th>
                <th style="text-align:left;">الضريبة الناتجة</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>أنشطة شراء وبيع البضائع والسلع والإنتاج</td>
                <td style="text-align:left;">${(data.caCommercial || 0).toLocaleString()} دج</td>
                <td style="text-align:center;">5%</td>
                <td style="text-align:left; font-weight:700;">${calc.impotComm.toLocaleString()} دج</td>
              </tr>
              <tr>
                <td>أنشطة تأدية الخدمات والمهن الحرة</td>
                <td style="text-align:left;">${(data.caServices || 0).toLocaleString()} دج</td>
                <td style="text-align:center;">12%</td>
                <td style="text-align:left; font-weight:700;">${calc.impotServ.toLocaleString()} دج</td>
              </tr>
              <tr class="subtotal-row">
                <td colspan="3">المجموع المحسوب (Total Calculé)</td>
                <td style="text-align:left; font-weight:800;">${calc.totalCalcule.toLocaleString()} دج</td>
              </tr>
              ${calc.isMinApplied ? `
              <tr style="background:#fffbeb; color:#92400e;">
                <td colspan="3">تطبيق الحد الأدنى القانوني للضريبة الجزافية الوحيدة (Minimum d'imposition légal)</td>
                <td style="text-align:left; font-weight:800;">10,000 دج</td>
              </tr>` : ''}
              <tr class="highlight-net-row">
                <td colspan="3"><strong>إجمالي الضريبة الجزافية الوحيدة المستحقة (Total IFU Dû)</strong></td>
                <td style="text-align:left; font-weight:900; font-size:14px;">${calc.totalDu.toLocaleString()} دج</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- جدول رزنامة الدفع (Paiement comptant ou fractionné) -->
        <div class="dgi-section-table">
          <div class="table-head-bar">
            <span>خيارات ورزنامة الدفع القانونية (Modalités de Paiement)</span>
          </div>
          <table class="dgi-table">
            <thead>
              <tr>
                <th>القسط / الدفعة</th>
                <th>تاريخ الاستحقاق القانوني</th>
                <th style="text-align:center;">النسبة</th>
                <th style="text-align:left;">المبلغ الواجب دفعه</th>
              </tr>
            </thead>
            <tbody>
              ${calc.isTranches ? `
              <tr>
                <td>القسط الأول (Tranche 1)</td>
                <td>عند إيداع التصريح (قبل 30 جوان)</td>
                <td style="text-align:center;">50%</td>
                <td style="text-align:left; font-weight:700;">${calc.tranche1.toLocaleString()} دج</td>
              </tr>
              <tr>
                <td>القسط الثاني (Tranche 2)</td>
                <td>من 1 إلى 15 سبتمبر ${data.taxYear}</td>
                <td style="text-align:center;">25%</td>
                <td style="text-align:left; font-weight:700;">${calc.tranche2.toLocaleString()} دج</td>
              </tr>
              <tr>
                <td>القسط الثالث (Tranche 3)</td>
                <td>من 1 إلى 15 ديسمبر ${data.taxYear}</td>
                <td style="text-align:center;">25%</td>
                <td style="text-align:left; font-weight:700;">${calc.tranche3.toLocaleString()} دج</td>
              </tr>
              ` : `
              <tr>
                <td>الدفع الكلي الفوري (Règlement Intégral)</td>
                <td>عند إيداع التصريح (قبل 30 جوان)</td>
                <td style="text-align:center;">100%</td>
                <td style="text-align:left; font-weight:800; color:#059669;">${calc.totalDu.toLocaleString()} دج</td>
              </tr>
              `}
            </tbody>
          </table>
        </div>

        <!-- التفقيط -->
        <div class="dgi-total-box" style="margin-top:14px;">
          <div class="total-figures-row">
            <span>مبلغ الضريبة كتابة بالأحرف:</span>
            <strong>${tafqeetAr}</strong>
          </div>
        </div>

        <!-- التأشيرات والأختام -->
        <div class="dgi-validation-grid" style="margin-top:14px;">
          <div class="dgi-val-box">
            <span class="val-header">توقيع وخاتم المكلف بالضريبة</span>
            <p>أصرح بشرفي بصحة المبالغ التقديرية المدونة أعلاه.</p>
            <div class="val-bottom">
              <span>في: ..../..../${data.taxYear}</span>
              <span class="sign-tag">توقيع المعني</span>
            </div>
          </div>

          <div class="dgi-val-box">
            <span class="val-header">تأشيرة قباضة الضرائب المختصة</span>
            <div class="recette-data-mock">
              <span>رقم الوصل: ...................</span>
              <span>المبلغ المقبوض: ${(calc.isTranches ? calc.tranche1 : calc.totalDu).toLocaleString()} دج</span>
              <div class="stamp-circle-dgi">قباضة الضرائب DGI</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

const sahlaTax = new TaxDeclarationsManager();
