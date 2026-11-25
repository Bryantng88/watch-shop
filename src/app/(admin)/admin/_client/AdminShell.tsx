"use client";
import { AdminShellHeadingProvider } from "@/domains/shared/ui/admin-design-contract/AdminShellHeading";
import { adminRouteTitle } from "@/domains/shared/ui/admin-design-contract/admin-route-title";
import { ADMIN_WORKSPACE_FRAME, ADMIN_WORKSPACE_FRAME_STYLE } from "@/domains/shared/ui/admin-design-contract/AdminWorkspaceFrame";
import type {BenEnvironment} from "@/domains/ai-assistant/environment";

import { usePathname, useSearchParams } from "next/navigation";
import {type ReactNode} from "react";
import AdminTopbar from "./AdminTopBar";
import { AdminTopNavigation } from "./AdmidSideBar";
import { AdminNavigationHistoryProvider } from "@/domains/shared/ui/navigation/AdminNavigationHistory";
import AiAssistant from "@/domains/ai-assistant/AiAssistant";

type AdminShellUser = {
    id: string;
    permissions: string[];
    name?: string | null;
    roles?: string[];
    avatarUrl?: string | null;
};

type AdminShellProps = {
    assistantSimulation?: boolean;
    assistantLive?: boolean;
    assistantEnvironment?: BenEnvironment;
    assistantImageSearch?: boolean;
    user: AdminShellUser;
    children: ReactNode;
};

export default function AdminShell({ user, children, assistantSimulation = false, assistantLive = false, assistantEnvironment, assistantImageSearch = false }: AdminShellProps) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const isBen = pathname === "/admin/ben";
    const isRecordDetail = /^\/admin\/(?:watches|orders)\/[^/]+$/.test(pathname) && !pathname.endsWith("/new");
    const isBenWorkList = pathname === "/admin/personal-work" && searchParams.get("view") === "list";
    const isTechnicianWorkspace = pathname === "/admin/services/technician";
    const isBenMediaList = pathname === "/admin/ben/media";
    const isBenMediaEditor = /^\/admin\/watches\/[^/]+\/edit$/.test(pathname) && searchParams.get("mode") === "media" && searchParams.get("source") === "ben-media";
    const isEmbedded = searchParams.get("embedded") === "1";

    return (
        <AdminNavigationHistoryProvider>
        {isBen || isEmbedded || isBenWorkList || isBenMediaList || isBenMediaEditor ? <main className="min-h-[100dvh] min-w-0 bg-slate-50">
            {children}
            {isBen && !assistantLive && <p className="p-6">Ben chưa được bật ở môi trường này.</p>}
        </main> : (
        <div className={`relative flex h-[100dvh] min-w-0 flex-col overflow-hidden ${isRecordDetail ? "bg-slate-50" : "bg-white"}`}>
            <AdminShellHeadingProvider enabled={!isTechnicianWorkspace}><div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
                <div className={isTechnicianWorkspace ? "hidden lg:block" : undefined}>
                <AdminTopbar
                    title={adminRouteTitle(pathname)}
                    navigation={<AdminTopNavigation user={user} />}
                    user={{
                        id: user.id,
                        name: user.name,
                        roles: user.roles,
                        avatarUrl: user.avatarUrl,
                    }}
                />
                </div>

                <main className={`min-h-0 min-w-0 flex-1 overflow-y-auto ${isRecordDetail ? "bg-slate-50" : "bg-white"} ${isTechnicianWorkspace ? "w-full" : ADMIN_WORKSPACE_FRAME}`} style={isTechnicianWorkspace ? undefined : ADMIN_WORKSPACE_FRAME_STYLE}>
                    {children}
                </main>
            </div></AdminShellHeadingProvider>
        </div>)}
        <div hidden={isEmbedded || isBenWorkList || isTechnicianWorkspace || isBenMediaList || (isBen && !assistantLive)}>
        {(assistantSimulation || assistantLive) && <AiAssistant key={`${user.id}:${assistantLive?"live":"simulation"}`} userId={user.id} userProfile={{name:user.name,avatarUrl:user.avatarUrl}} live={assistantLive} environment={assistantEnvironment} imageSearch={assistantImageSearch} fullPage={isBen && assistantLive} canViewMedia={!!user.roles?.includes("ADMIN") || user.permissions.includes("TASK_VIEW")} canViewTechnical={!!user.roles?.includes("ADMIN") || user.permissions.includes("SERVICE_VIEW")} canManage={!!user.roles?.includes("ADMIN") || user.permissions.includes("TASK_MANAGE")} />}
        </div>
        </AdminNavigationHistoryProvider>
    );
}
