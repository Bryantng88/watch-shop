import { randomUUID } from "node:crypto";
import {
  AudienceSegment,
  MediaBindingLifecycle,
  MediaOwnerType,
  MediaRole,
  MediaPostStatus,
  TaskExecutionTargetType,
  type Prisma,
} from "@prisma/client";
import {
  recordBusinessEvent,
  type BusinessEventDispatchOptions,
} from "@/domains/event/server/business-event.service";
import { runBusinessEventTransaction } from "@/domains/event/server/business-event-transaction";
import { bindMedia } from "@/domains/media/application/media-binding.service";
import { ingestSelectedMedia } from "@/domains/media/application/media-ingest.service";
import { prisma, type DB } from "@/server/db/client";
import { normalizeKey } from "@/server/lib/storage-key";
import { updateBusinessBindingMetadata } from "@/domains/task/server/business-binding.repo";
import { getQueueItemWorkflowState } from "@/domains/task/server/business-binding-workflow.service";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function hasPostContent(post: { title: string; caption: string | null; contentJson: unknown }) {
  const content = asRecord(post.contentJson);
  return Boolean(post.title.trim() && (String(content.hook ?? "").trim() || post.caption?.trim() || String(content.body ?? "").trim()));
}

export async function getMediaPostMediaWorkContext(mediaPostId: string, db: DB = prisma) {
  const [bindings, publishBindings] = await Promise.all([db.taskExecution.findMany({
    where: {
      targetType: TaskExecutionTargetType.MEDIA_POST,
      targetId: mediaPostId,
      taskItem: { note: { contains: "workTypeKey: media-processing", mode: "insensitive" } },
    },
    select: { id: true, metadataJson: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  }), db.taskExecution.findMany({
    where: {
      targetType: TaskExecutionTargetType.MEDIA_POST,
      targetId: mediaPostId,
      taskItem: { note: { contains: "workTypeKey: publish", mode: "insensitive" } },
    },
    select: { id: true, metadataJson: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  })]);
  const activeBinding = bindings.find((item) => getQueueItemWorkflowState(item)?.currentState !== "DONE") ?? null;
  const progressBinding = activeBinding ?? bindings[0] ?? null;
  const activePublishBinding = publishBindings.find((item) => getQueueItemWorkflowState(item)?.currentState !== "DONE") ?? null;
  const progress = asRecord(asRecord(progressBinding?.metadataJson).mediaWorkProgress);
  const parts = asRecord(progress.parts);
  return {
    bindingId: activeBinding?.id ?? null,
    publishBindingId: activePublishBinding?.id ?? null,
    content: parts.content === true,
    image: parts.image === true,
  };
}

export async function saveMediaPostWorkProgress(input: {
  mediaPostId: string;
  parts: { content?: boolean; image?: boolean };
  actorUserId?: string | null;
}, db: DB = prisma) {
  const context = await getMediaPostMediaWorkContext(input.mediaPostId, db);
  if (!context.bindingId) return { ok: true, skipped: true, reason: "MEDIA_PROCESSING_BINDING_NOT_FOUND" };
  const binding = await db.taskExecution.findUnique({ where: { id: context.bindingId }, select: { metadataJson: true } });
  if (!binding) return { ok: false, skipped: true, reason: "BINDING_NOT_FOUND" };
  const metadata = asRecord(binding.metadataJson);
  const current = asRecord(metadata.mediaWorkProgress);
  const currentParts = asRecord(current.parts);
  const parts = {
    content: typeof input.parts.content === "boolean" ? input.parts.content : currentParts.content === true,
    image: typeof input.parts.image === "boolean" ? input.parts.image : currentParts.image === true,
  };
  const updatedAt = new Date().toISOString();
  await updateBusinessBindingMetadata(db, context.bindingId, {
    ...metadata,
    mediaWorkProgress: {
      parts,
      completed: [parts.content, parts.image].filter(Boolean).length,
      total: 2,
      updatedAt,
      updatedByUserId: input.actorUserId ?? null,
    },
  });
  return { ok: true, skipped: false, bindingId: context.bindingId, parts, completed: [parts.content, parts.image].filter(Boolean).length, total: 2, updatedAt };
}

function newRefNo() {
  const day = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return `POST-${day}-${randomUUID().slice(0, 8).toUpperCase()}`;
}

const MEDIA_POST_TIME_ZONE = "Asia/Bangkok";

function mediaPostDay(now: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: MEDIA_POST_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";
  const year = value("year");
  const month = value("month");
  const day = value("day");
  const start = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), -7));
  return {
    key: `${year}${month}${day}`,
    label: `${day}/${month}/${year}`,
    start,
    end: new Date(start.getTime() + 24 * 60 * 60 * 1000),
  };
}

export function mediaPostAutoTitle(sequence: number, now = new Date()) {
  const day = mediaPostDay(now);
  return `post_${String(Math.max(1, sequence)).padStart(2, "0")} ngày ${day.label}`;
}

export async function createMediaPost(input: {
  brief?: string | null;
  caption?: string | null;
  contentJson?: Prisma.InputJsonValue | null;
  scheduledAt?: Date | null;
  priority?: number;
  createdByUserId?: string | null;
  assignedToUserId?: string | null;
  postTargetIds?: string[];
  watchIds?: string[];
}) {
  const createdAt = new Date();
  const postDay = mediaPostDay(createdAt);

  return runBusinessEventTransaction(async (tx, delivery) => {
    await tx.$queryRaw<Array<{ locked: number }>>`
      SELECT 1::int AS locked
      FROM (
        SELECT pg_advisory_xact_lock(hashtext(${`media-post-title:${postDay.key}`})::bigint)
      ) AS advisory_lock
    `;
    const postsCreatedToday = await tx.mediaPost.count({
      where: { createdAt: { gte: postDay.start, lt: postDay.end } },
    });
    const title = mediaPostAutoTitle(postsCreatedToday + 1, createdAt);
    const post = await tx.mediaPost.create({
      data: {
        refNo: newRefNo(),
        title,
        createdAt,
        brief: input.brief?.trim() || null,
        caption: input.caption?.trim() || null,
        contentJson: input.contentJson ?? undefined,
        scheduledAt: input.scheduledAt ?? null,
        priority: input.priority ?? 0,
        createdByUserId: input.createdByUserId ?? null,
        assignedToUserId: input.assignedToUserId ?? null,
        targets: input.postTargetIds?.length
          ? { create: [...new Set(input.postTargetIds)].map((postTargetId) => ({ postTargetId })) }
          : undefined,
        watches: input.watchIds?.length
          ? { create: [...new Set(input.watchIds)].map((watchId, sortOrder) => ({ watchId, sortOrder })) }
          : undefined,
      },
      include: { targets: true, watches: true },
    });
    await delivery.emit({
      eventKey: "media.post.created",
      targetType: "MEDIA_POST",
      targetId: post.id,
      actorUserId: input.createdByUserId ?? null,
      payload: { refNo: post.refNo, title: post.title, targetIds: post.targets.map((item) => item.postTargetId) },
    });
    return post;
  });
}

export async function selectMediaForPost(input: {
  mediaPostId: string;
  storageKey: string;
  role?: MediaRole;
  sortOrder?: number;
  actorUserId?: string | null;
}) {
  const storageKey = normalizeKey(input.storageKey);
  if (!storageKey) throw new Error("Media key là bắt buộc.");
  const post = await prisma.mediaPost.findUnique({ where: { id: input.mediaPostId }, select: { id: true } });
  if (!post) throw new Error(`Không tìm thấy Media Post ${input.mediaPostId}.`);

  const object = await ingestSelectedMedia({
    storageKey,
    destination: { ownerType: "MEDIA_POST", ownerId: post.id },
  });
  const binding = await bindMedia({
    mediaObjectId: object.id,
    ownerType: MediaOwnerType.MEDIA_POST,
    ownerId: post.id,
    role: input.role ?? MediaRole.SOCIAL,
    sortOrder: input.sortOrder ?? 0,
    audienceSegment: AudienceSegment.UNISEX,
    pipelineKey: null,
    lifecycle: MediaBindingLifecycle.SELECTED,
  });
  await recordBusinessEvent(prisma, {
    eventKey: "media.post.asset.selected",
    targetType: "MEDIA_POST",
    targetId: post.id,
    actorUserId: input.actorUserId ?? null,
    payload: { storageKey: object.storageKey, role: binding.role },
  });
  return { object, binding };
}

export async function completeMediaPostPhotographyFromQueueItem(
  input: {
    bindingId: string;
    actorUserId?: string | null;
    note?: string | null;
    deferConsumers?: BusinessEventDispatchOptions["deferConsumers"];
  },
  db: DB = prisma,
) {
  const bindingId = String(input.bindingId ?? "").trim();
  if (!bindingId) return { ok: false, skipped: true, reason: "MISSING_BINDING_ID" };

  const binding = await db.taskExecution.findUnique({
    where: { id: bindingId },
    select: {
      targetType: true,
      targetId: true,
      taskItem: { select: { note: true } },
    },
  });
  if (!binding) return { ok: false, skipped: true, reason: "BINDING_NOT_FOUND" };
  if (binding.targetType !== "MEDIA_POST") {
    return { ok: true, skipped: true, reason: "NOT_MEDIA_POST_BINDING" };
  }
  if (!/workTypeKey:\s*photography/i.test(String(binding.taskItem?.note ?? ""))) {
    return { ok: true, skipped: true, reason: "NOT_PHOTOGRAPHY_WORKSPACE" };
  }

  const post = await db.mediaPost.findUnique({
    where: { id: binding.targetId },
    select: { id: true, refNo: true, title: true },
  });
  if (!post) return { ok: false, skipped: true, reason: "MEDIA_POST_NOT_FOUND" };

  const event = await recordBusinessEvent(db, {
    eventKey: "media.post.photography.completed",
    targetType: "MEDIA_POST",
    targetId: post.id,
    actorUserId: input.actorUserId ?? null,
    payload: {
      refNo: post.refNo,
      title: post.title,
      sourceId: `photography-completed:${bindingId}`,
      note: input.note ?? null,
    },
  }, { deferConsumers: input.deferConsumers });

  return { ok: true, skipped: false, event, mediaPostId: post.id };
}

export async function completeMediaPostMediaProcessingFromQueueItem(
  input: {
    bindingId: string;
    actorUserId?: string | null;
    note?: string | null;
    deferConsumers?: BusinessEventDispatchOptions["deferConsumers"];
  },
  db: DB = prisma,
) {
  const binding = await db.taskExecution.findUnique({
    where: { id: input.bindingId },
    select: { targetType: true, targetId: true, metadataJson: true, taskItem: { select: { note: true } } },
  });
  if (!binding) return { ok: false, skipped: true, reason: "BINDING_NOT_FOUND" };
  if (binding.targetType !== TaskExecutionTargetType.MEDIA_POST) {
    return { ok: true, skipped: true, reason: "NOT_MEDIA_POST_BINDING" };
  }
  if (!/workTypeKey:\s*media-processing/i.test(String(binding.taskItem?.note ?? ""))) {
    return { ok: true, skipped: true, reason: "NOT_MEDIA_PROCESSING_WORKSPACE" };
  }
  const post = await db.mediaPost.findUnique({
    where: { id: binding.targetId },
    select: { id: true, refNo: true, title: true, caption: true, contentJson: true },
  });
  if (!post) return { ok: false, skipped: true, reason: "MEDIA_POST_NOT_FOUND" };
  const assetCount = await db.mediaBinding.count({
    where: { ownerType: MediaOwnerType.MEDIA_POST, ownerId: post.id, lifecycle: { not: MediaBindingLifecycle.REMOVED } },
  });
  const missing = [
    !hasPostContent(post) ? "Content" : null,
    assetCount === 0 ? "Hình ảnh" : null,
  ].filter((value): value is string => Boolean(value));
  if (missing.length) throw new Error(`Chưa thể chuyển sang Đăng bài. Còn thiếu: ${missing.join(", ")}.`);

  const event = await recordBusinessEvent(db, {
    eventKey: "media.post.ready_for_publish",
    targetType: "MEDIA_POST",
    targetId: post.id,
    actorUserId: input.actorUserId ?? null,
    payload: { refNo: post.refNo, title: post.title, sourceId: `media-ready:${input.bindingId}`, note: input.note ?? null },
  }, { deferConsumers: input.deferConsumers });
  await db.mediaPost.update({ where: { id: post.id }, data: { status: MediaPostStatus.READY } });
  return { ok: true, skipped: false, event, mediaPostId: post.id };
}

export async function completeMediaPostPublishFromQueueItem(
  input: {
    bindingId: string;
    actorUserId?: string | null;
    note?: string | null;
    deferConsumers?: BusinessEventDispatchOptions["deferConsumers"];
  },
  db: DB = prisma,
) {
  const binding = await db.taskExecution.findUnique({
    where: { id: input.bindingId },
    select: { targetType: true, targetId: true, taskItem: { select: { note: true } } },
  });
  if (!binding) return { ok: false, skipped: true, reason: "BINDING_NOT_FOUND" };
  if (binding.targetType !== TaskExecutionTargetType.MEDIA_POST) {
    return { ok: true, skipped: true, reason: "NOT_MEDIA_POST_BINDING" };
  }
  if (!/workTypeKey:\s*publish/i.test(String(binding.taskItem?.note ?? ""))) {
    return { ok: true, skipped: true, reason: "NOT_PUBLISH_WORKSPACE" };
  }
  const post = await db.mediaPost.findUnique({ where: { id: binding.targetId }, select: { id: true, refNo: true, title: true } });
  if (!post) return { ok: false, skipped: true, reason: "MEDIA_POST_NOT_FOUND" };
  const event = await recordBusinessEvent(db, {
    eventKey: "media.post.published",
    targetType: "MEDIA_POST",
    targetId: post.id,
    actorUserId: input.actorUserId ?? null,
    payload: { refNo: post.refNo, title: post.title, sourceId: `media-published:${input.bindingId}`, note: input.note ?? null },
  }, { deferConsumers: input.deferConsumers });
  await db.mediaPost.update({ where: { id: post.id }, data: { status: MediaPostStatus.PUBLISHED } });
  return { ok: true, skipped: false, event, mediaPostId: post.id };
}

export async function listMediaPostAssets(mediaPostId: string) {
  return prisma.mediaBinding.findMany({
    where: {
      ownerType: MediaOwnerType.MEDIA_POST,
      ownerId: mediaPostId,
      lifecycle: { not: MediaBindingLifecycle.REMOVED },
    },
    include: { mediaObject: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
}

export async function updateMediaPostContent(input: {
  mediaPostId: string;
  title: string;
  hook?: string | null;
  brief?: string | null;
  caption?: string | null;
  body?: string | null;
  hashtags?: string | null;
  postTargetIds?: string[];
  actorUserId?: string | null;
}) {
  const title = input.title.trim();
  if (!title) throw new Error("Tiêu đề bài post là bắt buộc.");
  return runBusinessEventTransaction(async (tx, delivery) => {
    const post = await tx.mediaPost.update({
      where: { id: input.mediaPostId },
      data: {
        title,
        brief: input.brief?.trim() || null,
        caption: input.caption?.trim() || null,
        contentJson: {
          hook: input.hook?.trim() || null,
          body: input.body?.trim() || null,
          hashtags: input.hashtags?.trim() || null,
        },
        targets: input.postTargetIds
          ? {
              deleteMany: {},
              create: [...new Set(input.postTargetIds)].map((postTargetId) => ({ postTargetId })),
            }
          : undefined,
      },
    });
    await delivery.emit({
      eventKey: "media.post.content.updated",
      targetType: "MEDIA_POST",
      targetId: post.id,
      actorUserId: input.actorUserId ?? null,
      payload: {
        refNo: post.refNo,
        title: post.title,
        targetIds: input.postTargetIds ? [...new Set(input.postTargetIds)] : undefined,
      },
    });
    return post;
  });
}

export async function removeMediaFromPost(input: {
  mediaPostId: string;
  storageKey: string;
}) {
  const storageKey = normalizeKey(input.storageKey);
  const binding = await prisma.mediaBinding.findFirst({
    where: {
      ownerType: MediaOwnerType.MEDIA_POST,
      ownerId: input.mediaPostId,
      lifecycle: { not: MediaBindingLifecycle.REMOVED },
      mediaObject: { storageKey },
    },
    select: { id: true },
  });
  if (!binding) return null;
  return prisma.mediaBinding.update({
    where: { id: binding.id },
    data: { lifecycle: MediaBindingLifecycle.REMOVED },
  });
}

export async function reorderMediaPostAssets(input: {
  mediaPostId: string;
  storageKeys: string[];
}) {
  const keys = [...new Set(input.storageKeys.map(normalizeKey).filter(Boolean))];
  return prisma.$transaction(
    keys.map((storageKey, sortOrder) => prisma.mediaBinding.updateMany({
      where: {
        ownerType: MediaOwnerType.MEDIA_POST,
        ownerId: input.mediaPostId,
        lifecycle: { not: MediaBindingLifecycle.REMOVED },
        mediaObject: { storageKey },
      },
      data: { sortOrder },
    })),
  );
}
