import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth/getCurrentUser";
import { prisma } from "@/server/db/client";

export async function PATCH(req: Request) {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name, avatarUrl } = await req.json();

    await prisma.user.update({
        where: { id: user.id },
        data: {
            name,
            avatarUrl,
        },
    });

    return NextResponse.json({ success: true });
}
