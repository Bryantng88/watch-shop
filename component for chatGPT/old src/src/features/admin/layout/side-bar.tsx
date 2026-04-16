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
  Users2,
  Menu,
  ClipboardList,
  Receipt

} from "lucide-react";
import ActiveLink from "./active-link";
const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Sản phẩm", icon: Package },
  { href: "/admin/acquisitions", label: "Phiếu nhập", icon: Tags },
  { href: "/admin/orders", label: "Đơn hàng", icon: ClipboardList },
  { href: "/admin/invoices", label: "Hóa đơn", icon: Receipt },
  { href: "/admin/customers", label: "Khách hàng", icon: Users2 },
  { href: "/admin/reports", label: "Báo cáo", icon: LineChart },
  { href: "/admin/settings", label: "Thiết lập", icon: Settings },
];

export default function AdminSidebar() {
  const [open, setOpen] = useState(false);

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
          {NAV.map((n) => {
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
