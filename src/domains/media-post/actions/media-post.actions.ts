"use server";

import { MediaRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { createMediaPost, createMediaPostWithGallerySelections, listMediaPostThemeWatchCandidates, removeMediaFromPost, reorderMediaPostAssets, saveMediaPostWorkProgress, selectMediaForPost, updateMediaPostContent } from "@/domains/media-post/server";
import { requirePermission } from "@/server/auth/requirePermission";
import type { MediaPostThemeDefinition, MediaPostThemeFilters, MediaPostThemeSelection } from "../shared/media-post-theme.types";

export async function searchMediaPostThemeWatchesAction(filters: MediaPostThemeFilters) {
  await requirePermission("MEDIA_VIEW");
  const items = await listMediaPostThemeWatchCandidates(filters);
  if (items.length) return { items, suggestion: null };

  const removable: Array<{
    keys: Array<keyof MediaPostThemeFilters>;
    label: string;
  }> = [
    { keys: ["style"], label: "Phong cách" },
    { keys: ["stockStage"], label: "Tình trạng kho" },
    { keys: ["audienceSegment"], label: "Phân khúc" },
    { keys: ["siteChannel"], label: "Kênh sản phẩm" },
    { keys: ["caseShape"], label: "Form vỏ" },
    { keys: ["movementType"], label: "Bộ máy" },
    { keys: ["priceMin", "priceMax"], label: "Khoảng giá" },
    { keys: ["publishedOnly"], label: "Chỉ watch đang storefront" },
    { keys: ["query"], label: "Từ khóa" },
  ];

  for (const candidate of removable) {
    if (!candidate.keys.some((key) => Boolean(filters[key]))) continue;
    const nextFilters = { ...filters };
    for (const key of candidate.keys) delete nextFilters[key];
    const relaxedItems = await listMediaPostThemeWatchCandidates(nextFilters);
    if (relaxedItems.length) {
      return {
        items,
        suggestion: {
          label: candidate.label,
          count: relaxedItems.length,
          filters: nextFilters,
        },
      };
    }
  }

  return { items, suggestion: null };
}

export async function createMediaPostAction(input: {
  brief?: string | null;
  caption?: string | null;
  scheduledAt?: string | null;
  assignedToUserId?: string | null;
  postTargetIds?: string[];
  watchIds?: string[];
  watchSelections?: MediaPostThemeSelection[];
  theme?: MediaPostThemeDefinition | null;
}) {
  const auth = await requirePermission("PRODUCT_UPDATE");
  const watchIds = input.watchSelections?.length
    ? input.watchSelections.map((selection) => selection.watchId)
    : input.watchIds;
  const createInput = {
    ...input,
    watchIds,
    contentJson: input.theme ? {
      hook: null,
      body: null,
      hashtags: null,
      theme: input.theme,
      watchSnapshot: input.watchSelections ?? [],
    } : undefined,
    scheduledAt: input.scheduledAt ? new Date(input.scheduledAt) : null,
    createdByUserId: auth.userId,
  };
  const created = input.watchSelections?.length
    ? await createMediaPostWithGallerySelections({
        ...createInput,
        selections: input.watchSelections,
      })
    : { post: await createMediaPost(createInput), media: { copied: [], errors: [] } };
  const { post, media } = created;
  revalidatePath("/admin/coordination/media");
  return {
    ok: true as const,
    postId: post.id,
    refNo: post.refNo,
    media,
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
  hook?: string | null;
  brief?: string | null;
  caption?: string | null;
  body?: string | null;
  hashtags?: string | null;
  postTargetIds?: string[];
}) {
  const auth = await requirePermission("PRODUCT_UPDATE");
  const post = await updateMediaPostContent({ ...input, actorUserId: auth.userId });
  const contentDone = Boolean(input.title.trim() && (input.hook?.trim() || input.caption?.trim() || input.body?.trim()));
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
