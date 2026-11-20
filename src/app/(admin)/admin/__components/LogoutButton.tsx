"use client";

import { AdminButton } from "@/domains/shared/ui/admin-design-contract/AdminButton";
export default function LogoutButton() {
    const onLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        window.location.href = "/admin/login";
    };

    return (
        <AdminButton variant="secondary"
            onClick={onLogout}
            className="text-sm text-red-600 hover:underline"
        >
            Đăng xuất
        </AdminButton>
    );
}
