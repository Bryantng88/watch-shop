import { NextResponse } from "next/server";

import { getCurrentUser } from "@/server/auth/getCurrentUser";
import { markNotificationAsRead } from "@/app/(admin)/admin/notifications/notification.repo";

export async function POST(req: Request) {
    const user = await getCurrentUser();
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