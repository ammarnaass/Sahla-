/**
 * 🔁 Repair Loop Engine (حلقة الإصلاح الموضعي - PRD v1.0)
 * Targeted micro-repairs for defective sections/exercises within strict cost ceilings.
 */

import { Spec, ConformanceReport, RepairTarget } from "./types";
import { GuidanceValidators } from "./validators";
import { runSectionWriter } from "../skills/sectionWriter";
import { StandardsPackRepository } from "./standardsPacks";

export interface RepairJobInput {
  spec: Spec;
  document: any;
  report: ConformanceReport;
  attemptsCount: number;
}

export interface RepairJobResult {
  document: any;
  conformance: ConformanceReport;
  repairedSectionIds: string[];
  status: "repaired_and_passed" | "needs_human_review" | "cost_ceiling_reached";
  additionalCostRatio: number;
}

export class RepairLoopEngine {
  static readonly MAX_ATTEMPTS = 2;
  static readonly MAX_COST_OVERHEAD_RATIO = 0.40; // 40% cost ceiling

  /**
   * Executes local repairs for failed validator checks
   */
  static executeRepair(input: RepairJobInput): RepairJobResult {
    const { spec, document, report, attemptsCount } = input;
    const docCopy = JSON.parse(JSON.stringify(document));
    const repairedSectionIds: string[] = [];

    // 1. If document already passes and has no critical failures, return immediately
    if (report.pass) {
      return {
        document: docCopy,
        conformance: report,
        repairedSectionIds: [],
        status: "repaired_and_passed",
        additionalCostRatio: 0,
      };
    }

    // 2. Check maximum attempts ceiling
    if (attemptsCount >= this.MAX_ATTEMPTS) {
      return {
        document: docCopy,
        conformance: report,
        repairedSectionIds: [],
        status: "needs_human_review",
        additionalCostRatio: 0.20,
      };
    }

    const pack = StandardsPackRepository.getPackById(spec.pack_id) || StandardsPackRepository.resolvePack("middle", 3, "HISTORY_GEO");

    // 3. Identify failed checks requiring targeted LLM rewrite
    const failedChecks = report.checks.filter((c) => c.status === "failed");

    // Targeted Section Repair (Research)
    if (spec.kind === "research" && Array.isArray(docCopy.sections)) {
      for (const chk of failedChecks) {
        if (chk.id === "V04") {
          // Curriculum / Out-of-scope concepts in a body section -> rewrite the offending section
          const activeUnit = pack.curriculum.units[0];
          const bodyIndex = docCopy.sections.findIndex((s: any) => s.type === "body");
          if (bodyIndex !== -1) {
            const targetSec = docCopy.sections[bodyIndex];
            const targetSpecItem = spec.structure.find((s) => s.id === targetSec.id) || spec.structure[2];

            // Local section regeneration call
            const rewritten = runSectionWriter({
              section: {
                id: targetSec.id,
                title: targetSec.title,
                type: "body",
                target_words: targetSpecItem?.target_words?.max || 240,
                key_points: activeUnit?.key_terms || [],
              },
              topic: spec.summary_ar,
              stage: pack.stage,
              level: pack.level,
              style: pack.research.style === "simple_clear" ? "simple" : "moderate",
              language: pack.language,
            });

            docCopy.sections[bodyIndex] = rewritten;
            repairedSectionIds.push(targetSec.id);
          }
        }
      }
    }

    // 4. Re-validate after targeted repair
    const reval = GuidanceValidators.validate({
      kind: spec.kind,
      document: docCopy,
      spec,
      attempts: attemptsCount + 1,
    });

    return {
      document: reval.repairedDocument,
      conformance: reval.report,
      repairedSectionIds,
      status: reval.report.pass ? "repaired_and_passed" : "needs_human_review",
      additionalCostRatio: repairedSectionIds.length > 0 ? 0.25 : 0.0,
    };
  }
}
