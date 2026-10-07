/**
 * 🎯 Guidance Orchestrator (منسّق نظام التوجيه - PRD v1.0)
 * End-to-end guidance pipeline: Brief -> Spec -> Layered Prompt -> Generation -> Validators -> Repair Loop -> Settle
 */

import { db } from "@/lib/db";
import { Brief, Spec, ConformanceReport, GenerationRecord } from "./types";
import { SpecCompiler } from "./specCompiler";
import { LayeredPromptBuilder } from "./promptBuilder";
import { GuidanceValidators } from "./validators";
import { RepairLoopEngine } from "./repairLoop";
import { WalletGuard } from "../walletGuard";
import { runSectionWriter } from "../skills/sectionWriter";
import { runPracticeExamGenerator } from "../skills/practiceExamGenerator";
import { runFormatterRenderer } from "../skills/formatterRenderer";
import { StandardsPackRepository } from "./standardsPacks";

export interface StartGenerationInput {
  spec_id: string;
  shop_id: string;
  idempotency_key?: string;
  cover_overrides?: any;
}

export class GuidanceOrchestrator {
  /**
   * Run full generation cycle guided by Spec and audited by Validators
   */
  static async executeGuidedGeneration(input: StartGenerationInput): Promise<GenerationRecord> {
    const { spec_id, shop_id, idempotency_key, cover_overrides } = input;

    // 1. Retrieve Spec
    const spec = SpecCompiler.getSpecById(spec_id);
    if (!spec) {
      throw new Error(`مواصفة التوليد غير موجودة: ${spec_id}`);
    }

    const genId = `gn_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
    const costPoints = spec.estimate_points || 15;

    // 2. Atomic Wallet Point Reservation
    const reservation = WalletGuard.reservePoints(
      shop_id,
      costPoints,
      `توليد موجه: ${spec.summary_ar}`
    );

    if (!reservation.ok) {
      throw new Error(reservation.error || "رصيد النقاط لا يكفي");
    }

    try {
      // 3. Build Layered Prompts
      const promptData = LayeredPromptBuilder.build({
        spec,
        topicText: spec.summary_ar,
        teacherRequirements: spec.warnings.find((w) => w.code === "custom_req_note")?.message,
      });

      // 4. Generate Initial Document Payload
      let rawDocument: any = null;

      if (spec.kind === "exam") {
        const pack = StandardsPackRepository.getPackById(spec.pack_id) || StandardsPackRepository.resolvePack("middle", 4, "MATHS");
        rawDocument = runPracticeExamGenerator({
          stage: pack.stage,
          level: `${pack.level}AM`,
          subject: pack.subject,
          trimester: 1,
          directorate: cover_overrides?.directorate || "مديرية التربية لولاية الجزائر (16)",
          school_name: cover_overrides?.school_name || "المؤسسة التعليمية النموذجية",
          exam_type: "exam",
        });
      } else {
        // Research Generation
        const sections: any[] = [];
        for (const item of spec.structure) {
          if (item.role === "cover" || item.role === "references") continue;

          const secContent = runSectionWriter({
            section: {
              id: item.id,
              title: item.title,
              type: item.role as any,
              target_words: item.target_words?.max || 220,
              key_points: item.key_terms || [],
            },
            topic: spec.summary_ar,
            stage: "middle",
            level: 3,
            style: spec.constraints.style === "simple_clear" ? "simple" : "moderate",
            language: "ar",
          });
          sections.push(secContent);
        }

        rawDocument = {
          meta: {
            spec_id,
            pack_id: spec.pack_id,
            topic: spec.summary_ar,
            pages: spec.constraints.pages || 3,
            style: spec.constraints.style || "simple_clear",
          },
          cover: {
            template: cover_overrides?.template || "dz_official_ar",
            title: spec.summary_ar.split("·")[0]?.trim() || "بحث مدرسي",
            directorate: cover_overrides?.directorate || "مديرية التربية لولاية الجزائر (16)",
            school: cover_overrides?.school || "المؤسسة التعليمية",
            student: cover_overrides?.student || "تلميذ المؤسسة",
            teacher: cover_overrides?.teacher || "الأستاذ المشرف",
            year: "2026/2027",
          },
          sections,
          references: [],
        };
      }

      // 5. Run Initial Validators Suite (Attempt 1)
      let validation = GuidanceValidators.validate({
        kind: spec.kind,
        document: rawDocument,
        spec,
        attempts: 1,
      });

      // 6. Enter Repair Loop if not passing
      let finalDoc = validation.repairedDocument;
      let finalReport = validation.report;
      let totalAttempts = 1;

      if (!validation.report.pass) {
        const repairResult = RepairLoopEngine.executeRepair({
          spec,
          document: finalDoc,
          report: finalReport,
          attemptsCount: 1,
        });

        finalDoc = repairResult.document;
        finalReport = repairResult.conformance;
        totalAttempts = 2;
      }

      // Check final conformance pass status
      if (!finalReport.pass) {
        // Rollback points on critical conformance failure
        WalletGuard.refundPoints(shop_id, costPoints, "فشل اجتياز معايير المطابقة بعد محاولات الإصلاح");
        throw new Error("لم تجتز الوثيقة معايير المطابقة الوطنية المعتمدة. تم استرجاع نقاطك بالكامل.");
      }

      // 7. Render Final Layout
      if (spec.kind === "research") {
        runFormatterRenderer({ document: finalDoc });
      }

      // 8. Settle Points
      WalletGuard.settlePoints(shop_id, costPoints, `اكتمال وثيقة مطابقة: ${spec.summary_ar}`);

      // 9. Persist Conformance Report
      const reportId = `rep_${genId}`;
      try {
        db.prepare(`
          INSERT INTO conformance_reports (
            id, generation_id, score, pass, weights_json, checks_json, attempts, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
        `).run(
          reportId,
          genId,
          finalReport.score,
          finalReport.pass ? 1 : 0,
          JSON.stringify(finalReport.weights),
          JSON.stringify(finalReport.checks),
          totalAttempts
        );
      } catch (e) {
        console.error("[GuidanceOrchestrator] failed to save report:", e);
      }

      const record: GenerationRecord = {
        id: genId,
        spec_id,
        shop_id,
        kind: spec.kind,
        status: "done",
        reserved_points: costPoints,
        cost_points: costPoints,
        pack_version: spec.pack_id,
        prompt_version: LayeredPromptBuilder.PROMPT_VERSION,
        validator_version: "v1.0",
        attempts: totalAttempts,
        conformance: finalReport,
        document_payload: finalDoc,
        files: {
          pdf: `/api/v1/research/jobs/${genId}/export?format=pdf`,
          docx: `/api/v1/research/jobs/${genId}/export?format=docx`,
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      return record;
    } catch (err: any) {
      // Refund if error occurred during generation and was not refunded already
      WalletGuard.refundPoints(shop_id, costPoints, err?.message || "خطأ أثناء توليد الوثيقة");
      throw err;
    }
  }

  /**
   * Fetch Conformance Report for an existing generation
   */
  static getConformanceReport(generationId: string): ConformanceReport | null {
    try {
      const row = db.prepare(`SELECT * FROM conformance_reports WHERE generation_id = ?`).get(generationId) as any;
      if (!row) return null;

      return {
        score: row.score,
        pass: Boolean(row.pass),
        weights: JSON.parse(row.weights_json || "{}"),
        checks: JSON.parse(row.checks_json || "[]"),
        attempts: row.attempts,
        evaluated_at: row.created_at,
      };
    } catch {
      return null;
    }
  }
}
