"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { PERMISSIONS } from "@/constants/permissions";
import { routeWatchesToMedia } from "@/domains/media/pipeline";
import { listSelectedWatchMedia } from "@/domains/media/application";
import { ensureOperationSpace } from "@/domains/coordination/server";
import {
  markWatchMediaAssetAttachedFromQueueItem,
  markWatchMediaAssetAttachedFromWatch,
  saveWatchMediaWorkDraftFromQueueItem,
  saveWatchMediaWorkDraftFromWatch,
} from "@/domains/watch/server";
import { requirePermission } from "@/server/auth/requirePermission";
import { prisma } from "@/server/db/client";
import { getProjectionDeliveryStatus } from "@/domains/projection/server";

export async function loadWatchMediaPoolAction(input: { productId: string }) {
  await requirePermission(PERMISSIONS.PRODUCT_UPDATE);
  return listSelectedWatchMedia({ productId: input.productId });
}

export async function requestWatchPhotoshootAction(input: {
  watchIds: string[];
  note?: string | null;
}) {
  const user = await requirePermission(PERMISSIONS.PRODUCT_UPDATE);

  await ensureOperationSpace(prisma, {
    context: "MEDIA",
  });

  const result = await routeWatchesToMedia(
    {
      watchIds: input.watchIds,
      actorUserId: user.id,
      reason: input.note ?? null,
      deferConsumers: (work) => after(work),
    },
    prisma,
  );

  revalidatePath("/admin/watches");
  revalidatePath("/admin/coordination/media");

  for (const item of result.items) {
    if (!item.productId) continue;
    revalidatePath(`/admin/watches/${item.productId}`);
    revalidatePath(`/admin/watches/${item.productId}/edit`);
  }

  return result;
}
export async function markWatchMediaAssetAttachedAction(input: {
  bindingId: string;
  taskItemId?: string | null;
  note?: string | null;
}) {
  const user = await requirePermission(PERMISSIONS.PRODUCT_UPDATE);

  const result = await prisma.$transaction((tx) =>
    markWatchMediaAssetAttachedFromQueueItem(
      {
        bindingId: input.bindingId,
        actorUserId: user.id,
        note: input.note ?? null,
        deferConsumers: (work) => after(work),
      },
      tx,
    ),
  );

  revalidatePath("/admin/watches");
  revalidatePath("/admin/coordination/media");
  if (input.taskItemId) revalidatePath(`/admin/task-items/${input.taskItemId}`);
  if ("productId" in result && result.productId) {
    revalidatePath(`/admin/watches/${result.productId}`);
    revalidatePath(`/admin/watches/${result.productId}/edit`);
  }

  return result;
}

export async function markWatchMediaAssetAttachedFromWatchAction(input: {
  productId: string;
  note?: string | null;
  origin?: "WATCH_LIST" | "WATCH_DETAIL";
}) {
  const startedAt = Date.now();
  const user = await requirePermission(PERMISSIONS.PRODUCT_UPDATE);
  const authorizedAt = Date.now();

  const result = await prisma.$transaction((tx) =>
    markWatchMediaAssetAttachedFromWatch(
      {
        productId: input.productId,
        actorUserId: user.id,
        note: input.note ?? null,
        origin: input.origin ?? "WATCH_DETAIL",
        deferConsumers: (work) => after(work),
      },
      tx,
    ),
  );
  console.info(
    `[perf:watch-media-intake-action] auth=${authorizedAt - startedAt}ms domain=${Date.now() - authorizedAt}ms total=${Date.now() - startedAt}ms productId=${input.productId}`,
  );

  revalidatePath("/admin/watches");
  revalidatePath("/admin/coordination/media");
  revalidatePath(`/admin/watches/${input.productId}`);
  revalidatePath(`/admin/watches/${input.productId}/edit`);

  return result;
}

export async function getWatchMediaIntakeStatusAction(input: {
  projectionDeliveryKey: string;
}) {
  await requirePermission(PERMISSIONS.PRODUCT_UPDATE);
  const projectionDeliveryKey = String(input.projectionDeliveryKey ?? "").trim();
  if (!projectionDeliveryKey) return null;

  const delivery = await getProjectionDeliveryStatus(
    prisma,
    projectionDeliveryKey,
  );
  if (!delivery) return null;

  return {
    status: delivery.status,
    attempts: delivery.attempts,
    completedAt: delivery.completedAt?.toISOString() ?? null,
    lastError: delivery.lastError,
    updatedAt: delivery.updatedAt.toISOString(),
  };
}

export async function saveWatchMediaWorkDraftFromWatchAction(input: {
  productId: string;
  bindingId?: string | null;
  parts: {
    profile?: boolean | null;
    content?: boolean | null;
    image?: boolean | null;
    cover?: boolean | null;
  };
  note?: string | null;
}) {
  const user = await requirePermission(PERMISSIONS.PRODUCT_UPDATE);

  const bindingId = String(input.bindingId ?? "").trim();
  const result = bindingId
    ? await saveWatchMediaWorkDraftFromQueueItem(
        {
          bindingId,
          actorUserId: user.id,
          parts: input.parts,
          note: input.note ?? null,
        },
        prisma,
      )
    : await saveWatchMediaWorkDraftFromWatch(
        {
          productId: input.productId,
          actorUserId: user.id,
          parts: input.parts,
          note: input.note ?? null,
        },
        prisma,
      );

  revalidatePath("/admin/watches");
  revalidatePath("/admin/coordination/media");
  revalidatePath(`/admin/watches/${input.productId}`);
  revalidatePath(`/admin/watches/${input.productId}/edit`);

  return result;
}
