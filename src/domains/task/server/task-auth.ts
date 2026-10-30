function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

/** One visibility policy for both task detail and task lists. */
export function authCanViewAllTasks(auth: unknown): boolean {
  const root = record(auth), user = record(root.user);
  const role = record(root.role), userRole = record(user.role);
  const roleName = [user.role, root.role, userRole.name, role.name, root.roleName]
    .find(value => typeof value === "string" && value.trim());
  const roles = root.roles ?? user.roles ?? [];
  const permissions = root.permissions ?? user.permissions ?? role.permissions ?? [];
  return String(roleName ?? "").toUpperCase() === "ADMIN" ||
    (Array.isArray(roles) && roles.some(value => String(value).toUpperCase() === "ADMIN")) ||
    (Array.isArray(permissions) && (permissions.includes("TASK_VIEW_ALL") || permissions.includes("ADMIN")));
}
