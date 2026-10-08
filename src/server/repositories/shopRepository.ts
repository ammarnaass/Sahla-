/**
 * 🏪 مستودع المحلات وشبكة الـ 58 ولاية (Shop Repository)
 * Multi-Tenant Shop Storage with SaaS Subscription Support
 */

import { JsonStore } from "../storage/jsonStore";
import { DEFAULT_SHOPS } from "../config/constants";

export interface StaffMember {
  id: string;
  name: string;
  phone: string;
  role: string;
  addedAt: string;
}

export interface ShopRecord {
  id: string;
  name: string;
  owner: string;
  phone: string;
  wilaya: string;
  wilayaCode: number;
  commune?: string;
  activity: string;
  plan: "STARTER" | "PRO_KIOSK" | "ENTERPRISE";
  points: number;
  status: "ACTIVE" | "SUSPENDED" | "EXPIRED";
  staff: StaffMember[];
  createdAt: string;
  subscriptionExpiresAt?: string;
}

class ShopRepository {
  private store: JsonStore<ShopRecord>;

  constructor() {
    this.store = new JsonStore<ShopRecord>("shops", DEFAULT_SHOPS as unknown as ShopRecord[]);
  }

  getAll(): ShopRecord[] {
    return this.store.getAll();
  }

  findById(id: string): ShopRecord | null {
    return this.store.find((s) => s.id === id);
  }

  findByPhone(phone?: string): ShopRecord | null {
    if (!phone) return null;
    const clean = phone.replace(/[\s\-]/g, "");
    return this.store.find((s) => !!s.phone && s.phone.replace(/[\s\-]/g, "") === clean);
  }

  create(shop: Partial<ShopRecord>): ShopRecord {
    const newShop: ShopRecord = {
      id: shop.id || `shop_${Date.now()}`,
      name: shop.name || "محل جديد",
      owner: shop.owner || "صاحب المحل",
      phone: shop.phone || "0550000000",
      wilaya: shop.wilaya || "16 - الجزائر العاصمة",
      wilayaCode: shop.wilayaCode || parseInt(shop.wilaya?.split(" ")[0] || "16") || 16,
      commune: shop.commune || "الجزائر الوسطى",
      activity: shop.activity || "KIOSK",
      plan: shop.plan || "STARTER",
      points: shop.points !== undefined ? shop.points : 50,
      status: shop.status || "ACTIVE",
      staff: shop.staff || [],
      createdAt: shop.createdAt || new Date().toISOString(),
      subscriptionExpiresAt:
        shop.subscriptionExpiresAt ||
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };
    return this.store.insert(newShop);
  }

  update(id: string, updates: Partial<ShopRecord>): ShopRecord | null {
    return this.store.update((s) => s.id === id, updates);
  }

  updatePoints(id: string, delta: number): ShopRecord | null {
    return this.store.update(
      (s) => s.id === id,
      (shop) => ({
        ...shop,
        points: Math.max(0, (shop.points || 0) + Number(delta)),
      })
    );
  }

  updatePlan(id: string, plan: "STARTER" | "PRO_KIOSK" | "ENTERPRISE", durationDays = 30): ShopRecord | null {
    return this.store.update(
      (s) => s.id === id,
      (shop) => ({
        ...shop,
        plan,
        subscriptionExpiresAt: new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString(),
      })
    );
  }

  toggleStatus(id: string): ShopRecord | null {
    return this.store.update(
      (s) => s.id === id,
      (shop) => ({
        ...shop,
        status: shop.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE",
      })
    );
  }

  addStaff(shopId: string, staffMember: StaffMember): ShopRecord | null {
    return this.store.update(
      (s) => s.id === shopId,
      (shop) => {
        const currentStaff = shop.staff || [];
        return {
          ...shop,
          staff: [...currentStaff, staffMember],
        };
      }
    );
  }

  removeStaff(shopId: string, staffId: string): ShopRecord | null {
    return this.store.update(
      (s) => s.id === shopId,
      (shop) => ({
        ...shop,
        staff: (shop.staff || []).filter((m) => m.id !== staffId),
      })
    );
  }
}

export const shopRepository = new ShopRepository();
