import { NextRequest, NextResponse } from "next/server";
import { AdminAIOrchestrator } from "@/server/ai/adminAIOrchestrator";
import type { AIChatRequest } from "@/server/ai/types";

export const dynamic = "force-dynamic";

/**
 * 💬 POST /api/v1/admin/ai/chat
 * Multi-turn natural language conversation with the National Platform AI Engine.
 */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as AIChatRequest;
    const { messages, conversation_id } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { success: false, error: "يجب إرسال رسالة واحدة على الأقل" },
        { status: 400 }
      );
    }

    // Verify last message content
    const lastMsg = messages[messages.length - 1];
    if (!lastMsg || !lastMsg.content || !lastMsg.content.trim()) {
      return NextResponse.json(
        { success: false, error: "محتوى الرسالة لا يمكن أن يكون فارغاً" },
        { status: 400 }
      );
    }

    // Execute chat via orchestrator
    const result = await AdminAIOrchestrator.chat(
      messages,
      conversation_id,
      "user_super_admin"
    );

    return NextResponse.json({
      success: true,
      message: result.message,
      conversation_id: result.conversationId,
    });
  } catch (err: any) {
    console.error("[API:AI:Chat] Error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || "حدث خطأ غير متوقع أثناء معالجة المحادثة",
      },
      { status: 500 }
    );
  }
}

/**
 * 📜 GET /api/v1/admin/ai/chat
 * Fetch past conversation history or list recent conversations.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const convId = searchParams.get("conversation_id");

    if (convId) {
      const conv = AdminAIOrchestrator.getConversation(convId);
      if (!conv) {
        return NextResponse.json(
          { success: false, error: "المحادثة غير موجودة" },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, conversation: conv });
    }

    // Otherwise list recent conversations
    const limit = Number(searchParams.get("limit")) || 20;
    const conversations = AdminAIOrchestrator.listConversations(
      "user_super_admin",
      limit
    );

    return NextResponse.json({ success: true, conversations });
  } catch (err: any) {
    console.error("[API:AI:Chat:GET] Error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || "فشل جلب سجل المحادثات",
      },
      { status: 500 }
    );
  }
}
