import { NextRequest } from "next/server";
import {
  notificationBus,
  listNotifications,
  getUnreadCount,
} from "@/server/notifications/dispatcher";
import { DEFAULT_SHOP_ID } from "@/server/config/constants";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const shopId = searchParams.get("shopId") || DEFAULT_SHOP_ID;

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // 1. Send initial connection data
      const initialData = listNotifications({ shopId, limit: 15 });
      const unreadCount = getUnreadCount(shopId);

      const initPayload = JSON.stringify({
        type: "init",
        unreadCount,
        notifications: initialData.notifications,
      });

      controller.enqueue(encoder.encode(`event: init\ndata: ${initPayload}\n\n`));

      // 2. Listener for new notifications
      const onNotification = (data: any) => {
        try {
          const payload = JSON.stringify({
            type: "notification",
            notification: data.notification,
            unreadCount: data.unreadCount,
          });
          controller.enqueue(encoder.encode(`event: notification\ndata: ${payload}\n\n`));
        } catch (err) {
          console.warn("[NotificationsSSE] Failed to enqueue notification event:", err);
        }
      };

      // 3. Listener for read state updates
      const onReadUpdate = (data: any) => {
        try {
          const payload = JSON.stringify({
            type: "read_update",
            ...data,
          });
          controller.enqueue(encoder.encode(`event: read_update\ndata: ${payload}\n\n`));
        } catch (err) {
          console.warn("[NotificationsSSE] Failed to enqueue read update:", err);
        }
      };

      notificationBus.on(`notification:${shopId}`, onNotification);
      notificationBus.on(`read_update:${shopId}`, onReadUpdate);

      // 4. Heartbeat keep-alive every 25 seconds
      const pingInterval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": keepalive\n\n"));
        } catch {
          clearInterval(pingInterval);
        }
      }, 25000);

      // 5. Cleanup on connection abort
      req.signal.addEventListener("abort", () => {
        clearInterval(pingInterval);
        notificationBus.removeListener(`notification:${shopId}`, onNotification);
        notificationBus.removeListener(`read_update:${shopId}`, onReadUpdate);
        try {
          controller.close();
        } catch {
          // Stream already closed
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
