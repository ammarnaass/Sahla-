/**
 * 👑 خدمة الإدارة الوطنية للمنصة المركزية (Admin Service)
 * National KPI monitoring, shop status toggle, and administrative topups across 58 Wilayas
 */

const shopRepository = require('../repositories/shopRepository');
const userRepository = require('../repositories/userRepository');
const documentRepository = require('../repositories/documentRepository');
const walletRepository = require('../repositories/walletRepository');

class AdminService {
  getNationalOverview() {
    const shops = shopRepository.getAll();
    const users = userRepository.getAll();
    const activeShops = shops.filter(s => s.status === 'ACTIVE').length;
    const totalPoints = shops.reduce((sum, s) => sum + (s.points || 0), 0);
    const totalDocs = documentRepository.totalCount();
    const totalRevenueDZD = totalDocs * 250; // Average transaction value

    return {
      success: true,
      stats: {
        totalShops: shops.length,
        activeShops,
        totalPointsInCirculation: totalPoints,
        totalPoints,
        nationalDocumentsCount: totalDocs,
        totalDocs,
        estimatedRevenueDZD: totalRevenueDZD,
        totalRevenueDzd: totalRevenueDZD
      },
      shops,
      users
    };
  }

  topupShop(shopId, points = 50) {
    if (!shopId) throw new Error('معرف المحل مطلوب');
    const pointsNum = Number(points);
    const shop = shopRepository.updatePoints(shopId, pointsNum);
    if (!shop) throw new Error('المحل غير موجود');

    walletRepository.addLedgerEntry({
      shopId,
      desc: `شحن إداري معتمد من مدير النظام (+${pointsNum} نقطة)`,
      pts: `+${pointsNum}`,
      after: shop.points
    });

    return { success: true, shop };
  }

  toggleShopStatus(shopId) {
    if (!shopId) throw new Error('معرف المحل مطلوب');
    const shop = shopRepository.toggleStatus(shopId);
    if (!shop) throw new Error('المحل غير موجود');
    return { success: true, shop };
  }
}

module.exports = new AdminService();
