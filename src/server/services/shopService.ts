/**
 * 🏪 خدمة إدارة المحلات وطاقم العمل (Shop & Staff Service)
 */

import { shopRepository, ShopRecord, StaffMember } from "../repositories/shopRepository";
import { userRepository } from "../repositories/userRepository";
import { authService } from "./authService";
import { ROLES } from "../config/constants";

class ShopService {
  registerShop(shopData: {
    name: string;
    owner: string;
    phone: string;
    wilaya: string;
    activity?: string;
  }): { shop: ShopRecord; user: any } {
    const { name, owner, phone, wilaya, activity } = shopData;
    if (!name || !owner || !phone || !wilaya) {
      throw new Error("جميع بيانات المحل القانونية مطلوبة للمتابعة");
    }

    const normalizedPhone = authService.normalizePhone(phone);
    const existing = shopRepository.findByPhone(normalizedPhone);

    const newShop = shopRepository.create({
      id: existing ? existing.id : undefined,
      name,
      owner,
      phone: normalizedPhone,
      wilaya,
      activity: activity || "KIOSK",
      points: existing ? existing.points : 50,
      status: "ACTIVE",
    });

    const existingUser = userRepository.findByPhone(normalizedPhone);
    let user;
    if (existingUser) {
      user = userRepository.update(existingUser.id, {
        name: owner,
        role: ROLES.SHOP_ADMIN,
        shopId: newShop.id,
      });
    } else {
      user = userRepository.create({
        name: owner,
        phone: normalizedPhone,
        role: ROLES.SHOP_ADMIN,
        shopId: newShop.id,
      });
    }

    return { shop: newShop, user };
  }

  getShop(shopId: string): ShopRecord {
    if (!shopId) throw new Error("معرف المحل مطلوب");
    const shop = shopRepository.findById(shopId);
    if (!shop) throw new Error("المحل غير موجود");
    return shop;
  }

  updateProfile(shopId: string, updates: Partial<ShopRecord>): ShopRecord {
    if (!shopId) throw new Error("معرف المحل مطلوب لتحديث البيانات");
    const targetShop = shopRepository.findById(shopId);
    if (!targetShop) throw new Error("المحل غير موجود");

    const shop = shopRepository.update(targetShop.id, updates);
    if (!shop) throw new Error("تعذر تحديث بيانات المحل");

    if (updates.owner) {
      const ownerUser = userRepository.getAll().find(
        (u) => u.shopId === targetShop.id && u.role === ROLES.SHOP_ADMIN
      );
      if (ownerUser) {
        userRepository.update(ownerUser.id, { name: updates.owner });
      }
    }

    return shop;
  }

  getStaff(shopId: string): StaffMember[] {
    if (!shopId) return [];
    const shop = shopRepository.findById(shopId);
    if (!shop) return [];

    const dbStaff = userRepository.findByShop(shopId).filter((u) => u.role === ROLES.STAFF);
    const staffMap = new Map<string, StaffMember>();

    // Add from shop.staff
    (shop.staff || []).forEach((s) => staffMap.set(s.id, s));

    // Merge from userRepository without duplicates
    dbStaff.forEach((u) => {
      const exists = Array.from(staffMap.values()).some((s) => s.phone === u.phone || s.id === u.id);
      if (!exists) {
        staffMap.set(u.id, {
          id: u.id,
          name: u.name,
          phone: u.phone || "",
          role: ROLES.STAFF,
          addedAt: u.createdAt ? u.createdAt.split("T")[0] : new Date().toISOString().split("T")[0],
        });
      }
    });

    return Array.from(staffMap.values());
  }

  addStaff(shopId: string, staffData: { name: string; phone: string }): StaffMember {
    const { name, phone } = staffData;
    if (!name || !name.trim()) throw new Error("اسم الموظف مطلوب");
    if (!phone || !phone.trim()) throw new Error("رقم هاتف الموظف مطلوب");

    const normalized = authService.normalizePhone(phone);
    if (!normalized || normalized.length !== 10) {
      throw new Error("رقم الهاتف يجب أن يكون رقماً جزائرياً صالحاً من 10 أرقام (05, 06, 07)");
    }

    if (!shopId) throw new Error("معرف المحل مطلوب لإضافة موظف");
    const shop = shopRepository.findById(shopId);
    if (!shop) throw new Error("المحل غير موجود");

    // Check staff quota based on subscription plan
    const currentStaff = this.getStaff(shop.id);
    const planLimit = shop.plan === "ENTERPRISE" ? 10 : shop.plan === "PRO_KIOSK" ? 3 : 1;
    if (currentStaff.length >= planLimit) {
      throw new Error(
        `لقد بلغت الحد الأقصى لطاقم العمل في باقتك (${planLimit} موظفين). يرجى ترقية الباقة لإضافة موظفين جدد.`
      );
    }

    // Check if employee already exists in this shop
    const existing = currentStaff.find((s) => s.phone === normalized);
    if (existing) {
      throw new Error("هذا الموظف مسجل بالفعل برقم الهاتف هذا في طاقم المحل");
    }

    const staffMember: StaffMember = {
      id: `staff_${Date.now()}`,
      name: name.trim(),
      phone: normalized,
      role: ROLES.STAFF,
      addedAt: new Date().toISOString().split("T")[0],
    };

    shopRepository.addStaff(shop.id, staffMember);

    // Persist real user for authentication
    const existingUser = userRepository.findByPhone(normalized);
    if (existingUser) {
      userRepository.update(existingUser.id, {
        name: name.trim(),
        role: ROLES.STAFF,
        shopId: shop.id,
      });
    } else {
      userRepository.create({
        id: `user_${Date.now()}`,
        name: name.trim(),
        phone: normalized,
        role: ROLES.STAFF,
        shopId: shop.id,
      });
    }

    return staffMember;
  }

  removeStaff(shopId: string, staffId: string): { success: boolean; message: string } {
    if (!shopId) throw new Error("معرف المحل مطلوب");
    const shop = shopRepository.findById(shopId);
    if (!shop) throw new Error("المحل غير موجود");

    const targetStaff = (shop.staff || []).find((s) => s.id === staffId);
    shopRepository.removeStaff(shop.id, staffId);

    if (targetStaff && targetStaff.phone) {
      userRepository.deleteByPhone(targetStaff.phone);
    }
    const directUser = userRepository.findById(staffId);
    if (directUser && directUser.shopId === shop.id) {
      userRepository.delete(directUser.id);
    }

    return { success: true, message: "تم إلغاء وصول الموظف بنجاح" };
  }
}

export const shopService = new ShopService();
