import { prisma } from "@/server/db/client";
import {
  queryAdminDashboardSummary,
} from "@/domains/projection/server/admin-dashboard-summary.projection";
import { ensureProjectionReady } from "@/domains/projection/server/projection-read.service";

export async function getAdminDashboardApplication() {
  await ensureProjectionReady(prisma, "admin-dashboard-summary");
  const projected = await queryAdminDashboardSummary(prisma);
  if (!projected) throw new Error("ADMIN_DASHBOARD_PROJECTION_NOT_READY");
  return projected;
}
