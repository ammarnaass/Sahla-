"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Rocket, Check } from "lucide-react";

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
    <Card className="text-right shadow-sm border-emerald-500/25 dark:border-emerald-500/30">
      <CardHeader className="pb-3 border-b border-border space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Rocket className="w-4 h-4 text-primary" />
            <span>قائمة مهام الانطلاقة في محلك</span>
          </CardTitle>
          <Badge variant="primary" className="font-mono text-xs">
            {completedCount} / {tasks.length}
          </Badge>
        </div>
        <p className="text-[11px] text-muted-foreground">
          أكمل هذه الخطوات السريعة لتحقيق الاستفادة القصوى
        </p>
      </CardHeader>

      <CardContent className="pt-4 space-y-3">
        {/* Progress Bar */}
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
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
              className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                task.done
                  ? "bg-muted/40 border-border text-muted-foreground line-through opacity-75"
                  : "bg-muted/60 hover:bg-muted border-border text-foreground hover:border-primary/40"
              }`}
            >
              <span className="text-xs font-medium">{task.label}</span>
              <div
                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                  task.done
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-border bg-card"
                }`}
              >
                {task.done && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

