# Sahla Design System Master Specification · Sahla 2.0
> **منظومة التصميم المعتمدة · سهلة · الجزائر 🇩🇿**
> **Current Version:** 2.0.4 (Tailwind CSS v4 + Shadcn/UI + MUI RTL)

---

## 1. الهوية البصرية وفلسفة التصميم (Visual Identity & Philosophy)
- **Brand Essence:** منصة ذكية لخدمات الطباعة والمعاملات الإدارية والتعليمية لأكشاك ومكتبات الجزائر الـ 58 ولاية.
- **Visual Style:** Glassmorphic Modern Luxury (زجاجي نظيف، عالي التباين، احترافي، مريح للعين في ساعات العمل الطويلة).
- **RTL-First:** تخطيط عربي بالكامل مع دعم لغات متعددة ومحاذاة رقمية دقيقة (`font-mono` للدينار الجزائري والأرقام).

---

## 2. باليت الألوان الرسمية (Color Palette & Semantic Tokens)

### الألوان الأساسية المعتمدة (Brand Colors)
| الرمز / الدور | كود الوضع الفاتح (Light) | كود الوضع المظلم (Dark) | متغير CSS |
|--------------|-------------------------|------------------------|-----------|
| **Primary (الزمردي)** | `#059669` (Emerald 600) | `#10b981` (Emerald 500) | `--primary` |
| **Primary Hover** | `#047857` (Emerald 700) | `#059669` (Emerald 600) | `--color-primary-hover` |
| **Background** | `#f8fafc` (Slate 50) | `#080c14` (Deep OLED) | `--background` |
| **Card / Paper** | `#ffffff` (Pure White) | `#0f172a` (Slate 900) | `--card` |
| **Border** | `#e2e8f0` (Slate 200) | `#1e293b` (Slate 800) | `--border` |
| **Text Primary** | `#0f172a` (Slate 900) | `#f8fafc` (Slate 50) | `--foreground` |
| **Text Muted** | `#475569` (Slate 600) | `#94a3b8` (Slate 400) | `--muted-foreground` |
| **Accent / Warning** | `#d97706` (Amber 600) | `#f59e0b` (Amber 500) | `--accent` |
| **Destructive** | `#ef4444` (Red 500) | `#dc2626` (Red 600) | `--destructive` |

---

## 3. معمارية الطبقات المنظمة (5-Layer Modular Architecture)
يتم تنظيم جميع الأنماط تحت مسار `src/styles/` عبر التقسيم التالي:
1. **Layer 0 (Tokens):** `palette.css`, `typography.css`, `elevation.css`, `motion.css`
2. **Layer 1 (Base):** `resets.css`, `a11y.css`
3. **Layer 2 (Surfaces):** `canvas.css`, `glass.css`, `bezel.css`
4. **Layer 3 (Components):** `buttons.css`, `navigation.css`, `badges.css`
5. **Layer 4 (Feedback):** `skeletons.css`, `toasts.css`, `animations.css`

---

## 4. الخطوط والطباعة (Typography Hierarchy)
- **العناوين والنصوص العربية الأساسية:** `Cairo` (`--font-cairo`, `font-cairo`)
- **القراءات والأوصاف الطويلة:** `Tajawal` (`--font-tajawal`, `font-tajawal`)
- **الأرقام والعملات (دج) والأكواد:** `font-mono` (Fira Code / ui-monospace)
- **الأحرف اللاتينية المساعدة:** `Outfit` (`--font-family-en`)

---

## 5. هرمية الحواف المستديرة (Border-Radius Hierarchy)
- **الأزرار وحقول الإدخال القياسية:** `rounded-xl` (`12px` / `0.75rem`)
- **البطاقات واللوحات (Cards & Modals):** `rounded-2xl` (`16px` / `1rem`)
- **شارات Eyebrow والحبوب (Pills):** `rounded-full`
- **الحاويات الكبرى والقوائم:** `rounded-2xl` (تجنب `rounded-3xl` العشوائي لضمان التناسق)

---

## 6. قواعد التباين وإمكانية الوصول (Accessibility & WCAG 2.1)
- الحد الأدنى لنسبة تباين النصوص العادية هو **4.5:1** وفي العناوين الكبيرة **3:1**.
- لا يُسمح باستخدام `text-emerald-400` بمفرده في الوضع الفاتح؛ يجب دائماً إقرانه بصيغة التباين: `text-emerald-700 dark:text-emerald-400` أو `text-emerald-600 dark:text-emerald-400`.
- يُمنع تمرير ألوان هكس مجردة (`#10b981`) داخل خصائص `sx` لـ Material-UI؛ بل تُستخدم مراجع الثيم الموحدة (`bgcolor: "primary.main"`, `"&:hover": { bgcolor: "primary.dark" }`).
