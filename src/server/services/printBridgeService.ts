/**
 * 🖨️ خدمة جسر الطباعة اللاسلكي الفوري (Print Bridge Service)
 * Server-Sent Events (SSE) dispatcher for cross-device wireless printing via Web Streams API
 */

type SSEStreamController = ReadableStreamDefaultController<Uint8Array>;

interface ConnectedClient {
  id: string;
  pin: string;
  controller: SSEStreamController;
  connectedAt: Date;
}

class PrintBridgeService {
  private clients = new Map<string, Set<ConnectedClient>>();

  registerClient(pin: string = "default", controller: SSEStreamController): () => void {
    const cleanPin = pin.trim() || "default";
    const client: ConnectedClient = {
      id: `client_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      pin: cleanPin,
      controller,
      connectedAt: new Date(),
    };

    if (!this.clients.has(cleanPin)) {
      this.clients.set(cleanPin, new Set());
    }
    this.clients.get(cleanPin)!.add(client);

    // Send initial handshake
    const encoder = new TextEncoder();
    try {
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ status: "connected", pin: cleanPin, clientId: client.id })}\n\n`)
      );
    } catch {
      // Ignore initial handshake error
    }

    // Cleanup function
    return () => {
      const set = this.clients.get(cleanPin);
      if (set) {
        set.delete(client);
        if (set.size === 0) {
          this.clients.delete(cleanPin);
        }
      }
    };
  }

  dispatchPrintJob(payload: {
    targetPin?: string;
    type?: string;
    title?: string;
    content?: any;
    [key: string]: any;
  }): { success: boolean; deliveredTo: number } {
    const pin = (payload.targetPin || "default").trim();
    const targetSet = this.clients.get(pin);

    if (!targetSet || targetSet.size === 0) {
      return { success: true, deliveredTo: 0 };
    }

    const encoder = new TextEncoder();
    const dataMessage = encoder.encode(`data: ${JSON.stringify(payload)}\n\n`);
    let deliveredCount = 0;

    for (const client of targetSet) {
      try {
        client.controller.enqueue(dataMessage);
        deliveredCount++;
      } catch (err) {
        targetSet.delete(client);
      }
    }

    return {
      success: true,
      deliveredTo: deliveredCount,
    };
  }

  getActiveClientsCount(pin?: string): number {
    if (pin) {
      return this.clients.get(pin)?.size || 0;
    }
    let total = 0;
    for (const set of this.clients.values()) {
      total += set.size;
    }
    return total;
  }
}

// Global singleton to persist across hot reloads in Next.js development
declare global {
  var __sahlaPrintBridge: PrintBridgeService | undefined;
}

export const printBridgeService = globalThis.__sahlaPrintBridge ?? new PrintBridgeService();

if (process.env.NODE_ENV !== "production") {
  globalThis.__sahlaPrintBridge = printBridgeService;
}
