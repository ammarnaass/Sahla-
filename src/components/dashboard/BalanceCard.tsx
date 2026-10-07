"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/Modal";
import { Wallet, Plus, AlertTriangle, CreditCard, Sparkles } from "lucide-react";

interface BalanceCardProps {
  points: number;
  onRecharge: (pointsToAdd: number) => void;
}

export function BalanceCard({ points, onRecharge }: BalanceCardProps) {
  const [showTopupModal, setShowTopupModal] = useState(false);
  const [scratchCardCode, setScratchCardCode] = useState("");
  const [topupError, setTopupError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const isLow = points > 0 && points <= 20;
  const isZero = points <= 0;

  const handleRedeemCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scratchCardCode.trim()) {
      setTopupError("يرجى إدخال كود بطاقة الشحن");
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      // Simulate redeeming 100 points
      onRecharge(100);
      setScratchCardCode("");
      setShowTopupModal(false);
    }, 600);
  };

  const handleDemoAdd = (pts: number) => {
    onRecharge(pts);
    setShowTopupModal(false);
  };

  return (
    <>
      <Card
        className={`relative overflow-hidden transition-all duration-300 text-right ${
          isZero
            ? "bg-gradient-to-br from-rose-50/90 via-card to-rose-50/30 dark:from-rose-950/25 dark:via-card dark:to-card border-rose-300 dark:border-rose-900/60 shadow-md"
            : isLow
            ? "bg-gradient-to-br from-amber-50/90 via-card to-amber-50/30 dark:from-amber-950/25 dark:via-card dark:to-card border-amber-300 dark:border-amber-900/60 shadow-md"
            : "bg-gradient-to-br from-emerald-50/80 via-card to-teal-50/30 dark:from-emerald-950/20 dark:via-card dark:to-card border-emerald-200/80 dark:border-emerald-800/40 shadow-sm"
        }`}
      >
        {/* Ambient glow accent */}
        <div
          className={`absolute -top-12 -left-12 w-44 h-44 rounded-full blur-3xl pointer-events-none opacity-40 ${
            isZero ? "bg-rose-500" : isLow ? "bg-amber-500" : "bg-emerald-500"
          }`}
        />

        <CardContent className="p-6 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                  <Wallet className="w-4 h-4 text-primary" />
                  <span>رصيد محفظتك الرقمية</span>
                </div>
                {isZero ? (
                  <Badge variant="destructive" className="font-bold text-[10px]">
                    نفد الرصيد
                  </Badge>
                ) : isLow ? (
                  <Badge variant="warning" className="font-bold text-[10px]">
                    رصيد منخفض
                  </Badge>
                ) : (
                  <Badge variant="primary" className="font-bold text-[10px]">
                    رصيد نشط
                  </Badge>
                )}
              </div>

              <div className="flex items-baseline gap-2.5">
                <span className="text-4xl sm:text-5xl font-black text-foreground font-mono tracking-tight">
                  {points.toLocaleString()}
                </span>
                <span className="text-base sm:text-lg font-bold text-primary">نقطة</span>
              </div>

              <p className="text-xs text-muted-foreground mt-2 max-w-sm leading-relaxed">
                {isZero
                  ? "يُرجى شحن الرصيد لتتمكن من إنشاء وتوليد الوثائق المدفوعة لزبائنك."
                  : isLow
                  ? "قارب رصيدك على الانتهاء. اشحن الآن لتفادي أي انقطاع في الخدمة."
                  : "رصيدك كافٍ لإنجاز وثائق متعددة وطباعتها فورياً."}
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-3">
              <Button
                variant={isZero ? "danger" : isLow ? "gold" : "primary"}
                size="lg"
                onClick={() => setShowTopupModal(true)}
                className="px-6 font-bold shadow-md cursor-pointer"
                leftIcon={<Plus className="w-5 h-5" />}
              >
                <span>شحن الرصيد</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top up Modal */}
      <Modal
        isOpen={showTopupModal}
        onClose={() => setShowTopupModal(false)}
        title="شحن رصيد المحل (نقاط سهلة)"
        description="اختر الطريقة الأنسب لشحن رصيد محلك فورياً"
      >
        <div className="space-y-5 text-right">
          {/* Quick Demo Options */}
          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>شحن تجريبي فوري (لأغراض العرض والتجربة):</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoAdd(50)}
                className="p-3 rounded-xl bg-secondary/80 hover:bg-secondary border border-border hover:border-primary text-center transition-colors cursor-pointer"
              >
                <span className="block text-base font-bold text-foreground font-mono">+50</span>
                <span className="text-[10px] text-primary font-bold">نقطة</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoAdd(150)}
                className="p-3 rounded-xl bg-secondary/80 hover:bg-secondary border border-border hover:border-primary text-center transition-colors cursor-pointer"
              >
                <span className="block text-base font-bold text-foreground font-mono">+150</span>
                <span className="text-[10px] text-primary font-bold">نقطة</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoAdd(500)}
                className="p-3 rounded-xl bg-secondary/80 hover:bg-secondary border border-border hover:border-primary text-center transition-colors cursor-pointer"
              >
                <span className="block text-base font-bold text-foreground font-mono">+500</span>
                <span className="text-[10px] text-primary font-bold">نقطة</span>
              </button>
            </div>
          </div>

          {/* Physical Scratch Card Pin Input */}
          <form onSubmit={handleRedeemCode} className="space-y-3 pt-3 border-t border-border">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                تعبئة عبر بطاقة الشحن (Scratch Card PIN):
              </label>
              <input
                type="text"
                placeholder="أدخل الرمز المكون من 14 أو 16 رقماً..."
                value={scratchCardCode}
                onChange={(e) => {
                  setScratchCardCode(e.target.value);
                  setTopupError("");
                }}
                className="w-full bg-background border border-input rounded-xl px-3.5 py-3 text-sm text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              {topupError && (
                <p className="text-xs text-destructive mt-1.5 flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="w-3.5 h-3.5 text-destructive shrink-0" />
                  <span>{topupError}</span>
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isProcessing}
              className="w-full font-bold cursor-pointer"
            >
              تأكيد وتعبئة البطاقة
            </Button>
          </form>

          {/* Electronic Payments info */}
          <div className="p-3.5 rounded-xl bg-muted/60 border border-border text-xs text-muted-foreground space-y-1">
            <div className="font-bold text-foreground flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-primary" />
              <span>الدفع الإلكتروني (بريدي موب / الذهبية / CIB):</span>
            </div>
            <p className="leading-relaxed">
              يمكنك أيضاً الشحن التلقائي بربط حسابك مع خدمة الدفع المباشر بالبطاقة الذهبية أو CIB.
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
}
