"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";

interface LegalConsentCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
}

export function LegalConsentCheckbox({ checked, onChange, error }: LegalConsentCheckboxProps) {
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  return (
    <div className="space-y-2">
      <label className="flex items-start gap-3 cursor-pointer select-none group">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-900 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-0 focus:ring-2 accent-emerald-600 shrink-0"
        />
        <span className="text-xs text-slate-300 leading-relaxed group-hover:text-white transition-colors">
          أوافق على{" "}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setShowTermsModal(true);
            }}
            className="text-emerald-400 font-bold hover:underline"
          >
            شروط الاستخدام
          </button>{" "}
          و{" "}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setShowPrivacyModal(true);
            }}
            className="text-emerald-400 font-bold hover:underline"
          >
            سياسة الخصوصية
          </button>{" "}
          وفقاً للقانون الجزائري رقم 18-07 لحماية المعطيات الشخصية وقانون 18-05 للتجارة الإلكترونية.
        </span>
      </label>

      {error && (
        <p className="text-xs text-red-400 font-medium">⚠️ {error}</p>
      )}

      {/* Terms Modal */}
      <Modal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        title="شروط الاستخدام — منصة سهلة"
        description="الضوابط والالتزامات القانونية لأصحاب المحلات"
      >
        <div className="text-xs text-slate-300 space-y-3 leading-relaxed max-h-80 overflow-y-auto pr-2">
          <p>
            1. منصة سهلة هي أداة تقنية مخصصة لتسهيل إنجاز الوثائق والمستندات الإدارية والتجارية للزبائن في المحلات والمكتبات والكيوسكات.
          </p>
          <p>
            2. يتحمل صاحب المحل المسؤولية الكاملة عن صحة البيانات المدخلة ومطابقتها للمستندات الأصلية المقدمة من زبائنه.
          </p>
          <p>
            3. يُحظر تماماً استعمال المنصة لإنشاء وثائق مزورة أو مخالفة للتشريعات والقوانين السارية في الجمهورية الجزائرية الديمقراطية الشعبية.
          </p>
          <p>
            4. رصيد النقاط مخصص للاستعمال داخل المنصة ولا يمكن استرجاعه نقداً إلا وفق الشروط المحددة لبطاقات الشحن المعتمدة.
          </p>
        </div>
      </Modal>

      {/* Privacy Modal */}
      <Modal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        title="سياسة الخصوصية وحماية المعطيات الشخصية"
        description="امتثال كامل للقانون الجزائري رقم 18-07"
      >
        <div className="text-xs text-slate-300 space-y-3 leading-relaxed max-h-80 overflow-y-auto pr-2">
          <p>
            1. امتثالاً لأحكام القانون رقم 18-07 المتعلق بحماية الأشخاص الطبيعيين في مجال معالجة المعطيات ذات الطابع الشخصي، فإن منصة سهلة تطبق أعلى معايير التشفير والسرية.
          </p>
          <p>
            2. يتم حذف الملفات والوثائق المؤقتة تلقائياً من خوادمنا بعد 72 ساعة من إنشائها وتوليد الـ PDF.
          </p>
          <p>
            3. لا يتم بيع أو مشاركة أي بيانات تخص أصحاب المحلات أو زبائنهم مع أي أطراف ثالثة لأغراض دعائية أو تجارية.
          </p>
          <p>
            4. للمستخدم الحق في طلب حذف حسابه وسجل نشاطاته في أي وقت بالتواصل مع الدعم الفني.
          </p>
        </div>
      </Modal>
    </div>
  );
}
