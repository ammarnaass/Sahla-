"use client";

import React, { useState } from "react";
import { LayoutSettings } from "@/server/education/formatting/types";
import { Sliders, BookOpen, Type, AlignJustify, Frame, Save } from "lucide-react";

interface LayoutSettingsPanelProps {
  docId: string;
  settings: LayoutSettings;
  onSettingsChange: (settings: LayoutSettings) => void;
}

export function LayoutSettingsPanel({
  docId,
  settings,
  onSettingsChange,
}: LayoutSettingsPanelProps) {
  const [localSettings, setLocalSettings] = useState<LayoutSettings>(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/docs/${docId}/layout`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(localSettings),
      });
      const data = await res.json();
      if (data.success && data.settings) {
        onSettingsChange(data.settings);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2500);
      }
    } catch (err) {
      console.error("Failed to save layout settings:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-5 text-right" dir="rtl">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-emerald-600" />
          <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
            إعدادات التخطيط والصفحة A4
          </h3>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-sm disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          {isSaving ? "جاري الحفظ..." : savedSuccess ? "تم الحفظ ✓" : "حفظ الإعدادات"}
        </button>
      </div>

      {/* Grid Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        {/* Margins */}
        <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg space-y-3">
          <div className="font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            هوامش الصفحة (ملم):
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-zinc-500 block mb-1">
                الأيمن (التجليد):
              </label>
              <input
                type="number"
                value={localSettings.margins_mm.right}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    margins_mm: {
                      ...localSettings.margins_mm,
                      right: Number(e.target.value),
                    },
                  })
                }
                className="w-full px-2 py-1 bg-white dark:bg-zinc-800 border rounded"
              />
            </div>
            <div>
              <label className="text-[11px] text-zinc-500 block mb-1">الأيسر:</label>
              <input
                type="number"
                value={localSettings.margins_mm.left}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    margins_mm: {
                      ...localSettings.margins_mm,
                      left: Number(e.target.value),
                    },
                  })
                }
                className="w-full px-2 py-1 bg-white dark:bg-zinc-800 border rounded"
              />
            </div>
            <div>
              <label className="text-[11px] text-zinc-500 block mb-1">العلوي:</label>
              <input
                type="number"
                value={localSettings.margins_mm.top}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    margins_mm: {
                      ...localSettings.margins_mm,
                      top: Number(e.target.value),
                    },
                  })
                }
                className="w-full px-2 py-1 bg-white dark:bg-zinc-800 border rounded"
              />
            </div>
            <div>
              <label className="text-[11px] text-zinc-500 block mb-1">السفلي:</label>
              <input
                type="number"
                value={localSettings.margins_mm.bottom}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    margins_mm: {
                      ...localSettings.margins_mm,
                      bottom: Number(e.target.value),
                    },
                  })
                }
                className="w-full px-2 py-1 bg-white dark:bg-zinc-800 border rounded"
              />
            </div>
          </div>
        </div>

        {/* Typography */}
        <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg space-y-3">
          <div className="font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
            <Type className="w-4 h-4 text-emerald-600" />
            الخطوط والتباعد الأكاديمي:
          </div>
          <div>
            <label className="text-[11px] text-zinc-500 block mb-1">نوع الخط:</label>
            <select
              value={localSettings.font_family}
              onChange={(e) =>
                setLocalSettings({ ...localSettings, font_family: e.target.value })
              }
              className="w-full px-2 py-1 bg-white dark:bg-zinc-800 border rounded"
            >
              <option value="Traditional Arabic">Traditional Arabic (معتمد للجامعات)</option>
              <option value="Amiri">Amiri (الخط الأميري الأصيل)</option>
              <option value="Sakkal Majalla">Sakkal Majalla</option>
              <option value="Calibri">Calibri (الوثائق الإدارية)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-zinc-500 block mb-1">حجم الخط (نقطة):</label>
              <select
                value={localSettings.font_size_pt}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, font_size_pt: Number(e.target.value) })
                }
                className="w-full px-2 py-1 bg-white dark:bg-zinc-800 border rounded"
              >
                <option value={12}>12 pt (ملخصات)</option>
                <option value={13}>13 pt</option>
                <option value={14}>14 pt (المعيار الرسمي)</option>
                <option value={16}>16 pt (كبير)</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] text-zinc-500 block mb-1">تباعد الأسطر:</label>
              <select
                value={localSettings.line_spacing}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, line_spacing: Number(e.target.value) })
                }
                className="w-full px-2 py-1 bg-white dark:bg-zinc-800 border rounded"
              >
                <option value={1.15}>1.15 (مضغوط)</option>
                <option value={1.5}>1.5 (الافتراضي الأكاديمي)</option>
                <option value={2.0}>2.0 (مزدوج للأطروحات)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Page numbering & headers */}
        <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg space-y-3">
          <div className="font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
            <AlignJustify className="w-4 h-4 text-emerald-600" />
            ترقيم الصفحات ورأس الفصل:
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-zinc-500 block mb-1">موضع الترقيم:</label>
              <select
                value={localSettings.page_numbering.position}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    page_numbering: {
                      ...localSettings.page_numbering,
                      position: e.target.value as any,
                    },
                  })
                }
                className="w-full px-2 py-1 bg-white dark:bg-zinc-800 border rounded"
              >
                <option value="bottom_center">أسفل المنتصف (المعيار)</option>
                <option value="bottom_right">أسفل اليمين</option>
                <option value="top_center">أعلى المنتصف</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] text-zinc-500 block mb-1">ترقيم التمهيد والفهرس:</label>
              <select
                value={localSettings.page_numbering.format_front}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    page_numbering: {
                      ...localSettings.page_numbering,
                      format_front: e.target.value as any,
                    },
                  })
                }
                className="w-full px-2 py-1 bg-white dark:bg-zinc-800 border rounded"
              >
                <option value="abjad">أبجدي (أ، ب، ج...)</option>
                <option value="roman">روماني (i, ii, iii...)</option>
                <option value="none">بلا ترقيم تمهيدي</option>
              </select>
            </div>
          </div>
        </div>

        {/* Decorative frame */}
        <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg space-y-3">
          <div className="font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
            <Frame className="w-4 h-4 text-emerald-600" />
            الإطار الزخرفي للصفحات:
          </div>
          <label className="flex items-center gap-2 cursor-pointer mt-2 text-zinc-800 dark:text-zinc-200">
            <input
              type="checkbox"
              checked={localSettings.decorative_frame}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  decorative_frame: e.target.checked,
                })
              }
              className="rounded text-emerald-600 focus:ring-emerald-500"
            />
            تفعيل إطار الصفحة الزخرفي (Page Borders) في البحوث المدرسية
          </label>
          <div className="text-[11px] text-zinc-500 leading-normal">
            يُنشئ إطاراً أكاديمياً مزدوجاً محكماً لصفحات المتن دون التداخل مع الرأس والتذييل.
          </div>
        </div>
      </div>
    </div>
  );
}
