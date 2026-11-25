import { Prisma, TaskExecutionActionType, TaskExecutionTargetType } from "@prisma/client";
import { prisma, withDbTransaction, type DB } from "@/server/db/client";
import { createSystemActivity } from "@/domains/task/server/activity";
import { recordBusinessEvent, type BusinessEventDispatchOptions } from "@/domains/event/server/business-event.service";

const mediaWorkType = /workTypeKey:\s*(photography|photoshoot|media-processing|publish)\b/i;

/** Retire bindings, never the shared workspace, Watch, media files or content. */
export async function withdrawWatchFromMedia(
  input: { productId: string; bindingId: string; actorUserId: string; deferConsumers?: BusinessEventDispatchOptions["deferConsumers"] },
  db: DB = prisma,
) {
  const productId = input.productId.trim();
  const bindingId = input.bindingId.trim();
  if (!productId || !bindingId || !input.actorUserId.trim()) throw new Error("Thiếu thông tin bỏ watch khỏi media.");

  return withDbTransaction(db, async (tx) => {
    const watch = await tx.watch.findUnique({ where: { productId }, select: { id: true, productId: true } });
    if (!watch) throw new Error("Không tìm thấy watch.");

    // Serialize against progress saves, which lock their TaskExecution row too.
    await tx.$queryRaw(Prisma.sql`SELECT "id" FROM "TaskExecution" WHERE "targetType"::text = 'WATCH' AND "targetId" = ${watch.id} ORDER BY "id" FOR UPDATE`);
    const bindings = await tx.taskExecution.findMany({
      where: { targetType: TaskExecutionTargetType.WATCH, targetId: watch.id, taskItemId: { not: null } },
      select: { id: true, actionType: true, metadataJson: true, taskItemId: true, taskItem: { select: { note: true } } },
    });
    const media = bindings.filter((binding) => mediaWorkType.test(binding.taskItem?.note ?? ""));
    const requested = media.find((binding) => binding.id === bindingId);
    if (!requested) throw new Error("Liên kết media không thuộc watch này.");
    if (requested.actionType === TaskExecutionActionType.CANCELLED) {
      // An old modal must not withdraw a newer intake.
      return { ok: true, skipped: true, productId, bindingId, event: null };
    }
    const active = media.filter((binding) => binding.actionType !== TaskExecutionActionType.CANCELLED);
    const withdrawnAt = new Date().toISOString();
    for (const binding of active) {
      const metadata = binding.metadataJson && typeof binding.metadataJson === "object" && !Array.isArray(binding.metadataJson) ? binding.metadataJson : {};
      await tx.taskExecution.update({ where: { id: binding.id }, data: {
        actionType: TaskExecutionActionType.CANCELLED,
        metadataJson: { ...metadata, mediaWithdrawal: { withdrawnAt, actorUserId: input.actorUserId, sourceBindingId: bindingId } },
      } });
    }
    await createSystemActivity({
      taskItemId: requested.taskItemId!, sourceId: `media-withdrawal:${bindingId}`,
      title: "Đã bỏ watch khỏi quy trình media", actorUserId: input.actorUserId,
      metadataJson: { targetType: "WATCH", targetId: watch.id, productId, bindingId, retiredBindingIds: active.map((binding) => binding.id) },
    }, tx);
    const event = await recordBusinessEvent(tx, {
      eventKey: "watch.media.withdrawn", targetType: "WATCH", targetId: watch.id,
      targetAliasIds: [watch.id, productId], actorUserId: input.actorUserId,
      payload: { watchId: watch.id, productId, sourceId: bindingId, eventInstanceId: bindingId, withdrawnAt },
    }, { deferConsumers: input.deferConsumers });
    return { ok: true, skipped: false, productId, bindingId, event: { projectionDeliveryKey: event.projectionDeliveryKey } };
  });
}
