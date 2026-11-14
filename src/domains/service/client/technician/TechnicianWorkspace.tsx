"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Search,
  ChevronRight,
  Clock3,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import {
  ADMIN_UI,
  ADMIN_DOMAIN_TONE,
  AdminPageCanvas,
  AdminPageHeader,
  AdminFlatToolbar,
} from "@/domains/shared/ui/admin-design-contract";
import { resolveMediaPreviewSrc } from "@/lib/media-profile";
import { getTechnicalIssueOperationStage } from "../../server/shared/technical-issue-stage.policy";
import {
  technicianViewLabels,
  technicianViews,
  type TechnicianView,
  type TechnicianData,
  type TechnicianIssue,
  type TechnicianCommand,
} from "../../shared/technician-workspace";
import { updateTechnicianIssue } from "../../server/technician/technician-workspace.actions";

const stageLabel = {
  INSPECT: "Chờ xác nhận",
  READY: "Sẵn sàng",
  IN_PROGRESS: "Đang làm",
  DONE: "Đã xong",
};
const parts = [
  ["MOVEMENT_COMPLETE", "Nguyên bộ máy"],
  ["MAINSPRING", "Dây cót"],
  ["GEAR", "Bánh răng"],
  ["BALANCE_WHEEL", "Bánh lắc"],
  ["BALANCE_STAFF", "Trục lắc"],
  ["HAIRSPRING", "Dây tóc"],
];
const date = (value: string) =>
  new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "Asia/Bangkok",
  }).format(new Date(value));
const money = (value: number | null) =>
  value === null
    ? "Chưa có"
    : new Intl.NumberFormat("vi-VN").format(value) + " ₫";
function IssuePhoto({ item }: { item: TechnicianIssue }) {
  const src = resolveMediaPreviewSrc(item.serviceRequest.imageUrl);
  return (
    <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-lg bg-slate-50 text-xs text-slate-400">
      {src ? (
        <Image
          src={src}
          alt=""
          width={48}
          height={48}
          unoptimized
          className="h-full w-full object-cover"
        />
      ) : (
        "TI"
      )}
    </span>
  );
}
function IssueDetail({
  item,
  data,
  onClose,
  onSaved,
  onReload,
}: {
  item: TechnicianIssue;
  data: TechnicianData;
  onClose: () => void;
  onSaved: () => void;
  onReload: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null),
    inFlight = useRef(false);
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [note, setNote] = useState(item.note),
    [resolution, setResolution] = useState(item.resolutionNote);
  const [cost, setCost] = useState(
    item.actualCost === null ? "" : String(item.actualCost / 1000),
  );
  const [detail, setDetail] = useState(item.technicalDetailCatalogId ?? ""),
    [days, setDays] = useState(String(item.expectedWorkingDays ?? 1)),
    [mode, setMode] = useState(
      item.actionMode === "VENDOR" ? "VENDOR" : "INTERNAL",
    ),
    [vendor, setVendor] = useState(item.vendorId ?? ""),
    [replacement, setReplacement] = useState<string[]>([]),
    [startedNote, setStartedNote] = useState("");
  const stage = getTechnicalIssueOperationStage(item),
    ended = stage === "DONE" || item.executionStatus === "CANCELED";
  const selectedDetail = data.details.find((option) => option.id === detail);
  useEffect(() => {
    const node = dialog.current;
    node?.showModal();
    return () => node?.close();
  }, []);
  async function run(command: TechnicianCommand) {
    if (inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    setError("");
    try {
      const result = await updateTechnicianIssue(command);
      if (!result.ok) {
        setError(result.error ?? "Chưa lưu được phiếu.");
        return;
      }
      onSaved();
    } catch {
      setError(
        "Chưa xác nhận được kết quả. Đóng và mở lại phiếu để kiểm tra trước khi thử lại.",
      );
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  }
  const base = {
    id: item.id,
    version: item.updatedAt,
    ...(note !== item.note ? { note } : {}),
  };
  const input =
    ADMIN_UI.input + " min-h-11 w-full px-3 text-sm disabled:bg-slate-50";
  return (
    <dialog
      ref={dialog}
      aria-labelledby="technician-detail-title"
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget && !busy) onClose();
      }}
      className="fixed inset-0 m-0 h-[100dvh] max-h-[100dvh] w-full max-w-full overflow-y-auto bg-white p-0 text-slate-900 backdrop:bg-slate-950/30 sm:m-auto sm:h-auto sm:max-h-[90dvh] sm:max-w-lg sm:rounded-2xl"
    >
      <div className="sticky top-0 z-10 bg-white px-4 pb-3 pt-[max(0.5rem,env(safe-area-inset-top))]">
        <button
          type="button"
          disabled={busy}
          onClick={onClose}
          className="flex min-h-11 items-center gap-1 text-sm text-slate-600 disabled:opacity-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Danh sách phiếu
        </button>
        <div className="flex gap-3">
          <IssuePhoto item={item} />
          <div className="min-w-0">
            <h2
              id="technician-detail-title"
              className="text-base font-bold text-slate-950"
            >
              {item.summary}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              {item.serviceRequest.productTitle} · {item.serviceRequest.refNo}
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-5 px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span
            className={"rounded px-2 py-1 " + ADMIN_DOMAIN_TONE.TECHNICAL.soft}
          >
            {item.executionStatus === "CANCELED" ? "Đã hủy" : stageLabel[stage]}
          </span>
          {item.expectedCompletionAt && (
            <span className="text-slate-500">
              Dự kiến {date(item.expectedCompletionAt)}
            </span>
          )}
          {item.technicianName && (
            <span className="text-slate-500">{item.technicianName}</span>
          )}
        </div>
        {error && (
          <div
            role="alert"
            className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700"
          >
            <p>{error}</p>
            <button
              type="button"
              disabled={busy}
              onClick={onReload}
              className="mt-1 min-h-11 underline"
            >
              Tải lại danh sách
            </button>
          </div>
        )}
        <section>
          <label htmlFor="ti-note" className="mb-2 block text-sm font-semibold">
            Ghi chú kỹ thuật
          </label>
          <textarea
            id="ti-note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            disabled={!data.canUpdate || ended || busy}
            rows={3}
            maxLength={4000}
            className={input + " py-2"}
          />
          {data.canUpdate && !ended && note !== item.note && (
            <button
              disabled={busy}
              type="button"
              onClick={() => void run({ ...base, action: "note", note })}
              className={
                ADMIN_UI.secondaryAction + " mt-1 min-h-11 px-2 text-sm"
              }
            >
              Lưu ghi chú
            </button>
          )}
        </section>
        {data.canUpdate && !ended && (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (stage === "INSPECT") void run({ ...base, action: "confirm" });
              else if (stage === "READY")
                void run({
                  ...base,
                  action: "start",
                  technicalDetailCatalogId: detail,
                  expectedWorkingDays: Number(days),
                  actionMode: mode as "INTERNAL" | "VENDOR",
                  vendorId: mode === "VENDOR" ? vendor : null,
                  replacementPartCodes: replacement,
                  startedNote,
                });
              else if (stage === "IN_PROGRESS")
                void run({
                  ...base,
                  action: "complete",
                  actualCost:
                    Math.round(Number(cost.replace(",", ".")) * 100000) / 100,
                  resolutionNote: resolution,
                });
            }}
            className="space-y-4"
          >
            {stage === "READY" && (
              <>
                <label className="block text-xs text-slate-500">
                  Chi tiết xử lý
                  <select
                    required
                    disabled={busy}
                    aria-label="Chi tiết xử lý"
                    value={detail}
                    onChange={(event) => {
                      setDetail(event.target.value);
                      setReplacement([]);
                    }}
                    className={input + " mt-1"}
                  >
                    <option value="">Chọn chi tiết kỹ thuật</option>
                    {data.details.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.area} · {option.name}
                      </option>
                    ))}
                  </select>
                </label>
                {selectedDetail?.code === "MOVEMENT_REPLACE_PARTS" && (
                  <fieldset className="grid grid-cols-2 gap-1">
                    <legend className="mb-1 text-xs text-slate-500">
                      Linh kiện cần thay
                    </legend>
                    {parts.map(([code, label]) => (
                      <label
                        key={code}
                        className="flex min-h-11 items-center gap-2 text-sm"
                      >
                        <input
                          disabled={busy}
                          type="checkbox"
                          checked={replacement.includes(code)}
                          onChange={(event) =>
                            setReplacement((old) =>
                              event.target.checked
                                ? [...old, code]
                                : old.filter((value) => value !== code),
                            )
                          }
                        />
                        {label}
                      </label>
                    ))}
                  </fieldset>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <label className="text-xs text-slate-500">
                    Số ngày dự kiến
                    <input
                      aria-label="Số ngày dự kiến"
                      required
                      type="number"
                      inputMode="numeric"
                      min={1}
                      max={365}
                      step={1}
                      disabled={busy}
                      value={days}
                      onChange={(event) => setDays(event.target.value)}
                      className={input + " mt-1"}
                    />
                  </label>
                  <label className="text-xs text-slate-500">
                    Thực hiện
                    <select
                      aria-label="Thực hiện"
                      disabled={busy}
                      value={mode}
                      onChange={(event) => setMode(event.target.value)}
                      className={input + " mt-1"}
                    >
                      <option value="INTERNAL">Nội bộ</option>
                      <option value="VENDOR">Vendor</option>
                    </select>
                  </label>
                </div>
                {mode === "VENDOR" && (
                  <label className="block text-xs text-slate-500">
                    Vendor
                    <select
                      aria-label="Vendor"
                      required
                      disabled={busy}
                      value={vendor}
                      onChange={(event) => setVendor(event.target.value)}
                      className={input + " mt-1"}
                    >
                      <option value="">Chọn vendor</option>
                      {data.vendors.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
                <label className="block text-xs text-slate-500">
                  Ghi chú bắt đầu
                  <textarea
                    disabled={busy}
                    value={startedNote}
                    maxLength={4000}
                    onChange={(event) => setStartedNote(event.target.value)}
                    rows={2}
                    className={input + " mt-1 py-2"}
                  />
                </label>
              </>
            )}
            {stage === "IN_PROGRESS" && (
              <>
                <label className="block text-xs text-slate-500">
                  Chi phí thực tế · nghìn ₫
                  <input
                    required
                    aria-label="Chi phí thực tế · nghìn ₫"
                    inputMode="decimal"
                    disabled={busy}
                    value={cost}
                    onChange={(event) => setCost(event.target.value)}
                    pattern="[0-9]+([.,][0-9]{1,3})?"
                    placeholder="Ví dụ: 750"
                    className={input + " mt-1"}
                  />
                </label>
                {cost && (
                  <p className="text-xs tabular-nums text-slate-500">
                    {money(Number(cost.replace(",", ".")) * 1000)}
                  </p>
                )}
                <label className="block text-xs text-slate-500">
                  Kết quả xử lý
                  <textarea
                    aria-label="Kết quả xử lý"
                    disabled={busy}
                    rows={3}
                    value={resolution}
                    maxLength={4000}
                    onChange={(event) => setResolution(event.target.value)}
                    className={input + " mt-1 py-2"}
                  />
                </label>
              </>
            )}
            <div className="sticky bottom-0 bg-white py-3">
              <button
                disabled={busy}
                type="submit"
                className={
                  ADMIN_UI.primaryAction +
                  " flex min-h-11 w-full items-center justify-center gap-2 px-4 text-sm"
                }
              >
                {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                {stage === "INSPECT"
                  ? "Xác nhận phiếu"
                  : stage === "READY"
                    ? "Bắt đầu xử lý"
                    : "Hoàn tất xử lý"}
              </button>
              {stage === "IN_PROGRESS" && (
                <p className="mt-2 text-xs text-slate-500">
                  Hoàn tất sẽ ghi nhận chi phí và tạo thanh toán theo quy trình
                  hiện tại.
                </p>
              )}
            </div>
          </form>
        )}
        {ended && (
          <div className="space-y-2 text-sm">
            <p>
              Chi phí thực tế: <strong>{money(item.actualCost)}</strong>
            </p>
            {item.resolutionNote && (
              <p className="whitespace-pre-wrap text-slate-600">
                {item.resolutionNote}
              </p>
            )}
          </div>
        )}
        <Link
          href={"/admin/services/" + encodeURIComponent(item.serviceRequest.id)}
          className="inline-flex min-h-11 items-center gap-1 text-sm text-blue-700"
        >
          Mở phiếu dịch vụ
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </dialog>
  );
}
export default function TechnicianWorkspace({
  data,
}: {
  data: TechnicianData;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition(),
    [query, setQuery] = useState(data.q),
    [selected, setSelected] = useState<TechnicianIssue | null>(null),
    [notice, setNotice] = useState("");
  useEffect(() => setQuery(data.q), [data.q]);
  function navigate(view: TechnicianView, q = query, page = 1) {
    const params = new URLSearchParams({ view, page: String(page) });
    if (q.trim()) params.set("q", q.trim());
    startTransition(() =>
      router.push("/admin/services/technician?" + params.toString(), {
        scroll: false,
      }),
    );
  }
  return (
    <AdminPageCanvas className="mx-auto max-w-3xl !px-4 pb-24">
      <Link
        href="/admin/dashboard"
        className="inline-flex min-h-9 items-center gap-1 text-xs text-slate-500"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Admin
      </Link>
      <AdminPageHeader
        title="Phiếu kỹ thuật"
        meta={
          <span className="text-xs text-slate-500">
            <strong className="text-slate-900">{data.counts.active}</strong>{" "}
            đang mở ·{" "}
            <strong className="text-blue-700">{data.counts.processing}</strong>{" "}
            đang làm
          </span>
        }
      />
      <AdminFlatToolbar>
        <form
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            navigate(data.view);
          }}
          className="flex min-w-0 items-center gap-2"
        >
          <input
            aria-label="Tìm phiếu kỹ thuật"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Đồng hồ, SKU, mã phiếu…"
            className="h-11 min-w-0 flex-1 bg-transparent px-1 text-sm outline-none"
          />
          <button
            disabled={pending}
            type="submit"
            aria-label="Tìm kiếm"
            className="grid h-11 w-9 shrink-0 place-items-center rounded text-slate-500 hover:bg-slate-100"
          >
            <Search className="h-4 w-4" />
          </button>
          <select
            aria-label="Trạng thái phiếu"
            disabled={pending}
            value={data.view}
            onChange={(event) => navigate(event.target.value as TechnicianView)}
            className="h-11 max-w-[132px] rounded-lg bg-white px-2 text-xs text-slate-700 outline-none focus:ring-2 focus:ring-blue-200"
          >
            {technicianViews.map((view) => (
              <option key={view} value={view}>
                {technicianViewLabels[view]}
              </option>
            ))}
          </select>
        </form>
      </AdminFlatToolbar>
      <div className="flex items-center justify-between text-xs text-slate-500">
        <p>
          {data.total} phiếu · {technicianViewLabels[data.view]}
        </p>
        {pending && <span role="status">Đang tải…</span>}
      </div>
      {notice && (
        <p role="status" className="text-sm text-emerald-700">
          {notice}
        </p>
      )}
      <div
        role="list"
        aria-label="Danh sách phiếu kỹ thuật"
        aria-busy={pending}
        className="divide-y divide-slate-100"
      >
        {data.items.map((item) => {
          const stage = getTechnicalIssueOperationStage(item);
          const late =
            !["DONE", "CANCELED"].includes(item.executionStatus) &&
            item.expectedCompletionAt &&
            new Date(item.expectedCompletionAt).getTime() < Date.now();
          return (
            <div role="listitem" key={item.id}>
              <button
                type="button"
                disabled={pending}
                data-technician-row={item.id}
                onClick={() => {
                  setNotice("");
                  setSelected(item);
                }}
                className="flex min-h-24 w-full items-center gap-3 py-3 text-left transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-300 disabled:opacity-60"
              >
                <IssuePhoto item={item} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-slate-950">
                    {item.serviceRequest.productTitle}
                  </span>
                  <span className="mt-1 block truncate text-xs text-slate-600">
                    {item.summary}
                  </span>
                  <span className="mt-2 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                    <span
                      className={
                        "rounded px-1.5 py-0.5 " +
                        (stage === "IN_PROGRESS"
                          ? ADMIN_DOMAIN_TONE.TECHNICAL.soft
                          : "bg-slate-100 text-slate-600")
                      }
                    >
                      {item.executionStatus === "CANCELED"
                        ? "Đã hủy"
                        : stageLabel[stage]}
                    </span>
                    {item.expectedCompletionAt && (
                      <span
                        className={
                          "inline-flex items-center gap-1 " +
                          (late ? "text-amber-700" : "")
                        }
                      >
                        <Clock3 className="h-3 w-3" />
                        {date(item.expectedCompletionAt)}
                        {late && (
                          <AlertTriangle
                            aria-label="Quá hạn"
                            className="h-3 w-3"
                          />
                        )}
                      </span>
                    )}
                    <span className="max-w-[120px] truncate font-mono text-[10px] text-slate-400">
                      {item.serviceRequest.refNo}
                    </span>
                  </span>
                </span>
                <ChevronRight
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 text-slate-300"
                />
              </button>
            </div>
          );
        })}
      </div>
      {!data.items.length && (
        <p className="py-12 text-center text-sm text-slate-500">
          Không có phiếu phù hợp.
        </p>
      )}
      {data.total > data.pageSize && (
        <nav
          aria-label="Phân trang phiếu"
          className="flex items-center justify-between py-2 text-xs text-slate-500"
        >
          <button
            disabled={pending || data.page === 1}
            onClick={() => navigate(data.view, data.q, data.page - 1)}
            className="min-h-11 rounded px-3 disabled:opacity-40"
          >
            Trước
          </button>
          <span>
            {data.page}/{Math.ceil(data.total / data.pageSize)}
          </span>
          <button
            disabled={pending || data.page * data.pageSize >= data.total}
            onClick={() => navigate(data.view, data.q, data.page + 1)}
            className="min-h-11 rounded px-3 disabled:opacity-40"
          >
            Sau
          </button>
        </nav>
      )}
      {selected && (
        <IssueDetail
          key={selected.id}
          item={selected}
          data={data}
          onClose={() => setSelected(null)}
          onReload={() => {
            setSelected(null);
            router.refresh();
          }}
          onSaved={() => {
            setSelected(null);
            setNotice("Đã cập nhật phiếu.");
            router.refresh();
          }}
        />
      )}
    </AdminPageCanvas>
  );
}
