export function workRoute(id: string, personal: boolean) {
  return personal ? `/admin/personal-work?item=${encodeURIComponent(id)}` : `/admin/ben/work/${encodeURIComponent(id)}`;
}
export function reminderKey(id: string, userId: string, dueAt: Date, minutes = 0) {
  return `work:reminder:${id}:${userId}:${dueAt.toISOString()}:${minutes}`;
}
export function newShareRecipients(previous: string[], next: string[], actorId: string) {
  return [...new Set(next)].filter(id => id !== actorId && !previous.includes(id));
}
export function safeWorkPushRoute(value: unknown) {
  return typeof value === "string" && /^\/admin\/(?:personal-work\?item=[\w%-]+|ben\/work\/[\w%-]+)$/.test(value) ? value : "/admin/ben";
}
