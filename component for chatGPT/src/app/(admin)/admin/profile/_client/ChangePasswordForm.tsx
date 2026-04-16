"use client";

import { useState } from "react";

export default function ChangePasswordForm() {
    const [oldPassword, setOld] = useState("");
    const [newPassword, setNew] = useState("");
    const [loading, setLoading] = useState(false);

    const submit = async () => {
        setLoading(true);
        const res = await fetch("/api/admin/profile/change-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ oldPassword, newPassword }),
        });
        setLoading(false);

        if (!res.ok) return alert("Sai mật khẩu cũ");

        alert("Đổi mật khẩu thành công");
        setOld("");
        setNew("");
    };

    return (
        <div className="rounded-lg border bg-white p-6">
            <h2 className="text-lg font-medium mb-4">Đổi mật khẩu</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                    type="password"
                    placeholder="Mật khẩu cũ"
                    className="rounded-md border px-3 py-2"
                />
                <input
                    type="password"
                    placeholder="Mật khẩu mới"
                    className="rounded-md border px-3 py-2"
                />
            </div>

            <div className="mt-6 flex justify-end">
                <button className="rounded-md bg-black px-4 py-2 text-sm text-white hover:bg-neutral-800">
                    Đổi mật khẩu
                </button>
            </div>
        </div>

    );
}
