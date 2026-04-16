"use client";

import { useState } from "react";

export default function ProfileForm({
    user,
}: {
    user: { name?: string | null; avatarUrl?: string | null };
}) {
    const [name, setName] = useState(user.name ?? "");

    const submit = async () => {
        await fetch("/api/profile", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
        });

        alert("Cập nhật thành công");
    };

    return (
        <div className="space-y-3">
            <h2 className="font-semibold">Thông tin cá nhân</h2>

            <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tên hiển thị"
                className="input"
            />

            <button onClick={submit} className="btn-primary">
                Lưu thay đổi
            </button>
        </div>
    );
}
