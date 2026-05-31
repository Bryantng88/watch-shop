import { ProductStatus, ServiceRequestStatus } from "@prisma/client";

export const OPEN_SERVICE_STATUSES = [
  ServiceRequestStatus.DRAFT,
  ServiceRequestStatus.DIAGNOSING,
  ServiceRequestStatus.WAIT_APPROVAL,
  ServiceRequestStatus.IN_PROGRESS,
] as const;

export function canMoveProductToService(status: ProductStatus) {
  return status === ProductStatus.AVAILABLE;
}

export function canCompleteServiceStatus(status: ServiceRequestStatus) {
  return status !== ServiceRequestStatus.CANCELED;
}
