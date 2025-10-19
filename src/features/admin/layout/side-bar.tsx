// src/components/admin/AdminSidebar.tsx
"use client";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  Settings,
  LineChart,
  Tags,
  Users2,
  Menu,
} from "lucide-react";
import ActiveLink from "./active-link";
const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/brands", label: "Brands", icon: Tags },
  { href: "/admin/orders", label: "Orders", icon: Tags },
  { href: "/admin/customers", label: "Customers", icon: Users2 },
  { href: "/admin/reports", label: "Reports", icon: LineChart },
  { href: "/admin/settings", label: "Settings", icon: Settings },
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
          w-72 -translate-x-full lg:translate-x-0
          ${open ? "translate-x-0" : ""}
          bg-gray-950 text-gray-200
          transition-transform
        `}
      >
        <div className="flex items-center gap-2 px-4 h-14 border-b border-white/10">
          <div className="rounded bg-white/10 px-2 py-1 text-xs">Admin</div>
          <span className="text-sm opacity-80">Control Panel</span>
        </div>

        <nav className="p-3 space-y-1">
          {NAV.map((n) => {
            const Icon = n.icon;
            return (
              <ActiveLink key={n.href} href={n.href} exact={n.exact}>
                <Icon size={16} />
                <span>{n.label}</span>
              </ActiveLink>
            );
          })}
        </nav>

        <div className="mt-auto p-3 text-xs opacity-60">
          © {new Date().getFullYear()} Admin
        </div>
      </aside>
    </>
  );
}
