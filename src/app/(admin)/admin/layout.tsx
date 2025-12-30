// app/(admin)/admin/layout.tsx
import AdminTopbar from './_client/AdminTopBar';
import AdminSidebar from './_client/AdmidSideBar';
import { ROLE_PERMISSIONS } from '@/server/auth/rolePermissions';
import { getCurrentUser } from '@/server/auth/getCurrentUser';
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    // ví dụ: chỉ ADMIN hoặc STAFF mới vào
    if (!user.roles.includes("ADMIN") && !user.roles.includes("STAFF")) {
        redirect("/403");
    }

    const permissions = user.roles.flatMap(
        (r) => ROLE_PERMISSIONS[r] ?? []
    );


    return (
        <div className="flex min-h-screen">
            <AdminSidebar
                user={{
                    permissions: Array.from(new Set(permissions)), // tránh trùng
                }}
            />
            <div className="flex-1">
                <AdminTopbar
                    title="Admin"
                    user={{
                        name: user.name,
                        roles: user.roles, // đã là string[]
                    }}
                />

                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}
