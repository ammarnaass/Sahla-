"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { NotificationRecord } from "@/server/notifications/dispatcher";

interface NotificationContextValue {
  notifications: NotificationRecord[];
  unreadCount: number;
  isLoading: boolean;
  activeToast: NotificationRecord | null;
  dismissToast: () => void;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refetch: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({
  children,
  shopId = "shop_1",
}: {
  children: React.ReactNode;
  shopId?: string;
}) {
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeToast, setActiveToast] = useState<NotificationRecord | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch(`/api/v1/notifications?shopId=${shopId}&limit=20`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) {
      console.warn("[NotificationContext] Poll fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [shopId]);

  // Connect to live SSE Stream with fallback polling
  useEffect(() => {
    let eventSource: EventSource | null = null;
    let pollInterval: NodeJS.Timeout | null = null;

    try {
      eventSource = new EventSource(`/api/v1/notifications/stream?shopId=${shopId}`);

      eventSource.addEventListener("init", (event: MessageEvent) => {
        try {
          const payload = JSON.parse(event.data);
          if (Array.isArray(payload.notifications)) {
            setNotifications(payload.notifications);
          }
          if (typeof payload.unreadCount === "number") {
            setUnreadCount(payload.unreadCount);
          }
          setIsLoading(false);
        } catch (e) {
          console.warn("[NotificationSSE] Init parse error:", e);
        }
      });

      eventSource.addEventListener("notification", (event: MessageEvent) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.notification) {
            setNotifications((prev) => [payload.notification, ...prev.filter((n) => n.id !== payload.notification.id)]);
            setActiveToast(payload.notification);
          }
          if (typeof payload.unreadCount === "number") {
            setUnreadCount(payload.unreadCount);
          }
        } catch (e) {
          console.warn("[NotificationSSE] Notification parse error:", e);
        }
      });

      eventSource.addEventListener("read_update", (event: MessageEvent) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.all) {
            setNotifications((prev) => prev.map((n) => ({ ...n, read: 1 })));
            setUnreadCount(0);
          } else if (payload.id) {
            setNotifications((prev) =>
              prev.map((n) => (n.id === payload.id ? { ...n, read: 1 } : n))
            );
            if (typeof payload.unreadCount === "number") {
              setUnreadCount(payload.unreadCount);
            }
          }
        } catch (e) {
          console.warn("[NotificationSSE] Read update parse error:", e);
        }
      });

      eventSource.onerror = () => {
        // SSE disconnected or not supported; start fallback polling
        eventSource?.close();
        if (!pollInterval) {
          fetchNotifications();
          pollInterval = setInterval(fetchNotifications, 35000);
        }
      };
    } catch {
      // Fallback
      fetchNotifications();
      pollInterval = setInterval(fetchNotifications, 35000);
    }

    return () => {
      if (eventSource) eventSource.close();
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [shopId, fetchNotifications]);

  const dismissToast = useCallback(() => {
    setActiveToast(null);
  }, []);

  const markAsRead = useCallback(
    async (id: string) => {
      // Optimistic update
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: 1 } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));

      try {
        await fetch("/api/v1/notifications", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, shopId }),
        });
      } catch (err) {
        console.warn("[NotificationContext] Failed to mark as read:", err);
      }
    },
    [shopId]
  );

  const markAllAsRead = useCallback(async () => {
    // Optimistic update
    setNotifications((prev) => prev.map((n) => ({ ...n, read: 1 })));
    setUnreadCount(0);

    try {
      await fetch("/api/v1/notifications/read-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shopId }),
      });
    } catch (err) {
      console.warn("[NotificationContext] Failed to mark all as read:", err);
    }
  }, [shopId]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isLoading,
        activeToast,
        dismissToast,
        markAsRead,
        markAllAsRead,
        refetch: fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
