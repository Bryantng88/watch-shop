// Ben stays online-only: never persist conversations, authenticated HTML or APIs.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
self.addEventListener("fetch", (event) => {
  if (new URL(event.request.url).origin !== self.location.origin) return;
  if (event.request.method !== "GET" || event.request.mode !== "navigate" || new URL(event.request.url).pathname !== "/admin/ben") return;
  event.respondWith(fetch(event.request).catch(() => new Response(
    '<!doctype html><html lang="vi"><meta name="viewport" content="width=device-width,initial-scale=1"><meta charset="utf-8"><title>Ben · Offline</title><body style="font-family:system-ui;padding:32px"><h1>Ben đang chờ kết nối</h1><p>Kết nối mạng rồi mở lại để tiếp tục trò chuyện.</p><a href="/admin/ben">Thử lại</a></body></html>',
    { status: 503, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } }
  )));
});

self.addEventListener("push", event => {
  event.waitUntil(self.registration.showNotification("Ben", {
    body: "Bạn có công việc mới",
    icon: "/ben/icon-192.png",
  }));
});

self.addEventListener("notificationclick", event => {
  event.notification.close();
  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    const ben = windows.find(client => new URL(client.url).pathname === "/admin/ben");
    if (ben) await ben.focus();
    else await self.clients.openWindow("/admin/ben");
  })());
});
