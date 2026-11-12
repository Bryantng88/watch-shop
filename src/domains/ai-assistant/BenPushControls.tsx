"use client";

import { useEffect, useState } from "react";

const api = "/api/admin/customer-assistant";

async function updateSubscription(body: unknown) {
  const response = await fetch(api, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error("Ben chưa lưu được cài đặt thông báo.");
  return response.json();
}

export default function BenPushControls() {
  const [key, setKey] = useState<string>();
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!("PushManager" in window) || !("Notification" in window) || !("serviceWorker" in navigator)) return;
    let active = true;
    void fetch(api + "?push=1", {cache:"no-store"}).then(async response => {
      if (!response.ok) return;
      const {publicKey} = await response.json();
      const registration = await navigator.serviceWorker.getRegistration("/admin/ben");
      if (active && typeof publicKey === "string") {
        setKey(publicKey);
        const current = await registration?.pushManager.getSubscription();
        if (current) {
          const {enabled} = await updateSubscription({action:"push-status",endpoint:current.endpoint});
          if (active && enabled) setSubscription(current);
        }
      }
    }).catch(() => {});
    return () => { active = false; };
  }, []);

  async function toggle() {
    setBusy(true);
    setNotice("");
    try {
      if (subscription) {
        await updateSubscription({action:"unsubscribe-push",endpoint:subscription.endpoint});
        await subscription.unsubscribe();
        setSubscription(null);
        return;
      }
      if (await Notification.requestPermission() !== "granted") {
        setNotice("Chưa có quyền thông báo. Bạn có thể bật trong cài đặt của trình duyệt.");
        return;
      }
      const registration = await navigator.serviceWorker.getRegistration("/admin/ben");
      if (!registration?.active) throw new Error("Ben đang chuẩn bị thông báo. Chờ một chút rồi thử lại.");
      const current = await registration.pushManager.getSubscription();
      const next = current ?? await registration.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:key});
      const {endpoint, keys} = next.toJSON();
      await updateSubscription({action:"subscribe-push",subscription:{endpoint,keys}});
      setSubscription(next);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Chưa đổi được cài đặt thông báo.");
    } finally {
      setBusy(false);
    }
  }

  if (!key) return null;
  return <div className="mx-3 flex min-h-10 shrink-0 flex-wrap items-center gap-x-3 px-1 text-xs">
    <button type="button" disabled={busy} onClick={() => void toggle()} className="min-h-10 font-medium text-blue-700 disabled:opacity-50">
      {subscription ? "Tắt thông báo" : "Bật thông báo"}
    </button>
    {subscription && <button type="button" disabled={busy} className="min-h-10 text-slate-600 disabled:opacity-50" onClick={async () => {
      setBusy(true); try { await updateSubscription({action:"test-push"}); setNotice("Đã gửi yêu cầu thử. Kiểm tra thông báo trên thiết bị nhé."); }
      catch { setNotice("Chưa gửi được thông báo thử."); } finally { setBusy(false); }
    }}>Gửi thử</button>}
    {notice && <p role="status" className="text-slate-600">{notice}</p>}
  </div>;
}
