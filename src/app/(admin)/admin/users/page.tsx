// app/(admin)/admin/users/page.tsx
import { getAdminUserList } from "@/server/auth/user.service";
import UserTable from "./user-table";
import { requirePermission } from "@/server/auth/requirePermission";
import { PERMISSIONS } from "@/constants/permissions";



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
