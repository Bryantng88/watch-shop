"use client";

import { Bell, Search, LogOut, UserCircle2 } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useNotifications } from "../__hooks/useNotifications";

type AdminTopbarProps = {
    title?: string;
    user?: {
        name?: string | null;
        roles?: string[];
    };
};
function getNotificationRoute(item: any) {
    const meta = item.metadata ?? {};

    const rawRoute =
        typeof meta.route === "string"
            ? meta.route
            : typeof meta.link === "string"
                ? meta.link
                : typeof meta.productId === "string"
                    ? `/admin/watches/${meta.productId}?focus=${meta.focus ?? "pricing"}`
                    : "/admin/watches";

    const separator = rawRoute.includes("?") ? "&" : "?";

    return `${rawRoute}${separator}notificationId=${item.id}`;
}
function formatRelativeTime(input: string) {
    const date = new Date(input);
    const diff = Date.now() - date.getTime();

    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Vừa xong";
    if (minutes < 60) return `${minutes} phút trước`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ trước`;

    const days = Math.floor(hours / 24);
    return `${days} ngày trước`;
}

export default function AdminTopbar({
    title = "Dashboard",
    user,
}: AdminTopbarProps) {
    const [loading, setLoading] = useState(false);
    const [openNotify, setOpenNotify] = useState(false);
    const boxRef = useRef<HTMLDivElement | null>(null);
    const router = useRouter();

    const {
        items,
        unreadCount,
        markAsRead,
        markAllAsRead,
    } = useNotifications();

    const hasUnread = unreadCount > 0;

    const handleLogout = async () => {
        if (loading) return;
        setLoading(true);

        await fetch("/api/auth/logout", {
            method: "POST",
        });

        window.location.replace("/login");
    };

    const notifyItems = useMemo(() => items.slice(0, 6), [items]);

    return (
        <header className="sticky top-0 z-20 border-b bg-white">
            <div className="mx-auto flex items-center gap-3 px-4 py-3">
                <h1 className="text-lg font-semibold">{title}</h1>

                <div className="ml-auto flex items-center gap-2">
                    <div className="relative hidden md:block">
                        <input
                            placeholder="Search…"
                            className="w-64 rounded-md border px-3 py-1.5 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                        />
                        <Search
                            size={16}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                    </div>

                    <div className="relative" ref={boxRef}>
                        <button
                            type="button"
                            onClick={() => setOpenNotify((v) => !v)}
                            className="relative grid h-9 w-9 place-items-center rounded-full border hover:bg-gray-50"
                        >
                            <Bell size={16} />
                            {hasUnread ? (
                                <span className="absolute -right-0.5 -top-0.5 min-w-[18px] rounded-full bg-red-500 px-1 text-center text-[10px] font-semibold leading-[18px] text-white">
                                    {unreadCount > 99 ? "99+" : unreadCount}
                                </span>
                            ) : null}
                        </button>

                        {openNotify ? (
                            <div className="absolute right-0 top-11 z-50 w-[380px] overflow-hidden rounded-2xl border bg-white shadow-xl">
                                <div className="flex items-center justify-between border-b px-4 py-3">
                                    <div>
                                        <div className="text-sm font-semibold">Thông báo</div>
                                        <div className="text-xs text-gray-500">
                                            {unreadCount} chưa đọc
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={markAllAsRead}
                                        className="text-xs font-medium text-gray-600 hover:text-black"
                                    >
                                        Đánh dấu đã đọc hết
                                    </button>
                                </div>

                                <div className="max-h-[420px] overflow-y-auto">
                                    {!notifyItems.length ? (
                                        <div className="px-4 py-8 text-center text-sm text-gray-500">
                                            Chưa có thông báo nào
                                        </div>
                                    ) : (
                                        notifyItems.map((item) => (
                                            <button
                                                key={item.id}
                                                type="button"
                                                onClick={async () => {
                                                    if (!item.isRead) {
                                                        await markAsRead(item.id);
                                                    }

                                                    const route = getNotificationRoute(item);

                                                    setOpenNotify(false);
                                                    router.push(route);
                                                }}
                                                className={`block w-full border-b px-4 py-3 text-left transition hover:bg-gray-50 ${item.isRead ? "bg-white" : "bg-blue-50/40"
                                                    }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <span
                                                        className={`mt-1.5 h-2.5 w-2.5 rounded-full ${item.priority === "HIGH"
                                                            ? "bg-red-500"
                                                            : item.priority === "LOW"
                                                                ? "bg-gray-400"
                                                                : "bg-blue-500"
                                                            }`}
                                                    />
                                                    <div className="min-w-0 flex-1">
                                                        <div className="truncate text-sm font-semibold text-gray-900">
                                                            {item.title}
                                                        </div>
                                                        <div className="mt-1 line-clamp-2 text-xs text-gray-600">
                                                            {item.message}
                                                        </div>
                                                        <div className="mt-2 text-[11px] text-gray-400">
                                                            {formatRelativeTime(item.createdAt)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        ))
                                    )}
                                </div>

                                <div className="border-t px-4 py-3">
                                    <Link
                                        href="/admin/notifications"
                                        onClick={() => setOpenNotify(false)}
                                        className="text-sm font-medium text-gray-700 hover:text-black"
                                    >
                                        Xem tất cả
                                    </Link>
                                </div>
                            </div>
                        ) : null}
                    </div>

                    <div className="flex items-center gap-2 rounded-full border px-3 py-1">
                        <Link
                            href="/admin/profile"
                            className="flex items-center gap-2 hover:opacity-80"
                        >
                            <UserCircle2 size={18} className="text-gray-600" />
                            <div className="flex flex-col leading-tight">
                                <span className="text-sm font-medium">
                                    {user?.name ?? "User"}
                                </span>
                                {user?.roles?.length ? (
                                    <span className="text-[11px] text-gray-500">
                                        {user.roles.join(", ")}
                                    </span>
                                ) : null}
                            </div>
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