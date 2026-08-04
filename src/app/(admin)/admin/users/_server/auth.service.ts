// app/(admin)/admin/auth/_server/auth.service.ts
"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import * as authRepo from "./auth.repo";
import { AUTH_TOKEN_MAX_AGE, createAuthToken } from "@/server/auth/auth-token";

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

    cookieStore.set("auth_token", createAuthToken(user.id), {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: AUTH_TOKEN_MAX_AGE,
    });


    await authRepo.updateLastLogin(user.id);

    return {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles.map(r => r.name),
    };
}
