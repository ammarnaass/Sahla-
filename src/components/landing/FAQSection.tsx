"use client";

import React from "react";
import {
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import { ChevronDown } from "lucide-react";
import { faqItems } from "@/config/faq";

export function FAQSection() {
  return (
    <section id="faq" className="py-20 sm:py-28 border-b border-border bg-muted/10">
      <Container maxWidth="md">
        <div className="text-center mb-14">
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
            إجابات مباشرة
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground mt-2 font-cairo">
            الأسئلة الأكثر شيوعاً
          </h2>
        </div>

        <div className="space-y-4">
          {faqItems.map((item) => (
            <Accordion
              key={item.id}
              disableGutters
              elevation={0}
              sx={{
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: "16px !important",
                "&:before": { display: "none" },
              }}
            >
              <AccordionSummary expandIcon={<ChevronDown size={20} />}>
                <Typography sx={{ fontFamily: "var(--font-cairo)", fontWeight: "bold" }}>
                  {item.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="text.secondary" sx={{ fontFamily: "var(--font-cairo)", fontSize: "0.95rem" }}>
                  {item.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      </Container>
    </section>
  );
}
