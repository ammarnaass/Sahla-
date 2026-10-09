import { NextRequest, NextResponse } from "next/server";
import { LayoutService } from "@/server/education/formatting/layoutService";
import { ImageProcessor } from "@/server/education/formatting/skills/imageProcessor";
import { DocumentAsset } from "@/server/education/formatting/types";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const contentType = req.headers.get("content-type") || "";

    let fileDataUrl = "";
    let caption = "صورة مرفوعة من قبل الباحث";
    let altText = "صورة توضيحية من إعداد الباحث";
    let sectionId = "sec_main";
    let blockId: string | undefined = undefined;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      if (!file) {
        return NextResponse.json({ error: "لم يتم إرسال أي ملف صورة" }, { status: 400 });
      }

      caption = (formData.get("caption") as string) || file.name || caption;
      altText = (formData.get("alt_text") as string) || caption;
      sectionId = (formData.get("section_id") as string) || sectionId;
      blockId = (formData.get("block_id") as string) || undefined;

      const buffer = Buffer.from(await file.arrayBuffer());
      fileDataUrl = `data:${file.type || "image/png"};base64,${buffer.toString("base64")}`;
    } else {
      const json = await req.json();
      if (!json || !json.data_url) {
        return NextResponse.json({ error: "حقل data_url مطلوب للصورة" }, { status: 400 });
      }
      fileDataUrl = json.data_url;
      caption = json.caption || caption;
      altText = json.alt_text || caption;
      sectionId = json.section_id || sectionId;
      blockId = json.block_id || undefined;
    }

    const rawBuffer = await ImageProcessor.fetchImageBuffer(fileDataUrl);
    const info = ImageProcessor.inspectImage(rawBuffer);

    const existingAssets = LayoutService.getAssets(id);
    const figNum = existingAssets.length + 1;

    const newAsset: DocumentAsset = {
      id: `a_user_${Date.now()}`,
      doc_id: id,
      kind: "user_upload",
      source: "user",
      license: "User Owned (إقرار الباحث)",
      author: "الباحث / المستخدم",
      file_url: fileDataUrl,
      width_px: info.width,
      height_px: info.height,
      dpi: 300,
      alt_text: altText,
      caption: caption,
      source_attribution: "تصوير / إعداد الباحث نفسه",
      figure_number: figNum,
      section_id: sectionId,
      status: "selected",
      created_at: new Date().toISOString(),
    };

    LayoutService.saveAsset(newAsset);

    if (blockId) {
      LayoutService.selectAsset(id, newAsset.id, blockId);
    }

    return NextResponse.json({
      success: true,
      asset: newAsset,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "فشل رفع الصورة ومعالجتها" },
      { status: 500 }
    );
  }
}
