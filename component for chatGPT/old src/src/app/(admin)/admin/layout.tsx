import AdminTopbar from "./_client/AdminTopBar";
import AdminSidebar from "./_client/AdmidSideBar";
import { getCurrentUser } from "@/server/auth/getCurrentUser";
import { redirect } from "next/navigation";
import { AppToastProvider } from "@/components/feedback/AppToastProvider";
import { AppDialogProvider } from "@/components/feedback/AppDialogProvider";
import { getSideMenuNotificationCounts } from "./_server/sidebar-notifications";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    const permissions = Array.from(new Set(user.permissions ?? []));

    if (permissions.length === 0) {
        redirect("/403");
    }

    const notificationCounts = await getSideMenuNotificationCounts();

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50">
            <div className="hidden w-52 shrink-0 bg-[#11191f] lg:block">
                <AdminSidebar
                    user={{ permissions }}
                    notifications={notificationCounts}
                />
            </div>

            <div className="lg:hidden">
                <AdminSidebar
                    user={{ permissions }}
                    notifications={notificationCounts}
                    variant="mobile"
                />
            </div>

            <div className="flex min-w-0 flex-1 flex-col">
                <AdminTopbar title="Admin" user={{ name: user.name, roles: user.roles }} />

                <AppToastProvider>
                    <AppDialogProvider>
                        <main className="flex-1 min-h-0 min-w-0 overflow-y-auto bg-slate-50">
                            <div className="mx-auto w-full max-w-[1680px] px-4 py-6 lg:px-6 2xl:px-8">
                                {children}
                            </div>
                        </main>
                    </AppDialogProvider>
                </AppToastProvider>
            </div>
        </div>
    );
}