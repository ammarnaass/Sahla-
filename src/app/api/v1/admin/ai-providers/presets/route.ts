import { NextResponse } from "next/server";
import { AI_PROVIDER_PRESETS } from "@/server/ai/providers/presets";

export const dynamic = "force-dynamic";

/**
 * 🎁 GET /v1/admin/ai-providers/presets
 * Returns the catalog of supported AI provider presets (Groq, OpenRouter, Gemini, Claude, Ollama, etc.)
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    presets: AI_PROVIDER_PRESETS,
  });
}
