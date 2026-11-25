export const WORK_IMAGE_MAX_BYTES = 10 * 1024 * 1024;
export const WORK_IMAGE_LIMIT = 20;
export type WorkMediaTarget = { workId: string; entryId?: string };
export type WorkImage = { id: string; name: string; state: "READY" | "PENDING" | "FAILED"; url: string | null };
export type WorkImages = { items: WorkImage[]; canEdit: boolean; limit: number };
export function workImagesUrl(target: WorkMediaTarget) {
  const query = new URLSearchParams({workId:target.workId});
  if (target.entryId) query.set("entryId", target.entryId);
  return `/api/admin/personal-work/images?${query}`;
}
