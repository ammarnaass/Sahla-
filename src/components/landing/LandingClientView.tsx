"use client";

import React, { useState, useEffect } from "react";
import { LandingNavbar } from "./LandingNavbar";
import { HeroSection } from "./HeroSection";
import { FeaturesGrid } from "./FeaturesGrid";
import { HowItWorksSection } from "./HowItWorksSection";
import { PricingSection } from "./pricing/PricingSection";
import { RoiCalculator } from "./RoiCalculator";
import { FAQSection } from "./FAQSection";
import { CtaBanner } from "./CtaBanner";
import { LandingFooter } from "./LandingFooter";

export function LandingClientView() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-300 antialiased selection:bg-emerald-500/20 selection:text-emerald-500">
      {/* 1. Header / Navbar */}
      <LandingNavbar mounted={mounted} />

      {/* 2. Main Content Sections */}
      <main className="flex-1">
        <HeroSection />
        <FeaturesGrid />
        <HowItWorksSection />
        <PricingSection />
        <RoiCalculator />
        <FAQSection />
        <CtaBanner />
      </main>

      {/* 3. Footer */}
      <LandingFooter />
    </div>
  );
}
