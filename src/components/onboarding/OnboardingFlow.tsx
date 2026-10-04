"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { WelcomeStep } from "./WelcomeStep";
import { ServicePreferencesStep } from "./ServicePreferencesStep";
import { TryNowStep } from "./TryNowStep";
import { CelebrationScreen } from "./CelebrationScreen";
import { PWAInstallPrompt } from "./PWAInstallPrompt";
import { trackEvent } from "@/lib/analytics";

export const ONBOARDING_PREFS_KEY = "sahla_user_preferences";
export const FIRST_DOC_KEY = "sahla_first_document";

export function OnboardingFlow() {
  const router = useRouter();
  const { session } = useAuth();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedServices, setSelectedServices] = useState<string[]>([
    "CV_GEN",
    "INVOICE",
    "FORM_OCR",
  ]);
  const [createdDocTitle, setCreatedDocTitle] = useState("");
  const [showPwaPrompt, setShowPwaPrompt] = useState(false);

  const shopName = session?.shop?.name || "محلك التجاري";
  const points = session?.shop?.initialPointsGranted || 50;

  const handleStep1Next = () => {
    trackEvent("onboarding_step_1");
    setCurrentStep(2);
  };

  const handleStep2Next = () => {
    trackEvent("onboarding_step_2", { count: selectedServices.length });
    try {
      localStorage.setItem(
        ONBOARDING_PREFS_KEY,
        JSON.stringify({ selectedServices })
      );
    } catch {
      // Ignore
    }
    setCurrentStep(3);
  };

  const handleDocSuccess = (docData: {
    title: string;
    type: string;
    customerName: string;
    salePrice: number;
  }) => {
    trackEvent("first_doc_created", { type: docData.type });
    setCreatedDocTitle(docData.title);

    // Persist first document in storage
    try {
      const doc = {
        id: `doc_${Date.now()}`,
        title: docData.title,
        type: docData.type,
        customerName: docData.customerName,
        salePrice: docData.salePrice,
        createdAt: new Date().toISOString(),
        pointsUsed: 10,
      };
      localStorage.setItem(FIRST_DOC_KEY, JSON.stringify(doc));
    } catch {
      // Ignore
    }

    setCurrentStep(4);
    setShowPwaPrompt(true);
  };

  const handleFinish = (savedSalePrice: number) => {
    trackEvent("onboarding_completed", { salePrice: savedSalePrice });
    try {
      localStorage.setItem("sahla_default_sale_price", String(savedSalePrice));
      localStorage.setItem("sahla_onboarding_done", "true");
    } catch {
      // Ignore
    }
    router.push("/dashboard");
  };

  const handleSkip = () => {
    trackEvent("onboarding_skipped");
    try {
      localStorage.setItem("sahla_onboarding_done", "true");
    } catch {
      // Ignore
    }
    router.push("/dashboard");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Progress header */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
          <span>خطوات الإعداد السريع</span>
          <span>{currentStep <= 3 ? `الخطوة ${currentStep} من 3` : "اكتمل الإعداد 🎉"}</span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
            style={{ width: `${(Math.min(currentStep, 3) / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Components */}
      {currentStep === 1 && (
        <WelcomeStep
          shopName={shopName}
          points={points}
          onNext={handleStep1Next}
          onSkip={handleSkip}
        />
      )}

      {currentStep === 2 && (
        <ServicePreferencesStep
          selectedCodes={selectedServices}
          onChange={setSelectedServices}
          onNext={handleStep2Next}
          onPrev={() => setCurrentStep(1)}
          onSkip={handleSkip}
        />
      )}

      {currentStep === 3 && (
        <TryNowStep
          onSuccess={handleDocSuccess}
          onPrev={() => setCurrentStep(2)}
          onSkip={handleSkip}
        />
      )}

      {currentStep === 4 && (
        <div className="space-y-6">
          <CelebrationScreen
            docTitle={createdDocTitle || "السيرة الذاتية"}
            onFinish={handleFinish}
          />
          {showPwaPrompt && (
            <PWAInstallPrompt onDismiss={() => setShowPwaPrompt(false)} />
          )}
        </div>
      )}
    </div>
  );
}
