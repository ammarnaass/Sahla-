/**
 * 🗄️ Sahla SaaS Production Database Connection (SQLite Engine)
 * Direct, low-latency, zero-dependency connection to prisma/sahla.db
 */

import { DatabaseSync } from "node:sqlite";
import path from "path";

declare global {
  // eslint-disable-next-line no-var
  var sahlaSqliteGlobal: DatabaseSync | undefined;
}

const DB_PATH = path.join(process.cwd(), "prisma", "sahla.db");

export function getDatabase(): DatabaseSync {
  if (!globalThis.sahlaSqliteGlobal) {
    globalThis.sahlaSqliteGlobal = new DatabaseSync(DB_PATH);
    try {
      globalThis.sahlaSqliteGlobal.exec("PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 5000; PRAGMA foreign_keys = ON;");
    } catch {
      // WAL pragma optional if already set
    }
  }
  return globalThis.sahlaSqliteGlobal;
}

export const sqliteDb = getDatabase();
export const db = sqliteDb;
export default sqliteDb;
