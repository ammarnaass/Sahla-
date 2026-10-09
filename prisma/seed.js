/**
 * 🇩🇿 سكربت بذر قاعدة بيانات سهلة (Sahla SaaS SQLite Seeder)
 * Creates and permanently stores the Super Admin account, Dante Digital Library, and admin accounts.
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

// 1. Seed Real Shop (Dante Digital Library)
const insertShop = db.prepare(`
  INSERT OR REPLACE INTO shops (id, name, owner, phone, wilaya, wilaya_code, activity, plan, points, status, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
`);

const shops = [
  {
    id: 'shop_1791222058320',
    name: 'مكتبة دانتي الرقمية',
    owner: 'عمار',
    phone: '0555 00 00 00',
    wilaya: '16 - الجزائر',
    wilaya_code: 16,
    activity: 'KIOSK',
    plan: 'PRO_KIOSK',
    points: 350,
    status: 'ACTIVE'
  }
];

for (const s of shops) {
  insertShop.run(s.id, s.name, s.owner, s.phone, s.wilaya, s.wilaya_code, s.activity, s.plan, s.points, s.status);
  console.log(`  ✓ Shop inserted/updated: ${s.name} (${s.id})`);
}

// 2. Seed Users (Super Admin, Shop Admin Ammar)
const insertUser = db.prepare(`
  INSERT OR REPLACE INTO users (id, name, email, secondary_email, phone, password, role, shop_id, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
`);

const superAdminHash = hashPassword('Admin@2026!');
const ammarHash = hashPassword('Dante@2026!');

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
    id: 'user_1791222058365',
    name: 'عمار',
    email: 'admin@dante.com',
    secondary_email: null,
    phone: '0555 00 00 00',
    password: ammarHash,
    role: 'SHOP_ADMIN',
    shop_id: 'shop_1791222058320'
  }
];

for (const u of users) {
  insertUser.run(u.id, u.name, u.email, u.secondary_email, u.phone, u.password, u.role, u.shop_id);
  console.log(`  👑 User inserted/updated: ${u.name} (${u.email}) [Role: ${u.role}]`);
}

console.log('\n[Seeder] 🎉 Seeding completed successfully (Clean, no mock data)!');
const usersInDb = db.prepare('SELECT id, name, email, role FROM users').all();
console.log('[Seeder] Current Users in DB:');
console.table(usersInDb);
