/**
 * 🖨️ وحدة التحكم في جسر الطباعة (Print Controller)
 */

const printBridgeService = require('../services/printBridgeService');

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

class PrintController {
  handleEvents(req, res, parsedUrl) {
    const pin = parsedUrl.searchParams.get('pin') || 'default';
    printBridgeService.registerClient(pin, res);
  }

  handleSendPrint(req, res, body) {
    try {
      const result = printBridgeService.dispatchPrintJob(body);
      sendJson(res, 200, result);
    } catch (err) {
      sendJson(res, 400, { success: false, error: err.message });
    }
  }
}

module.exports = new PrintController();
