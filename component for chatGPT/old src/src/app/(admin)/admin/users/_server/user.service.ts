// src/app/(admin)/admin/users/_server/user.service.ts
import * as userRepo from "./user.repo";
import bcrypt from "bcryptjs";
import { prisma } from "@/server/db/client";

export type PermissionDTO = {
    id: string;
    code: string;
    description: string | null;
};

export type RoleDTO = {
    id: string;
    name: string;
    description: string | null;
    permissions: string[];
};

export type RoleManageDTO = {
    id: string;
    name: string;
    description: string | null;
    permissions: PermissionDTO[];
};

const DEFAULT_PAGE_SIZE = 20;

export async function getAdminUserList(raw: Record<string, unknown>) {
    const page = Math.max(1, Number(raw.page ?? 1)) || 1;
    const pageSize = Math.max(1, Number(raw.pageSize ?? DEFAULT_PAGE_SIZE)) || DEFAULT_PAGE_SIZE;
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const { items, total } = await userRepo.getUserListRepo({ skip, take });

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
    if (!input.email || !input.password) {
        throw new Error("Thiếu email hoặc mật khẩu");
    }

    if (input.password.length < 6) {
        throw new Error("Mật khẩu tối thiểu 6 ký tự");
    }

    const existed = await prisma.user.findUnique({
        where: { email: input.email },
        select: { id: true },
    });

    if (existed) {
        throw new Error("Email đã tồn tại");
    }

    const passwordHash = await bcrypt.hash(input.password, 10);

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

export async function getRoleManagementData(): Promise<{
    roles: RoleManageDTO[];
    permissions: PermissionDTO[];
}> {
    const [roles, permissions] = await Promise.all([
        userRepo.getAllRolesRepo(),
        userRepo.getAllPermissionsRepo(),
    ]);

    return {
        roles: roles.map((r) => ({
            id: r.id,
            name: r.name,
            description: r.description,
            permissions: r.permissions.map((p) => ({
                id: p.id,
                code: p.code,
                description: p.description,
            })),
        })),
        permissions,
    };
}

function normalizeRoleName(name: string) {
    return String(name ?? "")
        .trim()
        .replace(/\s+/g, "_")
        .toUpperCase();
}

export async function createRoleService(input: {
    name: string;
    description?: string | null;
    permissionIds?: string[];
}) {
    const name = normalizeRoleName(input.name);
    if (!name) throw new Error("Thiếu tên role");

    const existed = await prisma.role.findUnique({
        where: { name },
        select: { id: true },
    });

    if (existed) {
        throw new Error("Role đã tồn tại");
    }

    const permissionIds = Array.from(new Set((input.permissionIds ?? []).filter(Boolean)));

    return prisma.role.create({
        data: {
            name,
            description: input.description?.trim() || null,
            permissions: {
                connect: permissionIds.map((id) => ({ id })),
            },
        },
        select: {
            id: true,
            name: true,
            description: true,
            permissions: {
                select: {
                    id: true,
                    code: true,
                    description: true,
                },
                orderBy: { code: "asc" },
            },
        },
    });
}

export async function updateRoleService(
    roleId: string,
    input: {
        name?: string;
        description?: string | null;
        permissionIds?: string[];
    }
) {
    const current = await prisma.role.findUnique({
        where: { id: roleId },
        select: { id: true, name: true },
    });

    if (!current) {
        throw new Error("Không tìm thấy role");
    }

    const nextName = input.name ? normalizeRoleName(input.name) : current.name;

    if (nextName !== current.name) {
        const dup = await prisma.role.findFirst({
            where: {
                name: nextName,
                id: { not: roleId },
            },
            select: { id: true },
        });

        if (dup) {
            throw new Error("Tên role đã tồn tại");
        }
    }

    const permissionIds = Array.from(new Set((input.permissionIds ?? []).filter(Boolean)));

    return prisma.role.update({
        where: { id: roleId },
        data: {
            name: nextName,
            description: input.description?.trim() || null,
            permissions: {
                set: permissionIds.map((id) => ({ id })),
            },
        },
        select: {
            id: true,
            name: true,
            description: true,
            permissions: {
                select: {
                    id: true,
                    code: true,
                    description: true,
                },
                orderBy: { code: "asc" },
            },
        },
    });
}
