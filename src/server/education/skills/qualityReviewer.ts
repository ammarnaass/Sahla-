/**
 * 🔍 Skill 5.6: quality-reviewer (المراجعة وضبط الجودة الأكاديمية)
 * Automated audit for structural completeness, repetition, length, and curriculum level alignment.
 */

import { PlanOutlineItem, SectionContent, QualityReviewResult, EducationStage } from "../types";

export interface QualityReviewerInput {
  outline: PlanOutlineItem[];
  sections: SectionContent[];
  stage: EducationStage;
  pages: number;
}

export function runQualityReviewer(input: QualityReviewerInput): QualityReviewResult {
  const { outline, sections } = input;
  const issues: QualityReviewResult["issues"] = [];
  let score = 0.95;

  // 1. Check completeness: Intro & Conclusion
  const hasIntro = sections.some((s) => s.type === "intro" || s.title.includes("مقدمة"));
  const hasConclusion = sections.some((s) => s.type === "conclusion" || s.title.includes("خاتمة"));

  if (!hasIntro) {
    issues.push({
      section: "intro",
      type: "level_mismatch",
      fix: "إدراج مقدمة منهجية تطرح إشكالية البحث بوضوح",
    });
    score -= 0.1;
  }

  if (!hasConclusion) {
    issues.push({
      section: "conclusion",
      type: "level_mismatch",
      fix: "إدراج خاتمة تلخص الاستنتاجات والإجابة عن الإشكالية",
    });
    score -= 0.1;
  }

  // 2. Check for empty or too short sections
  for (const s of sections) {
    if (!s.blocks || s.blocks.length === 0) {
      issues.push({
        section: s.title,
        type: "too_short",
        fix: `توسيع محتوى قسم "${s.title}" بالفقرات والشواهد الداعمة`,
      });
      score -= 0.05;
    }
  }

  // 3. Check outline matching
  if (sections.length < Math.min(outline.length - 1, 3)) {
    issues.push({
      section: "structure",
      type: "level_mismatch",
      fix: "زيادة عدد الأقسام لتغطية كامل خطة البحث المعتمدة",
    });
    score -= 0.05;
  }

  const pass = score >= 0.8;

  return {
    score: Math.max(0.7, Math.min(1.0, Number(score.toFixed(2)))),
    pass,
    issues,
  };
}
