"use client";

import { useState } from "react";

export interface RechargePackage {
  points: number;
  dzd: number;
}

export function useWalletState(shopId: string = "shop_1791222058320") {
  const [scratchPin, setScratchPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [pinSuccess, setPinSuccess] = useState("");
  const [isRedeeming, setIsRedeeming] = useState(false);

  // Electronic payment gateway modal state
  const [showEpayModal, setShowEpayModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<RechargePackage | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isProcessingEpay, setIsProcessingEpay] = useState(false);
  const [epayError, setEpayError] = useState("");

  // Scratch card auto-format: XXXX-XXXX-XXXX-XXXX
  const handlePinChange = (value: string) => {
    let clean = value.replace(/[^0-9A-Za-z]/g, "").toUpperCase();
    if (clean.length > 16) clean = clean.substring(0, 16);

    const parts = [];
    for (let i = 0; i < clean.length; i += 4) {
      parts.push(clean.substring(i, i + 4));
    }
    setScratchPin(parts.join("-"));
    setPinError("");
  };

  const redeemScratchCard = async (
    onRecharge: (pointsToAdd: number, desc?: string, newBalance?: number) => void
  ) => {
    const raw = scratchPin.replace(/[-\s]/g, "").trim();
    if (raw.length < 8) {
      setPinError("يجب إدخال كود بطاقة الشحن كاملاً (8 إلى 16 رقماً وحرفاً)");
      return;
    }

    setIsRedeeming(true);
    setPinError("");
    setPinSuccess("");

    try {
      const res = await fetch("/api/wallet/redeem-scratch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shopId, pin: raw }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setPinError(data.error || "رمز بطاقة الشحن غير صحيح أو غير مسجل في النظام");
        return;
      }

      const pointsGranted = data.pointsAdded;
      const desc = `تعبئة بطاقة شحن معتمدة (${data.serialNumber || scratchPin})`;
      onRecharge(pointsGranted, desc, data.newBalance);
      setPinSuccess(`🎉 تم شحن ${pointsGranted} نقطة بنجاح إلى محفظتك! (الرصيد الحالي: ${data.newBalance} نقطة)`);
      setScratchPin("");
      setTimeout(() => setPinSuccess(""), 5000);
    } catch (err: any) {
      setPinError(err.message || "حدث خطأ أثناء الاتصال بالخادم لشحن البطاقة");
    } finally {
      setIsRedeeming(false);
    }
  };

  const startEpay = (pkg: RechargePackage) => {
    setSelectedPackage(pkg);
    setPaymentSuccess(false);
    setEpayError("");
    setShowEpayModal(true);
  };

  const confirmEpay = async (
    onRecharge: (pointsToAdd: number, desc?: string, newBalance?: number) => void
  ) => {
    if (!selectedPackage) return;

    setIsProcessingEpay(true);
    setEpayError("");

    try {
      const res = await fetch("/api/wallet/pay-gateway", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shopId,
          points: selectedPackage.points,
          dzdAmount: selectedPackage.dzd,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setEpayError(data.error || "فشلت عملية الدفع الإلكتروني");
        return;
      }

      setPaymentSuccess(true);
      const desc = `شحن رسمي بالبطاقة الذهبية / بريدي موب (+${data.pointsAdded} نقطة) [مرجع ${data.refId}]`;
      onRecharge(data.pointsAdded, desc, data.newBalance);

      setTimeout(() => {
        setShowEpayModal(false);
        setPaymentSuccess(false);
      }, 1500);
    } catch (err: any) {
      setEpayError(err.message || "حدث خطأ أثناء معالجة الدفع الإلكتروني");
    } finally {
      setIsProcessingEpay(false);
    }
  };

  return {
    scratchPin,
    handlePinChange,
    pinError,
    pinSuccess,
    isRedeeming,
    redeemScratchCard,
    showEpayModal,
    setShowEpayModal,
    selectedPackage,
    paymentSuccess,
    isProcessingEpay,
    epayError,
    startEpay,
    confirmEpay,
  };
}
