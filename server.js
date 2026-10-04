/**
 * 🇩🇿 منصة سهلة (Sahla Platform) - Enterprise Server Entrypoint
 * Clean Layered Architecture with RBAC, Persistent Repositories & Real-Time Print Bridge
 */

const http = require('http');
const { PORT } = require('./server/config/constants');
const { handleRequest } = require('./server/router');

const server = http.createServer((req, res) => {
  handleRequest(req, res).catch(err => {
    console.error('[Server Error]:', err);
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'حدث خطأ داخلي في الخادم' }));
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`
======================================================
  🇩🇿 منصة سهلة للخدمات الرقمية · Sahla Platform v2.0
  🏛️ المعمارية: Clean Layered Architecture (RBAC Ready)
  🌐 الرابط المحلي: http://localhost:${PORT}
  🖨️ جسر الطباعة الفوري: جاهز (Server-Sent Events)
  💾 التخزين: محرك البيانات المستديم (Atomic JSON Store)
======================================================
  `);
});

// Graceful shutdown
function shutdown(signal) {
  console.log(`\n[Server] Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.log('[Server] Closed all connections. Exiting.');
    process.exit(0);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

module.exports = server;
