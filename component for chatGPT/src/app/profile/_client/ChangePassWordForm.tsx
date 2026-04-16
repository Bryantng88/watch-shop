"use client";

import { useState } from "react";

export default function ChangePasswordForm() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const submit = async () => {
        setLoading(true);
        const res = await fetch("/api/profile/change-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ oldPassword, newPassword }),
        });
        setLoading(false);

        if (!res.ok) {
            alert("Đổi mật khẩu thất bại");
            return;
        }

        alert("Đổi mật khẩu thành công, vui lòng đăng nhập lại");
        window.location.href = "/login";
    };

    return (
        <div className="space-y-3">
            <h2 className="font-semibold">Đổi mật khẩu</h2>

            <input
                type="password"
                placeholder="Mật khẩu cũ"
                className="input"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
            />

            <input
                type="password"
                placeholder="Mật khẩu mới"
                className="input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />

            <button onClick={submit} disabled={loading} className="btn-primary">
                Đổi mật khẩu
            </button>
        </div>
    );
}
