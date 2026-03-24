// app/(admin)/admin/layout.tsx
import AdminTopbar from './_client/AdminTopBar';
import AdminSidebar from './_client/AdmidSideBar';
import { getCurrentUser } from '@/server/auth/getCurrentUser';
import { redirect } from "next/navigation";
import { AppToastProvider } from '@/components/feedback/AppToastProvider';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    const permissions = Array.from(new Set(user.permissions ?? []));
    const canEnterAdmin = user.roles.includes("ADMIN") || permissions.length > 0;

    if (!canEnterAdmin) {
        redirect("/403");
    }

    return (
        <div className="flex h-screen overflow-hidden">
            <div className="hidden lg:block w-52 shrink-0 bg-[#11191f]">
                <AdminSidebar user={{ permissions }} />
            </div>

            <div className="lg:hidden">
                <AdminSidebar user={{ permissions }} />
            </div>

            <div className="flex-1 min-w-0 flex flex-col">
                <AdminTopbar title="Admin" user={{ name: user.name, roles: user.roles }} />

                <AppToastProvider>
                    <main className="flex-1 min-h-0 overflow-y-auto p-6">
                        {children}
                    </main>
                </AppToastProvider>
            </div>
        </div>
    );
}
