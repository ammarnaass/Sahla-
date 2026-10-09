import { NextRequest, NextResponse } from "next/server";
import {
  listNotifications,
  dispatchNotification,
  markAsRead,
  deleteNotification,
} from "@/server/notifications/dispatcher";
import { DEFAULT_SHOP_ID } from "@/server/config/constants";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const shopId = searchParams.get("shopId") || DEFAULT_SHOP_ID;
    const unreadOnly = searchParams.get("unreadOnly") === "true";
    const type = searchParams.get("type") || undefined;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 30;
    const offset = searchParams.get("offset") ? parseInt(searchParams.get("offset")!) : 0;

    const data = listNotifications({ shopId, unreadOnly, type, limit, offset });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      shopId = DEFAULT_SHOP_ID,
      userId,
      type = "SYSTEM_ANNOUNCEMENT",
      priority = "NORMAL",
      title,
      body: content,
      actionUrl,
      actionLabel,
      meta,
      expiresInHours,
    } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and body are required for notification" },
        { status: 400 }
      );
    }

    const notification = await dispatchNotification({
      shopId,
      userId,
      type,
      priority,
      title,
      body: content,
      actionUrl,
      actionLabel,
      meta,
      expiresInHours,
    });

    return NextResponse.json({ success: true, notification }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to dispatch notification" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, shopId = DEFAULT_SHOP_ID } = body;

    if (!id) {
      return NextResponse.json({ error: "Notification id is required" }, { status: 400 });
    }

    const updated = markAsRead(id, shopId);
    return NextResponse.json({ success: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to mark notification as read" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const shopId = searchParams.get("shopId") || DEFAULT_SHOP_ID;

    if (!id) {
      return NextResponse.json({ error: "Notification id is required" }, { status: 400 });
    }

    const deleted = deleteNotification(id, shopId);
    return NextResponse.json({ success: deleted });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to delete notification" },
      { status: 500 }
    );
  }
}
