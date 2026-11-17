import assert from "node:assert/strict";
import test from "node:test";
import { personalWorkSavedMessage, personalWorkActionFailure } from "./calendar-save-result";

test("saved work and external sync have distinct truthful outcomes", () => {
  assert.match(personalWorkSavedMessage({ok:true,calendarSync:"SYNCED"}), /và Google Calendar/);
  assert.equal(personalWorkSavedMessage({ok:true,calendarSync:"NOT_LINKED"}), "Đã cập nhật công việc");
  assert.match(personalWorkSavedMessage({ok:true,calendarSync:"FAILED"}), /Đã lưu công việc\. Chưa đồng bộ/);
  assert.equal(personalWorkActionFailure(new Error("Không có quyền")), "Không có quyền");
  assert.match(personalWorkActionFailure(Object.assign(new Error("masked production failure"),{digest:"123"})), /tải lại danh sách/);
});
