/**
 * 💳 مستودع المحفظة ودفتر الأستاذ (Wallet & Ledger Repository)
 * Direct SQLite production database repository
 */

import { db } from "@/lib/db";

export interface LedgerRecord {
  id: string;
  shopId: string;
  desc: string;
  pts: string; // e.g., "+100" or "-10"
  after: number;
  date: string;
}

export interface CardRecord {
  pin: string;
  serialNumber?: string;
  points: number;
  priceDZD?: number;
  status: "UNREDEEMED" | "REDEEMED" | "REVOKED";
  redeemedBy?: string;
  redeemedAt?: string;
  batchNumber?: string;
  createdAt?: string;
}

class WalletRepository {
  getLedger(shopId?: string): LedgerRecord[] {
    const query = shopId
      ? `SELECT id, shop_id as shopId, description as desc, points_change as pts, balance_after as after, created_at as date
         FROM ledger
         WHERE shop_id = ?
         ORDER BY id DESC
         LIMIT 50`
      : `SELECT id, shop_id as shopId, description as desc, points_change as pts, balance_after as after, created_at as date
         FROM ledger
         ORDER BY id DESC
         LIMIT 50`;

    const rows: any[] = shopId ? db.prepare(query).all(shopId) : db.prepare(query).all();
    return rows.map((r) => ({
      id: r.id,
      shopId: r.shopId,
      desc: r.desc,
      pts: r.pts,
      after: r.after,
      date: r.date,
    }));
  }

  addLedgerEntry(entry: Partial<LedgerRecord>): LedgerRecord {
    const id = entry.id || `tx_${Date.now()}`;
    const shopId = entry.shopId || "shop_1791222058320";
    const desc = entry.desc || "عملية رصيد";
    const pts = entry.pts || "0";
    const after = entry.after !== undefined ? entry.after : 0;
    const date = entry.date || new Date().toISOString().replace("T", " ").substring(0, 19);

    db.prepare(`
      INSERT INTO ledger (id, shop_id, description, points_change, balance_after, created_at)
      VALUES (?, ?, ?, ?, ?, datetime('now'))
    `).run(id, shopId, desc, pts, after);

    return { id, shopId, desc, pts, after, date };
  }

  findCard(pin: string): CardRecord | null {
    const clean = pin.replace(/[-\s]/g, "").trim().toUpperCase();
    const card: any = db.prepare(`
      SELECT id, batch_number as batchNumber, serial_number as serialNumber, pin, points, price_dzd as priceDZD, status, shop_id as redeemedBy, redeemed_at as redeemedAt, created_at as createdAt
      FROM cards
      WHERE replace(pin, '-', '') = ? OR pin = ?
    `).get(clean, pin);

    if (!card) return null;
    return {
      pin: card.pin,
      serialNumber: card.serialNumber,
      points: card.points,
      priceDZD: card.priceDZD,
      status: card.status,
      redeemedBy: card.redeemedBy,
      redeemedAt: card.redeemedAt,
      batchNumber: card.batchNumber,
      createdAt: card.createdAt,
    };
  }

  getAllCards(): CardRecord[] {
    const rows: any[] = db.prepare(`
      SELECT pin, serial_number as serialNumber, points, price_dzd as priceDZD, status, shop_id as redeemedBy, redeemed_at as redeemedAt, batch_number as batchNumber, created_at as createdAt
      FROM cards
      ORDER BY id DESC
    `).all();
    return rows;
  }

  generateBatchCards(count: number, points: number, priceDZD: number, batchNumber: string): CardRecord[] {
    const generated: CardRecord[] = [];
    const insertStmt = db.prepare(`
      INSERT INTO cards (id, batch_number, serial_number, pin, points, price_dzd, status, shop_id, redeemed_at, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 'UNREDEEMED', NULL, NULL, datetime('now'))
    `);

    for (let i = 0; i < count; i++) {
      const p1 = Math.floor(1000 + Math.random() * 9000);
      const p2 = Math.floor(1000 + Math.random() * 9000);
      const p3 = Math.floor(1000 + Math.random() * 9000);
      const p4 = Math.floor(1000 + Math.random() * 9000);
      const pin = `${p1}-${p2}-${p3}-${p4}`;
      const serialNumber = `SAHLA-${batchNumber}-${String(i + 1).padStart(4, "0")}`;
      const id = `card_${Date.now()}_${i}`;

      insertStmt.run(id, batchNumber, serialNumber, pin, points, priceDZD);

      generated.push({
        pin,
        serialNumber,
        points,
        priceDZD,
        batchNumber,
        status: "UNREDEEMED",
        createdAt: new Date().toISOString(),
      });
    }
    return generated;
  }

  redeemCard(pin: string, shopId: string): CardRecord | null {
    const clean = pin.replace(/[-\s]/g, "").trim().toUpperCase();
    const card: any = db.prepare(`
      SELECT id, status FROM cards WHERE (replace(pin, '-', '') = ? OR pin = ?) AND status = 'UNREDEEMED'
    `).get(clean, pin);

    if (!card) return null;

    db.prepare(`
      UPDATE cards
      SET status = 'REDEEMED', shop_id = ?, redeemed_at = datetime('now')
      WHERE id = ?
    `).run(shopId, card.id);

    return this.findCard(pin);
  }
}

export const walletRepository = new WalletRepository();
