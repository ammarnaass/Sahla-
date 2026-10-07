/**
 * 🛡️ مستودع سجل التدقيق الأمني لمدير النظام (Admin Audit Log Repository)
 * Tracks security events, admin mutations, status changes, and critical operations
 */

import { JsonStore } from "../storage/jsonStore";
import { AdminRoleType } from "../config/constants";

export interface AdminAuditLogRecord {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: AdminRoleType | string;
  action: string;
  targetId?: string;
  targetType: "ADMIN" | "SHOP" | "INVOICE" | "AI_CONFIG" | "BROADCAST" | "SYSTEM";
  descriptionAr: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  timestamp: string;
}

const DEFAULT_LOGS: AdminAuditLogRecord[] = [
  {
    id: "audit_init_1",
    actorId: "user_super_admin",
    actorName: "مدير منصة سهلة المركزي",
    actorRole: "SUPER_ADMIN",
    action: "SYSTEM_INITIALIZED",
    targetType: "SYSTEM",
    descriptionAr: "تهيئة منظومة القيادة الوطنية المركزية وتفعيل مراقبة الـ 58 ولاية 🇩🇿",
    timestamp: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "audit_init_2",
    actorId: "user_super_admin",
    actorName: "مدير منصة سهلة المركزي",
    actorRole: "SUPER_ADMIN",
    action: "RBAC_ENFORCED",
    targetType: "ADMIN",
    descriptionAr: "تفعيل مصفوفة الصلاحيات والحماية السيادية لحساب الجذر admin@sahla.dz",
    timestamp: "2026-02-01T00:00:00.000Z",
  },
];

class AdminAuditLogRepository {
  private store: JsonStore<AdminAuditLogRecord>;

  constructor() {
    this.store = new JsonStore<AdminAuditLogRecord>("admin_audit_logs", DEFAULT_LOGS);
  }

  getAll(): AdminAuditLogRecord[] {
    return this.store.getAll().sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  log(data: Omit<AdminAuditLogRecord, "id" | "timestamp"> & { timestamp?: string }): AdminAuditLogRecord {
    const record: AdminAuditLogRecord = {
      ...data,
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: data.timestamp || new Date().toISOString(),
    };
    return this.store.insert(record);
  }

  filterByActor(actorId: string): AdminAuditLogRecord[] {
    return this.store.filter((l) => l.actorId === actorId);
  }

  filterByType(targetType: string): AdminAuditLogRecord[] {
    return this.store.filter((l) => l.targetType === targetType);
  }
}

export const adminAuditLogRepository = new AdminAuditLogRepository();
