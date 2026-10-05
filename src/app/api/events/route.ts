import { NextRequest } from "next/server";
import { printBridgeService } from "@/server/services/printBridgeService";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pin = searchParams.get("pin") || "default";

  let cleanup: (() => void) | null = null;

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      cleanup = printBridgeService.registerClient(pin, controller);
    },
    cancel() {
      if (cleanup) {
        cleanup();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "X-Accel-Buffering": "no",
    },
  });
}
