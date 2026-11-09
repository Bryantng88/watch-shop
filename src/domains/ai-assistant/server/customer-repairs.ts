import type { DB } from "@/server/db/client";

export async function findCustomerRepairs(db: DB, query: string) {
  const terms = query.trim().split(/\s+/).slice(0, 6);
  const rows = await db.serviceRequest.findMany({
    where: {
      scope: "CUSTOMER_OWNED",
      status: { in: ["DRAFT", "DIAGNOSING", "WAIT_APPROVAL", "IN_PROGRESS", "COMPLETED"] },
      AND: terms.map(term => ({
        OR: [
          { brandSnapshot: { contains: term, mode: "insensitive" } },
          { modelSnapshot: { contains: term, mode: "insensitive" } },
          { refSnapshot: { contains: term, mode: "insensitive" } },
          { refNo: { equals: term, mode: "insensitive" } },
        ],
      })),
    },
    orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
    take: 7,
    select: {
      id: true, refNo: true, brandSnapshot: true, modelSnapshot: true, status: true,
      technicalIssue: {
        where: { executionStatus: { not: "CANCELED" } },
        orderBy: [{ openedAt: "desc" }, { id: "asc" }],
        take: 3,
        select: { executionStatus: true, expectedCompletionAt: true },
      },
    },
  });
  return {
    matches: rows.slice(0, 6).map(({ id, technicalIssue, ...row }) => ({
      ...row, issues: technicalIssue, href: "/admin/services/issues-board?serviceRequestId=" + encodeURIComponent(id),
    })),
    truncated: rows.length > 6,
  };
}
