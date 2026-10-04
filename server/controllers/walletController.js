/**
 * 💳 وحدة التحكم في المحفظة والشحن (Wallet Controller)
 */

const walletService = require('../services/walletService');

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

class WalletController {
  async handleGetLedger(req, res, parsedUrl) {
    try {
      const shopId = parsedUrl.searchParams.get('shopId') || 'shop_1';
      const ledger = walletService.getLedger(shopId);
      sendJson(res, 200, { success: true, ledger });
    } catch (err) {
      sendJson(res, 500, { success: false, error: err.message });
    }
  }

  async handleRedeemScratch(req, res, body) {
    try {
      const { shopId = 'shop_1', pin } = body;
      const result = walletService.redeemScratchCard(shopId, pin);
      sendJson(res, 200, result);
    } catch (err) {
      sendJson(res, 400, { success: false, error: err.message });
    }
  }

  async handlePaymentGateway(req, res, body) {
    try {
      const { shopId = 'shop_1', points, dzdAmount } = body;
      const result = walletService.requestEPayGateway(shopId, points, dzdAmount);
      sendJson(res, 200, result);
    } catch (err) {
      sendJson(res, 400, { success: false, error: err.message });
    }
  }
}

module.exports = new WalletController();
