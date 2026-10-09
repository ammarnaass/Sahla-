/**
 * 🗄️ Database Tables Migration for Assets, Document Blocks, and Layout Settings
 * مواصفة الصور والترقيم والتنسيق (النسخة 1.0 - الجزائر)
 */

import { db } from "@/lib/db";

let isLayoutMigrated = false;

export function ensureFormattingTables(): void {
  if (isLayoutMigrated) return;

  try {
    // 1. جدول أصول الصور والرسوم (Assets)
    db.prepare(`
      CREATE TABLE IF NOT EXISTS document_assets (
        id TEXT PRIMARY KEY,
        doc_id TEXT NOT NULL,
        kind TEXT NOT NULL,
        source TEXT NOT NULL,
        license TEXT NOT NULL,
        author TEXT NOT NULL,
        url TEXT,
        file_url TEXT,
        width_px INTEGER DEFAULT 800,
        height_px INTEGER DEFAULT 600,
        dpi INTEGER DEFAULT 300,
        alt_text TEXT NOT NULL,
        caption TEXT NOT NULL,
        source_attribution TEXT NOT NULL,
        figure_number INTEGER,
        section_id TEXT,
        status TEXT DEFAULT 'candidate',
        created_at TEXT DEFAULT (datetime('now'))
      );
    `).run();

    // 2. جدول كتل الوثيقة (Document Blocks)
    db.prepare(`
      CREATE TABLE IF NOT EXISTS document_blocks (
        id TEXT PRIMARY KEY,
        doc_id TEXT NOT NULL,
        order_num INTEGER NOT NULL,
        type TEXT NOT NULL,
        content_json TEXT NOT NULL,
        style_json TEXT,
        page_break_before INTEGER DEFAULT 0,
        keep_with_next INTEGER DEFAULT 0,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      );
    `).run();

    // 3. جدول إعدادات التخطيط والترقيم (Layout Settings)
    db.prepare(`
      CREATE TABLE IF NOT EXISTS layout_settings (
        doc_id TEXT PRIMARY KEY,
        paper TEXT DEFAULT 'A4',
        margins_json TEXT NOT NULL,
        font_family TEXT DEFAULT 'Traditional Arabic',
        font_size_pt REAL DEFAULT 14,
        line_spacing REAL DEFAULT 1.5,
        page_numbering_json TEXT NOT NULL,
        header_mode TEXT DEFAULT 'chapter_title',
        decorative_frame INTEGER DEFAULT 0,
        updated_at TEXT DEFAULT (datetime('now'))
      );
    `).run();

    // 4. جدول مشكلات وتنبيهات التنسيق (Layout Issues)
    db.prepare(`
      CREATE TABLE IF NOT EXISTS layout_issues (
        id TEXT PRIMARY KEY,
        doc_id TEXT NOT NULL,
        code TEXT NOT NULL,
        severity TEXT NOT NULL,
        location TEXT NOT NULL,
        message TEXT NOT NULL,
        suggestion TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now'))
      );
    `).run();

    isLayoutMigrated = true;
  } catch (err: any) {
    console.error("[FormattingDB] migration error:", err?.message);
  }
}
