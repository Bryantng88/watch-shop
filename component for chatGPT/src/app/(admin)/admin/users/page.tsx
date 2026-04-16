// app/(admin)/admin/users/page.tsx
import { requirePermission } from "@/server/auth/requirePermission";
import { PERMISSIONS } from "@/constants/permissions";
import { getAdminUserList } from "./_server/user.service";
import UserListPageClient from "./_client/ListUser";

export default async function UsersPage({
    searchParams,
}: {
    searchParams: Record<string, string | string[] | undefined>;
}) {
    await requirePermission(PERMISSIONS.USER_MANAGE);

    const { items, total, page, pageSize } =
        await getAdminUserList(searchParams);

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return (
        <UserListPageClient
            items={items}
            total={total}
            page={page}
            pageSize={pageSize}
            totalPages={totalPages}
            rawSearchParams={searchParams}
        />
    );


}
