/**
 * 🗄️ Thesis Studio Database Schema & Migrations
 * إنشاء وتحديث جداول استوديو مذكرات التخرج في قاعدة بيانات prisma/sahla.db
 */

import { db } from "@/lib/db";

let isMigrated = false;

export function ensureThesisStudioTables(): void {
  if (isMigrated) return;

  try {
    // 1. جدول ملفات المؤسسات (Institution Profiles)
    db.prepare(`
      CREATE TABLE IF NOT EXISTS institution_profiles (
        profile_id TEXT PRIMARY KEY,
        institution_name TEXT NOT NULL,
        faculty TEXT NOT NULL,
        department TEXT,
        degree TEXT NOT NULL,
        degree_title_ar TEXT NOT NULL,
        language TEXT DEFAULT 'ar',
        cover_json TEXT NOT NULL,
        front_matter_json TEXT NOT NULL,
        structure_json TEXT NOT NULL,
        pages_min INTEGER DEFAULT 60,
        pages_max INTEGER DEFAULT 100,
        citation_style TEXT DEFAULT 'APA7',
        format_json TEXT NOT NULL,
        is_verified INTEGER DEFAULT 1,
        notes TEXT,
        created_at TEXT DEFAULT (datetime('now'))
      );
    `).run();

    // 2. جدول مشاريع المذكرات (Theses Projects)
    db.prepare(`
      CREATE TABLE IF NOT EXISTS theses (
        id TEXT PRIMARY KEY,
        shop_id TEXT NOT NULL,
        profile_id TEXT NOT NULL,
        title TEXT NOT NULL,
        clean_title TEXT,
        student_name TEXT NOT NULL,
        supervisor_name TEXT NOT NULL,
        jury_members_json TEXT,
        university TEXT NOT NULL,
        faculty TEXT NOT NULL,
        department TEXT,
        specialty TEXT NOT NULL,
        degree TEXT NOT NULL,
        language TEXT DEFAULT 'ar',
        academic_year TEXT NOT NULL,
        type TEXT DEFAULT 'THEORETICAL',
        target_pages INTEGER DEFAULT 60,
        citation_style TEXT DEFAULT 'APA7',
        methodology_type TEXT DEFAULT 'descriptive_analytical',
        has_dataset INTEGER DEFAULT 0,
        dataset_filename TEXT,
        teacher_requirements TEXT,
        status TEXT DEFAULT 'draft',
        quality_score REAL,
        points_cost INTEGER DEFAULT 40,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      );
    `).run();

    // 3. جدول خطط المذكرات (Thesis Plans)
    db.prepare(`
      CREATE TABLE IF NOT EXISTS thesis_plans (
        id TEXT PRIMARY KEY,
        thesis_id TEXT NOT NULL UNIQUE,
        title TEXT NOT NULL,
        problem TEXT NOT NULL,
        sub_questions_json TEXT NOT NULL,
        hypotheses_json TEXT NOT NULL,
        methodology_json TEXT NOT NULL,
        chapters_json TEXT NOT NULL,
        total_target_pages INTEGER DEFAULT 60,
        summary_ar TEXT,
        is_approved INTEGER DEFAULT 0,
        approved_at TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (thesis_id) REFERENCES theses(id) ON DELETE CASCADE
      );
    `).run();

    // 4. جدول المصادر والمراجع المعتمدة (Sources S1..Sn)
    db.prepare(`
      CREATE TABLE IF NOT EXISTS thesis_sources (
        id TEXT NOT NULL, -- S1, S2, etc.
        thesis_id TEXT NOT NULL,
        chapter_id TEXT,
        title TEXT NOT NULL,
        authors_json TEXT NOT NULL,
        year INTEGER NOT NULL,
        publisher_or_journal TEXT NOT NULL,
        url TEXT,
        doi TEXT,
        status TEXT DEFAULT 'verified',
        credibility_score REAL DEFAULT 0.85,
        source_type TEXT DEFAULT 'asjp',
        accessed_at TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        PRIMARY KEY (thesis_id, id),
        FOREIGN KEY (thesis_id) REFERENCES theses(id) ON DELETE CASCADE
      );
    `).run();

    // 5. جدول أوراق الحقائق (Fact Sheets)
    db.prepare(`
      CREATE TABLE IF NOT EXISTS thesis_fact_sheets (
        id TEXT PRIMARY KEY,
        thesis_id TEXT NOT NULL,
        chapter_id TEXT NOT NULL,
        facts_json TEXT NOT NULL,
        gaps_json TEXT,
        queries_used_json TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (thesis_id) REFERENCES theses(id) ON DELETE CASCADE
      );
    `).run();

    // 6. جدول فصول المذكرة المكتوبة (Thesis Chapters)
    db.prepare(`
      CREATE TABLE IF NOT EXISTS thesis_chapters (
        id TEXT PRIMARY KEY,
        thesis_id TEXT NOT NULL,
        chapter_id TEXT NOT NULL,
        title TEXT NOT NULL,
        content_json TEXT NOT NULL,
        word_count INTEGER DEFAULT 0,
        page_count_estimate INTEGER DEFAULT 0,
        status TEXT DEFAULT 'draft',
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (thesis_id) REFERENCES theses(id) ON DELETE CASCADE
      );
    `).run();

    // 7. جدول مجموعات البيانات المرفوعة للتحليل (Datasets)
    db.prepare(`
      CREATE TABLE IF NOT EXISTS thesis_datasets (
        id TEXT PRIMARY KEY,
        thesis_id TEXT NOT NULL,
        filename TEXT NOT NULL,
        file_path TEXT,
        file_size INTEGER DEFAULT 0,
        row_count INTEGER DEFAULT 0,
        column_count INTEGER DEFAULT 0,
        schema_json TEXT,
        uploaded_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (thesis_id) REFERENCES theses(id) ON DELETE CASCADE
      );
    `).run();

    // 8. جدول تشغيل التحليل الإحصائي (Analysis Runs)
    db.prepare(`
      CREATE TABLE IF NOT EXISTS thesis_analysis_runs (
        id TEXT PRIMARY KEY,
        thesis_id TEXT NOT NULL,
        dataset_id TEXT NOT NULL,
        tests_executed_json TEXT NOT NULL,
        results_json TEXT NOT NULL,
        charts_json TEXT,
        executed_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (thesis_id) REFERENCES theses(id) ON DELETE CASCADE
      );
    `).run();

    // 9. جدول تقارير الجودة والمطابقة T01-T16 (Quality Reports)
    db.prepare(`
      CREATE TABLE IF NOT EXISTS thesis_quality_reports (
        id TEXT PRIMARY KEY,
        thesis_id TEXT NOT NULL UNIQUE,
        score REAL NOT NULL,
        passed INTEGER DEFAULT 0,
        checks_json TEXT NOT NULL,
        verified_sources_ratio REAL DEFAULT 1.0,
        unattributed_claims_ratio REAL DEFAULT 0.0,
        stats_accuracy_ratio REAL DEFAULT 1.0,
        evaluated_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (thesis_id) REFERENCES theses(id) ON DELETE CASCADE
      );
    `).run();

    isMigrated = true;
  } catch (err: any) {
    console.error("[ThesisStudio] DB migration error:", err?.message);
  }
}
