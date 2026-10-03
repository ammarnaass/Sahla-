// Sahla Official Form Filler & OCR Engine (ملء النماذج الرسمية بالتصوير والتعرف الضوئي)

class FormFillerOCRManager {
  constructor() {
    this.forms = OFFICIAL_FORMS_TEMPLATES;
    this.selectedForm = this.forms[0];
    this.formData = {};
    this.initFormData();
  }

  initFormData() {
    this.formData = {};
    if (this.selectedForm && this.selectedForm.fields) {
      this.selectedForm.fields.forEach(f => {
        this.formData[f.key] = f.sample || '';
      });
    }
  }

  setForm(formId) {
    const f = this.forms.find(item => item.id === formId);
    if (f) {
      this.selectedForm = f;
      this.initFormData();
    }
  }

  // محاكاة استخراج بيانات بطاقة التعريف / شهادة الميلاد عبر OCR
  simulateOCRExtraction(imageFileName = 'cni_scan.jpg') {
    // محاكاة قراءة الحقول من بطاقة التعريف البيومترية الجزائرية
    const mockOCRResults = {
      lastNameAr: 'بلخيري',
      lastNameFr: 'BELKHEIRI',
      firstNameAr: 'عبد النور',
      firstNameFr: 'Abdennour',
      fatherName: 'عثمان',
      motherFullName: 'خيرة بن يحيى',
      birthDate: '1994-09-18',
      birthPlace: 'الشلف',
      bloodGroup: 'A+',
      profession: 'أستاذ تعليم متوسط',
      address: 'شارع فلسطين، عمارة 5، الشلف',
      wilaya: 'الشلف',
      phone: '0670 88 99 00',
      nin: '194020198765432109'
    };

    // دمج الحقول
    Object.keys(mockOCRResults).forEach(key => {
      if (this.formData.hasOwnProperty(key)) {
        this.formData[key] = mockOCRResults[key];
      }
    });

    return {
      success: true,
      confidenceScore: '98.4%',
      extractedFieldsCount: Object.keys(mockOCRResults).length,
      data: mockOCRResults
    };
  }

  // رسم وتوليد نموذج الاستمارة الرسمية A4
  renderOfficialFormHTML() {
    const f = this.selectedForm;
    return `
      <div class="printable-area official-form-a4-sheet" dir="rtl">
        <!-- ترويسة الاستمارة الرسمية للجمهورية الجزائرية -->
        <header class="official-form-header">
          <div class="republic-emblem-box">
            <span class="emblem-flag">🇩🇿</span>
            <h4>الجمهورية الجزائرية الديمقراطية الشعبية</h4>
            <h3>${f.ministry}</h3>
            <p class="form-title-banner">${f.name}</p>
          </div>
          <div class="form-barcode-mock">
            <div class="mock-barcode-lines"></div>
            <small>N° FORM-DZ-${Date.now().toString().slice(-6)}</small>
          </div>
        </header>

        <!-- تنبيه رسمي -->
        <div class="form-official-warning">
          <span>⚠️ يُرجى ملء الاستمارة بكل دقة باللغتين العربية والأحرف اللاتينية، كل تصريح كاذب يعرض صاحبه للعقوبات المنصوص عليها قانوناً.</span>
        </div>

        <!-- شبكة الحقول الرسمية بمحاذاة الصناديق -->
        <div class="official-fields-grid">
          ${f.fields.map(field => {
            const val = this.formData[field.key] || '';
            return `
              <div class="form-official-box">
                <span class="official-box-label">${field.label}:</span>
                <div class="official-box-value">${val || '...................................................'}</div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- خانات مخصصة لمصالح الإدارة (الإشهاد والتوقيع) -->
        <div class="admin-validation-grid">
          <div class="admin-val-box">
            <span class="val-title">توقيع وبصمة المعني بالأمر:</span>
            <div class="fingerprint-box">
              <small>بصمة الإبهام الأيسر</small>
            </div>
          </div>

          <div class="admin-val-box">
            <span class="val-title">خاص برأي ومصالح البلدية / الدائرة:</span>
            <div class="seal-box">
              <small>تأشيرة العون المكلف وخاتم المصلحة</small>
              <div class="stamp-circle-mock">مصلحة الوثائق البيومترية</div>
            </div>
          </div>
        </div>

        <!-- تذييل الاستمارة -->
        <footer class="official-form-footer">
          <span>حرر بـ: ............................ في: .... / .... / 2026</span>
          <span>منصة سهلة · معتمد للمكاتب والكيوسكات العمومية</span>
        </footer>
      </div>
    `;
  }
}

const sahlaFormFiller = new FormFillerOCRManager();
