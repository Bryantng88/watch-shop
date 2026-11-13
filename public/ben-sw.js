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
  if (typeof value !== "string" || value.length > 1024 || /[\\\u0000-\u0020\u007f]/.test(value)) return "/admin/ben";
  if (value === "/admin/ben") return value;
  if (/^\/admin\/personal-work(?:\?[^#]*)?$/.test(value)) {
    const url = new URL(value, self.location.origin);
    const params = url.searchParams;
    if ([...params.keys()].some(key => key !== "view" && key !== "item") || params.getAll("view").length > 1 || params.getAll("item").length > 1 || (params.has("view") && params.get("view") !== "list")) return "/admin/ben";
    const id = params.get("item");
    if (params.has("item") && (!id || !/^[\w-]{1,160}$/.test(id))) return "/admin/ben";
    return "/admin/personal-work?view=list" + (id ? "&item=" + encodeURIComponent(id) : "");
  }
  const match = value.match(/^\/admin\/ben\/work\/([^/?#]+)$/);
  if (match) {
    try {
      const id = decodeURIComponent(match[1]);
      if (/^[\w-]{1,160}$/.test(id)) return "/admin/ben/work/" + encodeURIComponent(id);
    } catch {}
  }
  return "/admin/ben";
}
function benWindowPath(client) {
  try {
    const url = new URL(client.url);
    if (url.origin === self.location.origin && (url.pathname === "/admin/ben" || url.pathname === "/admin/personal-work" || /^\/admin\/ben\/work\/[\w-]+$/.test(url.pathname))) return url.pathname;
  } catch {}
  return null;
}
self.addEventListener("push", event => {
  let payload = {};
  try { const data = event.data?.json(); if (data && typeof data === "object" && !Array.isArray(data)) payload = data; } catch {}
  const labels = { ASSIGNED: "Bạn được giao một công việc mới", SHARED: "Có công việc được chia sẻ với bạn", CHANGED: "Lịch công việc đã thay đổi", CANCELLED: "Có công việc đã hủy", REMINDER: "Bạn có lịch công việc hoặc sự kiện cần nhắc" };
  const label = Object.prototype.hasOwnProperty.call(labels, payload.kind) ? labels[payload.kind] : undefined;
  const isWork = payload.type === "assignment" || payload.type === "work" || Boolean(label);
  event.waitUntil(self.registration.showNotification("Ben", {
    body: label || "Bạn có công việc mới",
    icon: "/ben/icon-192.png", badge: "/ben/icon-192.png",
    tag: typeof payload.tag === "string" ? payload.tag.slice(0,250) : "ben-assignment",
    data: { route: workNotificationRoute(payload.route ?? (isWork ? "/admin/personal-work?view=list" : undefined)) },
  }));
});
self.addEventListener("notificationclick", event => {
  event.notification.close();
  event.waitUntil((async () => {
    // Old displayed notifications may have no route, or the pre-list item route.
    const route = workNotificationRoute(event.notification.data?.route ?? "/admin/personal-work?view=list");
    const destination = new URL(route, self.location.origin);
    let windows = [];
    try { windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true }); } catch {}
    const candidates = windows.filter(client => benWindowPath(client));
    const rank = client => benWindowPath(client) === destination.pathname ? 0 : benWindowPath(client) === "/admin/ben" ? 1 : 2;
    candidates.sort((a, b) => rank(a) - rank(b));
    for (const client of candidates) {
      try {
        const navigated = await client.navigate(destination.href);
        // Mobile clients can disappear or return null while the app resumes.
        if (!navigated) continue;
        await navigated.focus();
        return;
      } catch { /* Try another Ben window, then an explicit openWindow fallback. */ }
    }
    const opened = await self.clients.openWindow(destination.href);
    if (opened) { try { await opened.focus(); } catch {} }
  })());
});
