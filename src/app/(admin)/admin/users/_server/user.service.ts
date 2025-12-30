// src/server/auth/user.service.ts
import * as userRepo from "./user.repo";
import bcrypt from "bcryptjs";
import { prisma } from "@/server/db/client";

export async function getAdminUserList() {
    const rows = await userRepo.getUserListRepo();

    return rows.map((u) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        isActive: u.isActive,
        roles: u.roles.map((r) => r.name),
    }));

}

export async function createUserService(input: {
    email: string;
    name?: string;
    password: string;
}) {
    const existed = await prisma.user.findUnique({
        where: { email: input.email },
    });
    if (existed) {
        throw new Error("EMAIL_EXISTS");
    }

    const passwordHash = await bcrypt.hash(input.password, 10);

    return userRepo.createUserRepo(prisma, {
        email: input.email,
        name: input.name,
        passwordHash,
    });
}

export async function updateUserService(
    userId: string,
    input: {
        name?: string;
        isActive?: boolean;
    }
) {
    return userRepo.updateUserRepo(prisma, userId, input);
}