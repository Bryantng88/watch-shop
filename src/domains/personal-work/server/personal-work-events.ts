import type { DB } from "@/server/db/client";
import {
  recordBusinessEvent,
  type BusinessEventDispatchOptions,
} from "@/domains/event/server/business-event.service";
import type { PersonalWorkTarget } from "../shared/personal-work.types";
export async function recordPersonalWorkCreated(
  db: DB,
  input: {
    item: {
      id: string;
      title: string;
      taskId: string | null;
      priority: string;
      dueAt: Date | null;
      scheduledEndAt: Date | null;
      estimatedDays: number;
      workTypeId: string | null;
    };
    ownerUserId: string;
    actorUserId: string;
    assignedToUserId?: string;
    domain: string;
    tags: string[];
    targets: PersonalWorkTarget[];
  },
  options?: BusinessEventDispatchOptions,
) {
  const profiles = await db.user.findMany({
    where: {
      id: {
        in: [
          input.ownerUserId,
          input.actorUserId,
          input.assignedToUserId ?? input.ownerUserId,
        ],
      },
    },
    select: { id: true, name: true, email: true, avatarUrl: true },
  });
  const creator = profiles.find((user) => user.id === input.actorUserId),
    owner = profiles.find(
      (user) => user.id === (input.assignedToUserId ?? input.ownerUserId),
    ),
    { item } = input;
  return recordBusinessEvent(
    db,
    {
      eventKey: "task.item.created",
      targetType: "TASK_ITEM",
      targetId: item.id,
      actorUserId: input.actorUserId,
      payload: {
        source: "PERSONAL_WORK",
        visibility: "PERSONAL",
        taskId: item.taskId,
        taskTitle: null,
        taskKind: "PERSONAL",
        taskKindLabel: "Cá nhân",
        taskItemId: item.id,
        taskItemTitle: item.title,
        personalOwnerUserId: input.ownerUserId,
        creatorUserId: input.actorUserId,
        creatorName: creator?.name || creator?.email || input.actorUserId,
        creatorAvatarUrl: creator?.avatarUrl ?? null,
        assignedToUserId: input.assignedToUserId ?? input.ownerUserId,
        assignedToName: owner?.name || owner?.email || input.ownerUserId,
        assignedToAvatarUrl: owner?.avatarUrl ?? null,
        priority: item.priority,
        dueAt: item.dueAt?.toISOString() ?? null,
        scheduledEndAt: item.scheduledEndAt?.toISOString() ?? null,
        estimatedDays: item.estimatedDays,
        workType: item.workTypeId,
        tagNames: [input.domain, ...input.tags],
        targets: input.targets.map(({ imageUrl: _image, ...target }) => {
          void _image;
          return target;
        }),
      },
    },
    options,
  );
}
export async function recordPersonalChecklistCreated(
  db: DB,
  input: {
    taskItemId: string;
    id: string;
    title: string;
    actorUserId: string;
    context?: Record<string, string | null>;
  },
  options?: BusinessEventDispatchOptions,
) {
  return recordBusinessEvent(
    db,
    {
      eventKey: "task.item.checklist.created",
      targetType: "TASK_ITEM",
      targetId: input.taskItemId,
      actorUserId: input.actorUserId,
      payload: {
        source: input.context?.source ?? "PERSONAL_WORK",
        visibility: "PERSONAL",
        taskItemId: input.taskItemId,
        checklistItemId: input.id,
        title: input.title,
        isDone: false,
        createdByUserId: input.actorUserId,
        eventInstanceId: input.id,
        ...input.context,
      },
    },
    options,
  );
}
