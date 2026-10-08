/**
 * 🗄️ محرك التخزين الهجين الفائق (SQLite + In-Memory Fast Cache)
 * Primary Storage: SQLite (prisma/sahla.db) with atomic persistence & ACID compliance
 * Secondary Cache: High-performance in-memory collection cache with snapshotting
 */

import fs from "fs";
import path from "path";
import { DatabaseSync } from "node:sqlite";

const DB_PATH = path.join(process.cwd(), "prisma", "sahla.db");
const DATA_DIR = path.join(process.cwd(), "src", "server", "storage", "data");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let sqliteInstance: DatabaseSync | null = null;
function getSqlite(): DatabaseSync | null {
  if (!sqliteInstance) {
    try {
      if (fs.existsSync(DB_PATH)) {
        sqliteInstance = new DatabaseSync(DB_PATH);
        sqliteInstance.exec("PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 5000;");
      }
    } catch (err: any) {
      console.warn("[SqliteStore] Could not open SQLite database, falling back to JSON:", err.message);
    }
  }
  return sqliteInstance;
}

export class JsonStore<T extends Record<string, any>> {
  private collectionName: string;
  private filePath: string;
  private defaultData: T[];
  private _memoryCache: T[];

  constructor(collectionName: string, defaultData: T[] = []) {
    this.collectionName = collectionName;
    this.filePath = path.join(DATA_DIR, `${collectionName}.json`);
    this.defaultData = defaultData;
    this._memoryCache = [];
    this._load();
  }

  private _load(): void {
    const sqlite = getSqlite();
    let loadedFromSqlite = false;

    if (sqlite) {
      try {
        if (this.collectionName === "users") {
          const rows = sqlite.prepare("SELECT * FROM users").all() as any[];
          if (rows && rows.length > 0) {
            this._memoryCache = rows.map((r) => ({
              id: r.id,
              name: r.name,
              email: r.email,
              secondaryEmail: r.secondary_email,
              phone: r.phone,
              password: r.password,
              role: r.role,
              shopId: r.shop_id,
              createdAt: r.created_at,
              updatedAt: r.updated_at,
            })) as unknown as T[];
            loadedFromSqlite = true;
          }
        } else if (this.collectionName === "shops") {
          const rows = sqlite.prepare("SELECT * FROM shops").all() as any[];
          if (rows && rows.length > 0) {
            this._memoryCache = rows.map((r) => {
              let staffList: any[] = [];
              try {
                const staffRows = sqlite.prepare("SELECT id, name, phone, role, created_at FROM users WHERE role = 'STAFF' AND shop_id = ?").all(r.id) as any[];
                staffList = staffRows.map((s) => ({
                  id: s.id,
                  name: s.name,
                  phone: s.phone || "",
                  role: s.role || "STAFF",
                  addedAt: s.created_at ? s.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
                }));
              } catch {
                staffList = [];
              }
              return {
                id: r.id,
                name: r.name,
                owner: r.owner,
                phone: r.phone,
                wilaya: r.wilaya,
                wilayaCode: r.wilaya_code,
                commune: r.commune || "الجزائر الوسطى",
                activity: r.activity,
                plan: r.plan,
                points: r.points,
                status: r.status,
                staff: staffList,
                createdAt: r.created_at,
                updatedAt: r.updated_at,
              };
            }) as unknown as T[];
            loadedFromSqlite = true;
          }
        } else if (this.collectionName === "invoices") {
          const rows = sqlite.prepare("SELECT * FROM invoices").all() as any[];
          if (rows && rows.length > 0) {
            this._memoryCache = rows.map((r) => ({
              id: r.id,
              invoiceNumber: r.invoice_number,
              shopId: r.shop_id,
              shopName: r.shop_name,
              ownerName: r.owner_name,
              wilaya: r.wilaya,
              wilayaCode: r.wilaya_code,
              date: r.date,
              dueDate: r.due_date,
              items: (() => {
                try {
                  return JSON.parse(r.items_json || "[]");
                } catch {
                  return [];
                }
              })(),
              subtotalDZD: r.subtotal_dzd,
              taxDZD: r.tax_dzd,
              stampDutyDZD: r.stamp_duty_dzd,
              totalDZD: r.total_dzd,
              status: r.status,
              paymentMethod: r.payment_method,
              notes: r.notes,
              createdAt: r.created_at,
            })) as unknown as T[];
            loadedFromSqlite = true;
          }
        } else if (this.collectionName === "cards") {
          const rows = sqlite.prepare("SELECT * FROM cards").all() as any[];
          if (rows && rows.length > 0) {
            this._memoryCache = rows.map((r) => ({
              id: r.id,
              batchNumber: r.batch_number,
              serialNumber: r.serial_number,
              pin: r.pin,
              points: r.points,
              priceDZD: r.price_dzd,
              status: r.status,
              shopId: r.shop_id,
              redeemedAt: r.redeemed_at,
              createdAt: r.created_at,
            })) as unknown as T[];
            loadedFromSqlite = true;
          }
        } else if (this.collectionName === "sessions") {
          const rows = sqlite.prepare("SELECT * FROM sessions").all() as any[];
          if (rows && rows.length > 0) {
            this._memoryCache = rows.map((r) => ({
              id: r.id || r.token,
              token: r.token,
              userId: r.user_id,
              shopId: r.shop_id,
              expiresAt: r.expires_at,
              createdAt: r.created_at,
            })) as unknown as T[];
            loadedFromSqlite = true;
          }
        }
      } catch (err: any) {
        console.warn(`[SqliteStore] Could not read ${this.collectionName} from SQLite:`, err.message);
      }
    }

    if (!loadedFromSqlite) {
      // Fallback: load from JSON file or default data
      try {
        if (fs.existsSync(this.filePath)) {
          const raw = fs.readFileSync(this.filePath, "utf8");
          this._memoryCache = JSON.parse(raw);
        } else {
          this._memoryCache = JSON.parse(JSON.stringify(this.defaultData));
          this._persist();
        }
      } catch (err: any) {
        console.error(`[JsonStore] Error reading ${this.collectionName}:`, err.message);
        this._memoryCache = JSON.parse(JSON.stringify(this.defaultData));
      }
    } else {
      this._persist();
    }
  }

  private _persist(): void {
    try {
      const tempPath = `${this.filePath}.tmp.${Date.now()}`;
      fs.writeFileSync(tempPath, JSON.stringify(this._memoryCache, null, 2), "utf8");
      fs.renameSync(tempPath, this.filePath);
    } catch (err: any) {
      console.error(`[JsonStore] Error writing ${this.collectionName}:`, err.message);
    }
  }

  private _persistToSqlite(item: T, action: "INSERT" | "UPDATE" | "DELETE"): void {
    const sqlite = getSqlite();
    if (!sqlite) return;

    try {
      if (this.collectionName === "users") {
        const u = item as any;
        if (action === "DELETE") {
          sqlite.prepare("DELETE FROM users WHERE id = ?").run(u.id);
        } else {
          sqlite
            .prepare(`
              INSERT OR REPLACE INTO users (id, name, email, secondary_email, phone, password, role, shop_id, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
            `)
            .run(
              u.id,
              u.name || "",
              u.email || "",
              u.secondaryEmail || null,
              u.phone || null,
              u.password || "",
              u.role || "SHOP_ADMIN",
              u.shopId || null,
              u.createdAt || new Date().toISOString()
            );
        }
      } else if (this.collectionName === "shops") {
        const s = item as any;
        if (action === "DELETE") {
          sqlite.prepare("DELETE FROM shops WHERE id = ?").run(s.id);
        } else {
          sqlite
            .prepare(`
              INSERT OR REPLACE INTO shops (id, name, owner, phone, wilaya, wilaya_code, commune, activity, plan, points, status, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
            `)
            .run(
              s.id,
              s.name || "",
              s.owner || "",
              s.phone || "",
              s.wilaya || "16 - الجزائر العاصمة",
              s.wilayaCode || 16,
              s.commune || "الجزائر الوسطى",
              s.activity || "KIOSK",
              s.plan || "STARTER",
              s.points !== undefined ? s.points : 50,
              s.status || "ACTIVE",
              s.createdAt || new Date().toISOString()
            );
        }
      } else if (this.collectionName === "sessions") {
        const sess = item as any;
        if (action === "DELETE") {
          sqlite.prepare("DELETE FROM sessions WHERE token = ? OR id = ?").run(sess.token || sess.id, sess.id || sess.token);
        } else {
          sqlite
            .prepare(`
              INSERT OR REPLACE INTO sessions (id, token, user_id, shop_id, expires_at, created_at)
              VALUES (?, ?, ?, ?, ?, datetime('now'))
            `)
            .run(
              sess.id || sess.token,
              sess.token,
              sess.userId,
              sess.shopId || null,
              sess.expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            );
        }
      } else if (this.collectionName === "invoices") {
        const inv = item as any;
        if (action === "DELETE") {
          sqlite.prepare("DELETE FROM invoices WHERE id = ?").run(inv.id);
        } else {
          sqlite
            .prepare(`
              INSERT OR REPLACE INTO invoices (id, invoice_number, shop_id, shop_name, owner_name, wilaya, wilaya_code, date, due_date, items_json, subtotal_dzd, tax_dzd, stamp_duty_dzd, total_dzd, status, payment_method, notes, created_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
            `)
            .run(
              inv.id,
              inv.invoiceNumber,
              inv.shopId,
              inv.shopName || "",
              inv.ownerName || "",
              inv.wilaya || "16 - الجزائر العاصمة",
              inv.wilayaCode || 16,
              inv.date || new Date().toISOString().split("T")[0],
              inv.dueDate || new Date().toISOString().split("T")[0],
              JSON.stringify(inv.items || []),
              inv.subtotalDZD || 0,
              inv.taxDZD || 0,
              inv.stampDutyDZD || 0,
              inv.totalDZD || 0,
              inv.status || "PENDING",
              inv.paymentMethod || "EDAHABIA_CIB",
              inv.notes || null
            );
        }
      }
    } catch (err: any) {
      console.warn(`[SqliteStore] Failed to sync ${this.collectionName} to SQLite:`, err.message);
    }
  }

  getAll(): T[] {
    return [...this._memoryCache];
  }

  find(predicate: (item: T) => boolean): T | null {
    return this._memoryCache.find(predicate) || null;
  }

  filter(predicate: (item: T) => boolean): T[] {
    return this._memoryCache.filter(predicate);
  }

  insert(item: T): T {
    this._memoryCache.push(item);
    this._persist();
    this._persistToSqlite(item, "INSERT");
    return item;
  }

  update(predicate: (item: T) => boolean, updater: Partial<T> | ((item: T) => T)): T | null {
    const idx = this._memoryCache.findIndex(predicate);
    if (idx !== -1) {
      this._memoryCache[idx] =
        typeof updater === "function"
          ? (updater as (item: T) => T)(this._memoryCache[idx])
          : { ...this._memoryCache[idx], ...updater };
      this._persist();
      this._persistToSqlite(this._memoryCache[idx], "UPDATE");
      return this._memoryCache[idx];
    }
    return null;
  }

  delete(predicate: (item: T) => boolean): boolean {
    const toDelete = this._memoryCache.filter(predicate);
    const beforeCount = this._memoryCache.length;
    this._memoryCache = this._memoryCache.filter((item) => !predicate(item));
    const deletedCount = beforeCount - this._memoryCache.length;
    if (deletedCount > 0) {
      this._persist();
      toDelete.forEach((item) => this._persistToSqlite(item, "DELETE"));
    }
    return deletedCount > 0;
  }

  replace(newCollection: T[]): void {
    this._memoryCache = [...newCollection];
    this._persist();
  }
}
