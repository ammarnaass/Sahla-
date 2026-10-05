/**
 * 💳 مستودع المحفظة ودفتر الأستاذ (Wallet & Ledger Repository)
 * Manages ledger transactions, scratch cards & payment reconciliation
 */

import { JsonStore } from "../storage/jsonStore";

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

const DEFAULT_LEDGER: LedgerRecord[] = [
  { id: "tx_1", shopId: "shop_1", desc: "رصيد ترحيبي معتمد", pts: "+50", after: 50, date: "2026-03-01" },
  { id: "tx_2", shopId: "shop_1", desc: "شحن رصيد رسمي معتمد (+100 نقطة)", pts: "+100", after: 150, date: "2026-03-05" },
  { id: "tx_3", shopId: "shop_1", desc: "إنشاء سيرة ذاتية (سفيان بلقاسم)", pts: "-10", after: 140, date: "2026-03-10" },
];

const DEFAULT_CARDS: CardRecord[] = [
  { pin: "9845-2134-8765-1029", serialNumber: "DZ-2026-0001", points: 100, priceDZD: 1000, status: "UNREDEEMED" },
  { pin: "4512-7890-3344-9911", serialNumber: "DZ-2026-0002", points: 150, priceDZD: 1500, status: "UNREDEEMED" },
  { pin: "7721-6543-0098-5544", serialNumber: "DZ-2026-0003", points: 500, priceDZD: 4500, status: "UNREDEEMED" },
];

class WalletRepository {
  private ledgerStore: JsonStore<LedgerRecord>;
  private cardsStore: JsonStore<CardRecord>;

  constructor() {
    this.ledgerStore = new JsonStore<LedgerRecord>("ledger", DEFAULT_LEDGER);
    this.cardsStore = new JsonStore<CardRecord>("cards", DEFAULT_CARDS);
  }

  getLedger(shopId?: string): LedgerRecord[] {
    return this.ledgerStore.filter((entry) => !shopId || entry.shopId === shopId);
  }

  addLedgerEntry(entry: Partial<LedgerRecord>): LedgerRecord {
    const newEntry: LedgerRecord = {
      id: entry.id || `tx_${Date.now()}`,
      shopId: entry.shopId || "shop_1",
      desc: entry.desc || "عملية رصيد",
      pts: entry.pts || "0",
      after: entry.after !== undefined ? entry.after : 0,
      date: entry.date || new Date().toISOString().split("T")[0],
    };
    return this.ledgerStore.insert(newEntry);
  }

  findCard(pin: string): CardRecord | null {
    const clean = pin.replace(/[^0-9]/g, "");
    return this.cardsStore.find((c) => c.pin.replace(/[^0-9]/g, "") === clean);
  }

  getAllCards(): CardRecord[] {
    return this.cardsStore.getAll();
  }

  generateBatchCards(count: number, points: number, priceDZD: number, batchNumber: string): CardRecord[] {
    const generated: CardRecord[] = [];
    for (let i = 0; i < count; i++) {
      const p1 = Math.floor(1000 + Math.random() * 9000);
      const p2 = Math.floor(1000 + Math.random() * 9000);
      const p3 = Math.floor(1000 + Math.random() * 9000);
      const p4 = Math.floor(1000 + Math.random() * 9000);
      const pin = `${p1}-${p2}-${p3}-${p4}`;
      const serialNumber = `SAHLA-${batchNumber}-${String(i + 1).padStart(4, "0")}`;

      const card: CardRecord = {
        pin,
        serialNumber,
        points,
        priceDZD,
        batchNumber,
        status: "UNREDEEMED",
        createdAt: new Date().toISOString(),
      };
      this.cardsStore.insert(card);
      generated.push(card);
    }
    return generated;
  }

  redeemCard(pin: string, shopId: string): CardRecord | null {
    const clean = pin.replace(/[^0-9]/g, "");
    return this.cardsStore.update(
      (c) => c.pin.replace(/[^0-9]/g, "") === clean && c.status === "UNREDEEMED",
      (card) => ({
        ...card,
        status: "REDEEMED",
        redeemedBy: shopId,
        redeemedAt: new Date().toISOString(),
      })
    );
  }
}

export const walletRepository = new WalletRepository();
