import { prisma } from "@/server/db/client";
import { ServiceRequestStatus } from "@prisma/client";

export async function postServiceRequestsApplication(ids: string[]) {
  const cleanIds = Array.from(new Set((ids ?? []).map((x) => String(x).trim()).filter(Boolean)));
  if (!cleanIds.length) return { updated: 0 };

  const result = await prisma.serviceRequest.updateMany({
    where: { id: { in: cleanIds }, status: ServiceRequestStatus.DRAFT },
    data: { status: ServiceRequestStatus.IN_PROGRESS, updatedAt: new Date() },
  });

  return { updated: result.count };
}
