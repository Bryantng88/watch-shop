import { z } from "zod";

export const termsSchema = z
  .object({
    mode: z.enum(["PERCENT", "FIXED", "NET"]),
    value: z.number().finite().min(0).max(9999999999),
  })
  .superRefine((value, ctx) => {
    if (value.mode === "PERCENT" && value.value > 100)
      ctx.addIssue({ code: "custom", message: "Phần trăm phải từ 0 đến 100." });
    if (value.mode !== "PERCENT" && !Number.isSafeInteger(value.value))
      ctx.addIssue({ code: "custom", message: "Số tiền dùng VND nguyên." });
  });
export const statusSchema = z.enum([
  "DRAFT",
  "ACTIVE",
  "SOLD",
  "RETURNED",
  "SETTLED",
  "CANCELLED",
]);
export const metadataSchema = z.object({
  receipt: z
    .object({
      id: z.string().uuid(),
      actorId: z.string(),
      checksum: z.string(),
    })
    .optional(),
  version: z.literal(1),
  direction: z.enum(["IN", "OUT"]),
  status: statusSchema,
  terms: termsSchema,
  productId: z.string().min(1),
  soldAmount: z.number().nonnegative().nullable().default(null),
  orderId: z.string().nullable().default(null),
  saleReference: z.string().nullable().default(null),
  previous: z
    .object({
      productStatus: z.string(),
      saleStage: z.string(),
      stockStage: z.string(),
    })
    .nullable()
    .default(null),
  history: z
    .array(
      z.object({
        action: z.string(),
        at: z.string(),
        actorId: z.string(),
        note: z.string().optional(),
      }),
    )
    .default([]),
});
export type ConsignmentMetadata = z.infer<typeof metadataSchema>;
export type ConsignmentTerms = z.infer<typeof termsSchema>;
export function readConsignment(value: unknown): ConsignmentMetadata | null {
  const parsed = metadataSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}
export function consignmentAmounts(
  saleAmount: number,
  terms: ConsignmentTerms,
) {
  termsSchema.parse(terms);
  if (
    !Number.isSafeInteger(saleAmount) ||
    saleAmount <= 0 ||
    saleAmount > 9999999999
  )
    throw Error("Giá bán phải là số VND nguyên, lớn hơn 0.");
  const fee =
    terms.mode === "PERCENT"
      ? Math.round((saleAmount * terms.value) / 100)
      : terms.mode === "FIXED"
        ? terms.value
        : saleAmount - terms.value;
  if (fee < 0 || fee > saleAmount)
    throw Error("Giá bán không đủ cho số tiền đã thỏa thuận.");
  return { saleAmount, fee, net: saleAmount - fee };
}
export const createConsignmentSchema = z
  .object({
    requestId: z.string().uuid(),
    direction: z.enum(["IN", "OUT"]),
    productId: z.string().min(1).max(100).optional(),
    title: z.string().trim().max(200).optional(),
    vendorId: z.string().min(1).max(100),
    terms: termsSchema,
    note: z.string().max(4000).default(""),
  })
  .superRefine((v, c) => {
    if (v.direction === "OUT" && !v.productId)
      c.addIssue({ code: "custom", message: "Chọn đồng hồ gửi đối tác." });
    if (v.direction === "IN" && !v.title?.trim())
      c.addIssue({ code: "custom", message: "Nhập tên đồng hồ nhận ký gửi." });
  });
export const commandSchema = z.object({
  id: z.string().min(1),
  expectedVersion: z.string().min(1),
  action: z.enum(["ACTIVATE", "TERMS", "RETURN", "SALE", "SETTLE", "CANCEL"]),
  terms: termsSchema.optional(),
  saleAmount: z.number().int().positive().max(9999999999).optional(),
  orderId: z.string().min(1).optional(),
  saleReference: z.string().trim().max(240).optional(),
  note: z.string().max(4000).default(""),
});
export const directionLabels = { IN: "Nhận ký gửi", OUT: "Gửi đối tác" };
export const statusLabels = {
  DRAFT: "Nháp",
  ACTIVE: "Đang ký gửi",
  SOLD: "Đã bán · Chờ quyết toán",
  RETURNED: "Đã trả / nhận lại",
  SETTLED: "Đã quyết toán",
  CANCELLED: "Đã hủy",
};
export const termLabels = {
  PERCENT: "Phí theo % giá bán",
  FIXED: "Phí cố định",
  NET: "Chốt số tiền chủ đồng hồ nhận",
};
