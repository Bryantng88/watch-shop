// app/(admin)/admin/users/new/page.tsx
import { requirePermission } from "@/server/auth/requirePermission";
import { PERMISSIONS } from "@/constants/permissions";
import { getAllRoles } from "../_server/user.service";
import UserCreateDrawer from "../_client/UserCreateDrawer";

export default async function NewUserPage() {
    await requirePermission(PERMISSIONS.USER_MANAGE);

    const roles = await getAllRoles();

    return (
        <UserCreateDrawer
            roles={roles}
        />
    );
}
