import assert from "node:assert/strict";
import test from "node:test";

import { requiresTechnicalIssueVendorChangeNote } from "./technical-issue-vendor-policy";

test("initial vendor assignment while starting processing does not require a reason", () => {
  assert.equal(
    requiresTechnicalIssueVendorChangeNote({
      executionStatus: "CONFIRMED",
      currentVendorId: null,
      nextVendorId: "vendor-a",
    }),
    false,
  );
});

test("changing vendor while already processing requires a reason", () => {
  assert.equal(
    requiresTechnicalIssueVendorChangeNote({
      executionStatus: "IN_PROGRESS",
      currentVendorId: "vendor-a",
      nextVendorId: "vendor-b",
    }),
    true,
  );
});

test("keeping the same vendor while already processing does not require a reason", () => {
  assert.equal(
    requiresTechnicalIssueVendorChangeNote({
      executionStatus: "PROCESSING",
      currentVendorId: "vendor-a",
      nextVendorId: "vendor-a",
    }),
    false,
  );
});

test("assigning a vendor after processing has begun is a vendor change", () => {
  assert.equal(
    requiresTechnicalIssueVendorChangeNote({
      executionStatus: "IN_PROGRESS",
      currentVendorId: null,
      nextVendorId: "vendor-a",
    }),
    true,
  );
});
