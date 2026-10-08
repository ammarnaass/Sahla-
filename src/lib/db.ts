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
      globalThis.sahlaSqliteGlobal.exec("PRAGMA journal_mode = WAL;");
      globalThis.sahlaSqliteGlobal.exec("PRAGMA busy_timeout = 5000;");
      globalThis.sahlaSqliteGlobal.exec("PRAGMA foreign_keys = ON;");
      globalThis.sahlaSqliteGlobal.exec("PRAGMA synchronous = NORMAL;");
    } catch {
      // Optional pragmas
    }
  }
  return globalThis.sahlaSqliteGlobal;
}

export const sqliteDb = getDatabase();
export const db = sqliteDb;
export default sqliteDb;
