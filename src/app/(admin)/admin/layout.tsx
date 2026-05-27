import AdminTopbar from "./_client/AdminTopBar";
import AdminSidebar from "./_client/AdmidSideBar";
import { getCurrentUser } from "@/server/auth/getCurrentUser";
import { redirect } from "next/navigation";
import { AppToastProvider } from "@/domains/shared/feedback/AppToastProvider";
import { AppDialogProvider } from "@/domains/shared/feedback/AppDialogProvider";
import { AppProgressProvider } from "@/domains/shared/feedback/AppProgressProvider";
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
        <AppToastProvider>
            <AppDialogProvider>
                <AppProgressProvider>
                    <div className="grid h-screen overflow-hidden bg-slate-50 lg:grid-cols-[76px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)]">
                        <div className="relative z-50 hidden overflow-visible bg-[#11191f] lg:block">
                            <AdminSidebar user={{ permissions }} notifications={notificationCounts} />
                        </div>

                        <div className="lg:hidden">
                            <AdminSidebar
                                user={{ permissions }}
                                notifications={notificationCounts}
                                variant="mobile"
                            />
                        </div>

                        <div className="flex min-w-0 overflow-hidden flex-col">
                            <AdminTopbar title="Admin" user={{ name: user.name, roles: user.roles }} />

                            <main className="flex-1 min-h-0 min-w-0 overflow-y-auto bg-slate-50">
                                {children}
                            </main>
                        </div>
                    </div>
                </AppProgressProvider>
            </AppDialogProvider>
        </AppToastProvider>
    );
}