import * as React from "react";
import { Plus, X } from "lucide-react";
import { createQuickVendor } from "@/domains/vendor/client/vendor.actions";
import type {
  IssueItem,
  MechanicalPartCatalogOption,
  SupplyCatalogOption,
  TechnicalDetailCatalogOption,
  VendorOption,
} from "./types";
import {
  actionModeLabel,
  areaLabel,
  fmtDT,
  statusLabel,
} from "./helpers";
import { ClosedSrBadge, PriorityBadge, ReadyToCloseBadge } from "./badges";

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
  category?: string | null;
}) {
  const code = String(option.code ?? "").trim();
  const name = String(option.name ?? "").trim();
  const meta = String(option.unit ?? option.category ?? "").trim();

  const main = [code, name].filter(Boolean).join(" - ");
  return meta ? `${main || "Không tên"} (${meta})` : main || "Không tên";
}

function vendorLabel(vendor: VendorOption) {
  return vendor.phone ? `${vendor.name} - ${vendor.phone}` : vendor.name;
}

function InfoLine({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
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

function VendorSelectWithQuickCreate({
  value,
  vendorOptions,
  onChange,
  onVendorsChange,
}: {
  value: string;
  vendorOptions: VendorOption[];
  onChange: (value: string) => void;
  onVendorsChange?: (vendors: VendorOption[]) => void;
}) {
  const [creating, setCreating] = React.useState(false);
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [pending, startTransition] = React.useTransition();

  function handleCreate() {
    const cleanName = name.trim();
    const cleanPhone = phone.trim();

    if (!cleanName) {
      setError("Vui lòng nhập tên vendor.");
      return;
    }

    setError(null);

    startTransition(async () => {
      try {
        const vendor = await createQuickVendor({
          name: cleanName,
          phone: cleanPhone || null,
        });

        const next = [
          ...vendorOptions.filter((item) => item.id !== vendor.id),
          vendor,
        ].sort((a, b) => a.name.localeCompare(b.name, "vi"));

        onVendorsChange?.(next);
        onChange(vendor.id);
        setName("");
        setPhone("");
        setCreating(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Không thể tạo vendor mới.",
        );
      }
    });
  }

  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-3">
        <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
          Vendor
        </label>

        {!creating ? (
          <button
            type="button"
            onClick={() => {
              setError(null);
              setCreating(true);
            }}
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
          >
            <Plus className="h-3.5 w-3.5" />
            Vendor mới
          </button>
        ) : null}
      </div>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm outline-none focus:border-stone-400"
      >
        <option value="">Chọn vendor</option>
        {vendorOptions.map((vendor) => (
          <option key={vendor.id} value={vendor.id}>
            {vendorLabel(vendor)}
          </option>
        ))}
      </select>

      {creating ? (
        <div className="mt-3 rounded-2xl bg-indigo-50/60 p-3 ring-1 ring-inset ring-indigo-100">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-700">
                Vendor mới
              </div>
              <div className="mt-0.5 text-xs text-indigo-500">
                Tạo nhanh vendor để gán ngay cho issue này.
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setCreating(false);
                setError(null);
              }}
              className="rounded-full p-1 text-indigo-500 hover:bg-white/70"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_150px_auto]">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
                Tên vendor
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10 w-full rounded-xl border border-indigo-100 bg-white px-3 text-sm outline-none focus:border-indigo-300"
                placeholder="Ví dụ: Anh A sửa vỏ"
                autoFocus
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
                SĐT
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-10 w-full rounded-xl border border-indigo-100 bg-white px-3 text-sm outline-none focus:border-indigo-300"
                placeholder="Tuỳ chọn"
              />
            </div>

            <button
              type="button"
              onClick={handleCreate}
              disabled={pending || !name.trim()}
              className="self-end rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {pending ? "Đang tạo..." : "Thêm"}
            </button>
          </div>

          {error ? (
            <div className="mt-2 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-xs text-rose-600">
              {error}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function IssueDrawer({
  issue,
  busyId,
  actualCost,
  resolutionNote,
  technicalDetailCatalogOptions,
  supplyCatalogOptions = [],
  mechanicalPartCatalogOptions = [],
  vendorOptions = [],
  technicalDetailCatalogId,
  supplyCatalogId = "",
  mechanicalPartCatalogId = "",
  actionMode,
  vendorId,
  onChangeActualCost,
  onChangeResolutionNote,
  onChangeTechnicalDetailCatalogId,
  onChangeSupplyCatalogId,
  onChangeMechanicalPartCatalogId,
  onChangeActionMode,
  onChangeVendorId,
  onVendorOptionsChange,
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
  supplyCatalogOptions?: SupplyCatalogOption[];
  mechanicalPartCatalogOptions?: MechanicalPartCatalogOption[];
  vendorOptions?: VendorOption[];
  technicalDetailCatalogId: string;
  supplyCatalogId?: string;
  mechanicalPartCatalogId?: string;
  actionMode: string;
  vendorId: string;
  onChangeActualCost: (value: string) => void;
  onChangeResolutionNote: (value: string) => void;
  onChangeTechnicalDetailCatalogId: (value: string) => void;
  onChangeSupplyCatalogId?: (value: string) => void;
  onChangeMechanicalPartCatalogId?: (value: string) => void;
  onChangeActionMode: (value: string) => void;
  onChangeVendorId: (value: string) => void;
  onVendorOptionsChange?: (vendors: VendorOption[]) => void;
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
  const isVendorMode = String(actionMode || "").toUpperCase() === "VENDOR";

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

  const canStart =
    busyId !== issue.id &&
    Boolean(technicalDetailCatalogId) &&
    (!isVendorMode || Boolean(vendorId));

  const canComplete =
    busyId !== issue.id &&
    actualCost.trim() !== "" &&
    Boolean(technicalDetailCatalogId) &&
    (!isVendorMode || Boolean(vendorId));

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-stone-950/35" onClick={onClose} />

      <div className="h-full w-full max-w-2xl overflow-y-auto border-l border-stone-200 bg-white shadow-2xl">
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

        <div className="space-y-5 p-5">
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
              <TimelineStep label="Mở issue" value={fmtDT(issue.openedAt)} active />
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
                        {catalogOptionLabel(option)}
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
                    <VendorSelectWithQuickCreate
                      value={vendorId}
                      vendorOptions={vendorOptions}
                      onChange={onChangeVendorId}
                      onVendorsChange={onVendorOptionsChange}
                    />
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
                <div className="md:col-span-2">
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
                        {catalogOptionLabel(option)}
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
                  <VendorSelectWithQuickCreate
                    value={vendorId}
                    vendorOptions={vendorOptions}
                    onChange={onChangeVendorId}
                    onVendorsChange={onVendorOptionsChange}
                  />
                ) : null}

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
                    Vật tư / supply
                  </label>
                  <select
                    value={supplyCatalogId}
                    onChange={(e) => onChangeSupplyCatalogId?.(e.target.value)}
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
                      onChangeMechanicalPartCatalogId?.(e.target.value)
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
                  disabled={!canStart}
                  onClick={() => onAction(issue.id, "start")}
                  className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-medium text-sky-700 hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Bắt đầu xử lý
                </button>
              )}

              {issue.boardColumn === "IN_PROGRESS" && (
                <button
                  type="button"
                  disabled={!canComplete}
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
