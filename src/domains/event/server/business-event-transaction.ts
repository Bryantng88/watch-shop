import type { Prisma } from "@prisma/client";

import { processBusinessEventOperation } from "@/domains/event/delivery";
import {
  recordBusinessEvent,
  type BusinessEventInput,
  type RecordedBusinessEvent,
} from "@/domains/event/server/business-event.service";
import { prisma } from "@/server/db/client";

export type BusinessEventDeliveryRef = {
  projectionDeliveryKey?: string | null;
};

export type BusinessEventTransactionDelivery = {
  /**
   * Canonical event API for commands. It records the event in the current
   * transaction and automatically schedules its outbox for post-commit drain.
   */
  emit: (input: BusinessEventInput) => Promise<RecordedBusinessEvent>;
  /** @deprecated Prefer emit(); track exists for incremental migration only. */
  track: <T extends BusinessEventDeliveryRef>(event: T) => T;
};

export type RunBusinessEventTransactionOptions = {
  deferConsumers?: (work: () => Promise<void>) => void;
  /** Explicit escape hatch for non-projected maintenance commands. */
  allowNoEvents?: boolean;
  maxWait?: number;
  timeout?: number;
};

async function processCommittedDeliveries(keys: string[]) {
  for (const projectionDeliveryKey of keys) {
    await processBusinessEventOperation(projectionDeliveryKey, { db: prisma });
  }
}

/**
 * Atomic business command boundary for domain writes that enqueue events.
 * Event/outbox rows are written with the owning transaction; consumers and
 * projections are triggered only after that transaction has committed.
 */
export async function runBusinessEventTransaction<T>(
  work: (
    tx: Prisma.TransactionClient,
    delivery: BusinessEventTransactionDelivery,
  ) => Promise<T>,
  options: RunBusinessEventTransactionOptions = {},
) {
  const committed = await prisma.$transaction(async (tx) => {
    const deliveryKeys: string[] = [];
    const track = <T extends BusinessEventDeliveryRef>(event: T) => {
      const key = String(event?.projectionDeliveryKey ?? "").trim();
      if (!key) throw new Error("BUSINESS_EVENT_DELIVERY_KEY_REQUIRED");
      deliveryKeys.push(key);
      return event;
    };
    const delivery: BusinessEventTransactionDelivery = {
      async emit(input) {
        return track(await recordBusinessEvent(tx, input));
      },
      track(event) {
        return track(event);
      },
    };

    const value = await work(tx, delivery);
    if (!options.allowNoEvents && deliveryKeys.length === 0) {
      throw new Error("BUSINESS_COMMAND_EVENT_REQUIRED");
    }
    return {
      value,
      deliveryKeys: Array.from(new Set(deliveryKeys)),
    };
  }, {
    maxWait: options.maxWait,
    timeout: options.timeout,
  });

  const drain = () => processCommittedDeliveries(committed.deliveryKeys);
  if (options.deferConsumers) {
    options.deferConsumers(drain);
  } else {
    await drain();
  }

  return committed.value;
}
