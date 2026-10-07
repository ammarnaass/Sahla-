"use client";

import React, { useState } from "react";
import { CreditCard, Download, Printer, CheckCircle2, Sparkles, Layers } from "lucide-react";
import { Button as MuiButton } from "@mui/material";

interface AdminWholesaleTabProps {
  onGenerateBatch: (data: { points: number; count: number; priceDZD: number }) => void;
  isGenerating: boolean;
  lastBatch: any;
}

export function AdminWholesaleTab({
  onGenerateBatch,
  isGenerating,
  lastBatch,
}: AdminWholesaleTabProps) {
  const [points, setPoints] = useState(100);
  const [count, setCount] = useState(20);
  const [priceDZD, setPriceDZD] = useState(1000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerateBatch({ points, count, priceDZD });
  };

  const handleDownloadCSV = () => {
    if (!lastBatch?.cards?.length) return;
    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      "Card Code,PIN / Secret,Points,Price DZD,Batch Number\n" +
      lastBatch.cards
        .map(
          (c: any) =>
            `"${c.code}","${c.pin || c.code}","${c.points}","${c.priceDZD}","${lastBatch.batchNumber}"`
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `cards_batch_${lastBatch.batchNumber}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Overview Card & Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Form: Batch Generator */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-card border border-border shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CreditCard size={18} />
            </div>
            <h3 className="text-base font-bold text-foreground font-cairo">
              توليد دفعة بطاقات شحن وطنية جديدة (Wholesale Scratch Cards)
            </h3>
          </div>
          <p className="text-xs text-muted-foreground font-cairo mb-6">
            قم بتوليد بطاقات خدش مؤمنة برمز سري مشفر لتوزيعها على الأكشاك وموزعي الولايات.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-right text-xs">
              <div>
                <label className="block font-bold text-foreground mb-1.5 font-cairo">
                  فئة النقاط (لكل بطاقة):
                </label>
                <select
                  value={points}
                  onChange={(e) => {
                    const p = Number(e.target.value);
                    setPoints(p);
                    setPriceDZD(p * 10);
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-muted/40 border border-border focus:outline-none focus:border-emerald-500 text-foreground font-mono"
                >
                  <option value={50}>50 نقطة (500 دج)</option>
                  <option value={100}>100 نقطة (1,000 دج)</option>
                  <option value={200}>200 نقطة (2,000 دج)</option>
                  <option value={500}>500 نقطة (5,000 دج)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1.5 font-cairo">
                  عدد البطاقات في الدفعة:
                </label>
                <input
                  type="number"
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  min={5}
                  max={200}
                  required
                  className="w-full py-2 px-3 rounded-xl bg-muted/40 border border-border focus:outline-none focus:border-emerald-500 text-foreground font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1.5 font-cairo">
                  سعر البيع المقترح (دج):
                </label>
                <input
                  type="number"
                  value={priceDZD}
                  onChange={(e) => setPriceDZD(Number(e.target.value))}
                  min={100}
                  required
                  className="w-full py-2 px-3 rounded-xl bg-muted/40 border border-border focus:outline-none focus:border-emerald-500 text-foreground font-mono"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-muted/20 border border-border flex items-center justify-between text-xs">
              <span className="font-bold text-muted-foreground font-cairo">
                إجمالي قيمة الدفعة بالجملة:
              </span>
              <span className="font-mono font-black text-base text-emerald-600 dark:text-emerald-400">
                {(priceDZD * count).toLocaleString()} دج (إجمالي {points * count} نقطة)
              </span>
            </div>

            <MuiButton
              type="submit"
              variant="contained"
              disabled={isGenerating}
              disableElevation
              sx={{
                borderRadius: "12px",
                py: 1.4,
                px: 4,
                fontWeight: 800,
                fontSize: "0.95rem",
                bgcolor: "primary.main",
                "&:hover": { bgcolor: "primary.dark" },
              }}
            >
              {isGenerating ? "جاري التوليد والتشفير..." : "توليد الدفعة فورياً ⚡"}
            </MuiButton>
          </form>
        </div>

        {/* Right Info: Distributor Network */}
        <div className="p-6 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Layers size={18} className="text-emerald-500" />
              <h4 className="text-sm font-bold text-foreground font-cairo">
                شبكة التوزيع المعتمدة في 58 ولاية
              </h4>
            </div>
            <p className="text-xs text-muted-foreground font-cairo leading-relaxed mb-4">
              يتم تصدير البطاقات بصيغة CSV جاهزة للطباعة على كروت بلاستيكية أو ورق مقوى مع طبقة حك رمادية (Scratch Layer).
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle2 size={14} className="text-emerald-500" />
                <span>تشفير كود الشحن بـ 16 خانة فريدة</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle2 size={14} className="text-emerald-500" />
                <span>استخدام مرة واحدة فقط مع منع التكرار</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle2 size={14} className="text-emerald-500" />
                <span>شحن فوري برصيد الكشك فور إدخال الكود</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generated Batch Preview & CSV Export */}
      {lastBatch && (
        <div className="p-6 rounded-2xl bg-card border-2 border-emerald-500/40 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
            <div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono block">
                دفعة نشطة: {lastBatch.batchNumber}
              </span>
              <h4 className="text-lg font-bold text-foreground font-cairo">
                تم توليد {lastBatch.cards?.length || 0} بطاقة شحن بنجاح! 🎉
              </h4>
            </div>

            <div className="flex items-center gap-2">
              <MuiButton
                variant="outlined"
                size="small"
                onClick={handleDownloadCSV}
                startIcon={<Download size={16} />}
                sx={{ borderRadius: "10px", fontWeight: 700 }}
              >
                تحميل ملف CSV للطباعة
              </MuiButton>
            </div>
          </div>

          {/* Cards Sample Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {(lastBatch.cards || []).slice(0, 8).map((card: any, idx: number) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-muted/40 border border-border text-center space-y-1"
              >
                <div className="flex items-center justify-between text-[10px] text-muted-foreground font-bold">
                  <span>بطاقة شحن سهلة</span>
                  <span className="text-emerald-600">{card.points} نقطة</span>
                </div>
                <div className="font-mono font-black text-sm text-foreground tracking-wider py-1 bg-background rounded-lg border border-border">
                  {card.code}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  السعر: {card.priceDZD} دج
                </div>
              </div>
            ))}
          </div>
          {lastBatch.cards?.length > 8 && (
            <p className="text-xs text-muted-foreground text-center font-cairo">
              يظهر أعلاه 8 بطاقات كمعاينة من أصل {lastBatch.cards.length} بطاقة في هذا الملف.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
