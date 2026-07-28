"use client";

import { getWatchMediaIntakeStatusAction } from "./watch-media-work.actions";

const MEDIA_DELIVERY_TIMEOUT_MS = 180_000;

export type WatchMediaDeliveryCommandResult = {
  event?: {
    projectionDeliveryKey?: string | null;
  } | null;
};

export async function waitForWatchMediaDelivery(
  result: WatchMediaDeliveryCommandResult,
  options?: {
    cancelled?: () => boolean;
    onStatus?: (status: string) => void;
  },
) {
  const key = String(result.event?.projectionDeliveryKey ?? "").trim();
  if (!key) throw new Error("Thiếu mã theo dõi xử lý Media.");

  const startedAt = Date.now();
  while (Date.now() - startedAt < MEDIA_DELIVERY_TIMEOUT_MS) {
    if (options?.cancelled?.()) throw new Error("MEDIA_DELIVERY_POLL_CANCELLED");
    const delivery = await getWatchMediaIntakeStatusAction({
      projectionDeliveryKey: key,
    });
    const status = String(delivery?.status ?? "BLOCKED").toUpperCase();
    options?.onStatus?.(status);

    if (status === "SUCCEEDED") return delivery;
    if (status === "DEAD" || status === "FAILED") {
      throw new Error(delivery?.lastError || "Không thể đồng bộ danh sách Media.");
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  throw new Error("Quá thời gian chờ đồng bộ Media (180 giây).");
}
