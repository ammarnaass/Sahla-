/**
 * 👥 وحدة التحكم في طاقم العمل والموظفين (Staff Controller)
 */

const shopService = require('../services/shopService');

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

class StaffController {
  async handleGetStaff(req, res, parsedUrl) {
    try {
      const shopId = parsedUrl.searchParams.get('shopId') || 'shop_1';
      const staff = shopService.getStaff(shopId);
      sendJson(res, 200, { success: true, staff });
    } catch (err) {
      sendJson(res, 500, { success: false, error: err.message });
    }
  }

  async handleAddStaff(req, res, body) {
    try {
      const { shopId = 'shop_1', name, phone } = body;
      const newStaff = shopService.addStaff(shopId, { name, phone });
      sendJson(res, 201, { success: true, staff: newStaff });
    } catch (err) {
      sendJson(res, 400, { success: false, error: err.message });
    }
  }

  async handleDeleteStaff(req, res, pathname, body) {
    try {
      let staffId = pathname.startsWith('/api/shop/staff/') 
        ? pathname.replace('/api/shop/staff/', '') 
        : null;
      let shopId = 'shop_1';

      if (body) {
        if (body.staffId) staffId = body.staffId;
        if (body.shopId) shopId = body.shopId;
      }

      if (!staffId) {
        return sendJson(res, 400, { success: false, error: 'معرف الموظف مطلوب' });
      }

      const result = shopService.removeStaff(shopId, staffId);
      sendJson(res, 200, result);
    } catch (err) {
      sendJson(res, 400, { success: false, error: err.message });
    }
  }
}

module.exports = new StaffController();
