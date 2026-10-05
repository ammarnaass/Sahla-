# 🏛️ Sahla Enterprise Architecture (المعمارية المؤسساتية لمنصة سهلة)

وثيقة المعمارية التقنية والهندسية المعتمدة لمنصة **سهلة (Sahla)** — المنصة الرقمية الوطنية المتكاملة لأصحاب الكيوسكات، المكتبات، مقاهي الإنترنت ومكاتب الخدمات العامة عبر الـ 58 ولاية جزائرية.

---

## 🛠️ المعمارية التقنية (Tech Stack)

- **الواجهة الأمامية (Frontend):** Next.js (App Router), React, Tailwind CSS (RTL First), PWA (Offline/Weak Connection Ready).
- **الخطوط والتصميم:** خط Cairo وTajawal عبر Google Fonts، واجهات داكنة وفاتحة عصرية (Glassmorphism & Micro-interactions).
- **الخادم وقاعدة البيانات (Backend & DB):** Next.js Server Actions / API Routes + PostgreSQL + Prisma ORM + Redis (Queues & Rate Limiting).
- **محرك معالجة الوثائق (PDF Engine):** HTML to PDF (A4 300DPI) + Coordinates Overlay للنماذج الرسمية.
- **التخزين الآمن (Storage):** متوافق مع S3 مع روابط موقعة مؤقتة وحذف آلي بعد 24-72 ساعة (وفق قانون 18-07).
- **الذكاء الاصطناعي (AI & Vision):** نماذج Google Gemini لتوليد المحتوى، الترجمة الاحترافية، التعرف الضوئي OCR، وتجهيز صور الهوية.

---

## 📑 فهرس المحتويات (Table of Contents)

1. [المعمارية التقنية (Tech Stack)](#️-المعمارية-التقنية-tech-stack)
2. [المخطط المعماري للنظام (System Architecture Diagram)](#1-المخطط-المعماري-للنظام-system-architecture-diagram)
3. [هيكلية المشروع والمجلدات (Project & Directory Structure)](#2-هيكلية-المشروع-والمجلدات-project--directory-structure)
4. [إدارة الصلاحيات والأدوار (Role-Based Access Control - RBAC)](#3-إدارة-الصلاحيات-والأدوار-role-based-access-control---rbac)
5. [طبقة البيانات والتخزين (Persistence, PostgreSQL & S3)](#4-طبقة-البيانات-والتخزين-persistence-postgresql--s3)
6. [محرك الوثائق وجسر الطباعة الفوري (PDF Engine & Real-Time Print Bridge)](#5-محرك-الوثائق-وجسر-الطباعة-الفوري-pdf-engine--real-time-print-bridge)
7. [محرك الذكاء الاصطناعي والرؤية الحاسوبية (Google Gemini AI & Vision)](#6-محرك-الذكاء-الاصطناعي-والرؤية-الحاسوبية-google-gemini-ai--vision)
8. [الامتثال للقوانين والتنظيمات الجزائرية (Algerian Regulatory Compliance)](#7-الامتثال-للقوانين-والتنظيمات-الجزائرية-algerian-regulatory-compliance)
9. [دليل واجهات البرمجة (API Specification & Server Actions)](#8-دليل-واجهات-البرمجة-api-specification--server-actions)

---

## 1. المخطط المعماري للنظام (System Architecture Diagram)

تعتمد منصة سهلة على معمارية طبقية حديثة تجمع بين أداء **Next.js App Router**، والمعالجة اللحظية لمهام الخلفية عبر **Redis Queues**، ومرونة **Server Actions** و **Prisma ORM** مع قاعدة بيانات **PostgreSQL** الموزعة.

```mermaid
graph TD
    UserClient[📱 Client PWA / Phone Browser / Desktop PC]

    subgraph Presentation_Layer [طبقة العرض والواجهات (Frontend & PWA)]
        AppRouter[Next.js App Router - RTL First]
        DesignSystem[Tailwind CSS + Cairo / Tajawal + Glassmorphism]
        PWAEngine[PWA Service Worker - Offline & Weak 3G/4G Cache]
    end

    subgraph Security_Middleware [طبقة الأمان والتحقق (Security & Guards)]
        AuthGuard[RBAC Guard: SUPER_ADMIN | SHOP_ADMIN | STAFF]
        RateLimiter[Redis Rate Limiting - 5 req/min OTP]
        SessionMgr[JOSE JWT & HttpOnly Cookies]
    end

    subgraph Application_Layer [طبقة الخدمات ومنطق الأعمال (Application & Business Logic)]
        ServerActions[Next.js Server Actions & API Routes]
        AuthSvc[Phone OTP & Algerian Carriers Engine]
        WalletSvc[Atomic Points Engine & Scratch Cards]
        DocSvc[Document Processing Service]
        PrintBridge[SSE Real-Time Print Bridge /events]
    end

    subgraph Async_Engine [المعالجة غير المتزامنة والذكاء الاصطناعي (Async & AI)]
        RedisQueue[(Redis Queues & Worker Jobs)]
        GeminiAI[Google Gemini Models - OCR & Generation & Vision]
        PDFRenderer[HTML to PDF A4 300DPI + Coordinates Overlay]
    end

    subgraph Persistence_Storage [قواعد البيانات والتخزين الآمن (Data & Storage)]
        PrismaORM[Prisma ORM Client]
        PostgreSQL[(PostgreSQL Enterprise Database)]
        S3Storage[(S3 Compatible Storage - 24-72h Auto-Purge TTL)]
    end

    UserClient --> AppRouter
    AppRouter --> DesignSystem & PWAEngine
    AppRouter --> Security_Middleware
    Security_Middleware --> Application_Layer
    
    Application_Layer --> ServerActions
    ServerActions --> AuthSvc & WalletSvc & DocSvc & PrintBridge
    
    DocSvc --> RedisQueue
    RedisQueue --> GeminiAI & PDFRenderer
    PDFRenderer --> S3Storage
    
    Application_Layer --> PrismaORM
    PrismaORM --> PostgreSQL
    
    PrintBridge -.->|Server-Sent Events| UserClient
```

---

## 2. هيكلية المشروع والمجلدات (Project & Directory Structure)

تم تنظيم المشروع ليفصل بين شفرة واجهات وتطبيقات Next.js الحديثة، ونماذج قاعدة البيانات، والخدمات المركزية:

```
Sahla/
├── src/                              # الجذر الموحد للتطبيق والواجهات (Root Directory)
│   ├── app/                          # Next.js App Router (الصفحات، المسارات، ونقاط النهاية)
│   │   ├── auth/                     # مصادقة الدخول السريع برمز الهاتف (OTP)
│   │   ├── onboarding/               # إعداد وتخصيص المحل للزيارة الأولى
│   │   ├── dashboard/                # لوحة التحكم المركزية واستوديو الوثائق
│   │   │   ├── layout.tsx            # مخطط اللوحة مع مزامنة التبويبات وSidebar
│   │   │   └── page.tsx              # صفحة التحكم المركزية لجميع الخدمات
│   │   ├── legacy/                   # صفحة المحاكي المحولة (Next.js Legacy Converted Page)
│   │   ├── api/                      # مسارات Next.js API Routes (JSON Endpoints)
│   │   │   ├── auth/                 # طلب والتحقق من رمز OTP
│   │   │   ├── shops/                # بيانات المحل والموظفين
│   │   │   ├── wallet/               # عمليات الشحن والخصم الذري
│   │   │   └── print/                # جسر الطباعة اللاسلكي
│   │   ├── layout.tsx                # المخطط العام (RTL, Cairo Font, Themes Provider)
│   │   └── globals.css               # أنماط Tailwind CSS v4 ومتغيرات الألوان والتأثيرات
│   │
│   ├── components/                   # مكونات React المعيارية
│   │   ├── dashboard/                # تبويبات اللوحة (WalletTab, DocumentsTab, StaffAccountTab, SettingsTab, SuperAdminTab, StudioModal)
│   │   ├── landing/                  # أقسام الصفحة التعريفية (Hero, Calculator, FAQ)
│   │   └── ui/                       # عناصر التصميم والأزرار والنوافذ
│   │
│   ├── contexts/                     # سياقات الحالة المشتركة (AuthContext, DashboardTabContext, LanguageContext)
│   ├── hooks/                        # خطافات React المخصصة (useOnline, usePrintBridge)
│   ├── lib/                          # المكتبات والأدوات المساعدة (auth, constants, db, gemini, analytics)
│   ├── manifest.json                 # Web App Manifest (PWA Installable)
│   └── sw.js                         # Service Worker (Offline First Caching)
│
├── prisma/
│   └── schema.prisma                 # المخطط الهيكلي لقاعدة بيانات PostgreSQL
│
├── server/                           # المحرك الخلفي الموسع وجسر SSE للطباعة (يخدم من src/)
│   ├── config/                       # الثوابت المؤسساتية والإعدادات الوطنية
│   ├── controllers/                  # وحدات التحكم المنطقية
│   ├── middleware/                   # حراس الأمان والتحقق من الصلاحيات (RBAC)
│   ├── repositories/                 # مستودعات الاستعلام والبيانات
│   └── services/                     # الخدمات المركزية (Auth, Shop, Wallet, Print)
│
├── docs/                             # مستندات متطلبات المنتج (PRD) والأدلة التفصيلية
├── package.json                      # تبعيات المشروع (Next.js 15, React 19, Tailwind, Prisma)
├── ARCHITECTURE.md                   # وثيقة المعمارية التقنية الرسمية (هذا الملف)
└── README.md                         # الدليل التعريفي الشامل للمنصة
```

---

## 3. إدارة الصلاحيات والأدوار (Role-Based Access Control - RBAC)

تعتمد المنصة نموذج أمان صارم يتكون من ثلاثة أدوار رئيسية لحماية العمليات وموارد المحل:

| الرتبة (Role) | حساب الاختبار الافتراضي | الصلاحيات والمسؤوليات | نطاق الوصول |
| :--- | :---: | :--- | :--- |
| **👑 مدير النظام (SUPER_ADMIN)** | `0550 00 00 00`<br>`OTP: 123456` | إدارة المنصة الوطنية، مراقبة استهلاك الذكاء الاصطناعي، شحن الأرصدة الإدارية، توليد دفعات بطاقات الشحن | تحكم كامل عبر كافة الـ 58 ولاية، تفعيل أو تجميد المحلات |
| **🛡️ أدمن المحل (SHOP_ADMIN / OWNER)** | `0555 12 34 56`<br>`OTP: 123456` | مالك المحل أو الكيوسك أو مقهى الإنترنت المعتمد | إدارة الخزينة والمحفظة، إضافة/حذف الموظفين، ربط الطابعات، وتعديل إعدادات المحل |
| **👤 موظف المحل (STAFF / EMPLOYEE)** | `0661 99 88 77`<br>`OTP: 123456` | كاتب عمومي، مصمم وثائق، عامل الكاونتر | مخصص حصرياً لاستوديو الوثائق، إدخال بيانات الزبائن، والطباعة. ممنوع من الاطلاع على السجل المالي للمحل أو تغيير الإعدادات |

---

## 4. طبقة البيانات والتخزين (Persistence, PostgreSQL & S3)

### 4.1 قاعدة البيانات العلائقية (PostgreSQL + Prisma ORM)
- تم بناء نماذج البيانات وفق المخطط الرسمي في [`prisma/schema.prisma`](file:///home/ammar/Sahla%20/prisma/schema.prisma).
- **الخصم الذري (Atomic Transactions):** عمليات سحب النقاط وشحنها تُنفذ حصرياً داخل معاملات ذرية (`prisma.$transaction`) لضمان عدم ضياع أي نقطة تحت أي ظرف.
- **سجل الحركات المالي (Immutable Ledger):** تسجيل كل عملية استهلاك أو شحن بنوعها (`CREDIT`, `DEBIT`, `REFUND`) ورقم المعاملة الفريد وقيمة الرصيد بعد العملية.

### 4.2 التخزين السحابي الآمن المتوافق مع S3 (Secure Storage)
- رفع ملفات الـ PDF وصور الهوية على مخزن متوافق مع S3 مشفر أثناء النقل والتخزين (SSE-S3).
- استخدام **الروابط الموقعة المؤقتة (Pre-signed URLs)** بمدة صلاحية قصيرة للمعاينة والتحميل.
- **الحذف الآلي (Lifecycle TTL):** تفعيل قاعدة حذف آلية للمستندات بعد مدة تتراوح بين **24 إلى 72 ساعة** امتثالاً لأحكام القانون الجزائري رقم 18-07.

### 4.3 إدارة قوائم الانتظار ومعدل الطلبات (Redis Queues & Rate Limiting)
- إدارة طوابير المعالجة (Background Worker Queues) للمهام الثقيلة (توليد الـ PDF عالي الدقة، استدعاءات نماذج الرؤية).
- تطبيق محدد الطلبات الذكي: منع تجاوز 5 طلبات OTP في الساعة لكل رقم هاتف، وحظر لمدة 15 دقيقة بعد 5 محاولات إدخال خاطئة.

---

## 5. محرك الوثائق وجسر الطباعة الفوري (PDF Engine & Real-Time Print Bridge)

### 5.1 محرك توليد الوثائق (A4 300DPI Engine)
- **HTML to PDF Rendering:** تحويل تصاميم الوثائق المجهزة بـ HTML وTailwind CSS بدقة طباعة مطبعية 300DPI قياس A4 (210×297 مم).
- **Coordinates Overlay:** إسقاط البيانات المتغيرة ديناميكياً بالإحداثيات المليمترية الدقيقة فوق الاستمارات الإدارية الرسمية الممسوحة ضوئياً (مثل استمارات الحالة المدنية، تصاريح الضرائب Série G N° 50 وG N° 12 IFU).

### 5.2 جسر الطباعة اللاسلكي الفوري (Phone-to-PC Print Bridge)
- **البروتوكول:** Server-Sent Events (SSE) عبر نقطة النهاية `GET /events?pin=XXXX`.
- **آلية العمل:** يقوم العامل بفتح صفحة الاستقبال على حاسوب المحل الموصول بالطابعة وإدخال رمز PIN المكون من 4 أرقام (أو مسح رمز QR). عند النقر على «طباعة» من الهاتف، يتم إرسال حمولة الوثيقة فوراً عبر خادم SSE لتفتح نافذة الطباعة التلقائية على الحاسوب دون تثبيت أي برامج أو تعريفات إضافية.

---

## 6. محرك الذكاء الاصطناعي والرؤية الحاسوبية (Google Gemini AI & Vision)

توظف منصة سهلة نماذج **Google Gemini** متعددة الوسائط (Multimodal) لإنجاز المهام الذكية التالية:

1. **التعرف الضوئي على المستندات الرسمية (Multimodal OCR):**
   - استخراج بيانات بطاقات التعريف الوطنية وجوازات السفر ورخص السياقة البيومترية الجزائرية بدقة عالية وتعبئة الاستمارات الإدارية تلقائياً.
   - استخراج بيانات السير الذاتية القديمة المكتوبة بخط اليد أو الممسوحة ضوئياً وإعادة هيكلتها في قوالب حديثة.
2. **تجهيز صور الهوية البيومترية (ID Photo Processing):**
   - عزل خلفية الوجه بدقة واستبدالها بالخلفية الرمادية الفاتحة أو البيضاء الرسمية.
   - ضبط القياسات على المعيار الجزائري المعتمد (35×45 مم) مع مصفوفة طباعة فورية (شبكة 4 أو 8 صور على ورق الصور A6 أو A4).
3. **التوليد والترجمة الإدارية الاحترافية:**
   - صياغة رسائل التحفيز (Motivation Letters)، الطعون الإدارية، وعقود البيع والإيجار وفق الصياغات القانونية الجزائرية باللغات الثلاث (عربية، فرنسية، إنجليزية).

---

## 7. الامتثال للقوانين والتنظيمات الجزائرية (Algerian Regulatory Compliance)

1. **القانون رقم 18-07 (حماية المعطيات ذات الطابع الشخصي):**
   - تشفير بيانات المواطنين الحساسة.
   - سياسة الاحتفاظ المؤقت: حذف ملفات الهوية والمستندات نهائياً بعد انتهاء صلاحيتها (24–72 ساعة).
   - طلب موافقة الزبون والمستخدم الصريحة قبل معالجة أي وثيقة شخصية.
2. **القانون رقم 18-05 (التجارة الإلكترونية والدفع الإلكتروني):**
   - مطابقة متطلبات الفوترة الرسمية للمحلات (NIF, NIS, RC, Article d'imposition, TVA, Timbre Fiscal).
   - دعم المعاملات المرجعية عبر شبكة الدفع الإلكتروني الوطنية (SATIM, BaridiMob, Edahabia).
3. **نظام الترميز الإداري للـ 58 ولاية:**
   - اعتماد الترقيم الوطني الموحد من الولاية 01 (أدرار) إلى الولاية 58 (المنيعة).

---

## 8. دليل واجهات البرمجة (API Specification & Server Actions)

| الطريقة | المسار (Endpoint) | الوظيفة | الصلاحية المطلوبة |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/otp/request` | إرسال رمز OTP للتحقق عبر SMS أو WhatsApp | عام (Public) |
| `POST` | `/api/auth/otp/verify` | مطابقة رمز OTP وإنشاء جلسة آمنة (JWT / Cookie) | عام (Public) |
| `POST` | `/api/auth/logout` | إنهاء الجلسة ومسح ملفات تعريف الارتباط | مصادق عليه |
| `GET` | `/api/shops/profile` | جلب الملف التعريفي وإعدادات المحل | `SHOP_ADMIN` |
| `POST` | `/api/shops/profile` | تحديث بيانات المحل (الولاية، البلدية، الطابعات) | `SHOP_ADMIN` |
| `GET` | `/api/shop/staff` | استعراض قائمة الموظفين التابعين للمحل | `SHOP_ADMIN` |
| `POST` | `/api/shop/staff` | إضافة موظف جديد وتعيين صلاحيات الكاونتر | `SHOP_ADMIN` |
| `DELETE` | `/api/shop/staff/:id` | إلغاء وصول موظف وإبطال جلسته | `SHOP_ADMIN` |
| `GET` | `/api/wallet/ledger` | استخراج كشف الحركات المالية غير القابل للتعديل | `SHOP_ADMIN` |
| `POST` | `/api/wallet/redeem-scratch` | شحن الرصيد الفوري عبر كود بطاقة الشحن (16 رقماً) | `SHOP_ADMIN` |
| `POST` | `/api/wallet/pay-gateway` | شحن إلكتروني عبر بريدي موب / البطاقة الذهبية (SATIM) | `SHOP_ADMIN` |
| `POST` | `/api/jobs/create` | إنشاء مهمة توليد وثيقة واقتطاع النقاط ذرياً | مصادق عليه |
| `GET` | `/events?pin=XXXX` | مجرى أحداث SSE لاستقبال أوامر الطباعة بالحاسوب | حاسوب المحل المربوط |
| `POST` | `/api/send-print` | إرسال أمر طباعة مباشر من الهاتف إلى حاسوب الكاونتر | مصادق عليه |
| `GET` | `/api/admin/overview` | لوحة المؤشرات الوطنية وتوزيع الـ 58 ولاية | `SUPER_ADMIN` |
| `POST` | `/api/admin/shops/topup` | شحن رصيد إداري استثنائي لمحطة معتمدة | `SUPER_ADMIN` |
| `POST` | `/api/admin/shops/toggle` | تجميد أو إعادة تفعيل اشتراك محل | `SUPER_ADMIN` |

---

> [!NOTE]
> تمثل هذه الوثيقة المرجع الأساسي للتطوير والتكامل الهندسي لمنصة سهلة. يتم تحديثها دورياً لتواكب تطورات المنصة والتحسينات المعمارية المستمرة.
