import { prisma } from "@/server/db/client";
import { ServiceRequestStatus } from "@prisma/client";
import { recordBusinessEvent } from "@/domains/event/server/business-event.service";

export async function postServiceRequestsApplication(input: {
  ids: string[];
  actorUserId?: string | null;
  deferConsumers?: (work: () => Promise<void>) => void;
}) {
  const ids = input.ids;
  const cleanIds = Array.from(new Set((ids ?? []).map((x) => String(x).trim()).filter(Boolean)));
  if (!cleanIds.length) return { updated: 0 };

  return prisma.$transaction(async (tx) => {
    const targets = await tx.serviceRequest.findMany({
      where: { id: { in: cleanIds }, status: ServiceRequestStatus.DRAFT },
      select: { id: true },
    });
    if (!targets.length) return { updated: 0, events: [] };
    const result = await tx.serviceRequest.updateMany({
      where: { id: { in: targets.map((target) => target.id) } },
      data: { status: ServiceRequestStatus.IN_PROGRESS, updatedAt: new Date() },
    });
    const events = [];
    for (const target of targets) {
      const event = await recordBusinessEvent(tx, {
        eventKey: "service_request.status_changed",
        targetType: "SERVICE_REQUEST",
        targetId: target.id,
        actorUserId: input.actorUserId ?? null,
        payload: {
          status: ServiceRequestStatus.IN_PROGRESS,
          sourceId: `${target.id}:service_request.status_changed:${ServiceRequestStatus.IN_PROGRESS}`,
        },
      }, { deferConsumers: input.deferConsumers });
      events.push({ projectionDeliveryKey: event.projectionDeliveryKey });
    }
    return { updated: result.count, events };
  });
}
