import { z } from "zod";
export const technicianViews = [
  "ACTIVE",
  "IN_PROGRESS",
  "INSPECT",
  "READY",
  "DONE",
  "CANCELED",
  "ALL",
] as const;
export type TechnicianView = (typeof technicianViews)[number];
export const technicianViewLabels: Record<TechnicianView, string> = {
  ACTIVE: "Đang mở",
  IN_PROGRESS: "Đang làm",
  INSPECT: "Chờ xác nhận",
  READY: "Sẵn sàng",
  DONE: "Đã xong",
  CANCELED: "Đã hủy",
  ALL: "Tất cả phiếu",
};
export function technicianSearch(
  input: Record<string, string | string[] | undefined>,
) {
  const first = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value;
  const requested = first(input.view),
    rawPage = Number(first(input.page));
  return {
    q: (first(input.q) ?? "").trim().slice(0, 150),
    view: technicianViews.includes(requested as TechnicianView)
      ? (requested as TechnicianView)
      : ("ACTIVE" as TechnicianView),
    page:
      Number.isSafeInteger(rawPage) && rawPage > 0
        ? Math.min(rawPage, 10000)
        : 1,
  };
}
export type TechnicianIssue = {
  id: string;
  summary: string;
  note: string;
  updatedAt: string;
  executionStatus: string;
  isConfirmed: boolean;
  area: string | null;
  actionMode: string;
  vendorId: string | null;
  vendorName: string | null;
  technicianName: string | null;
  technicalDetailCatalogId: string | null;
  expectedWorkingDays: number | null;
  expectedCompletionAt: string | null;
  actualCost: number | null;
  estimatedCost: number | null;
  resolutionNote: string;
  priority: string | null;
  serviceRequest: {
    id: string;
    refNo: string;
    productTitle: string;
    sku: string | null;
    imageUrl: string | null;
  };
};
export type TechnicianData = {
  items: TechnicianIssue[];
  total: number;
  page: number;
  pageSize: number;
  view: TechnicianView;
  q: string;
  counts: {
    active: number;
    processing: number;
    ready: number;
    inspect: number;
  };
  canUpdate: boolean;
  details: { id: string; area: string | null; code: string; name: string }[];
  vendors: { id: string; name: string }[];
};
const base = { id: z.string().min(1).max(100), version: z.string().datetime() };
const money = z.number().finite().min(0).max(999999999999);
export const technicianCommand = z.discriminatedUnion("action", [
  z.object({ ...base, action: z.literal("confirm") }).strict(),
  z
    .object({
      ...base,
      action: z.literal("start"),
      technicalDetailCatalogId: z.string().min(1),
      expectedWorkingDays: z.number().int().min(1).max(365),
      actionMode: z.enum(["INTERNAL", "VENDOR"]),
      vendorId: z.string().nullable(),
      replacementPartCodes: z.array(z.string()).max(6),
      startedNote: z.string().max(4000),
    })
    .strict(),
  z
    .object({
      ...base,
      action: z.literal("complete"),
      actualCost: money,
      resolutionNote: z.string().max(4000),
    })
    .strict(),
  z
    .object({ ...base, action: z.literal("note"), note: z.string().max(4000) })
    .strict(),
]);
export type TechnicianCommand = z.infer<typeof technicianCommand>;
