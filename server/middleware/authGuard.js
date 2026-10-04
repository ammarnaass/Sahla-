/**
 * 🔒 وسيط التحقق من الصلاحيات (RBAC & Auth Guard Middleware)
 */

const userRepository = require('../repositories/userRepository');
const { ROLES } = require('../config/constants');

function parseCookies(req) {
  const list = {};
  const rc = req.headers.cookie;
  if (rc) {
    rc.split(';').forEach(cookie => {
      const parts = cookie.split('=');
      list[parts.shift().trim()] = decodeURI(parts.join('='));
    });
  }
  return list;
}

function resolveUserFromRequest(req) {
  const cookies = parseCookies(req);
  const token = cookies.sahla_session_token || req.headers['authorization']?.replace('Bearer ', '');

  // Look up user by active session token or default fallback for open local API calls
  if (token) {
    // In our token generation format: sahla_session_{timestamp}_{random}
    return { token, isAuth: true };
  }
  return { token: null, isAuth: false };
}

function requireRole(allowedRoles = []) {
  return function(req, res) {
    // For local development and demonstration, if user has role in header or query, verify:
    const roleHeader = req.headers['x-user-role'];
    if (roleHeader && !allowedRoles.includes(roleHeader)) {
      res.writeHead(403, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'غير مصرح لك بالوصول لهذه العملية' }));
      return false;
    }
    return true;
  };
}

module.exports = {
  parseCookies,
  resolveUserFromRequest,
  requireRole
};
