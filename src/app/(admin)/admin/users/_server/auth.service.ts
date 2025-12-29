// app/(admin)/admin/auth/_server/auth.service.ts
"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import * as authRepo from "./auth.repo";

type LoginInput = {
    email: string;
    password: string;
};

export async function loginService(input: LoginInput) {
    const user = await authRepo.findUserByEmail(input.email);
    //console.log('in ra auth service: ' + user?.email + user?.passwordHash)
    if (!user || !user.isActive || !user.passwordHash) {
        throw new Error("Email hoặc mật khẩu không đúng");
    }

    const ok = await bcrypt.compare(input.password, user.passwordHash);
    if (!ok) {
        throw new Error("mật khẩu không đúng");
    }

    // 👉 set auth cookie (demo: dùng userId)
    const cookieStore = await cookies();

    cookieStore.set("auth_token", user.id, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
    });


    await authRepo.updateLastLogin(user.id);

    return {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles.map(r => r.name),
    };
}
