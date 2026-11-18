export const mediaStages = ["MEDIA_PROCESSING", "PHOTOGRAPHY", "PUBLISH", "DONE"] as const;
export type MediaStage = typeof mediaStages[number];
export const mediaStageLabels: Record<MediaStage, string> = {
  MEDIA_PROCESSING: "Xử lý media", PHOTOGRAPHY: "Chụp ảnh", PUBLISH: "Đăng bài", DONE: "Đã xong",
};
export type MediaListRow = {
  id: string; bindingId: string; productId: string | null; targetType: "WATCH" | "MEDIA_POST";
  title: string; sku: string | null; imageUrl: string | null; stage: MediaStage;
  note: string | null; updatedAt: string | null;
  progress: { profile: boolean; content: boolean; image: boolean; cover: boolean } | null;
};
export type MediaListData = {
  q: string; stage: MediaStage; page: number; pageSize: number; total: number; totalPages: number;
  open: number; items: MediaListRow[]; canEdit: boolean;
};
export function mediaListSearch(params: Record<string, string | string[] | undefined>) {
  const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;
  const rawStage = first(params.stage);
  const rawPage = Number(first(params.page));
  return { q: (first(params.q) ?? "").trim().slice(0, 120),
    stage: mediaStages.find(stage => stage === rawStage) ?? "MEDIA_PROCESSING",
    page: Number.isSafeInteger(rawPage) && rawPage > 0 ? Math.min(rawPage, 100000) : 1 };
}
export function mediaListHref(input: {q: string; stage: MediaStage; page: number}) {
  const params = new URLSearchParams({stage: input.stage, page: String(input.page)});
  if (input.q) params.set("q", input.q);
  return "/admin/ben/media?" + params;
}
export function mediaRowHref(row: MediaListRow, returnTo: string, canEdit: boolean) {
  if (row.targetType === "MEDIA_POST") return `/admin/media-posts/${encodeURIComponent(row.id)}`;
  if (!row.productId) return null;
  if (!canEdit || row.stage === "PHOTOGRAPHY" || row.stage === "DONE") return `/admin/watches/${encodeURIComponent(row.productId)}`;
  const params = new URLSearchParams({mode: "media", from: "media-workspace", source: "ben-media", workspaceBindingId: row.bindingId, returnTo});
  return `/admin/watches/${encodeURIComponent(row.productId)}/edit?${params}`;
}
