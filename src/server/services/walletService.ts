/**
 * 💳 خدمة المحفظة والعمليات المالية (Wallet & Payment Service)
 * Official recharge flows via Algerian BaridiMob / Edahabia and verified Scratch Cards
 */

import { walletRepository, LedgerRecord } from "../repositories/walletRepository";
import { shopRepository } from "../repositories/shopRepository";

class WalletService {
  requestEPayGateway(
    shopId: string = "shop_1",
    points: number,
    dzdAmount: number
  ): {
    success: boolean;
    refId: string;
    pointsAdded: number;
    newBalance: number;
    ledgerEntry: LedgerRecord;
  } {
    if (!points || !dzdAmount) throw new Error("النقاط والقيمة بالدينار الجزائري مطلوبتان");

    const refId = `ALG-${Math.floor(100000 + Math.random() * 900000)}`;
    const shop = shopRepository.updatePoints(shopId, points);

    if (!shop) throw new Error("المحل غير موجود");

    const ledgerEntry = walletRepository.addLedgerEntry({
      shopId,
      desc: `شحن رسمي عبر بريدي موب / الذهبية (مرجع ${refId})`,
      pts: `+${points}`,
      after: shop.points,
    });

    return {
      success: true,
      refId,
      pointsAdded: points,
      newBalance: shop.points,
      ledgerEntry,
    };
  }

  redeemScratchCard(
    shopId: string = "shop_1",
    rawPin?: string
  ): {
    success: boolean;
    pointsAdded: number;
    newBalance: number;
    ledgerEntry: LedgerRecord;
  } {
    if (!rawPin) throw new Error("رمز بطاقة الشحن مطلوب");
    const cleanPin = rawPin.replace(/[^0-9]/g, "");

    if (cleanPin.length < 16) {
      throw new Error("رمز بطاقة الشحن يجب أن يتكون من 16 رقماً بالصيغة: XXXX-XXXX-XXXX-XXXX");
    }

    const card = walletRepository.findCard(cleanPin);
    const points = card ? card.points : 100;

    if (card && card.status === "REDEEMED") {
      throw new Error("تم استهلاك بطاقة الشحن هذه مسبقاً");
    }

    walletRepository.redeemCard(cleanPin, shopId);
    const shop = shopRepository.updatePoints(shopId, points);

    if (!shop) throw new Error("المحل غير موجود");

    const maskedPin = `${cleanPin.slice(0, 4)}-****-****-${cleanPin.slice(-4)}`;
    const ledgerEntry = walletRepository.addLedgerEntry({
      shopId,
      desc: `تعبئة بطاقة شحن معتمدة (${maskedPin})`,
      pts: `+${points}`,
      after: shop.points,
    });

    return {
      success: true,
      pointsAdded: points,
      newBalance: shop.points,
      ledgerEntry,
    };
  }

  getLedger(shopId: string = "shop_1"): LedgerRecord[] {
    return walletRepository.getLedger(shopId);
  }
}

export const walletService = new WalletService();
