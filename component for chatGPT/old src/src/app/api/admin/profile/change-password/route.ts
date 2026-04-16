import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getCurrentUser } from "@/server/auth/getCurrentUser";
import { prisma } from "@/server/db/client";

export async function POST(req: Request) {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { oldPassword, newPassword } = await req.json();

    if (!oldPassword || !newPassword) {
        return NextResponse.json({ message: "Thiếu dữ liệu" }, { status: 400 });
    }

    const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
    });

    if (!dbUser?.passwordHash) {
        return NextResponse.json({ message: "Không thể đổi mật khẩu" }, { status: 400 });
    }

    const ok = await bcrypt.compare(oldPassword, dbUser.passwordHash);
    if (!ok) {
        return NextResponse.json({ message: "Mật khẩu cũ không đúng" }, { status: 400 });
    }

    const newHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: newHash },
    });

    return NextResponse.json({ success: true });
}
