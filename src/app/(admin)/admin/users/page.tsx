// app/(admin)/admin/users/page.tsx
import { requirePermission } from "@/server/auth/requirePermission";
import { PERMISSIONS } from "@/constants/permissions";
import { getAdminUserList } from "./_server/user.service";
import UserListPageClient from "./_client/ListUser";

export default async function UsersPage({
    searchParams,
}: {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
    const resolvedSearchParams = await searchParams;
    await requirePermission(PERMISSIONS.USER_MANAGE);

    const { items, total, page, pageSize } =
        await getAdminUserList(resolvedSearchParams);

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return (
        <UserListPageClient
            items={items}
            total={total}
            page={page}
            pageSize={pageSize}
            totalPages={totalPages}
            rawSearchParams={resolvedSearchParams}
        />
    );


}
