import assert from "node:assert/strict";
import test from "node:test";
import {
  listBusinessEventContracts,
  normalizeBusinessEventKey,
} from "@/domains/event/catalog/business-event-catalog";
import {
  listProjectionBuilders,
  listProjectionBuildersForEvent,
} from "./projection.registry";

test("every event that declares the projection consumer has a matching builder", () => {
  const uncovered = listBusinessEventContracts()
    .filter((contract) => contract.knownConsumers?.includes("projection"))
    .filter((contract) =>
      listProjectionBuildersForEvent({
        eventKey: contract.key,
        targetType: contract.targetType,
      }).length === 0,
    )
    .map((contract) => `${contract.key}:${contract.targetType}`);

  assert.deepEqual(uncovered, []);
});

test("every projection builder subscription is catalogued and allows projection", () => {
  const contracts = new Map(
    listBusinessEventContracts().map((contract) => [contract.key, contract]),
  );
  const invalidSubscriptions = listProjectionBuilders().flatMap((builder) =>
    (builder.sourceEvents ?? []).flatMap((sourceEvent) => {
      const eventKey = normalizeBusinessEventKey(sourceEvent);
      const contract = contracts.get(eventKey);
      if (!contract) return [`${builder.key}:${eventKey}:EVENT_NOT_CATALOGUED`];
      if (!contract.knownConsumers?.includes("projection")) {
        return [`${builder.key}:${eventKey}:PROJECTION_NOT_ALLOWED`];
      }
      return [];
    }),
  );

  assert.deepEqual(invalidSubscriptions, []);
});
