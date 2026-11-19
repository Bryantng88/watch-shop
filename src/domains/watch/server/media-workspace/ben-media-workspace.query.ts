import { prisma } from "@/server/db/client";
import { requirePermission } from "@/server/auth/requirePermission";
import { ensureProjectionReady } from "@/domains/projection/server/projection-read.service";
import { queryMediaOperationBoardProjection } from "@/domains/projection/server/media-operation-board.projection";
import type { MediaListData, mediaListSearch } from "../../shared/ben-media-workspace";

export async function getBenMediaWorkspace(input: ReturnType<typeof mediaListSearch>): Promise<MediaListData> {
  const actor = await requirePermission("TASK_VIEW");
  const projection = await ensureProjectionReady(prisma, "media-operation-board");
  if (!projection.ready) throw new Error("MEDIA_WORKSPACE_UNAVAILABLE");
  const pageSize = 25;
  const read = (page: number) => queryMediaOperationBoardProjection(prisma, {
    requestedStage: input.stage, page, pageSize, query: input.q,
    // The explicit Done filter includes the full archive, not a hidden 14-day window.
    doneRetentionDays: null,
  });
  let result = await read(input.page);
  const total = result.totals.get(input.stage) ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(input.page, totalPages);
  if (page !== input.page) result = await read(page);
  const permissions = actor.permissions ?? [];
  return { ...input, page, pageSize, total, totalPages,
    open: ["PHOTOGRAPHY", "MEDIA_PROCESSING", "PUBLISH"].reduce((sum, stage) => sum + (result.totals.get(stage as typeof input.stage) ?? 0), 0),
    canEdit: Boolean(actor.roles?.includes("ADMIN") || permissions.includes("PRODUCT_UPDATE")),
    items: result.rows.map(row => ({id: row.id, bindingId: row.bindingId, productId: row.productId,
      targetType: row.targetType, title: row.title, sku: row.sku, imageUrl: row.imageUrl,
      stage: row.stage, note: row.reshootNote, updatedAt: row.updatedAt,
      progress: row.mediaWorkProgress ? {profile: row.mediaWorkProgress.profile, content: row.mediaWorkProgress.content, image: row.mediaWorkProgress.image, cover: row.mediaWorkProgress.cover} : null,
    })),
  };
}
