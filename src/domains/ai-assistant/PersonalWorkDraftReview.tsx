"use client";
import React from "react";
import { reviewDate as date, reviewSchedule } from "./review-schedule";
import { Plus, Sparkles } from "lucide-react";
import PersonalWorkUpdateReview from "./PersonalWorkUpdateReview";
import {
  personalWorkDraftItems,
  type PersonalWorkDraft,
} from "./personal-work-contract";
export default function PersonalWorkDraftReview({
  draft,
  busy,
  onApprove,
  onEdit,
}: {
  draft: PersonalWorkDraft;
  busy: boolean;
  onApprove: () => void;
  onEdit?: () => void;
}) {
  const items = personalWorkDraftItems(draft),
    updates = draft.updates ? 1 + (draft.updates.additional?.length || 0) : 0,
    total = items.length + updates,
    hasCodex = items.some((d) => d.plan.codex);
  return (
    <section
      data-ben-review
      aria-label={
        updates
          ? "Duyệt tạo và cập nhật công việc"
          : items.length > 1
            ? "Duyệt nhiều việc"
            : "Duyệt lịch cá nhân"
      }
      aria-busy={busy}
      className="mt-4 rounded-2xl border border-violet-100 bg-white p-4 text-sm shadow-sm"
    >
      <header className="mb-3 flex items-center gap-3 border-b border-violet-50 pb-3">
        <Sparkles size={24} className="shrink-0 text-violet-500" />
        <div>
          <h3 className="font-semibold text-slate-900">
            Đề xuất {total} thay đổi
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">
            Kiểm tra trước khi lưu
          </p>
        </div>
      </header>
      {draft.updates && (
        <PersonalWorkUpdateReview draft={draft.updates} busy={busy} embedded />
      )}
      <div className="divide-y divide-slate-100">
        {items.map((item, index) => {
          const p = item.plan;
          return (
            <article key={index} className="flex gap-3 py-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-500">
                <Plus size={22} />
              </span>
              <div className="min-w-0 flex-1">
                <h4 className="break-words font-semibold text-slate-900">
                  {p.title}
                </h4>
                <p className="mt-1 text-xs text-slate-500">
                  {p.kind === "EVENT" ? "Sự kiện mới" : "Tạo mới"} ·{" "}
                  {item.categoryLabel}
                </p>
                <p className="mt-2">
                  <span className="inline-block rounded-lg bg-violet-50 px-2 py-1 text-xs leading-5 text-violet-800">
                    {reviewSchedule(p.dueAt, p.scheduledEndAt)}
                  </span>
                </p>
                {item.assignee && (
                  <p className="mt-2 text-xs">
                    Giao {item.assignee.name || item.assignee.id} · có thể cập
                    nhật
                  </p>
                )}
                {p.dueAt &&
                  p.reminderMinutes !== undefined &&
                  p.reminderMinutes !== 0 && (
                    <p className="mt-1 text-xs text-slate-500">
                      {p.reminderMinutes === null
                        ? "Không nhắc lịch"
                        : `Nhắc trước ${p.reminderMinutes} phút`}
                    </p>
                  )}
                {p.priority !== "MEDIUM" && (
                  <p className="mt-1 text-xs text-slate-500">
                    Ưu tiên:{" "}
                    {{ LOW: "Thấp", HIGH: "Cao", URGENT: "Khẩn" }[p.priority]}
                  </p>
                )}
                {p.codex && (
                  <p className="mt-2 text-xs font-medium text-violet-700">
                    Codex ·{" "}
                    {p.codex.startAt
                      ? "Bắt đầu từ " + date(p.codex.startAt)
                      : "Chạy ngay khi worker sẵn sàng"}{" "}
                    (giờ Việt Nam)
                  </p>
                )}
                {p.checklist.length > 0 && (
                  <ul className="mt-2 list-disc pl-4 text-xs leading-5">
                    {p.checklist.map((title, i) => (
                      <li key={i}>{title}</li>
                    ))}
                  </ul>
                )}
                {p.note && (
                  <p className="mt-2 whitespace-pre-wrap text-xs leading-5">
                    {p.note}
                  </p>
                )}
                {item.shares.length > 0 && (
                  <p className="mt-2 text-xs text-slate-500">
                    Chia sẻ:{" "}
                    {item.shares
                      .map(
                        (s) =>
                          `${s.name || s.id} (${s.accessLevel === "EDITOR" ? "Có thể sửa" : "Chỉ xem"})`,
                      )
                      .join(", ")}
                  </p>
                )}
                {p.tags.length > 0 && (
                  <p className="mt-1 text-xs text-slate-500">
                    {p.tags.join(" · ")}
                  </p>
                )}
                {item.calendarTargets?.length ? (
                  <p className="mt-1 text-xs text-slate-500">
                    Đồng bộ Google:{" "}
                    {item.calendarTargets
                      .map((t) => t.name || "Tài khoản đã kết nối")
                      .join(", ")}
                  </p>
                ) : null}
                {p.kind === "EVENT" && (
                  <p className="mt-1 text-xs text-slate-500">
                    Sự kiện không cần hoàn thành.
                  </p>
                )}
              </div>
            </article>
          );
        })}
      </div>
      <button
        data-ben-approve
        type="button"
        disabled={busy}
        onClick={onApprove}
        className="mt-3 min-h-11 w-full rounded-xl bg-violet-600 px-4 py-2.5 font-semibold text-white disabled:opacity-50"
      >
        {busy
          ? "Đang lưu…"
          : `Duyệt ${total} thay đổi${hasCodex ? " · Giao Codex" : ""}`}
      </button>
      {onEdit && (
        <button
          type="button"
          disabled={busy}
          onClick={onEdit}
          className="mt-2 min-h-10 w-full rounded-xl text-sm font-medium text-violet-600 hover:bg-violet-50 disabled:opacity-50"
        >
          Chỉnh lại
        </button>
      )}
    </section>
  );
}
