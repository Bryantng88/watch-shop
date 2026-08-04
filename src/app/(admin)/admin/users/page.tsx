// app/(admin)/admin/users/page.tsx
import { requireAnyPermission } from "@/server/auth/requirePermission";
import { PERMISSIONS } from "@/constants/permissions";
import { getAdminUserList, getAllRoles } from "./_server/user.service";
import UserListPageClient from "./_client/ListUser";

export default async function UsersPage({
    searchParams,
}: {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
    const resolvedSearchParams = await searchParams;
    const user = await requireAnyPermission([PERMISSIONS.USER_VIEW, PERMISSIONS.USER_MANAGE]);
    const permissionSet = new Set(user.permissions);
    const isAdmin = user.roles.includes("ADMIN");

    const [{ items, total, page, pageSize }, roles] = await Promise.all([
        getAdminUserList(resolvedSearchParams),
        getAllRoles(),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return (
        <UserListPageClient
            items={items}
            total={total}
            page={page}
            pageSize={pageSize}
            totalPages={totalPages}
            rawSearchParams={resolvedSearchParams}
            roles={roles}
            canCreate={isAdmin || permissionSet.has(PERMISSIONS.USER_CREATE) || permissionSet.has(PERMISSIONS.USER_MANAGE)}
            canUpdate={isAdmin || permissionSet.has(PERMISSIONS.USER_UPDATE) || permissionSet.has(PERMISSIONS.USER_MANAGE)}
            canManageRoles={isAdmin || permissionSet.has(PERMISSIONS.USER_MANAGE)}
        />
    );


}
