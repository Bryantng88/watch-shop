import { getAdminDashboardService } from "../server";
import { prisma } from "@/server/db/client";
import {
  queryAdminDashboardSummary,
  rebuildAdminDashboardSummary,
} from "@/domains/projection/server/admin-dashboard-summary.projection";

export async function getAdminDashboardApplication() {
  const projected = await queryAdminDashboardSummary(prisma);
  if (projected) return projected;

  await rebuildAdminDashboardSummary(prisma);
  return (await queryAdminDashboardSummary(prisma)) ?? getAdminDashboardService();
}
