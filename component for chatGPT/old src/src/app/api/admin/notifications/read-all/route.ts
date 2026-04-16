import { NextResponse } from "next/server";
import { markAllNotificationsAsRead } from "@/app/(admin)/admin/notifications/notification.repo";
import { getCurrentUser } from "@/server/auth/getCurrentUser";

export async function POST() {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await markAllNotificationsAsRead(user.id);

    return NextResponse.json({ ok: true });
}