import * as React from "react";
import type {
  IssueItem,
  MechanicalPartCatalogOption,
  SupplyCatalogOption,
  TechnicalDetailCatalogOption,
} from "./types";
import {
  actionModeLabel,
  areaLabel,
  fmtDT,
  fmtMoney,
  statusLabel,
} from "./helpers";
import { ClosedSrBadge, PriorityBadge, ReadyToCloseBadge } from "./badges";

type VendorOption = {
  id: string;
  name: string;
  phone?: string | null;
  code?: string | null;
};

function normalizeAreaKey(value?: string | null) {
  const raw = String(value ?? "")
    .trim()
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\s-]+/g, "_");

  const map: Record<string, string> = {
    MAY: "MOVEMENT",
    MOVEMENT: "MOVEMENT",

    VO: "CASE",
    CASE: "CASE",

    KINH: "CRYSTAL",
    GLASS: "CRYSTAL",
    CRYSTAL: "CRYSTAL",

    NUM: "CROWN",
    CROWN: "CROWN",

    MAT_SO: "DIAL",
    DIAL: "DIAL",

    HANDS: "HANDS",
    KIM: "HANDS",

    DAY: "BRACELET",
    STRAP: "BRACELET",
    BRACELET: "BRACELET",

    TONG_QUAT: "GENERAL",
    GENERAL: "GENERAL",
  };

  return map[raw] ?? raw;
}
function catalogOptionLabel(option: {
  code?: string | null;
  name?: string | null;
  unit?: string | null;
  group?: string | null;
  category?: string | null;
}) {
  const code = String(option.code ?? "").trim();
  const name = String(option.name ?? "").trim();
  const meta = String(
    option.unit ?? option.group ?? option.category ?? "",
  ).trim();

  const main = [code, name].filter(Boolean).join(" - ");
  return meta ? `${main || "Không tên"} (${meta})` : main || "Không tên";
}
function vendorOptionLabel(vendor: VendorOption) {
  const code = String(vendor.code ?? "").trim();
  const name = String(vendor.name ?? "").trim();
  const phone = String(vendor.phone ?? "").trim();

  const main = [code, name].filter(Boolean).join(" - ") || "Không tên";
  return phone ? `${main} - ${phone}` : main;
}

function InfoLine({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">
        {label}
      </div>
      <div className="mt-1 text-sm font-medium text-stone-900">{value}</div>
    </div>
  );
}

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
    <div className="flex min-w-[120px] items-center gap-2">
      <span
        className={[
          "grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[10px]",
          active
            ? "border-stone-900 bg-stone-900 text-white"
            : "border-stone-300 bg-white text-stone-400",
        ].join(" ")}
      >
        {active ? "✓" : ""}
      </span>
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-400">
          {label}
        </div>
        <div className="mt-0.5 text-xs text-stone-600">{value || "-"}</div>
      </div>
    </div>
  );
}

export function IssueDrawer({
  issue,
  busyId,
  actualCost,
  resolutionNote,
  technicalDetailCatalogOptions,
  supplyCatalogOptions,
  mechanicalPartCatalogOptions,
  vendorOptions = [],
  technicalDetailCatalogId,
  supplyCatalogId,
  mechanicalPartCatalogId,
  actionMode,
  vendorId,
  onChangeActualCost,
  onChangeResolutionNote,
  onChangeTechnicalDetailCatalogId,
  onChangeSupplyCatalogId,
  onChangeMechanicalPartCatalogId,
  onChangeActionMode,
  onChangeVendorId,
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
  technicalDetailCatalogOptions: TechnicalDetailCatalogOption[];
  supplyCatalogOptions: SupplyCatalogOption[];
  mechanicalPartCatalogOptions: MechanicalPartCatalogOption[];
  vendorOptions?: VendorOption[];
  technicalDetailCatalogId: string;
  supplyCatalogId: string;
  mechanicalPartCatalogId: string;
  actionMode: string;
  vendorId: string;
  onChangeActualCost: (value: string) => void;
  onChangeResolutionNote: (value: string) => void;
  onChangeTechnicalDetailCatalogId: (value: string) => void;
  onChangeSupplyCatalogId: (value: string) => void;
  onChangeMechanicalPartCatalogId: (value: string) => void;
  onChangeActionMode: (value: string) => void;
  onChangeVendorId: (value: string) => void;
  onClose: () => void;
  onAction: (
    issueId: string,
    action: "confirm" | "start" | "complete" | "cancel",
    rollback?: IssueItem[],
  ) => Promise<void>;
  onOpenServiceRequest: () => void;
  onCancelIssue: (issueId: string) => Promise<void>;
  cancelingIssueId: string | null;
}) {
  const sr = issue?.serviceRequest ?? null;
  const issueAreaKey = normalizeAreaKey(issue.area);

  const detailOptions = React.useMemo(() => {
    const options = Array.isArray(technicalDetailCatalogOptions)
      ? technicalDetailCatalogOptions
      : [];

    if (!issueAreaKey) return options;

    return options.filter(
      (item) => normalizeAreaKey(item.area) === issueAreaKey,
    );
  }, [technicalDetailCatalogOptions, issueAreaKey]);
  const isStarting = issue.boardColumn === "READY";
  const isCompleting = issue.boardColumn === "IN_PROGRESS";
  const isVendorMode = String(actionMode || "").toUpperCase() === "VENDOR";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-stone-950/40 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Đóng modal"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />

      <div className="relative flex max-h-[96vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl border border-stone-200 bg-white shadow-2xl transition-all sm:max-h-[90vh] sm:rounded-3xl">
        <div className="sticky top-0 z-10 border-b border-stone-200 bg-white px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-lg font-semibold text-stone-950">
                {issue.summary || issue.id}
              </div>
              <div className="mt-1 text-sm text-stone-500">
                {sr?.productTitle || "-"} • {sr?.refNo || "-"}
              </div>

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

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5">
          <section className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoLine label="Khu vực" value={areaLabel(issue.area)} />
              <InfoLine
                label="Trạng thái"
                value={statusLabel(issue.executionStatus)}
              />
              <InfoLine
                label="Thực hiện"
                value={actionModeLabel(issue.actionMode)}
              />
              <InfoLine
                label="Chi tiết kỹ thuật"
                value={issue.technicalDetailCatalog?.name || "Chưa xác định"}
              />
            </div>

            <div className="mt-4 rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700">
              {issue.note || "Chưa có ghi chú kỹ thuật."}
            </div>
          </section>

          <section className="rounded-2xl border border-stone-200 bg-white p-4">
            <div className="text-sm font-semibold text-stone-900">Timeline</div>
            <div className="mt-4 flex flex-wrap items-center gap-5">
              <TimelineStep
                label="Mở issue"
                value={fmtDT(issue.openedAt)}
                active
              />
              <TimelineStep
                label="Xác nhận"
                value={fmtDT(issue.confirmedAt)}
                active={Boolean(issue.confirmedAt)}
              />
              <TimelineStep
                label="Bắt đầu"
                value={fmtDT(issue.startedAt)}
                active={Boolean(issue.startedAt)}
              />
              <TimelineStep
                label="Hoàn tất"
                value={fmtDT(issue.completedAt)}
                active={Boolean(issue.completedAt)}
              />
            </div>
          </section>

          {isStarting ? (
            <section className="rounded-2xl border border-sky-100 bg-sky-50/70 p-4">
              <div className="text-sm font-semibold text-stone-900">
                Xác định chi tiết kỹ thuật trước khi bắt đầu
              </div>
              <p className="mt-1 text-sm text-stone-500">
                Từ trạng thái đã xác nhận sang đang xử lý, kỹ thuật phải chọn
                chi tiết xử lý đúng theo khu vực issue.
              </p>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
                    Chi tiết kỹ thuật
                  </label>
                  <select
                    value={technicalDetailCatalogId}
                    onChange={(e) =>
                      onChangeTechnicalDetailCatalogId(e.target.value)
                    }
                    className="h-11 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm outline-none focus:border-stone-400"
                  >
                    <option value="">Chọn chi tiết</option>
                    {detailOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
                    Thực hiện
                  </label>
                  <select
                    value={actionMode || "INTERNAL"}
                    onChange={(e) => onChangeActionMode(e.target.value)}
                    className="h-11 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm outline-none focus:border-stone-400"
                  >
                    <option value="INTERNAL">Nội bộ</option>
                    <option value="VENDOR">Vendor</option>
                  </select>
                </div>

                {isVendorMode ? (
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
                      Vendor
                    </label>
                    <select
                      value={vendorId}
                      onChange={(e) => onChangeVendorId(e.target.value)}
                      className="h-11 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm outline-none focus:border-stone-400"
                    >
                      <option value="">Chọn vendor</option>
                      {vendorOptions.map((vendor) => (
                        <option key={vendor.id} value={vendor.id}>
                          {vendorOptionLabel(vendor)}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : null}
              </div>

              {!detailOptions.length ? (
                <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
                  Chưa có chi tiết kỹ thuật active cho khu vực{" "}
                  {areaLabel(issue.area)}. Vào Danh mục để thêm
                  TechnicalDetailCatalog.
                </div>
              ) : null}
            </section>
          ) : null}

          {isCompleting ? (
            <section className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
              <div className="text-sm font-semibold text-stone-900">
                Kết luận hoàn tất issue
              </div>
              <p className="mt-1 text-sm text-stone-500">
                Khi hoàn tất issue bắt buộc nhập chi phí thực tế và kết luận xử
                lý.
              </p>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
                    Thực hiện
                  </label>
                  <select
                    value={actionMode || "INTERNAL"}
                    onChange={(e) => onChangeActionMode(e.target.value)}
                    className="h-11 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm outline-none focus:border-stone-400"
                  >
                    <option value="INTERNAL">Nội bộ</option>
                    <option value="VENDOR">Vendor</option>
                  </select>
                </div>

                {isVendorMode ? (
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
                      Vendor
                    </label>
                    <select
                      value={vendorId}
                      onChange={(e) => onChangeVendorId(e.target.value)}
                      className="h-11 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm outline-none focus:border-stone-400"
                    >
                      <option value="">Chọn vendor</option>
                      {vendorOptions.map((vendor) => (
                        <option key={vendor.id} value={vendor.id}>
                          {vendorOptionLabel(vendor)}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="hidden md:block" />
                )}

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
                    Vật tư / supply
                  </label>
                  <select
                    value={supplyCatalogId}
                    onChange={(e) => onChangeSupplyCatalogId(e.target.value)}
                    className="h-11 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm outline-none focus:border-stone-400"
                  >
                    <option value="">Không dùng vật tư</option>
                    {supplyCatalogOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {catalogOptionLabel(option)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
                    Linh kiện máy / part
                  </label>
                  <select
                    value={mechanicalPartCatalogId}
                    onChange={(e) =>
                      onChangeMechanicalPartCatalogId(e.target.value)
                    }
                    className="h-11 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm outline-none focus:border-stone-400"
                  >
                    <option value="">Không thay linh kiện máy</option>
                    {mechanicalPartCatalogOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {catalogOptionLabel(option)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
                    Chi phí thực tế
                  </label>
                  <input
                    value={actualCost}
                    onChange={(e) => onChangeActualCost(e.target.value)}
                    className="h-11 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm outline-none focus:border-stone-400"
                    placeholder="0"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
                    Kết luận xử lý
                  </label>
                  <textarea
                    value={resolutionNote}
                    onChange={(e) => onChangeResolutionNote(e.target.value)}
                    className="min-h-[110px] w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-stone-400"
                    placeholder="Nhập kết quả xử lý, vật tư/linh kiện đã thay, lưu ý sau xử lý..."
                  />
                </div>
              </div>
            </section>
          ) : null}

          <section className="rounded-2xl border border-stone-200 bg-white p-4">
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
                  disabled={
                    busyId === issue.id ||
                    !technicalDetailCatalogId ||
                    (isVendorMode && !vendorId)
                  }
                  onClick={() => onAction(issue.id, "start")}
                  className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-medium text-sky-700 hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Bắt đầu xử lý
                </button>
              )}

              {issue.boardColumn === "IN_PROGRESS" && (
                <button
                  type="button"
                  disabled={
                    busyId === issue.id ||
                    actualCost.trim() === "" ||
                    !resolutionNote.trim() ||
                    (isVendorMode && !vendorId)
                  }
                  onClick={() => onAction(issue.id, "complete")}
                  className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
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
          </section>
        </div>
      </div>
    </div>
  );
}
