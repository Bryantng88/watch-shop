import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  personalWorkPlansSchema,
  personalWorkDraftItems,
  type PersonalWorkDraft,
} from "./personal-work-contract";
import Review from "./PersonalWorkDraftReview";
const first = {
  kind: "TASK",
  title: "Lấy con Bell về từ thầy Long",
  note: null,
  categoryKey: "GENERAL",
  workType: null,
  dueAt: "2026-11-11T16:00:00+07:00",
  scheduledEndAt: null,
  tags: [],
  shares: [],
  priority: "MEDIUM",
  checklist: [],
  syncGoogle: false,
};
const second = {
  ...first,
  title: "Khảo sát số hóa hậu cần",
  dueAt: "2026-11-12T14:00:00+07:00",
};
test("batch keeps independent task schedules and rejects incomplete or oversized proposals", () => {
  const batch = personalWorkPlansSchema.parse([first, second]);
  assert.equal(batch.length, 2);
  assert.equal(batch[1].dueAt, second.dueAt);
  assert.equal(personalWorkPlansSchema.safeParse([first]).success, false);
  assert.equal(
    personalWorkPlansSchema.safeParse(Array(9).fill(first)).success,
    false,
  );
  assert.equal(
    personalWorkPlansSchema.safeParse([first, { ...second, title: "" }])
      .success,
    false,
  );
});
test("one compact review shows every item and one approval; saved single-item drafts remain readable", () => {
  const plans = personalWorkPlansSchema.parse([first, second]);
  const items = plans.map((plan) => ({
    revision: 1,
    plan,
    categoryLabel: "Cá nhân",
    shares: [],
  }));
  const draft: PersonalWorkDraft = { ...items[0], items };
  assert.equal(personalWorkDraftItems(draft).length, 2);
  const html = renderToStaticMarkup(
    createElement(Review, { draft, busy: false, onApprove: () => {} }),
  );
  assert.ok(html.includes(first.title));
  assert.ok(html.includes(second.title));
  assert.equal((html.match(/<button/g) || []).length, 1);
  assert.ok(html.includes("Duyệt 2 thay đổi"));
  assert.equal(personalWorkDraftItems(items[0]).length, 1);
});

test("combined move-and-create review shows both operations with one approval", () => {
  const plan = personalWorkPlansSchema.parse([first, second])[0];
  const draft: PersonalWorkDraft = {
    revision: 4,
    plan: { ...plan, title: "Thêm trang quản lý khách hàng + vendor" },
    categoryLabel: "WatchShop",
    shares: [],
    updates: {
      revision: 4,
      title: "BCPA: Bảo trì website",
      code: "CV-25",
      kind: "TASK",
      requiredPermissions: ["TASK_VIEW"],
      requiredTaskIds: ["existing"],
      plan: {
        itemId: "existing",
        expectedUpdatedAt: "2026-11-12T06:00:00Z",
        fields: ["dueAt", "scheduledEndAt"],
        changes: {
          title: null,
          note: null,
          status: null,
          dueAt: "2026-11-13T13:30:00+07:00",
          scheduledEndAt: "2026-11-13T16:30:00+07:00",
        },
      },
    },
  };
  let approvals = 0;
  const html = renderToStaticMarkup(
    createElement(Review, {
      draft,
      busy: false,
      onApprove: () => {
        approvals++;
      },
    }),
  );
  assert.ok(html.includes("CV-25"));
  assert.ok(html.includes("BCPA: Bảo trì website"));
  assert.ok(html.includes("Thêm trang quản lý khách hàng + vendor"));
  assert.ok(html.includes("13:30"));
  assert.ok(html.includes("16:30"));
  assert.equal((html.match(/<button/g) || []).length, 1);
  assert.ok(html.includes("Duyệt 2 thay đổi"));
  assert.equal(approvals, 0);
});
