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

function workNotificationRoute(value) {
  if (value === "/admin/personal-work?view=list" || (typeof value === "string" && /^\/admin\/personal-work\?item=[\w%-]+$/.test(value))) return "/admin/personal-work?view=list";
  return typeof value === "string" && /^\/admin\/ben\/work\/[\w%-]+$/.test(value) ? value : "/admin/ben";
}
self.addEventListener("push", event => {
  let payload = {};
  try { payload = event.data?.json() || {}; } catch {}
  const labels = { ASSIGNED: "Bạn được giao một công việc mới", SHARED: "Có công việc được chia sẻ với bạn", CHANGED: "Lịch công việc đã thay đổi", CANCELLED: "Có công việc đã hủy", REMINDER: "Bạn có lịch công việc hoặc sự kiện cần nhắc" };
  event.waitUntil(self.registration.showNotification("Ben", {
    body: labels[payload.kind] || "Bạn có công việc mới",
    icon: "/ben/icon-192.png", badge: "/ben/icon-192.png",
    tag: typeof payload.tag === "string" ? payload.tag.slice(0,250) : "ben-assignment",
    data: { route: workNotificationRoute(payload.route) },
  }));
});
self.addEventListener("notificationclick", event => {
  event.notification.close();
  event.waitUntil((async () => {
    const route = workNotificationRoute(event.notification.data?.route);
    const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    const sameOrigin = windows.filter(client => new URL(client.url).origin === self.location.origin);
    const target = sameOrigin.find(client => new URL(client.url).pathname === new URL(route,self.location.origin).pathname)
      || sameOrigin.find(client => new URL(client.url).pathname === "/admin/ben");
    if (target) { await target.navigate(route); await target.focus(); }
    else await self.clients.openWindow(route);
  })());
});
