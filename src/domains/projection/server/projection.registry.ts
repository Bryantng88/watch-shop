import type { ProjectionBuilder } from "./projection.types";
import { watchMediaQueueProjectionBuilder } from "./watch-media-queue.projection";
import { watchListProjectionBuilder } from "./watch-list";
import { hasOperationalProjectionSubscriptionForEvent } from "./operation-projection-subscriptions";
import { paymentOwnerSummaryProjectionBuilder } from "./payment-owner-summary.projection";
import { acquisitionListProjectionBuilder } from "./acquisition-list";
import { shipmentOperationQueueProjectionBuilder } from "./shipment-operation-queue.projection";
import { orderListProjectionBuilder } from "./order-list.projection";
import { orderDetailProjectionBuilder } from "./order-detail.projection";
import { technicalIssueBoardProjectionBuilder } from "./technical-issue-board.projection";
import { paymentListProjectionBuilder } from "./payment-list.projection";
import { mediaOperationBoardProjectionBuilder } from "./media-operation-board.projection";
import { coordinationWorkspaceSummaryProjectionBuilder } from "./coordination-workspace-summary.projection";
import { adminDashboardSummaryProjectionBuilder } from "./admin-dashboard-summary.projection";
import { serviceRequestListProjectionBuilder } from "./service-request-list.projection";
import { normalizeBusinessEventKey } from "@/domains/event/contract/business-event-contract.helpers";

const PROJECTION_BUILDERS: ProjectionBuilder[] = [
  watchMediaQueueProjectionBuilder,
  watchListProjectionBuilder,
  paymentOwnerSummaryProjectionBuilder,
  acquisitionListProjectionBuilder,
  shipmentOperationQueueProjectionBuilder,
  orderListProjectionBuilder,
  orderDetailProjectionBuilder,
  technicalIssueBoardProjectionBuilder,
  paymentListProjectionBuilder,
  mediaOperationBoardProjectionBuilder,
  coordinationWorkspaceSummaryProjectionBuilder,
  adminDashboardSummaryProjectionBuilder,
  serviceRequestListProjectionBuilder,
];

function clean(value: unknown) {
  return String(value ?? "").trim();
}

function normalizeKey(value: unknown) {
  return clean(value).toLowerCase();
}

function normalizeEventKey(value: unknown) {
  return normalizeBusinessEventKey(value);
}

export function listProjectionBuilders() {
  return PROJECTION_BUILDERS;
}

export function getProjectionBuilder(key: unknown) {
  const normalized = normalizeKey(key);
  if (!normalized) return null;

  return (
    PROJECTION_BUILDERS.find((builder) => normalizeKey(builder.key) === normalized) ??
    null
  );
}

export function listProjectionBuildersForEvent(input: {
  eventKey: unknown;
  targetType: unknown;
}) {
  const eventKey = normalizeEventKey(input.eventKey);
  const targetType = clean(input.targetType).toUpperCase();

  return PROJECTION_BUILDERS.filter((builder) => {
    const subscriptionMatches = hasOperationalProjectionSubscriptionForEvent({
      projectionKey: builder.key,
      eventKey,
    });
    const eventMatches =
      subscriptionMatches ||
      !builder.sourceEvents?.length ||
      builder.sourceEvents.map(normalizeEventKey).includes(eventKey);
    const targetMatches =
      subscriptionMatches ||
      !builder.targetTypes?.length ||
      builder.targetTypes.map((item) => clean(item).toUpperCase()).includes(targetType);

    return eventMatches && targetMatches;
  });
}
