"use server";

import { PERMISSIONS } from "@/constants/permissions";
import { requirePermission } from "@/server/auth/requirePermission";
import { prisma } from "@/server/db/client";
import { getProjectionDeliveryStatus } from "../server";

export async function getProjectionDeliveryStatusAction(input: {
  projectionDeliveryKey: string;
}) {
  const user = await requirePermission(PERMISSIONS.TASK_VIEW);
  if (!user?.id) throw new Error("AUTHENTICATED_ACTOR_REQUIRED");
  const key = String(input.projectionDeliveryKey ?? "").trim();
  if (!key) return null;
  return getProjectionDeliveryStatus(prisma, key);
}
