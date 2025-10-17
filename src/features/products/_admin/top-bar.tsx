// src/components/admin/AdminTopbar.tsx
"use client";
import { Bell, Search, LogOut, UserCircle2 } from "lucide-react";

export default function AdminTopbar({
    title = "Dashboard",
    onSignOut,
}: {
    title?: string;
    onSignOut?: () => void; // gắn NextAuth signOut hoặc custom
}) {
    return (
        <header className="sticky top-0 z-20 bg-white border-b">
            <div className="mx-auto px-4 py-3 flex items-center gap-3">
                <h1 className="text-lg font-semibold">{title}</h1>

                <div className="ml-auto flex items-center gap-2">
                    <div className="relative">
                        <input
                            placeholder="Search…"
                            className="w-64 rounded-md border px-3 py-1.5 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                        />
                        <Search
                            size={16}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                    </div>

                    <button className="relative grid place-items-center h-9 w-9 rounded-full border">
                        <Bell size={16} />
                        {/* notification dot */}
                        <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
                    </button>

                    <div className="flex items-center gap-2 rounded-full border px-2 py-1">
                        <UserCircle2 size={18} className="text-gray-600" />
                        <span className="text-sm">Admin</span>
                        <button
                            className="ml-2 inline-flex items-center gap-1 text-xs text-gray-600 hover:text-black"
                            onClick={onSignOut}
                        >
                            <LogOut size={14} /> Logout
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
