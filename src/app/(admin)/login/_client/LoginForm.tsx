"use client";

import { useEffect, useState } from "react";

export default function LoginForm({ localAutoLogin = false }: { localAutoLogin?: boolean }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [autoLoggingIn, setAutoLoggingIn] = useState(localAutoLogin);

    useEffect(() => {
        if (!localAutoLogin) return;
        const controller = new AbortController();
        void (async () => {
            try {
                const response = await fetch("/api/auth/local-login", {
                    method: "POST",
                    signal: controller.signal,
                    credentials: "same-origin",
                });
                if (!response.ok) throw new Error("Không thể tự đăng nhập local. Bạn vẫn có thể đăng nhập bằng mật khẩu.");
                if (!controller.signal.aborted) window.location.replace("/admin");
            } catch (cause) {
                if (!controller.signal.aborted) {
                    setError(cause instanceof Error ? cause.message : "Không thể tự đăng nhập local.");
                    setAutoLoggingIn(false);
                }
            }
        })();
        return () => controller.abort();
    }, [localAutoLogin]);

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

        window.location.href = "/admin";
    }

    return (
        <form
            onSubmit={onSubmit}
            className="w-80 bg-white p-6 rounded shadow space-y-4"
        >
            <h1 className="text-lg font-semibold text-center">Admin Login</h1>
            {autoLoggingIn && <p role="status" className="text-sm text-center text-gray-600">Đang đăng nhập local…</p>}

            {error && <div className="text-sm text-red-600">{error}</div>}

            <input
                type="email"
                disabled={autoLoggingIn}
                placeholder="Email"
                className="w-full border rounded px-3 py-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="password"
                disabled={autoLoggingIn}
                placeholder="Password"
                className="w-full border rounded px-3 py-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button disabled={autoLoggingIn} className="w-full bg-black text-white py-2 rounded disabled:opacity-50">
                Đăng nhập
            </button>
        </form>
    );
}
