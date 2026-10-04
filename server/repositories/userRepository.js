/**
 * 👤 مستودع المستخدمين (User Repository)
 */

const JsonStore = require('../storage/jsonStore');
const { DEFAULT_USERS } = require('../config/constants');

class UserRepository {
  constructor() {
    this.store = new JsonStore('users', DEFAULT_USERS);
  }

  getAll() {
    return this.store.getAll();
  }

  findById(id) {
    return this.store.find(u => u.id === id);
  }

  findByPhone(normalizedPhone) {
    return this.store.find(u => u.phone.replace(/[\s\-]/g, '') === normalizedPhone.replace(/[\s\-]/g, ''));
  }

  findByShop(shopId) {
    return this.store.filter(u => u.shopId === shopId);
  }

  create(user) {
    const newUser = {
      id: user.id || `user_${Date.now()}`,
      name: user.name,
      phone: user.phone,
      role: user.role || 'SHOP_ADMIN',
      shopId: user.shopId || null,
      createdAt: user.createdAt || new Date().toISOString()
    };
    return this.store.insert(newUser);
  }

  update(id, updates) {
    return this.store.update(u => u.id === id, updates);
  }

  delete(id) {
    return this.store.delete(u => u.id === id);
  }

  deleteByPhone(phone) {
    return this.store.delete(u => u.phone === phone);
  }
}

module.exports = new UserRepository();
