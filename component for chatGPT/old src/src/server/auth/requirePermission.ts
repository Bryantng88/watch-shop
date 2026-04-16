import { getCurrentUser } from "./getCurrentUser";
import { redirect } from "next/navigation";
export async function requirePermission(code: string) {
    const user = await getCurrentUser();
    if (!user) {
        redirect("/login");
    }

    if (!user.permissions.includes(code)) {
        redirect("/403"); // hoặc page not allowed
    }

    return user;
}
