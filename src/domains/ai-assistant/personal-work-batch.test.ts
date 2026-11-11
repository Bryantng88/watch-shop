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
  assert.ok(html.includes("Tạo 2 mục"));
  assert.equal(personalWorkDraftItems(items[0]).length, 1);
});
