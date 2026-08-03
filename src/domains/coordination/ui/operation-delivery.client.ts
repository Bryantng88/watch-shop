"use client";

import { getOperationProjectionDeliveriesAction } from "@/domains/task/actions/task.actions";

const OPERATION_DELIVERY_TIMEOUT_MS = 180_000;

function collectDeliveryKeys(value: unknown, keys: Set<string>, seen: Set<object>) {
  if (!value || typeof value !== "object") return;
  if (seen.has(value)) return;
  seen.add(value);

  if (Array.isArray(value)) {
    value.forEach((entry) => collectDeliveryKeys(entry, keys, seen));
    return;
  }

  const record = value as Record<string, unknown>;
  const key = String(record.projectionDeliveryKey ?? "").trim();
  if (key) keys.add(key);
  if (Array.isArray(record.projectionDeliveryKeys)) {
    record.projectionDeliveryKeys.forEach((candidate) => {
      const candidateKey = String(candidate ?? "").trim();
      if (candidateKey) keys.add(candidateKey);
    });
  }
  Object.values(record).forEach((entry) => collectDeliveryKeys(entry, keys, seen));
}

function hasInvalidAsyncDeliveryContract(value: unknown, seen = new Set<object>()): boolean {
  if (!value || typeof value !== "object") return false;
  if (seen.has(value)) return false;
  seen.add(value);
  if (Array.isArray(value)) return value.some((entry) => hasInvalidAsyncDeliveryContract(entry, seen));
  const record = value as Record<string, unknown>;
  if (record.reconciliationMode === "ASYNC_DELIVERY") {
    const keys = Array.isArray(record.projectionDeliveryKeys)
      ? record.projectionDeliveryKeys.map((key) => String(key ?? "").trim()).filter(Boolean)
      : [];
    if (!keys.length && !String(record.projectionDeliveryKey ?? "").trim()) return true;
  }
  return Object.values(record).some((entry) => hasInvalidAsyncDeliveryContract(entry, seen));
}

export function operationProjectionDeliveryKeys(result: unknown) {
  const keys = new Set<string>();
  collectDeliveryKeys(result, keys, new Set<object>());
  return [...keys];
}

export async function waitForOperationProjectionDeliveries(
  result: unknown,
  options?: {
    cancelled?: () => boolean;
    onStatus?: (completed: number, total: number) => void;
  },
) {
  if (hasInvalidAsyncDeliveryContract(result)) {
    throw new Error("Kết quả đã commit nhưng thiếu projection delivery key.");
  }
  const keys = operationProjectionDeliveryKeys(result);
  if (!keys.length) return { tracked: false as const, completed: 0, total: 0 };

  const startedAt = Date.now();
  while (Date.now() - startedAt < OPERATION_DELIVERY_TIMEOUT_MS) {
    if (options?.cancelled?.()) throw new Error("OPERATION_DELIVERY_POLL_CANCELLED");
    const rows = await getOperationProjectionDeliveriesAction({
      projectionDeliveryKeys: keys,
    });
    const completed = rows.filter(
      (row) => String(row.delivery?.status ?? "").toUpperCase() === "SUCCEEDED",
    ).length;
    options?.onStatus?.(completed, keys.length);

    const failed = rows.find((row) =>
      ["DEAD", "FAILED"].includes(String(row.delivery?.status ?? "").toUpperCase()),
    );
    if (failed) {
      throw new Error(
        failed.delivery?.lastError || "Không thể đồng bộ dữ liệu vận hành.",
      );
    }
    if (completed === keys.length) {
      return { tracked: true as const, completed, total: keys.length };
    }
    await new Promise((resolve) => window.setTimeout(resolve, 750));
  }

  throw new Error("Quá thời gian chờ đồng bộ dữ liệu vận hành (180 giây).");
}
