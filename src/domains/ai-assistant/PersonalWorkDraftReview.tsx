"use client";
import type { PersonalWorkDraft } from "./personal-work-contract";
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
  const p = draft.plan;
  return (
    <section
      aria-label="Duyệt lịch cá nhân"
      className="mt-4 rounded-2xl border border-blue-200 bg-white p-4 text-sm"
    >
      <h3 className="font-semibold">
        {p.kind === "EVENT" ? "Sự kiện" : "Công việc"} · {p.title}
      </h3>
      {draft.assignee && <p className="mt-2">Giao cho {draft.assignee.name || draft.assignee.id} · có thể cập nhật việc này</p>}
      <p className="mt-2 text-slate-600">
        {draft.categoryLabel} · {p.dueAt ? date(p.dueAt) : "Chưa đặt lịch"}
        {p.scheduledEndAt ? " → " + date(p.scheduledEndAt) : ""}
      </p>
      <p className="mt-2 text-xs text-slate-500">
        Ưu tiên: {{ LOW: "Thấp", MEDIUM: "Bình thường", HIGH: "Cao", URGENT: "Khẩn" }[p.priority]}
      </p>
      {p.checklist.length > 0 && (
        <ul className="mt-2 list-disc pl-5">
          {p.checklist.map((title, i) => (
            <li key={i}>{title}</li>
          ))}
        </ul>
      )}
      {p.note && <p className="mt-2 whitespace-pre-wrap">{p.note}</p>}
      {draft.shares.length > 0 && (
        <p className="mt-2">
          Chia sẻ:{" "}
          {draft.shares
            .map(
              (s) => `${s.name || s.id} (${s.accessLevel === "EDITOR" ? "Có thể sửa" : "Chỉ xem"})`,
            )
            .join(", ")}
        </p>
      )}
      {p.tags.length > 0 && <p className="mt-2">Tag: {p.tags.join(", ")}</p>}
      <p className="mt-2 text-xs text-slate-500">
        {p.syncGoogle ? "Đồng bộ lên Google Calendar." : "Lưu trong Công việc của tôi."}{" "}
        {p.kind === "EVENT" ? "Sự kiện không cần hoàn thành." : ""}
      </p>
      <button
        type="button"
        disabled={busy}
        onClick={onApprove}
        className="mt-3 min-h-11 rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white disabled:opacity-50"
      >
        {p.kind === "EVENT" ? "Tạo sự kiện" : "Tạo công việc"}
      </button>
    </section>
  );
}
