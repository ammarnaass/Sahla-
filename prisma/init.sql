-- 🗄️ Sahla SaaS Production Database Schema (SQLite)
-- Schema aligned with Prisma specifications

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  secondary_email TEXT,
  phone TEXT,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'SHOP_ADMIN',
  shop_id TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS shops (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  owner TEXT NOT NULL,
  phone TEXT NOT NULL,
  wilaya TEXT NOT NULL DEFAULT '16 - الجزائر العاصمة',
  wilaya_code INTEGER NOT NULL DEFAULT 16,
  activity TEXT NOT NULL DEFAULT 'KIOSK',
  plan TEXT NOT NULL DEFAULT 'STARTER',
  points INTEGER NOT NULL DEFAULT 50,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  token TEXT UNIQUE NOT NULL,
  user_id TEXT NOT NULL,
  shop_id TEXT,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS invoices (
  id TEXT PRIMARY KEY,
  invoice_number TEXT UNIQUE NOT NULL,
  shop_id TEXT NOT NULL,
  shop_name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  wilaya TEXT NOT NULL,
  wilaya_code INTEGER NOT NULL DEFAULT 16,
  date TEXT NOT NULL,
  due_date TEXT NOT NULL,
  items_json TEXT NOT NULL,
  subtotal_dzd REAL NOT NULL DEFAULT 0,
  tax_dzd REAL NOT NULL DEFAULT 0,
  stamp_duty_dzd REAL NOT NULL DEFAULT 0,
  total_dzd REAL NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'PENDING',
  payment_method TEXT NOT NULL DEFAULT 'EDAHABIA_CIB',
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cards (
  id TEXT PRIMARY KEY,
  batch_number TEXT NOT NULL,
  serial_number TEXT UNIQUE NOT NULL,
  pin TEXT NOT NULL,
  points INTEGER NOT NULL,
  price_dzd REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'UNREDEEMED',
  shop_id TEXT,
  redeemed_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  shop_id TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  customer_name TEXT,
  file_url TEXT,
  data_snapshot TEXT,
  sale_price_dzd REAL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ledger (
  id TEXT PRIMARY KEY,
  shop_id TEXT NOT NULL,
  description TEXT NOT NULL,
  points_change TEXT NOT NULL,
  balance_after INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE
);

-- 7. جدول البحوث المدرسية (PRD v1.0)
CREATE TABLE IF NOT EXISTS research_docs (
  id TEXT PRIMARY KEY,
  shop_id TEXT NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'RESEARCH',
  level TEXT NOT NULL,
  grade TEXT NOT NULL,
  subject TEXT NOT NULL,
  topic TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'ar',
  page_count INTEGER NOT NULL DEFAULT 3,
  style_level TEXT NOT NULL DEFAULT 'MODERATE',
  cover_template TEXT NOT NULL DEFAULT 'OFFICIAL',
  student_name TEXT,
  school_name TEXT,
  teacher_name TEXT,
  outline_json TEXT NOT NULL,
  content_json TEXT NOT NULL,
  references_json TEXT NOT NULL,
  review_questions_json TEXT,
  points_cost INTEGER NOT NULL DEFAULT 15,
  sale_price_dzd REAL NOT NULL DEFAULT 250,
  status TEXT NOT NULL DEFAULT 'COMPLETED',
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE
);

-- 8. مكتبة الامتحانات الوطنية والفصلية (PRD v1.0)
CREATE TABLE IF NOT EXISTS exams (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  level TEXT NOT NULL,
  grade TEXT NOT NULL,
  stream TEXT,
  subject TEXT NOT NULL,
  trimester INTEGER,
  year INTEGER NOT NULL,
  session TEXT DEFAULT 'REGULAR',
  type TEXT NOT NULL DEFAULT 'OFFICIAL',
  pages_count INTEGER NOT NULL DEFAULT 2,
  has_solution INTEGER NOT NULL DEFAULT 1,
  exam_content TEXT NOT NULL,
  solution_content TEXT,
  marking_rubric TEXT,
  is_free INTEGER NOT NULL DEFAULT 1,
  points_cost INTEGER NOT NULL DEFAULT 0,
  downloads_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 9. جدول بلاغات الأخطاء (PRD v1.0)
CREATE TABLE IF NOT EXISTS error_reports (
  id TEXT PRIMARY KEY,
  shop_id TEXT,
  doc_id TEXT,
  exam_id TEXT,
  issue_type TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 10. جدول خطط الأبحاث المعتمدة (API v1)
CREATE TABLE IF NOT EXISTS research_plans (
  id TEXT PRIMARY KEY,
  shop_id TEXT NOT NULL,
  stage TEXT NOT NULL,
  level INTEGER NOT NULL DEFAULT 1,
  subject TEXT NOT NULL,
  topic TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'ar',
  pages INTEGER NOT NULL DEFAULT 5,
  style TEXT NOT NULL DEFAULT 'moderate',
  options_json TEXT,
  outline_json TEXT NOT NULL,
  cost_points INTEGER NOT NULL DEFAULT 0,
  estimate_points INTEGER NOT NULL DEFAULT 15,
  status TEXT NOT NULL DEFAULT 'ready',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE
);

-- 11. جدول مهام توليد البحوث والأوركسترا (Job Engine & Atomic Wallet)
CREATE TABLE IF NOT EXISTS research_jobs (
  id TEXT PRIMARY KEY,
  plan_id TEXT NOT NULL,
  shop_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued',
  progress INTEGER NOT NULL DEFAULT 0,
  current_step TEXT NOT NULL DEFAULT 'queued',
  reserved_points INTEGER NOT NULL DEFAULT 0,
  settled_points INTEGER NOT NULL DEFAULT 0,
  idempotency_key TEXT UNIQUE,
  cover_json TEXT,
  result_json TEXT,
  error_json TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE
);

-- 12. تتبع خطوات المهام الفردية (Job Steps)
CREATE TABLE IF NOT EXISTS job_steps (
  id TEXT PRIMARY KEY,
  job_id TEXT NOT NULL,
  step_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  duration_ms INTEGER DEFAULT 0,
  output_json TEXT,
  error TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (job_id) REFERENCES research_jobs(id) ON DELETE CASCADE
);

-- 13. سجل تشغيل المهارات المنفصلة وتكلفتها (Skill Runs Telemetry)
CREATE TABLE IF NOT EXISTS skill_runs (
  id TEXT PRIMARY KEY,
  skill_name TEXT NOT NULL,
  job_id TEXT,
  model TEXT NOT NULL,
  input_json TEXT,
  output_json TEXT,
  duration_ms INTEGER DEFAULT 0,
  cost_estimate REAL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 14. جدول مفضلة الامتحانات للمحل
CREATE TABLE IF NOT EXISTS exam_favorites (
  id TEXT PRIMARY KEY,
  shop_id TEXT NOT NULL,
  exam_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE,
  FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
);

-- Indices for rapid B2B lookup
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_invoices_shop ON invoices(shop_id);
CREATE INDEX IF NOT EXISTS idx_cards_serial ON cards(serial_number);
CREATE INDEX IF NOT EXISTS idx_cards_pin ON cards(pin);
CREATE INDEX IF NOT EXISTS idx_research_shop ON research_docs(shop_id);
CREATE INDEX IF NOT EXISTS idx_exams_filter ON exams(level, grade, subject, year);
CREATE INDEX IF NOT EXISTS idx_research_jobs_status ON research_jobs(status, shop_id);
CREATE INDEX IF NOT EXISTS idx_research_jobs_idempotency ON research_jobs(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_skill_runs_job ON skill_runs(job_id);


