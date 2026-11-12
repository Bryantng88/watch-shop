import { Prisma } from "@prisma/client";
import type { Tx } from "@/server/db/client";
import { updatePersonalWorkItem } from "@/domains/personal-work/server/personal-work.service";
import {
  personalWorkUpdateInput,
  type PersonalWorkUpdateDraft,
  type UpdatedPersonalWork,
} from "../personal-work-update";
import type { Evidence } from "../live-contract";
import { preparePersonalWorkUpdates } from "./personal-work-update";
import type { assistantActor } from "./access";

export function personalUpdateIds(draft: PersonalWorkUpdateDraft) {
  return [draft.plan, ...(draft.additional || []).map((item) => item.plan)].map(
    (plan) => plan.itemId,
  );
}
/** Caller owns authorization, conversation lock and the serializable transaction. */
export async function applyPersonalUpdates(
  tx: Tx,
  actor: Awaited<ReturnType<typeof assistantActor>>,
  pending: PersonalWorkUpdateDraft,
  revision: number,
  entries: Evidence[],
): Promise<UpdatedPersonalWork[]> {
  const ids = personalUpdateIds(pending).sort();
  await tx.$queryRaw`SELECT "id" FROM "TaskItem" WHERE "id" IN (${Prisma.join(ids)}) ORDER BY "id" FOR UPDATE`;
  const draft = await preparePersonalWorkUpdates(
    tx,
    actor.id,
    [pending.plan, ...(pending.additional || []).map((item) => item.plan)],
    revision,
    entries,
  );
  const updated: UpdatedPersonalWork[] = [];
  for (const item of [draft, ...draft.additional]) {
    const input = personalWorkUpdateInput(item.plan);
    if (input.dueAt !== undefined && input.scheduledEndAt === undefined) {
      const current = await tx.taskItem.findUniqueOrThrow({
        where: { id: item.plan.itemId },
        select: { scheduledEndAt: true },
      });
      input.scheduledEndAt = current.scheduledEndAt?.toISOString() ?? null;
    }
    await updatePersonalWorkItem(
      { id: item.plan.itemId, ...input, updateBody: "Cập nhật qua Ben" },
      actor,
      tx,
    );
    updated.push({
      revision,
      code: item.code,
      id: item.plan.itemId,
      title: input.title || item.title,
      kind: item.kind,
    });
  }
  return updated;
}
