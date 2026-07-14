import {
  ServiceRequestStatus,
  TechnicalIssueExecutionStatus,
  WatchServiceStage,
} from "@prisma/client";

import { prisma } from "@/server/db/client";

const APPLY = process.argv.includes("--apply");

const ACTIVE_SERVICE_STATUSES = [
  ServiceRequestStatus.DRAFT,
  ServiceRequestStatus.DIAGNOSING,
  ServiceRequestStatus.WAIT_APPROVAL,
  ServiceRequestStatus.IN_PROGRESS,
] as const;

const DONE_SERVICE_STATUSES = [
  ServiceRequestStatus.COMPLETED,
  ServiceRequestStatus.DELIVERED,
] as const;

function isActiveIssue(status: TechnicalIssueExecutionStatus | null | undefined) {
  return (
    status !== TechnicalIssueExecutionStatus.DONE &&
    status !== TechnicalIssueExecutionStatus.CANCELED
  );
}

function resolveStage(input: {
  serviceRequests: Array<{
    status: ServiceRequestStatus;
    technicalIssue: Array<{ executionStatus: TechnicalIssueExecutionStatus }>;
  }>;
}) {
  const activeRequests = input.serviceRequests.filter((request) =>
    ACTIVE_SERVICE_STATUSES.includes(request.status as (typeof ACTIVE_SERVICE_STATUSES)[number]),
  );

  if (activeRequests.length > 0) {
    const hasActiveIssue = activeRequests.some((request) =>
      request.technicalIssue.some((issue) => isActiveIssue(issue.executionStatus)),
    );

    return hasActiveIssue ? WatchServiceStage.IN_SERVICE : WatchServiceStage.PENDING;
  }

  const hasDoneRequest = input.serviceRequests.some((request) =>
    DONE_SERVICE_STATUSES.includes(request.status as (typeof DONE_SERVICE_STATUSES)[number]),
  );

  return hasDoneRequest ? WatchServiceStage.DONE : null;
}

async function main() {
  const products = await prisma.product.findMany({
    where: {
      serviceRequest: {
        some: {
          productId: { not: null },
          status: {
            in: [
              ...ACTIVE_SERVICE_STATUSES,
              ...DONE_SERVICE_STATUSES,
            ],
          },
        },
      },
      watch: {
        isNot: null,
      },
    },
    select: {
      id: true,
      title: true,
      sku: true,
      watch: {
        select: {
          id: true,
          serviceStage: true,
        },
      },
      serviceRequest: {
        where: {
          status: {
            in: [
              ...ACTIVE_SERVICE_STATUSES,
              ...DONE_SERVICE_STATUSES,
            ],
          },
        },
        select: {
          id: true,
          refNo: true,
          status: true,
          technicalIssue: {
            select: {
              executionStatus: true,
            },
          },
        },
        orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
      },
    },
  });

  const changes = products
    .map((product) => {
      const nextStage = resolveStage({
        serviceRequests: product.serviceRequest,
      });
      const watch = product.watch;

      if (!watch || !nextStage || watch.serviceStage === nextStage) return null;

      return {
        productId: product.id,
        watchId: watch.id,
        title: product.title,
        sku: product.sku,
        from: watch.serviceStage,
        to: nextStage,
        serviceRequests: product.serviceRequest.map((request) => ({
          id: request.id,
          refNo: request.refNo,
          status: request.status,
          activeIssues: request.technicalIssue.filter((issue) =>
            isActiveIssue(issue.executionStatus),
          ).length,
        })),
      };
    })
    .filter(Boolean);

  console.log(
    `[repair-watch-service-stage] mode=${APPLY ? "apply" : "dry-run"} changes=${changes.length}`,
  );

  for (const change of changes) {
    if (!change) continue;

    console.log(
      [
        `watch=${change.watchId}`,
        `product=${change.productId}`,
        `sku=${change.sku ?? "-"}`,
        `${change.from}->${change.to}`,
        `title=${change.title ?? "-"}`,
      ].join(" | "),
    );

    if (APPLY) {
      await prisma.watch.update({
        where: { id: change.watchId },
        data: {
          serviceStage: change.to,
          updatedAt: new Date(),
        },
      });
    }
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
