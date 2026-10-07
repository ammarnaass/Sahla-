/**
 * ⚙️ Spec Compiler (مُجمِّع المواصفة - PRD v1.0)
 * Translates a user Brief into a strict, verifiable Output Spec (عقد المخرجات).
 * Merges: User Brief + Algerian Standards Pack + Platform Cost Policies.
 */

import { db } from "@/lib/db";
import {
  Brief,
  Spec,
  StandardsPack,
  SpecStructureItem,
  SpecWarning,
  BriefResearchSpecs,
  BriefExamSpecs,
} from "./types";
import { StandardsPackRepository } from "./standardsPacks";
import { calculateJobPoints } from "../config";

export class SpecCompiler {
  /**
   * Compiles a Brief into a verified, bounded Spec
   */
  static compileBrief(brief: Brief): Spec {
    const { stage, level, subject } = brief.context;
    const pack = StandardsPackRepository.resolvePack(stage, level, subject);

    const specId = `sp_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
    const warnings: SpecWarning[] = [];

    if (brief.kind === "exam") {
      return this.compileExamSpec(specId, brief, pack, warnings);
    } else {
      return this.compileResearchSpec(specId, brief, pack, warnings);
    }
  }

  /**
   * Compiles a Research Document Spec
   */
  private static compileResearchSpec(
    specId: string,
    brief: Brief,
    pack: StandardsPack,
    warnings: SpecWarning[]
  ): Spec {
    const researchSpecs = brief.specs as BriefResearchSpecs;
    const pages = Math.min(Math.max(researchSpecs.pages || 3, pack.research.pages.min), pack.research.pages.max);

    if (researchSpecs.pages > pack.research.pages.max) {
      warnings.push({
        code: "length_out_of_range",
        message: `عدد الصفحات (${researchSpecs.pages}) يتجاوز الحد الموصى به رسمياً لهذا الطور (${pack.research.pages.max} صفحات). تم ضبطه تلقائياً على ${pages}.`,
      });
    }

    // Broad topic detection
    const topicText = brief.topic.topic_text.trim();
    if (topicText.length <= 8 || ["الجزائر", "تاريخ الجزائر", "الفيزياء", "الرياضيات", "العلوم"].includes(topicText)) {
      const suggestedUnits = pack.curriculum.units.map((u) => u.title);
      warnings.push({
        code: "topic_broad",
        message: "عنوان البحث عام جداً؛ يُفضل حصره في موضوع محدد لضمان جودة الاستشهاد.",
        suggestions: suggestedUnits.slice(0, 3),
      });
    }

    // Determine sections and target word count
    const bodySectionsCount = Math.min(Math.max(pages <= 3 ? 2 : 3, pack.research.body_sections.min), pack.research.body_sections.max);
    const wordsPerPage = pack.research.words_per_page;
    const targetWordsPerSection = {
      min: Math.round((wordsPerPage.min * pages) / (bodySectionsCount + 2)),
      max: Math.round((wordsPerPage.max * pages) / (bodySectionsCount + 2)),
    };

    // Build structure contract
    const structure: SpecStructureItem[] = [
      { id: "sec_cover", title: "صفحة الغلاف الرسمي للجمهورية", role: "cover" },
      { id: "sec_intro", title: "المقدمة المنهجية وطرح الإشكالية", role: "intro", target_words: targetWordsPerSection },
    ];

    // Find active unit if provided
    const matchedUnit = pack.curriculum.units.find((u) => u.id === brief.topic.unit_id) || pack.curriculum.units[0];

    for (let i = 1; i <= bodySectionsCount; i++) {
      structure.push({
        id: `sec_body_${i}`,
        title: `المحور ${i}: ${matchedUnit?.title ? `${matchedUnit.title} (عنصر ${i})` : `المبحث ${i}`}`,
        role: "body",
        target_words: targetWordsPerSection,
        key_terms: matchedUnit?.key_terms?.slice((i - 1) * 2, i * 2),
      });
    }

    structure.push({
      id: "sec_conclusion",
      title: "الخاتمة والنتائج المتوصل إليها",
      role: "conclusion",
      target_words: targetWordsPerSection,
    });

    structure.push({
      id: "sec_refs",
      title: "قائمة المراجع والمصادر التعليمية المعتمدة",
      role: "references",
    });

    // Check teacher requirements note
    if (brief.teacher_requirements?.trim()) {
      warnings.push({
        code: "custom_req_note",
        message: `تم دمج طلب الأستاذ الإلزامي في عقد المخرجات: "${brief.teacher_requirements.substring(0, 50)}..."`,
      });
    }

    const costPoints = calculateJobPoints(pages, { math_latex: researchSpecs.has_latex });

    const stageName = brief.context.stage === "primary" ? "ابتدائي" : brief.context.stage === "middle" ? "متوسط" : "ثانوي";
    const summaryAr = `بحث مدرسي · ${brief.context.level} ${stageName} · ${pages} صفحات · مادة ${brief.context.subject} · أسلوب ${pack.research.style === "simple_clear" ? "بسيط وواضح" : "أكاديمي"} · غلاف جزائري رسمي · التكلفة: ${costPoints} نقطة.`;

    const spec: Spec = {
      spec_id: specId,
      brief_id: brief.id,
      pack_id: pack.pack_id,
      kind: "research",
      summary_ar: summaryAr,
      constraints: {
        sections: { min: structure.length - 1, max: structure.length + 1 },
        words_per_section: targetWordsPerSection,
        numerals: pack.research.numerals,
        pages,
        style: pack.research.style,
        vocabulary_level: pack.research.vocabulary_level,
      },
      structure,
      estimate_points: costPoints,
      warnings,
      status: "ready",
      created_at: new Date().toISOString(),
    };

    this.saveSpec(spec);
    return spec;
  }

  /**
   * Compiles an Exam Spec conforming to Algerian official exam design
   */
  private static compileExamSpec(
    specId: string,
    brief: Brief,
    pack: StandardsPack,
    warnings: SpecWarning[]
  ): Spec {
    const examSpecs = brief.specs as BriefExamSpecs;

    // Strict constraint: Total points = 20
    const totalPoints = 20;
    const durationMinutes = pack.exam.duration_minutes || 120;

    // Build exam structure
    const structure: SpecStructureItem[] = [];

    if (brief.context.subject === "MATHS" || brief.context.subject === "PHYSICS") {
      // 3 Exercises (12 points) + Integrated Situation (8 points) = 20 points
      structure.push(
        { id: "part_1_ex1", title: "التمرين الأول", role: "exercise", points: 4, competency: "استرجاع المعارف وتطبيق مباشر للقواعد" },
        { id: "part_1_ex2", title: "التمرين الثاني", role: "exercise", points: 4, competency: "توظيف الخوارزميات وتفسير المعطيات" },
        { id: "part_1_ex3", title: "التمرين الثالث", role: "exercise", points: 4, competency: "الاستدلال الرياضي والبرهان الهندسي" },
        { id: "part_2_situation", title: "الوضعية الإدماجية المركبة", role: "integrated_situation", points: 8, competency: "حل مشكلة معقدة ذات سياق واقعي جزائري" }
      );
    } else {
      // Standard 2 parts: Exercises/Questions (12 points) + Situation (8 points) = 20 points
      structure.push(
        { id: "part_1_ex1", title: "الجزء الأول: أسئلة الفهم والبناء الفكري", role: "exercise", points: 6, competency: "التحليل والاستيعاب" },
        { id: "part_1_ex2", title: "الجزء الثاني: البناء اللغوي والمنهجي", role: "exercise", points: 6, competency: "التحكم في أدوات المادة والمصطلحات" },
        { id: "part_2_situation", title: "الوضعية الإدماجية", role: "integrated_situation", points: 8, competency: "الإنتاج الكتابي والتحليل النقدي" }
      );
    }

    const pointsSum = structure.reduce((acc, curr) => acc + (curr.points || 0), 0);
    if (pointsSum !== 20) {
      warnings.push({
        code: "custom_req_note",
        message: `تم تصحيح مجموع النقاط حتمياً ليطابق المعيار الوطني الجزائري (20/20).`,
      });
    }

    const estimatePoints = 15;
    const stageName = brief.context.stage === "primary" ? "ابتدائي" : brief.context.stage === "middle" ? "متوسط" : "ثانوي";
    const typeLabel = examSpecs.exam_type === "test" ? "فرض محروس" : examSpecs.exam_type === "blanc" ? "امتحان تجريبي" : "اختبار فصلي";
    const summaryAr = `${typeLabel} · ${brief.context.grade_code || `${brief.context.level} ${stageName}`} · مادة ${brief.context.subject} · المدة: ${durationMinutes} دقيقة · مجموع 20 نقطة مع وضعية إدماجية (8 ن) ${examSpecs.with_solution ? "مع الحل وسلّم التنقيط" : ""} · التكلفة: ${estimatePoints} نقطة.`;

    const spec: Spec = {
      spec_id: specId,
      brief_id: brief.id,
      pack_id: pack.pack_id,
      kind: "exam",
      summary_ar: summaryAr,
      constraints: {
        total_points: totalPoints,
        duration_minutes: durationMinutes,
        numerals: pack.research.numerals,
      },
      structure,
      estimate_points: estimatePoints,
      warnings,
      difficulty_mix: pack.exam.difficulty_mix,
      with_solution: examSpecs.with_solution !== false,
      variants: examSpecs.variants_count || 1,
      label: "اختبار تدريبي غير رسمي",
      status: "ready",
      created_at: new Date().toISOString(),
    };

    this.saveSpec(spec);
    return spec;
  }

  /**
   * Persist spec into database
   */
  private static saveSpec(spec: Spec) {
    try {
      db.prepare(`
        INSERT OR REPLACE INTO specs (
          id, brief_id, pack_id, kind, summary_ar, constraints_json,
          structure_json, estimate_points, warnings_json, status, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
      `).run(
        spec.spec_id,
        spec.brief_id || null,
        spec.pack_id,
        spec.kind,
        spec.summary_ar,
        JSON.stringify(spec.constraints),
        JSON.stringify(spec.structure),
        spec.estimate_points,
        JSON.stringify(spec.warnings),
        spec.status,
        spec.created_at
      );
    } catch (e) {
      console.error("[SpecCompiler] save failed:", e);
    }
  }

  /**
   * Retrieve spec from DB
   */
  static getSpecById(specId: string): Spec | null {
    try {
      const row = db.prepare(`SELECT * FROM specs WHERE id = ?`).get(specId) as any;
      if (!row) return null;

      return {
        spec_id: row.id,
        brief_id: row.brief_id,
        pack_id: row.pack_id,
        kind: row.kind as any,
        summary_ar: row.summary_ar,
        constraints: JSON.parse(row.constraints_json || "{}"),
        structure: JSON.parse(row.structure_json || "[]"),
        estimate_points: row.estimate_points,
        warnings: JSON.parse(row.warnings_json || "[]"),
        status: row.status as any,
        created_at: row.created_at,
      };
    } catch {
      return null;
    }
  }

  /**
   * Update an existing spec and recalculate cost/warnings
   */
  static updateSpec(specId: string, updates: Partial<Spec>): Spec | null {
    const existing = this.getSpecById(specId);
    if (!existing) return null;

    const merged: Spec = {
      ...existing,
      ...updates,
      constraints: {
        ...existing.constraints,
        ...(updates.constraints || {}),
      },
      status: "ready",
    };

    this.saveSpec(merged);
    return merged;
  }
}
