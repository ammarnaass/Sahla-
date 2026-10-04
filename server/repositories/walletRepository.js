/**
 * 💳 مستودع المحفظة ودفتر الأستاذ (Wallet & Ledger Repository)
 */

const JsonStore = require('../storage/jsonStore');

const DEFAULT_LEDGER = [
  { id: 'tx_1', shopId: 'shop_1', desc: 'رصيد ترحيبي معتمد', pts: '+50', after: 50, date: '2026-03-01' },
  { id: 'tx_2', shopId: 'shop_1', desc: 'شحن رصيد رسمي معتمد (+100 نقطة)', pts: '+100', after: 150, date: '2026-03-05' },
  { id: 'tx_3', shopId: 'shop_1', desc: 'إنشاء سيرة ذاتية (سفيان بلقاسم)', pts: '-10', after: 140, date: '2026-03-10' }
];

const DEFAULT_CARDS = [
  { pin: '9845-2134-8765-1029', points: 100, status: 'UNREDEEMED' },
  { pin: '4512-7890-3344-9911', points: 150, status: 'UNREDEEMED' },
  { pin: '7721-6543-0098-5544', points: 500, status: 'UNREDEEMED' }
];

class WalletRepository {
  constructor() {
    this.ledgerStore = new JsonStore('ledger', DEFAULT_LEDGER);
    this.cardsStore = new JsonStore('cards', DEFAULT_CARDS);
  }

  getLedger(shopId) {
    return this.ledgerStore.filter(entry => !shopId || entry.shopId === shopId);
  }

  addLedgerEntry(entry) {
    const newEntry = {
      id: entry.id || `tx_${Date.now()}`,
      shopId: entry.shopId || 'shop_1',
      desc: entry.desc,
      pts: entry.pts,
      after: entry.after,
      date: entry.date || new Date().toISOString().split('T')[0]
    };
    return this.ledgerStore.insert(newEntry);
  }

  findCard(pin) {
    const clean = pin.replace(/[^0-9]/g, '');
    return this.cardsStore.find(c => c.pin.replace(/[^0-9]/g, '') === clean);
  }

  redeemCard(pin, shopId) {
    const clean = pin.replace(/[^0-9]/g, '');
    return this.cardsStore.update(
      c => c.pin.replace(/[^0-9]/g, '') === clean && c.status === 'UNREDEEMED',
      card => ({
        ...card,
        status: 'REDEEMED',
        redeemedBy: shopId,
        redeemedAt: new Date().toISOString()
      })
    );
  }
}

module.exports = new WalletRepository();
