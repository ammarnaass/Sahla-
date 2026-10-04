/**
 * 🔑 وحدة التحكم في المصادقة (Auth Controller)
 */

const authService = require('../services/authService');

function sendJson(res, statusCode, data, headers = {}) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json', ...headers });
  res.end(JSON.stringify(data));
}

class AuthController {
  async handleOtpRequest(req, res, body) {
    try {
      const { phone, channel } = body;
      const result = authService.requestOTP(phone, channel);
      sendJson(res, 200, result);
    } catch (err) {
      sendJson(res, 400, { success: false, error: err.message });
    }
  }

  async handleOtpVerify(req, res, body) {
    try {
      const { phone, code } = body;
      const result = authService.verifyOTP(phone, code);

      const cookieHeader = {
        'Set-Cookie': `sahla_session_token=${result.token}; Path=/; HttpOnly; Max-Age=2592000; SameSite=Lax`
      };

      sendJson(res, 200, result, cookieHeader);
    } catch (err) {
      sendJson(res, 400, { success: false, error: err.message });
    }
  }

  async handleLogout(req, res) {
    sendJson(res, 200, { success: true, message: 'تم تسجيل الخروج بنجاح' }, {
      'Set-Cookie': 'sahla_session_token=; Path=/; HttpOnly; Max-Age=0'
    });
  }

  async handleLogoutAll(req, res) {
    sendJson(res, 200, { success: true, message: 'تم إنهاء الجلسة من كافة الأجهزة' }, {
      'Set-Cookie': 'sahla_session_token=; Path=/; HttpOnly; Max-Age=0'
    });
  }
}

module.exports = new AuthController();
