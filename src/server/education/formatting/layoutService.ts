/**
 * 🛠️ Layout & Formatting Service
 * إدارة الكتل والأصول والتخطيط وتصدير DOCX الحقيقي (النسخة 1.0 - الجزائر)
 */

import { db } from "@/lib/db";
import { ensureFormattingTables } from "./dbMigration";
import {
  DocumentBlock,
  DocumentAsset,
  LayoutSettings,
  LayoutIssue,
  ImageCandidateRequest,
} from "./types";
import { ImagePicker, ImagePickerResult } from "./skills/imagePicker";
import { LayoutValidators } from "./validators/layoutValidators";
import { DocxBuilder } from "./docxBuilder";

export class LayoutService {
  /**
   * جلب كتل الوثيقة مرتبة
   */
  public static getBlocks(docId: string): DocumentBlock[] {
    ensureFormattingTables();
    const rows: any[] = db
      .prepare("SELECT * FROM document_blocks WHERE doc_id = ? ORDER BY order_num ASC")
      .all(docId);

    return rows.map((r) => ({
      id: r.id,
      doc_id: r.doc_id,
      order_num: r.order_num,
      type: r.type,
      content: JSON.parse(r.content_json),
      style: r.style_json ? JSON.parse(r.style_json) : undefined,
      page_break_before: Boolean(r.page_break_before),
      keep_with_next: Boolean(r.keep_with_next),
      created_at: r.created_at,
      updated_at: r.updated_at,
    }));
  }

  /**
   * حفظ أو تحديث كتلة محددة
   */
  public static upsertBlock(
    docId: string,
    block: Omit<DocumentBlock, "doc_id" | "created_at" | "updated_at">
  ): DocumentBlock {
    ensureFormattingTables();
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO document_blocks (
        id, doc_id, order_num, type, content_json, style_json,
        page_break_before, keep_with_next, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        order_num = excluded.order_num,
        type = excluded.type,
        content_json = excluded.content_json,
        style_json = excluded.style_json,
        page_break_before = excluded.page_break_before,
        keep_with_next = excluded.keep_with_next,
        updated_at = excluded.updated_at;
    `).run(
      block.id,
      docId,
      block.order_num,
      block.type,
      JSON.stringify(block.content),
      block.style ? JSON.stringify(block.style) : null,
      block.page_break_before ? 1 : 0,
      block.keep_with_next ? 1 : 0,
      now,
      now
    );

    return {
      ...block,
      doc_id: docId,
      created_at: now,
      updated_at: now,
    };
  }

  /**
   * جلب كتلة واحدة
   */
  public static getBlock(docId: string, blockId: string): DocumentBlock | null {
    ensureFormattingTables();
    const r: any = db
      .prepare("SELECT * FROM document_blocks WHERE id = ? AND doc_id = ?")
      .get(blockId, docId);

    if (!r) return null;
    return {
      id: r.id,
      doc_id: r.doc_id,
      order_num: r.order_num,
      type: r.type,
      content: JSON.parse(r.content_json),
      style: r.style_json ? JSON.parse(r.style_json) : undefined,
      page_break_before: Boolean(r.page_break_before),
      keep_with_next: Boolean(r.keep_with_next),
      created_at: r.created_at,
      updated_at: r.updated_at,
    };
  }

  /**
   * تعديل كتلة محددة جزئياً
   */
  public static patchBlock(
    docId: string,
    blockId: string,
    updates: Partial<Omit<DocumentBlock, "id" | "doc_id" | "created_at" | "updated_at">>
  ): DocumentBlock | null {
    const existing = this.getBlock(docId, blockId);
    if (!existing) return null;

    const mergedContent = updates.content ? { ...existing.content, ...updates.content } : existing.content;
    const mergedStyle = updates.style ? { ...existing.style, ...updates.style } : existing.style;
    const order_num = updates.order_num !== undefined ? updates.order_num : existing.order_num;
    const type = updates.type || existing.type;
    const page_break_before = updates.page_break_before !== undefined ? updates.page_break_before : existing.page_break_before;
    const keep_with_next = updates.keep_with_next !== undefined ? updates.keep_with_next : existing.keep_with_next;

    return this.upsertBlock(docId, {
      id: blockId,
      order_num,
      type,
      content: mergedContent,
      style: mergedStyle,
      page_break_before,
      keep_with_next,
    });
  }

  /**
   * حذف كتلة محددة
   */
  public static deleteBlock(docId: string, blockId: string): boolean {
    ensureFormattingTables();
    const res = db
      .prepare("DELETE FROM document_blocks WHERE id = ? AND doc_id = ?")
      .run(blockId, docId);
    return res.changes > 0;
  }

  /**
   * إعادة ترتيب الكتل (سحب وإفلات)
   */
  public static reorderBlocks(docId: string, blockIdsInOrder: string[]): DocumentBlock[] {
    ensureFormattingTables();
    blockIdsInOrder.forEach((id, index) => {
      db.prepare(`
        UPDATE document_blocks SET order_num = ?, updated_at = datetime('now')
        WHERE id = ? AND doc_id = ?
      `).run(index + 1, id, docId);
    });

    return this.getBlocks(docId);
  }

  /**
   * جلب إعدادات التنسيق
   */
  public static getLayoutSettings(docId: string): LayoutSettings {
    ensureFormattingTables();
    const row: any = db.prepare("SELECT * FROM layout_settings WHERE doc_id = ?").get(docId);

    if (row) {
      return {
        doc_id: row.doc_id,
        paper: "A4",
        margins_mm: JSON.parse(row.margins_json),
        font_family: row.font_family,
        font_size_pt: row.font_size_pt,
        line_spacing: row.line_spacing,
        page_numbering: JSON.parse(row.page_numbering_json),
        header_mode: row.header_mode,
        decorative_frame: Boolean(row.decorative_frame),
        updated_at: row.updated_at,
      };
    }

    // Default settings
    return {
      doc_id: docId,
      paper: "A4",
      margins_mm: { top: 25, bottom: 25, right: 30, left: 20 }, // 30mm right binding margin
      font_family: "Traditional Arabic",
      font_size_pt: 14,
      line_spacing: 1.5,
      page_numbering: {
        position: "bottom_center",
        format_front: "abjad",
        format_body: "decimal",
        start_body_at: 1,
      },
      header_mode: "chapter_title",
      decorative_frame: false,
      updated_at: new Date().toISOString(),
    };
  }

  /**
   * تحديث إعدادات التنسيق
   */
  public static updateLayoutSettings(
    docId: string,
    updates: Partial<LayoutSettings>
  ): LayoutSettings {
    ensureFormattingTables();
    const existing = this.getLayoutSettings(docId);
    const merged: LayoutSettings = {
      ...existing,
      ...updates,
      doc_id: docId,
      updated_at: new Date().toISOString(),
    };

    db.prepare(`
      INSERT INTO layout_settings (
        doc_id, paper, margins_json, font_family, font_size_pt,
        line_spacing, page_numbering_json, header_mode, decorative_frame, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(doc_id) DO UPDATE SET
        margins_json = excluded.margins_json,
        font_family = excluded.font_family,
        font_size_pt = excluded.font_size_pt,
        line_spacing = excluded.line_spacing,
        page_numbering_json = excluded.page_numbering_json,
        header_mode = excluded.header_mode,
        decorative_frame = excluded.decorative_frame,
        updated_at = excluded.updated_at;
    `).run(
      merged.doc_id,
      merged.paper,
      JSON.stringify(merged.margins_mm),
      merged.font_family,
      merged.font_size_pt,
      merged.line_spacing,
      JSON.stringify(merged.page_numbering),
      merged.header_mode,
      merged.decorative_frame ? 1 : 0,
      merged.updated_at
    );

    return merged;
  }

  /**
   * اقتراح صور لقسم معين (image-picker)
   */
  public static async suggestImages(
    docId: string,
    request: ImageCandidateRequest
  ): Promise<ImagePickerResult> {
    ensureFormattingTables();
    const existingAssets = this.getAssets(docId);
    const result = await ImagePicker.pickImages({
      docId,
      request,
      currentFigureIndex: existingAssets.length,
    });

    // Save candidates to DB
    result.candidates.forEach((asset) => {
      db.prepare(`
        INSERT INTO document_assets (
          id, doc_id, kind, source, license, author, url, file_url,
          width_px, height_px, dpi, alt_text, caption, source_attribution,
          figure_number, section_id, status, created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          status = excluded.status;
      `).run(
        asset.id,
        asset.doc_id,
        asset.kind,
        asset.source,
        asset.license,
        asset.author,
        asset.url || null,
        asset.file_url || null,
        asset.width_px,
        asset.height_px,
        asset.dpi,
        asset.alt_text,
        asset.caption,
        asset.source_attribution,
        asset.figure_number || null,
        asset.section_id || null,
        asset.status,
        asset.created_at
      );
    });

    return result;
  }

  /**
   * جلب أصول الوثيقة
   */
  public static getAssets(docId: string): DocumentAsset[] {
    ensureFormattingTables();
    const rows: any[] = db
      .prepare("SELECT * FROM document_assets WHERE doc_id = ? ORDER BY figure_number ASC")
      .all(docId);

    return rows.map((r) => ({
      id: r.id,
      doc_id: r.doc_id,
      kind: r.kind,
      source: r.source,
      license: r.license,
      author: r.author,
      url: r.url,
      file_url: r.file_url,
      width_px: r.width_px,
      height_px: r.height_px,
      dpi: r.dpi,
      alt_text: r.alt_text,
      caption: r.caption,
      source_attribution: r.source_attribution,
      figure_number: r.figure_number,
      section_id: r.section_id,
      status: r.status,
      created_at: r.created_at,
    }));
  }

  /**
   * تشغيل فحص التنسيق والمشكلات (I01..I10 و F01..F14)
   */
  public static auditLayout(docId: string): LayoutIssue[] {
    ensureFormattingTables();
    const blocks = this.getBlocks(docId);
    const settings = this.getLayoutSettings(docId);
    const assets = this.getAssets(docId);

    const imageIssues = LayoutValidators.validateImages(assets, blocks);
    const formatIssues = LayoutValidators.validateLayout(blocks, settings);
    const allIssues = [...imageIssues, ...formatIssues];

    // حفظ المشكلات في جدول layout_issues
    db.prepare("DELETE FROM layout_issues WHERE doc_id = ?").run(docId);
    allIssues.forEach((iss) => {
      db.prepare(`
        INSERT INTO layout_issues (
          id, doc_id, code, severity, location, message, suggestion, created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        iss.id,
        iss.doc_id,
        iss.code,
        iss.severity,
        iss.location,
        iss.message,
        iss.suggestion,
        iss.created_at
      );
    });

    return allIssues;
  }

  /**
   * تصدير DOCX حقيقي ثنائي للوثيقة
   */
  public static async exportDocx(docId: string, title: string): Promise<Buffer> {
    const blocks = this.getBlocks(docId);
    const settings = this.getLayoutSettings(docId);
    const assets = this.getAssets(docId);

    return DocxBuilder.buildDocxBuffer({
      title,
      settings,
      blocks,
      assets,
    });
  }
}
