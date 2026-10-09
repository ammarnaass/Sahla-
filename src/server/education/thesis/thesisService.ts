/**
 * 🛠️ Thesis Service & State Machine
 * إدارة دورة حياة مشاريع مذكرات التخرج الأكاديمية (النسخة 1.0)
 * 
 * الحالات المدعومة:
 * draft -> planned -> plan_approved -> researching -> sources_review -> writing -> analyzing -> assembling -> quality_review -> ready
 */

import { db } from "@/lib/db";
import { ensureThesisStudioTables } from "./dbMigration";
import {
  ThesisProject,
  ThesisPlan,
  ThesisStatus,
  ThesisDegree,
  ThesisType,
  CitationStyle,
  ThesisSource,
  ChapterFactSheet,
  WrittenChapter,
  ThesisQualityReport,
} from "./types";
import { getInstitutionProfile, resolveProfileByInstitution } from "./institutionProfiles";
import { runThesisPlanner } from "./thesisPlanner";
import { AcademicResearcher } from "./skills/researcher";
import { SourceVetter } from "./skills/sourceVetter";
import { ChapterWriter } from "./skills/chapterWriter";
import { ThesisQualityAuditor } from "./validators/thesisValidators";
import { IntroConclusionWriter, IntroConclusionResult } from "./skills/introConclusionWriter";
import { AbstractTranslator, TrilingualAbstracts } from "./skills/abstractTranslator";
import { CitationFormatter, FormattedBibliography } from "./skills/citationFormatter";
import { ThesisAssembler, AssembledThesisDocument } from "./skills/thesisAssembler";
import { GuideExtractor } from "./skills/guideExtractor";

export interface CreateThesisDTO {
  shopId: string;
  topic: string;
  studentName: string;
  supervisorName: string;
  juryMembers?: string[];
  university: string;
  faculty: string;
  department?: string;
  specialty: string;
  degree?: ThesisDegree;
  profileId?: string;
  language?: "ar" | "fr" | "en";
  academicYear?: string;
  type?: ThesisType;
  targetPages?: number;
  citationStyle?: CitationStyle;
  methodologyType?: string;
  hasDataset?: boolean;
  datasetFilename?: string;
  teacherRequirements?: string;
}

export class ThesisService {
  /**
   * حساب تكلفة النقاط التقديرية بناءً على الدرجة وعدد الصفحات ووجود التحليل
   */
  public static calculatePointsCost(
    pages: number,
    degree: ThesisDegree,
    hasDataset: boolean
  ): number {
    const baseCostByDegree: Record<ThesisDegree, number> = {
      LICENSE: 25,
      MASTER_ACADEMIC: 40,
      MASTER_PROFESSIONAL: 40,
      TECH_SUPERIEUR: 20,
      STAGE_REPORT: 15,
    };

    const base = baseCostByDegree[degree] || 35;
    const pageFactor = Math.max(1, Math.ceil(pages / 20));
    const statsFactor = hasDataset ? 15 : 0;

    return base + pageFactor * 5 + statsFactor;
  }

  /**
   * إنشاء مشروع مذكرة تخرج جديد من استمارة الـ Intake
   */
  public static async createThesis(dto: CreateThesisDTO): Promise<ThesisProject> {
    ensureThesisStudioTables();

    const id = `the_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const targetPages = dto.targetPages || 60;
    const degree = dto.degree || "MASTER_ACADEMIC";
    const language = dto.language || "ar";
    const academicYear = dto.academicYear || "2025 / 2026 م";
    const type = dto.type || "THEORETICAL";
    const hasDataset = Boolean(dto.hasDataset);

    // Resolve or retrieve matching InstitutionProfile
    const profile = dto.profileId
      ? getInstitutionProfile(dto.profileId) || resolveProfileByInstitution(dto.university, dto.faculty, degree)
      : resolveProfileByInstitution(dto.university, dto.faculty, degree);

    const citationStyle = dto.citationStyle || profile.citation.style || "APA7";
    const pointsCost = this.calculatePointsCost(targetPages, degree, hasDataset);

    const project: ThesisProject = {
      id,
      shop_id: dto.shopId,
      profile_id: profile.profile_id,
      title: dto.topic.trim(),
      clean_title: dto.topic.trim(),
      student_name: dto.studentName.trim(),
      supervisor_name: dto.supervisorName.trim(),
      jury_members: dto.juryMembers || [],
      university: dto.university.trim() || profile.institution_name,
      faculty: dto.faculty.trim() || profile.faculty,
      department: dto.department?.trim() || profile.department,
      specialty: dto.specialty.trim() || "علوم وتكنولوجيا",
      degree,
      language,
      academic_year: academicYear,
      type,
      target_pages: targetPages,
      citation_style: citationStyle,
      methodology_type: dto.methodologyType || "descriptive_analytical",
      has_dataset: hasDataset,
      dataset_filename: dto.datasetFilename,
      teacher_requirements: dto.teacherRequirements?.trim(),
      status: "draft",
      points_cost: pointsCost,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    db.prepare(`
      INSERT INTO theses (
        id, shop_id, profile_id, title, clean_title, student_name, supervisor_name,
        jury_members_json, university, faculty, department, specialty, degree,
        language, academic_year, type, target_pages, citation_style, methodology_type,
        has_dataset, dataset_filename, teacher_requirements, status, points_cost,
        created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      project.id,
      project.shop_id,
      project.profile_id,
      project.title,
      project.clean_title || null,
      project.student_name,
      project.supervisor_name,
      JSON.stringify(project.jury_members),
      project.university,
      project.faculty,
      project.department || null,
      project.specialty,
      project.degree,
      project.language,
      project.academic_year,
      project.type,
      project.target_pages,
      project.citation_style,
      project.methodology_type,
      project.has_dataset ? 1 : 0,
      project.dataset_filename || null,
      project.teacher_requirements || null,
      project.status,
      project.points_cost,
      project.created_at,
      project.updated_at
    );

    return project;
  }

  /**
   * استرجاع مشروع المذكرة
   */
  public static getThesis(thesisId: string): ThesisProject | null {
    ensureThesisStudioTables();
    const row: any = db.prepare("SELECT * FROM theses WHERE id = ?").get(thesisId);
    if (!row) return null;

    return {
      id: row.id,
      shop_id: row.shop_id,
      profile_id: row.profile_id,
      title: row.title,
      clean_title: row.clean_title,
      student_name: row.student_name,
      supervisor_name: row.supervisor_name,
      jury_members: row.jury_members_json ? JSON.parse(row.jury_members_json) : [],
      university: row.university,
      faculty: row.faculty,
      department: row.department,
      specialty: row.specialty,
      degree: row.degree,
      language: row.language,
      academic_year: row.academic_year,
      type: row.type,
      target_pages: row.target_pages,
      citation_style: row.citation_style,
      methodology_type: row.methodology_type,
      has_dataset: Boolean(row.has_dataset),
      dataset_filename: row.dataset_filename,
      teacher_requirements: row.teacher_requirements,
      status: row.status as ThesisStatus,
      quality_score: row.quality_score,
      points_cost: row.points_cost,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  }

  /**
   * توليد خطة المذكرة الأكاديمية (thesis-planner) وحفظها
   */
  public static async generatePlan(thesisId: string): Promise<ThesisPlan> {
    ensureThesisStudioTables();
    const project = this.getThesis(thesisId);
    if (!project) throw new Error("المشروع غير موجود");

    const profile =
      getInstitutionProfile(project.profile_id) ||
      resolveProfileByInstitution(project.university, project.faculty, project.degree);

    const plannedResult = await runThesisPlanner({
      topic: project.title,
      profile,
      specialty: project.specialty,
      degree: project.degree,
      type: project.type,
      targetPages: project.target_pages,
      hasDataset: project.has_dataset,
      teacherRequirements: project.teacher_requirements,
      language: project.language,
    });

    const planId = `pln_${Date.now()}`;
    const now = new Date().toISOString();

    const plan: ThesisPlan = {
      id: planId,
      thesis_id: thesisId,
      title: plannedResult.title,
      problem: plannedResult.problem,
      sub_questions: plannedResult.sub_questions,
      hypotheses: plannedResult.hypotheses,
      methodology: plannedResult.methodology,
      chapters: plannedResult.chapters,
      total_target_pages: plannedResult.total_target_pages,
      summary_ar: plannedResult.summary_ar,
      is_approved: false,
      created_at: now,
      updated_at: now,
    };

    // Save or update thesis_plans
    db.prepare(`
      INSERT INTO thesis_plans (
        id, thesis_id, title, problem, sub_questions_json, hypotheses_json,
        methodology_json, chapters_json, total_target_pages, summary_ar, is_approved,
        created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)
      ON CONFLICT(thesis_id) DO UPDATE SET
        title = excluded.title,
        problem = excluded.problem,
        sub_questions_json = excluded.sub_questions_json,
        hypotheses_json = excluded.hypotheses_json,
        methodology_json = excluded.methodology_json,
        chapters_json = excluded.chapters_json,
        total_target_pages = excluded.total_target_pages,
        summary_ar = excluded.summary_ar,
        is_approved = 0,
        updated_at = excluded.updated_at;
    `).run(
      plan.id,
      plan.thesis_id,
      plan.title,
      plan.problem,
      JSON.stringify(plan.sub_questions),
      JSON.stringify(plan.hypotheses),
      JSON.stringify(plan.methodology),
      JSON.stringify(plan.chapters),
      plan.total_target_pages,
      plan.summary_ar,
      plan.created_at,
      plan.updated_at
    );

    // Update project state to 'planned'
    this.updateStatus(thesisId, "planned");

    return plan;
  }

  /**
   * جلب خطة المذكرة الحالية
   */
  public static getPlan(thesisId: string): ThesisPlan | null {
    ensureThesisStudioTables();
    const row: any = db.prepare("SELECT * FROM thesis_plans WHERE thesis_id = ?").get(thesisId);
    if (!row) return null;

    return {
      id: row.id,
      thesis_id: row.thesis_id,
      title: row.title,
      problem: row.problem,
      sub_questions: JSON.parse(row.sub_questions_json),
      hypotheses: JSON.parse(row.hypotheses_json),
      methodology: JSON.parse(row.methodology_json),
      chapters: JSON.parse(row.chapters_json),
      total_target_pages: row.total_target_pages,
      summary_ar: row.summary_ar,
      is_approved: Boolean(row.is_approved),
      approved_at: row.approved_at,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  }

  /**
   * اعتماد وتثبيت خطة المذكرة من قبل الطالب / المشرف
   */
  public static approvePlan(
    thesisId: string,
    updates?: Partial<ThesisPlan>
  ): ThesisPlan {
    ensureThesisStudioTables();
    const existing = this.getPlan(thesisId);
    if (!existing) throw new Error("لم يتم توليد خطة لهذا المشروع بعد");

    const now = new Date().toISOString();
    const finalTitle = updates?.title || existing.title;
    const finalProblem = updates?.problem || existing.problem;
    const finalSubQuestions = updates?.sub_questions || existing.sub_questions;
    const finalHypotheses = updates?.hypotheses || existing.hypotheses;
    const finalMethodology = updates?.methodology || existing.methodology;
    const finalChapters = updates?.chapters || existing.chapters;

    db.prepare(`
      UPDATE thesis_plans SET
        title = ?,
        problem = ?,
        sub_questions_json = ?,
        hypotheses_json = ?,
        methodology_json = ?,
        chapters_json = ?,
        is_approved = 1,
        approved_at = ?,
        updated_at = ?
      WHERE thesis_id = ?
    `).run(
      finalTitle,
      finalProblem,
      JSON.stringify(finalSubQuestions),
      JSON.stringify(finalHypotheses),
      JSON.stringify(finalMethodology),
      JSON.stringify(finalChapters),
      now,
      now,
      thesisId
    );

    // Update project state to 'plan_approved'
    this.updateStatus(thesisId, "plan_approved");

    return this.getPlan(thesisId)!;
  }

  /**
   * تحديث حالة المشروع في جدول theses
   */
  public static updateStatus(thesisId: string, status: ThesisStatus): void {
    ensureThesisStudioTables();
    db.prepare(`
      UPDATE theses SET status = ?, updated_at = datetime('now') WHERE id = ?
    `).run(status, thesisId);
  }

  /**
   * إطلاق مهمة البحث الأكاديمي واسترجاع الحقائق (researcher + source-vetter)
   */
  public static async runResearch(
    thesisId: string,
    chapterId?: string
  ): Promise<{ sources: ThesisSource[]; factSheets: ChapterFactSheet[] }> {
    ensureThesisStudioTables();
    const project = this.getThesis(thesisId);
    if (!project) throw new Error("المشروع غير موجود");

    const plan = this.getPlan(thesisId);
    if (!plan || !plan.chapters || plan.chapters.length === 0) {
      throw new Error("يجب إنشاء واعتماد خطة المذكرة أولاً قبل مرحلة البحث");
    }

    const profile =
      getInstitutionProfile(project.profile_id) ||
      resolveProfileByInstitution(project.university, project.faculty, project.degree);

    this.updateStatus(thesisId, "researching");

    const chaptersToResearch = chapterId
      ? plan.chapters.filter((c) => c.id === chapterId)
      : plan.chapters;

    if (chaptersToResearch.length === 0) {
      throw new Error(`الفصل ${chapterId} غير موجود في خطة المذكرة`);
    }

    const allSources: ThesisSource[] = this.getSources(thesisId);
    const resultFactSheets: ChapterFactSheet[] = [];

    for (const chap of chaptersToResearch) {
      const researchOutput = await AcademicResearcher.researchChapter({
        project,
        chapter: chap,
        profile,
        existingSourcesCount: allSources.length,
      });

      // حفظ أو تحديث المصادر
      for (const src of researchOutput.sources) {
        const existingIdx = allSources.findIndex(
          (s) => s.id === src.id || (s.title === src.title && s.year === src.year)
        );
        if (existingIdx === -1) {
          allSources.push(src);
          db.prepare(`
            INSERT INTO thesis_sources (
              id, thesis_id, chapter_id, title, authors_json, year,
              publisher_or_journal, url, doi, status, credibility_score,
              source_type, accessed_at, created_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(thesis_id, id) DO UPDATE SET
              title = excluded.title,
              authors_json = excluded.authors_json,
              year = excluded.year,
              publisher_or_journal = excluded.publisher_or_journal,
              url = excluded.url,
              doi = excluded.doi,
              status = excluded.status,
              credibility_score = excluded.credibility_score;
          `).run(
            src.id,
            thesisId,
            src.chapter_id || null,
            src.title,
            JSON.stringify(src.authors),
            src.year,
            src.publisher_or_journal,
            src.url || null,
            src.doi || null,
            src.status,
            src.credibility_score,
            src.source_type,
            src.accessed_at || null,
            src.created_at
          );
        }
      }

      // حفظ ورقة الحقائق
      db.prepare(`
        INSERT INTO thesis_fact_sheets (
          id, thesis_id, chapter_id, facts_json, gaps_json, queries_used_json, created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          facts_json = excluded.facts_json,
          gaps_json = excluded.gaps_json,
          queries_used_json = excluded.queries_used_json;
      `).run(
        researchOutput.fact_sheet.id,
        thesisId,
        chap.id,
        JSON.stringify(researchOutput.fact_sheet.facts),
        JSON.stringify(researchOutput.fact_sheet.gaps),
        JSON.stringify(researchOutput.fact_sheet.queries_used),
        researchOutput.fact_sheet.created_at
      );

      resultFactSheets.push(researchOutput.fact_sheet);
    }

    this.updateStatus(thesisId, "sources_review");

    return {
      sources: this.getSources(thesisId),
      factSheets: resultFactSheets,
    };
  }

  /**
   * جلب كافة مصادر المذكرة
   */
  public static getSources(thesisId: string): ThesisSource[] {
    ensureThesisStudioTables();
    const rows: any[] = db
      .prepare("SELECT * FROM thesis_sources WHERE thesis_id = ? ORDER BY id ASC")
      .all(thesisId);

    return rows.map((r) => ({
      id: r.id,
      thesis_id: r.thesis_id,
      chapter_id: r.chapter_id,
      title: r.title,
      authors: JSON.parse(r.authors_json),
      year: r.year,
      publisher_or_journal: r.publisher_or_journal,
      url: r.url,
      doi: r.doi,
      status: r.status,
      credibility_score: r.credibility_score,
      source_type: r.source_type,
      accessed_at: r.accessed_at,
      created_at: r.created_at,
    }));
  }

  /**
   * إضافة مصدر يدوياً من قبل الطالب أو المشرف
   */
  public static addSource(
    thesisId: string,
    candidate: {
      title: string;
      authors?: string[];
      year?: number;
      publisher_or_journal?: string;
      url?: string;
      doi?: string;
      source_type?: ThesisSource["source_type"];
      chapter_id?: string;
    }
  ): ThesisSource {
    ensureThesisStudioTables();
    const existing = this.getSources(thesisId);
    const nextIndex = existing.length + 1;
    const vetted = SourceVetter.vetSource(candidate, nextIndex, thesisId);
    const src = vetted.source;

    db.prepare(`
      INSERT INTO thesis_sources (
        id, thesis_id, chapter_id, title, authors_json, year,
        publisher_or_journal, url, doi, status, credibility_score,
        source_type, accessed_at, created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      src.id,
      thesisId,
      src.chapter_id || null,
      src.title,
      JSON.stringify(src.authors),
      src.year,
      src.publisher_or_journal,
      src.url || null,
      src.doi || null,
      src.status,
      src.credibility_score,
      src.source_type,
      src.accessed_at || null,
      src.created_at
    );

    return src;
  }

  /**
   * تعديل مصدر معتمد
   */
  public static updateSource(
    thesisId: string,
    sourceId: string,
    updates: Partial<ThesisSource>
  ): ThesisSource | null {
    ensureThesisStudioTables();
    const existing = db
      .prepare("SELECT * FROM thesis_sources WHERE thesis_id = ? AND id = ?")
      .get(thesisId, sourceId) as any;

    if (!existing) return null;

    const authors = updates.authors ? JSON.stringify(updates.authors) : existing.authors_json;
    const title = updates.title || existing.title;
    const year = updates.year || existing.year;
    const publisher = updates.publisher_or_journal || existing.publisher_or_journal;
    const url = updates.url !== undefined ? updates.url : existing.url;
    const doi = updates.doi !== undefined ? updates.doi : existing.doi;
    const status = updates.status || existing.status;
    const score = updates.credibility_score !== undefined ? updates.credibility_score : existing.credibility_score;

    db.prepare(`
      UPDATE thesis_sources SET
        title = ?,
        authors_json = ?,
        year = ?,
        publisher_or_journal = ?,
        url = ?,
        doi = ?,
        status = ?,
        credibility_score = ?
      WHERE thesis_id = ? AND id = ?
    `).run(
      title,
      authors,
      year,
      publisher,
      url || null,
      doi || null,
      status,
      score,
      thesisId,
      sourceId
    );

    const updated = this.getSources(thesisId).find((s) => s.id === sourceId);
    return updated || null;
  }

  /**
   * حذف مصدر
   */
  public static deleteSource(thesisId: string, sourceId: string): boolean {
    ensureThesisStudioTables();
    const res = db
      .prepare("DELETE FROM thesis_sources WHERE thesis_id = ? AND id = ?")
      .run(thesisId, sourceId);
    return res.changes > 0;
  }

  /**
   * جلب أوراق الحقائق للمذكرة
   */
  public static getFactSheets(thesisId: string): ChapterFactSheet[] {
    ensureThesisStudioTables();
    const rows: any[] = db
      .prepare("SELECT * FROM thesis_fact_sheets WHERE thesis_id = ? ORDER BY chapter_id ASC")
      .all(thesisId);

    return rows.map((r) => ({
      id: r.id,
      thesis_id: r.thesis_id,
      chapter_id: r.chapter_id,
      facts: JSON.parse(r.facts_json),
      gaps: r.gaps_json ? JSON.parse(r.gaps_json) : [],
      queries_used: r.queries_used_json ? JSON.parse(r.queries_used_json) : [],
      created_at: r.created_at,
    }));
  }

  /**
   * كتابة وتوليد فصل أكاديمي (chapter-writer)
   */
  public static async writeChapter(
    thesisId: string,
    chapterId: string
  ): Promise<WrittenChapter> {
    ensureThesisStudioTables();
    const project = this.getThesis(thesisId);
    if (!project) throw new Error("المشروع غير موجود");

    const plan = this.getPlan(thesisId);
    if (!plan) throw new Error("خطة المذكرة غير موجودة");

    const chapterPlan = plan.chapters.find((c) => c.id === chapterId);
    if (!chapterPlan) throw new Error(`الفصل ${chapterId} غير موجود بالخطة`);

    const factSheets = this.getFactSheets(thesisId);
    let factSheet = factSheets.find((fs) => fs.chapter_id === chapterId);

    const profile =
      getInstitutionProfile(project.profile_id) ||
      resolveProfileByInstitution(project.university, project.faculty, project.degree);

    let sources = this.getSources(thesisId);

    // إن لم تكن هناك ورقة حقائق، نقوم بعملية البحث أولاً
    if (!factSheet || sources.length === 0) {
      const res = await this.runResearch(thesisId, chapterId);
      factSheet = res.factSheets.find((fs) => fs.chapter_id === chapterId);
      sources = res.sources;
    }

    if (!factSheet) {
      throw new Error("تعذر تجهيز ورقة الحقائق للفصل");
    }

    this.updateStatus(thesisId, "writing");

    // جلب ملخص الفصول المكتوبة مسبقاً لمنع التكرار
    const previousChapters = this.getChapters(thesisId).filter((c) => c.chapter_id !== chapterId);
    const previousSummary = previousChapters
      .map((c) => `فصل: ${c.title} (كلمات: ${c.word_count})`)
      .join("، ");

    const written = await ChapterWriter.writeChapter({
      project,
      chapterPlan,
      factSheet,
      sources,
      profile,
      previousSummary,
    });

    // حفظ الفصل في جدول thesis_chapters
    db.prepare(`
      INSERT INTO thesis_chapters (
        id, thesis_id, chapter_id, title, content_json, word_count,
        page_count_estimate, status, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        title = excluded.title,
        content_json = excluded.content_json,
        word_count = excluded.word_count,
        page_count_estimate = excluded.page_count_estimate,
        status = excluded.status,
        updated_at = excluded.updated_at;
    `).run(
      written.id,
      thesisId,
      written.chapter_id,
      written.title,
      JSON.stringify(written.sections),
      written.word_count,
      written.page_count_estimate,
      written.status,
      written.created_at,
      written.updated_at
    );

    return written;
  }

  /**
   * جلب كافة الفصول المكتوبة للمذكرة
   */
  public static getChapters(thesisId: string): WrittenChapter[] {
    ensureThesisStudioTables();
    const rows: any[] = db
      .prepare("SELECT * FROM thesis_chapters WHERE thesis_id = ? ORDER BY chapter_id ASC")
      .all(thesisId);

    return rows.map((r) => ({
      id: r.id,
      thesis_id: r.thesis_id,
      chapter_id: r.chapter_id,
      title: r.title,
      sections: JSON.parse(r.content_json),
      word_count: r.word_count,
      page_count_estimate: r.page_count_estimate,
      status: r.status,
      created_at: r.created_at,
      updated_at: r.updated_at,
    }));
  }

  /**
   * تشغيل تدقيق الجودة والمطابقة T01-T16 وإصدار تقرير الجودة
   */
  public static runQualityAudit(thesisId: string): ThesisQualityReport {
    ensureThesisStudioTables();
    const project = this.getThesis(thesisId);
    if (!project) throw new Error("المشروع غير موجود");

    const profile =
      getInstitutionProfile(project.profile_id) ||
      resolveProfileByInstitution(project.university, project.faculty, project.degree);

    const plan = this.getPlan(thesisId);
    const sources = this.getSources(thesisId);
    const chapters = this.getChapters(thesisId);

    const report = ThesisQualityAuditor.auditThesis({
      project,
      profile,
      plan,
      sources,
      chapters,
      hasDataset: project.has_dataset,
    });

    const reportId = `qr_${thesisId}`;
    db.prepare(`
      INSERT INTO thesis_quality_reports (
        id, thesis_id, score, passed, checks_json,
        verified_sources_ratio, unattributed_claims_ratio,
        stats_accuracy_ratio, evaluated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(thesis_id) DO UPDATE SET
        score = excluded.score,
        passed = excluded.passed,
        checks_json = excluded.checks_json,
        verified_sources_ratio = excluded.verified_sources_ratio,
        unattributed_claims_ratio = excluded.unattributed_claims_ratio,
        stats_accuracy_ratio = excluded.stats_accuracy_ratio,
        evaluated_at = excluded.evaluated_at;
    `).run(
      reportId,
      thesisId,
      report.score,
      report.passed ? 1 : 0,
      JSON.stringify(report.checks),
      report.verified_sources_ratio,
      report.unattributed_claims_ratio,
      report.stats_accuracy_ratio,
      report.evaluated_at
    );

    // تحديث النتيجة في جدول theses
    db.prepare(`
      UPDATE theses SET
        quality_score = ?,
        status = ?,
        updated_at = datetime('now')
      WHERE id = ?
    `).run(
      report.score,
      report.passed ? "ready" : "needs_input",
      thesisId
    );

    return report;
  }

  /**
   * جلب تقرير الجودة المحفوظ للمذكرة
   */
  public static getQualityReport(thesisId: string): ThesisQualityReport | null {
    ensureThesisStudioTables();
    const row: any = db
      .prepare("SELECT * FROM thesis_quality_reports WHERE thesis_id = ?")
      .get(thesisId);

    if (!row) return null;

    return {
      thesis_id: row.thesis_id,
      score: row.score,
      passed: Boolean(row.passed),
      checks: JSON.parse(row.checks_json),
      verified_sources_ratio: row.verified_sources_ratio,
      unattributed_claims_ratio: row.unattributed_claims_ratio,
      stats_accuracy_ratio: row.stats_accuracy_ratio,
      evaluated_at: row.evaluated_at,
    };
  }

  /**
   * صياغة المقدمة العامة والخاتمة العامة للمذكرة
   */
  public static async generateIntroAndConclusion(
    thesisId: string
  ): Promise<IntroConclusionResult> {
    ensureThesisStudioTables();
    const project = this.getThesis(thesisId);
    if (!project) throw new Error("المشروع غير موجود");

    const plan = this.getPlan(thesisId);
    if (!plan) throw new Error("خطة المذكرة غير موجودة");

    const profile =
      getInstitutionProfile(project.profile_id) ||
      resolveProfileByInstitution(project.university, project.faculty, project.degree);

    const chapters = this.getChapters(thesisId);

    return IntroConclusionWriter.writeIntroAndConclusion({
      project,
      profile,
      plan,
      chapters,
    });
  }

  /**
   * توليد الملخصات الأكاديمية الثلاثية (عربي، فرنسي، إنجليزي) مع الكلمات المفتاحية
   */
  public static async generateAbstracts(
    thesisId: string
  ): Promise<TrilingualAbstracts> {
    ensureThesisStudioTables();
    const project = this.getThesis(thesisId);
    if (!project) throw new Error("المشروع غير موجود");

    const plan = this.getPlan(thesisId);
    if (!plan) throw new Error("خطة المذكرة غير موجودة");

    const chapters = this.getChapters(thesisId);

    return AbstractTranslator.generateTrilingualAbstracts({
      project,
      plan,
      chapters,
    });
  }

  /**
   * تجميع المذكرة الأكاديمية بالكامل (assembler) بصيغة DOCX/HTML مهيأة للطباعة
   */
  public static async assembleThesis(
    thesisId: string
  ): Promise<AssembledThesisDocument> {
    ensureThesisStudioTables();
    const project = this.getThesis(thesisId);
    if (!project) throw new Error("المشروع غير موجود");

    const plan = this.getPlan(thesisId);
    if (!plan) throw new Error("خطة المذكرة غير موجودة");

    const profile =
      getInstitutionProfile(project.profile_id) ||
      resolveProfileByInstitution(project.university, project.faculty, project.degree);

    this.updateStatus(thesisId, "assembling");

    const chapters = this.getChapters(thesisId);
    const sources = this.getSources(thesisId);

    // صياغة المقدمة والخاتمة
    const introConclusion = await this.generateIntroAndConclusion(thesisId);

    // صياغة الملخصات الثلاثية
    const abstracts = await this.generateAbstracts(thesisId);

    // التجميع الشامل
    const assembledDoc = ThesisAssembler.assemble({
      project,
      profile,
      plan,
      chapters,
      sources,
      introConclusion,
      abstracts,
    });

    // تشغيل فحص الجودة المباشر
    this.runQualityAudit(thesisId);

    return assembledDoc;
  }

  /**
   * استخراج ملف مؤسسة (InstitutionProfile) جديد من نص دليل المذكرة
   */
  public static async extractProfileFromGuide(
    guideText: string,
    hints?: { university?: string; faculty?: string; degree?: ThesisDegree }
  ) {
    return GuideExtractor.extractProfile({
      guide_text: guideText,
      university_hint: hints?.university,
      faculty_hint: hints?.faculty,
      degree_hint: hints?.degree,
    });
  }

  /**
   * قائمة مشاريع المذكرات التابعة للمحل
   */
  public static listByShop(shopId: string): ThesisProject[] {
    ensureThesisStudioTables();
    const rows: any[] = db
      .prepare("SELECT * FROM theses WHERE shop_id = ? ORDER BY created_at DESC")
      .all(shopId);

    return rows.map((row) => ({
      id: row.id,
      shop_id: row.shop_id,
      profile_id: row.profile_id,
      title: row.title,
      clean_title: row.clean_title,
      student_name: row.student_name,
      supervisor_name: row.supervisor_name,
      jury_members: row.jury_members_json ? JSON.parse(row.jury_members_json) : [],
      university: row.university,
      faculty: row.faculty,
      department: row.department,
      specialty: row.specialty,
      degree: row.degree,
      language: row.language,
      academic_year: row.academic_year,
      type: row.type,
      target_pages: row.target_pages,
      citation_style: row.citation_style,
      methodology_type: row.methodology_type,
      has_dataset: Boolean(row.has_dataset),
      dataset_filename: row.dataset_filename,
      teacher_requirements: row.teacher_requirements,
      status: row.status as ThesisStatus,
      quality_score: row.quality_score,
      points_cost: row.points_cost,
      created_at: row.created_at,
      updated_at: row.updated_at,
    }));
  }
}

