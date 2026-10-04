// Sahla Phone-to-PC Print Bridge (جسر الطباعة السريع من الهاتف إلى الحاسوب)

class PrintBridgeManager {
  constructor() {
    this.sessionPin = this.generatePin();
    this.isConnected = false;
    this.receivedDocs = [];
    this.init();
  }

  generatePin() {
    // كود اقتران من 4 أرقام
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  init() {
    // الاستماع لأي أحداث إرسال محلية أو عبر الخادم
    window.addEventListener('storage', (event) => {
      if (event.key === 'sahla_print_queue') {
        this.checkQueue();
      }
    });

    // الاشتراك في قناة البث الحي (SSE) عبر الخادم إذا كان متوفراً
    this.initServerEvents();
  }

  initServerEvents() {
    if (typeof EventSource !== 'undefined') {
      try {
        const es = new EventSource(`/api/print-events?pin=${this.sessionPin}`);
        es.onmessage = (e) => {
          try {
            const payload = JSON.parse(e.data);
            this.handleIncomingDocument(payload);
          } catch (err) {}
        };
      } catch (e) {}
    }
  }

  // إرسال وثيقة من الهاتف إلى الحاسوب
  sendDocumentFromPhone(docType, title, htmlContent, pinTarget) {
    const payload = {
      id: 'DOC-' + Date.now().toString().slice(-6),
      type: docType,
      title: title,
      html: htmlContent,
      targetPin: pinTarget,
      timestamp: new Date().toLocaleTimeString('ar-DZ')
    };

    // حفظ في طابور التزامن
    localStorage.setItem('sahla_print_queue', JSON.stringify(payload));

    // إرسال للخادم
    fetch('/api/send-print', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(() => {});

    // إطلاق حدث محلي في حال تشغيل نفس المتصفح
    window.dispatchEvent(new CustomEvent('sahla:doc-sent', { detail: payload }));
    return payload;
  }

  // فحص طابور الوثائق
  checkQueue() {
    const raw = localStorage.getItem('sahla_print_queue');
    if (!raw) return;
    try {
      const payload = JSON.parse(raw);
      if (payload && (!payload.targetPin || payload.targetPin === this.sessionPin)) {
        this.handleIncomingDocument(payload);
        localStorage.removeItem('sahla_print_queue');
      }
    } catch (e) {}
  }

  // معالجة الوثيقة المستلمة على الحاسوب
  handleIncomingDocument(payload) {
    this.receivedDocs.unshift(payload);
    window.dispatchEvent(new CustomEvent('sahla:doc-received', { detail: payload }));

    // تشغيل تنبيه صوتي وتجهيز نافذة الطباعة
    this.playChime();
  }

  playChime() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {}
  }
}

const sahlaBridge = new PrintBridgeManager();
