"use client";

import { AdminButton } from "@/domains/shared/ui/admin-design-contract/AdminButton";
import { ArrowLeft, Bell, Search, LogOut } from "lucide-react";
import { useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useNotifications } from "../__hooks/useNotifications";
import type { AdminNotificationItem } from "../__hooks/useNotifications";
import { useAdminNavigationHistory } from "@/domains/shared/ui/navigation/AdminNavigationHistory";
import { AdminUserAvatar } from "@/domains/shared/ui/admin-design-contract";
import { ADMIN_UI_FOUNDATION } from "@/domains/shared/ui/admin-design-contract/admin-ui.foundation";

import styles from "./AdminTopBar.module.css";

import { useAdminNavigationProfile } from "@/domains/shared/ui/admin-design-contract/AdminNavigationProfile";

type AdminTopbarProps = {
    navigation?: ReactNode;
    title?: string;
    user?: {
        id?: string;
        name?: string | null;
        avatarUrl?: string | null;
        roles?: string[];
    };
};

function TopbarAvatar({ user }: { user?: AdminTopbarProps["user"] }) {
    return <AdminUserAvatar user={user ?? { name: "User" }} />;
}
function metadataRecord(value: unknown): Record<string, unknown> {
    return value && typeof value === "object" && !Array.isArray(value)
        ? (value as Record<string, unknown>)
        : {};
}

function getNotificationRoute(item: AdminNotificationItem) {
    const meta = metadataRecord(item.metadata);

    const rawRoute =
        typeof meta.route === "string"
            ? meta.route
            : typeof meta.link === "string"
                ? meta.link
                : typeof meta.productId === "string"
                    ? `/admin/watches/${meta.productId}?focus=${typeof meta.focus === "string" ? meta.focus : "pricing"}`
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
    title = "Admin",
    navigation,
    user,
}: AdminTopbarProps) {
    const { profile } = useAdminNavigationProfile(user?.id);
    const navTheme = ADMIN_UI_FOUNDATION.navigationProfiles[profile];
    const navStyle = { "--nav-bg": navTheme.background, "--nav-text": navTheme.text, "--nav-muted": navTheme.muted, "--nav-active": navTheme.active, "--nav-hover": navTheme.hover, "--nav-border": navTheme.border, "--nav-scheme": navTheme.scheme } as CSSProperties;
    const [loading, setLoading] = useState(false);
    const [openNotify, setOpenNotify] = useState(false);
    const boxRef = useRef<HTMLDivElement | null>(null);
    const router = useRouter();
    const { canGoBack, goBack } = useAdminNavigationHistory();

    const {
        items,
        unreadCount,
        fetchNotifications,
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
        <header className={`sticky top-0 z-40 shrink-0 ${styles.header}`} style={navStyle}>
            <div className="mx-auto flex items-center gap-3 px-4 py-3" style={{ maxWidth: ADMIN_UI_FOUNDATION.page.workspaceMaxWidth }}>
                {canGoBack ? (
                    <AdminButton variant="contextual" density="compact"
                        type="button"
                        onClick={goBack}
                        className={styles.tool}
                        aria-label="Quay lại trang trước"
                    >
                        <ArrowLeft size={16} />
                        <span className="hidden sm:inline">Quay lại</span>
                    </AdminButton>
                ) : null}
                <h1 className={navigation ? "sr-only" : "min-w-0 truncate text-lg font-semibold"} title={title}>{title}</h1>
                {navigation}

                <div className="ml-auto flex items-center gap-2">
                    <div className="relative hidden md:block">
                        <input
                            placeholder="Search…"
                            className={`w-40 rounded-md border px-3 py-1.5 pr-9 text-sm ${styles.search}`}
                        />
                        <Search
                            size={16}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                    </div>

                    <div className="relative" ref={boxRef}>
                        <AdminButton iconOnly variant="contextual" density="compact" aria-label="Thông báo"
                            type="button"
                            onClick={() => {
                                setOpenNotify((value) => {
                                    const next = !value;
                                    if (next) void fetchNotifications();
                                    return next;
                                });
                            }}
                            className={`relative h-9 w-9 ${styles.tool}`}
                        >
                            <Bell size={16} />
                            {hasUnread ? (
                                <span className="absolute -right-0.5 -top-0.5 min-w-[18px] rounded-full bg-red-500 px-1 text-center text-[10px] font-semibold leading-[18px] text-white">
                                    {unreadCount > 99 ? "99+" : unreadCount}
                                </span>
                            ) : null}
                        </AdminButton>

                        {openNotify ? (
                            <div className={`absolute right-0 top-11 z-50 w-[380px] max-w-[calc(100vw-32px)] overflow-hidden rounded-2xl border bg-white shadow-xl ${styles.notifications}`}>
                                <div className="flex items-center justify-between border-b px-4 py-3">
                                    <div>
                                        <div className="text-sm font-semibold">Thông báo</div>
                                        <div className="text-xs text-gray-500">
                                            {unreadCount} chưa đọc
                                        </div>
                                    </div>

                                    <AdminButton variant="secondary" density="compact"
                                        type="button"
                                        onClick={markAllAsRead}
                                        className="text-xs font-medium text-gray-600 hover:text-black"
                                    >
                                        Đánh dấu đã đọc hết
                                    </AdminButton>
                                </div>

                                <div className="max-h-[420px] overflow-y-auto">
                                    {!notifyItems.length ? (
                                        <div className="px-4 py-8 text-center text-sm text-gray-500">
                                            Chưa có thông báo nào
                                        </div>
                                    ) : (
                                        notifyItems.map((item) => (
                                            <AdminButton variant="contextual"
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
                                            </AdminButton>
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

                    <div className={`flex items-center gap-2 rounded-full border px-3 py-1 ${styles.account}`}>
                        <Link
                            href="/admin/profile"
                            aria-label="Thông tin tài khoản"
                            className="flex items-center gap-2 hover:opacity-80"
                        >
                            <TopbarAvatar user={user} />
                            <div className="hidden sm:flex sm:flex-col leading-tight">
                                <span className="text-sm font-medium">
                                    {user?.name ?? "User"}
                                </span>
                                {user?.roles?.length ? (
                                    <span className={`text-[11px] ${styles.muted}`}>
                                        {user.roles.join(", ")}
                                    </span>
                                ) : null}
                            </div>
                        </Link>

                        <AdminButton variant="contextual" density="compact" aria-label="Đăng xuất" title="Đăng xuất"
                            onClick={handleLogout}
                            className={`ml-2 ${styles.tool}`}
                        >
                            <LogOut size={14} /><span className="hidden sm:inline">Logout</span>
                        </AdminButton>
                    </div>
                </div>
            </div>
        </header>
    );
}
