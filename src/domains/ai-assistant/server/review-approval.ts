import { createHash } from "node:crypto";
import type { Conversation } from "../simulation";
import { personalWorkDraftItems } from "../personal-work-contract";
import type { PendingReview, ReviewBinding } from "../review-approval";
function canonical(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, v]) => v !== undefined)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => [k, canonical(v)]),
    );
  return value;
}
export function currentReview(
  s: Conversation,
  revision: number,
  status: string,
  approved: boolean,
  plan: unknown,
): PendingReview | null {
  if (!["DRAFT", "NEEDS_INFO"].includes(status)) return null;
  const choices: {
    kind: PendingReview["kind"];
    operations: number;
    label: string;
    value: unknown;
  }[] = [];
  if (s.personalWorkDraft?.revision === revision) {
    const d = s.personalWorkDraft;
    choices.push({
      kind: "personal-work",
      operations:
        personalWorkDraftItems(d).length +
        (d.updates ? 1 + (d.updates.additional?.length || 0) : 0),
      label: "thay đổi công việc",
      value: d,
    });
  }
  if (s.personalWorkUpdateDraft?.revision === revision)
    choices.push({
      kind: "personal-update",
      operations: 1 + (s.personalWorkUpdateDraft.additional?.length || 0),
      label: "cập nhật công việc",
      value: s.personalWorkUpdateDraft,
    });
  if (s.orderDraft?.revision === revision && status === "DRAFT")
    choices.push({
      kind: "order",
      operations: 1,
      label: "đơn nháp",
      value: s.orderDraft,
    });
  if (s.orderServicesDraft?.revision === revision && status === "DRAFT")
    choices.push({
      kind: "order-services",
      operations: s.orderServicesDraft.rows.length,
      label: "dịch vụ bổ sung",
      value: s.orderServicesDraft,
    });
  if (s.mediaPostDraft?.revision === revision)
    choices.push({
      kind: "media-post",
      operations: 1,
      label: "post nháp",
      value: s.mediaPostDraft,
    });
  if (s.permissionRequest?.revision === revision)
    choices.push({
      kind: "permission-support",
      operations: 1,
      label: "yêu cầu hỗ trợ",
      value: s.permissionRequest,
    });
  if (
    s.customerRequest?.status === "DRAFT" &&
    s.customerRequest.reviewReady &&
    !approved &&
    status === "DRAFT" &&
    plan
  )
    choices.push({
      kind: "business",
      operations: s.customerRequest.conditions.length,
      label: "việc được giao",
      value: { request: s.customerRequest, plan },
    });
  if (s.codeDraft?.revision === revision)
    choices.push({
      kind: "code",
      operations: 1,
      label: "yêu cầu sửa code",
      value: s.codeDraft,
    });
  if (choices.length !== 1) return null;
  const { kind, operations, label, value } = choices[0];
  return {
    kind,
    revision,
    operations,
    label,
    token: createHash("sha256")
      .update(JSON.stringify(canonical({ kind, revision, value })))
      .digest("hex"),
  };
}
export function sameReview(a: ReviewBinding, b: ReviewBinding) {
  return a.kind === b.kind && a.revision === b.revision && a.token === b.token;
}
