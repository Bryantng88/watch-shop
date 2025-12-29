// app/(admin)/admin/users/page.tsx
import { requirePermission } from "@/server/auth/requirePermission";
import { PERMISSIONS } from "@/constants/permissions";
import { getAdminUserList } from "./_server/user.service";
import UserTable from "./_client/UserTable";

export default async function UsersPage() {
    await requirePermission(PERMISSIONS.USER_MANAGE);

    const users = await getAdminUserList();

    return (
        <div className="space-y-4">
            <h1 className="text-xl font-semibold">Quản lý người dùng</h1>
            <UserTable users={users} />
        </div>
    );
}
