/**
 * 🏪 خدمة إدارة المحلات وطاقم العمل (Shop & Staff Service)
 */

const shopRepository = require('../repositories/shopRepository');
const userRepository = require('../repositories/userRepository');
const authService = require('./authService');
const { ROLES } = require('../config/constants');

class ShopService {
  registerShop(shopData) {
    const { name, owner, phone, wilaya, activity } = shopData;
    if (!name || !owner || !phone || !wilaya) {
      throw new Error('جميع بيانات المحل القانونية مطلوبة للمتابعة');
    }

    const normalizedPhone = authService.normalizePhone(phone);
    const existing = shopRepository.findByPhone(normalizedPhone);

    const newShop = shopRepository.create({
      id: existing ? existing.id : undefined,
      name,
      owner,
      phone: normalizedPhone,
      wilaya,
      activity: activity || 'KIOSK',
      points: existing ? existing.points : 50,
      status: 'ACTIVE'
    });

    // Create or update owner in UserRepository as SHOP_ADMIN
    const existingUser = userRepository.findByPhone(normalizedPhone);
    let user;
    if (existingUser) {
      user = userRepository.update(existingUser.id, {
        name: owner,
        role: ROLES.SHOP_ADMIN,
        shopId: newShop.id
      });
    } else {
      user = userRepository.create({
        name: owner,
        phone: normalizedPhone,
        role: ROLES.SHOP_ADMIN,
        shopId: newShop.id
      });
    }

    return { shop: newShop, user };
  }

  getShop(shopId) {
    const shop = shopRepository.findById(shopId);
    if (!shop) throw new Error('المحل غير موجود');
    return shop;
  }

  updateProfile(shopId, updates) {
    const shop = shopRepository.update(shopId, updates);
    if (!shop) throw new Error('المحل غير موجود');
    return shop;
  }

  getStaff(shopId = 'shop_1') {
    const shop = shopRepository.findById(shopId) || shopRepository.getAll()[0];
    return shop ? (shop.staff || []) : [];
  }

  addStaff(shopId = 'shop_1', staffData) {
    const { name, phone } = staffData;
    if (!name || !phone) throw new Error('اسم الموظف ورقم هاتفه مطلوبان');

    const normalized = authService.normalizePhone(phone);
    const shop = shopRepository.findById(shopId) || shopRepository.getAll()[0];

    const staffMember = {
      id: `staff_${Date.now()}`,
      name,
      phone: normalized,
      role: ROLES.STAFF,
      addedAt: new Date().toISOString().split('T')[0]
    };

    shopRepository.addStaff(shop.id, staffMember);

    // Register user in UserRepository
    userRepository.create({
      id: `user_${Date.now()}`,
      name,
      phone: normalized,
      role: ROLES.STAFF,
      shopId: shop.id
    });

    return staffMember;
  }

  removeStaff(shopId = 'shop_1', staffId) {
    const shop = shopRepository.findById(shopId) || shopRepository.getAll()[0];
    const targetStaff = (shop.staff || []).find(s => s.id === staffId);

    shopRepository.removeStaff(shop.id, staffId);

    if (targetStaff) {
      userRepository.deleteByPhone(targetStaff.phone);
    }

    return { success: true, message: 'تم إزالة الموظف بنجاح' };
  }
}

module.exports = new ShopService();
