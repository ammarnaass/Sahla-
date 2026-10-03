// Sahla Platform Development Server (خادم التطوير لمنصة سهلة)
// Built with pure Node.js (Zero external dependencies required)

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

// MIME types mapping
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Phone-to-PC Print Bridge SSE Clients Registry
const sseClients = new Map();

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  // 1. API: Server-Sent Events (SSE) لجسر الطباعة اللاسلكي
  if (pathname === '/api/print-events') {
    const pin = parsedUrl.searchParams.get('pin') || 'default';
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });
    res.write(`data: ${JSON.stringify({ status: 'connected', pin })}\n\n`);

    if (!sseClients.has(pin)) {
      sseClients.set(pin, []);
    }
    sseClients.get(pin).push(res);

    req.on('close', () => {
      const clients = sseClients.get(pin) || [];
      sseClients.set(pin, clients.filter(c => c !== res));
    });
    return;
  }

  // 2. API: إرسال وثيقة من الهاتف للحاسوب
  if (pathname === '/api/send-print' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const pin = payload.targetPin || 'default';
        const clients = sseClients.get(pin) || [];

        // بث الوثيقة إلى حاسوب الطابعة المرتبط
        clients.forEach(client => {
          client.write(`data: ${JSON.stringify(payload)}\n\n`);
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, deliveredTo: clients.length }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid payload' }));
      }
    });
    return;
  }

  // 3. خدمة الملفات الثابتة (Static File Serving)
  let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);

  // حماية المسار
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    return res.end('Access Denied');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // إرجاع index.html لصفحات الـ SPA
      filePath = path.join(PUBLIC_DIR, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500);
        return res.end('Server Error');
      }

      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600'
      });
      res.end(content);
    });
  });
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`  🇩🇿 سهلة · Sahla Platform Dev Server Started!`);
  console.log(`  🌐 الرابط المحلي: http://localhost:${PORT}`);
  console.log(`  🖨️ جسر الطباعة اللاسلكي: جاهز للاستقبال`);
  console.log(`======================================================\n`);
});
