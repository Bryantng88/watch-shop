// src/server/auth/user.service.ts
import * as userRepo from "./user.repo";
import bcrypt from "bcryptjs";
import { prisma } from "@/server/db/client";

export type RoleDTO = {
    id: string;
    name: string;
    description: string | null;
    permissions: string[]; // chỉ trả code cho UI
};


const DEFAULT_PAGE_SIZE = 20;

export async function getAdminUserList(
    raw: Record<string, unknown>
) {
    const page =
        Math.max(1, Number(raw.page ?? 1)) || 1;

    const pageSize =
        Math.max(1, Number(raw.pageSize ?? DEFAULT_PAGE_SIZE)) ||
        DEFAULT_PAGE_SIZE;

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const { items, total } = await userRepo.getUserListRepo({
        skip,
        take,
    });

    // 👇 MAPPER – đúng chỗ cần map
    const rows = items.map((u) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        isActive: u.isActive,
        roles: u.roles.map((r) => r.name),
        createdAt: u.createdAt.toISOString(),
        updatedAt: u.updatedAt.toISOString(),
    }));

    return {
        items: rows,
        total,
        page,
        pageSize,
    };
}
export async function createAdminUser(input: {
    email: string;
    name?: string;
    password: string;
    roleId: string;
}) {
    // 1. validate cơ bản
    if (!input.email || !input.password) {
        throw new Error("Thiếu email hoặc mật khẩu");
    }

    if (input.password.length < 6) {
        throw new Error("Mật khẩu tối thiểu 6 ký tự");
    }
    // 2. check email tồn tại
    const existed = await prisma.user.findUnique({
        where: { email: input.email },
        select: { id: true },
    });

    if (existed) {
        throw new Error("Email đã tồn tại");
    }

    // 3. hash password
    const passwordHash = await bcrypt.hash(input.password, 10);

    // 4. create
    return userRepo.createUserRepo({
        email: input.email,
        name: input.name,
        passwordHash,
        roleId: input.roleId,
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

export async function getAllRoles(): Promise<RoleDTO[]> {
    const roles = await userRepo.getAllRolesRepo();

    return roles.map((r) => ({
        id: r.id,
        name: r.name,
        description: r.description,
        permissions: r.permissions.map((p) => p.code),
    }));
}