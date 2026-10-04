// Sahla Cybercafé Hardware Troubleshooter & Printer Calibration Page (دليل صيانة الطابعات وصفحة فحص الألوان)

class HardwareGuideManager {
  constructor() {
    this.guides = (typeof CYBERCAFE_HARDWARE_GUIDES !== 'undefined') ? CYBERCAFE_HARDWARE_GUIDES : (window.CYBERCAFE_HARDWARE_GUIDES || []);
  }

  getAllGuides() {
    return this.guides;
  }

  getGuideById(id) {
    return this.guides.find(g => g.id === id);
  }

  // توليد صفحة فحص الألوان ومعايرة الطابعة A4 القياسية
  generateTestPageHTML() {
    const today = new Date().toLocaleString('ar-DZ');

    return `
      <div class="printer-test-sheet">
        <!-- الترويسة القياسية لصفحة الاختبار -->
        <div class="ptest-header">
          <div class="ptest-header-left">
            <h2>🇩🇿 سهلة · صفحة فحص ومعايرة جودة الطابعة (Page de Test CMYK)</h2>
            <p>Epson EcoTank / Canon PIXMA / HP LaserJet · فحص الفوهات ومحاذاة الرؤوس وتدرج الألوان</p>
          </div>
          <div class="ptest-header-right">
            <span class="ptest-date">${today}</span>
            <span class="ptest-dpi-badge">300 DPI Test Scale</span>
          </div>
        </div>

        <!-- 1. أشرطة تدرج ألوان CMYK النقية -->
        <div class="ptest-section">
          <h4>1. أشرطة تدرج الألوان الأساسية (CMYK Density Steps 10% - 100%):</h4>
          <div class="cmyk-bars-container">
            <!-- Cyan -->
            <div class="cmyk-row">
              <span class="cmyk-label">Cyan (C)</span>
              <div class="cmyk-gradient-strip grad-cyan"></div>
              <div class="cmyk-steps-box">
                <span style="background:rgba(0,164,228,0.2);">20%</span>
                <span style="background:rgba(0,164,228,0.4);">40%</span>
                <span style="background:rgba(0,164,228,0.6);">60%</span>
                <span style="background:rgba(0,164,228,0.8);">80%</span>
                <span style="background:rgba(0,164,228,1); color:#fff;">100%</span>
              </div>
            </div>
            <!-- Magenta -->
            <div class="cmyk-row">
              <span class="cmyk-label">Magenta (M)</span>
              <div class="cmyk-gradient-strip grad-magenta"></div>
              <div class="cmyk-steps-box">
                <span style="background:rgba(227,0,126,0.2);">20%</span>
                <span style="background:rgba(227,0,126,0.4);">40%</span>
                <span style="background:rgba(227,0,126,0.6);">60%</span>
                <span style="background:rgba(227,0,126,0.8);">80%</span>
                <span style="background:rgba(227,0,126,1); color:#fff;">100%</span>
              </div>
            </div>
            <!-- Yellow -->
            <div class="cmyk-row">
              <span class="cmyk-label">Yellow (Y)</span>
              <div class="cmyk-gradient-strip grad-yellow"></div>
              <div class="cmyk-steps-box">
                <span style="background:rgba(255,242,0,0.2);">20%</span>
                <span style="background:rgba(255,242,0,0.4);">40%</span>
                <span style="background:rgba(255,242,0,0.6);">60%</span>
                <span style="background:rgba(255,242,0,0.8);">80%</span>
                <span style="background:rgba(255,242,0,1); color:#000;">100%</span>
              </div>
            </div>
            <!-- Black -->
            <div class="cmyk-row">
              <span class="cmyk-label">Black (K)</span>
              <div class="cmyk-gradient-strip grad-black"></div>
              <div class="cmyk-steps-box">
                <span style="background:rgba(0,0,0,0.2);">20%</span>
                <span style="background:rgba(0,0,0,0.4); color:#fff;">40%</span>
                <span style="background:rgba(0,0,0,0.6); color:#fff;">60%</span>
                <span style="background:rgba(0,0,0,0.8); color:#fff;">80%</span>
                <span style="background:rgba(0,0,0,1); color:#fff;">100%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. شبكة فحص الفوهات والانسداد (Nozzle Pattern Check) -->
        <div class="ptest-section">
          <h4>2. نمط فحص فوهات رأس الطباعة (إذا رأيت خطاً مفقوداً أو متقطعاً قم بعمل Head Cleaning):</h4>
          <div class="nozzle-pattern-grid">
            <div class="nozzle-box black-pattern">
              <span>Black Nozzles (K)</span>
              <div class="pattern-lines-black"></div>
            </div>
            <div class="nozzle-box cyan-pattern">
              <span>Cyan Nozzles (C)</span>
              <div class="pattern-lines-cyan"></div>
            </div>
            <div class="nozzle-box magenta-pattern">
              <span>Magenta Nozzles (M)</span>
              <div class="pattern-lines-magenta"></div>
            </div>
            <div class="nozzle-box yellow-pattern">
              <span>Yellow Nozzles (Y)</span>
              <div class="pattern-lines-yellow"></div>
            </div>
          </div>
        </div>

        <!-- 3. اختبار دقة النصوص والخطوط العربية (Micro-Text Legibility Test) -->
        <div class="ptest-section">
          <h4>3. اختبار دقة ووضوح النصوص والخطوط المصغرة (6pt إلى 14pt):</h4>
          <div class="font-legibility-box">
            <p style="font-size: 6pt;">[6pt] منصة سهلة - الجمهورية الجزائرية الديمقراطية الشعبية - اختبار دقة الطباعة المصغرة جداً (Très Petit Texte 6pt)</p>
            <p style="font-size: 8pt;">[8pt] منصة سهلة للخدمات الرقمية للمكتبات والكيوسكات - نصوص واضحة ودقيقة (Texte Standard 8pt)</p>
            <p style="font-size: 10pt;">[10pt] فواتير وسير ذاتية وصور شمسية بيومترية 35×45 مم - جودة ممتازة (Texte Net 10pt)</p>
            <p style="font-size: 12pt;">[12pt] عنوان رئيسي ووثائق رسمية للزبائن - قراءة مريحة بدون تعرج (Grand Texte 12pt)</p>
            <p style="font-size: 14pt; font-weight:800;">[14pt Bold] خط كوفي وعربي عريض عالي التباين (Titre Gras 14pt)</p>
          </div>
        </div>

        <!-- 4. محاذاة الهوامش والأبعاد الهندسية الدقيقة (Alignment & Skew Grid) -->
        <div class="ptest-section">
          <h4>4. معايرة محاذاة وسحب الورق (فحص اعوجاج الورقة Skew وتطابق الهوامش):</h4>
          <div class="alignment-targets-row">
            <div class="target-crosshair">
              <div class="ch-circle"></div>
              <div class="ch-v"></div>
              <div class="ch-h"></div>
              <span>الزاوية اليمنى</span>
            </div>
            <div class="target-ruler-scale">
              <span class="ruler-cm">0cm</span>
              <span class="ruler-cm">2cm</span>
              <span class="ruler-cm">4cm</span>
              <span class="ruler-cm">6cm</span>
              <span class="ruler-cm">8cm</span>
              <span class="ruler-cm">10cm</span>
              <span class="ruler-cm">12cm</span>
              <span class="ruler-cm">14cm</span>
            </div>
            <div class="target-crosshair">
              <div class="ch-circle"></div>
              <div class="ch-v"></div>
              <div class="ch-h"></div>
              <span>الزاوية اليسرى</span>
            </div>
          </div>
        </div>

        <div class="ptest-footer">
          <span>إذا كانت كل الألوان متصلة والخطوط مستقيمة، فإن طابعتك جاهزة 100% لإنجاز صور الهوية والوثائق الرسمية للزبائن.</span>
          <span>منصة سهلة · Sahla Platform Printer Diagnostics Engine</span>
        </div>
      </div>
    `;
  }
}

window.sahlaHardwareGuide = new HardwareGuideManager();
