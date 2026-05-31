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

  const panel = await getTechnicalAssessmentPanel(id).catch(() => null);
  if (!panel) return null;

  const [technicalSummary, issueBoard] = await Promise.all([
    getServiceRequestTechnicalSummary(id),
    getTechnicalIssueBoardData({ serviceRequestId: id }),
  ]);

  return serialize({
    detail: {
      ...panel,
      technicalSummary,
    },
    issueBoard,
  });
}
