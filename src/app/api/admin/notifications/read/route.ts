import { NextResponse } from "next/server";
import { markNotificationAsRead } from "@/server/notifications/notification.repo";
import { getCurrentAuthUser } from "@/server/auth/get-current-user";

export async function POST(req: Request) {
    const user = await getCurrentAuthUser();
    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const id = String(body?.id ?? "").trim();

    if (!id) {
        return NextResponse.json({ message: "Thiếu id" }, { status: 400 });
    }

    await markNotificationAsRead({
        id,
        userId: user.id,
    });

    return NextResponse.json({ ok: true });
}