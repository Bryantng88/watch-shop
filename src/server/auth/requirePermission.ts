import { getCurrentUser } from "./getCurrentUser";

export async function requirePermission(code: string) {
    const user = await getCurrentUser();

    if (!user) {
        throw new Error("Unauthenticated");
    }

    if (!user.permissions.includes(code)) {
        throw new Error("Forbidden");
    }

    return user;
}
