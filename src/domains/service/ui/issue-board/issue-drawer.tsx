"use client";

import { ArrowRight, CheckCircle2, Circle, X } from "lucide-react";

import { ClosedSrBadge, PriorityBadge, ReadyToCloseBadge } from "./badges";
import {
  actionModeLabel,
  areaLabel,
  fmtDT,
  fmtMoney,
  statusLabel,
} from "./helpers";
import type { IssueItem } from "./types";

type Option = {
  id: string;
  code?: string | null;
  name: string;
  defaultPrice?: number | string | null;
  defaultCost?: number | string | null;
};

type Options = {
  serviceCatalogs: Option[];
  supplyCatalogs: Option[];
  mechanicalPartCatalogs: Option[];
  vendors: Option[];
};

function optionLabel(option: Option) {
  return [option.code, option.name].filter(Boolean).join(" · ");
}

function Step({ label, value, active }: { label: string; value?: string | null; active?: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      {active ? <CheckCircle2 className="h-4 w-4 shrink-0 text-slate-950" /> : <Circle className="h-4 w-4 shrink-0 text-slate-300" />}
      <div className="min-w-0">
        <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">{label}</div>
        <div className="mt-0.5 truncate text-xs text-slate-700">{value || "-"}</div>
      </div>
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder = "Không chọn",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-slate-400"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {optionLabel(option)}
          </option>
        ))}
      </select>
    </label>
  );
}

export function IssueDrawer({
  issue,
  busyId,
  actionMode,
  vendorId,
  serviceCatalogId,
  supplyCatalogId,
  mechanicalPartCatalogId,
  actualCost,
  resolutionNote,
  options,
  onChangeActionMode,
  onChangeVendorId,
  onChangeServiceCatalogId,
  onChangeSupplyCatalogId,
  onChangeMechanicalPartCatalogId,
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
  actionMode: string;
  vendorId: string;
  serviceCatalogId: string;
  supplyCatalogId: string;
  mechanicalPartCatalogId: string;
  actualCost: string;
  resolutionNote: string;
  options: Options;
  onChangeActionMode: (value: string) => void;
  onChangeVendorId: (value: string) => void;
  onChangeServiceCatalogId: (value: string) => void;
  onChangeSupplyCatalogId: (value: string) => void;
  onChangeMechanicalPartCatalogId: (value: string) => void;
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
  const isVendor = String(actionMode || "").toUpperCase() === "VENDOR";

  const hasStartConclusion = Boolean(serviceCatalogId) && (!isVendor || Boolean(vendorId));
  const hasCompleteConclusion =
    Boolean(serviceCatalogId || issue.serviceCatalog?.id) &&
    actualCost.trim() !== "" &&
    Number.isFinite(Number(actualCost)) &&
    Number(actualCost) >= 0 &&
    Boolean(resolutionNote.trim());

  const drawerTitle = issue.serviceCatalog?.name || issue.summary || issue.note || "Technical issue";

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-slate-950/35" onClick={onClose} />
      <div className="h-full w-full max-w-2xl overflow-y-auto border-l border-slate-200 bg-white shadow-2xl">
        <div className="sticky top-0 z-10 border-b border-slate-200 bg-white px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="text-lg font-bold text-slate-950">{sr?.refNo || issue.id}</div>
              <div className="mt-1 line-clamp-2 text-sm text-slate-500">
                {drawerTitle} · {sr?.productTitle || "-"}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <PriorityBadge level={issue.priority} />
                {issue.serviceRequestClosed ? <ClosedSrBadge /> : issue.serviceRequestReadyToClose ? <ReadyToCloseBadge /> : null}
              </div>
            </div>

            <button
              type="button"
              className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="space-y-5 p-5">
          <section className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Khu vực</div>
                <div className="mt-1 font-semibold text-slate-900">{areaLabel(issue.area)}</div>
              </div>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Trạng thái</div>
                <div className="mt-1 font-semibold text-slate-900">{statusLabel(issue.executionStatus)}</div>
              </div>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Thực hiện</div>
                <div className="mt-1 font-semibold text-slate-900">{actionModeLabel(issue.actionMode)}</div>
              </div>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Hạng mục</div>
                <div className="mt-1 font-semibold text-slate-900">{issue.serviceCatalog?.name || "Chưa kết luận"}</div>
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-white px-3 py-3 text-sm text-slate-600 ring-1 ring-slate-200">
              {issue.note || issue.summary || "Chưa có ghi chú kỹ thuật."}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="mb-4 text-sm font-bold text-slate-950">Timeline</div>
            <div className="grid gap-3 sm:grid-cols-4">
              <Step label="Mở issue" value={fmtDT(issue.openedAt)} active />
              <Step label="Xác nhận" value={fmtDT(issue.confirmedAt)} active={Boolean(issue.confirmedAt)} />
              <Step label="Bắt đầu" value={fmtDT(issue.startedAt)} active={Boolean(issue.startedAt)} />
              <Step label="Hoàn tất" value={fmtDT(issue.completedAt)} active={Boolean(issue.completedAt)} />
            </div>
          </section>

          {issue.boardColumn === "READY" ? (
            <section className="rounded-2xl border border-blue-100 bg-blue-50/40 p-4">
              <div className="text-sm font-bold text-slate-950">Kết luận trước khi bắt đầu xử lý</div>
              <p className="mt-1 text-sm text-slate-500">
                Từ trạng thái đã xác nhận sang đang xử lý, kỹ thuật phải chọn hạng mục xử lý và vendor nếu outsource.
              </p>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <SelectField
                  label="Hạng mục xử lý"
                  value={serviceCatalogId}
                  onChange={onChangeServiceCatalogId}
                  options={options.serviceCatalogs}
                  placeholder="Chọn hạng mục"
                />

                <label className="block">
                  <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Thực hiện</span>
                  <select
                    value={actionMode}
                    onChange={(event) => onChangeActionMode(event.target.value)}
                    className="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-slate-400"
                  >
                    <option value="INTERNAL">Nội bộ</option>
                    <option value="VENDOR">Vendor</option>
                  </select>
                </label>

                {isVendor ? (
                  <SelectField
                    label="Vendor"
                    value={vendorId}
                    onChange={onChangeVendorId}
                    options={options.vendors}
                    placeholder="Chọn vendor"
                  />
                ) : null}
              </div>
            </section>
          ) : null}

          {issue.boardColumn === "IN_PROGRESS" ? (
            <section className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4">
              <div className="text-sm font-bold text-slate-950">Kết luận hoàn tất</div>
              <p className="mt-1 text-sm text-slate-500">
                Hoàn tất issue bắt buộc có chi phí thực tế và kết luận kỹ thuật. Linh kiện/vật tư là tùy chọn.
              </p>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <SelectField
                  label="Vật tư sử dụng"
                  value={supplyCatalogId}
                  onChange={onChangeSupplyCatalogId}
                  options={options.supplyCatalogs}
                  placeholder="Không dùng vật tư"
                />
                <SelectField
                  label="Part liên quan"
                  value={mechanicalPartCatalogId}
                  onChange={onChangeMechanicalPartCatalogId}
                  options={options.mechanicalPartCatalogs}
                  placeholder="Không chọn part"
                />
                <label className="block">
                  <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Chi phí thực tế</span>
                  <input
                    value={actualCost}
                    onChange={(event) => onChangeActualCost(event.target.value)}
                    className="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-slate-400"
                    placeholder="0"
                  />
                </label>
                <div className="text-sm text-slate-500">
                  Chi phí hiện tại: <span className="font-semibold text-slate-900">{fmtMoney(issue.actualCost)}</span>
                </div>
              </div>

              <label className="mt-4 block">
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Kết luận kỹ thuật</span>
                <textarea
                  value={resolutionNote}
                  onChange={(event) => onChangeResolutionNote(event.target.value)}
                  className="mt-2 min-h-[120px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400"
                  placeholder="Nhập kết quả xử lý, linh kiện đã thay, lưu ý sau xử lý..."
                />
              </label>
            </section>
          ) : null}

          <section className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap gap-3">
              {issue.boardColumn === "PENDING_CONFIRM" ? (
                <button
                  type="button"
                  disabled={busyId === issue.id}
                  onClick={() => onAction(issue.id, "confirm")}
                  className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-100 disabled:opacity-50"
                >
                  Xác nhận
                </button>
              ) : null}

              {issue.boardColumn === "READY" ? (
                <button
                  type="button"
                  disabled={busyId === issue.id || !hasStartConclusion}
                  onClick={() => onAction(issue.id, "start")}
                  className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Bắt đầu xử lý <ArrowRight className="h-4 w-4" />
                </button>
              ) : null}

              {issue.boardColumn === "IN_PROGRESS" ? (
                <button
                  type="button"
                  disabled={busyId === issue.id || !hasCompleteConclusion}
                  onClick={() => onAction(issue.id, "complete")}
                  className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Hoàn tất issue
                </button>
              ) : null}

              {issue.boardColumn !== "DONE" ? (
                <button
                  type="button"
                  onClick={() => onCancelIssue(issue.id)}
                  disabled={cancelingIssueId === issue.id}
                  className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700 hover:bg-rose-100 disabled:opacity-60"
                >
                  {cancelingIssueId === issue.id ? "Đang hủy..." : "Hủy issue"}
                </button>
              ) : null}

              <button
                type="button"
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm hover:bg-slate-50"
                onClick={onOpenServiceRequest}
              >
                Mở Service Request
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
