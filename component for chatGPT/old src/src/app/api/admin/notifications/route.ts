import { NextResponse } from "next/server";
import {
    countUnreadNotifications,
    getNotifications,
} from "@/app/(admin)/admin/notifications/notification.repo"
import { getCurrentUser } from "@/server/auth/getCurrentUser";

export async function GET(req: Request) {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const unreadOnly = searchParams.get("unreadOnly") === "true";
    const take = Number(searchParams.get("take") ?? 10);

    const [items, unreadCount] = await Promise.all([
        getNotifications({
            userId: user.id,
            unreadOnly,
            take: Number.isFinite(take) ? take : 10,
        }),
        countUnreadNotifications(user.id),
    ]);

    return NextResponse.json({
        items,
        unreadCount,
    });
}