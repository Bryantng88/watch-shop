// app/(admin)/admin/auth/_server/auth.service.ts
"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { cookies } from "next/headers";
import * as authRepo from "./auth.repo";
import { authSessionMaxAge, createAuthToken } from "@/server/auth/auth-token";
import { isAuthCookieSecure } from "@/server/auth/auth-cookie";

const loginInput = z.object({
    email: z.string().email(),
    password: z.string().min(1),
    rememberDevice: z.boolean().optional().default(false),
}).strict();

export async function loginService(rawInput: unknown) {
    const parsed = loginInput.safeParse(rawInput);
    if (!parsed.success) throw new Error("Thông tin đăng nhập không hợp lệ");
    const input = parsed.data;
    const user = await authRepo.findUserByEmail(input.email);
    if (!user || !user.isActive || !user.passwordHash) {
        throw new Error("Email hoặc mật khẩu không đúng");
    }

    const ok = await bcrypt.compare(input.password, user.passwordHash);
    if (!ok) {
        throw new Error("mật khẩu không đúng");
    }

    // Keep the signed expiry and persistent cookie lifetime aligned.
    const cookieStore = await cookies();

    cookieStore.set("auth_token", createAuthToken(user.id, Date.now(), input.rememberDevice), {
        httpOnly: true,
        sameSite: "lax",
        secure: isAuthCookieSecure(),
        path: "/",
        maxAge: authSessionMaxAge(input.rememberDevice),
    });


    await authRepo.updateLastLogin(user.id);

    return {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles.map(r => r.name),
    };
}
