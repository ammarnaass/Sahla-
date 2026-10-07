# 🔔 خطة معمارية وتنفيذية شاملة: نظام الإشعارات الذكي (Sahla Smart Notification System)
### معمارية التنبيهات اللحظية · مركز الإشعارات السيادي · وربط أحداث الذكاء الاصطناعي والمعاملات والامتثال للقانون 18-07
**منصة سهلة لإدارة الخدمات والمستندات — Sahla SaaS · الإصدار 2.0**

---

## 🎯 1. الرؤية والهدف الاستراتيجي (Strategic Vision)

تعتمد منصة **سهلة** على دورة تشغيل سريعة وكثيفة داخل مقاهي الإنترنت والأكشاك والمكتبات في الجزائر. في هذا الوسط التشغيلي الحيوي:
1. صاحب المحل بحاجة ماسة لمعرفة حالة العمليات الطويلة (مثل توليد البحوث المدرسية ومذكرات التخرج بالذكاء الاصطناعي) دون الحاجة لإبقاء الصفحة مفتوحة أو انتظار المعالجة يدوياً.
2. هناك حاجة ملحة لتنبيهات الرصيد المالي واستهلاك النقاط لتجنب توقف خدمة الزبائن فجأة عند نفاد النقاط.
3. الامتثال القانوني الجزائري (**القانون 18-07 المتعلق بحماية المعطيات ذات الطابع الشخصي**) يفرض إشعار صاحب المحل بانتهاء فترة صلاحية الوثائق المؤقتة (72 ساعة) قبل الحذف النهائي المشفر.

### الأهداف الأساسية للنظام:
* **تنبيهات فورية متعددة الطبقات (Multi-Layer Notifications):**
  - **رسائل تفاعلية لحظية (Live Toast Alerts):** تظهر فور إتمام العمليات دون مقاطعة سير العمل.
  - **مركز الإشعارات الدائم (Notification Center & Bell):** جرس تفاعلي مع عداد نابض وقائمة منسدلة مبوبة ومؤرشفة.
  - **صفحة أرشيف الإشعارات الكاملة (`/dashboard/notifications`):** سجل دقيق لكافة التنبيهات وإمكانية البحث والفرز.
* **قناة بث لحظي خفيفة وعالية الكفاءة (Server-Sent Events - SSE):**
  - استخدام SSE لبث الإشعارات في الزمن الحقيقي من الخادم إلى المتصفح مع دعم آلية استطلاع احتياطية (Long Polling Fallback).
* **ربط شامل بأحداث المنصة (End-to-End Triggers):**
  - مزودو الذكاء الاصطناعي (اكتمال خطة البحث، اكتمال التوليد الكامل، تبديل المحرك الاحتياطي Failover).
  - المعاملات المالية (شحن رصيد الكشك، اقتراب نفاد النقاط، استهلاك النقاط).
  - دورة حياة الملفات (تنبيه ما قبل الحذف بعد 72 ساعة، تنبيه حذف الملفات).
  - الأمان والتحكم (محاولات الدخول، تعديل الإعدادات الحساسة).

---

## 🧩 2. المخطط المعماري وتدفق البيانات (System Architecture & Sequence)

```mermaid
graph TD
    subgraph مشغلات الأحداث (Event Triggers)
        AIEvent["⚡ محرك الذكاء الاصطناعي (AI Provider Router)"]
        LedgerEvent["💰 نظام النقاط والمالية (Ledger & Points)"]
        LegalEvent["⚖️ مدقق القانون 18-07 (72h Expiry Worker)"]
        SecurityEvent["🛡️ أمان النظام ومحاولات الدخول"]
    end

    subgraph طبقة المعالجة والتوزيع (Notification Engine)
        Dispatcher["🔔 موزع الإشعارات (NotificationDispatcher)"]
        DB[(قاعدة بيانات SQLite: notifications)]
        SSEChannel["📡 قناة البث اللحظي (SSE Stream /api/v1/notifications/stream)"]
    end

    subgraph واجهة المستخدم (Client Layer)
        Hook["⚡ React Hook (useNotifications)"]
        ToastUI["🍞 شريط التوست اللحظي (Micro Toast)"]
        BellUI["🔔 جرس الإشعارات المنبثق (Notification Bell)"]
        DrawerUI["📑 صفحة الأرشيف الكاملة (/dashboard/notifications)"]
        Audio["🔊 صوت تنبيه بيداغوجي خفيف (Chime)"]
    end

    AIEvent -->|إشعار اكتمال البحث| Dispatcher
    LedgerEvent -->|إشعار استهلاك / نفاد الرصيد| Dispatcher
    LegalEvent -->|إشعار اقتراب الحذف 72h| Dispatcher
    SecurityEvent -->|إشعار أمني / Failover| Dispatcher

    Dispatcher -->|حفظ وأرشفة| DB
    Dispatcher -->|بث فوري عبر EventStream| SSEChannel

    SSEChannel -->|تحديث فوري| Hook
    Hook -->|عرض توست| ToastUI
    Hook -->|تحديث العداد| BellUI
    Hook -->|تحديث السجل| DrawerUI
    Hook -->|رنين اختياري| Audio
```

---

## 🏷️ 3. مصفوفة تصنيف الإشعارات والأولويات (Notification Taxonomy)

| نوع الإشعار (`type`) | الأولوية (`priority`) | القناة | نص العنوان النموذجي | الوصف النموذجي | الإجراء المباشر (`action_url`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `AI_RESEARCH_READY` | `NORMAL` | جرس + توست | **تم تجهيز البحث المدرسي** | اكتمل توليد بحث "الثورة التحريرية" بـ 3 صفحات بنجاح. | الانتقال للمعاينة A4 وتصدير Word |
| `AI_PLAN_READY` | `NORMAL` | توست لحظي | **اكتملت خطة وفهرس البحث** | صاغ الذكاء الاصطناعي 5 محاور وفق منهاج الجيل الثاني. | مراجعة واعتماد الخطة |
| `AI_FAILOVER` | `HIGH` | جرس + توست | **تفعيل المزود الاحتياطي للـ AI** | استجاب المحرك الاحتياطي تلقائياً بعد بطء المحرك الأساسي. | فحص حالة المزوّدين |
| `LOW_BALANCE` | `URGENT` | جرس دائم + توست | **تنبيه: رصيد النقاط منخفض** | رصيد المحل الحالي 15 نقطة فقط. يرجى الشحن لتفادي التعطل. | شحن رصيد المحل عبر بريدي موب |
| `POINTS_RECHARGED`| `NORMAL` | جرس + توست | **تم شحن الرصيد بنجاح** | تمت إضافة +100 نقطة إلى محفظة المحل. | استعراض كشف الحساب |
| `DATA_EXPIRY_WARN`| `HIGH` | جرس | **اقتراب حذف وثيقة مؤقتة** | سيتم حذف وثيقة "بحث تاريخ" بعد 6 ساعات (القانون 18-07). | تحميل أو طباعة نهائية |
| `DATA_DELETED` | `LOW` | جرس | **تم حذف البيانات المؤقتة** | تم الحذف الآمن للمستند المؤقت بعد انقضاء 72 ساعة تشغيلاً. | مراجعة السجل المشفر |
| `SYSTEM_ANNOUNCEMENT`| `NORMAL` | جرس | **تحديث جديد للمنهاج الجزائري** | تمت إضافة مواضيع الفصل الثاني الرسمية لجميع الأطوار. | استكشاف الميزات الجديدة |

---

## 🗄️ 4. مخطط قاعدة البيانات (Database Schema)

### 4.1 جدول الإشعارات المركزي (`notifications`)
```sql
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,                       -- مثل: notif_1791399549_ab12
  shop_id TEXT NOT NULL DEFAULT 'shop_1',     -- معرف الكشك أو المحل
  user_id TEXT,                              -- معرف المستخدم (اختياري)
  type TEXT NOT NULL,                        -- AI_RESEARCH_READY, LOW_BALANCE, ...
  priority TEXT NOT NULL DEFAULT 'NORMAL',   -- LOW, NORMAL, HIGH, URGENT
  title TEXT NOT NULL,                       -- عنوان الإشعار بالعربية
  body TEXT NOT NULL,                        -- محتوى وتفاصيل الإشعار
  action_url TEXT,                           -- الرابط التفاعلي (مثال: /dashboard?tab=research)
  action_label TEXT,                         -- نص الزر التفاعلي (مثال: "عرض المستند")
  meta_json TEXT,                            -- حمولة إضافية بتنسيق JSON (docId, points, provider)
  read INTEGER NOT NULL DEFAULT 0,           -- 0 = غير مقروء، 1 = مقروء
  read_at TEXT,                              -- تاريخ وساعة القراءة
  created_at TEXT DEFAULT (datetime('now')), -- تاريخ الإنشاء
  expires_at TEXT                            -- تاريخ انتهاء الإشعار (اختياري)
);

CREATE INDEX IF NOT EXISTS idx_notifications_shop_read 
  ON notifications (shop_id, read, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_type 
  ON notifications (type);
```

### 4.2 جدول تفضيلات الإشعارات للمحل (`notification_preferences`)
```sql
CREATE TABLE IF NOT EXISTS notification_preferences (
  shop_id TEXT PRIMARY KEY,
  sound_enabled INTEGER NOT NULL DEFAULT 1,          -- تفعيل الرنين الصوتي
  toasts_enabled INTEGER NOT NULL DEFAULT 1,         -- تفعيل رسائل التوست العائمة
  ai_ready_alerts INTEGER NOT NULL DEFAULT 1,        -- إشعارات إتمام أبحاث الذكاء الاصطناعي
  low_balance_threshold INTEGER NOT NULL DEFAULT 20, -- حد التنبيه لانخفاض النقاط
  expiry_alerts INTEGER NOT NULL DEFAULT 1,          -- تنبيهات القانون 18-07 (72 ساعة)
  marketing_alerts INTEGER NOT NULL DEFAULT 0,       -- إعلانات التحديثات والميزات
  updated_at TEXT DEFAULT (datetime('now'))
);
```

---

## 🌐 5. عقد واجهات برمجة التطبيقات (API Specifications)

### 5.1 استعلام الإشعارات (List Notifications)
* **المسار:** `GET /api/v1/notifications`
* **المعاملات:** `?shopId=shop_1&unreadOnly=true&limit=20&type=AI_RESEARCH_READY`
* **الاستجابة الناجحة (200 OK):**
```json
{
  "notifications": [
    {
      "id": "notif_1791399549_ab12",
      "shopId": "shop_1",
      "type": "AI_RESEARCH_READY",
      "priority": "NORMAL",
      "title": "تم توليد البحث المدرسي بنجاح ⚡",
      "body": "بحث: الثورة التحريرية الجزائرية (3 صفحات) جاهز للطباعة وتصدير Word.",
      "actionUrl": "/dashboard?tab=research&docId=res_1791399549453",
      "actionLabel": "معاينة البحث",
      "meta": { "docId": "res_1791399549453", "provider": "gemini", "pageCount": 3 },
      "read": false,
      "createdAt": "2026-10-07T19:50:00Z"
    }
  ],
  "unreadCount": 3,
  "totalCount": 15
}
```

### 5.2 قناة البث اللحظي (Server-Sent Events Stream)
* **المسار:** `GET /api/v1/notifications/stream?shopId=shop_1`
* **الترويسات:**
  - `Content-Type: text/event-stream`
  - `Cache-Control: no-cache`
  - `Connection: keep-alive`
* **رسائل البث (SSE Events):**
  - حدث `init`: إرسال العداد الحالي وقائمة أحدث الإشعارات.
  - حدث `notification`: إرسال إشعار جديد لحظة حدوثه.
  - حدث `unread_count`: تحديث رقم الشارة فوق الجرس فوراً.

### 5.3 تحديد الإشعارات كمقروءة (Mark as Read)
* **تحديد عنصر منفرد:** `PATCH /api/v1/notifications/:id/read`
* **تحديد الكل كمقروء:** `POST /api/v1/notifications/read-all`
  - **المدخلات:** `{ "shopId": "shop_1" }`
  - **المخرجات:** `{ "success": true, "markedCount": 4, "unreadCount": 0 }`

### 5.4 إطلاق إشعار برمجي داخلي (Internal Dispatch Helper)
```typescript
// src/server/notifications/dispatcher.ts
export async function dispatchNotification({
  shopId,
  type,
  priority = "NORMAL",
  title,
  body,
  actionUrl,
  actionLabel,
  meta,
}: CreateNotificationParams): Promise<NotificationRecord>;
```

---

## 🎨 6. تصميم واجهات المستخدم والتفاعل (UI/UX Specifications)

### 6.1 ترقية مكون جرس الإشعارات (`NotificationBell.tsx`)
1. **أيقونة الجرس مع شارة نابضة (Pulsing Badge):**
   - في حالة وجود إشعارات غير مقروءة، تظهر شارة حمراء/زمردية تحمل الرقم بدقة مع نبض هادئ (`animate-pulse`).
2. **النافذة المنسدلة الذكية (Notification Flyout Drawer):**
   - **الترويسة:** "مركز الإشعارات" مع عداد غير المقروء وزر "تحديد الكل كمقروء".
   - **التبويبات السريعة (Filter Chips):**
     - الكل (`الكل`)
     - غير مقروءة (`جديدة`)
     - الذكاء الاصطناعي (`الذكاء الاصطناعي ⚡`)
     - المالية والرصيد (`الرصيد 💳`)
   - **بطاقات الإشعار المصممة بعناية:**
     - أيقونة ملونة حسب النوع والأولوية (أحمر، برتقالي، زمردي، أزرق).
     - توقيت نسبي ذكي باللغة العربية ("منذ دقيقتين", "منذ ساعة", "أمس").
     - زر إجراء مباشر ينقل المستخدم فوراً للمستند أو لشحن الرصيد.
     - زر سريع لتعليم الإشعار كمقروء دون مغادرة النافذة.
3. **الصوت التنبيهي البيداغوجي (Chime Audio):**
   - تشغيل رنين مقتضب ولطيف عند وصول إشعار عالي الأولوية، مع زر كتم دائم في الإعدادات.

### 6.2 شريط التنبيهات اللحظية العائم (Floating Toast Stack)
* مصفوفة تنبيهات تظهر في الزاوية اليسرى السفلية (`bottom-left`) للشاشات العربية:
  - تنزلق بسلاسة للأعلى (`animate-slide-up`).
  - تختفي تلقائياً بعد 4 ثوانٍ أو عند النقر عليها.
  - تحتوي على شريط تقدم زمني دقيق يبين وقت الاختفاء.

---

## 🚀 7. مراحل التنفيذ التفصيلية (Implementation Roadmap)

### 🟢 المرحلة الأولى: البنية التحتية وقاعدة البيانات ومكتبة المعالجة (DB & Engine Core)
1. إنشاء جدول `notifications` وجدول `notification_preferences` في قاعدة بيانات SQLite (`src/lib/db.ts`).
2. إنشاء وحدة توزيع الإشعارات المركزية [`src/server/notifications/dispatcher.ts`](file:///home/ammar/Sahla%20/src/server/notifications/dispatcher.ts).
3. بناء مسار استعلام الإشعارات وتحديدها كمقروءة [`src/app/api/v1/notifications/route.ts`](file:///home/ammar/Sahla%20/src/app/api/v1/notifications/route.ts).

### 🟡 المرحلة الثانية: قناة البث الحي اللحظي وسياق الواجهة (Live Streaming & Context)
1. إنشاء مسار بث الأحداث بالزمن الحقيقي [`/api/v1/notifications/stream`](file:///home/ammar/Sahla%20/src/app/api/v1/notifications/stream/route.ts) عبر Server-Sent Events (SSE).
2. بناء React Context و Hook مخصص [`src/contexts/NotificationContext.tsx`](file:///home/ammar/Sahla%20/src/contexts/NotificationContext.tsx) لإدارة الإشعارات، العدادات، والتشغيل الصوتي.

### 🔵 المرحلة الثالثة: ترقية الواجهات التفاعلية (Interactive UI Upgrade)
1. إعادة كتابة وتطوير [`src/components/dashboard/NotificationBell.tsx`](file:///home/ammar/Sahla%20/src/components/dashboard/NotificationBell.tsx) لدعم التبويبات، الإجراءات المباشرة، والتحديث الحي.
2. تطوير مكون شريط التوست اللحظي [`src/components/ui/ToastContainer.tsx`](file:///home/ammar/Sahla%20/src/components/ui/ToastContainer.tsx) المنسجم مع نظام التصميم الجزائري لسهلة.
3. دمج التفضيلات وإمكانية كتم الصوت أو تعديل حد النقاط في لوحة الإعدادات.

### 🟣 المرحلة الرابعة: الربط الشامل بكافة أحداث المنصة (End-to-End Platform Hooks)
1. **ربط استوديو البحوث والذكاء الاصطناعي:**
   - إرسال إشعار فوري عند اكتمال خطة البحث في `/api/v1/research/plans`.
   - إرسال إشعار فوري عند اكتمال توليد المستند الكامل في `/api/education/research/generate`.
2. **ربط النظام المالي:**
   - إرسال إشعار عند خصم النقاط واقتراب الرصيد من الحد الأدنى (< 20 نقطة).
   - إرسال إشعار تأكيد عند شحن الرصيد.
3. **ربط القانون 18-07:**
   - إرسال تنبيه قبل 6 ساعات من حذف الوثائق المؤقتة.

---

## 📋 8. مخرجات النجاح ومعايير القبول (Acceptance Criteria)
- [x] وثيقة معمارية شاملة تحدد بدقة كل جوانب النظام وتكامله مع الذكاء الاصطناعي.
- [ ] دعم كامل للغة العربية ومطابقة معايير التصميم الراقية لمنصة سهلة.
- [ ] تحديث عداد الإشعارات فوراً بدون الحاجة لتحديث الصفحة (Zero Reloads).
- [ ] استهلاك منخفض جداً للموارد في الخادم والمتصفح عبر SSE.
- [ ] توثيق كامل للـ APIs والمسارات البرمجية في وثائق المنصة.
