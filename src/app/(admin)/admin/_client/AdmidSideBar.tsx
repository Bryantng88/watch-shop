"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ComponentType } from "react";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    LineChart,
    Tags,
    User,
    Users2,
    Menu,
    ChevronDown,
    ClipboardList,
    Warehouse,
    LayoutList,
    MonitorCog,
    CameraIcon,
    CheckSquare,
    LogOut,
    Workflow,
    BellRing,
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
    icon: ComponentType<{ size?: number; className?: string }>;
    exact?: boolean;
    permission?: string;
    notificationKey?: keyof NotificationCounts;
};

type NavGroup = {
    type: "group";
    label: string;
    children?: NavItem[];
    defaultOpen?: boolean;
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
    {
        type: "group",
        label: "Business",
        defaultOpen: true,
        children: [
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
                href: "/admin/coordination/operation",
                label: "Vận hành",
                icon: Workflow,
                permission: PERMISSIONS.TASK_VIEW,
                notificationKey: "tasks",
            },
            {
                type: "item",
                href: "/admin/shipments",
                label: "Vận chuyển",
                icon: Warehouse,
                permission: PERMISSIONS.SHIPMENT_VIEW,
                notificationKey: "shipments",
            },
            {
                type: "item",
                href: "/admin/customers",
                label: "Khách hàng",
                icon: Users2,
                permission: PERMISSIONS.CUSTOMER_VIEW,
            },
        ],
    },
    {
        type: "group",
        label: "System",
        defaultOpen: true,
        children: [
            {
                type: "item",
                href: "/admin/system/channels",
                label: "Channels",
                icon: BellRing,
                permission: PERMISSIONS.SYSTEM_JOB_VIEW,
            },
            {
                type: "item",
                href: "/admin/catalogs/technical",
                label: "Catalog",
                icon: LayoutList,
                permission: PERMISSIONS.SERVICE_VIEW,
            },
            {
                type: "item",
                href: "/admin/settings/task-types",
                label: "Workspace Templates",
                icon: CheckSquare,
                permission: PERMISSIONS.TASK_MANAGE,
            },
            {
                type: "item",
                href: "/admin/system/blueprints",
                label: "Blueprint Library",
                icon: Workflow,
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
                label: "Users",
                icon: User,
                permission: PERMISSIONS.USER_VIEW,
            },
            {
                type: "item",
                href: "/admin/reports",
                label: "Reports",
                icon: LineChart,
                permission: PERMISSIONS.REPORT_VIEW,
            },
        ],
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

        if (entry.children?.length) {
            const children = entry.children.filter((item) => canAccess(user, item));
            if (children.length) result.push({ ...entry, children });
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
    const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(
        () => new Set(),
    );
    const hideTimerRef = useRef<number | null>(null);

    useEffect(() => {
        return () => {
            if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
        };
    }, []);

    const allowedNav = useMemo(() => buildAllowedNav(user), [user]);

    const toggleGroup = useCallback((label: string) => {
        setCollapsedGroups((current) => {
            const next = new Set(current);
            if (next.has(label)) {
                next.delete(label);
            } else {
                next.add(label);
            }
            return next;
        });
    }, []);

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

    function renderNavItem(item: NavItem, nested = false) {
        const Icon = item.icon;
        const count = Number(
            item.notificationKey ? notifications?.[item.notificationKey] ?? 0 : 0,
        );

        return (
            <div
                key={item.href}
                className="group relative"
                onClick={(event) => handleMenuSwitch(item, event)}
            >
                <ActiveLink href={item.href} exact={item.exact}>
                    <Icon size={18} className="shrink-0 opacity-80" />

                    <span className="hidden min-w-0 items-center gap-2 xl:inline-flex">
                        <span
                            className={[
                                "truncate text-[14px] leading-none",
                                nested ? "text-white/75" : "",
                            ].join(" ")}
                        >
                            {item.label}
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
                    {item.label}
                </div>
            </div>
        );
    }

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
                            const hasChildren = Boolean(entry.children?.length);
                            const isCollapsed = collapsedGroups.has(entry.label);
                            const isOpen = hasChildren && !isCollapsed;

                            return (
                                <div
                                    key={`group-${entry.label}-${index}`}
                                    className="pt-3 first:pt-0"
                                >
                                    {hasChildren ? (
                                        <button
                                            type="button"
                                            onClick={() => toggleGroup(entry.label)}
                                            className="mx-2 hidden w-[calc(100%-1rem)] items-center justify-between border-t border-white/10 pt-3 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45 transition hover:text-white/70 xl:flex"
                                            aria-expanded={isOpen}
                                        >
                                            <span>{entry.label}</span>
                                            <ChevronDown
                                                className={[
                                                    "h-3.5 w-3.5 transition-transform",
                                                    isOpen ? "rotate-0" : "-rotate-90",
                                                ].join(" ")}
                                            />
                                        </button>
                                    ) : (
                                        <div className="mx-2 hidden border-t border-white/10 pt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35 xl:block">
                                            {entry.label}
                                        </div>
                                    )}

                                    <div className="mx-auto h-px w-7 bg-white/10 xl:hidden" />

                                    {isOpen ? (
                                        <div className="mt-1 space-y-1 xl:pl-2">
                                            {entry.children?.map((item) =>
                                                renderNavItem(item, true),
                                            )}
                                        </div>
                                    ) : null}
                                </div>
                            );
                        }

                        return renderNavItem(entry);
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
