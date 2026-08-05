import { Prisma } from "@prisma/client";
import { prisma } from "@/server/db/client";
import { listPublicWatches } from "./public-catalog.service";
import { submitPublicOrder } from "./public-order.service";
import type { ZaloIngressEvent } from "../contracts";
import type { BusinessEventDispatchOptions } from "@/domains/event/server/business-event.service";

type ReceiptResult = { replayed: boolean; response: unknown };

export async function processZaloIngressEvent(input: {
  event: ZaloIngressEvent;
  keyId: string;
  nonce: string;
  requestHash: string;
  runtime?: BusinessEventDispatchOptions;
}): Promise<ReceiptResult> {
  const existing = await prisma.integrationIngressReceipt.findUnique({
    where: { channel_eventId: { channel: "ZALO", eventId: input.event.eventId } },
  });
  if (existing) {
    if (existing.requestHash !== input.requestHash || existing.eventType !== input.event.type) throw new Error("ZALO_EVENT_CONFLICT");
    if (existing.status === "COMPLETED") return { replayed: true, response: existing.responseJson };
    const stale = existing.updatedAt.getTime() < Date.now() - 60_000;
    if (!stale) throw new Error("ZALO_EVENT_IN_PROGRESS");
    await prisma.integrationIngressReceipt.update({ where: { id: existing.id }, data: { status: "PROCESSING", lastError: null } });
  } else {
    try {
      await prisma.integrationIngressReceipt.create({ data: {
        channel: "ZALO", keyId: input.keyId, nonce: input.nonce,
        eventId: input.event.eventId, eventType: input.event.type,
        requestHash: input.requestHash, status: "PROCESSING",
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1_000),
      } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") throw new Error("ZALO_EVENT_REPLAYED");
      throw error;
    }
  }

  try {
    const response = input.event.type === "watch.lookup"
      ? await listPublicWatches(input.event.data)
      : await submitPublicOrder({
          request: input.event.data,
          idempotencyKey: input.event.eventId,
          externalRequestId: input.event.eventId,
          channel: "ZALO",
        }, { fingerprint: `zalo:${input.keyId}`, runtime: input.runtime });
    await prisma.integrationIngressReceipt.update({
      where: { channel_eventId: { channel: "ZALO", eventId: input.event.eventId } },
      data: { status: "COMPLETED", responseJson: response as Prisma.InputJsonValue, lastError: null },
    });
    return { replayed: false, response };
  } catch (error) {
    await prisma.integrationIngressReceipt.update({
      where: { channel_eventId: { channel: "ZALO", eventId: input.event.eventId } },
      data: { status: "FAILED", lastError: error instanceof Error ? error.message.slice(0, 200) : "UNKNOWN" },
    }).catch(() => undefined);
    throw error;
  }
}
