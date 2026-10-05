"use client";

import React, { useState, useEffect } from "react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { ServicesGrid } from "@/components/landing/ServicesGrid";
import { WhySahlaSection } from "@/components/landing/WhySahlaSection";
import { ProfitCalculator } from "@/components/landing/ProfitCalculator";
import { FAQAccordion } from "@/components/landing/FAQAccordion";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { StickyMobileCTA } from "@/components/landing/StickyMobileCTA";
import { AuthModal } from "@/components/auth/AuthModal";
import { trackEvent } from "@/lib/analytics";

export default function LandingPage() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("register");

  useEffect(() => {
    trackEvent("landing_view");
  }, []);

  const openAuth = (mode: "login" | "register" = "register") => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white pb-16 md:pb-0 transition-colors duration-200">
      {/* Top Navbar */}
      <LandingNavbar onOpenAuth={openAuth} />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection onStartFree={() => openAuth("register")} />

        {/* 3-Step How it Works */}
        <HowItWorksSection />

        {/* Services Catalog Grid */}
        <ServicesGrid onSelectService={() => openAuth("register")} />

        {/* Why Sahla Section */}
        <WhySahlaSection />

        {/* Interactive Algerian Profit Calculator */}
        <ProfitCalculator />

        {/* FAQ Accordion */}
        <FAQAccordion />
      </main>

      {/* Footer */}
      <LandingFooter />

      {/* Sticky Bottom CTA for Mobile devices */}
      <StickyMobileCTA onStartFree={() => openAuth("register")} />

      {/* Auth Modal (Phone -> OTP -> Shop -> Dashboard) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </div>
  );
}
