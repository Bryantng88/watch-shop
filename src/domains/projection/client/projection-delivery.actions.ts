"use server";

import { getCurrentUser } from "@/server/auth/getCurrentUser";
import { prisma } from "@/server/db/client";
import { getProjectionDeliveryStatus } from "../server";

export async function getProjectionDeliveryStatusAction(input: {
  projectionDeliveryKey: string;
}) {
  const user = await getCurrentUser();
  if (!user?.id) throw new Error("AUTHENTICATED_ACTOR_REQUIRED");
  const key = String(input.projectionDeliveryKey ?? "").trim();
  if (!key) return null;
  return getProjectionDeliveryStatus(prisma, key);
}
