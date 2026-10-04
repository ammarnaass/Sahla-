/**
 * 🏪 وحدة التحكم في المحلات والتهيئة (Shop Controller)
 */

const shopService = require('../services/shopService');

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

class ShopController {
  async handleRegister(req, res, body) {
    try {
      const result = shopService.registerShop(body);
      sendJson(res, 201, { success: true, ...result });
    } catch (err) {
      sendJson(res, 400, { success: false, error: err.message });
    }
  }

  async handleGetProfile(req, res, parsedUrl) {
    try {
      const shopId = parsedUrl.searchParams.get('id') || 'shop_1';
      const shop = shopService.getShop(shopId);
      sendJson(res, 200, { success: true, shop });
    } catch (err) {
      sendJson(res, 404, { success: false, error: err.message });
    }
  }

  async handleOnboarding(req, res, body) {
    sendJson(res, 200, { success: true, message: 'تم إكمال خطوة التهيئة الترحيبية بنجاح' });
  }
}

module.exports = new ShopController();
