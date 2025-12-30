// app/(admin)/admin/layout.tsx
import AdminTopbar from './_client/AdminTopBar';
import AdminSidebar from './_client/AdmidSideBar';

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
    return (
        <div className="flex min-h-screen">
            <AdminSidebar />
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
