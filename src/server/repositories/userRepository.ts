/**
 * 👤 مستودع المستخدمين (User Repository)
 * Supports Email/Gmail lookup, PBKDF2 secure password hashing & RBAC
 */

import crypto from "crypto";
import { JsonStore } from "../storage/jsonStore";
import { DEFAULT_USERS, UserRoleType, ADMIN_ROLES, AdminRoleType } from "../config/constants";

export interface UserRecord {
  id: string;
  name: string;
  email?: string | null;
  secondaryEmail?: string | null;
  phone?: string | null;
  password?: string;
  role: UserRoleType;
  adminRole?: AdminRoleType;
  customPermissions?: string[];
  assignedWilayas?: number[];
  status?: "ACTIVE" | "SUSPENDED";
  isRoot?: boolean;
  lastLoginAt?: string | null;
  shopId?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export function hashPassword(password: string): string {
  if (!password) return "";
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash?: string): boolean {
  if (!password || !storedHash) return false;
  if (!storedHash.includes(":")) {
    return password === storedHash;
  }
  const [salt, originalHash] = storedHash.split(":");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return hash === originalHash;
}

class UserRepository {
  private store: JsonStore<UserRecord>;

  constructor() {
    this.store = new JsonStore<UserRecord>("users", DEFAULT_USERS as unknown as UserRecord[]);
    this._ensureDefaultCredentials();
  }

  private _ensureDefaultCredentials(): void {
    DEFAULT_USERS.forEach((defUser) => {
      const existing = this.findById(defUser.id) || this.findByPhone(defUser.phone);
      if (existing) {
        const isRootUser = defUser.email === "admin@sahla.dz" || defUser.id === "user_super_admin";
        this.update(existing.id, {
          email: existing.email || defUser.email,
          secondaryEmail: existing.secondaryEmail || defUser.secondaryEmail || null,
          password: existing.password || defUser.password,
          adminRole: existing.adminRole || (defUser.role === "SUPER_ADMIN" ? "SUPER_ADMIN" : undefined),
          isRoot: isRootUser,
          status: existing.status || "ACTIVE",
        });
      } else {
        const isRootUser = defUser.email === "admin@sahla.dz" || defUser.id === "user_super_admin";
        this.create({
          ...defUser,
          adminRole: defUser.role === "SUPER_ADMIN" ? "SUPER_ADMIN" : undefined,
          isRoot: isRootUser,
          status: "ACTIVE",
        } as unknown as Partial<UserRecord>);
      }
    });
  }

  getAll(): UserRecord[] {
    return this.store.getAll();
  }

  findById(id: string): UserRecord | null {
    return this.store.find((u) => u.id === id);
  }

  findByEmail(email?: string): UserRecord | null {
    if (!email) return null;
    const clean = email.trim().toLowerCase();
    return this.store.find((u) => {
      const main = u.email ? u.email.trim().toLowerCase() : "";
      const secondary = u.secondaryEmail ? u.secondaryEmail.trim().toLowerCase() : "";
      return main === clean || secondary === clean;
    });
  }

  findByPhone(normalizedPhone?: string): UserRecord | null {
    if (!normalizedPhone) return null;
    const clean = normalizedPhone.replace(/[\s\-]/g, "");
    return this.store.find((u) => !!u.phone && u.phone.replace(/[\s\-]/g, "") === clean);
  }

  findByShop(shopId: string): UserRecord[] {
    return this.store.filter((u) => u.shopId === shopId);
  }

  create(user: Partial<UserRecord>): UserRecord {
    const rawPass = user.password || "Sahla@2026!";
    const passwordHash = rawPass.includes(":") ? rawPass : hashPassword(rawPass);

    const newUser: UserRecord = {
      id: user.id || `user_${Date.now()}`,
      name: user.name || "مستخدم جديد",
      email: user.email ? user.email.trim().toLowerCase() : null,
      secondaryEmail: user.secondaryEmail || null,
      phone: user.phone || null,
      password: passwordHash,
      role: user.role || "SHOP_ADMIN",
      adminRole: user.adminRole || (user.role === "SUPER_ADMIN" ? "SUPER_ADMIN" : undefined),
      customPermissions: user.customPermissions || [],
      assignedWilayas: user.assignedWilayas || [],
      status: user.status || "ACTIVE",
      isRoot: user.isRoot ?? (user.email === "admin@sahla.dz"),
      lastLoginAt: user.lastLoginAt || null,
      shopId: user.shopId || null,
      createdAt: user.createdAt || new Date().toISOString(),
      updatedAt: user.updatedAt || new Date().toISOString(),
    };
    return this.store.insert(newUser);
  }

  update(id: string, updates: Partial<UserRecord>): UserRecord | null {
    const data = { ...updates };
    if (data.password && !data.password.includes(":")) {
      data.password = hashPassword(data.password);
    }
    if (data.email) {
      data.email = data.email.trim().toLowerCase();
    }
    return this.store.update((u) => u.id === id, data);
  }

  delete(id: string): boolean {
    return this.store.delete((u) => u.id === id);
  }

  deleteByPhone(phone: string): boolean {
    return this.store.delete((u) => u.phone === phone);
  }

  verifyPassword(password: string, storedHash?: string): boolean {
    return verifyPassword(password, storedHash);
  }

  hashPassword(password: string): string {
    return hashPassword(password);
  }
}

export const userRepository = new UserRepository();
