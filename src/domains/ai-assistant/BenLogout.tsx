"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";

export function BenLogout() {
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);

  async function logout() {
    setPending(true);
    setFailed(false);
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) throw new Error("Logout failed");
      window.location.replace(window.location.hostname === "ben.vinticwatches.vn"
        ? "/cdn-cgi/access/logout"
        : "/login?next=%2Fadmin%2Fben");
    } catch {
      setFailed(true);
      setPending(false);
    }
  }

  return <div className="relative">
    <button type="button" aria-label="Đăng xuất" title="Đăng xuất" disabled={pending}
      onClick={() => void logout()}
      className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl text-slate-600 hover:bg-violet-50 disabled:opacity-50">
      <LogOut size={19} />
    </button>
    {failed && <p role="alert" className="absolute right-0 top-full z-10 w-48 rounded-lg border bg-white p-2 text-xs text-rose-700">Chưa đăng xuất được. Bấm lại để thử.</p>}
  </div>;
}
