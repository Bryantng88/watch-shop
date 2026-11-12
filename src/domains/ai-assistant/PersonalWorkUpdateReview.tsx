"use client";
import React from "react";
import { reviewSchedule } from "./review-schedule";
import { CalendarDays } from "lucide-react";
import { personalWorkCode } from "@/domains/personal-work/shared/personal-work-code";
import {
  personalWorkUpdateInput,
  type PersonalWorkUpdateDraft,
} from "./personal-work-update";
const date = (v: string | null) =>
  v
    ? new Intl.DateTimeFormat("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
        dateStyle: "short",
        timeStyle: "short",
      }).format(new Date(v))
    : "Bỏ lịch";
export default function PersonalWorkUpdateReview({
  draft,
  busy,
  onApprove,
  onEdit,
  embedded = false,
}: {
  draft: PersonalWorkUpdateDraft;
  busy: boolean;
  onApprove?: () => void;
  onEdit?: () => void;
  embedded?: boolean;
}) {
  const items = [draft, ...(draft.additional || [])],
    Container = embedded ? "div" : "section";
  return (
    <Container
      data-ben-review={embedded ? undefined : true}
      aria-label="Duyệt cập nhật công việc"
      className={
        embedded
          ? "border-b border-slate-100"
          : "mt-4 rounded-2xl border border-violet-100 bg-white p-4 text-sm"
      }
    >
      {!embedded && (
        <header className="mb-2 border-b border-violet-50 pb-3">
          <h3 className="font-semibold">Đề xuất {items.length} thay đổi</h3>
          <p className="mt-1 text-xs text-slate-500">Kiểm tra trước khi lưu</p>
        </header>
      )}
      {items.map((item) => {
        const c = personalWorkUpdateInput(item.plan);
        return (
          <article key={item.plan.itemId} className="flex gap-3 py-3 text-sm">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-500">
              <CalendarDays size={20} />
            </span>
            <div className="min-w-0 flex-1">
              <h4 className="break-words font-semibold text-slate-900">
                {item.code ??
                  personalWorkCode(item.plan.itemId, undefined, item.kind)}{" "}
                · {item.title}
              </h4>
              <p className="mt-1 text-xs text-slate-500">Cập nhật</p>
              {c.title !== undefined && (
                <p className="mt-2 text-xs">Tên → {c.title}</p>
              )}
              {c.status && (
                <p className="mt-2 text-xs">
                  Trạng thái →{" "}
                  {
                    {
                      TODO: "Chưa làm",
                      IN_PROGRESS: "Đang làm",
                      DONE: "Hoàn thành",
                      CANCELLED: "Đã hủy",
                    }[c.status]
                  }
                </p>
              )}
              {(c.dueAt !== undefined || c.scheduledEndAt !== undefined) && (
                <p className="mt-2">
                  <span className="inline-block rounded-lg bg-violet-50 px-2 py-1 text-xs leading-5 text-violet-800">
                    {c.dueAt && c.scheduledEndAt ? (
                      reviewSchedule(c.dueAt, c.scheduledEndAt)
                    ) : (
                      <>
                        {c.dueAt !== undefined
                          ? `Bắt đầu: ${date(c.dueAt)}`
                          : "Giữ giờ bắt đầu"}
                        {c.scheduledEndAt !== undefined
                          ? ` · ${item.kind === "EVENT" ? "Kết thúc" : "Hạn hoàn thành"}: ${c.scheduledEndAt ? date(c.scheduledEndAt) : "Bỏ mốc này"}`
                          : ""}
                      </>
                    )}
                  </span>
                </p>
              )}
              {c.note !== undefined && (
                <p className="mt-2 whitespace-pre-wrap text-xs">
                  Ghi chú → {c.note || "Xóa ghi chú"}
                </p>
              )}
            </div>
          </article>
        );
      })}
      {!embedded && (
        <>
          <button
            data-ben-approve
            type="button"
            disabled={busy}
            onClick={onApprove}
            className="mt-3 min-h-11 w-full rounded-xl bg-violet-600 px-4 py-2.5 font-semibold text-white disabled:opacity-50"
          >
            Duyệt {items.length} thay đổi
          </button>
          {onEdit && (
            <button
              type="button"
              disabled={busy}
              onClick={onEdit}
              className="mt-2 min-h-10 w-full rounded-xl text-violet-600"
            >
              Chỉnh lại
            </button>
          )}
        </>
      )}
    </Container>
  );
}
