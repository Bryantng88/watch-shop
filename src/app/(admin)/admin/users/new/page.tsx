import { redirect } from "next/navigation";

import { PERMISSIONS } from "@/constants/permissions";
import { requireAnyPermission } from "@/server/auth/requirePermission";

export default async function NewUserPage() {
    await requireAnyPermission([PERMISSIONS.USER_CREATE, PERMISSIONS.USER_MANAGE]);
    redirect("/admin/users?create=1");
}
