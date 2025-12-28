"use client";

export default function LogoutButton() {
    const onLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        window.location.href = "/admin/login";
    };

    return (
        <button
            onClick={onLogout}
            className="text-sm text-red-600 hover:underline"
        >
            Đăng xuất
        </button>
    );
}
