import { requirePermission } from "@/server/auth/requirePermission";
import { PERMISSIONS } from "@/constants/permissions";
import { getRoleManagementData } from "../_server/user.service";
import RolePermissionManager from "../_client/RolePermissionManager";

export default async function UserRolesPage() {
    await requirePermission(PERMISSIONS.USER_MANAGE);
    const { roles, permissions } = await getRoleManagementData();

    return <RolePermissionManager initialRoles={roles} permissions={permissions} />;
}
