"use client";

import { useState } from "react";

export interface RechargePackage {
  points: number;
  dzd: number;
}

export function useWalletState() {
  const [scratchPin, setScratchPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [pinSuccess, setPinSuccess] = useState("");
  const [isRedeeming, setIsRedeeming] = useState(false);

  // Electronic payment gateway modal state
  const [showEpayModal, setShowEpayModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<RechargePackage | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

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

  const redeemScratchCard = (onRecharge: (pointsToAdd: number, desc?: string) => void) => {
    const raw = scratchPin.replace(/-/g, "");
    if (raw.length !== 16) {
      setPinError("يجب أن يتكون كود بطاقة الشحن من 16 رقماً وحرفاً (مثال: 9482-1049-8392-1048)");
      return;
    }

    setIsRedeeming(true);
    setTimeout(() => {
      setIsRedeeming(false);
      // Valid points determination by prefix
      const pointsGranted = raw.startsWith("1") ? 300 : raw.startsWith("7") ? 1000 : 100;
      onRecharge(pointsGranted, `شحن ببطاقة تعبئة (${scratchPin})`);
      setPinSuccess(`🎉 تم شحن ${pointsGranted} نقطة بنجاح إلى محفظتك!`);
      setScratchPin("");
      setTimeout(() => setPinSuccess(""), 4000);
    }, 700);
  };

  const startEpay = (pkg: RechargePackage) => {
    setSelectedPackage(pkg);
    setPaymentSuccess(false);
    setShowEpayModal(true);
  };

  const confirmEpay = (onRecharge: (pointsToAdd: number, desc?: string) => void) => {
    if (!selectedPackage) return;
    setTimeout(() => {
      onRecharge(
        selectedPackage.points,
        `دفع إلكتروني عبر بريدي موب / الذهبية (+${selectedPackage.points} نقطة)`
      );
      setPaymentSuccess(true);
      setTimeout(() => {
        setShowEpayModal(false);
        setPaymentSuccess(false);
      }, 1500);
    }, 600);
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
    startEpay,
    confirmEpay,
  };
}
