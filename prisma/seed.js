/**
 * 🇩🇿 سكربت بذر قاعدة بيانات سهلة (Sahla SaaS SQLite Seeder)
 * Creates and permanently stores the Super Admin account, default shops, cards, and invoices.
 */

const { DatabaseSync } = require('node:sqlite');
const crypto = require('crypto');
const path = require('path');

const DB_PATH = path.join(__dirname, 'sahla.db');
const db = new DatabaseSync(DB_PATH);

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

console.log('[Seeder] Starting seeding into:', DB_PATH);

// 1. Seed Shops
const insertShop = db.prepare(`
  INSERT OR REPLACE INTO shops (id, name, owner, phone, wilaya, wilaya_code, activity, plan, points, status, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
`);

const shops = [
  {
    id: 'shop_1',
    name: 'مكتبة النجاح الرقمية',
    owner: 'أحمد بن علي',
    phone: '0555123456',
    wilaya: '16 - الجزائر العاصمة',
    wilaya_code: 16,
    activity: 'KIOSK',
    plan: 'PRO_KIOSK',
    points: 350,
    status: 'ACTIVE'
  },
  {
    id: 'shop_2',
    name: 'سيبار الأمل وهران',
    owner: 'عبد القادر بلحاج',
    phone: '0770112233',
    wilaya: '31 - وهران',
    wilaya_code: 31,
    activity: 'CYBER',
    plan: 'STARTER',
    points: 85,
    status: 'ACTIVE'
  },
  {
    id: 'shop_3',
    name: 'فضاء الخدمات الرقمية سطيف',
    owner: 'مراد قرفي',
    phone: '0660445566',
    wilaya: '19 - سطيف',
    wilaya_code: 19,
    activity: 'PUBLIC_WRITER',
    plan: 'PRO_KIOSK',
    points: 210,
    status: 'ACTIVE'
  }
];

for (const s of shops) {
  insertShop.run(s.id, s.name, s.owner, s.phone, s.wilaya, s.wilaya_code, s.activity, s.plan, s.points, s.status);
  console.log(`  ✓ Shop inserted/updated: ${s.name} (${s.id})`);
}

// 2. Seed Users (Super Admin, Shop Admin, Staff)
const insertUser = db.prepare(`
  INSERT OR REPLACE INTO users (id, name, email, secondary_email, phone, password, role, shop_id, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
`);

const superAdminHash = hashPassword('Admin@2026!');
const shopAdminHash = hashPassword('Shop@2026!');
const staffHash = hashPassword('Staff@2026!');

const users = [
  {
    id: 'user_super_admin',
    name: 'مدير منصة سهلة المركزي',
    email: 'admin@sahla.dz',
    secondary_email: 'superadmin@gmail.com',
    phone: '0550000000',
    password: superAdminHash,
    role: 'SUPER_ADMIN',
    shop_id: null
  },
  {
    id: 'user_shop_admin',
    name: 'أحمد بن علي',
    email: 'najah.kiosk@gmail.com',
    secondary_email: null,
    phone: '0555123456',
    password: shopAdminHash,
    role: 'SHOP_ADMIN',
    shop_id: 'shop_1'
  },
  {
    id: 'user_staff',
    name: 'سفيان بلقاسم (موظف)',
    email: 'staff.soufiane@gmail.com',
    secondary_email: null,
    phone: '0661998877',
    password: staffHash,
    role: 'STAFF',
    shop_id: 'shop_1'
  }
];

for (const u of users) {
  insertUser.run(u.id, u.name, u.email, u.secondary_email, u.phone, u.password, u.role, u.shop_id);
  console.log(`  👑 User inserted/updated: ${u.name} (${u.email}) [Role: ${u.role}]`);
}

// 3. Seed Invoices
const insertInvoice = db.prepare(`
  INSERT OR REPLACE INTO invoices (id, invoice_number, shop_id, shop_name, owner_name, wilaya, wilaya_code, date, due_date, items_json, subtotal_dzd, tax_dzd, stamp_duty_dzd, total_dzd, status, payment_method, notes, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
`);

const invoices = [
  {
    id: 'inv_1001',
    invoice_number: 'FAC-2026-0001',
    shop_id: 'shop_1',
    shop_name: 'مكتبة النجاح الرقمية',
    owner_name: 'أحمد بن علي',
    wilaya: '16 - الجزائر العاصمة',
    wilaya_code: 16,
    date: '2026-03-01',
    due_date: '2026-03-15',
    items_json: JSON.stringify([{ description: 'اشتراك شهري خطة المكتبة الاحترافية', qty: 1, unitPriceDZD: 2500, totalDZD: 2500 }]),
    subtotal_dzd: 2500,
    tax_dzd: 475,
    stamp_duty_dzd: 25,
    total_dzd: 3000,
    status: 'PAID',
    payment_method: 'EDAHABIA_CIB',
    notes: 'تم الدفع بالبطاقة الذهبية'
  },
  {
    id: 'inv_1002',
    invoice_number: 'FAC-2026-0002',
    shop_id: 'shop_2',
    shop_name: 'سيبار الأمل وهران',
    owner_name: 'عبد القادر بلحاج',
    wilaya: '31 - وهران',
    wilaya_code: 31,
    date: '2026-03-10',
    due_date: '2026-03-24',
    items_json: JSON.stringify([{ description: 'حزمة نقاط إضافية 100 نقطة', qty: 1, unitPriceDZD: 1000, totalDZD: 1000 }]),
    subtotal_dzd: 1000,
    tax_dzd: 190,
    stamp_duty_dzd: 10,
    total_dzd: 1200,
    status: 'PAID',
    payment_method: 'BARIDIMOB',
    notes: 'تحويل بريدي موب'
  }
];

for (const inv of invoices) {
  insertInvoice.run(
    inv.id,
    inv.invoice_number,
    inv.shop_id,
    inv.shop_name,
    inv.owner_name,
    inv.wilaya,
    inv.wilaya_code,
    inv.date,
    inv.due_date,
    inv.items_json,
    inv.subtotal_dzd,
    inv.tax_dzd,
    inv.stamp_duty_dzd,
    inv.total_dzd,
    inv.status,
    inv.payment_method,
    inv.notes
  );
  console.log(`  🧾 Invoice inserted/updated: ${inv.invoice_number}`);
}

// 4. Seed Scratch Cards
const insertCard = db.prepare(`
  INSERT OR REPLACE INTO cards (id, batch_number, serial_number, pin, points, price_dzd, status, shop_id, redeemed_at, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
`);

const cards = [
  { id: 'card_1', batch_number: 'BATCH-2026-A', serial_number: 'SHL-100-8849', pin: '88492026', points: 100, price_dzd: 1000, status: 'UNREDEEMED', shop_id: null, redeemed_at: null },
  { id: 'card_2', batch_number: 'BATCH-2026-A', serial_number: 'SHL-250-9912', pin: '99122026', points: 250, price_dzd: 2200, status: 'UNREDEEMED', shop_id: null, redeemed_at: null },
  { id: 'card_3', batch_number: 'BATCH-2026-A', serial_number: 'SHL-500-4431', pin: '44312026', points: 500, price_dzd: 4000, status: 'UNREDEEMED', shop_id: null, redeemed_at: null }
];

for (const c of cards) {
  insertCard.run(c.id, c.batch_number, c.serial_number, c.pin, c.points, c.price_dzd, c.status, c.shop_id, c.redeemed_at);
  console.log(`  💳 Card inserted/updated: ${c.serial_number} (${c.points} pts)`);
}

console.log('\n[Seeder] 🎉 Seeding completed successfully!');
const usersInDb = db.prepare('SELECT id, name, email, role FROM users').all();
console.log('[Seeder] Current Users in DB:');
console.table(usersInDb);
