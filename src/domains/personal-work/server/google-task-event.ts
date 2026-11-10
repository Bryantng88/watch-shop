import { createHash } from "node:crypto";

export function googleTaskEventId(userId: string, taskItemId: string, calendarId = "primary") {
  // Google accepts base32hex IDs; lowercase SHA-256 hex is a valid subset.
  // Keep identity when a user reconnects the same Google calendar.
  return createHash("sha256").update(JSON.stringify(["watch-shop-task", userId, calendarId, taskItemId])).digest("hex");
}

export async function writeGoogleTaskEvent({ existingId, stableId, taskItemId, payload, request }: {
  existingId?: string;
  stableId: string;
  taskItemId: string;
  payload: Record<string, unknown>;
  request: (suffix: string, init: RequestInit) => Promise<Response>;
}) {
  const update = (id: string) => request(`/${encodeURIComponent(id)}`, {
    method: "PUT", body: JSON.stringify(payload),
  });
  if (existingId) return update(existingId);
  const created = await request("", {
    method: "POST", body: JSON.stringify({ ...payload, id: stableId }),
  });
  if (created.status !== 409) return created;
  // A previous request may have succeeded before its response/link was saved.
  // Verify the deterministic event belongs to this task before reconciling it.
  const found = await request(`/${encodeURIComponent(stableId)}`, { method: "GET" });
  if (!found.ok) return found;
  const event = await found.json() as { extendedProperties?: { private?: Record<string, string> } };
  const metadata = event.extendedProperties?.private;
  if (metadata?.watchShopTaskItemId !== taskItemId || metadata?.source !== "WATCH_SHOP_PERSONAL_WORK")
    throw new Error("Calendar event identity does not match the task");
  return update(stableId);
}
