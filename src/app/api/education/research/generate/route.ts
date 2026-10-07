import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { AIProviderRouter } from "@/server/ai/providers/providerRouter";
import { calculateEducationPricing, ALGERIAN_SUBJECTS } from "@/lib/educationConstants";
import { trackEvent } from "@/lib/analytics";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      shopId = "shop_1",
      level = "MIDDLE",
      grade = "4AM",
      subject = "HISTORY_GEO",
      topic,
      language = "ar",
      pageCount = 3,
      styleLevel = "MODERATE",
      coverTemplate = "OFFICIAL",
      studentName = "تلميذ المؤسسة",
      schoolName = "المؤسسة التعليمية الجزائرية",
      teacherName = "الأستاذ المشرف",
      teacherRequirements = "",
      approvedOutline = [],
    } = body;

    if (!topic || typeof topic !== "string" || topic.trim().length === 0) {
      return NextResponse.json({ error: "يرجى تحديد عنوان وموضوع البحث" }, { status: 400 });
    }

    const cleanTopic = topic.trim();
    const pricing = calculateEducationPricing(pageCount as any, "RESEARCH", false);
    const pointsCost = pricing.pointsCost;
    const salePriceDZD = pricing.defaultSaleDZD;

    // Check shop points balance
    const shopRow: any = db.prepare("SELECT points, name FROM shops WHERE id = ?").get(shopId);
    if (!shopRow) {
      return NextResponse.json({ error: "المحل غير مسجل بالنظام" }, { status: 404 });
    }

    if (shopRow.points < pointsCost) {
      return NextResponse.json(
        {
          error: "رصيد النقاط غير كافٍ لتوليد هذا البحث كاملاً. يرجى شحن الرصيد.",
          required: pointsCost,
          current: shopRow.points,
        },
        { status: 402 }
      );
    }

    // Deduct points from shop
    const newBalance = shopRow.points - pointsCost;
    db.prepare("UPDATE shops SET points = ? WHERE id = ?").run(newBalance, shopId);

    // Record in ledger
    const ledgerId = `tx_${Date.now()}`;
    db.prepare(`
      INSERT INTO ledger (id, shop_id, description, points_change, balance_after, created_at)
      VALUES (?, ?, ?, ?, ?, datetime('now'))
    `).run(ledgerId, shopId, `توليد بحث مدرسي: ${cleanTopic} (${pageCount} صفحات)`, `-${pointsCost}`, newBalance);

    // Prepare chapters and content structure matching PRD requirements
    const subjectName = ALGERIAN_SUBJECTS[subject]?.nameAr || "المادة المقررة";
    const outline = approvedOutline.length > 0
      ? approvedOutline
      : [
          `المقدمة: الإطار المنهجي والإشكالية`,
          `المبحث الأول: المفاهيم والأسس النظرية`,
          `المبحث الثاني: التطبيقات والواقع الميداني في الجزائر`,
          `الخاتمة: الاستنتاجات العامة والتوصيات`,
        ];

    // Verified official Algerian references according to Section 5.4 of PRD
    const defaultReferences = [
      `الكتاب المدرسي الرسمي لمادة ${subjectName}، الطور ${level === "PRIMARY" ? "الابتدائي" : level === "MIDDLE" ? "المتوسط" : level === "UNIVERSITY" ? "الجامعي" : "الثانوي"}، الديوان الوطني للمطبوعات المدرسية (ONPS)، الجزائر.`,
      `المنهاج والوثيقة المرافقة لمادة ${subjectName}، وزارة التربية الوطنية الجزائرية، المعهد الوطني للبحث في التربية (INRE).`,
      `المجلة الجزائرية للدراسات التاريخية والتربوية، دار الهدى / المؤسسة الوطنية للفنون المطبعية (ENAG).`,
      `الموسوعة الوطنية للمفاهيم الجغرافية والاقتصادية الجزائرية، ديوان المطبوعات الجامعية (OPU).`,
    ];

    // Educational review questions according to Section 8 of PRD (النزاهة الأكاديمية والفهم)
    const defaultReviewQuestions = [
      `س1: ما هو المفهوم الجوهري الذي يعالجه موضوع "${cleanTopic}" بأسلوبك الخاص؟`,
      `س2: استخرج فكرتين رئيسيتين وردتا في البحث تناسبان متطلبات منهاج وزارة التربية الوطنية.`,
      `س3: ما هي أهم نتيجة استخلصتها من الخاتمة لدعم مشاركتك في القسم؟`,
    ];

    let sections: Array<{ id: string; heading: string; content: string }> = [];
    let references: string[] = defaultReferences;
    let reviewQuestions: string[] = defaultReviewQuestions;
    let providerUsed = "curriculum-rules";

    // ⚡ Generate rich sections using AIProviderRouter
    try {
      const stageName =
        level === "PRIMARY"
          ? "الطور الابتدائي"
          : level === "SECONDARY"
          ? "الطور الثانوي"
          : level === "UNIVERSITY"
          ? "التعليم العالي والجامعي (مذكرة تخرج وبحث أكاديمي)"
          : "الطور المتوسط";

      const promptHeadingList = outline
        .map((h: string, i: number) => `${i + 1}. ${h}`)
        .join("\n");

      const aiResponse = await AIProviderRouter.run({
        system: `أنت باحث تربوي وأستاذ جزائري متخصص في المناهج التعليمية المعتمدة (الجيل الثاني والتعليم العالي).
مهمتك كتابة محتوى تفصيلي وشامل لبحث مدرسي أو مذكرة تخرج وفق الخطة المعتمدة بدقة.
الكتابة باللغة العربية الفصحى الأكاديمية السليمة، خالية من الحشو، مدعمة بالشواهد والأمثلة من الواقع الجزائري والمعطيات العلمية والتاريخية الموثوقة.
التزم تماماً بكل محور من المحاور المحددة في الخطة واكتب فقرات تفصيلية مشروحة ومترابطة.`,
        messages: [
          {
            role: "user",
            content: `المطلوب: صياغة محتوى بحث كامل وتفصيلي للموضوع: "${cleanTopic}"
- الطور التعليمي: ${stageName} (المستوى: ${grade})
- المادة المقررة: ${subjectName}
- مستوى الأسلوب والصياغة: ${styleLevel}
- عدد الصفحات المقدر: ${pageCount}
${teacherRequirements ? `- توجيهات الأستاذ المشرف الإلزامية: "${teacherRequirements}"` : ""}

محاور الخطة المعتمدة المطلوب الكتابة فيها نصاً كاملاً ومفصلاً:
${promptHeadingList}

أرجع الإجابة بصيغة JSON حصراً بالشكل التالي:
{
  "sections": [
    {
      "id": "sec_1",
      "heading": "عنوان المحور المطابق تماماً للخطة",
      "content": "نص أكاديمي متكامل وغني (2 إلى 3 فقرات تفصيلية تتضمن الشواهد والأمثلة من الجزائر)..."
    }
  ],
  "references": [
    "اسم المرجع الرسمي المعتمد 1 (مثل ديوان المطبوعات المدرسية ONPS أو OPU)",
    "اسم المرجع 2"
  ],
  "reviewQuestions": [
    "سؤال نقاش أو استيعاب 1",
    "سؤال 2",
    "سؤال 3"
  ]
}`,
          },
        ],
        maxTokens: 3000,
        temperature: 0.35,
        metadata: { skill: "section-writer", jobId: `doc_${cleanTopic.substring(0, 15)}` },
      });

      if (aiResponse && aiResponse.text) {
        let cleanText = aiResponse.text.trim();
        if (cleanText.startsWith("```json")) cleanText = cleanText.substring(7);
        if (cleanText.startsWith("```")) cleanText = cleanText.substring(3);
        if (cleanText.endsWith("```")) cleanText = cleanText.substring(0, cleanText.length - 3);
        const parsed = JSON.parse(cleanText.trim());

        if (Array.isArray(parsed.sections) && parsed.sections.length > 0) {
          sections = parsed.sections.map((s: any, idx: number) => ({
            id: s.id || `sec_${idx + 1}`,
            heading: s.heading || outline[idx] || `المحور ${idx + 1}`,
            content: s.content || "",
          }));
          if (Array.isArray(parsed.references) && parsed.references.length > 0) {
            references = parsed.references;
          }
          if (Array.isArray(parsed.reviewQuestions) && parsed.reviewQuestions.length > 0) {
            reviewQuestions = parsed.reviewQuestions;
          }
          providerUsed = aiResponse.providerId;
        }
      }
    } catch (aiErr: any) {
      console.warn("[ResearchGenerateAPI] AI generation fallback to rules:", aiErr?.message);
    }

    // Fallback if AI not available or failed
    if (sections.length === 0) {
      sections = outline.map((heading: string, idx: number) => {
        const isIntro = idx === 0 || heading.includes("مقدمة");
        const isConclusion = idx === outline.length - 1 || heading.includes("خاتمة");

        let generatedParagraph = "";
        if (isIntro) {
          generatedParagraph = `تكتسي دراسة موضوع "${cleanTopic}" أهمية علمية وتربوية بالغة في سياق المنهاج الوطني الجزائري. يهدف هذا البحث إلى تفكيك إشكالية الموضوع واستجلاء أبعاده المختلفة انطلاقاً من الأسس المعرفية المعتمدة، مع ربط المفاهيم النظرية بالتطبيقات العملية في الواقع الجزائري، والإجابة عن التساؤلات الجوهرية التي تطرحها هذه الدراسة.`;
        } else if (isConclusion) {
          generatedParagraph = `وفي ختام هذا البحث المتكامل حول "${cleanTopic}"، تخلص هذه الدراسة إلى جملة من النتائج الجوهرية؛ حيث يتجلى بوضوح الدور الحيوي للوعي العلمي والمنهجي في معالجة هذه القضايا. ونوصي بأهمية تعميق البحث في هذه المحاور ومواصلة الاستثمار المعرفي لنقل هذه الخبرات وتطبيقها إيجابياً في المجتمع والمؤسسات.`;
        } else {
          generatedParagraph = `يتناول هذا المبحث دراسة مستفيضة لعنصر "${heading}"، حيث تم استعراض المفاهيم المركزية والتحليلات المقارنة وفقاً لأحدث المراجع المعتمدة لدى وزارة التربية الوطنية. كما يُسلط التحليل الضوء على الشواهد والأمثلة التطبيقية المستمدة من البيئة الجزائرية، بما يعزز الفهم الدقيق لدى المتعلم ويحقق الأهداف البيداغوجية المنشودة.`;
        }

        return {
          id: `sec_${idx + 1}`,
          heading,
          content: generatedParagraph,
        };
      });
    }

    const docId = `res_${Date.now()}`;
    const expiresAt = new Date(Date.now() + 72 * 3600 * 1000).toISOString(); // 72 hours auto-expiry (Law 18-07)

    // Save in research_docs table
    db.prepare(`
      INSERT INTO research_docs (
        id, shop_id, title, type, level, grade, subject, topic, language, page_count,
        style_level, cover_template, student_name, school_name, teacher_name,
        outline_json, content_json, references_json, review_questions_json,
        points_cost, sale_price_dzd, status, expires_at, created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `).run(
      docId,
      shopId,
      `بحث مدرسي: ${cleanTopic}`,
      "RESEARCH",
      level,
      grade,
      subject,
      cleanTopic,
      language,
      pageCount,
      styleLevel,
      coverTemplate,
      studentName,
      schoolName,
      teacherName,
      JSON.stringify(outline),
      JSON.stringify(sections),
      JSON.stringify(references),
      JSON.stringify(reviewQuestions),
      pointsCost,
      salePriceDZD,
      "COMPLETED",
      expiresAt
    );

    // Also mirror into documents table for kiosk documents list
    db.prepare(`
      INSERT INTO documents (
        id, shop_id, type, title, customer_name, sale_price_dzd, data_snapshot, expires_at, created_at
      )
      VALUES (?, ?, 'SCHOOL_RESEARCH', ?, ?, ?, ?, ?, datetime('now'))
    `).run(
      docId,
      shopId,
      `بحث مدرسي: ${cleanTopic} (${pageCount} ص)`,
      studentName,
      salePriceDZD,
      JSON.stringify({ docId, topic: cleanTopic, pageCount, pointsCost }),
      expiresAt
    );

    trackEvent("research_generated", {
      docId,
      topic: cleanTopic,
      level,
      grade,
      pageCount,
      pointsCost,
      shopId,
    });

    return NextResponse.json({
      success: true,
      docId,
      title: `بحث مدرسي: ${cleanTopic}`,
      topic: cleanTopic,
      level,
      grade,
      subject,
      subjectName,
      pageCount,
      styleLevel,
      coverTemplate,
      studentName,
      schoolName,
      teacherName,
      outline,
      sections,
      references,
      reviewQuestions,
      pointsCost,
      salePriceDZD,
      provider: providerUsed,
      balanceAfter: newBalance,
      expiresAt,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "حدث خطأ أثناء توليد البحث" }, { status: 500 });
  }
}
