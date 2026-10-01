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
import { mediaStorage } from "@/domains/media/storage";
import { mediaPathPolicy } from "@/domains/media/core/media-path.policy";
import { registerExistingMediaObject } from "@/domains/media/application/media-ingest.service";
import type {
  MediaPostThemeFilters,
  MediaPostThemeSelection,
  MediaPostThemeWatchCandidate,
} from "../shared/media-post-theme.types";
import { MEDIA_POST_UNCLASSIFIED_FILTER } from "../shared/media-post-theme.types";
import {
  MEDIA_POST_AUDIENCE_OPTIONS,
  MEDIA_POST_CASE_SHAPE_OPTIONS,
  MEDIA_POST_MOVEMENT_OPTIONS,
  MEDIA_POST_SITE_CHANNEL_OPTIONS,
  MEDIA_POST_STOCK_OPTIONS,
  MEDIA_POST_STYLE_OPTIONS,
} from "../shared/media-post-theme.options";
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

export type CreateMediaPostInput = {
  brief?: string | null;
  caption?: string | null;
  contentJson?: Prisma.InputJsonValue | null;
  scheduledAt?: Date | null;
  priority?: number;
  createdByUserId?: string | null;
  assignedToUserId?: string | null;
  postTargetIds?: string[];
  watchIds?: string[];
};

async function createMediaPostRecord(tx: Prisma.TransactionClient, input: CreateMediaPostInput) {
  const createdAt = new Date();
  const postDay = mediaPostDay(createdAt);
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
  return tx.mediaPost.create({
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
}

export async function createMediaPost(input: CreateMediaPostInput) {
  return runBusinessEventTransaction(async (tx, delivery) => {
    const post = await createMediaPostRecord(tx, input);
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

function optionValues(options: ReadonlyArray<readonly [string, string]>) {
  return new Set(options.map(([value]) => value));
}

const themeFilterValues = {
  movementType: optionValues(MEDIA_POST_MOVEMENT_OPTIONS),
  caseShape: optionValues(MEDIA_POST_CASE_SHAPE_OPTIONS),
  style: optionValues(MEDIA_POST_STYLE_OPTIONS),
  stockStage: optionValues(MEDIA_POST_STOCK_OPTIONS),
  audienceSegment: optionValues(MEDIA_POST_AUDIENCE_OPTIONS),
  siteChannel: optionValues(MEDIA_POST_SITE_CHANNEL_OPTIONS),
};

export function normalizeMediaPostThemeSelections(selections: MediaPostThemeSelection[]) {
  const normalized = selections.map((selection) => ({
    watchId: String(selection.watchId).trim(),
    sourceGalleryKey: normalizeKey(selection.sourceGalleryKey),
  }));
  if (normalized.some((selection) => !selection.watchId || !selection.sourceGalleryKey)) {
    throw new Error("Watch và ảnh Gallery là bắt buộc.");
  }
  if (new Set(normalized.map((selection) => selection.watchId)).size !== normalized.length) {
    throw new Error("Không được chọn trùng watch trong một Media Post.");
  }
  if (new Set(normalized.map((selection) => selection.sourceGalleryKey)).size !== normalized.length) {
    throw new Error("Không được chọn trùng ảnh Gallery trong một Media Post.");
  }
  return normalized;
}

export async function cleanupCopiedMediaPostFiles(
  keys: string[],
  deleteFile: (key: string) => Promise<void> = (key) => mediaStorage.delete(key),
) {
  const results = await Promise.allSettled(keys.map((key) => deleteFile(key)));
  return results.filter((result) => result.status === "rejected").length;
}

export async function createMediaPostWithGallerySelections(
  input: CreateMediaPostInput & { selections: MediaPostThemeSelection[] },
) {
  const selections = normalizeMediaPostThemeSelections(input.selections);
  if (!selections.length) throw new Error("Cần chọn ít nhất một watch cho bài theo chủ đề.");

  const copiedKeys: string[] = [];
  let drainConsumers: (() => Promise<void>) | null = null;
  let committed: { post: Awaited<ReturnType<typeof createMediaPostRecord>>; media: {
    copied: Array<{ watchId: string; sourceGalleryKey: string; mediaPostKey: string }>;
    errors: Array<{ watchId: string; message: string }>;
  } };

  try {
    committed = await runBusinessEventTransaction(async (tx, delivery) => {
      const watches = await tx.watch.findMany({
        where: { id: { in: selections.map((selection) => selection.watchId) } },
        select: {
          id: true,
          product: { select: { productImage: { where: { role: "GALLERY" }, select: { fileKey: true } } } },
        },
      });
      const allowedByWatch = new Map(watches.map((watch) => [
        watch.id,
        new Set(watch.product.productImage.map((image) => normalizeKey(image.fileKey))),
      ]));
      for (const selection of selections) {
        if (!allowedByWatch.get(selection.watchId)?.has(selection.sourceGalleryKey)) {
          throw new Error(`Ảnh đã chọn không thuộc Gallery của watch ${selection.watchId}.`);
        }
      }

      const post = await createMediaPostRecord(tx, {
        ...input,
        watchIds: selections.map((selection) => selection.watchId),
      });
      const copied = [] as Array<{ watchId: string; sourceGalleryKey: string; mediaPostKey: string }>;
      for (let sortOrder = 0; sortOrder < selections.length; sortOrder += 1) {
        const selection = selections[sortOrder];
        try {
          const sourceObject = await registerExistingMediaObject(
            { storageKey: selection.sourceGalleryKey },
            tx,
          );
          const filename = selection.sourceGalleryKey.split("/").pop() || `watch-${sortOrder + 1}.jpg`;
          const destinationKey = mediaPathPolicy.postOriginal({
            postId: post.id,
            mediaObjectId: randomUUID(),
            filename,
          });
          await mediaStorage.copy(selection.sourceGalleryKey, destinationKey);
          copiedKeys.push(destinationKey);
          const copiedObject = await registerExistingMediaObject({
            storageKey: destinationKey,
            originalFileName: filename,
            sourceMediaObjectId: sourceObject.id,
          }, tx);
          await bindMedia({
            mediaObjectId: copiedObject.id,
            ownerType: MediaOwnerType.MEDIA_POST,
            ownerId: post.id,
            role: MediaRole.SOCIAL,
            sortOrder,
            audienceSegment: AudienceSegment.UNISEX,
            pipelineKey: null,
            lifecycle: MediaBindingLifecycle.SELECTED,
          }, tx);
          copied.push({ ...selection, mediaPostKey: destinationKey });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Không thể sao chép ảnh Gallery.";
          throw new Error(`Watch ${selection.watchId}: ${message}`, { cause: error });
        }
      }

      await delivery.emit({
        eventKey: "media.post.created",
        targetType: "MEDIA_POST",
        targetId: post.id,
        actorUserId: input.createdByUserId ?? null,
        payload: { refNo: post.refNo, title: post.title, targetIds: post.targets.map((item) => item.postTargetId) },
      });
      await delivery.emit({
        eventKey: "media.post.watch.gallery.copied",
        targetType: "MEDIA_POST",
        targetId: post.id,
        actorUserId: input.createdByUserId ?? null,
        payload: { copied, errors: [] },
      });
      return { post, media: { copied, errors: [] } };
    }, {
      deferConsumers(work) {
        drainConsumers = work;
      },
    });
  } catch (error) {
    const cleanupFailures = await cleanupCopiedMediaPostFiles(copiedKeys);
    if (cleanupFailures && error instanceof Error) {
      error.message = `${error.message} Cleanup thất bại với ${cleanupFailures} file.`;
    }
    throw error;
  }

  const drain = drainConsumers as (() => Promise<void>) | null;
  if (drain) await drain();
  return committed;
}

export function validateMediaPostThemeFilters(filters: MediaPostThemeFilters) {
  for (const [field, allowed] of Object.entries(themeFilterValues)) {
    const value = filters[field as keyof typeof themeFilterValues];
    const permitsUnclassified = field === "movementType" || field === "caseShape" || field === "style";
    if (value && value !== MEDIA_POST_UNCLASSIFIED_FILTER && !allowed.has(String(value))) {
      throw new Error(`Giá trị bộ lọc ${field} không hợp lệ.`);
    }
    if (value === MEDIA_POST_UNCLASSIFIED_FILTER && !permitsUnclassified) {
      throw new Error(`Bộ lọc ${field} không hỗ trợ giá trị chưa phân loại.`);
    }
  }
  for (const [field, value] of [["priceMin", filters.priceMin], ["priceMax", filters.priceMax]] as const) {
    if (value != null && (!Number.isFinite(value) || Number(value) < 0)) {
      throw new Error(`${field} phải là số không âm.`);
    }
  }
  if (filters.priceMin != null && filters.priceMax != null && filters.priceMin > filters.priceMax) {
    throw new Error("Giá từ không được lớn hơn giá đến.");
  }
  return filters;
}

export function effectiveMediaPostPrice(price: { salePrice: unknown; listPrice: unknown } | null) {
  return price?.salePrice ?? price?.listPrice ?? null;
}

export function buildMediaPostThemeWatchWhere(filters: MediaPostThemeFilters): Prisma.WatchWhereInput {
  validateMediaPostThemeFilters(filters);
  const query = String(filters.query ?? "").trim();
  const priceMin = Number.isFinite(filters.priceMin) ? Number(filters.priceMin) : null;
  const priceMax = Number.isFinite(filters.priceMax) ? Number(filters.priceMax) : null;
  return {
    ...(query ? { OR: [
      { product: { title: { contains: query, mode: "insensitive" } } },
      { product: { sku: { contains: query, mode: "insensitive" } } },
      { product: { brand: { name: { contains: query, mode: "insensitive" } } } },
      { watchSpecV2: { model: { contains: query, mode: "insensitive" } } },
      { watchSpecV2: { referenceNumber: { contains: query, mode: "insensitive" } } },
    ] } : {}),
    ...(filters.movementType ? { movementType: filters.movementType === MEDIA_POST_UNCLASSIFIED_FILTER ? null : filters.movementType as never } : {}),
    ...(filters.style ? { style: filters.style === MEDIA_POST_UNCLASSIFIED_FILTER ? null : filters.style as never } : {}),
    ...(filters.stockStage ? { stockStage: filters.stockStage as never } : {}),
    ...(filters.siteChannel ? { siteChannel: filters.siteChannel as never } : {}),
    ...(filters.audienceSegment ? { audienceSegment: filters.audienceSegment as never } : {}),
    ...(filters.caseShape ? {
      watchSpecV2: filters.caseShape === MEDIA_POST_UNCLASSIFIED_FILTER
        ? { is: { caseShape: null } }
        : { caseShape: filters.caseShape as never },
    } : {}),
    ...((priceMin !== null || priceMax !== null) ? { AND: [{ OR: [
      { watchPrice: { salePrice: {
        ...(priceMin !== null ? { gte: priceMin } : {}),
        ...(priceMax !== null ? { lte: priceMax } : {}),
      } } },
      { watchPrice: { salePrice: null, listPrice: {
        ...(priceMin !== null ? { gte: priceMin } : {}),
        ...(priceMax !== null ? { lte: priceMax } : {}),
      } } },
    ] }] } : {}),
    product: {
      ...(filters.brandId ? { brandId: filters.brandId } : {}),
      ...(filters.publishedOnly ? { publishedAt: { not: null } } : {}),
      productImage: { some: { role: "GALLERY" } },
    },
  };
}

export async function listMediaPostThemeWatchCandidates(
  filters: MediaPostThemeFilters,
): Promise<MediaPostThemeWatchCandidate[]> {
  const rows = await prisma.watch.findMany({
    where: buildMediaPostThemeWatchWhere(filters),
    select: {
      id: true,
      movementType: true,
      style: true,
      watchPrice: { select: { salePrice: true, listPrice: true } },
      watchSpecV2: { select: { caseShape: true } },
      product: {
        select: {
          id: true,
          title: true,
          sku: true,
          brandId: true,
          brand: { select: { name: true } },
          productImage: {
            where: { role: "GALLERY" },
            orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
            select: { fileKey: true, sortOrder: true },
          },
        },
      },
    },
    orderBy: [{ updatedAt: "desc" }],
    take: 60,
  });

  return rows.map((row) => ({
    watchId: row.id,
    productId: row.product.id,
    title: row.product.title,
    sku: row.product.sku,
    brandId: row.product.brandId,
    brandName: row.product.brand?.name ?? null,
    price: effectiveMediaPostPrice(row.watchPrice)?.toString() ?? null,
    movementType: row.movementType ?? null,
    caseShape: row.watchSpecV2?.caseShape ?? null,
    style: row.style ?? null,
    gallery: row.product.productImage.map((image) => ({
      key: image.fileKey,
      url: `/api/media/sign?key=${encodeURIComponent(image.fileKey)}`,
      sortOrder: image.sortOrder,
    })),
  }));
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
    where: {
      ownerType: MediaOwnerType.MEDIA_POST,
      ownerId: post.id,
      lifecycle: { in: [MediaBindingLifecycle.SELECTED, MediaBindingLifecycle.ATTACHED, MediaBindingLifecycle.APPROVED, MediaBindingLifecycle.PUBLISHED] },
    },
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
      lifecycle: { in: [MediaBindingLifecycle.SELECTED, MediaBindingLifecycle.ATTACHED, MediaBindingLifecycle.APPROVED, MediaBindingLifecycle.PUBLISHED] },
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
