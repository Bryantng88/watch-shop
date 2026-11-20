"use client";

import { AdminButton } from "@/domains/shared/ui/admin-design-contract/AdminButton";
import { useCallback, useEffect, useMemo, useState, type ComponentType } from "react";
import {
    LayoutDashboard,
    Package,
    Menu,
    ChevronDown,
    ArrowLeftRight,
    LogOut,
    Workflow,
    Settings,
    PanelLeftClose,
    PanelLeftOpen,
    BarChart3,
    CalendarCheck2,
    Globe,
    ContactRound,
    Images,
} from "lucide-react";

import { TRADING_READ_PERMISSIONS, TRADING_ROUTES } from "@/domains/trading/shared/trading-navigation";

import { PRODUCT_READ_PERMISSIONS, PRODUCT_ROUTES, REPORT_READ_PERMISSIONS, REPORT_ROUTES, reportEntries, SYSTEM_READ_PERMISSIONS, SYSTEM_ROUTES } from "@/domains/shared/ui/navigation/section-navigation";

import ReportMenu from "./ReportMenu";
import ActiveLink from "./AdminActiveLink";
import styles from "./AdminSidebar.module.css";
import { DIRECTORY_READ_PERMISSIONS, DIRECTORY_ROUTES } from "@/domains/contacts/shared/directory-navigation";
import { PERMISSIONS } from "@/constants/permissions";

type Props = {
    user: {
        permissions: string[];
        name?: string | null;
        roles?: string[];
    };
    variant?: "desktop" | "mobile";
    onExpandedChange?: (expanded:boolean)=>void;
};

type NavItem = {
    type: "item";
    href: string;
    label: string;
    icon: ComponentType<{ size?: number; className?: string }>;
    exact?: boolean;
    activePaths?: string[];
    children?: NavItem[];
    permission?: string;
    permissionsAny?: string[];
    permissionsAll?: string[];
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
        type: "group",
        label: "Business",
        defaultOpen: true,
        children: [
            {
                type: "item",
                href: "/admin/dashboard",
                label: "Trang chủ",
                icon: LayoutDashboard,
                permission: PERMISSIONS.DASHBOARD_VIEW,
            },
            { type: "item", href: "/admin/products", label: "Sản phẩm", icon: Package, permissionsAny: [...PRODUCT_READ_PERMISSIONS], activePaths: PRODUCT_ROUTES },
            { type: "item", href: "/admin/trading", label: "Mua bán", icon: ArrowLeftRight, permissionsAny: [...TRADING_READ_PERMISSIONS], activePaths: TRADING_ROUTES },
            {
                type: "item",
                href: "/admin/coordination/operation",
                label: "Vận hành",
                icon: Workflow,
                permission: PERMISSIONS.TASK_VIEW,
            },
            { type: "item", href: "/admin/directory", label: "Danh bạ", icon: ContactRound, permissionsAny: [...DIRECTORY_READ_PERMISSIONS], activePaths: DIRECTORY_ROUTES },
            {
                type: "item",
                href: "/admin/personal-work",
                label: "Quản lý công việc",
                icon: CalendarCheck2,
                permission: PERMISSIONS.TASK_VIEW,
            },
        ],
    },
    { type: "item", href: "/admin/reports", label: "Báo cáo", icon: BarChart3, permissionsAny: [...REPORT_READ_PERMISSIONS], activePaths: REPORT_ROUTES },
    {
        type: "group",
        label: "Storefront",
        defaultOpen: true,
        children: [
            { type: "item", href: "/admin/storefront/home", label: "Trang chủ website", icon: Globe, permission: PERMISSIONS.PRODUCT_UPDATE },
            { type: "item", href: "/admin/storefront/media", label: "Thư viện ảnh website", icon: Images, permission: PERMISSIONS.PRODUCT_UPDATE },
        ],
    },
    { type: "item", href: "/admin/system", label: "System", icon: Settings, permissionsAny: [...SYSTEM_READ_PERMISSIONS], activePaths: SYSTEM_ROUTES },
];

function canAccess(user: Props["user"], item: NavItem): boolean {
    // ADMIN is a system-level bypass. Navigation must not disappear during a
    // permission-catalog migration just because the persisted role still has
    // legacy permission codes.
    if (user.roles?.includes("ADMIN")) return true;
    if (item.children?.length) return item.children.some(child => canAccess(user, child));
    if (item.permissionsAny?.length) {
        return item.permissionsAny.some((permission) => user.permissions.includes(permission));
    }
    if (item.permissionsAll?.length) {
        return item.permissionsAll.every((permission) => user.permissions.includes(permission));
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
    onExpandedChange,
}: Props) {
    const isMobile = variant === "mobile";
    const [wideScreen,setWideScreen]=useState(false);
    useEffect(()=>{const media=window.matchMedia("(min-width: 2200px)");const update=()=>setWideScreen(media.matches);update();media.addEventListener("change",update);return()=>media.removeEventListener("change",update);},[]);
    const [open, setOpen] = useState(false);
    const [desktopExpanded, setDesktopExpanded] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    useEffect(()=>{if(!isMobile)onExpandedChange?.(desktopExpanded);},[desktopExpanded,isMobile,onExpandedChange]);
    const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(
        () => new Set(),
    );
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
        if (item.href === "/admin/reports" && reportEntries(user).length === 0) return null;
        if (item.children?.length) return <ReportMenu key={item.label} label={item.label} icon={Icon} appearance="item" items={item.children.filter(child => canAccess(user, child))} expanded={isMobile || desktopExpanded || wideScreen} onNavigate={() => { if (isMobile) setOpen(false); }} />;
        return (
            <div
                key={item.href}
                className="group relative"
            >
                <ActiveLink
                    href={item.href}
                    label={item.label}
                    title={item.label}
                    onNavigate={() => { if (isMobile) setOpen(false); }}
                    exact={item.exact}
                    activePaths={item.activePaths}
                    expanded={isMobile || desktopExpanded}
                >
                    <Icon size={18} className="shrink-0 opacity-80" />

                    <span className={`${(isMobile || desktopExpanded) ? "inline-flex" : "hidden min-[2200px]:inline-flex"} min-w-0 items-center gap-2`}>
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

                <div className={`pointer-events-none absolute left-[68px] top-1/2 z-[9999] -translate-y-1/2 whitespace-nowrap rounded-lg bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white shadow-xl min-[2200px]:hidden ${(isMobile || desktopExpanded) ? "hidden" : "hidden group-hover:block"}`}>
                    {item.label}
                </div>
            </div>
        );
    }

    return (
        <>
            {isMobile ? (
                <div className="sticky top-0 z-30 flex items-center gap-3 bg-gray-950 px-4 py-2 text-white lg:hidden">
                    <AdminButton variant="contextual"
                        onClick={() => setOpen(true)}
                        className="inline-flex items-center gap-2"
                        type="button"
                    >
                        <Menu size={18} />
                        <span className="text-sm">Menu</span>
                    </AdminButton>

                    <div className="ml-auto flex items-center gap-3">
                        <span className="text-sm opacity-80">Admin</span>
                        <AdminButton variant="contextual" density="compact"
                            type="button"
                            onClick={handleLogout}
                            disabled={loggingOut}
                            className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2 py-1 text-xs font-semibold text-white/80 hover:text-white disabled:cursor-wait disabled:opacity-50"
                        >
                            <LogOut className="h-3.5 w-3.5" />
                            Logout
                        </AdminButton>
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
                    (isMobile || desktopExpanded)
                        ? "w-[240px]"
                        : "w-[76px] min-[2200px]:w-[240px]",
                    "lg:static lg:h-screen lg:translate-x-0",
                    open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
                ].join(" ")}
            >
                {!isMobile ? (
                    <div className={`flex h-14 shrink-0 items-center border-b border-white/10 px-3 min-[2200px]:hidden ${desktopExpanded ? "justify-between" : "justify-center"}`}>
                        {desktopExpanded ? (
                            <span className="pl-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/55">Menu</span>
                        ) : null}
                        <AdminButton iconOnly variant="contextual" density="compact"
                            type="button"
                            onClick={toggleDesktopSidebar}
                            className="grid h-9 w-9 place-items-center rounded-lg text-white/65 transition hover:bg-white/10 hover:text-white"
                            aria-label={desktopExpanded ? "Thu gọn thanh điều hướng" : "Mở rộng thanh điều hướng"}
                            aria-expanded={desktopExpanded}
                            title={desktopExpanded ? "Thu gọn sidebar" : "Mở rộng sidebar"}
                        >
                            {desktopExpanded ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
                        </AdminButton>
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
                        <AdminButton variant="contextual"
                            className="ml-auto text-white/80 hover:text-white"
                            onClick={() => setOpen(false)}
                            type="button"
                            aria-label="Close menu"
                        >
                            ✕
                        </AdminButton>
                    ) : null}
                </div> : null}

                <nav aria-label="Điều hướng quản trị" data-collapsed={!isMobile && !desktopExpanded && !wideScreen} className={`${styles.navigation} relative z-50 min-h-0 flex-1 space-y-1 px-3 py-3`}>
                    {allowedNav.map((entry, index) => {
                        if (entry.type === "group") {
                            const hasChildren = Boolean(entry.children?.length);
                            const isCollapsed = collapsedGroups.has(entry.label);
                            // Keep rail shortcuts visible when their group header is hidden.
                            const isOpen = hasChildren && (!isCollapsed || (!isMobile && !desktopExpanded && !wideScreen));

                            return (
                                <div
                                    key={`group-${entry.label}-${index}`}
                                    className="pt-3 first:pt-0"
                                >
                                    {hasChildren ? (
                                        <AdminButton variant="contextual" density="compact"
                                            type="button"
                                            onClick={() => toggleGroup(entry.label)}
                                            className={`mx-2 w-[calc(100%-1rem)] items-center justify-between border-t border-white/10 pt-3 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45 transition hover:text-white/70 ${(isMobile || desktopExpanded) ? "flex" : "hidden min-[2200px]:flex"}`}
                                            aria-expanded={isOpen}
                                        >
                                            <span>{entry.label}</span>
                                            <ChevronDown
                                                className={[
                                                    "h-3.5 w-3.5 transition-transform",
                                                    isOpen ? "rotate-0" : "-rotate-90",
                                                ].join(" ")}
                                            />
                                        </AdminButton>
                                    ) : (
                                        <div className={`mx-2 border-t border-white/10 pt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35 ${(isMobile || desktopExpanded) ? "block" : "hidden min-[2200px]:block"}`}>
                                            {entry.label}
                                        </div>
                                    )}

                                    <div className={`mx-auto h-px w-7 bg-white/10 min-[2200px]:hidden ${(isMobile || desktopExpanded) ? "hidden" : "block"}`} />

                                    {isOpen ? (
                                        <div className={`mt-1 space-y-1 ${(isMobile || desktopExpanded) ? "pl-2" : "min-[2200px]:pl-2"}`}>
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
                    <span className={(isMobile || desktopExpanded) ? "inline" : "hidden min-[2200px]:inline"}>
                        © {new Date().getFullYear()} Admin
                    </span>
                </div>
            </aside>
        </>
    );
}
