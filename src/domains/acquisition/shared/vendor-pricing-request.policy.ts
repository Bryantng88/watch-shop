export type VendorPricingRequestItem = { id: string; title: string };
export type VendorPricingResponseItem = { id: string; unitCost: number; vendorNote?: string | null };

export function resolveVendorPricingSubmission(
  requestItems: VendorPricingRequestItem[],
  responseItems: VendorPricingResponseItem[],
) {
  const responses = new Map(responseItems.map((item) => [String(item.id), item]));
  if (
    responses.size !== responseItems.length ||
    responses.size !== requestItems.length ||
    requestItems.some((item) => !responses.has(item.id))
  ) {
    throw new Error("Danh sách watch không khớp với yêu cầu báo giá.");
  }

  const prices = requestItems.map((item) => {
    const value = Number(responses.get(item.id)?.unitCost);
    if (!Number.isFinite(value) || value <= 0) {
      throw new Error(`Vui lòng nhập giá hợp lệ cho ${item.title}.`);
    }
    return value;
  });

  return { responses, prices, totalAmount: prices.reduce((sum, value) => sum + value, 0) };
}

export function resolveVendorPricingRequestStatus(input: { status: string; expiresAt: Date }, now = new Date()) {
  if (input.status === "OPEN" && input.expiresAt.getTime() <= now.getTime()) return "EXPIRED" as const;
  return input.status as "OPEN" | "SUBMITTED" | "EXPIRED" | "REVOKED";
}
