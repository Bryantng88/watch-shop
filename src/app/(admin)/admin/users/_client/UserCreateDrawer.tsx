"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
type Role = {
    id: string;
    name: string;
    permissions: string[];
};

export default function UserCreateForm({ roles }: { roles: Role[] }) {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [roleId, setRoleId] = useState(roles[0]?.id);
    const [isActive, setIsActive] = useState(true);
    const [loading, setLoading] = useState(false);

    async function handleSubmit() {
        setLoading(true);

        const res = await fetch("/api/admin/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email,
                password,
                roleId,
                isActive,
            }),
        });

        setLoading(false);

        if (!res.ok) {
            alert("Tạo user thất bại");
            return;
        }

        router.push("/admin/users");
        router.refresh();
    }

    const currentRole = roles.find(r => r.id === roleId);

    return (
        <div className="max-w-3xl space-y-6">
            {/* HEADER */}
            <div>
                <h1 className="text-xl font-semibold">Tạo người dùng</h1>
                <p className="text-sm text-gray-500">
                    Tạo tài khoản và phân quyền truy cập hệ thống
                </p>
            </div>

            {/* LOGIN INFO */}
            <div className="rounded-lg border bg-white p-5 space-y-4">
                <h2 className="font-medium">Thông tin đăng nhập</h2>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs text-gray-600">Email</label>
                        <input
                            className="mt-1 w-full h-9 rounded border px-2"
                            placeholder="user@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                    </div>

                    <div>
                        <label className="text-xs text-gray-600">Mật khẩu</label>
                        <input
                            type="password"
                            className="mt-1 w-full h-9 rounded border px-2"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                    </div>
                </div>

                <div>
                    <label className="text-xs text-gray-600">Trạng thái</label>
                    <select
                        className="mt-1 h-9 rounded border px-2"
                        value={String(isActive)}
                        onChange={(e) => setIsActive(e.target.value === "true")}
                    >
                        <option value="true">Active</option>
                        <option value="false">Disabled</option>
                    </select>

                </div>
            </div>

            {/* ROLE */}
            <div className="rounded-lg border bg-white p-5 space-y-4">
                <h2 className="font-medium">Phân quyền</h2>

                <div>
                    <label className="text-xs text-gray-600">Role</label>
                    <select
                        className="mt-1 h-9 rounded border px-2 w-64"
                        value={roleId}
                        onChange={(e) => setRoleId(e.target.value)}
                    >
                        {roles.map(r => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                    </select>
                </div>

                {/* Permission preview */}
                <div>
                    <label className="text-xs text-gray-600">Quyền được cấp</label>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {currentRole?.permissions.map(p => (
                            <span
                                key={p}
                                className="px-2 py-0.5 text-xs rounded bg-blue-50 text-blue-700"
                            >
                                {p}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* ACTION */}
            <div className="flex justify-end gap-2">
                <button className="border rounded px-4 h-9">Hủy</button>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-black text-white px-4 h-9 rounded"
                >
                    {loading ? "Đang tạo..." : "Tạo người dùng"}
                </button>
            </div>
        </div>
    );
}
