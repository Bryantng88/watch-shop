// app/(admin)/admin/layout.tsx
import AdminTopbar from './_client/AdminTopBar';
import AdminSidebar from './_client/AdmidSideBar';
import { ROLE_PERMISSIONS } from '@/server/auth/rolePermissions';
import { getCurrentUser } from '@/server/auth/getCurrentUser';
import { redirect } from "next/navigation";
import { AppToastProvider } from '@/components/feedback/AppToastProvider';

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


    // app/(admin)/admin/layout.tsx
    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <div className="hidden lg:block w-52 shrink-0 bg-[#11191f]">
                <AdminSidebar user={{ permissions: Array.from(new Set(permissions)) }} />
            </div>

            {/* Sidebar mobile */}
            <div className="lg:hidden">
                <AdminSidebar user={{ permissions: Array.from(new Set(permissions)) }} />
            </div>

            {/* Main */}
            <div className="flex-1 min-w-0 flex flex-col">
                <AdminTopbar title="Admin" user={{ name: user.name, roles: user.roles }} />

                {/* CHỖ NÀY SCROLL */}
                <AppToastProvider>
                    <main className="flex-1 min-h-0 overflow-y-auto p-6">
                        {children}
                    </main>
                </AppToastProvider>

            </div>


        </div>

    );
}
