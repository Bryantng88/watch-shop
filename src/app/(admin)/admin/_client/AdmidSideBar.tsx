"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ComponentType } from "react";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    Tags,
    User,
    Menu,
    ChevronDown,
    ClipboardList,
    LogOut,
    Workflow,
    BellRing,
    Activity,
    Link2,
    PanelLeftClose,
    PanelLeftOpen,
} from "lucide-react";

import ActiveLink from "./AdminActiveLink";
import { PERMISSIONS } from "@/constants/permissions";
import { useAppProgress } from "@/domains/shared/feedback/AppProgressProvider";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";

type Props = {
    user: {
        permissions: string[];
        name?: string | null;
        roles?: string[];
    };
    variant?: "desktop" | "mobile";
};

type NavItem = {
    type: "item";
    href: string;
    label: string;
    icon: ComponentType<{ size?: number; className?: string }>;
    exact?: boolean;
    permission?: string;
    permissionsAny?: string[];
};

type NavGroup = {
    type: "group";
    label: string;
    children?: NavItem[];
    defaultOpen?: boolean;
};

type NavEntry = NavItem | NavGroup;

const DESKTOP_SIDEBAR_STORAGE_KEY = "admin-sidebar:expanded";

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
            },
            {
                type: "item",
                href: "/admin/straps",
                label: "Phụ kiện",
                icon: Link2,
                permission: PERMISSIONS.ACCESSORY_VIEW,
            },
            {
                type: "item",
                href: "/admin/acquisitions",
                label: "Phiếu nhập",
                icon: Tags,
                permissionsAny: [PERMISSIONS.ACQUISITION_VIEW_ALL, PERMISSIONS.WATCH_ACQUISITION_VIEW, PERMISSIONS.ACCESSORY_ACQUISITION_VIEW],
            },
            {
                type: "item",
                href: "/admin/orders",
                label: "Đơn hàng",
                icon: ClipboardList,
                permission: PERMISSIONS.ORDER_VIEW,
            },
            {
                type: "item",
                href: "/admin/coordination/operation",
                label: "Vận hành",
                icon: Workflow,
                permission: PERMISSIONS.TASK_VIEW,
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
                href: "/admin/activity",
                label: "Activity",
                icon: Activity,
                permission: PERMISSIONS.ACTIVITY_READ,
            },
            {
                type: "item",
                href: "/admin/users",
                label: "Users",
                icon: User,
                permissionsAny: [PERMISSIONS.USER_VIEW, PERMISSIONS.USER_CREATE, PERMISSIONS.USER_UPDATE, PERMISSIONS.USER_MANAGE],
            },
        ],
    },
];

function isCurrentRoute(pathname: string, item: NavItem) {
    if (item.exact) return pathname === item.href;
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

function canAccess(user: Props["user"], item: NavItem) {
    // ADMIN is a system-level bypass. Navigation must not disappear during a
    // permission-catalog migration just because the persisted role still has
    // legacy permission codes.
    if (user.roles?.includes("ADMIN")) return true;
    if (item.permissionsAny?.length) {
        return item.permissionsAny.some((permission) => user.permissions.includes(permission));
    }
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
    variant = "desktop",
}: Props) {
    const isMobile = variant === "mobile";
    const pathname = usePathname();
    const progress = useAppProgress();
    const notify = useNotify();
    const [open, setOpen] = useState(false);
    const [desktopExpanded, setDesktopExpanded] = useState(false);
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

    useEffect(() => {
        if (isMobile) return;
        setDesktopExpanded(window.localStorage.getItem(DESKTOP_SIDEBAR_STORAGE_KEY) === "true");
    }, [isMobile]);

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

    const toggleDesktopSidebar = useCallback(() => {
        setDesktopExpanded((current) => {
            const next = !current;
            window.localStorage.setItem(DESKTOP_SIDEBAR_STORAGE_KEY, String(next));
            return next;
        });
    }, []);

    function renderNavItem(item: NavItem, nested = false) {
        const Icon = item.icon;
        return (
            <div
                key={item.href}
                className="group relative"
                onClick={(event) => handleMenuSwitch(item, event)}
            >
                <ActiveLink
                    href={item.href}
                    exact={item.exact}
                    expanded={!isMobile && desktopExpanded}
                >
                    <Icon size={18} className="shrink-0 opacity-80" />

                    <span className={`${desktopExpanded && !isMobile ? "inline-flex" : "hidden min-[2200px]:inline-flex"} min-w-0 items-center gap-2`}>
                        <span
                            className={[
                                "truncate text-[14px] leading-none",
                                nested ? "text-white/75" : "",
                            ].join(" ")}
                        >
                            {item.label}
                        </span>

                    </span>
                </ActiveLink>

                <div className={`pointer-events-none absolute left-[68px] top-1/2 z-[9999] -translate-y-1/2 whitespace-nowrap rounded-lg bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white shadow-xl min-[2200px]:hidden ${desktopExpanded && !isMobile ? "hidden" : "hidden group-hover:block"}`}>
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
                    "flex flex-col transition-[width,transform,box-shadow] duration-200 ease-out",
                    desktopExpanded && !isMobile
                        ? "w-[240px] shadow-[18px_0_40px_rgba(15,23,42,0.22)]"
                        : "w-[76px] min-[2200px]:w-[240px]",
                    "lg:static lg:h-screen lg:translate-x-0",
                    open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
                ].join(" ")}
            >
                {!isMobile ? (
                    <div className={`flex h-14 shrink-0 items-center border-b border-white/10 px-3 min-[2200px]:hidden ${desktopExpanded ? "justify-between" : "justify-center"}`}>
                        {desktopExpanded ? (
                            <span aria-label="Menu" className="pl-2 text-[0px] font-semibold uppercase tracking-[0.16em] text-white/55 before:text-xs before:content-['MENU']">
                                Äiá»u hÆ°á»›ng
                            </span>
                        ) : null}
                        <button
                            type="button"
                            onClick={toggleDesktopSidebar}
                            className="grid h-9 w-9 place-items-center rounded-lg text-white/65 transition hover:bg-white/10 hover:text-white"
                            aria-label={desktopExpanded ? "Thu gá»n thanh Ä‘iá»u hÆ°á»›ng" : "Má»Ÿ rá»™ng thanh Ä‘iá»u hÆ°á»›ng"}
                            aria-expanded={desktopExpanded}
                            title={desktopExpanded ? "Thu gá»n sidebar" : "Má»Ÿ rá»™ng sidebar"}
                        >
                            {desktopExpanded ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
                        </button>
                    </div>
                ) : null}

                {isMobile ? <div className="flex h-12 items-center gap-2 border-b border-white/10 px-4">
                    <div className="rounded bg-white/10 px-2 py-0.5 text-[10px]">
                        Admin
                    </div>

                    <span className="text-xs opacity-70">
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
                </div> : null}

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
                                            className={`mx-2 w-[calc(100%-1rem)] items-center justify-between border-t border-white/10 pt-3 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45 transition hover:text-white/70 ${desktopExpanded && !isMobile ? "flex" : "hidden min-[2200px]:flex"}`}
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
                                        <div className={`mx-2 border-t border-white/10 pt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35 ${desktopExpanded && !isMobile ? "block" : "hidden min-[2200px]:block"}`}>
                                            {entry.label}
                                        </div>
                                    )}

                                    <div className={`mx-auto h-px w-7 bg-white/10 min-[2200px]:hidden ${desktopExpanded && !isMobile ? "hidden" : "block"}`} />

                                    {isOpen ? (
                                        <div className={`mt-1 space-y-1 ${desktopExpanded && !isMobile ? "pl-2" : "min-[2200px]:pl-2"}`}>
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
                    <span className={desktopExpanded && !isMobile ? "inline" : "hidden min-[2200px]:inline"}>
                        © {new Date().getFullYear()} Admin
                    </span>
                </div>
            </aside>
        </>
    );
}
