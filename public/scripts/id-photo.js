// Sahla Official Algerian ID Photo Studio (أداة صور الهوية الرسمية 35×45 مم)

class IDPhotoManager {
  constructor() {
    this.sheetFormat = '10x15_8'; // '10x15_4', '10x15_8', 'a4_12'
    this.bgColor = '#ECEEF0'; // Official Algerian biometric light gray standard
    this.zoom = 1;
    this.panX = 0;
    this.panY = 0;
    this.sourceImage = null;

    // صورة توضيحية افتراضية للمعاينة
    this.demoImageSrc = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="350" height="450" viewBox="0 0 350 450">
        <rect width="350" height="450" fill="#ECEEF0"/>
        <circle cx="175" cy="180" r="85" fill="#D29B71"/>
        <path d="M 115 130 Q 175 60 235 130 Q 235 90 175 80 Q 115 90 115 130 Z" fill="#2C231E"/>
        <circle cx="145" cy="170" r="9" fill="#2C231E"/>
        <circle cx="205" cy="170" r="9" fill="#2C231E"/>
        <path d="M 175 175 L 175 205 L 165 210" stroke="#9E6B47" stroke-width="3" fill="none"/>
        <path d="M 150 230 Q 175 245 200 230" stroke="#7A3D28" stroke-width="4" fill="none"/>
        <path d="M 70 450 Q 80 300 175 300 Q 270 300 280 450 Z" fill="#1E293B"/>
        <path d="M 150 300 L 175 350 L 200 300 Z" fill="#FFFFFF"/>
        <rect x="170" y="340" width="10" height="90" fill="#B91C1C"/>
      </svg>
    `);
  }

  // رسم الصورة المفردة بمقاس 35×45 مم على Canvas
  drawSinglePhoto(canvas, img, bgColor, zoom = 1, panX = 0, panY = 0) {
    const ctx = canvas.getContext('2d');
    canvas.width = 350; // 35mm at 254 DPI
    canvas.height = 450; // 45mm at 254 DPI

    // رسم الخلفية الرسمية
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (img) {
      ctx.save();
      // رسم الصورة مع التكبير والإزاحة
      const aspect = img.width / img.height;
      let drawW = canvas.width * zoom;
      let drawH = (canvas.width / aspect) * zoom;
      let dx = (canvas.width - drawW) / 2 + panX;
      let dy = (canvas.height - drawH) / 2 + panY;

      ctx.drawImage(img, dx, dy, drawW, drawH);
      ctx.restore();
    }
  }

  // رسم شبكة الطباعة الكاملة مع خطوط التقطيع (Crop Marks)
  renderPrintSheet(targetCanvas, sourceCanvas, format = this.sheetFormat) {
    const ctx = targetCanvas.getContext('2d');

    if (format.startsWith('10x15')) {
      // مقاس ورق الصور القياسي الجزائري: 10×15 سم (4×6 بوصة) = 1200×1800 بكسل عند 300 DPI
      targetCanvas.width = 1800;
      targetCanvas.height = 1200;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, targetCanvas.width, targetCanvas.height);

      const count = format === '10x15_4' ? 4 : 8;
      const photoW = 350 * 1.15; // 402px
      const photoH = 450 * 1.15; // 517px

      const cols = count === 4 ? 4 : 4;
      const rows = count === 4 ? 1 : 2;

      const gapX = 35;
      const gapY = 40;
      const startX = (targetCanvas.width - (cols * photoW + (cols - 1) * gapX)) / 2;
      const startY = (targetCanvas.height - (rows * photoH + (rows - 1) * gapY)) / 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = startX + c * (photoW + gapX);
          const y = startY + r * (photoH + gapY);

          // رسم الصورة
          ctx.drawImage(sourceCanvas, x, y, photoW, photoH);

          // رسم إطار تقطيع خفيف وخطوط علامات المقص (Crop Marks)
          ctx.strokeStyle = '#D1D5DB';
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, photoW, photoH);

          // علامات الزوايا (Corner Marks)
          this.drawCropMarks(ctx, x, y, photoW, photoH);
        }
      }
    } else {
      // مقاس ورقة A4 (2480×3508 بكسل عند 300 DPI)
      targetCanvas.width = 2480;
      targetCanvas.height = 3508;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, targetCanvas.width, targetCanvas.height);

      const cols = 4;
      const rows = 3; // 12 صورة
      const photoW = 413;
      const photoH = 531;
      const gapX = 60;
      const gapY = 80;
      const startX = (targetCanvas.width - (cols * photoW + (cols - 1) * gapX)) / 2;
      const startY = 300;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = startX + c * (photoW + gapX);
          const y = startY + r * (photoH + gapY);

          ctx.drawImage(sourceCanvas, x, y, photoW, photoH);
          ctx.strokeStyle = '#D1D5DB';
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, photoW, photoH);
          this.drawCropMarks(ctx, x, y, photoW, photoH);
        }
      }

      // تذييل الصفحة
      ctx.fillStyle = '#6B7280';
      ctx.font = '28px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('سهلة · Sahla — صور بيومترية رسمية معتمدة 35×45 مم', targetCanvas.width / 2, 2100);
    }
  }

  // رسم علامات التقطيع الدقيقة في زوايا كل صورة
  drawCropMarks(ctx, x, y, w, h) {
    const len = 12;
    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 1.5;

    // أعلى يسار
    ctx.beginPath();
    ctx.moveTo(x - len, y);
    ctx.lineTo(x, y);
    ctx.moveTo(x, y - len);
    ctx.lineTo(x, y);
    ctx.stroke();

    // أعلى يمين
    ctx.beginPath();
    ctx.moveTo(x + w + len, y);
    ctx.lineTo(x + w, y);
    ctx.moveTo(x + w, y - len);
    ctx.lineTo(x + w, y);
    ctx.stroke();

    // أسفل يسار
    ctx.beginPath();
    ctx.moveTo(x - len, y + h);
    ctx.lineTo(x, y + h);
    ctx.moveTo(x, y + h + len);
    ctx.lineTo(x, y + h);
    ctx.stroke();

    // أسفل يمين
    ctx.beginPath();
    ctx.moveTo(x + w + len, y + h);
    ctx.lineTo(x + w, y + h);
    ctx.moveTo(x + w, y + h + len);
    ctx.lineTo(x + w, y + h);
    ctx.stroke();
  }
}

const sahlaIDPhoto = new IDPhotoManager();
