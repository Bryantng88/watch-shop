/** Read the supported server-auth shapes without depending on a task service. */
export function getAuthUserId(auth: unknown): string | null {
  if (!auth || typeof auth !== "object" || Array.isArray(auth)) return null;
  const root = auth as Record<string, unknown>;
  const user = root.user && typeof root.user === "object" && !Array.isArray(root.user)
    ? root.user as Record<string, unknown> : {};
  const id = user.id ?? root.id ?? root.userId;
  return typeof id === "string" && id.trim() ? id : null;
}
