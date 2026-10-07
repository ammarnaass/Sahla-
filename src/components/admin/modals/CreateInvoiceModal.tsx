"use client";

import React, { useState } from "react";
import { X, Receipt, Check } from "lucide-react";
import { Button as MuiButton, TextField } from "@mui/material";
import type { ShopRecord } from "@/server/repositories/shopRepository";

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  shops: ShopRecord[];
  onSubmit: (formData: {
    shopId: string;
    description: string;
    price: number;
    quantity: number;
    paymentMethod: "EDAHABIA_CIB" | "BARIDIMOB" | "CASH_WHOLESALE" | "BANK_TRANSFER";
  }) => void;
  isSubmitting: boolean;
}

export function CreateInvoiceModal({
  isOpen,
  onClose,
  shops,
  onSubmit,
  isSubmitting,
}: CreateInvoiceModalProps) {
  const [shopId, setShopId] = useState(shops[0]?.id || "");
  const [description, setDescription] = useState("اشتراك شهري في باقة المكتبة الاحترافية PRO KIOSK");
  const [price, setPrice] = useState(2500);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<
    "EDAHABIA_CIB" | "BARIDIMOB" | "CASH_WHOLESALE" | "BANK_TRANSFER"
  >("EDAHABIA_CIB");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopId) return;
    onSubmit({
      shopId,
      description,
      price,
      quantity,
      paymentMethod,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-card border border-border w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Receipt size={18} />
            </div>
            <span className="font-bold text-foreground text-sm font-cairo">
              إصدار فاتورة اشتراك رسمية جديدة
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-right text-xs">
          <div>
            <label className="block font-bold text-foreground mb-1.5 font-cairo">
              المحل التجاري المستفيد:
            </label>
            <select
              value={shopId}
              onChange={(e) => setShopId(e.target.value)}
              required
              className="w-full py-2.5 px-3 rounded-xl bg-muted/40 border border-border focus:outline-none focus:border-emerald-500 text-foreground"
            >
              {shops.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.owner}) — {s.wilaya}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-foreground mb-1.5 font-cairo">
              بيان الخدمة أو الاشتراك:
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full py-2.5 px-3 rounded-xl bg-muted/40 border border-border focus:outline-none focus:border-emerald-500 text-foreground"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-foreground mb-1.5 font-cairo">
                السعر الفردي (دج):
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                min={0}
                required
                className="w-full py-2 px-3 rounded-xl bg-muted/40 border border-border focus:outline-none focus:border-emerald-500 text-foreground font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-foreground mb-1.5 font-cairo">
                الكمية / المدة (أشهر):
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min={1}
                required
                className="w-full py-2 px-3 rounded-xl bg-muted/40 border border-border focus:outline-none focus:border-emerald-500 text-foreground font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-foreground mb-1.5 font-cairo">
              طريقة التسديد المعتمدة:
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as any)}
              className="w-full py-2.5 px-3 rounded-xl bg-muted/40 border border-border focus:outline-none focus:border-emerald-500 text-foreground"
            >
              <option value="EDAHABIA_CIB">البطاقة الذهبية / CIB البنكية</option>
              <option value="BARIDIMOB">تطبيق بريدي موب (BaridiMob)</option>
              <option value="CASH_WHOLESALE">تسليم نقدي عبر الموزع المعتمد</option>
              <option value="BANK_TRANSFER">تحويل بنكي رسمي</option>
            </select>
          </div>

          <div className="pt-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
            <span className="font-bold text-emerald-600 dark:text-emerald-400 font-cairo">
              المجموع الإجمالي للفاتورة:
            </span>
            <span className="font-mono font-black text-base text-emerald-600 dark:text-emerald-400">
              {(price * quantity).toLocaleString()} دج
            </span>
          </div>

          {/* Buttons */}
          <div className="pt-4 flex items-center justify-end gap-2 border-t border-border">
            <MuiButton
              variant="outlined"
              size="small"
              onClick={onClose}
              sx={{ borderRadius: "10px", fontWeight: 700 }}
            >
              إلغاء
            </MuiButton>
            <MuiButton
              type="submit"
              variant="contained"
              size="small"
              disabled={isSubmitting}
              disableElevation
              sx={{ borderRadius: "10px", fontWeight: 700, bgcolor: "#10b981", "&:hover": { bgcolor: "#059669" } }}
            >
              {isSubmitting ? "جاري الإصدار..." : "إصدار الفاتورة الرسمية ✓"}
            </MuiButton>
          </div>
        </form>
      </div>
    </div>
  );
}
