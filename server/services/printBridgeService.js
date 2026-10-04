/**
 * 🖨️ خدمة جسر الطباعة اللاسلكي الفوري (Print Bridge Service)
 * Server-Sent Events (SSE) dispatcher for cross-device wireless printing
 */

class PrintBridgeService {
  constructor() {
    this.clients = new Map(); // pin -> [res]
  }

  registerClient(pin = 'default', res) {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });

    res.write(`data: ${JSON.stringify({ status: 'connected', pin })}\n\n`);

    if (!this.clients.has(pin)) {
      this.clients.set(pin, []);
    }
    this.clients.get(pin).push(res);

    res.on('close', () => {
      const activeList = this.clients.get(pin) || [];
      this.clients.set(pin, activeList.filter(c => c !== res));
    });
  }

  dispatchPrintJob(payload) {
    const pin = payload.targetPin || 'default';
    const activeClients = this.clients.get(pin) || [];

    activeClients.forEach(client => {
      try {
        client.write(`data: ${JSON.stringify(payload)}\n\n`);
      } catch (err) {
        console.error('[PrintBridgeService] Failed to write to SSE client:', err.message);
      }
    });

    return {
      success: true,
      deliveredTo: activeClients.length
    };
  }
}

module.exports = new PrintBridgeService();
