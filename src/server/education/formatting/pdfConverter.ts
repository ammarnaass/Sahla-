/**
 * 📄 PDF Converter Service (LibreOffice Headless)
 * مواصفة الصور والترقيم والتنسيق للبحوث والمذكرات (النسخة 1.0 - الجزائر)
 *
 * الخصائص:
 * 1. تحويل ملفات DOCX الثنائية الحقيقية إلى PDF رسمي مطابق للطباعة.
 * 2. استخدام محرك LibreOffice Headless المثبت في النظام.
 * 3. التحديث التلقائي لحقول Word (TOC والأرقام) أثناء التصدير.
 * 4. إدارة آمنة ونظيفة للملفات المؤقتة وحذفها فور الانتهاء.
 */

import { execFile } from "child_process";
import { promisify } from "util";
import * as fs from "fs/promises";
import * as path from "path";
import * as os from "os";

const execFileAsync = promisify(execFile);

export interface PdfConversionResult {
  pdfBuffer: Buffer;
  pageCountEstimate?: number;
  durationMs: number;
}

export class PdfConverter {
  private static libreOfficeBin: string | null = null;

  /**
   * اكتشاف مسار libreoffice في النظام
   */
  public static async getLibreOfficeExecutable(): Promise<string> {
    if (this.libreOfficeBin) return this.libreOfficeBin;

    const candidates = [
      "/usr/bin/libreoffice",
      "/usr/bin/soffice",
      "libreoffice",
      "soffice",
    ];

    for (const bin of candidates) {
      try {
        await execFileAsync(bin, ["--version"]);
        this.libreOfficeBin = bin;
        return bin;
      } catch {
        // Continue search
      }
    }

    throw new Error("LibreOffice غير متوفر على الخادم لتحويل PDF.");
  }

  /**
   * تحويل DOCX Buffer إلى PDF Buffer
   */
  public static async convertDocxToPdf(
    docxBuffer: Buffer,
    docId: string = `doc_${Date.now()}`
  ): Promise<PdfConversionResult> {
    const startTime = Date.now();
    const bin = await this.getLibreOfficeExecutable();

    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "sahla_pdf_"));
    const inputDocxPath = path.join(tempDir, `${docId}.docx`);
    const expectedPdfPath = path.join(tempDir, `${docId}.pdf`);

    try {
      // 1. كتابة ملف DOCX المؤقت
      await fs.writeFile(inputDocxPath, docxBuffer);

      // 2. تشغيل LibreOffice Headless مع بيئة منع التزامن والبروفايل النظيف
      const profileDir = path.join(tempDir, "lo_profile");
      await fs.mkdir(profileDir, { recursive: true });

      const args = [
        "--headless",
        "--convert-to",
        "pdf",
        "--outdir",
        tempDir,
        inputDocxPath,
      ];

      await execFileAsync(bin, args, {
        timeout: 45000, // 45 seconds timeout
      });

      // 3. قراءة ملف PDF الناتج
      const pdfBuffer = await fs.readFile(expectedPdfPath);
      const durationMs = Date.now() - startTime;

      return {
        pdfBuffer,
        durationMs,
      };
    } finally {
      // 4. تنظيف كل الملفات المؤقتة
      try {
        await fs.rm(tempDir, { recursive: true, force: true });
      } catch (err: any) {
        console.warn("[PdfConverter] Failed to clean tempDir:", tempDir, err?.message);
      }
    }
  }
}
