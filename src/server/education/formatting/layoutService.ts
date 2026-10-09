/**
 * 🛠️ Layout & Formatting Service
 * إدارة الكتل والأصول والتخطيط وتصدير DOCX الحقيقي وPDF (النسخة 1.0 - الجزائر)
 */

import { db } from "@/lib/db";
import { ensureFormattingTables } from "./dbMigration";
import {
  DocumentBlock,
  DocumentAsset,
  LayoutSettings,
  LayoutIssue,
  ImageCandidateRequest,
  ExportOptions,
} from "./types";
import { ImagePicker, ImagePickerResult } from "./skills/imagePicker";
import { LayoutValidators } from "./validators/layoutValidators";
import { DocxBuilder } from "./docxBuilder";
import { PdfConverter, PdfConversionResult } from "./pdfConverter";

export class LayoutService {
  /**
   * جلب كتل الوثيقة مرتبة مع تهيئة آلية إن لم تكن موجودة
   */
  public static getBlocks(docId: string): DocumentBlock[] {
    ensureFormattingTables();
    const rows: any[] = db
      .prepare("SELECT * FROM document_blocks WHERE doc_id = ? ORDER BY order_num ASC")
      .all(docId);

    if (rows.length === 0) {
      // Auto initialize blocks from research_docs or documents
      const initBlocks = this.initializeBlocksFromDoc(docId);
      if (initBlocks.length > 0) {
        return initBlocks;
      }
    }

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
   * تهيئة الكتل تلقائياً من بيانات البحث إن لم تكن مخزنة مسبقاً
   */
  public static initializeBlocksFromDoc(docId: string): DocumentBlock[] {
    ensureFormattingTables();
    let docRow: any = null;

    try {
      docRow = db.prepare("SELECT * FROM research_docs WHERE id = ?").get(docId);
    } catch {
      // Ignore if table doesn't exist yet
    }

    if (!docRow) {
      try {
        const dRow: any = db.prepare("SELECT * FROM documents WHERE id = ?").get(docId);
        if (dRow && dRow.data_snapshot) {
          const snap = JSON.parse(dRow.data_snapshot);
          docRow = {
            id: docId,
            title: dRow.title,
            student_name: dRow.customer_name,
            content_json: JSON.stringify({ sections: snap.sections || [] }),
            references_json: JSON.stringify(snap.references || []),
          };
        }
      } catch {
        // Ignore
      }
    }

    const blocks: DocumentBlock[] = [];
    const now = new Date().toISOString();
    let order = 1;

    // 1. الغلاف
    const title = docRow?.title || "بحث علمي وأكاديمي";
    blocks.push({
      id: `b_${docId}_cover`,
      doc_id: docId,
      order_num: order++,
      type: "cover",
      content: {
        text: title,
        caption: docRow?.student_name || "إعداد الطالب",
      },
      created_at: now,
      updated_at: now,
    });

    // 2. الفصول والأقسام
    if (docRow && docRow.content_json) {
      try {
        const parsed = JSON.parse(docRow.content_json);
        const sections: any[] = parsed.sections || [];

        sections.forEach((sec, sIdx) => {
          // عنوان الفصل
          blocks.push({
            id: `b_${docId}_h_${sIdx}`,
            doc_id: docId,
            order_num: order++,
            type: "heading",
            content: {
              text: sec.title || `المبحث ${sIdx + 1}`,
              level: 1,
            },
            page_break_before: sIdx > 0,
            keep_with_next: true,
            created_at: now,
            updated_at: now,
          });

          // محتوى الفقرات
          if (sec.content) {
            const rawParas = String(sec.content)
              .split(/\n\n+|<p>|<\/p>/)
              .map((p) => p.trim())
              .filter((p) => p.length > 0 && !p.startsWith("<") && !p.endsWith(">"));

            rawParas.forEach((pText, pIdx) => {
              blocks.push({
                id: `b_${docId}_p_${sIdx}_${pIdx}`,
                doc_id: docId,
                order_num: order++,
                type: "paragraph",
                content: { text: pText },
                created_at: now,
                updated_at: now,
              });
            });
          }
        });
      } catch (err: any) {
        console.warn("[LayoutService] Error parsing content_json for doc:", docId, err?.message);
      }
    }

    // 3. المراجع إن وجدت
    if (docRow && docRow.references_json) {
      try {
        const refs: string[] = JSON.parse(docRow.references_json);
        if (Array.isArray(refs) && refs.length > 0) {
          blocks.push({
            id: `b_${docId}_ref_h`,
            doc_id: docId,
            order_num: order++,
            type: "heading",
            content: { text: "قائمة المصادر والمراجع", level: 1 },
            page_break_before: true,
            keep_with_next: true,
            created_at: now,
            updated_at: now,
          });

          blocks.push({
            id: `b_${docId}_ref_list`,
            doc_id: docId,
            order_num: order++,
            type: "list",
            content: { list_items: refs, is_ordered: true },
            created_at: now,
            updated_at: now,
          });
        }
      } catch {
        // Ignore
      }
    }

    // If blocks were generated, persist them to SQLite
    if (blocks.length > 0) {
      blocks.forEach((b) => {
        this.upsertBlock(docId, b);
      });
    }

    return blocks;
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
      this.saveAsset(asset);
    });

    return result;
  }

  /**
   * حفظ أو تحديث أصل صورة
   */
  public static saveAsset(asset: DocumentAsset): DocumentAsset {
    ensureFormattingTables();
    db.prepare(`
      INSERT INTO document_assets (
        id, doc_id, kind, source, license, author, url, file_url,
        width_px, height_px, dpi, alt_text, caption, source_attribution,
        figure_number, section_id, status, created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        status = excluded.status,
        file_url = excluded.file_url,
        caption = excluded.caption,
        figure_number = excluded.figure_number;
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

    return asset;
  }

  /**
   * اعتماد صورة مختارة من قبل المستخدم وربطها بالكتلة
   */
  public static selectAsset(docId: string, assetId: string, blockId?: string): DocumentAsset | null {
    ensureFormattingTables();
    const assetRow: any = db.prepare("SELECT * FROM document_assets WHERE id = ? AND doc_id = ?").get(assetId, docId);
    if (!assetRow) return null;

    // Unselect other candidates in same section
    if (assetRow.section_id) {
      db.prepare(`
        UPDATE document_assets SET status = 'candidate'
        WHERE doc_id = ? AND section_id = ? AND status = 'selected'
      `).run(docId, assetRow.section_id);
    }

    // Set this one as selected
    db.prepare("UPDATE document_assets SET status = 'selected' WHERE id = ?").run(assetId);

    // If blockId provided, bind to that block
    if (blockId) {
      this.patchBlock(docId, blockId, {
        content: {
          asset_id: assetId,
          figure_number: assetRow.figure_number,
          caption: assetRow.caption,
          source_attribution: assetRow.source_attribution,
        },
      });
    }

    const updated = this.getAssets(docId).find((a) => a.id === assetId);
    return updated || null;
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
   * التطبيق التلقائي لحلول مشكلات التنسيق الشائعة (Auto-fix)
   */
  public static autoFixIssues(docId: string): { fixedCount: number; remainingIssues: LayoutIssue[] } {
    const issues = this.auditLayout(docId);
    let fixedCount = 0;

    const blocks = this.getBlocks(docId);
    const settings = this.getLayoutSettings(docId);

    for (const iss of issues) {
      if (iss.code === "F05") {
        // اجعل العناوين الرئيسية تبدأ بصفحة جديدة
        blocks
          .filter((b) => b.type === "heading" && b.content.level === 1)
          .forEach((b) => {
            if (!b.page_break_before) {
              this.patchBlock(docId, b.id, { page_break_before: true });
              fixedCount++;
            }
          });
      } else if (iss.code === "F06") {
        // حماية العناوين بخاصية keep_with_next
        blocks
          .filter((b) => b.type === "heading")
          .forEach((b) => {
            if (!b.keep_with_next) {
              this.patchBlock(docId, b.id, { keep_with_next: true });
              fixedCount++;
            }
          });
      } else if (iss.code === "F07") {
        // حماية الأشكال بتعليقها
        blocks
          .filter((b) => b.type === "figure")
          .forEach((b) => {
            if (!b.keep_with_next) {
              this.patchBlock(docId, b.id, { keep_with_next: true });
              fixedCount++;
            }
          });
      } else if (iss.code === "F09") {
        // حذف الفواصل المتتالية
        for (let i = 0; i < blocks.length - 1; i++) {
          if (blocks[i].page_break_before && blocks[i + 1].page_break_before) {
            this.patchBlock(docId, blocks[i + 1].id, { page_break_before: false });
            fixedCount++;
          }
        }
      } else if (iss.code === "F02") {
        // ضبط بداية الترقيم
        this.updateLayoutSettings(docId, {
          page_numbering: {
            ...settings.page_numbering,
            start_body_at: 1,
          },
        });
        fixedCount++;
      } else if (iss.code === "F12") {
        // ضبط هامش التجليد 30 مم
        this.updateLayoutSettings(docId, {
          margins_mm: {
            ...settings.margins_mm,
            right: 30,
          },
        });
        fixedCount++;
      }
    }

    const remaining = this.auditLayout(docId);
    return { fixedCount, remainingIssues: remaining };
  }

  /**
   * تصدير DOCX حقيقي ثنائي للوثيقة
   */
  public static async exportDocx(
    docId: string,
    title?: string,
    options?: Partial<ExportOptions>
  ): Promise<Buffer> {
    const blocks = this.getBlocks(docId);
    const settings = this.getLayoutSettings(docId);
    const assets = this.getAssets(docId);

    const docTitle = title || blocks.find((b) => b.type === "cover")?.content.text || "بحث أكاديمي";

    return DocxBuilder.buildDocxBuffer({
      title: docTitle,
      settings,
      blocks,
      assets,
      coverData: options?.cover_data,
      includeFiguresList: options?.include_figures_list ?? true,
      includeTablesList: options?.include_tables_list ?? true,
    });
  }

  /**
   * تصدير PDF رسمي عبر محرك LibreOffice Headless
   */
  public static async exportPdf(
    docId: string,
    title?: string,
    options?: Partial<ExportOptions>
  ): Promise<PdfConversionResult> {
    const docxBuf = await this.exportDocx(docId, title, options);
    return PdfConverter.convertDocxToPdf(docxBuf, docId);
  }
}
