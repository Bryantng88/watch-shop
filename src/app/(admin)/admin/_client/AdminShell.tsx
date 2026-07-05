"use client";

import { useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import AdminTopbar from "./AdminTopBar";
import AdminSidebar from "./AdmidSideBar";

type AdminShellUser = {
    permissions: string[];
    name?: string | null;
    roles?: string[];
    avatarUrl?: string | null;
};

type AdminShellProps = {
    user: AdminShellUser;
    children: ReactNode;
};

export default function AdminShell({ user, children }: AdminShellProps) {
    const searchParams = useSearchParams();
    const isEmbedded = searchParams.get("embedded") === "1";

    if (isEmbedded) {
        return (
            <main className="min-h-screen min-w-0 bg-slate-50">
                {children}
            </main>
        );
    }

    return (
        <div className="grid h-screen overflow-hidden bg-slate-50 lg:grid-cols-[76px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)]">
            <div className="relative z-50 hidden overflow-visible bg-[#11191f] lg:block">
                <AdminSidebar user={{ permissions: user.permissions, name: user.name, roles: user.roles }} />
            </div>

            <div className="lg:hidden">
                <AdminSidebar
                    user={{ permissions: user.permissions, name: user.name, roles: user.roles }}
                    variant="mobile"
                />
            </div>

            <div className="flex min-w-0 flex-col overflow-hidden">
                <AdminTopbar
                    title="Admin"
                    user={{
                        name: user.name,
                        roles: user.roles,
                        avatarUrl: user.avatarUrl,
                    }}
                />

                <main className="min-h-0 min-w-0 flex-1 overflow-y-auto bg-slate-50">
                    {children}
                </main>
            </div>
        </div>
    );
}
