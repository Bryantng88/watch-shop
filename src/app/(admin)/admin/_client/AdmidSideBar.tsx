// src/components/admin/AdminSidebar.tsx
"use client";

import { useMemo, useState } from "react";
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
    Receipt,
    Warehouse,
    CreditCard,
    LayoutList,
    MonitorCog
} from "lucide-react";
import ActiveLink from "./AdminActiveLink";
import { PERMISSIONS } from "@/constants/permissions";

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
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true, permission: PERMISSIONS.DASHBOARD_VIEW },
    { href: "/admin/watches", label: "Sản phẩm", icon: Package, permission: PERMISSIONS.PRODUCT_VIEW, notificationKey: "products" },
    { href: "/admin/acquisitions", label: "Phiếu nhập", icon: Tags, permission: PERMISSIONS.ACQUISITION_VIEW, notificationKey: "acquisitions" },
    { href: "/admin/orders", label: "Đơn hàng", icon: ClipboardList, permission: PERMISSIONS.ORDER_VIEW, notificationKey: "orders" },
    { href: "/admin/services", label: "Service", icon: Settings, permission: PERMISSIONS.SERVICE_VIEW, notificationKey: "services" },
    { href: "/admin/catalogs/technical", label: "Danh mục", icon: LayoutList, permission: PERMISSIONS.SERVICE_VIEW },
    { href: "/admin/shipments", label: "Shipment", icon: Warehouse, permission: PERMISSIONS.SHIPMENT_VIEW, notificationKey: "shipments" },
    { href: "/admin/customers", label: "Khách hàng", icon: Users2, permission: PERMISSIONS.CUSTOMER_VIEW },
    { href: "/admin/invoices", label: "Hóa đơn", icon: Receipt, permission: PERMISSIONS.INVOICE_VIEW, notificationKey: "invoices" },
    { href: "/admin/payments", label: "Payment", icon: CreditCard, permission: PERMISSIONS.PAYMENT_VIEW, notificationKey: "payments" },
    { href: "/admin/system/jobs", label: "Jobs", icon: MonitorCog, permission: PERMISSIONS.SYSTEM_JOB_VIEW, notificationKey: "payments" },

    { href: "/admin/users", label: "Người dùng", icon: User, permission: PERMISSIONS.USER_VIEW },
    { href: "/admin/reports", label: "Báo cáo", icon: LineChart, permission: PERMISSIONS.REPORT_VIEW },
];

export default function AdminSidebar({ user, notifications, variant = "desktop" }: Props) {
    const isMobile = variant === "mobile";
    const [open, setOpen] = useState(false);

    const allowedNav = useMemo(
        () => NAV.filter((n) => !n.permission || user.permissions.includes(n.permission)),
        [user.permissions]
    );

    return (
        <>
            {isMobile && (
                <div className="lg:hidden sticky top-0 z-30 bg-gray-950 text-white px-4 py-2 flex items-center gap-3">
                    <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2">
                        <Menu size={18} /> <span className="text-sm">Menu</span>
                    </button>
                    <div className="ml-auto text-sm opacity-80">Admin</div>
                </div>
            )}

            {isMobile && open && (
                <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />
            )}

            <aside
                className={`
    fixed z-50 lg:static lg:z-auto
    top-0 left-0 h-full lg:h-screen
    w-52 -translate-x-full lg:translate-x-0
    ${open ? "translate-x-0" : ""}
    bg-[#11191f] text-gray-200
    transition-transform
    flex flex-col
  `}
            >
                <div className="flex items-center gap-2 px-4 h-12 border-b border-white/10">
                    <div className="rounded bg-white/10 px-2 py-0.5 text-[10px]">Admin</div>
                    <span className="text-xs opacity-70">Control Panel</span>

                    {isMobile && (
                        <button
                            className="ml-auto text-white/80 hover:text-white"
                            onClick={() => setOpen(false)}
                            type="button"
                            aria-label="Close menu"
                        >
                            ✕
                        </button>
                    )}
                </div>

                <nav className="px-3 py-3 space-y-1">
                    {allowedNav.map((n) => {
                        const Icon = n.icon;
                        const count = Number(
                            n.notificationKey ? notifications?.[n.notificationKey as keyof NotificationCounts] ?? 0 : 0
                        );

                        return (
                            <ActiveLink key={n.href} href={n.href} exact={n.exact}>
                                <Icon size={15} className="opacity-80 shrink-0" />
                                <span className="inline-flex items-center gap-2 min-w-0">
                                    <span className="text-[14px] leading-none">{n.label}</span>
                                    {Number.isFinite(count) && count > 0 ? (
                                        <span className="inline-flex h-[18px] min-w-[18px] shrink-0 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold leading-none text-white">
                                            {count > 99 ? "99+" : count}
                                        </span>
                                    ) : null}
                                </span>
                            </ActiveLink>
                        );
                    })}
                </nav>

                <div className="mt-auto p-3 text-[11px] opacity-50">© {new Date().getFullYear()} Admin</div>
            </aside>
        </>
    );
}
