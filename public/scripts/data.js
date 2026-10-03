// Sahla Platform Data Store (البيانات الجزائرية الرسمية - المرحلة 1 والمرحلة 2)

const ALGERIAN_WILAYAS = [
  { code: 1, nameAr: 'أدرار', nameFr: 'Adrar' },
  { code: 2, nameAr: 'الشلف', nameFr: 'Chlef' },
  { code: 3, nameAr: 'الأغواط', nameFr: 'Laghouat' },
  { code: 4, nameAr: 'أم البواقي', nameFr: 'Oum El Bouaghi' },
  { code: 5, nameAr: 'باتنة', nameFr: 'Batna' },
  { code: 6, nameAr: 'بجاية', nameFr: 'Béjaïa' },
  { code: 7, nameAr: 'بسكرة', nameFr: 'Biskra' },
  { code: 8, nameAr: 'بشار', nameFr: 'Béchar' },
  { code: 9, nameAr: 'البليدة', nameFr: 'Blida' },
  { code: 10, nameAr: 'البويرة', nameFr: 'Bouira' },
  { code: 11, nameAr: 'تمنراست', nameFr: 'Tamanrasset' },
  { code: 12, nameAr: 'تبسة', nameFr: 'Tébessa' },
  { code: 13, nameAr: 'تلمسان', nameFr: 'Tlemcen' },
  { code: 14, nameAr: 'تيارت', nameFr: 'Tiaret' },
  { code: 15, nameAr: 'تيزي وزو', nameFr: 'Tizi Ouzou' },
  { code: 16, nameAr: 'الجزائر العاصمة', nameFr: 'Alger' },
  { code: 17, nameAr: 'الجلفة', nameFr: 'Djelfa' },
  { code: 18, nameAr: 'جيجل', nameFr: 'Jijel' },
  { code: 19, nameAr: 'سطيف', nameFr: 'Sétif' },
  { code: 20, nameAr: 'سعيدة', nameFr: 'Saïda' },
  { code: 21, nameAr: 'سكيكدة', nameFr: 'Skikda' },
  { code: 22, nameAr: 'سيدي بلعباس', nameFr: 'Sidi Bel Abbès' },
  { code: 23, nameAr: 'عنابة', nameFr: 'Annaba' },
  { code: 24, nameAr: 'قالمة', nameFr: 'Guelma' },
  { code: 25, nameAr: 'قسنطينة', nameFr: 'Constantine' },
  { code: 26, nameAr: 'المدية', nameFr: 'Médéa' },
  { code: 27, nameAr: 'مستغانم', nameFr: 'Mostaganem' },
  { code: 28, nameAr: 'المسيلة', nameFr: "M'Sila" },
  { code: 29, nameAr: 'معسكر', nameFr: 'Mascara' },
  { code: 30, nameAr: 'ورقلة', nameFr: 'Ouargla' },
  { code: 31, nameAr: 'وهران', nameFr: 'Oran' },
  { code: 32, nameAr: 'البيض', nameFr: 'El Bayadh' },
  { code: 33, nameAr: 'إليزي', nameFr: 'Illizi' },
  { code: 34, nameAr: 'برج بوعريريج', nameFr: 'Bordj Bou Arréridj' },
  { code: 35, nameAr: 'بومرداس', nameFr: 'Boumerdès' },
  { code: 36, nameAr: 'الطارف', nameFr: 'El Tarf' },
  { code: 37, nameAr: 'تندوف', nameFr: 'Tindouf' },
  { code: 38, nameAr: 'تسمسيلت', nameFr: 'Tissemsilt' },
  { code: 39, nameAr: 'الوادي', nameFr: 'El Oued' },
  { code: 40, nameAr: 'خنشلة', nameFr: 'Khenchela' },
  { code: 41, nameAr: 'سوق أهراس', nameFr: 'Souk Ahras' },
  { code: 42, nameAr: 'تيبازة', nameFr: 'Tipaza' },
  { code: 43, nameAr: 'ميلة', nameFr: 'Mila' },
  { code: 44, nameAr: 'عين الدفلى', nameFr: 'Aïn Defla' },
  { code: 45, nameAr: 'النعامة', nameFr: 'Naâma' },
  { code: 46, nameAr: 'عين تموشنت', nameFr: 'Aïn Témouchent' },
  { code: 47, nameAr: 'غرداية', nameFr: 'Ghardaïa' },
  { code: 48, nameAr: 'غليزان', nameFr: 'Relizane' },
  { code: 49, nameAr: 'المغير', nameFr: "El M'Ghair" },
  { code: 50, nameAr: 'المنيعة', nameFr: 'El Meniaa' },
  { code: 51, nameAr: 'أولاد جلال', nameFr: 'Ouled Djellal' },
  { code: 52, nameAr: 'برج باجي مختار', nameFr: 'Bordj Baji Mokhtar' },
  { code: 53, nameAr: 'بني عباس', nameFr: 'Béni Abbès' },
  { code: 54, nameAr: 'تيميمون', nameFr: 'Timimoun' },
  { code: 55, nameAr: 'تقرت', nameFr: 'Touggourt' },
  { code: 56, nameAr: 'جانت', nameFr: 'Djanet' },
  { code: 57, nameAr: 'عين صالح', nameFr: 'In Salah' },
  { code: 58, nameAr: 'عين قزام', nameFr: 'In Guezzam' }
];

const SERVICE_RATES = {
  // المرحلة 1
  CV_STANDARD: { code: 'CV_STANDARD', nameAr: 'توليد سيرة ذاتية احترافية', points: 15, free: false },
  MOTIVATION_LETTER: { code: 'MOTIVATION_LETTER', nameAr: 'رسالة تحفيز بالذكاء الاصطناعي', points: 5, free: false },
  ID_PHOTO_SHEET: { code: 'ID_PHOTO_SHEET', nameAr: 'تجهيز صور الهوية 35×45 مم', points: 0, free: true },
  INVOICE_OFFICIAL: { code: 'INVOICE_OFFICIAL', nameAr: 'فاتورة رسمية بالمواصفات الجبائية', points: 10, free: false },
  QR_BARCODE: { code: 'QR_BARCODE', nameAr: 'توليد كود QR وباركود', points: 0, free: true },
  ADMIN_LETTER: { code: 'ADMIN_LETTER', nameAr: 'طلب خطي إداري رسمي', points: 5, free: false },
  PROCEDURES_GUIDE: { code: 'PROCEDURES_GUIDE', nameAr: 'دليل الإجراءات الإدارية', points: 0, free: true },

  // المرحلة 2 (الخدمات المدرسية والاستمارات بالـ OCR ودفتر الزبائن)
  SCHOOL_RESEARCH_AI: { code: 'SCHOOL_RESEARCH_AI', nameAr: 'توليد بحث مدرسي بالذكاء الاصطناعي (A4)', points: 10, free: false },
  OFFICIAL_FORM_OCR: { code: 'OFFICIAL_FORM_OCR', nameAr: 'ملء النماذج الرسمية بالـ OCR والتصوير', points: 10, free: false },
  EXAMS_BANK: { code: 'EXAMS_BANK', nameAr: 'بنك الامتحانات الرسمية والحلول (BEM/BAC)', points: 0, free: true },
  CUSTOMER_CREDIT: { code: 'CUSTOMER_CREDIT', nameAr: 'دفتر الزبائن ومتابعة الديون', points: 0, free: true },

  // المرحلة 3 (التصاريح الجبائية G50/G12 وبوابات الدفع الإلكتروني وتوزيع البطاقات)
  TAX_G50: { code: 'TAX_G50', nameAr: 'التصريح الجبائي الرسمي Série G N° 50', points: 20, free: false },
  TAX_G12: { code: 'TAX_G12', nameAr: 'تصريح الضريبة الجزافية الوحيدة IFU G N° 12', points: 20, free: false },
  EPAY_RECHARGE: { code: 'EPAY_RECHARGE', nameAr: 'شحن إلكتروني عبر البطاقة الذهبية / CIB', points: 0, free: true },
  WHOLESALE_CARDS: { code: 'WHOLESALE_CARDS', nameAr: 'طباعة بطاقات الشحن للتوزيع الميداني', points: 0, free: true }
};

// بطاقات شحن تجريبية مسبقة
const INITIAL_SCRATCH_CARDS = [
  { pin: 'SAHLA-100-8842', serial: 'SN2026-0001', points: 100, priceDZD: 1000, status: 'UNREDEEMED', batch: 'BATCH-A1' },
  { pin: 'SAHLA-300-4719', serial: 'SN2026-0002', points: 300, priceDZD: 2500, status: 'UNREDEEMED', batch: 'BATCH-A1' },
  { pin: 'SAHLA-1000-9281', serial: 'SN2026-0003', points: 1000, priceDZD: 7000, status: 'UNREDEEMED', batch: 'BATCH-A1' },
  { pin: 'SAHLA-TEST-2026', serial: 'SN2026-TEST', points: 250, priceDZD: 2000, status: 'UNREDEEMED', batch: 'BATCH-DEMO' }
];

// نماذج الطلبات الخطية الإدارية الجزائرية
const ADMIN_LETTERS_TEMPLATES = [
  {
    id: 'job_application',
    title: 'طلب خطي للمشاركة في مسابقة توظيف',
    target: 'إلى السيد / مدير الموارد البشرية لدى [اسم المؤسسة أو الإدارة]',
    subject: 'طلب المشاركة في مسابقة التوظيف على أساس الشهادة لرتبة [اسم الرتبة]',
    body: `يشرفني أن أتقدم إلى سيادتكم المحترمة بطلبي هذا قصد تسجيل اسمي ضمن قائمة المترشحين للمشاركة في مسابقة التوظيف على أساس الشهادة للالتحاق برتبة [اسم الرتبة]، والمفتوحة بعنوان سنة 2026.\n\nأحيطكم علماً سيدي أنني متحصل(ة) على شهادة [اسم الشهادة والتخصص] الصادرة عن [اسم الجامعة أو المعهد] بتاريخ [تاريخ الشهادة]، وأتمتع بكامل المؤهلات العلمية والعملية المطلوبة لشغل هذا المنصب والتفاني في أداء مهامي بكل انضباط ومسؤولية.\n\nتجدون رفقة هذا الطلب الملف الإداري الكامل متضمناً كافة الوثائق الثبوتية المشروطة في إعلان المسابقة.\n\nوفي انتظار ردكم الإيجابي، تفضلوا سيدي المدير بقبول أسمى عبارات التقدير والاحترام.`
  },
  {
    id: 'work_certificate',
    title: 'طلب استخراج شهادة عمل',
    target: 'إلى السيد / مدير المؤسسة [اسم الشركة أو الإدارة]',
    subject: 'طلب تسليم شهادة عمل',
    body: `أتشرف بالتوجه إلى سيادتكم المحترمة بهذا الطلب قصد تمكيني من الحصول على شهادة عمل تثبت فترة مزاولتي لمهامي بمؤسستكم الموقرة بصفة [اسم الوظيفة]، وذلك ابتداءً من تاريخ [تاريخ البداية] إلى غاية [تاريخ النهاية أو إلى يومنا هذا].\n\nأحتاج هذه الوثيقة لإتمام ملف إداري خاص بي في أقرب الآجال الممكنة.\n\nشاكراً لكم حسن تعاونكم الدائم، تقبلوا مني سيدي فائق الاحترام والتقدير.`
  },
  {
    id: 'honor_declaration',
    title: 'تصريح شرفي بعدم ممارسة أي نشاط',
    target: 'إلى من يهمه الأمر',
    subject: 'تصريح شرفي بعدم العمل وعدم ممارسة أي نشاط مأجور',
    body: `أنا الموقع أسفله:\nالسيد(ة): [الاسم واللقب]\nالمولود(ة) بتاريخ: [تاريخ الميلاد] بـ: [مكان الميلاد]\nالحامل(ة) لبطاقة التعريف الوطنية رقم: [رقم بطاقة التعريف] الصادرة بتاريخ: [تاريخ الصدور] عن دائرة: [اسم الدائرة]\nالساكن(ة) بـ: [العنوان الكامل، البلدية، الولاية]\n\nأصرح بشرفي وتحت مسؤوليتي الكاملة أنني عاطل(ة) عن العمل ولا أمارس أي نشاط مهني مأجور أو غير مأجور، كما أنني غير مسجل(ة) في أي صندوق من صناديق الضمان الاجتماعي (CNAS / CASNOS) حتى تاريخ توقيع هذا التصريح.\n\nحرر هذا التصريح لاستعماله والإدلاء به لدى المصالح الإدارية المعنية في حدود ما يسمح به القانون الجزائري.\n\nصحيح ومصادق عليه.`
  },
  {
    id: 'internship_request',
    title: 'طلب إجراء تربص ميداني (Stage)',
    target: 'إلى السيد / المدير العام لمؤسسة [اسم المؤسسة]',
    subject: 'طلب إجراء تربص تطبيقي ميداني',
    body: `يشرفني أن أتقدم إلى سيادتكم بطلبي هذا قصد التماس موافقتكم الكريمة لإجراء تربص تطبيقي بمؤسستكم الموقرة لمدة [المدة: مثلاً 3 أسابيع أو شهر]، في إطار إعداد مذكرة التخرج لنيل شهادة [اسم الشهادة] تخصص [التخصص] للسنة الجامعية 2025/2026.\n\nإن اختيار مؤسستكم نابع من سمعتها الرائدة وخبرة كوادرها العالية، والتي ستتيح لي بلا شك تعميق معارفي النظرية وربطها بالواقع العملي الميداني.\n\nتقبلوا منا سيدي المدير أخلص عبارات الشكر والامتنان.`
  }
];

// دليل الإجراءات الإدارية والوثائق الرسمية بالجزائر
const ALGERIAN_PROCEDURES_GUIDE = [
  {
    id: 'cni_biometric',
    title: 'بطاقة التعريف الوطنية البيومترية',
    entity: 'بلدية الإقامة / الدائرة / الموقع الإلكتروني للداخلية',
    cost: 'مجاناً',
    validity: '10 سنوات (أو 5 سنوات للقصر)',
    docs: [
      'استمارة الطلب مملوءة وموقعة',
      'شهادة الميلاد 12خ (S12) الأصلية',
      'صورتان (02) شمسيتان بيومتريتان حديثتان (35×45 مم، خلفية رمادية فاتحة)',
      'شهادة الإقامة سارية المفعول (أقل من 3 أشهر)',
      'بطاقة فصيلة الدم',
      'البطاقة القديمة في حال التجديد أو تصريح بالضياع مصادق عليه'
    ]
  },
  {
    id: 'passport_biometric',
    title: 'جواز السفر البيومتري',
    entity: 'الدائرة / المقاطعة الإدارية',
    cost: 'طابع جبائي بقيمة 6,000 دج (28 صفحة) أو 12,000 دج (48 صفحة)',
    validity: '10 سنوات (أو 5 سنوات للقصّر دون 19 سنة)',
    docs: [
      'استمارة الطلب الخاصة بالجواز البيومتري',
      'شهادة الميلاد رقم 12خ الأصلية',
      'شهادة الإقامة (أقل من 3 أشهر)',
      'شهادة العمل أو إثبات النشاط أو شهادة مدرسية للطلبة',
      'صورتان (02) شمسيتان بيومتريتان بمقاس 35×45 مم',
      'قسيمة جبائية أو وصل دفع حقوق الطابع الجبائي',
      'نسخة من بطاقة فصيلة الدم',
      'جواز السفر المنتهي الصلاحية في حال التجديد'
    ]
  },
  {
    id: 'driving_license',
    title: 'رخصة السياقة البيومترية',
    entity: 'البلدية أو الدائرة',
    cost: 'طابع جبائي بمبلغ 500 دج أو 1,000 دج',
    validity: '10 سنوات (أو سنتين للمبتدئين)',
    docs: [
      'استمارة مملوءة',
      'شهادة الإقامة',
      'صورتان شمسيتان بخلفية رمادية',
      'شهادة طبية تثبت الأهلية البدنية والرؤية (طبيب عام وطبيب عيون)',
      'شهادة النجاح في الامتحان (للرخصة الجديدة) أو الرخصة القديمة للتجديد',
      'بطاقة فصيلة الدم'
    ]
  },
  {
    id: 'commercial_register',
    title: 'السجل التجاري (شخص طبيعي - مقاول / تاجر)',
    entity: 'المركز الوطني للسجل التجاري (CNRC)',
    cost: 'حقوق القيد بالمركز الوطني + طابع جبائي (حوالي 4,000 إلى 6,000 دج)',
    validity: 'دائم مع التحديث السنوي',
    docs: [
      'طلب التسجيل عبر منصة Sidjilcom أو الحضور بالملف',
      'عقد ملكية أو عقد إيجار موثق لمحل النشاط التجاري',
      'شهادة الميلاد رقم 12',
      'مستخرج السوابق العدلية (صحيفة رقم 3)',
      'وصل دفع حقوق القيد لدى المركز الوطني للسجل التجاري',
      'اعتماد أو ترخيص مسبق إذا كان النشاط مقنناً'
    ]
  }
];

// ==========================================
// بيانات المرحلة الثانية (Phase 2):
// ==========================================

// 1. النماذج والاستمارات الرسمية المعتمدة لملئها بالـ OCR
const OFFICIAL_FORMS_TEMPLATES = [
  {
    id: 'form_passport_cni',
    name: 'استمارة طلب جواز السفر البيومتري وبطاقة التعريف',
    ministry: 'وزارة الداخلية والجماعات المحلية والتهيئة العمرانية',
    subTitle: 'الجمهورية الجزائرية الديمقراطية الشعبية',
    fields: [
      { key: 'lastNameAr', label: 'اللقب بالعربية', type: 'text', sample: 'بن عيسى' },
      { key: 'lastNameFr', label: 'Nom en Français', type: 'text', sample: 'BENISSA' },
      { key: 'firstNameAr', label: 'الاسم بالعربية', type: 'text', sample: 'ياسين' },
      { key: 'firstNameFr', label: 'Prénom en Français', type: 'text', sample: 'Yacine' },
      { key: 'fatherName', label: 'اسم الأب', type: 'text', sample: 'محمد' },
      { key: 'motherFullName', label: 'اسم ولقب الأم', type: 'text', sample: 'فاطمة الزهراء منصوري' },
      { key: 'birthDate', label: 'تاريخ الميلاد', type: 'date', sample: '1998-05-14' },
      { key: 'birthPlace', label: 'مكان الميلاد', type: 'text', sample: 'وهران' },
      { key: 'bloodGroup', label: 'فصيلة الدم', type: 'select', options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], sample: 'O+' },
      { key: 'profession', label: 'المهنة أو الوظيفة', type: 'text', sample: 'تقني سامي في التبريد' },
      { key: 'address', label: 'العنوان الكامل', type: 'text', sample: 'حي السلام، عمارة 12، رقم 4' },
      { key: 'wilaya', label: 'ولاية الإقامة', type: 'text', sample: 'وهران' },
      { key: 'phone', label: 'رقم الهاتف المحمول', type: 'tel', sample: '0555 12 34 56' },
      { key: 'nin', label: 'رقم التعريف الوطني (NIN)', type: 'text', sample: '198310123456789012' }
    ]
  },
  {
    id: 'form_declaration_loss',
    name: 'تصريح بالضياع (Déclaration de perte)',
    ministry: 'المديرية العامة للأمن الوطني / قيادة الدرك الوطني',
    subTitle: 'تصريح شرفي بضياع وثائق أو أغراض شخصية',
    fields: [
      { key: 'declarantName', label: 'اسم ولقب المصرح', type: 'text', sample: 'كريم مرواني' },
      { key: 'birthDate', label: 'تاريخ الميلاد', type: 'date', sample: '1995-11-20' },
      { key: 'lostItem', label: 'الوثيقة أو الشيء الضائع', type: 'select', options: ['بطاقة التعريف الوطنية', 'رخصة السياقة', 'جواز السفر', 'البطاقة الرمادية للسيارة', 'شيك بريدي / بطاقة ذهبية'], sample: 'رخصة السياقة' },
      { key: 'lostItemNumber', label: 'رقم الوثيقة الضائعة (إن وجد)', type: 'text', sample: '31/0987654' },
      { key: 'lossDate', label: 'تاريخ الضياع التقريبي', type: 'date', sample: '2026-09-28' },
      { key: 'lossCircumstances', label: 'ظروف ومكان الضياع', type: 'text', sample: 'فُقدت أثناء التنقل بوسط المدينة بحي ديدوش مراد' }
    ]
  },
  {
    id: 'form_residence_declaration',
    name: 'تصريح بالإيواء والإقامة (Hébergement)',
    ministry: 'الجماعات المحلية - ولاية الجزائر',
    subTitle: 'تصريح شرفي بالإيواء لإعداد ملف شهادة الإقامة',
    fields: [
      { key: 'hostName', label: 'اسم ولقب المضيف (صاحب السكن)', type: 'text', sample: 'بشير علالي' },
      { key: 'hostCni', label: 'رقم بطاقة تعريف المضيف', type: 'text', sample: '109876543210' },
      { key: 'hostAddress', label: 'العنوان الدقيق للسكن', type: 'text', sample: 'حي 200 مسكن، عمارة ب، شقة 6، بئر التوتة' },
      { key: 'guestName', label: 'اسم ولقب المستضاف (الساكن معه)', type: 'text', sample: 'سفيان علالي' },
      { key: 'relation', label: 'صلة القرابة', type: 'text', sample: 'ابن' }
    ]
  }
];

// 2. بنك مواضيع الامتحانات الرسمية مع الحلول وسلالم التنقيط (BEM & BAC)
const SCHOOL_EXAMS_DATABASE = [
  {
    id: 'bem_math_2025',
    level: 'BEM',
    year: '2025',
    subject: 'الرياضيات',
    title: 'امتحان شهادة التعليم المتوسط 2025 - الرياضيات',
    duration: 'ساعتان',
    coefficient: 4,
    questionsText: `الجزء الأول (12 نقطة):
• التمرين الأول (03 نقاط):
1. أحسب القاسم المشترك الأكبر للعددين 1053 و 832.
2. أكتب الكسر 832 / 1053 على شكل كسر غير قابل للاختزال.
3. لتكن العبارة A حيث: A = √(1053) - 2√(832) + 8√13. أكتب A على الشكل a√13 حيث a عدد نسبي.

• التمرين الثاني (03 نقاط):
لتكن العبارة الجبرية E = (2x - 3)² - (2x - 3)(x + 1)
1. أنشر وبسّط العبارة E.
2. حلل العبارة E إلى جداء عاملين من الدرجة الأولى.
3. حل المعادلة: (2x - 3)(x - 4) = 0.

• التمرين الثالث (03 نقاط): الهندسة وحساب الأطوال والمثلثات.
• التمرين الرابع (03 نقاط): المعالم والإحداثيات في المستوي.

الجزء الثاني (08 نقاط):
مسألة إدماجية واقعية حول تهيئة قطعة أرض زراعية وبناء خزان مياه أسطواني الشكل وحساب التكلفة الإجمالية بالدينار الجزائري.`,
    solutionsText: `الحل النموذجي وسلم التنقيط الرسمي (0/20):
• حل التمرين الأول (03 نقاط):
1. حساب PGCD(1053, 832) بخوارزمية إقليدس:
   1053 = 832 × 1 + 221
   832 = 221 × 3 + 169
   221 = 169 × 1 + 52
   169 = 52 × 3 + 13
   52 = 13 × 4 + 0
   إذن: PGCD(1053, 832) = 13. [1 نقطة]
2. الاختزال: 832÷13 / 1053÷13 = 64 / 81. [1 نقطة]
3. تبسيط A:
   A = √(81×13) - 2√(64×13) + 8√13 = 9√13 - 16√13 + 8√13 = (9 - 16 + 8)√13 = 1√13 = √13. [1 نقطة]

• حل التمرين الثاني (03 نقاط):
1. النشر: E = 4x² - 12x + 9 - (2x² + 2x - 3x - 3) = 2x² - 11x + 12. [1 نقطة]
2. التحليل: E = (2x - 3)[(2x - 3) - (x + 1)] = (2x - 3)(x - 4). [1 نقطة]
3. حل المعادلة: إما 2x - 3 = 0 (أي x = 3/2) أو x - 4 = 0 (أي x = 4). للمعادلة حلان هما: 1.5 و 4. [1 نقطة]`
  },
  {
    id: 'bac_sciences_phy_2025',
    level: 'BAC',
    year: '2025',
    subject: 'العلوم الفيزيائية',
    title: 'امتحان بكالوريا التعليم الثانوي 2025 - شعبة علوم تجريبية',
    duration: '3 ساعات ونصف',
    coefficient: 5,
    questionsText: `الموضوع الأول:
• التمرين الأول (06 نقاط): المتابعة الزمنية لتحول كيميائي عن طريق قياس الناقلية النوعية لمحلول مائي وتفاعل الأسترة.
• التمرين الثاني (07 نقاط): دراسة حركة قمر اصطناعي جزائري (Alsat-2B) في مدار دائري حول الأرض وحساب الارتفاع والسرعة المدارية والدور T.
• التمرين التجريبي (07 نقاط): الظواهر الكهربائية - ثنائي القطب RC و RL، شحن وتفريغ مكثفة وتحديد ثابت الزمن τ بيانيا وحساب سعة المكثفة C.`,
    solutionsText: `عناصر الإجابة وسلم التنقيط:
• حل تمرين حركة القمر الاصطناعي Alsat-2B:
1. المرجع المناسب للدراسة: المرجع الجيومركزي (المركزي الأرضي) ونعتبره غاليلياً. [0.5 ن]
2. تطبيق القانون الثاني لنيوتن: ΣF = m.a => F_(T/S) = m_S . a_n
   G . (M_T . m_S) / (R_T + h)² = m_S . (v² / (R_T + h))
   منه: v = √[ (G . M_T) / (R_T + h) ]. [1.5 ن]
3. عبارة الدور T = (2π(R_T + h)) / v. [1.0 ن]
4. إثبات القانون الثالث لكبلر: T² / r³ = 4π² / (G . M_T) = ثابث K. [1.5 ن]`
  },
  {
    id: 'bac_arabic_philo_2025',
    level: 'BAC',
    year: '2025',
    subject: 'اللغة العربية وآدابها',
    title: 'امتحان بكالوريا 2025 - شعبة آداب وفلسفة ولغات أجنبية',
    duration: 'ساعتان ونصف',
    coefficient: 3,
    questionsText: `النص: قصيدة للشاعر الجزائري مفدي زكرياء حول الثورة التحريرية والتضحيات وبطولات الشهداء.
البناء الفكري (10 نقاط):
1. ما القضية الوطنية والعروبية التي يعالجها الشاعر في النص؟
2. إلى أي مدى عكست القصيدة روح الصمود الجزائري؟ علل بعبارات من النص.
3. حدد النمط الغالب على النص واذكر مؤشرين له مع التمثيل.

البناء اللغوي (06 نقاط):
1. أعرب ما تحته خط إعراب مفردات وما بين قوسين إعراب جمل.
2. بيّن نوع الصورة البيانية في قول الشاعر "فجّر التاريخ بركاناً" واشرح أثرها البلاغي.
3. حدد البحر الشعري للبيت الأول وقطّعه عروضياً.

التقويم النقدي (04 نقاط):
ظاهرة الالتزام في الأدب العربي الحديث والمعاصر ودور شعراء الثورة الجزائرية.`,
    solutionsText: `الإجابة النموذجية:
• البناء الفكري:
1. يعالج الشاعر قضية التحرر الوطني واستنهاض الهمم والاعتزاز بأمجاد ثورة أول نوفمبر الخالدة. [2 ن]
2. النمط الغالب: الحماسي الإيعازي المتضمن للنمط الوصفي. المؤشرات: الأفعال الدالة على التحدي، أساليب النداء والأمر. [3 ن]
• البناء اللغوي:
1. الإعراب: جملة (تتحرر الأوطان): صلة موصول لا محل لها من الإعراب. [1 ن]
2. الصورة البيانية: استعارة مكنية، شبّه التاريخ ببركان يثور وحذف المشبه به ورمز له بشيء من لوازمه (فجّر). أثرها: تجسيد المعنى وتقويته في ذهن المتلقي. [1.5 ن]`
  }
];

// 3. قاعدة نماذج البحوث المدرسية الجاهزة للتوليد الفوري بالـ AI (Exposés Scolaires)
const RESEARCH_TOPICS_DATABASE = [
  {
    id: 'revolution_54',
    title: 'تاريخ الثورة التحريرية الجزائرية (1954 - 1962)',
    subjectCategory: 'تاريخ وجغرافيا',
    level: 'ثانوي / متوسط',
    language: 'ar',
    plan: [
      'مقدمة: ظروف اندلاع ثورة أول نوفمبر المجيدة والميثاق التأسيسي',
      'المبحث الأول: المحطات الكبرى (مؤتمر الصومام 1956، هجومات الشمال القسنطيني 1955)',
      'المبحث الثاني: البعد الدبلوماسي والدولي للثورة وحكومة الجزائر المؤقتة (GPRA)',
      'المبحث الثالث: مظاهرات 11 ديسمبر 1960 ومفاوضات إيفيان والاستقلال',
      'خاتمة: تضحيات مليون ونصف مليون شهيد ورسالة الوفاء لجيل الاستقلال',
      'المصادر والمراجع: مذكرات قادة الثورة، منشورات المركز الوطني للدراسات والبحث في الحركة الوطنية'
    ],
    summaryContent: `تُعد الثورة التحريرية الجزائرية المباركة (1954–1962) إحدى أعظم الثورات التحررية في القرن العشرين، حيث جسدت ملحمة شعبية كبرى ضد الاستعمار الاستيطاني الفرنسي دامت أكثر من قرن وثلث.

انطلقت الثورة ببيان أول نوفمبر 1954 الذي وحد كافة أطياف الشعب تحت لواء جبهة التحرير الوطني (FLN) وجيش التحرير الوطني (ALN)، مؤكداً على استعادة السيادة الوطنية في إطار المبادئ الإسلامية والديمقراطية.

وقد شكل مؤتمر الصومام في 20 أوت 1956 محطة استراتيجية حاسمة بتنظيمه لهياكل الثورة السياسية والعسكرية وتكريس أولوية الداخل على الخارج وأولوية السياسي على العسكري.

توجت هذه المسيرة البطولية، بعد مفاوضات شاقة في إيفيان وتضحيات جسام قوامها مليون ونصف مليون شهيد، بانتزاع الاستقلال الكامل واسترجاع السيادة الوطنية في 5 جويلية 1962.`
  },
  {
    id: 'renewable_energy_dz',
    title: 'الطاقات المتجددة في الجزائر: الإمكانات والآفاق',
    subjectCategory: 'علوم طبيعية وفيزياء',
    level: 'ثانوي / جامعي',
    language: 'ar',
    plan: [
      'مقدمة: تحديات التحول الطاقوي والأمن البيئي العالمي',
      'المبحث الأول: الإمكانات الهائلة للطاقة الشمسية في الصحراء الجزائرية (3000 ساعة شمس/سنة)',
      'المبحث الثاني: مشاريع الجزائر الرائدة (مشروع سولار 1000 ميغاواط، الهيدروجين الأخضر)',
      'المبحث الثالث: الطاقة الهوائية وطاقة الكتلة الحيوية في الهضاب العليا والمناطق الساحلية',
      'خاتمة: مكانة الجزائر كمركز استراتيجي لتصدير الطاقة النظيفة إلى أوروبا والعالم',
      'المراجع: تقارير وزارة الانتقال الطاقوي، مركز تطوير الطاقات المتجددة (CDER - بوزريعة)'
    ],
    summaryContent: `تمتلك الجزائر مقومات طبيعية استثنائية تجعلها في صدارة دول العالم المؤهلة لقيادة ثورة الطاقة النظيفة. وتتمتع الصحراء الجزائرية بأعلى معدلات الإشعاع الشمسي عالمياً، بما يفوق 3000 إلى 3500 ساعة سطوع شمسي سنوياً.

وقد أطلقت الدولة الجزائرية برنامجاً طموحاً للانتقال الطاقوي يهدف إلى إنتاج 15 ألف ميغاواط من الطاقات المتجددة في آفاق 2035، مدعوماً بمشروعات كبرى مثل "سولار 1000" ومحطات الطاقة الهوائية بأدرار، بالإضافة إلى الشراكات الدولية لتطوير سلاسل إنتاج وتصدير الهيدروجين الأخضر.`
  },
  {
    id: 'ai_medicine',
    title: "L'Intelligence Artificielle en Médecine et Santé",
    subjectCategory: 'Sciences et Technologies',
    level: 'Lycée / Université',
    language: 'fr',
    plan: [
      'Introduction : La révolution du numérique dans le secteur de la santé',
      'Axe 1 : Le diagnostic précoce assisté par IA (radiologie, détection des tumeurs)',
      'Axe 2 : La découverte accélérée de nouveaux médicaments et vaccins',
      'Axe 3 : La chirurgie robotique de haute précision et médecine personnalisée',
      'Défis et éthique : Protection des données médicales des patients et responsabilité médicale',
      'Conclusion : Vers une collaboration harmonieuse entre praticien et algorithme',
      'Bibliographie : Revues médicales internationales, OMS (WHO Report on AI)'
    ],
    summaryContent: `L'intelligence artificielle transforme profondément la pratique médicale moderne. Grâce aux algorithmes d'apprentissage profond (Deep Learning), les systèmes d'IA sont désormais capables d'analyser des milliers d'images radiologiques en quelques secondes avec une précision égalant, voire surpassant, celle des experts humains.

En Algérie et dans le monde, l'intégration de ces outils offre des perspectives prometteuses pour désenclaver les régions éloignées grâce à la télémédecine assistée par IA.`
  }
];

// تفقيط الأرقام إلى الحروف باللغة العربية (Algerian DZD Spelling)
function numberToArabicWords(number) {
  if (isNaN(number) || number === 0) return 'صفر دينار جزائري';
  
  const units = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة'];
  const teens = ['عشرة', 'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'];
  const tens = ['', 'عشرة', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
  const hundreds = ['', 'مائة', 'مائتان', 'ثلاثمائة', 'أربعمائة', 'خمسمائة', 'ستمائة', 'سبعمائة', 'ثمانمائة', 'تسعمائة'];

  function convertGroup(n) {
    let res = '';
    const h = Math.floor(n / 100);
    const rem = n % 100;
    const t = Math.floor(rem / 10);
    const u = rem % 10;

    if (h > 0) res += hundreds[h];
    if (rem > 0) {
      if (res !== '') res += ' و';
      if (rem >= 10 && rem <= 19) {
        res += teens[rem - 10];
      } else {
        if (u > 0) {
          res += units[u];
          if (t > 0) res += ' و';
        }
        if (t > 0) res += tens[t];
      }
    }
    return res;
  }

  const num = Math.floor(number);
  const cents = Math.round((number - num) * 100);

  let result = '';
  const millions = Math.floor(num / 1000000);
  const thousands = Math.floor((num % 1000000) / 1000);
  const remaining = num % 1000;

  if (millions > 0) {
    if (millions === 1) result += 'مليون';
    else if (millions === 2) result += 'مليونان';
    else if (millions >= 3 && millions <= 10) result += convertGroup(millions) + ' ملايين';
    else result += convertGroup(millions) + ' مليون';
  }

  if (thousands > 0) {
    if (result !== '') result += ' و';
    if (thousands === 1) result += 'ألف';
    else if (thousands === 2) result += 'ألفان';
    else if (thousands >= 3 && thousands <= 10) result += convertGroup(thousands) + ' آلاف';
    else result += convertGroup(thousands) + ' ألف';
  }

  if (remaining > 0) {
    if (result !== '') result += ' و';
    result += convertGroup(remaining);
  }

  result += ' دينار جزائري';
  if (cents > 0) {
    result += ' و' + convertGroup(cents) + ' سنتيم';
  } else {
    result += ' تماماً';
  }

  return 'أوقفت هذه الفاتورة عند مبلغ: ' + result;
}

// تفقيط الأرقام باللغة الفرنسية (Algerian Invoicing French Format)
function numberToFrenchWords(n) {
  const num = Math.floor(n);
  const cents = Math.round((n - num) * 100);
  
  const ones = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf'];
  const teens = ['dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
  const tens = ['', 'dix', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingts', 'quatre-vingt-dix'];

  function convertUnderThousand(val) {
    let str = '';
    const h = Math.floor(val / 100);
    const rem = val % 100;
    if (h > 1) str += ones[h] + ' cent ';
    else if (h === 1) str += 'cent ';
    
    if (rem >= 10 && rem <= 19) {
      str += teens[rem - 10];
    } else {
      const t = Math.floor(rem / 10);
      const u = rem % 10;
      if (t > 0) {
        if (t === 7) str += 'soixante-' + teens[u];
        else if (t === 9) str += 'quatre-vingt-' + teens[u];
        else {
          str += tens[t];
          if (u === 1 && t !== 8) str += ' et ';
          else if (u > 0) str += '-';
        }
      }
      if (t !== 7 && t !== 9 && u > 0) str += ones[u];
    }
    return str.trim();
  }

  let res = '';
  const millions = Math.floor(num / 1000000);
  const thousands = Math.floor((num % 1000000) / 1000);
  const rem = num % 1000;

  if (millions > 1) res += convertUnderThousand(millions) + ' millions ';
  else if (millions === 1) res += 'un million ';

  if (thousands > 1) res += convertUnderThousand(thousands) + ' mille ';
  else if (thousands === 1) res += 'mille ';

  if (rem > 0) res += convertUnderThousand(rem);

  res = res.trim() + ' dinars algériens';
  if (cents > 0) res += ' et ' + convertUnderThousand(cents) + ' centimes';
  else res += ' zéro centimes';

  const formatted = res.charAt(0).toUpperCase() + res.slice(1);
  return 'Arrêtée la présente facture à la somme de: ' + formatted;
}

// ==========================================
// بيانات المرحلة الثالثة (Phase 3):
// ==========================================

// 1. عينة وبيانات التصريح الجبائي الرسمي G50 (Série G N° 50)
const DEFAULT_G50_SAMPLE = {
  wilaya: 'الجزائر',
  directionWilaya: 'Direction des Impôts de la Wilaya d’Alger',
  recette: 'Recette des Impôts d’Alger-Centre',
  inspection: 'CDI Alger-Centre / Inspection Didouche Mourad',
  periodType: 'Mois', // Mois أو Trimestre
  periodValue: 'سبتمبر 2026',
  periodMonthYear: '09/2026',
  
  // بيانات المكلف بالضريبة
  companyName: 'SARL النور للتجارة والخدمات الرقمية',
  activity: 'خدمات إعلام آلي، طباعة، وتوريدات مكتبية',
  address: '42 شارع حسيبة بن بوعلي، الجزائر الوسطى',
  nif: '001916012345678',
  nis: '001916010023456',
  rc: '16/00-0987654B19',
  article: '16012345678',
  regime: 'Régime Réel',

  // 1. الرسم على القيمة المضافة (TVA)
  caTva9: 350000,      // رقم الأعمال الخاضع لـ 9%
  caTva19: 820000,     // رقم الأعمال الخاضع لـ 19%
  caExonere: 120000,   // رقم الأعمال المعفى
  deductionsAchats: 85000, // خصم الرسم على المشتريات
  precompteAnterieur: 0,  // رصيد سابق (Précompte)

  // 2. الرسم على النشاط المهني (TAP) - معفى بنسبة 0% وفق التعديلات القانونية الحالية
  tapRate: 0,
  caTap: 1170000,

  // 3. الضريبة على الدخل الإجمالي صنف الأجور (IRG Salaires)
  masseSalariale: 480000,
  irgSalairesRetenue: 42500,

  // 4. الاقتطاعات من المصدر المختلفة (Retenues à la source)
  loyersMontant: 80000,
  loyersRetenue: 12000, // 15%

  // 5. رسم الطابع الجبائي للمقبوضات نقدًا (Droits de timbre)
  caEspeces: 250000,
  droitsTimbre: 2500
};

// 2. عينة وبيانات تصريح الضريبة الجزافية الوحيدة G12 (IFU)
const DEFAULT_G12_SAMPLE = {
  wilaya: 'وهران',
  inspection: 'مفتشية الضرائب وهران - المقري',
  recette: 'قباضة الضرائب وهران - سيدي الهواري',
  taxYear: '2026',

  artisanName: 'بن عمارة كمال (مكتبة وخدمات رقمية)',
  activity: 'بيع الكتب والأدوات المكتبية والخدمات الرقمية',
  address: 'حي الصديقية، عمارة 14، رقم 2، وهران',
  nif: '184310123456789',
  article: '31098765432',
  rc: '31/00-1122334A20',

  // رقم الأعمال التقديري
  caCommercial: 1800000, // تجارة البضائع (نسبة 5%)
  caServices: 650000,    // تأدية الخدمات (نسبة 12%)
  paymentMode: 'TOTAL',  // TOTAL (100% فوراً) أو TRANCHES (أقساط)
};

// 3. بنوك الجزائر المعتمدة في شبكة SATIM
const SATIM_BANKS_LIST = [
  { code: '007', nameAr: 'بريد الجزائر (البطاقة الذهبية)', nameFr: 'Algérie Poste (Edahabia)', logoText: '📮 بريد الجزائر' },
  { code: '001', nameAr: 'البنك الوطني الجزائري (BNA)', nameFr: 'Banque Nationale d’Algérie', logoText: '🏛️ BNA' },
  { code: '002', nameAr: 'بنك الفلاحة والتنمية الريفية (BADR)', nameFr: 'Banque de l’Agriculture (BADR)', logoText: '🌾 BADR' },
  { code: '003', nameAr: 'بنك التنمية المحلية (BDL)', nameFr: 'Banque du Développement Local', logoText: '🏢 BDL' },
  { code: '004', nameAr: 'القرض الشعبي الجزائري (CPA)', nameFr: 'Crédit Populaire d’Algérie', logoText: '🏦 CPA' },
  { code: '005', nameAr: 'بنك الجزائر الخارجي (BEA)', nameFr: 'Banque Extérieure d’Algérie', logoText: '🌐 BEA' },
  { code: '006', nameAr: 'صندوق التوفير والاحتياط (CNEP-Banque)', nameFr: 'CNEP-Banque', logoText: '🏠 CNEP' },
  { code: '010', nameAr: 'بنك البركة الجزائري (Al Baraka)', nameFr: 'Banque Al Baraka', logoText: '⭐ Al Baraka' },
  { code: '012', nameAr: 'بنك السلام الجزائر (Al Salam)', nameFr: 'Al Salam Bank Algeria', logoText: '🌙 Al Salam' },
  { code: '014', nameAr: 'بنك الخليج الجزائر (AGB)', nameFr: 'Gulf Bank Algeria', logoText: '💎 AGB' }
];

// ==========================================
// المرحلة 4: التوسع المؤسسي، إدارة الفروع ونقاط البيع، المحاسبة، والبوابات الوطنية
// ==========================================

// 1. الأجهزة ونقاط البيع المرتبطة بالمحل الواحد (Bound Devices & POS Terminals)
const DEFAULT_BOUND_DEVICES = [
  {
    id: 'dev_01_main',
    name: 'كاونتر الاستقبال الرئيسي (POS 1)',
    type: 'DESKTOP',
    ipAddress: '192.168.1.105',
    role: 'OWNER',
    roleTitle: 'المالك / المدير العام',
    status: 'ONLINE',
    lastActive: 'الآن (متصل نشط)',
    isCurrent: true,
    permissions: {
      canGenerateDocs: true,
      canPrint: true,
      canViewAccounting: true,
      canRechargeWallet: true,
      canManageDevices: true
    }
  },
  {
    id: 'dev_02_scanner',
    name: 'حاسوب المسح الضوئي والإنجاز (POS 2)',
    type: 'DESKTOP',
    ipAddress: '192.168.1.108',
    role: 'CASHIER',
    roleTitle: 'عامل الخدمات والسير الذاتية',
    status: 'ONLINE',
    lastActive: 'منذ 4 دقائق',
    isCurrent: false,
    permissions: {
      canGenerateDocs: true,
      canPrint: true,
      canViewAccounting: false,
      canRechargeWallet: false,
      canManageDevices: false
    }
  },
  {
    id: 'dev_03_print',
    name: 'محطة الطابعة المركزية (Epson L3250)',
    type: 'PRINT_STATION',
    ipAddress: '192.168.1.120',
    role: 'PRINT_OPERATOR',
    roleTitle: 'خادم الطباعة اللاسلكي',
    status: 'ONLINE',
    lastActive: 'منذ دقيقة واحدة',
    isCurrent: false,
    permissions: {
      canGenerateDocs: false,
      canPrint: true,
      canViewAccounting: false,
      canRechargeWallet: false,
      canManageDevices: false
    }
  },
  {
    id: 'dev_04_mobile',
    name: 'هاتف صاحب المحل (Samsung Galaxy)',
    type: 'MOBILE',
    ipAddress: '192.168.1.55 (4G/WiFi)',
    role: 'OWNER',
    roleTitle: 'إدارة عن بعد ومسح الوثائق',
    status: 'STANDBY',
    lastActive: 'منذ 25 دقيقة',
    isCurrent: false,
    permissions: {
      canGenerateDocs: true,
      canPrint: true,
      canViewAccounting: true,
      canRechargeWallet: true,
      canManageDevices: true
    }
  }
];

// 2. عينة العمليات المحاسبية اليومية والشهرية لحساب الأرباح وهامش الربحية
const DEFAULT_ACCOUNTING_SAMPLE = [
  {
    id: 'op_101',
    date: '2026-10-03 14:30',
    serviceCode: 'CV_STANDARD',
    serviceName: 'سيرة ذاتية عصرية ثلاثية اللغات (فرنسية)',
    customerName: 'بلقاسم كريم',
    terminal: 'POS 2 (كاونتر الإنجاز)',
    pointsCost: 15,
    pointsDZDValue: 150, // 15 نقطة × 10 دج
    paperAndInkEst: 20,
    priceSoldToCustomer: 300,
    netProfit: 130,
    paymentMethod: 'CASH',
    category: 'DOCUMENTS'
  },
  {
    id: 'op_102',
    date: '2026-10-03 13:15',
    serviceCode: 'PHOTO_ID',
    serviceName: 'صور هوية بيومترية (لوحة 8 صور 10×15 سم)',
    customerName: 'سعاد ميموني',
    terminal: 'POS 1 (الكاونتر الرئيسي)',
    pointsCost: 10,
    pointsDZDValue: 100,
    paperAndInkEst: 50, // ورق صور 230g عالي الجودة
    priceSoldToCustomer: 350,
    netProfit: 200,
    paymentMethod: 'CASH',
    category: 'PHOTOS'
  },
  {
    id: 'op_103',
    date: '2026-10-03 11:45',
    serviceCode: 'TAX_G50',
    serviceName: 'إعداد تصريح جبائي شهري DGI Série G N° 50',
    customerName: 'مؤسسة الأفق للتجارة SARL',
    terminal: 'POS 1 (الكاونتر الرئيسي)',
    pointsCost: 20,
    pointsDZDValue: 200,
    paperAndInkEst: 30,
    priceSoldToCustomer: 1500,
    netProfit: 1270,
    paymentMethod: 'CASH',
    category: 'TAX'
  },
  {
    id: 'op_104',
    date: '2026-10-03 10:20',
    serviceCode: 'SCHOOL_RESEARCH',
    serviceName: 'بحث تاريخي متكامل (الثورة الجزائرية) مع المراجع والواجهة',
    customerName: 'ياسين بوزيد (طالب)',
    terminal: 'POS 2 (كاونتر الإنجاز)',
    pointsCost: 15,
    pointsDZDValue: 150,
    paperAndInkEst: 40,
    priceSoldToCustomer: 500,
    netProfit: 310,
    paymentMethod: 'CASH',
    category: 'SCHOOL'
  },
  {
    id: 'op_105',
    date: '2026-10-03 09:10',
    serviceCode: 'INVOICE_PDF',
    serviceName: 'فاتورة تجارية قانونية مع الطابع الجبائي والتفقيط',
    customerName: 'محل البركة للهواتف',
    terminal: 'POS 1 (الكاونتر الرئيسي)',
    pointsCost: 5,
    pointsDZDValue: 50,
    paperAndInkEst: 15,
    priceSoldToCustomer: 200,
    netProfit: 135,
    paymentMethod: 'CASH',
    category: 'DOCUMENTS'
  },
  {
    id: 'op_106',
    date: '2026-10-02 16:50',
    serviceCode: 'TAX_G12',
    serviceName: 'تصريح الضريبة الجزافية الوحيدة IFU Série G N° 12',
    customerName: 'حرفي النجارة المعمارية',
    terminal: 'POS 1 (الكاونتر الرئيسي)',
    pointsCost: 20,
    pointsDZDValue: 200,
    paperAndInkEst: 20,
    priceSoldToCustomer: 1200,
    netProfit: 980,
    paymentMethod: 'CASH',
    category: 'TAX'
  },
  {
    id: 'op_107',
    date: '2026-10-02 15:10',
    serviceCode: 'OFFICIAL_FORM',
    serviceName: 'استمارة استخراج جواز السفر البيومتري مع مسح البطاقة OCR',
    customerName: 'فاطمة الزهراء قدور',
    terminal: 'POS 2 (كاونتر الإنجاز)',
    pointsCost: 5,
    pointsDZDValue: 50,
    paperAndInkEst: 15,
    priceSoldToCustomer: 250,
    netProfit: 185,
    paymentMethod: 'CASH',
    category: 'FORMS'
  }
];

// 3. دليل وبوابة الخدمات الحكومية والإدارية الوطنية (Algerian E-Government Directory)
const EGOV_SERVICES_DIRECTORY = [
  {
    id: 'egov_moussahamati',
    category: 'TAX_COMMERCE',
    titleAr: 'بوابة مساهمتي (Moussahamati DGI)',
    titleFr: 'Portail de Télédéclaration Fiscale',
    authorityAr: 'وزارة المالية · المديرية العامة للضرائب (DGI)',
    authorityFr: 'Ministère des Finances · DGI',
    badge: 'جبائي / تجاري',
    officialUrl: 'https://moussahamati.mf.gov.dz',
    portalStatus: 'نشط ومتاح 24/7',
    descriptionAr: 'البوابة الرقمية الرسمية للتصريح الجبائي عن بعد وسداد الضرائب (G50، G12 IFU، واستخراج شهادة الرقم الجبائي NIF).',
    requiredDossier: [
      { doc: 'رقم التعريف الجبائي (NIF)', note: 'مكون من 15 رقماً إجبارياً' },
      { doc: 'رمز الدخول السري (Code d’accès)', note: 'يُسلم شخصياً من قباضة الضرائب التابع لها المحل' },
      { doc: 'البريد الإلكتروني التجاري ورقم الهاتف', note: 'لتلقي رمز التحقق والإشعار بالاستلام' },
      { doc: 'كشف الحساب البنكي أو البريدي RIP', note: 'في حالة الرغبة في الدفع الإلكتروني المباشر' }
    ],
    officialFees: 'مجاني للولوج · الضرائب تحسب وفق جدول التصريح G50/G12',
    kioskTips: 'يُفضل إعداد وطباعة استمارة G50 أو G12 على منصة سهلة أولاً لمراجعة الأرقام مع التاجر قبل تأكيد التصريح النهائي بالبوابة لتفادي الغرامات.',
    sahlaAction: {
      label: 'إعداد تصريح G50 / G12 الآن',
      targetTab: 'tax'
    }
  },
  {
    id: 'egov_bawaba',
    category: 'CIVIL_STATUS',
    titleAr: 'بوابة الحالة المدنية (Bawaba Intérieur)',
    titleFr: 'Portail National de l’État Civil',
    authorityAr: 'وزارة الداخلية والجماعات المحلية والتهيئة العمرانية',
    authorityFr: 'Ministère de l’Intérieur et des Collectivités Locales',
    badge: 'حالة مدنية',
    officialUrl: 'https://etatcivil.interieur.gov.dz',
    portalStatus: 'نشط مع التحقق بالرقم التعريفي NIN',
    descriptionAr: 'استخراج وثائق الحالة المدنية الصادرة عن بلديات الوطن (شهادة الميلاد 12خ، عقد الزواج، شهادة الوفاة) الموقعة إلكترونياً بـ Barcode معتمد.',
    requiredDossier: [
      { doc: 'رقم التعريف الوطني البيومتري (NIN)', note: 'مكون من 18 رقماً ومسجل على بطاقة CNI أو جواز السفر البيومتري' },
      { doc: 'رقم عقد الحالة المدنية وسنة التسجيل', note: 'المسجل في الدفتر العائلي أو شهادة ميلاد سابقة' },
      { doc: 'بلدية وولاية تسجيل العقد الأصلية', note: 'حيث تم تقييد شهادة الميلاد أو الزواج' }
    ],
    officialFees: 'مجاني 100% بدون أي رسوم طابع',
    kioskTips: 'استخدم ميزة المسح الضوئي OCR لبطاقة الهوية في منصة سهلة لنسخ رقم الـ NIN المكون من 18 رقماً بنقرة واحدة وتفادي أخطاء الإدخال اليدوي.',
    sahlaAction: {
      label: 'مسح بطاقة الهوية OCR لنسخ الـ NIN',
      targetTab: 'ocr-forms'
    }
  },
  {
    id: 'egov_sidjilcom',
    category: 'TAX_COMMERCE',
    titleAr: 'منصة سجل كوم (Sidjilcom CNRC)',
    titleFr: 'Portail du Registre du Commerce Électronique',
    authorityAr: 'المركز الوطني للسجل التجاري (CNRC)',
    authorityFr: 'Centre National du Registre du Commerce',
    badge: 'تجاري وقانوني',
    officialUrl: 'https://sidjilcom.cnrc.dz',
    portalStatus: 'نشط للبحث واستخراج المستخرجات',
    descriptionAr: 'البوابة المعتمدة لاستخراج مستخرج السجل التجاري الإلكتروني برمز QR، حجز وتثبيت التسميات التجارية، والاستعلام عن الرموز والشركات.',
    requiredDossier: [
      { doc: 'رقم السجل التجاري (N° RC)', note: 'المكون من رمز الولاية وسنة التأسيس' },
      { doc: 'رمز التأكيد والتحقق السري للمستخرج', note: 'المطبوع على النسخة الورقية الأصلية للبطاقة' },
      { doc: 'بطاقة الدفع الإلكتروني (CIB / الذهبية)', note: 'لدفع حقوق استخراج المستخرج إلكترونياً (حوالي 400 دج)' }
    ],
    officialFees: '400 دج لمستخرج السجل التجاري الإلكتروني',
    kioskTips: 'يُطلب مستخرج السجل التجاري الإلكتروني دورياً من التجار لتحديث ملفات البنوك والضرائب ومناقصات الصفقات العمومية.',
    sahlaAction: {
      label: 'إعداد فاتورة تجارية ببيانات الـ RC',
      targetTab: 'invoice'
    }
  },
  {
    id: 'egov_elhanaa',
    category: 'SOCIAL_LABOR',
    titleAr: 'فضاء الهناء (El Hanaa CNAS / CASNOS)',
    titleFr: 'Portail de la Sécurité Sociale CNAS',
    authorityAr: 'الصندوق الوطني للتأمينات الاجتماعية للعمال الأجراء / غير الأجراء',
    authorityFr: 'Caisse Nationale des Assurances Sociales (CNAS)',
    badge: 'ضمان اجتماعي',
    officialUrl: 'https://elhanaa.cnas.dz',
    portalStatus: 'نشط لاستخراج الشهادات ومتابعة الشفاء',
    descriptionAr: 'استخراج شهادة الانتساب (Attestation d’affiliation)، شهادة عدم الانتساب، كشف الأجور السنوي، ومتابعة تعويضات بطاقة الشفاء.',
    requiredDossier: [
      { doc: 'رقم الضمان الاجتماعي (N° Sécurité Sociale)', note: 'المطبوع على بطاقة الشفاء أو شهادة الأجر' },
      { doc: 'كلمة السر للحساب الإلكتروني', note: 'أو التسجيل برقم بطاقة الشفاء وتاريخ الميلاد' },
      { doc: 'البريد الإلكتروني للزبون', note: 'لتلقي الشهادة بصيغة PDF' }
    ],
    officialFees: 'مجاني للعمال والمتقاعدين وأصحاب الحقوق',
    kioskTips: 'شهادة عدم الانتساب مطلوبة بكثرة لملفات منحة البطالة، السكن، والمنح الجامعية. تأكد من تحميل الشهادة الأصلية الحاملة لرمز الباركود.',
    sahlaAction: {
      label: 'تجهيز طلب إداري أو طعن',
      targetTab: 'letters'
    }
  },
  {
    id: 'egov_wassit',
    category: 'SOCIAL_LABOR',
    titleAr: 'منصة الوسيط (Wassit Online - ANEM)',
    titleFr: 'Agence Nationale de l’Emploi (ANEM)',
    authorityAr: 'الوكالة الوطنية للتشغيل (ANEM)',
    authorityFr: 'Agence Nationale de l’Emploi',
    badge: 'تشغيل ومنحة بطالة',
    officialUrl: 'https://wassitonline.anem.dz',
    portalStatus: 'نشط للتسجيل وتجديد بطاقات العمل',
    descriptionAr: 'التسجيل كطالب عمل، تجديد بطاقة طلب العمل دورياً (كل 6 أشهر)، الترشح لعروض الشغل، ومتابعة مواعيد وملفات منحة البطالة.',
    requiredDossier: [
      { doc: 'بطاقة التعريف الوطنية البيومترية', note: 'أصلية وسارية المفعول' },
      { doc: 'سيرة ذاتية عصرية ومفصلة (CV)', note: 'تتضمن المؤهل والمهارات وأرقام الاتصال' },
      { doc: 'الشهادة المدرسية أو الدبلوم الجامعي / التكوين المهني', note: 'لتصنيف الرتبة المهنية' },
      { doc: 'بطاقة إثبات الوضعية تجاه الخدمة الوطنية', note: 'مؤدى، معفى، أو مؤجل للذكور' },
      { doc: 'صك بريدي مشطوب (Chèque barré)', note: 'لحساب منحة البطالة في بريد الجزائر' }
    ],
    officialFees: 'مجاني 100%',
    kioskTips: 'الزبون يحتاج دائماً لسيرة ذاتية مطبوعة وصك مشطوب وصور شمسية لمقابلة مستشار التشغيل؛ استغل منصة سهلة لتجهيز باقة كاملة له بخصم مغرٍ!',
    sahlaAction: {
      label: 'توليد سيرة ذاتية ورسالة تحفيز ANEM',
      targetTab: 'cv'
    }
  },
  {
    id: 'egov_awlya',
    category: 'EDUCATION',
    titleAr: 'فضاء الأولياء والتربية (Awlya MEN)',
    titleFr: 'Espace Tuteurs et Candidatures MEN',
    authorityAr: 'وزارة التربية الوطنية · مديرية الرقمنة',
    authorityFr: 'Ministère de l’Éducation Nationale',
    badge: 'تربية وتعليم',
    officialUrl: 'https://awlya.education.gov.dz',
    portalStatus: 'نشط لكشوف النقاط والتسجيل المدرسي',
    descriptionAr: 'استخراج كشوف النقاط الفصلية لتلاميذ الابتدائي والمتوسط والثانوي، تسجيل تلاميذ الأولى ابتدائي الجدد، ومتابعة الغيابات والتحويلات المدرسية.',
    requiredDossier: [
      { doc: 'البريد الإلكتروني وكلمة المرور للولي', note: 'المسجل به لدى مدراء المؤسسات التعليمية' },
      { doc: 'رقم التعريف المدرسي للتلميذ (Numéro d’identification)', note: 'موجود في كشف نقاط سابق أو الشهادة المدرسية' }
    ],
    officialFees: 'مجاني للتلاميذ وأولياء الأمور',
    kioskTips: 'فترات إعلان نتائج الفصول ونتائج البيام والباك تشهد ضغطاً هائلاً؛ جهز كشكك بطباعة سريعة كشوفات النقاط واستعد ببنك مواضيع سهلة لمراجعة التلاميذ.',
    sahlaAction: {
      label: 'استعراض بنك مواضيع BEM / BAC والحلول',
      targetTab: 'school'
    }
  },
  {
    id: 'egov_progres',
    category: 'EDUCATION',
    titleAr: 'بوابة بروغرس (Progres MESRS)',
    titleFr: 'Plateforme Numérique PROGRES Universités',
    authorityAr: 'وزارة التعليم العالي والبحث العلمي',
    authorityFr: 'Ministère de l’Enseignement Supérieur',
    badge: 'جامعة ومنح',
    officialUrl: 'https://progres.mesrs.dz',
    portalStatus: 'نشط للطلبة وحاملي البكالوريا',
    descriptionAr: 'تأكيد التسجيلات الجامعية الأولية والنهائية لحاملي البكالوريا، طلبات التحويلات الداخلية والخارجية، حجز الإيواء والنقل الجامعي، وتطبيق حافلتي.',
    requiredDossier: [
      { doc: 'رقم تسجيل البكالوريا (Matricule BAC)', note: 'المكتوب على استدعاء الامتحان وكشف النقاط' },
      { doc: 'الرقم السري للبكالوريا (Code secret)', note: 'المدون أسفل كشف النقاط الأصلي' },
      { doc: 'بطاقة الدفع الإلكتروني (الذهبية)', note: 'لدفع حقوق التسجيل الجامعي المقدرة بـ 200 دج' }
    ],
    officialFees: '200 دج رسوم التسجيل الجامعي السنوي',
    kioskTips: 'في شهر جويلية وأوت يتدفق مئات الناجحين في البكالوريا لمقاهي الإنترنت؛ احرص على مساعدة الطالب في اختيار رغبات التوجيه بعناية وطباعة بطاقة التوجيه.',
    sahlaAction: {
      label: 'توليد بحث مدرسي / جامعي أكاديمي',
      targetTab: 'school'
    }
  },
  {
    id: 'egov_aadl',
    category: 'HOUSING',
    titleAr: 'بوابة سكنات عدل والترقوي (AADL / LPP)',
    titleFr: 'Agence AADL - Logements Location-Vente',
    authorityAr: 'وزارة السكن والعمران · الوكالة الوطنية لتحسين السكن وتطويره',
    authorityFr: 'Ministère de l’Habitat · AADL',
    badge: 'سكن وعمران',
    officialUrl: 'https://aadl.com.dz',
    portalStatus: 'نشط لمتابعة الملفات وأوامر الدفع',
    descriptionAr: 'متابعة ملفات مكتتبي برامج البيع بالإيجار (عدل 2 وعدل 3)، استخراج أوامر الدفع (Ordres de versement)، واختيار المواقع السكنية.',
    requiredDossier: [
      { doc: 'رقم تسجيل المكتتب (N° d’inscription)', note: 'ورمز المرور السري الخاص بالملف' },
      { doc: 'بطاقة التعريف الوطنية البيومترية', note: 'للتأكد من مطابقة الأسماء والأرقام' },
      { doc: 'الوثائق التكميلية (كشف الراتب، عدم العمل للزوجين)', note: 'وفق متطلبات كل شطر وتحديث' }
    ],
    officialFees: 'مجاني للخدمات الإلكترونية',
    kioskTips: 'أوامر دفع أقساط عدل تتطلب طباعة دقيقة وواضحة جداً للباركود حتى يتمكن قابض بنك القرض الشعبي الجزائري CPA من مسحه دون أخطاء.',
    sahlaAction: {
      label: 'طباعة نماذج واستمارات رسمية',
      targetTab: 'ocr-forms'
    }
  }
];

// 4. مركز صيانة وتشخيص أعطال طابعات المحل (Cybercafé Hardware & Printer Troubleshooter)
const CYBERCAFE_HARDWARE_GUIDES = [
  {
    id: 'epson_ecotank',
    brand: 'Epson',
    models: 'EcoTank L3150 / L3250 / L805 / L850 / L1800',
    popularityTag: 'الأكثر انتشاراً في الجزائر 🇩🇿',
    issues: [
      {
        title: 'خطوط بيضاء أفقية أو بهتان ألوان صور الهوية',
        symptom: 'الصورة تخرج بخطوط بيضاء أو يغلب عليها اللون الوردي/الأزرق',
        cause: 'انسداد جزئي في فوهات رأس الطباعة (Buses bouchées) بسبب ترك الطابعة دون استخدام أو رداءة الحبر.',
        solutionSteps: [
          'افتح لوحة تحكم الطابعة على الحاسوب (Epson Printer Preferences).',
          'اختر تبويب الصيانة (Maintenance) ثم اضغط فحص الفوهات (Nozzle Check).',
          'اطبع صفحة الفحص؛ إذا وجدت خطوطاً متقطعة، قم بتشغيل "تنظيف رأس الطباعة" (Head Cleaning) لمرة واحدة فقط.',
          'انتظر 5 دقائق واختبر مجدداً. إذا استمرت، استخدم "التنظيف العميق" (Power Ink Flushing) بحذر لكونه يستهلك الحبر.'
        ]
      },
      {
        title: 'وميض ضوئي الحبر والورق بالتناوب (Erreur Tampon d’encre)',
        symptom: 'تتوقف الطابعة وتومض أضواء قطرة الحبر وسلة الورق بالتناوب مع رسالة "Durée de vie des tampons"',
        cause: 'امتلاء عداد وسادة امتصاص الحبر العادم (Waste Ink Pad Counter) بعد طباعة آلاف الصفحات لحماية الدوائر.',
        solutionSteps: [
          'هذا عطل برمجي لحماية الطابعة وليس عطلاً ميكانيكياً.',
          'استخدم برنامج تصفير العدادات المعتمد لطابعات إبسون (Epson Adjustment Program / WicReset).',
          'اختر المنفذ USB المتصل واضغط على (Waste Ink Pad Counter Reset) ثم أعد تشغيل الطابعة.',
          'يُنصح بتركيب خرطوم تصريف خارجي للفضلات (Drain externe) لتفادي فيضان الحبر داخل الطابعة مستقبلاً.'
        ]
      },
      {
        title: 'صعوبة سحب ورق الصور اللامع الثقيل (230g)',
        symptom: 'الطابعة تسحب الورق بصعوبة أو تخرجه أبيض بدون طباعة مع صوت احتكاك',
        cause: 'اتساخ أسطوانة سحب الورق المطاطية (Rouleau d’entraînement) بالغبار والمسحوق الأبيض للورق.',
        solutionSteps: [
          'افصل الكهرباء عن الطابعة تماماً.',
          'بلل قطعة قماش قطنية ناعمة ببضع قطرات من الكحول أو الماء المقطر.',
          'امسح أسطوانة السحب المطاطية بلطف مع تدويرها يدوياً لتنظيف كامل المحيط.',
          'ضع ورقة واحدة فقط من الورق اللامع 10×15 سم في الممر الخلفي واضبط الموجهات البلاستيكية بإحكام دون ضغط.'
        ]
      }
    ]
  },
  {
    id: 'canon_megatank',
    brand: 'Canon',
    models: 'PIXMA MegaTank G3411 / G2411 / G3420 / TS3440',
    popularityTag: 'شائعة جداً في التصوير المكتبي',
    issues: [
      {
        title: 'رمز الخطأ 5B00 أو P07 على الشاشة الصغيرة',
        symptom: 'وميض ضوء التنبيه 7 أو 8 مرات مع توقف كامل وتجميد مهام الطباعة',
        cause: 'امتلاء خزان امتصاص الحبر المستهلك (Absorbeur d’encre plein).',
        solutionSteps: [
          'أدخل الطابعة في وضع الخدمة (Service Mode): أطفئ الطابعة، اضغط زر Stop/Cancel مع زر Power معاً، ثم حرر Stop واضغط عليه 5 مرات متتالية، ثم حرر زر Power.',
          'عندما يثبت الضوء الأخضر، تكون الطابعة في وضع الصيانة.',
          'استخدم أداة Canon Service Tool V3400 أو V4905 لتصفير خزان الحبر واضغط Set.',
          'أعد تشغيل الطابعة لتعود للعمل بشكل طبيعي.'
        ]
      },
      {
        title: 'تراجع الحبر في الأنابيب الشفافة وظهور فقاعات هواء',
        symptom: 'الأنابيب البلاستيكية الواصلة بين الخزانات ورؤوس الطباعة فارغة أو بها فراغات هواء',
        cause: 'ترك سدادات الخزانات مفتوحة أو استبدال الرأس دون إغلاق صمام الأمان.',
        solutionSteps: [
          'من لوحة الصيانة بالحاسوب، اختر "تطهير الحبر" (Ink Flush / Nettoyage en profondeur).',
          'يقوم محرك الطابعة بسحب الحبر بقوة لملء الأنابيب حتى تصل للرؤوس.',
          'تأكد من أن مستوى الحبر في الخزانات فوق خط المنتصف قبل بدء العملية لتفادي احتراق الرؤوس.'
        ]
      }
    ]
  },
  {
    id: 'hp_laserjet',
    brand: 'HP',
    models: 'LaserJet P1102 / 107w / LaserJet Pro MFP M130',
    popularityTag: 'سيدة الطباعة بالأبيض والأسود في الجزائر',
    issues: [
      {
        title: 'سواد على حواف الورقة أو خطوط سوداء متكررة',
        symptom: 'خط عمودي أسود بطول الورقة A4 يتكرر كل 7.5 سم',
        cause: 'خدش في أسطوانة الدرام الحساسة للضوء (Rouleau Tambour OPC) داخل خرطوشة التونر 85A / 83A.',
        solutionSteps: [
          'افتح غطاء الطابعة وأخرج خرطوشة التونر.',
          'ارفع الغطاء الواقي وافحص الأسطوانة الخضراء/الزرقاء (OPC Drum).',
          'إذا لاحظت خدشاً دائرياً على الحافة، يجب تغيير أسطوانة الدرام فقط (سعرها اقتصادي جداً حوالي 300 دج) دون الحاجة لشراء تونر كامل.',
          'امسح شفرة المسح (Raclette Wiper Blade) للتخلص من بودرة الحبر الزائدة.'
        ]
      },
      {
        title: 'رسالة انحشار الورق (Bourrage) مع عدم وجود ورق عالق',
        symptom: 'الطابعة ترفض العمل وتدعي انحشار الورق مع أن المسار نظيف تماماً',
        cause: 'تعطل ذراع حساس الورق البلاستيكي الصغير (Sensor flag) أو تراكم غبار الورق عليه.',
        solutionSteps: [
          'انفخ مسار الورق بعلبة هواء مضغوط أو مروحة هواء لإزالة الغبار وقطع الورق الممزقة المتناهية الصغر.',
          'تأكد من عودة الذراع البلاستيكي الأسود الصغير في مدخل الورق إلى وضعه الطبيعي العمودي بحرية حركة.'
        ]
      }
    ]
  }
];

if (typeof window !== 'undefined') {
  window.DEFAULT_BOUND_DEVICES = DEFAULT_BOUND_DEVICES;
  window.DEFAULT_ACCOUNTING_SAMPLE = DEFAULT_ACCOUNTING_SAMPLE;
  window.EGOV_SERVICES_DIRECTORY = EGOV_SERVICES_DIRECTORY;
  window.CYBERCAFE_HARDWARE_GUIDES = CYBERCAFE_HARDWARE_GUIDES;
} else if (typeof globalThis !== 'undefined') {
  globalThis.DEFAULT_BOUND_DEVICES = DEFAULT_BOUND_DEVICES;
  globalThis.DEFAULT_ACCOUNTING_SAMPLE = DEFAULT_ACCOUNTING_SAMPLE;
  globalThis.EGOV_SERVICES_DIRECTORY = EGOV_SERVICES_DIRECTORY;
  globalThis.CYBERCAFE_HARDWARE_GUIDES = CYBERCAFE_HARDWARE_GUIDES;
}

