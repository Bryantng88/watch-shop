// src/components/admin/AdminSidebar.tsx
"use client";
import { useState } from "react";
import {
    LayoutDashboard,
    Package,
    Settings,
    LineChart,
    FileSpreadsheet,
    Tags,
    User,
    Users2,
    Menu,
    ClipboardList,
    Receipt,
    Warehouse

} from "lucide-react";
import ActiveLink from "./AdminActiveLink";
import { PERMISSIONS } from "@/constants/permissions";

type Props = {
    user: {
        permissions: string[];
    };
};


const NAV = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true, permission: PERMISSIONS.DASHBOARD_VIEW },
    { href: "/admin/products", label: "Sản phẩm", icon: Package, permission: PERMISSIONS.PRODUCT_VIEW },
    { href: "/admin/acquisitions", label: "Phiếu nhập", icon: Tags, permission: PERMISSIONS.ACQUISITION_VIEW },
    { href: "/admin/orders", label: "Đơn hàng", icon: ClipboardList, permission: PERMISSIONS.ORDER_VIEW },
    { href: "/admin/invoices", label: "Hóa đơn", icon: Receipt, permission: PERMISSIONS.INVOICE_VIEW },
    { href: "/admin/shipment", label: "Shipment", icon: Warehouse, permission: PERMISSIONS.SHIPMENT_VIEW },
    { href: "/admin/customers", label: "Khách hàng", icon: Users2, permission: PERMISSIONS.CUSTOMER_VIEW },
    { href: "/admin/users", label: "Người dùng", icon: User, permission: PERMISSIONS.USER_VIEW },
    { href: "/admin/reports", label: "Báo cáo", icon: LineChart, permission: PERMISSIONS.REPORT_VIEW },
    { href: "/admin/settings", label: "Thiết lập", icon: Settings },
];

export default function AdminSidebar({ user }: Props) {
    const [open, setOpen] = useState(false);
    const allowedNav = NAV.filter(
        (n) => !n.permission || user.permissions.includes(n.permission)
    );

    return (
        <>
            {/* Mobile top strip to open drawer */}
            <div className="lg:hidden sticky top-0 z-30 bg-gray-950 text-white px-4 py-2 flex items-center gap-3">
                <button
                    onClick={() => setOpen(true)}
                    className="inline-flex items-center gap-2"
                >
                    <Menu size={18} /> <span className="text-sm">Menu</span>
                </button>
                <div className="ml-auto text-sm opacity-80">Admin</div>
            </div>

            {/* Drawer overlay (mobile) */}
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
    fixed z-50 lg:static lg:z-auto
    top-0 left-0 h-full lg:h-auto
    w-52 -translate-x-full lg:translate-x-0
    ${open ? "translate-x-0" : ""}
    bg-[#11191f] text-gray-200
    transition-transform
  `}
            >
                {/* Header */}
                <div className="flex items-center gap-2 px-4 h-12 border-b border-white/10">
                    <div className="rounded bg-white/10 px-2 py-0.5 text-[10px]">
                        Admin
                    </div>
                    <span className="text-xs opacity-70">Control Panel</span>
                </div>

                {/* Nav */}
                <nav className="px-3 py-3 space-y-1">
                    {allowedNav.map((n) => {
                        const Icon = n.icon;
                        return (
                            <ActiveLink
                                key={n.href}
                                href={n.href}
                                exact={n.exact}
                            >
                                <Icon size={15} className="opacity-80" />
                                <span className="text-[14px]">{n.label}</span>
                            </ActiveLink>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="mt-auto p-3 text-[11px] opacity-50">
                    © {new Date().getFullYear()} Admin
                </div>
            </aside>

        </>
    );
}
