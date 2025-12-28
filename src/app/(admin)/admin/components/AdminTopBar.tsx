// src/components/admin/AdminTopbar.tsx
"use client";

import { Bell, Search, LogOut, UserCircle2 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

type AdminTopbarProps = {
    title?: string;
    user?: {
        name?: string | null;
        roles?: string[];
    };
};

export default function AdminTopbar({
    title = "Dashboard",
    user,
}: AdminTopbarProps) {

    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        if (loading) return;
        setLoading(true);

        await fetch("/api/auth/logout", {
            method: "POST",
        });

        // redirect client-side
        window.location.replace("/login");
    };

    return (
        <header className="sticky top-0 z-20 bg-white border-b">
            <div className="mx-auto px-4 py-3 flex items-center gap-3">
                {/* Title */}
                <h1 className="text-lg font-semibold">{title}</h1>

                <div className="ml-auto flex items-center gap-2">
                    {/* Search */}
                    <div className="relative hidden md:block">
                        <input
                            placeholder="Search…"
                            className="w-64 rounded-md border px-3 py-1.5 pr-9 text-sm
              focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                        />
                        <Search
                            size={16}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                    </div>

                    {/* Notification */}
                    <button className="relative grid place-items-center h-9 w-9 rounded-full border">
                        <Bell size={16} />
                        <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
                    </button>

                    {/* User info */}
                    <div className="flex items-center gap-2 rounded-full border px-3 py-1">
                        <UserCircle2 size={18} className="text-gray-600" />
                        <Link
                            href="/admin/profile"
                            className="flex flex-col leading-tight hover:underline"
                        >
                            <span className="text-sm font-medium">
                                {user?.name ?? "User"}
                            </span>

                            {user?.roles?.length ? (
                                <span className="text-[11px] text-gray-500">
                                    {user.roles.join(", ")}
                                </span>
                            ) : null}
                        </Link>



                        <button
                            onClick={handleLogout}
                            className="ml-2 inline-flex items-center gap-1 text-xs text-gray-600 hover:text-black"
                        >
                            <LogOut size={14} /> Logout
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
