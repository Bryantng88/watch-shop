import assert from "node:assert/strict";
import test from "node:test";
import { reviewConfirmation, reviewBindingSchema } from "./review-approval";
import { currentReview } from "./server/review-approval";
import { newConversation } from "./simulation";
test("only standalone explicit review commands approve; negation, quotes, conditions and questions stay chat", () => {
  for (const text of [
    "duyệt",
    " DUYỆT! ",
    "ok",
    "ok bạn",
    "okay",
    "oke",
    "đồng ý",
    "xác nhận",
    "duyệt hết",
    "go ahead",
  ])
    assert.deepEqual(reviewConfirmation(text), { count: null });
  assert.deepEqual(reviewConfirmation("duyệt 2 thay đổi"), { count: 2 });
  for (const text of [
    "không duyệt",
    "đừng duyệt",
    "ok nhưng đổi giờ",
    "ok, bỏ việc mới",
    "tôi đã nói ok",
    "khách nhắn duyệt",
    '"duyệt"',
    "“ok”",
    "duyệt?",
    "ok bạn nhé nếu mai rảnh",
    "duyệt CV25",
    "",
    "nếu nhắn ok thì sao?",
  ])
    assert.equal(reviewConfirmation(text), null, text);
  assert.equal(
    reviewBindingSchema.safeParse({
      kind: "personal-work",
      revision: 1,
      token: "a".repeat(64),
      actorId: "forged",
    }).success,
    false,
  );
});
test("review bindings are stable across JSONB key order, change with content, and reject ambiguous or inactive reviews", () => {
  const s = newConversation(null);
  s.permissionRequest = { revision: 2, summary: "A current support request" };
  const a = currentReview(s, 2, "NEEDS_INFO", false, null)!;
  assert.equal(a.kind, "permission-support");
  assert.equal(a.operations, 1);
  const reordered = {
    ...s,
    permissionRequest: { summary: s.permissionRequest.summary, revision: 2 },
  };
  assert.equal(
    currentReview(reordered, 2, "NEEDS_INFO", false, null)!.token,
    a.token,
  );
  assert.notEqual(
    currentReview(
      { ...s, permissionRequest: { revision: 2, summary: "Changed request" } },
      2,
      "NEEDS_INFO",
      false,
      null,
    )!.token,
    a.token,
  );
  for (const status of ["RUNNING", "QUEUED", "FAILED", "CANCELLED"])
    assert.equal(currentReview(s, 2, status, false, null), null);
  assert.equal(currentReview(s, 3, "NEEDS_INFO", false, null), null);
  s.personalWorkUpdateDraft = {
    revision: 2,
    title: "Existing",
    kind: "TASK",
    requiredPermissions: ["TASK_VIEW"],
    requiredTaskIds: ["one"],
    plan: {
      itemId: "one",
      expectedUpdatedAt: "2026-11-12T00:00:00Z",
      fields: ["status"],
      changes: {
        title: null,
        note: null,
        dueAt: null,
        scheduledEndAt: null,
        status: "DONE",
      },
    },
  };
  assert.equal(
    currentReview(s, 2, "NEEDS_INFO", false, null),
    null,
    "More than one review is not text actionable",
  );
  delete s.permissionRequest;
  assert.equal(
    currentReview(s, 2, "NEEDS_INFO", false, null)!.kind,
    "personal-update",
  );
});
