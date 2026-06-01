import { prisma } from "@/server/db/client";
import { getTechnicalAssessmentPanel, getServiceRequestTechnicalSummary } from "@/domains/service/server/technical/technical-assessment.service";
import { getTechnicalIssueBoardData } from "@/domains/service/server/issue-board";

function serialize<T>(obj: T): T {
  return JSON.parse(
    JSON.stringify(obj, (_key, value) => {
      if (value instanceof Date) return value.toISOString();
      if (typeof value === "object" && value?._isDecimal) return Number(value);
      return value;
    }),
  );
}

export async function getServiceRequestDetailPageData(serviceRequestId: string) {
  const id = String(serviceRequestId || "").trim();
  if (!id) return null;
  const exists = await prisma.serviceRequest.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!exists) return null;

  const [technicalSummary, issueBoard, panel] = await Promise.all([
    getServiceRequestTechnicalSummary(id).catch(() => null),
    getTechnicalIssueBoardData().catch(() => ({
      items: [],
      counts: {
        pendingConfirm: 0,
        ready: 0,
        inProgress: 0,
        done: 0,
        readyToCloseSrCount: 0,
      },
    })),
    getTechnicalAssessmentPanel(id).catch(() => null),
  ]);

  return serialize({
    detail: {
      serviceRequest: exists,
      technicalSummary,
    },
    issueBoard,
  });
}