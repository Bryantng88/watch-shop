"use client";

import { useState } from "react";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        const res = await fetch("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
            headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
            const data = await res.json();
            setError(data.error ?? "Login failed");
            return;
        }

        window.location.href = "/admin/orders";
    }

    return (
        <form
            onSubmit={onSubmit}
            className="w-80 bg-white p-6 rounded shadow space-y-4"
        >
            <h1 className="text-lg font-semibold text-center">Admin Login</h1>

            {error && <div className="text-sm text-red-600">{error}</div>}

            <input
                type="email"
                placeholder="Email"
                className="w-full border rounded px-3 py-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="password"
                placeholder="Password"
                className="w-full border rounded px-3 py-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button className="w-full bg-black text-white py-2 rounded">
                Đăng nhập
            </button>
        </form>
    );
}
