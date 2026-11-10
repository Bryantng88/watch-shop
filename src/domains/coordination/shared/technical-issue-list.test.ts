import assert from "node:assert/strict";
import test from "node:test";
import type { CoordinationTechnicalIssueBoardItemDTO as Item } from "../server/coordination-dashboard.types";
import { technicalIssueListRows } from "./technical-issue-list";

const issue = (id: string, values: Partial<Item> = {}): Item => ({
  id,
  serviceRequestId: "sr",
  summary: id,
  note: null,
  area: null,
  actionMode: null,
  vendorId: null,
  vendorName: null,
  estimatedCost: null,
  expectedWorkingDays: null,
  expectedCompletionAt: null,
  completedAt: null,
  overdueDays: null,
  executionStatus: "OPEN",
  isConfirmed: false,
  priority: "NORMAL",
  technicalDetailCatalogId: null,
  processingDetails: [],
  commentCount: 0,
  mentionedMeCount: 0,
  unreadMentionCount: 0,
  stage: "INSPECT",
  actualCost: null,
  updatedAt: null,
  lastUpdatedBy: { label: "User", avatarUrl: null, isSystem: false },
  workspaceTaskItemId: null,
  srCaseTaskItemId: null,
  requestOrigin: "OTHER",
  serviceRequest: {
    refNo: null,
    productTitle: null,
    sku: null,
    imageUrl: null,
  },
  ...values,
});

test("stage isolation, urgent first and deterministic sorting without mutating shared board data", () => {
  const items = [
    issue("normal", { updatedAt: "2026-11-03T09:00:00Z" }),
    issue("urgent", { priority: "URGENT" }),
    issue("other", { stage: "DONE", priority: "URGENT" }),
  ];
  assert.deepEqual(
    technicalIssueListRows(items, "INSPECT", "PRIORITY").map((row) => row.id),
    ["urgent", "normal"],
  );
  assert.deepEqual(
    items.map((row) => row.id),
    ["normal", "urgent", "other"],
  );
  assert.deepEqual(technicalIssueListRows(items, "READY", "UPDATED"), []);
});

test("due sort places missing/invalid dates last; updated sort treats missing dates safely", () => {
  const items = [
    issue("missing"),
    issue("late", {
      expectedCompletionAt: "2026-11-05",
      updatedAt: "2026-11-02",
    }),
    issue("early", {
      expectedCompletionAt: "2026-11-03",
      updatedAt: "2026-11-03",
    }),
    issue("invalid", { expectedCompletionAt: "invalid" }),
  ];
  assert.deepEqual(
    technicalIssueListRows(items, "INSPECT", "DUE").map((row) => row.id),
    ["early", "late", "invalid", "missing"],
  );
  assert.deepEqual(
    technicalIssueListRows(items, "INSPECT", "UPDATED").map((row) => row.id),
    ["early", "late", "invalid", "missing"],
  );
});

test("open scope excludes history; attention filters do not turn completed lateness into current overdue work", async () => {
  const {
    technicalIssueListLoadTarget,
    technicalIssuePrimaryMove,
    technicalIssueMatches,
    technicalIssueLayoutUrl,
  } = await import("./technical-issue-list");
  const items = [
    issue("late", {
      stage: "PROCESSING",
      overdueDays: 2,
      priority: "URGENT",
      unreadMentionCount: 1,
      summary: "Kiểm tra máy",
      serviceRequest: {
        refNo: "SR-123",
        productTitle: "Seiko LM Special",
        sku: "SK-01",
        imageUrl: null,
      },
    }),
    issue("ready", { stage: "READY" }),
    issue("done", { stage: "DONE", overdueDays: 3 }),
  ];
  assert.deepEqual(
    technicalIssueListRows(items, "OPEN", "PRIORITY").map((i) => i.id),
    ["late", "ready"],
  );
  assert.deepEqual(
    technicalIssueListRows(items, "OPEN", "DUE", "OVERDUE").map((i) => i.id),
    ["late"],
  );
  assert.deepEqual(technicalIssueListRows(items, "DONE", "DUE", "OVERDUE"), []);
  assert.deepEqual(
    technicalIssueListRows(items, "OPEN", "UPDATED", "MENTIONED").map(
      (i) => i.id,
    ),
    ["late"],
  );
  assert.equal(technicalIssueMatches(items[0], "kiem may seiko SR-123"), true);
  assert.equal(technicalIssueMatches(items[0], "citizen"), false);
  const pagination = {
    INSPECT: { loaded: 20, total: 20, hasMore: false, nextPage: null },
    READY: { loaded: 10, total: 30, hasMore: true, nextPage: 2 },
    DONE: { loaded: 10, total: 40, hasMore: true, nextPage: 2 },
  };
  assert.equal(technicalIssueListLoadTarget("OPEN", pagination), "READY");
  assert.equal(technicalIssueListLoadTarget("DONE", pagination), "DONE");
  assert.equal(technicalIssueListLoadTarget("INSPECT", pagination), null);
  const options = [
    { stage: "INSPECT" as const, label: "Quay lại" },
    { stage: "DONE" as const, label: "Hoàn tất" },
    { stage: "PROCESSING" as const, label: "Bắt đầu" },
  ];
  assert.equal(
    technicalIssuePrimaryMove("READY", options)?.stage,
    "PROCESSING",
  );
  assert.equal(technicalIssuePrimaryMove("DONE", options), null);
  const url = technicalIssueLayoutUrl(
    "https://example.test/admin/coordination/operation?view=technical-issue-flow&date=2026-11-10&flowQuery=seiko#issue",
    "list",
  );
  assert.equal(new URL(url).searchParams.get("tiLayout"), "list");
  assert.equal(new URL(url).searchParams.get("flowQuery"), "seiko");
  assert.equal(new URL(url).hash, "#issue");
  const board = new URL(technicalIssueLayoutUrl(url, "board"));
  assert.equal(board.searchParams.has("tiLayout"), false);
  assert.equal(board.searchParams.get("date"), "2026-11-10");
});

test("the technical List switch keeps the TI engine, not the generic workspace task list", async () => {
  const { technicalIssueViewSelection } = await import(
    "./technical-issue-list"
  );
  assert.deepEqual(
    technicalIssueViewSelection("technical-issue-flow", "LIST"),
    { engine: "TI_BOARD", layout: "list" },
  );
  assert.deepEqual(
    technicalIssueViewSelection("technical-issue-flow", "TI_BOARD"),
    { engine: "TI_BOARD", layout: "board" },
  );
  assert.equal(
    technicalIssueViewSelection("media-production-flow", "LIST"),
    null,
  );
});
