"use client";
import React from "react";
import {
  personalWorkDraftItems,
  type PersonalWorkDraft,
} from "./personal-work-contract";
const date = (value: string) =>
  new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
export default function PersonalWorkDraftReview({
  draft,
  busy,
  onApprove,
}: {
  draft: PersonalWorkDraft;
  busy: boolean;
  onApprove: () => void;
}) {
  const items = personalWorkDraftItems(draft),
    multiple = items.length > 1,
    hasCodex = items.some((d) => d.plan.codex);
  return (
    <section
      aria-label={multiple ? "Duyệt nhiều việc" : "Duyệt lịch cá nhân"}
      className="mt-4 rounded-2xl border border-blue-200 bg-white p-4 text-sm"
      aria-busy={busy}
    >
      {multiple && (
        <h3 className="mb-2 font-semibold">Tạo {items.length} mục</h3>
      )}
      <div className="divide-y divide-slate-100">
        {items.map((item, index) => {
          const p = item.plan;
          return (
            <article key={index} className={multiple ? "py-3" : ""}>
              <h4 className="font-semibold">
                {multiple ? `${index + 1}. ` : ""}
                {p.kind === "EVENT" ? "Sự kiện" : "Công việc"} · {p.title}
              </h4>
              {item.assignee && (
                <p className="mt-2">
                  Giao cho {item.assignee.name || item.assignee.id} · có thể cập
                  nhật việc này
                </p>
              )}
              <p className="mt-2 text-slate-600">
                {item.categoryLabel} ·{" "}
                {p.dueAt ? date(p.dueAt) : "Chưa đặt lịch"}
                {p.scheduledEndAt ? " → " + date(p.scheduledEndAt) : ""}
              </p>
              {p.dueAt && p.reminderMinutes !== undefined && <p className="text-xs text-slate-500">{p.reminderMinutes === null ? "Không nhắc lịch" : p.reminderMinutes === 0 ? "Nhắc đúng giờ" : `Nhắc trước ${p.reminderMinutes} phút`}</p>}
              {p.priority !== "MEDIUM" && (
                <p className="mt-2 text-xs text-slate-500">
                  Ưu tiên:{" "}
                  {
                    {
                      LOW: "Thấp",
                      MEDIUM: "Bình thường",
                      HIGH: "Cao",
                      URGENT: "Khẩn",
                    }[p.priority]
                  }
                </p>
              )}
              {p.codex && (
                <p className="mt-2 font-medium text-blue-700">
                  Codex ·{" "}
                  {p.codex.startAt
                    ? "Bắt đầu từ " + date(p.codex.startAt)
                    : "Chạy ngay khi worker sẵn sàng"}{" "}
                  (giờ Việt Nam)
                </p>
              )}
              {p.checklist.length > 0 && (
                <ul className="mt-2 list-disc pl-5">
                  {p.checklist.map((title, i) => (
                    <li key={i}>{title}</li>
                  ))}
                </ul>
              )}
              {p.note && <p className="mt-2 whitespace-pre-wrap">{p.note}</p>}
              {item.shares.length > 0 && (
                <p className="mt-2">
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
                <p className="mt-2">Tag: {p.tags.join(", ")}</p>
              )}
              <p className="mt-2 text-xs text-slate-500">
                {item.calendarTargets?.length
                  ? "Tự đồng bộ Google Calendar: " +
                    item.calendarTargets
                      .map((t) => t.name || "Tài khoản đã kết nối")
                      .join(", ") +
                    "."
                  : "Lưu trong Quản lý công việc."}{" "}
                {p.kind === "EVENT" ? "Sự kiện không cần hoàn thành." : ""}
              </p>
            </article>
          );
        })}
      </div>
      <button
        type="button"
        disabled={busy}
        onClick={onApprove}
        className="mt-3 min-h-11 rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white disabled:opacity-50"
      >
        {busy
          ? "Đang tạo…"
          : multiple
            ? `Tạo ${items.length} mục`
            : hasCodex
              ? "Tạo việc và giao Codex"
              : items[0].plan.kind === "EVENT"
                ? "Tạo sự kiện"
                : "Tạo công việc"}
      </button>
    </section>
  );
}
