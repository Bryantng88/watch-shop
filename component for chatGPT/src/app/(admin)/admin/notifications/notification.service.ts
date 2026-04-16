import { createNotification } from "./notification.repo";
import { findUsersByRoleNames } from "@/app/(admin)/admin/users/_server/user.repo";

export async function notifyUsersByRole(input: {
    role: string | string[];
    type: string;
    title: string;
    message: string;
    priority?: "LOW" | "NORMAL" | "HIGH";
    metadata?: any;
}) {
    const roles = (Array.isArray(input.role) ? input.role : [input.role])
        .map((x) => String(x).trim().toUpperCase())
        .filter(Boolean);

    if (!roles.length) return [];

    const users = await findUsersByRoleNames(roles);
    if (!users.length) return [];

    return Promise.all(
        users.map((user) =>
            createNotification({
                userId: user.id,
                type: input.type,
                title: input.title,
                message: input.message,
                priority: input.priority ?? "NORMAL",
                metadata: input.metadata ?? null,
            })
        )
    );
}