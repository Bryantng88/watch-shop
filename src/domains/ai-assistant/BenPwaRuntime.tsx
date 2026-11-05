"use client";
import { useEffect, useState } from "react";
export default function BenPwaRuntime() {
  const [offline, setOffline] = useState(false);
  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    update(); window.addEventListener("online", update); window.addEventListener("offline", update);
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      void navigator.serviceWorker.register("/ben-sw.js", { scope: "/admin/ben", updateViaCache: "none" }).catch(() => undefined);
    }
    return () => { window.removeEventListener("online", update); window.removeEventListener("offline", update); };
  }, []);
  return offline ? <p role="status" className="fixed bottom-0 left-0 right-0 z-[80] bg-amber-100 px-3 py-1 text-center text-xs text-amber-950">Đang offline — Ben cần kết nối mạng để trả lời và xử lý yêu cầu.</p> : null;
}
