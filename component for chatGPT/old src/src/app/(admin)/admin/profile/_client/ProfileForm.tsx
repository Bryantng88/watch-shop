"use client";

import { useState } from "react";

export default function ProfileForm({ user }: any) {
    const [name, setName] = useState(user.name ?? "");
    const [loading, setLoading] = useState(false);

    const submit = async () => {
        setLoading(true);
        await fetch("/api/admin/profile", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
        });
        setLoading(false);
        alert("Đã lưu thay đổi");
    };

    return (
        <div className="rounded-lg border bg-white p-6">
            <h2 className="text-lg font-medium mb-4">Thông tin cá nhân</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                {/* Email */}
                <div>
                    <label className="text-sm text-gray-500">Email</label>
                    <div className="mt-1 font-medium text-gray-900">
                        admin@system.local
                    </div>
                </div>

                {/* Name */}
                <div>
                    <label className="text-sm text-gray-500">Tên hiển thị</label>
                    <input
                        className="mt-1 w-full rounded-md border px-3 py-2"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
            </div>

            <div className="mt-6 flex justify-end">
                <button className="rounded-md bg-black px-4 py-2 text-sm text-white hover:bg-neutral-800">
                    Lưu thay đổi
                </button>
            </div>
        </div>

    );
}
