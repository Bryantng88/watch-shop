import { operationalBlueprintForWorkType } from "@/domains/blueprint/shared/operational-blueprint";
import { listProjectionBuildersForEvent } from "@/domains/projection/server/projection.registry";
import {
  listOperationalProjectionSubscriptions,
  listOperationalProjectionSubscriptionsForEvent,
} from "@/domains/projection/server/operation-projection-subscriptions";

const expectedEvents = [
  "service_request.created",
  "service_request.status_changed",
  "technical_issue.created",
  "technical_issue.confirmed",
  "technical_issue.started",
  "technical_issue.completed",
  "payment.created",
  "payment.status_updated",
] as const;

const eventTargetTypes: Record<string, string> = {
  "service_request.created": "SERVICE_REQUEST",
  "service_request.status_changed": "SERVICE_REQUEST",
  "technical_issue.created": "TECHNICAL_ISSUE",
  "technical_issue.confirmed": "TECHNICAL_ISSUE",
  "technical_issue.started": "TECHNICAL_ISSUE",
  "technical_issue.completed": "TECHNICAL_ISSUE",
  "payment.created": "PAYMENT",
  "payment.status_updated": "PAYMENT",
};

function fail(message: string): never {
  throw new Error(`[sprint-75-verify] ${message}`);
}

function main() {
  const contract = operationalBlueprintForWorkType({
    workTypeKey: "service-operation",
    coordinationContext: "TECHNICAL",
  });
  const watchList = contract?.projectionSubscriptions.find(
    (subscription) => subscription.projectionKey === "watch-list",
  );

  if (!watchList) fail("missing watch-list projection subscription");

  const allMatches = listOperationalProjectionSubscriptions({
    projectionKey: "watch-list",
  });
  if (!allMatches.some((match) => match.operationKey === contract?.key)) {
    fail("subscription list did not include service-operation");
  }

  for (const eventKey of expectedEvents) {
    if (!watchList.eventKeys.includes(eventKey)) {
      fail(`watch-list subscription missing ${eventKey}`);
    }

    const matches = listOperationalProjectionSubscriptionsForEvent({
      projectionKey: "watch-list",
      eventKey,
    });
    if (!matches.length) {
      fail(`subscription registry did not match ${eventKey}`);
    }

    const builders = listProjectionBuildersForEvent({
      eventKey,
      targetType: eventTargetTypes[eventKey],
    });
    if (!builders.some((builder) => builder.key === "watch-list")) {
      fail(`projection registry did not select watch-list for ${eventKey}`);
    }
  }

  const paymentBuilders = listProjectionBuildersForEvent({
    eventKey: "payment.created",
    targetType: "PAYMENT",
  });
  if (!paymentBuilders.some((builder) => builder.key === "payment-list")) {
    fail("projection registry did not select payment-list for payment.created");
  }

  const mediaBuilders = listProjectionBuildersForEvent({
    eventKey: "watch.media.asset.attached",
    targetType: "WATCH",
  });
  for (const projectionKey of ["watch-media-queue", "media-operation-board"]) {
    if (!mediaBuilders.some((builder) => builder.key === projectionKey)) {
      fail(`projection registry did not select ${projectionKey} for watch.media.asset.attached`);
    }
  }

  const commentBuilders = listProjectionBuildersForEvent({
    eventKey: "task.item.activity.commented",
    targetType: "TASK_ITEM",
  });
  for (const projectionKey of ["technical-issue-board", "media-operation-board"]) {
    if (!commentBuilders.some((builder) => builder.key === projectionKey)) {
      fail(`projection registry did not select ${projectionKey} for task.item.activity.commented`);
    }
  }

  console.log("[sprint-75-verify] ok");
}

main();
