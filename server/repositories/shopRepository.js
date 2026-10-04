/**
 * 🏪 مستودع المحلات وشبكة الـ 58 ولاية (Shop Repository)
 */

const JsonStore = require('../storage/jsonStore');
const { DEFAULT_SHOPS } = require('../config/constants');

class ShopRepository {
  constructor() {
    this.store = new JsonStore('shops', DEFAULT_SHOPS);
  }

  getAll() {
    return this.store.getAll();
  }

  findById(id) {
    return this.store.find(s => s.id === id);
  }

  findByPhone(phone) {
    const clean = phone.replace(/[\s\-]/g, '');
    return this.store.find(s => s.phone.replace(/[\s\-]/g, '') === clean);
  }

  create(shop) {
    const newShop = {
      id: shop.id || `shop_${Date.now()}`,
      name: shop.name,
      owner: shop.owner,
      phone: shop.phone,
      wilaya: shop.wilaya,
      wilayaCode: shop.wilayaCode || parseInt(shop.wilaya?.split(' ')[0]) || 16,
      activity: shop.activity || 'KIOSK',
      points: shop.points !== undefined ? shop.points : 50,
      status: shop.status || 'ACTIVE',
      staff: shop.staff || [],
      createdAt: shop.createdAt || new Date().toISOString()
    };
    return this.store.insert(newShop);
  }

  update(id, updates) {
    return this.store.update(s => s.id === id, updates);
  }

  updatePoints(id, delta) {
    return this.store.update(s => s.id === id, shop => ({
      ...shop,
      points: Math.max(0, (shop.points || 0) + Number(delta))
    }));
  }

  toggleStatus(id) {
    return this.store.update(s => s.id === id, shop => ({
      ...shop,
      status: shop.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
    }));
  }

  addStaff(shopId, staffMember) {
    return this.store.update(s => s.id === shopId, shop => {
      const currentStaff = shop.staff || [];
      return {
        ...shop,
        staff: [...currentStaff, staffMember]
      };
    });
  }

  removeStaff(shopId, staffId) {
    return this.store.update(s => s.id === shopId, shop => ({
      ...shop,
      staff: (shop.staff || []).filter(m => m.id !== staffId)
    }));
  }
}

module.exports = new ShopRepository();
