import AdminShell from "./_client/AdminShell";
import { getCurrentUser } from "@/server/auth/getCurrentUser";
import { redirect } from "next/navigation";
import { AppToastProvider } from "@/domains/shared/feedback/AppToastProvider";
import { AppDialogProvider } from "@/domains/shared/feedback/AppDialogProvider";
import { AppProgressProvider } from "@/domains/shared/feedback/AppProgressProvider";
import { perfLog, perfNow, perfStep } from "@/lib/server-perf";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const totalStartedAt = perfNow();
    const user = await perfStep("admin-layout", "getCurrentUser", getCurrentUser);

    if (!user) {
        redirect("/login");
    }

    const permissions = Array.from(new Set(user.permissions ?? []));

    if (permissions.length === 0) {
        redirect("/403");
    }

    perfLog("admin-layout", "totalBeforeRender", totalStartedAt);

    return (
        <AppToastProvider>
            <AppDialogProvider>
                <AppProgressProvider>
                    <AdminShell
                        user={{
                            permissions,
                            name: user.name,
                            roles: user.roles,
                            avatarUrl: user.avatarUrl,
                        }}
                    >
                        {children}
                    </AdminShell>
                </AppProgressProvider>
            </AppDialogProvider>
        </AppToastProvider>
    );
}
