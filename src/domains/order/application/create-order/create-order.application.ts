import { createOrderWithItems } from "../../server";
import type { CreateOrderInput } from "../../server/shared";

export async function createOrderApplication(input: CreateOrderInput) {
  const source = input.source ?? "ADMIN";
  const verificationStatus =
    input.verificationStatus ?? (source === "WEB" ? "PENDING" : "VERIFIED");

  // Internal order giảm thao tác: mặc định POSTED để vào vận hành ngay.
  // UI vẫn có thể truyền status=DRAFT khi user bấm "Lưu nháp".
  const status = input.status ?? (source === "WEB" ? "DRAFT" : "POSTED");

  return createOrderWithItems({
    ...input,
    source,
    verificationStatus,
    status,
    quickFromProductId: input.quickFromProductId ?? null,
    quickFlowType: input.quickFlowType ?? "STANDARD",
  });
}
