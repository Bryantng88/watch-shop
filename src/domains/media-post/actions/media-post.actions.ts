"use server";

import { MediaRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { createMediaPost, removeMediaFromPost, reorderMediaPostAssets, saveMediaPostWorkProgress, selectMediaForPost, updateMediaPostContent } from "@/domains/media-post/server";
import { requirePermission } from "@/server/auth/requirePermission";

export async function createMediaPostAction(input: {
  title: string;
  brief?: string | null;
  caption?: string | null;
  scheduledAt?: string | null;
  assignedToUserId?: string | null;
  postTargetIds?: string[];
  watchIds?: string[];
}) {
  const auth = await requirePermission("PRODUCT_UPDATE");
  const post = await createMediaPost({
    ...input,
    scheduledAt: input.scheduledAt ? new Date(input.scheduledAt) : null,
    createdByUserId: auth.userId,
  });
  revalidatePath("/admin/coordination/media");
  return {
    ok: true as const,
    postId: post.id,
    refNo: post.refNo,
    coordination: {
      flowKey: "media-production-flow" as const,
      stageKey: "photography" as const,
      href: `/admin/media-posts/${post.id}`,
    },
  };
}

export async function removeMediaFromPostAction(input: {
  mediaPostId: string;
  storageKey: string;
}) {
  await requirePermission("PRODUCT_UPDATE");
  await removeMediaFromPost(input);
  revalidatePath(`/admin/media-posts/${input.mediaPostId}`);
  revalidatePath("/admin/coordination/media");
  return { ok: true as const };
}

export async function selectMediaForPostAction(input: {
  mediaPostId: string;
  storageKey: string;
  role?: MediaRole;
  sortOrder?: number;
}) {
  const auth = await requirePermission("PRODUCT_UPDATE");
  const result = await selectMediaForPost({ ...input, actorUserId: auth.userId });
  revalidatePath("/admin/coordination/media");
  return {
    ok: true as const,
    mediaObjectId: result.object.id,
    storageKey: result.object.storageKey,
    bindingId: result.binding.id,
  };
}

export async function updateMediaPostContentAction(input: {
  mediaPostId: string;
  title: string;
  brief?: string | null;
  caption?: string | null;
  body?: string | null;
  hashtags?: string | null;
}) {
  const auth = await requirePermission("PRODUCT_UPDATE");
  const post = await updateMediaPostContent(input);
  const contentDone = Boolean(input.title.trim() && (input.caption?.trim() || input.body?.trim()));
  const progress = await saveMediaPostWorkProgress({ mediaPostId: input.mediaPostId, parts: { content: contentDone }, actorUserId: auth.userId });
  revalidatePath(`/admin/media-posts/${input.mediaPostId}`);
  revalidatePath("/admin/coordination/media");
  return { ok: true as const, updatedAt: post.updatedAt.toISOString(), progress };
}

export async function reorderMediaPostAssetsAction(input: {
  mediaPostId: string;
  storageKeys: string[];
}) {
  const auth = await requirePermission("PRODUCT_UPDATE");
  await reorderMediaPostAssets(input);
  const progress = await saveMediaPostWorkProgress({ mediaPostId: input.mediaPostId, parts: { image: input.storageKeys.length > 0 }, actorUserId: auth.userId });
  revalidatePath(`/admin/media-posts/${input.mediaPostId}`);
  revalidatePath("/admin/coordination/media");
  return { ok: true as const, progress };
}
