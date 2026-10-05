/**
 * 🎼 Sahla Education Engine Orchestrator (Technical Spec v1.0)
 * Orchestrates the execution of independent skills with atomic wallet guarding,
 * step logging in SQLite, and full failure rollback.
 */

import { db } from "@/lib/db";
import { ResearchPlan, ResearchJob, FinalResearchDocument, SectionContent } from "./types";
import { WalletGuard } from "./walletGuard";
import { runTopicIntake } from "./skills/topicIntake";
import { runResearchPlanner } from "./skills/researchPlanner";
import { runSectionWriter } from "./skills/sectionWriter";
import { runReferencesBuilder } from "./skills/referencesBuilder";
import { runQualityReviewer } from "./skills/qualityReviewer";
import { runStudyAids } from "./skills/studyAids";
import { runFormatterRenderer } from "./skills/formatterRenderer";
import { calculateJobPoints } from "./config";

export class EducationOrchestrator {
  /**
   * Helper to log skill runs into telemetry table
   */
  private static logSkillRun(
    skillName: string,
    jobId: string,
    model: string,
    input: any,
    output: any,
    durationMs: number
  ) {
    try {
      db.prepare(`
        INSERT INTO skill_runs (id, skill_name, job_id, model, input_json, output_json, duration_ms, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
      `).run(
        `run_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        skillName,
        jobId,
        model,
        JSON.stringify(input),
        JSON.stringify(output),
        durationMs
      );
    } catch {
      // Telemetry non-blocking
    }
  }

  /**
   * Helper to update job step progress in database
   */
  private static updateJobStep(jobId: string, stepName: string, progress: number) {
    db.prepare(`
      UPDATE research_jobs
      SET current_step = ?, progress = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(stepName, progress, jobId);

    try {
      db.prepare(`
        INSERT INTO job_steps (id, job_id, step_name, status, created_at)
        VALUES (?, ?, ?, 'running', datetime('now'))
      `).run(`step_${jobId}_${stepName}`, jobId, stepName);
    } catch {
      // Ignore if step already exists
    }
  }

  /**
   * تشغيل مهمة توليد بحث كامل عبر سلسلة المهارات
   */
  static async executeResearchJob(
    jobId: string,
    plan: ResearchPlan,
    shopId: string,
    coverData: any
  ): Promise<ResearchJob> {
    const startTime = Date.now();
    const costPoints = calculateJobPoints(plan.pages, plan.options);

    // 1. Atomic Wallet Point Reservation
    const reservation = WalletGuard.reservePoints(
      shopId,
      costPoints,
      `توليد بحث: ${plan.topic} (${plan.pages} صفحات)`
    );

    if (!reservation.ok) {
      db.prepare(`
        UPDATE research_jobs
        SET status = 'failed', error_json = ?, updated_at = datetime('now')
        WHERE id = ?
      `).run(JSON.stringify({ code: "insufficient_points", message: reservation.error }), jobId);

      throw new Error(reservation.error || "رصيد النقاط لا يكفي");
    }

    try {
      // 2. Skill: topic-intake
      this.updateJobStep(jobId, "intake", 10);
      const intakeStart = Date.now();
      const intakeResult = runTopicIntake({
        stage: plan.stage,
        level: plan.level,
        subject: plan.subject,
        topic: plan.topic,
        language: plan.language,
      });
      this.logSkillRun("topic-intake", jobId, "claude-haiku", plan, intakeResult, Date.now() - intakeStart);

      if (!intakeResult.ok || intakeResult.scope === "sensitive") {
        throw new Error(`موضوع البحث غير ملائم للمنهاج: ${intakeResult.risks.join(", ")}`);
      }

      // 3. Skill: research-planner
      this.updateJobStep(jobId, "planning", 25);
      const plannerStart = Date.now();
      const outline = plan.outline && plan.outline.length > 0
        ? plan.outline
        : runResearchPlanner({
            topic: plan.topic,
            stage: plan.stage,
            level: plan.level,
            pages: plan.pages,
            style: plan.style,
            language: plan.language,
          }).outline;
      this.logSkillRun("research-planner", jobId, "claude-sonnet", { planId: plan.id }, { outlineCount: outline.length }, Date.now() - plannerStart);

      // 4. Skill: section-writer (Executed across body outline sections)
      this.updateJobStep(jobId, "writing", 50);
      const writerStart = Date.now();
      const sections: SectionContent[] = [];

      for (let i = 0; i < outline.length; i++) {
        const item = outline[i];
        if (item.type === "reference") continue; // References handled by references-builder

        const secContent = runSectionWriter({
          section: item,
          topic: plan.topic,
          stage: plan.stage,
          level: plan.level,
          style: plan.style,
          language: plan.language,
        });
        sections.push(secContent);
      }
      this.logSkillRun("section-writer", jobId, "claude-sonnet", { sectionsCount: sections.length }, { completed: true }, Date.now() - writerStart);

      // 5. Skill: references-builder
      this.updateJobStep(jobId, "references", 70);
      const refsStart = Date.now();
      const referencesResult = runReferencesBuilder({
        subject: plan.subject,
        stage: plan.stage,
        level: plan.level,
        topic: plan.topic,
      });
      this.logSkillRun("references-builder", jobId, "claude-haiku", { subject: plan.subject }, referencesResult, Date.now() - refsStart);

      // 6. Skill: study-aids
      const aidsResult = runStudyAids({
        topic: plan.topic,
        stage: plan.stage,
        sections,
      });

      // 7. Skill: quality-reviewer
      this.updateJobStep(jobId, "reviewing", 85);
      const reviewerStart = Date.now();
      const qualityResult = runQualityReviewer({
        outline,
        sections,
        stage: plan.stage,
        pages: plan.pages,
      });
      this.logSkillRun("quality-reviewer", jobId, "claude-haiku", { sectionsCount: sections.length }, qualityResult, Date.now() - reviewerStart);

      // 8. Assemble Document
      // 8. Assemble Document (Algerian Standards v2.0)
      const finalDoc: FinalResearchDocument = {
        meta: {
          stage: plan.stage,
          level: plan.level,
          subject: plan.subject,
          language: plan.language,
          pages: plan.pages,
          style: plan.style,
          unit_id: plan.options?.unit_id,
          unit_title: plan.options?.unit_title,
          teacher_requirements: plan.options?.teacher_requirements,
          catalog_version: plan.options?.catalog_version || "2026.1",
        },
        cover: {
          template: coverData?.template || "official",
          title: plan.topic,
          directorate: coverData?.directorate || plan.options?.directorate || "مديرية التربية لولاية الجزائر - وسط (16)",
          school: coverData?.school || plan.options?.school_name || "المؤسسة التعليمية",
          student: coverData?.student || plan.options?.student_name || "تلميذ المؤسسة",
          teacher: coverData?.teacher || plan.options?.teacher_name || "الأستاذ المشرف",
          year: coverData?.year || "2026/2027",
        },
        outline,
        sections,
        references: referencesResult.references,
        study_aids: aidsResult,
        quality: qualityResult,
        rendered_at: new Date().toISOString(),
      };

      // 9. Skill: formatter-renderer
      this.updateJobStep(jobId, "rendering", 95);
      const renderStart = Date.now();
      runFormatterRenderer({ document: finalDoc });
      this.logSkillRun("formatter-renderer", jobId, "renderer", { title: plan.topic }, { status: "rendered" }, Date.now() - renderStart);

      // 10. Settle Points and Mark Job Done
      WalletGuard.settlePoints(shopId, costPoints, `اكتمال بحث: ${plan.topic}`);

      db.prepare(`
        UPDATE research_jobs
        SET status = 'done', progress = 100, current_step = 'done',
            settled_points = ?, result_json = ?, updated_at = datetime('now')
        WHERE id = ?
      `).run(costPoints, JSON.stringify(finalDoc), jobId);

      // Save into research_docs table for the 72-hour privacy archive
      const docExpiresAt = new Date(Date.now() + 72 * 3600 * 1000).toISOString();
      db.prepare(`
        INSERT OR REPLACE INTO research_docs (
          id, shop_id, title, type, level, grade, subject, topic, language,
          page_count, style_level, cover_template, student_name, school_name, teacher_name,
          outline_json, content_json, references_json, review_questions_json,
          points_cost, sale_price_dzd, status, expires_at, created_at
        )
        VALUES (?, ?, ?, 'RESEARCH', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'COMPLETED', ?, datetime('now'))
      `).run(
        jobId,
        shopId,
        `بحث: ${plan.topic}`,
        plan.stage.toUpperCase(),
        `${plan.level}`,
        plan.subject,
        plan.topic,
        plan.language,
        plan.pages,
        plan.style.toUpperCase(),
        coverData?.template?.toUpperCase() || "OFFICIAL",
        coverData?.student || "تلميذ المؤسسة",
        coverData?.school || "المؤسسة التعليمية",
        coverData?.teacher || "الأستاذ المشرف",
        JSON.stringify(outline),
        JSON.stringify(sections),
        JSON.stringify(referencesResult.references),
        JSON.stringify(aidsResult.questions),
        costPoints,
        costPoints * 15, // Suggested retail price
        docExpiresAt
      );

      return {
        id: jobId,
        plan_id: plan.id,
        shop_id: shopId,
        status: "done",
        progress: 100,
        current_step: "done",
        reserved_points: costPoints,
        settled_points: costPoints,
        cover: finalDoc.cover,
        result: finalDoc,
        created_at: new Date(startTime).toISOString(),
        updated_at: new Date().toISOString(),
      };
    } catch (err: any) {
      // Rollback: Automatic Refund on any failure
      WalletGuard.refundPoints(shopId, costPoints, err?.message || "خطأ تقني أثناء التوليد");

      db.prepare(`
        UPDATE research_jobs
        SET status = 'failed', current_step = 'failed',
            error_json = ?, updated_at = datetime('now')
        WHERE id = ?
      `).run(JSON.stringify({ code: "generation_failed", message: err?.message }), jobId);

      throw err;
    }
  }
}
