"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    LineChart,
    Tags,
    User,
    Users2,
    Menu,
    ClipboardList,
    Warehouse,
    LayoutList,
    MonitorCog,
    CameraIcon,
    CheckSquare,
    ListTodo,
    Wrench,
    AlertCircle,
    LogOut,
    UserCircle2,
} from "lucide-react";

import ActiveLink from "./AdminActiveLink";
import { PERMISSIONS } from "@/constants/permissions";
import { useAppProgress } from "@/domains/shared/feedback/AppProgressProvider";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";

type NotificationCounts = Partial<{
    products: number;
    acquisitions: number;
    orders: number;
    services: number;
    shipments: number;
    invoices: number;
    payments: number;
    tasks: number;
    workCases: number;
}>;

type Props = {
    user: {
        permissions: string[];
        name?: string | null;
        roles?: string[];
    };
    notifications?: NotificationCounts;
    variant?: "desktop" | "mobile";
};

type NavItem = {
    type: "item";
    href: string;
    label: string;
    icon: any;
    exact?: boolean;
    permission?: string;
    notificationKey?: keyof NotificationCounts;
};

type NavGroup = {
    type: "group";
    label: string;
};

type NavEntry = NavItem | NavGroup;

const NAV: NavEntry[] = [
    {
        type: "item",
        href: "/admin/dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        exact: true,
        permission: PERMISSIONS.DASHBOARD_VIEW,
    },

    { type: "group", label: "Vận hành" },

    {
        type: "item",
        href: "/admin/watches",
        label: "Sản phẩm",
        icon: Package,
        permission: PERMISSIONS.PRODUCT_VIEW,
        notificationKey: "products",
    },
    {
        type: "item",
        href: "/admin/acquisitions",
        label: "Phiếu nhập",
        icon: Tags,
        permission: PERMISSIONS.ACQUISITION_VIEW,
        notificationKey: "acquisitions",
    },
    {
        type: "item",
        href: "/admin/orders",
        label: "Đơn hàng",
        icon: ClipboardList,
        permission: PERMISSIONS.ORDER_VIEW,
        notificationKey: "orders",
    },
    {
        type: "item",
        href: "/admin/shipments",
        label: "Shipment",
        icon: Warehouse,
        permission: PERMISSIONS.SHIPMENT_VIEW,
        notificationKey: "shipments",
    },
    {
        type: "item",
        href: "/admin/services",
        label: "Service",
        icon: Wrench,
        permission: PERMISSIONS.SERVICE_VIEW,
        notificationKey: "services",
    },

    { type: "group", label: "Điều phối" },

    {
        type: "item",
        href: "/admin/work-cases",
        label: "Phiếu xử lý",
        icon: AlertCircle,
        permission: PERMISSIONS.TASK_VIEW,
        notificationKey: "workCases",
    },
    {
        type: "item",
        href: "/admin/tasks",
        label: "Tasks",
        icon: CheckSquare,
        permission: PERMISSIONS.TASK_VIEW,
        notificationKey: "tasks",
    },
    {
        type: "item",
        href: "/admin/task-items",
        label: "Task Items",
        icon: ListTodo,
        permission: PERMISSIONS.TASK_VIEW,
    },

    { type: "group", label: "Hệ thống" },

    {
        type: "item",
        href: "/admin/catalogs/technical",
        label: "Danh mục",
        icon: LayoutList,
        permission: PERMISSIONS.SERVICE_VIEW,
    },
    {
        type: "item",
        href: "/admin/customers",
        label: "Khách hàng",
        icon: Users2,
        permission: PERMISSIONS.CUSTOMER_VIEW,
    },
    {
        type: "item",
        href: "/admin/settings/task-types",
        label: "Loại task",
        icon: CheckSquare,
        permission: PERMISSIONS.TASK_MANAGE,
    },
    {
        type: "item",
        href: "/admin/workflows",
        label: "Workflow",
        icon: CheckSquare,
        permission: PERMISSIONS.TASK_MANAGE,
    },
    {
        type: "item",
        href: "/admin/media",
        label: "Media",
        icon: CameraIcon,
        permission: PERMISSIONS.MEDIA_VIEW,
    },
    {
        type: "item",
        href: "/admin/system/jobs",
        label: "Jobs",
        icon: MonitorCog,
        permission: PERMISSIONS.SYSTEM_JOB_VIEW,
    },
    {
        type: "item",
        href: "/admin/users",
        label: "Người dùng",
        icon: User,
        permission: PERMISSIONS.USER_VIEW,
    },
    {
        type: "item",
        href: "/admin/reports",
        label: "Báo cáo",
        icon: LineChart,
        permission: PERMISSIONS.REPORT_VIEW,
    },
];

function isCurrentRoute(pathname: string, item: NavItem) {
    if (item.exact) return pathname === item.href;
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

function canAccess(user: Props["user"], item: NavItem) {
    return !item.permission || user.permissions.includes(item.permission);
}

function buildAllowedNav(user: Props["user"]) {
    const result: NavEntry[] = [];

    for (let i = 0; i < NAV.length; i++) {
        const entry = NAV[i];

        if (entry.type === "item") {
            if (canAccess(user, entry)) result.push(entry);
            continue;
        }

        const hasAllowedItemAfterGroup = NAV.slice(i + 1).some((next) => {
            if (next.type === "group") return false;
            return canAccess(user, next);
        });

        if (hasAllowedItemAfterGroup) result.push(entry);
    }

    return result;
}

export default function AdminSidebar({
    user,
    notifications,
    variant = "desktop",
}: Props) {
    const isMobile = variant === "mobile";
    const pathname = usePathname();
    const progress = useAppProgress();
    const notify = useNotify();
    const [open, setOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const hideTimerRef = useRef<number | null>(null);

    useEffect(() => {
        return () => {
            if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
        };
    }, []);

    const allowedNav = useMemo(() => buildAllowedNav(user), [user]);

    const handleMenuSwitch = useCallback(
        (item: NavItem, event: React.MouseEvent) => {
            if (
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey ||
                event.defaultPrevented ||
                isCurrentRoute(pathname, item)
            ) {
                return;
            }

            if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);

            progress.show({
                title: "Đang chuyển menu",
                message: `Đang mở ${item.label}.`,
            });

            notify.info({
                title: "Đang chuyển menu",
                message: item.label,
            });

            if (isMobile) setOpen(false);

            hideTimerRef.current = window.setTimeout(() => {
                progress.hide();
            }, 1200);
        },
        [isMobile, notify, pathname, progress],
    );

    const handleLogout = useCallback(async () => {
        if (loggingOut) return;

        setLoggingOut(true);
        await fetch("/api/auth/logout", { method: "POST" });
        window.location.replace("/login");
    }, [loggingOut]);

    return (
        <>
            {isMobile ? (
                <div className="sticky top-0 z-30 flex items-center gap-3 bg-gray-950 px-4 py-2 text-white lg:hidden">
                    <button
                        onClick={() => setOpen(true)}
                        className="inline-flex items-center gap-2"
                        type="button"
                    >
                        <Menu size={18} />
                        <span className="text-sm">Menu</span>
                    </button>

                    <div className="ml-auto flex items-center gap-3">
                        <span className="text-sm opacity-80">Admin</span>
                        <button
                            type="button"
                            onClick={handleLogout}
                            disabled={loggingOut}
                            className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2 py-1 text-xs font-semibold text-white/80 hover:text-white disabled:cursor-wait disabled:opacity-50"
                        >
                            <LogOut className="h-3.5 w-3.5" />
                            Logout
                        </button>
                    </div>
                </div>
            ) : null}

            {isMobile && open ? (
                <div
                    className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                    onClick={() => setOpen(false)}
                />
            ) : null}

            <aside
                className={[
                    "fixed left-0 top-0 z-50 h-full overflow-visible bg-[#11191f] text-gray-200",
                    "flex flex-col transition-transform",
                    "w-[76px] xl:w-[240px]",
                    "lg:static lg:h-screen lg:translate-x-0",
                    open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
                ].join(" ")}
            >
                <div className="flex h-12 items-center gap-2 border-b border-white/10 px-4">
                    <div className="rounded bg-white/10 px-2 py-0.5 text-[10px]">
                        Admin
                    </div>

                    <span className="hidden text-xs opacity-70 xl:inline">
                        Control Panel
                    </span>

                    {!isMobile ? (
                        <button
                            type="button"
                            onClick={handleLogout}
                            disabled={loggingOut}
                            title="Logout"
                            className="ml-auto hidden h-8 w-8 items-center justify-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white disabled:cursor-wait disabled:opacity-50 xl:flex"
                        >
                            <LogOut className="h-4 w-4" />
                        </button>
                    ) : null}

                    {isMobile ? (
                        <button
                            className="ml-auto text-white/80 hover:text-white"
                            onClick={() => setOpen(false)}
                            type="button"
                            aria-label="Close menu"
                        >
                            ✕
                        </button>
                    ) : null}
                </div>

                <nav className="relative z-50 space-y-1 overflow-visible px-3 py-3">
                    {allowedNav.map((entry, index) => {
                        if (entry.type === "group") {
                            return (
                                <div
                                    key={`group-${entry.label}-${index}`}
                                    className="pt-3 first:pt-0"
                                >
                                    <div className="mx-2 hidden border-t border-white/10 pt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35 xl:block">
                                        {entry.label}
                                    </div>

                                    <div className="mx-auto h-px w-7 bg-white/10 xl:hidden" />
                                </div>
                            );
                        }

                        const n = entry;
                        const Icon = n.icon;
                        const count = Number(
                            n.notificationKey ? notifications?.[n.notificationKey] ?? 0 : 0,
                        );

                        return (
                            <div
                                key={n.href}
                                className="group relative"
                                onClick={(event) => handleMenuSwitch(n, event)}
                            >
                                <ActiveLink href={n.href} exact={n.exact}>
                                    <Icon size={18} className="shrink-0 opacity-80" />

                                    <span className="hidden min-w-0 items-center gap-2 xl:inline-flex">
                                        <span className="truncate text-[14px] leading-none">
                                            {n.label}
                                        </span>

                                        {Number.isFinite(count) && count > 0 ? (
                                            <span className="inline-flex h-[18px] min-w-[18px] shrink-0 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold leading-none text-white">
                                                {count > 99 ? "99+" : count}
                                            </span>
                                        ) : null}
                                    </span>

                                    {Number.isFinite(count) && count > 0 ? (
                                        <span className="absolute right-2 top-2 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold leading-none text-white xl:hidden">
                                            {count > 99 ? "99+" : count}
                                        </span>
                                    ) : null}
                                </ActiveLink>

                                <div className="pointer-events-none absolute left-[68px] top-1/2 z-[9999] hidden -translate-y-1/2 whitespace-nowrap rounded-lg bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white shadow-xl group-hover:block xl:hidden">
                                    {n.label}
                                </div>
                            </div>
                        );
                    })}
                </nav>

                <div className="mt-auto p-3 text-[11px] opacity-50">
                    <span className="hidden xl:inline">
                        © {new Date().getFullYear()} Admin
                    </span>
                </div>
            </aside>
        </>
    );
}
