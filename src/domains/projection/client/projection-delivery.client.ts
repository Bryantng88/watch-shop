"use client";

import { getProjectionDeliveryStatusAction } from "./projection-delivery.actions";

const DELIVERY_TIMEOUT_MS = 180_000;

export type ProjectionDeliveryCommandResult = {
  event?: { projectionDeliveryKey?: string | null } | null;
};

export async function waitForProjectionDelivery(
  result: ProjectionDeliveryCommandResult,
  options?: {
    cancelled?: () => boolean;
    onStatus?: (status: string) => void;
  },
) {
  const key = String(result.event?.projectionDeliveryKey ?? "").trim();
  if (!key) throw new Error("Thiếu projectionDeliveryKey.");
  const startedAt = Date.now();
  while (Date.now() - startedAt < DELIVERY_TIMEOUT_MS) {
    if (options?.cancelled?.())
      throw new Error("PROJECTION_DELIVERY_POLL_CANCELLED");
    const delivery = await getProjectionDeliveryStatusAction({
      projectionDeliveryKey: key,
    });
    const status = String(delivery?.status ?? "BLOCKED").toUpperCase();
    options?.onStatus?.(status);
    if (status === "SUCCEEDED") return delivery;
    if (status === "DEAD" || status === "FAILED") {
      throw new Error(delivery?.lastError || "Projection delivery thất bại.");
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  throw new Error("Quá thời gian chờ đồng bộ projection (180 giây).");
}

export async function waitForBulkProjectionDeliveries<
  T extends {
    projectionDeliveryKey?: string | null;
  },
>(
  items: T[],
  options?: {
    concurrency?: number;
    cancelled?: () => boolean;
    onSettled?: (input: {
      index: number;
      item: T;
      status: "SUCCEEDED" | "FAILED";
      error?: unknown;
    }) => void;
  },
) {
  const missing = items.filter(
    (item) => !String(item.projectionDeliveryKey ?? "").trim(),
  ).length;
  if (missing)
    throw new Error(
      `${missing}/${items.length} kết quả bulk thiếu projectionDeliveryKey.`,
    );
  const concurrency = Math.max(
    1,
    Math.min(8, Math.trunc(options?.concurrency ?? 4)),
  );
  let cursor = 0;
  const failures: unknown[] = [];
  async function worker() {
    while (cursor < items.length) {
      const index = cursor++;
      const item = items[index];
      try {
        await waitForProjectionDelivery(
          { event: { projectionDeliveryKey: item.projectionDeliveryKey } },
          { cancelled: options?.cancelled },
        );
        options?.onSettled?.({ index, item, status: "SUCCEEDED" });
      } catch (error) {
        failures.push(error);
        options?.onSettled?.({ index, item, status: "FAILED", error });
      }
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => worker()),
  );
  if (failures.length)
    throw new AggregateError(
      failures,
      `${failures.length}/${items.length} projection delivery thất bại.`,
    );
  return { total: items.length, succeeded: items.length };
}
