import * as React from "react";
import type { IssueItem } from "./types";
import { actionModeLabel, areaLabel, fmtDT, fmtMoney, statusLabel } from "./helpers";
import { ClosedSrBadge, PriorityBadge, ReadyToCloseBadge } from "./badges";

function DrawerField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3">
      <div className="text-xs uppercase tracking-wide text-stone-400">{label}</div>
      <div className="mt-1 text-sm font-medium text-stone-900">{value}</div>
    </div>
  );
}

function Step({ label, value, active }: { label: string; value?: string | null; active?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex flex-col items-center">
        <div className={`h-3 w-3 rounded-full border ${active ? "border-stone-900 bg-stone-900" : "border-stone-300 bg-white"}`} />
        <div className="mt-1 h-8 w-px bg-stone-200" />
      </div>
      <div>
        <div className="text-xs font-medium uppercase tracking-wide text-stone-400">{label}</div>
        <div className="mt-1 text-sm text-stone-700">{value || "-"}</div>
      </div>
    </div>
  );
}

export function IssueDrawer({
  issue,
  busyId,
  actualCost,
  resolutionNote,
  onChangeActualCost,
  onChangeResolutionNote,
  onClose,
  onAction,
  onOpenServiceRequest,
  onCancelIssue,
  cancelingIssueId,
}: {
  issue: IssueItem;
  busyId: string | null;
  actualCost: string;
  resolutionNote: string;
  onChangeActualCost: (value: string) => void;
  onChangeResolutionNote: (value: string) => void;
  onClose: () => void;
  onAction: (
    issueId: string,
    action: "confirm" | "start" | "complete" | "cancel",
    rollback?: IssueItem[]
  ) => Promise<void>;
  onOpenServiceRequest: () => void;
  onCancelIssue: (issueId: string) => Promise<void>;
  cancelingIssueId: string | null;
}) {
  const sr = issue?.serviceRequest ?? null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-stone-950/35" onClick={onClose} />
      <div className="h-full w-full max-w-2xl overflow-y-auto border-l border-stone-200 bg-white shadow-2xl">
        <div className="sticky top-0 z-10 border-b border-stone-200 bg-white px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-lg font-semibold text-stone-950">{issue.summary || "Technical issue"}</div>
              <div className="mt-1 text-sm text-stone-500">{sr?.productTitle || "-"} • {sr?.refNo || "-"}</div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <PriorityBadge level={issue.priority} />
                {issue.serviceRequestClosed ? (
                  <ClosedSrBadge />
                ) : issue.serviceRequestReadyToClose ? (
                  <ReadyToCloseBadge />
                ) : null}
              </div>
            </div>

            <button
              type="button"
              className="rounded-xl border border-stone-200 px-3 py-2 text-sm hover:bg-stone-50"
              onClick={onClose}
            >
              Đóng
            </button>
          </div>
        </div>

        <div className="space-y-5 p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <DrawerField label="Khu vực" value={areaLabel(issue.area)} />
            <DrawerField label="Thực hiện" value={actionModeLabel(issue.actionMode)} />
            <DrawerField label="Trạng thái" value={statusLabel(issue.executionStatus)} />
            <DrawerField label="Xác nhận" value={issue.isConfirmed ? "Đã xác nhận" : "Chưa xác nhận"} />
            <DrawerField label="Vendor" value={issue.vendorNameSnap || "-"} />
            <DrawerField label="Kỹ thuật viên" value={sr?.technicianNameSnap || "-"} />
            <DrawerField label="Chi phí dự kiến" value={fmtMoney(issue.estimatedCost)} />
            <DrawerField label="Chi phí thực tế" value={fmtMoney(issue.actualCost)} />
          </div>

          <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
            <div className="text-sm font-semibold text-stone-900">Ghi chú kỹ thuật</div>
            <div className="mt-2 text-sm text-stone-600">{issue.note || "Chưa có ghi chú."}</div>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
            <div className="text-sm font-semibold text-stone-900">Timeline</div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Step label="Mở issue" value={fmtDT(issue.openedAt)} active />
              <Step label="Xác nhận" value={fmtDT(issue.confirmedAt)} active={Boolean(issue.confirmedAt)} />
              <Step label="Bắt đầu" value={fmtDT(issue.startedAt)} active={Boolean(issue.startedAt)} />
              <Step label="Hoàn tất" value={fmtDT(issue.completedAt)} active={Boolean(issue.completedAt)} />
            </div>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
            <div className="text-sm font-semibold text-stone-900">Cập nhật xử lý</div>

            <div className="mt-4 grid gap-4 md:grid-cols-[180px_1fr]">
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-400">
                  Chi phí thực tế
                </label>
                <input
                  value={actualCost}
                  onChange={(e) => onChangeActualCost(e.target.value)}
                  className="h-11 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm outline-none focus:border-stone-400"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-400">
                  Ghi chú hoàn tất / hủy
                </label>
                <textarea
                  value={resolutionNote}
                  onChange={(e) => onChangeResolutionNote(e.target.value)}
                  className="min-h-[110px] w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-stone-400"
                  placeholder="Nhập kết quả xử lý, linh kiện đã thay, lưu ý sau xử lý..."
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-4">
            <div className="flex flex-wrap gap-3">
              {issue.boardColumn === "PENDING_CONFIRM" && (
                <button
                  type="button"
                  disabled={busyId === issue.id}
                  onClick={() => onAction(issue.id, "confirm")}
                  className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 hover:bg-amber-100 disabled:opacity-50"
                >
                  Xác nhận
                </button>
              )}

              {issue.boardColumn === "READY" && (
                <button
                  type="button"
                  disabled={busyId === issue.id}
                  onClick={() => onAction(issue.id, "start")}
                  className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-medium text-sky-700 hover:bg-sky-100 disabled:opacity-50"
                >
                  Bắt đầu
                </button>
              )}

              {issue.boardColumn === "IN_PROGRESS" && (
                <button
                  type="button"
                  disabled={busyId === issue.id}
                  onClick={() => onAction(issue.id, "complete")}
                  className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
                >
                  Hoàn tất
                </button>
              )}

              {issue.boardColumn !== "DONE" && (
                <button
                  type="button"
                  onClick={() => onCancelIssue(issue.id)}
                  disabled={cancelingIssueId === issue.id}
                  className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700 hover:bg-rose-100 disabled:opacity-60"
                >
                  {cancelingIssueId === issue.id ? "Đang hủy..." : "Hủy issue"}
                </button>
              )}

              <button
                type="button"
                className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm hover:bg-stone-50"
                onClick={onOpenServiceRequest}
              >
                Mở Service Request
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
