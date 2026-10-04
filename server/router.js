/**
 * 🚦 الموجه المركزي للطلبات (Central HTTP Router)
 * Routes HTTP requests to corresponding controllers and serves static PWA assets
 */

const fs = require('fs');
const path = require('path');
const corsMiddleware = require('./middleware/cors');
const authController = require('./controllers/authController');
const shopController = require('./controllers/shopController');
const staffController = require('./controllers/staffController');
const walletController = require('./controllers/walletController');
const adminController = require('./controllers/adminController');
const printController = require('./controllers/printController');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

function readBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
  });
}

async function handleRequest(req, res) {
  // 1. CORS & Security headers
  if (corsMiddleware(req, res)) return;

  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // 2. Server-Sent Events (SSE) for Print Bridge
  if (pathname === '/events' && method === 'GET') {
    return printController.handleEvents(req, res, parsedUrl);
  }

  // 3. API Routes
  if (pathname.startsWith('/api/')) {
    const body = ['POST', 'PUT', 'DELETE'].includes(method) ? await readBody(req) : {};

    // Auth
    if (pathname === '/api/auth/otp/request' && method === 'POST') {
      return authController.handleOtpRequest(req, res, body);
    }
    if (pathname === '/api/auth/otp/verify' && method === 'POST') {
      return authController.handleOtpVerify(req, res, body);
    }
    if (pathname === '/api/auth/logout' && method === 'POST') {
      return authController.handleLogout(req, res);
    }
    if (pathname === '/api/auth/logout-all' && method === 'POST') {
      return authController.handleLogoutAll(req, res);
    }

    // Shops
    if (pathname === '/api/shops' && method === 'POST') {
      return shopController.handleRegister(req, res, body);
    }
    if (pathname === '/api/shops/profile' && method === 'GET') {
      return shopController.handleGetProfile(req, res, parsedUrl);
    }
    if (pathname === '/api/onboarding' && method === 'POST') {
      return shopController.handleOnboarding(req, res, body);
    }

    // Staff Management
    if (pathname === '/api/shop/staff' || pathname.startsWith('/api/shop/staff/')) {
      if (method === 'GET') return staffController.handleGetStaff(req, res, parsedUrl);
      if (method === 'POST') return staffController.handleAddStaff(req, res, body);
      if (method === 'DELETE') return staffController.handleDeleteStaff(req, res, pathname, body);
    }

    // Wallet & Payments
    if (pathname === '/api/wallet/ledger' && method === 'GET') {
      return walletController.handleGetLedger(req, res, parsedUrl);
    }
    if (pathname === '/api/wallet/redeem-scratch' && method === 'POST') {
      return walletController.handleRedeemScratch(req, res, body);
    }
    if (pathname === '/api/wallet/pay-gateway' && method === 'POST') {
      return walletController.handlePaymentGateway(req, res, body);
    }

    // Super Admin
    if (pathname === '/api/admin/overview' && method === 'GET') {
      return adminController.handleOverview(req, res);
    }
    if (pathname === '/api/admin/shops/topup' && method === 'POST') {
      return adminController.handleTopup(req, res, body);
    }
    if (pathname === '/api/admin/shops/toggle' && method === 'POST') {
      return adminController.handleToggle(req, res, body);
    }

    // Print Bridge Dispatch
    if (pathname === '/api/send-print' && method === 'POST') {
      return printController.handleSendPrint(req, res, body);
    }

    // 404 for unknown API routes
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, error: 'المسار البرمجي غير موجود' }));
    return;
  }

  // 4. Static File Serving (PWA UI)
  let safePath = path.normalize(decodeURIComponent(pathname)).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.join(PUBLIC_DIR, safePath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  if (fs.existsSync(filePath) && !fs.statSync(filePath).isDirectory()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const content = fs.readFileSync(filePath);

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=86400'
    });
    res.end(content);
    return;
  }

  // Fallback to index.html for SPA routing
  const fallbackIndex = path.join(PUBLIC_DIR, 'index.html');
  if (fs.existsSync(fallbackIndex)) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(fs.readFileSync(fallbackIndex));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('404 Not Found');
}

module.exports = { handleRequest };
