import { prisma } from "@/server/db/client";
import { normalizeWatchSpecInput } from "../shared";
import type { UpsertWatchSpecInput } from "../shared";
import { upsertWatchSpecRepo } from "./watch-spec.repo";

export async function updateWatchSpec(input: UpsertWatchSpecInput) {
  const normalized = normalizeWatchSpecInput(input);

  if (normalized.boxIncluded !== undefined) {
    await prisma.watch.updateMany({
      where: { productId: normalized.productId },
      data: {
        hasBox: Boolean(normalized.boxIncluded),
        updatedAt: new Date(),
      },
    });
  }

  return upsertWatchSpecRepo(prisma as any, normalized);
}