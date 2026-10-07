/**
 * 🔔 Sahla SaaS Central Notification Dispatcher & Live Bus
 * Handles SQLite persistence, in-memory SSE event streaming, and notification lifecycle.
 */

import { EventEmitter } from "node:events";
import { db } from "@/lib/db";

export interface NotificationRecord {
  id: string;
  shop_id: string;
  user_id?: string | null;
  type: string;
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  title: string;
  body: string;
  action_url?: string | null;
  action_label?: string | null;
  meta_json?: string | null;
  read: number;
  read_at?: string | null;
  created_at: string;
  expires_at?: string | null;
}

export interface CreateNotificationInput {
  shopId?: string;
  userId?: string;
  type:
    | "AI_RESEARCH_READY"
    | "AI_PLAN_READY"
    | "AI_FAILOVER"
    | "LOW_BALANCE"
    | "POINTS_RECHARGED"
    | "DATA_EXPIRY_WARN"
    | "DATA_DELETED"
    | "DOC_READY"
    | "NEW_SERVICE"
    | "LEGAL_UPDATE"
    | "SYSTEM_ANNOUNCEMENT";
  priority?: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  title: string;
  body: string;
  actionUrl?: string;
  actionLabel?: string;
  meta?: Record<string, any>;
  expiresInHours?: number;
}

// Global in-process event bus for Server-Sent Events (SSE)
class NotificationEventBus extends EventEmitter {}
export const notificationBus = new NotificationEventBus();
notificationBus.setMaxListeners(200);

let tablesInitialized = false;

export function initNotificationTables() {
  if (tablesInitialized) return;
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS notifications (
        id TEXT PRIMARY KEY,
        shop_id TEXT NOT NULL DEFAULT 'shop_1',
        user_id TEXT,
        type TEXT NOT NULL,
        priority TEXT NOT NULL DEFAULT 'NORMAL',
        title TEXT NOT NULL,
        body TEXT NOT NULL,
        action_url TEXT,
        action_label TEXT,
        meta_json TEXT,
        read INTEGER NOT NULL DEFAULT 0,
        read_at TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        expires_at TEXT
      );

      CREATE INDEX IF NOT EXISTS idx_notifications_shop_read 
        ON notifications (shop_id, read, created_at DESC);

      CREATE INDEX IF NOT EXISTS idx_notifications_type 
        ON notifications (type);

      CREATE TABLE IF NOT EXISTS notification_preferences (
        shop_id TEXT PRIMARY KEY,
        sound_enabled INTEGER NOT NULL DEFAULT 1,
        toasts_enabled INTEGER NOT NULL DEFAULT 1,
        ai_ready_alerts INTEGER NOT NULL DEFAULT 1,
        low_balance_threshold INTEGER NOT NULL DEFAULT 20,
        expiry_alerts INTEGER NOT NULL DEFAULT 1,
        marketing_alerts INTEGER NOT NULL DEFAULT 0,
        updated_at TEXT DEFAULT (datetime('now'))
      );
    `);

    // Seed initial notifications if table is currently empty
    const countRow = db.prepare("SELECT COUNT(*) as cnt FROM notifications").get() as any;
    if (countRow && countRow.cnt === 0) {
      const now = new Date().toISOString();
      const initialSeed = [
        {
          id: `notif_${Date.now()}_1`,
          shop_id: "shop_1",
          type: "AI_PLAN_READY",
          priority: "NORMAL",
          title: "خطة بحث جاهزة بالذكاء الاصطناعي ⚡",
          body: "تم إعداد خطة وفهرس بحث الثورة التحريرية الجزائرية وفق منهاج الجيل الثاني.",
          action_url: "/dashboard?tab=services",
          action_label: "معاينة الخطة",
          read: 0,
          created_at: now,
        },
        {
          id: `notif_${Date.now()}_2`,
          shop_id: "shop_1",
          type: "NEW_SERVICE",
          priority: "NORMAL",
          title: "ميزة جديدة: استوديو البحوث والمذكرات",
          body: "يمكنك الآن توليد وتصدير البحوث المدرسية والأكاديمية مباشرة إلى Word و A4.",
          action_url: "/dashboard?tab=services",
          action_label: "استكشاف الميزة",
          read: 0,
          created_at: now,
        },
        {
          id: `notif_${Date.now()}_3`,
          shop_id: "shop_1",
          type: "LEGAL_UPDATE",
          priority: "NORMAL",
          title: "مطابقة القانون 18-07 لحماية المعطيات",
          body: "حذف الملفات المؤقتة آلياً بعد 72 ساعة وتشفير تام لكافة سجلات الزبائن.",
          action_url: "/dashboard?tab=overview",
          action_label: "عرض التفاصيل",
          read: 1,
          created_at: now,
        },
      ];

      const insertStmt = db.prepare(`
        INSERT INTO notifications (
          id, shop_id, type, priority, title, body, action_url, action_label, read, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const item of initialSeed) {
        insertStmt.run(
          item.id,
          item.shop_id,
          item.type,
          item.priority,
          item.title,
          item.body,
          item.action_url,
          item.action_label,
          item.read,
          item.created_at
        );
      }
    }

    tablesInitialized = true;
  } catch (err) {
    console.error("[NotificationDispatcher] Error initializing tables:", err);
  }
}

/**
 * 1. Dispatch a new notification to a shop / user
 */
export async function dispatchNotification(
  input: CreateNotificationInput
): Promise<NotificationRecord> {
  initNotificationTables();

  const id = `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const shopId = input.shopId || "shop_1";
  const priority = input.priority || "NORMAL";
  const metaJson = input.meta ? JSON.stringify(input.meta) : null;
  const createdAt = new Date().toISOString();
  let expiresAt: string | null = null;

  if (input.expiresInHours) {
    expiresAt = new Date(Date.now() + input.expiresInHours * 3600 * 1000).toISOString();
  }

  db.prepare(`
    INSERT INTO notifications (
      id, shop_id, user_id, type, priority, title, body, action_url, action_label,
      meta_json, read, created_at, expires_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)
  `).run(
    id,
    shopId,
    input.userId || null,
    input.type,
    priority,
    input.title,
    input.body,
    input.actionUrl || null,
    input.actionLabel || null,
    metaJson,
    createdAt,
    expiresAt
  );

  const newRecord: NotificationRecord = {
    id,
    shop_id: shopId,
    user_id: input.userId || null,
    type: input.type,
    priority,
    title: input.title,
    body: input.body,
    action_url: input.actionUrl || null,
    action_label: input.actionLabel || null,
    meta_json: metaJson,
    read: 0,
    created_at: createdAt,
    expires_at: expiresAt,
  };

  // Broadcast to active SSE listeners for this shop
  try {
    const unreadCount = getUnreadCount(shopId);
    notificationBus.emit(`notification:${shopId}`, {
      notification: newRecord,
      unreadCount,
    });
    notificationBus.emit("global_notification", {
      shopId,
      notification: newRecord,
      unreadCount,
    });
  } catch (busErr) {
    console.warn("[NotificationDispatcher] Bus emit error:", busErr);
  }

  return newRecord;
}

/**
 * 2. Get unread count for a shop
 */
export function getUnreadCount(shopId: string = "shop_1"): number {
  initNotificationTables();
  try {
    const row = db
      .prepare(
        "SELECT COUNT(*) as cnt FROM notifications WHERE shop_id = ? AND read = 0"
      )
      .get(shopId) as any;
    return row ? Number(row.cnt) : 0;
  } catch {
    return 0;
  }
}

/**
 * 3. List notifications with filters & pagination
 */
export function listNotifications(params: {
  shopId?: string;
  unreadOnly?: boolean;
  type?: string;
  limit?: number;
  offset?: number;
}): { notifications: NotificationRecord[]; unreadCount: number; totalCount: number } {
  initNotificationTables();
  const shopId = params.shopId || "shop_1";
  const limit = Math.min(params.limit || 30, 100);
  const offset = params.offset || 0;

  let query = "SELECT * FROM notifications WHERE shop_id = ?";
  const queryParams: any[] = [shopId];

  if (params.unreadOnly) {
    query += " AND read = 0";
  }

  if (params.type) {
    query += " AND type = ?";
    queryParams.push(params.type);
  }

  query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
  queryParams.push(limit, offset);

  const notifications = db.prepare(query).all(...queryParams) as unknown as NotificationRecord[];
  const unreadCount = getUnreadCount(shopId);

  const countRow = db
    .prepare("SELECT COUNT(*) as total FROM notifications WHERE shop_id = ?")
    .get(shopId) as any;
  const totalCount = countRow ? Number(countRow.total) : notifications.length;

  return { notifications, unreadCount, totalCount };
}

/**
 * 4. Mark single notification as read
 */
export function markAsRead(id: string, shopId: string = "shop_1"): boolean {
  initNotificationTables();
  const res = db
    .prepare(
      "UPDATE notifications SET read = 1, read_at = datetime('now') WHERE id = ? AND shop_id = ?"
    )
    .run(id, shopId);

  if (res.changes > 0) {
    const unreadCount = getUnreadCount(shopId);
    notificationBus.emit(`read_update:${shopId}`, { id, unreadCount });
    return true;
  }
  return false;
}

/**
 * 5. Mark all notifications for shop as read
 */
export function markAllAsRead(shopId: string = "shop_1"): { markedCount: number; unreadCount: number } {
  initNotificationTables();
  const res = db
    .prepare(
      "UPDATE notifications SET read = 1, read_at = datetime('now') WHERE shop_id = ? AND read = 0"
    )
    .run(shopId);

  notificationBus.emit(`read_update:${shopId}`, { all: true, unreadCount: 0 });
  return { markedCount: Number(res.changes), unreadCount: 0 };
}

/**
 * 6. Delete a notification
 */
export function deleteNotification(id: string, shopId: string = "shop_1"): boolean {
  initNotificationTables();
  const res = db
    .prepare("DELETE FROM notifications WHERE id = ? AND shop_id = ?")
    .run(id, shopId);
  return res.changes > 0;
}
