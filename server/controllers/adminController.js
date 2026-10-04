/**
 * 👑 وحدة التحكم لمدير النظام المركزي (Admin Controller)
 */

const adminService = require('../services/adminService');

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

class AdminController {
  async handleOverview(req, res) {
    try {
      const data = adminService.getNationalOverview();
      sendJson(res, 200, data);
    } catch (err) {
      sendJson(res, 500, { success: false, error: err.message });
    }
  }

  async handleTopup(req, res, body) {
    try {
      const { shopId, points = 50 } = body;
      const result = adminService.topupShop(shopId, points);
      sendJson(res, 200, result);
    } catch (err) {
      sendJson(res, 400, { success: false, error: err.message });
    }
  }

  async handleToggle(req, res, body) {
    try {
      const { shopId } = body;
      const result = adminService.toggleShopStatus(shopId);
      sendJson(res, 200, result);
    } catch (err) {
      sendJson(res, 400, { success: false, error: err.message });
    }
  }
}

module.exports = new AdminController();
