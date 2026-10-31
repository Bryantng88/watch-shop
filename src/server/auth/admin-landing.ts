export function getAdminLandingPath(user: { roles: string[]; permissions: string[] }) {
  if (user.roles.includes("ADMIN") || user.permissions.includes("DASHBOARD_VIEW")) return "/admin/dashboard";
  if (user.permissions.includes("MEDIA_PRODUCTION_VIEW")) return "/admin/coordination/media";
  if (user.permissions.includes("PRODUCT_VIEW")) return "/admin/watches";
  if (user.permissions.includes("TASK_VIEW")) return "/admin/coordination/operation";
  return "/admin/profile";
}
