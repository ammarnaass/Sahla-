"use client";

import React, { useState, useEffect } from "react";

interface ChecklistItem {
  id: string;
  label: string;
  done: boolean;
}

const DEFAULT_TASKS: ChecklistItem[] = [
  { id: "first_doc", label: "أنشئ أول وثيقة لزبونك", done: true },
  { id: "sale_prices", label: "حدد أسعار البيع الافتراضية", done: true },
  { id: "shop_logo", label: "أضف شعار محلك أو مكتبتك", done: false },
  { id: "first_charge", label: "اشحن أول بطاقة نقاط", done: false },
  { id: "install_app", label: "ثبّت التطبيق على هاتفك (PWA)", done: false },
];

const CHECKLIST_STORAGE_KEY = "sahla_starter_checklist";

export function StarterChecklist() {
  const [tasks, setTasks] = useState<ChecklistItem[]>(DEFAULT_TASKS);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(CHECKLIST_STORAGE_KEY);
      if (saved) {
        setTasks(JSON.parse(saved));
      }
    } catch {
      // Ignore
    }
  }, []);

  const toggleTask = (id: string) => {
    const updated = tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
    setTasks(updated);
    try {
      localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  if (!mounted) return null;

  const completedCount = tasks.filter((t) => t.done).length;
  // Disappear when complete per PRD Section 6.5
  if (completedCount === tasks.length) {
    return null;
  }

  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="p-5 rounded-3xl bg-slate-900 border border-emerald-500/30 shadow-lg text-right space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>🚀</span>
            <span>قائمة مهام الانطلاقة في محلك</span>
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            أكمل هذه الخطوات السريعة لتحقيق الاستفادة القصوى
          </p>
        </div>
        <span className="text-xs font-bold text-emerald-400 font-mono">
          {completedCount} / {tasks.length}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Tasks list */}
      <div className="space-y-2 pt-1">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
              task.done
                ? "bg-slate-950/40 border-slate-800/60 text-slate-400 line-through"
                : "bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700"
            }`}
          >
            <span className="text-xs font-medium">{task.label}</span>
            <div
              className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                task.done
                  ? "bg-emerald-600 border-emerald-500 text-white"
                  : "border-slate-700 bg-slate-800"
              }`}
            >
              {task.done && <span className="text-[10px] font-bold">✓</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
