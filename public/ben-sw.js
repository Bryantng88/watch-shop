// Ben stays online-only: never persist conversations, authenticated HTML or APIs.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
self.addEventListener("fetch", (event) => {
  if (event.request.mode !== "navigate" || new URL(event.request.url).pathname !== "/admin/ben") return;
  event.respondWith(fetch(event.request).catch(() => new Response(
    '<!doctype html><html lang="vi"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Ben · Offline</title><body style="font-family:system-ui;padding:32px"><h1>Ben đang chờ kết nối</h1><p>Kết nối mạng rồi mở lại để tiếp tục trò chuyện.</p><a href="/admin/ben">Thử lại</a></body></html>',
    { status: 503, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } }
  )));
});
