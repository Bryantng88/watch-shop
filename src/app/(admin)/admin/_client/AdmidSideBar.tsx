"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    Settings,
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
}>;

type Props = {
    user: { permissions: string[] };
    notifications?: NotificationCounts;
    variant?: "desktop" | "mobile";
};

type NavItem = {
    href: string;
    label: string;
    icon: any;
    exact?: boolean;
    permission?: string;
    notificationKey?: keyof NotificationCounts;
};

const NAV: NavItem[] = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true, permission: PERMISSIONS.DASHBOARD_VIEW },
    { href: "/admin/watches", label: "Sản phẩm", icon: Package, permission: PERMISSIONS.PRODUCT_VIEW, notificationKey: "products" },
    { href: "/admin/acquisitions", label: "Phiếu nhập", icon: Tags, permission: PERMISSIONS.ACQUISITION_VIEW, notificationKey: "acquisitions" },
    { href: "/admin/orders", label: "Đơn hàng", icon: ClipboardList, permission: PERMISSIONS.ORDER_VIEW, notificationKey: "orders" },
    { href: "/admin/services", label: "Service", icon: Settings, permission: PERMISSIONS.SERVICE_VIEW, notificationKey: "services" },
    { href: "/admin/catalogs/technical", label: "Danh mục", icon: LayoutList, permission: PERMISSIONS.SERVICE_VIEW },
    { href: "/admin/shipments", label: "Shipment", icon: Warehouse, permission: PERMISSIONS.SHIPMENT_VIEW, notificationKey: "shipments" },
    { href: "/admin/customers", label: "Khách hàng", icon: Users2, permission: PERMISSIONS.CUSTOMER_VIEW },
    { href: "/admin/system/jobs", label: "Jobs", icon: MonitorCog, permission: PERMISSIONS.SYSTEM_JOB_VIEW },
    { href: "/admin/media", label: "Media", icon: CameraIcon, permission: PERMISSIONS.MEDIA_VIEW },
    { href: "/admin/users", label: "Người dùng", icon: User, permission: PERMISSIONS.USER_VIEW },
    { href: "/admin/reports", label: "Báo cáo", icon: LineChart, permission: PERMISSIONS.REPORT_VIEW },
];

function isCurrentRoute(pathname: string, item: NavItem) {
    if (item.exact) return pathname === item.href;
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
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
    const hideTimerRef = useRef<number | null>(null);

    useEffect(() => {
        return () => {
            if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
        };
    }, []);

    const allowedNav = useMemo(
        () => NAV.filter((n) => !n.permission || user.permissions.includes(n.permission)),
        [user.permissions],
    );

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

                    <div className="ml-auto text-sm opacity-80">Admin</div>
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
                    {allowedNav.map((n) => {
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