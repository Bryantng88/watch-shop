import * as React from "react";
import type { IssueConclusionOptions, IssueItem } from "./types";
import { actionModeLabel, areaLabel, fmtDT, fmtMoney, statusLabel } from "./helpers";
import { ClosedSrBadge, PriorityBadge, ReadyToCloseBadge } from "./badges";

function TimelineStep({
  label,
  value,
  active,
}: {
  label: string;
  value?: string | null;
  active?: boolean;
}) {
  return (
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-2">
        <span
          className={`h-3 w-3 shrink-0 rounded-full border ${
            active ? "border-stone-900 bg-stone-900" : "border-stone-300 bg-white"
          }`}
        />
        <div className="h-px flex-1 bg-stone-200" />
      </div>
      <div className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-stone-400">
        {label}
      </div>
      <div className="mt-1 truncate text-xs text-stone-700" title={value || "-"}>
        {value || "-"}
      </div>
    </div>
  );
}

function selectClassName() {
  return "h-11 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm outline-none focus:border-stone-400";
}

function optionLabel(item: { code?: string | null; name?: string | null }) {
  const name = String(item?.name ?? "").trim();
  const code = String(item?.code ?? "").trim();
  if (code && name) return `${name} · ${code}`;
  return name || code || "-";
}

export function IssueDrawer({
  issue,
  busyId,
  actualCost,
  resolutionNote,
  serviceCatalogId,
  supplyCatalogId,
  mechanicalPartCatalogId,
  conclusionOptions,
  onChangeActualCost,
  onChangeResolutionNote,
  onChangeServiceCatalogId,
  onChangeSupplyCatalogId,
  onChangeMechanicalPartCatalogId,
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
  serviceCatalogId: string;
  supplyCatalogId: string;
  mechanicalPartCatalogId: string;
  conclusionOptions?: IssueConclusionOptions;
  onChangeActualCost: (value: string) => void;
  onChangeResolutionNote: (value: string) => void;
  onChangeServiceCatalogId: (value: string) => void;
  onChangeSupplyCatalogId: (value: string) => void;
  onChangeMechanicalPartCatalogId: (value: string) => void;
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
  const options = conclusionOptions ?? {
    serviceCatalogs: [],
    supplyCatalogs: [],
    mechanicalPartCatalogs: [],
  };

  const canComplete =
    Boolean(serviceCatalogId) &&
    actualCost.trim() !== "" &&
    Number.isFinite(Number(actualCost)) &&
    Number(actualCost) >= 0 &&
    Boolean(resolutionNote.trim());

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-stone-950/35" onClick={onClose} />

      <div className="h-full w-full max-w-2xl overflow-y-auto border-l border-stone-200 bg-white shadow-2xl">
        <div className="sticky top-0 z-10 border-b border-stone-200 bg-white px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="truncate text-lg font-semibold text-stone-950">
                {issue.summary || "Technical issue"}
              </div>
              <div className="mt-1 truncate text-sm text-stone-500">
                {sr?.productTitle || "-"} • {sr?.refNo || "-"}
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-stone-500">
                <PriorityBadge level={issue.priority} />
                <span>{areaLabel(issue.area)}</span>
                <span>•</span>
                <span>{statusLabel(issue.executionStatus)}</span>
                <span>•</span>
                <span>{actionModeLabel(issue.actionMode)}</span>

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
          {issue.serviceRequestReadyToClose && !issue.serviceRequestClosed ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              Tất cả issue của phiếu này đã hoàn tất. Vui lòng mở Service Request để xác nhận đóng phiếu
              và hoàn tất thông tin cần thiết. Nếu chưa thể đóng, hãy tạo thêm issue hoặc trả issue về xử lý
              lại kèm lý do.
            </div>
          ) : null}

          <div className="rounded-2xl border border-stone-200 bg-white p-4">
            <div className="text-sm font-semibold text-stone-900">Thông tin nhanh</div>
            <div className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
              <div>
                <span className="text-stone-400">Vendor:</span>{" "}
                <span className="font-medium text-stone-800">{issue.vendorNameSnap || "-"}</span>
              </div>
              <div>
                <span className="text-stone-400">Kỹ thuật viên:</span>{" "}
                <span className="font-medium text-stone-800">{sr?.technicianNameSnap || "-"}</span>
              </div>
              <div>
                <span className="text-stone-400">Dự kiến:</span>{" "}
                <span className="font-medium text-stone-800">{fmtMoney(issue.estimatedCost)}</span>
              </div>
              <div>
                <span className="text-stone-400">Thực tế:</span>{" "}
                <span className="font-medium text-stone-800">{fmtMoney(issue.actualCost)}</span>
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-stone-50 px-3 py-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                Ghi chú ban đầu
              </div>
              <div className="mt-1 text-sm text-stone-700">{issue.note || "Chưa có ghi chú."}</div>
            </div>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-4">
            <div className="text-sm font-semibold text-stone-900">Timeline</div>
            <div className="mt-4 flex items-start gap-3">
              <TimelineStep label="Mở issue" value={fmtDT(issue.openedAt)} active />
              <TimelineStep label="Xác nhận" value={fmtDT(issue.confirmedAt)} active={Boolean(issue.confirmedAt)} />
              <TimelineStep label="Bắt đầu" value={fmtDT(issue.startedAt)} active={Boolean(issue.startedAt)} />
              <TimelineStep label="Hoàn tất" value={fmtDT(issue.completedAt)} active={Boolean(issue.completedAt)} />
            </div>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
            <div className="text-sm font-semibold text-stone-900">Kết luận kỹ thuật</div>
            <div className="mt-1 text-xs text-stone-500">
              Bắt buộc khi chuyển issue từ đang xử lý sang hoàn tất.
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-400">
                  Hạng mục xử lý <span className="text-rose-500">*</span>
                </label>
                <select
                  value={serviceCatalogId}
                  onChange={(e) => onChangeServiceCatalogId(e.target.value)}
                  className={selectClassName()}
                >
                  <option value="">Chọn hạng mục</option>
                  {options.serviceCatalogs.map((item) => (
                    <option key={item.id} value={item.id}>
                      {optionLabel(item)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-400">
                  Chi phí thực tế <span className="text-rose-500">*</span>
                </label>
                <input
                  value={actualCost}
                  onChange={(e) => onChangeActualCost(e.target.value)}
                  className={selectClassName()}
                  placeholder="0"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-400">
                  Linh kiện máy
                </label>
                <select
                  value={mechanicalPartCatalogId}
                  onChange={(e) => onChangeMechanicalPartCatalogId(e.target.value)}
                  className={selectClassName()}
                >
                  <option value="">Không dùng</option>
                  {options.mechanicalPartCatalogs.map((item) => (
                    <option key={item.id} value={item.id}>
                      {optionLabel(item)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-400">
                  Vật tư / phụ kiện
                </label>
                <select
                  value={supplyCatalogId}
                  onChange={(e) => onChangeSupplyCatalogId(e.target.value)}
                  className={selectClassName()}
                >
                  <option value="">Không dùng</option>
                  {options.supplyCatalogs.map((item) => (
                    <option key={item.id} value={item.id}>
                      {optionLabel(item)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-400">
                  Kết luận xử lý <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={resolutionNote}
                  onChange={(e) => onChangeResolutionNote(e.target.value)}
                  className="min-h-[110px] w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-stone-400"
                  placeholder="Nhập kết luận, linh kiện đã thay, lưu ý sau xử lý..."
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
                  disabled={busyId === issue.id || !canComplete}
                  title={!canComplete ? "Cần đủ hạng mục, chi phí và kết luận xử lý." : undefined}
                  onClick={() => onAction(issue.id, "complete")}
                  className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Hoàn tất issue
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
