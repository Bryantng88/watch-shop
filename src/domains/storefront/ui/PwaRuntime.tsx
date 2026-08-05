"use client";

import { useEffect, useState } from "react";

export function useOnlineStatus() {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);
  return online;
}

export default function PwaRuntime() {
  const online = useOnlineStatus();
  useEffect(() => {
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => undefined);
    }
  }, []);
  if (online) return null;
  return <div role="status" className="bg-[#8b2f2f] px-4 py-2 text-center text-xs font-medium text-white">Đang offline — chỉ xem được nội dung đã lưu. Không thể gửi yêu cầu hoặc xác nhận tình trạng sản phẩm.</div>;
}
