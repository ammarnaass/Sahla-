"use client";

import React from "react";
import { useWalletState } from "@/hooks/dashboard/useWalletState";
import { WalletBalanceWidget } from "./WalletBalanceWidget";
import { WalletVoucherForm } from "./WalletVoucherForm";
import { WalletPackagesGrid } from "./WalletPackagesGrid";
import { WalletEpayModal } from "./WalletEpayModal";
import { WalletHistoryTable } from "./WalletHistoryTable";

export interface LedgerItem {
  id: string;
  description: string;
  pointsDelta: number;
  balanceAfter: number;
  type: "CREDIT" | "DEBIT" | "REFUND";
  createdAt: string;
}

export interface WalletTabProps {
  points: number;
  onRecharge: (pointsToAdd: number, desc?: string) => void;
  ledger: LedgerItem[];
}

export function WalletTab({ points, onRecharge, ledger }: WalletTabProps) {
  const wallet = useWalletState();

  return (
    <div className="space-y-8 text-right animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-white font-display">
          المحفظة والشحن وإدارة الرصيد 💰
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          إدارة رصيد النقاط، شحن البطاقات المادية (Scratch Cards)، والدفع المباشر بالبطاقة الذهبية
          وبريدي موب
        </p>
      </div>

      {/* Top Cards: Balance & Scratch Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <WalletBalanceWidget points={points} />
        <WalletVoucherForm
          scratchPin={wallet.scratchPin}
          onPinChange={wallet.handlePinChange}
          onRedeem={(e) => {
            e.preventDefault();
            wallet.redeemScratchCard(onRecharge);
          }}
          pinError={wallet.pinError}
          pinSuccess={wallet.pinSuccess}
          isRedeeming={wallet.isRedeeming}
        />
      </div>

      {/* Electronic Payment Packages */}
      <WalletPackagesGrid onSelectPackage={wallet.startEpay} />

      {/* Ledger History */}
      <WalletHistoryTable ledger={ledger} />

      {/* E-Payment Gateway Modal */}
      <WalletEpayModal
        isOpen={wallet.showEpayModal}
        onClose={() => wallet.setShowEpayModal(false)}
        selectedPackage={wallet.selectedPackage}
        paymentSuccess={wallet.paymentSuccess}
        onConfirmEpay={() => wallet.confirmEpay(onRecharge)}
      />
    </div>
  );
}
