import assert from "node:assert/strict";
import test from "node:test";
import type { CoordinationTechnicalIssueBoardItemDTO as Item } from "../server/coordination-dashboard.types";
import { technicalIssueListRows } from "./technical-issue-list";

const issue = (id: string, values: Partial<Item> = {}): Item => ({
  id, serviceRequestId: "sr", summary: id, note: null, area: null, actionMode: null,
  vendorId: null, vendorName: null, estimatedCost: null, expectedWorkingDays: null,
  expectedCompletionAt: null, completedAt: null, overdueDays: null, executionStatus: "OPEN",
  isConfirmed: false, priority: "NORMAL", technicalDetailCatalogId: null, processingDetails: [],
  commentCount: 0, mentionedMeCount: 0, unreadMentionCount: 0, stage: "INSPECT", actualCost: null,
  updatedAt: null, lastUpdatedBy: { label: "User", avatarUrl: null, isSystem: false },
  workspaceTaskItemId: null, srCaseTaskItemId: null, requestOrigin: "OTHER",
  serviceRequest: { refNo: null, productTitle: null, sku: null, imageUrl: null }, ...values,
});

test("stage isolation, urgent first and deterministic sorting without mutating shared board data", () => {
  const items = [issue("normal", { updatedAt: "2026-11-03T09:00:00Z" }), issue("urgent", { priority: "URGENT" }), issue("other", { stage: "DONE", priority: "URGENT" })];
  assert.deepEqual(technicalIssueListRows(items, "INSPECT", "PRIORITY").map(row => row.id), ["urgent", "normal"]);
  assert.deepEqual(items.map(row => row.id), ["normal", "urgent", "other"]);
  assert.deepEqual(technicalIssueListRows(items, "READY", "UPDATED"), []);
});

test("due sort places missing/invalid dates last; updated sort treats missing dates safely", () => {
  const items = [issue("missing"), issue("late", { expectedCompletionAt: "2026-11-05", updatedAt: "2026-11-02" }), issue("early", { expectedCompletionAt: "2026-11-03", updatedAt: "2026-11-03" }), issue("invalid", { expectedCompletionAt: "invalid" })];
  assert.deepEqual(technicalIssueListRows(items, "INSPECT", "DUE").map(row => row.id), ["early", "late", "invalid", "missing"]);
  assert.deepEqual(technicalIssueListRows(items, "INSPECT", "UPDATED").map(row => row.id), ["early", "late", "invalid", "missing"]);
});
