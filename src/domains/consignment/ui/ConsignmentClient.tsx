"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, RefreshCw, ArrowLeft, Handshake, Eye } from "lucide-react";
import { ADMIN_UI } from "@/domains/shared/ui/admin-design-contract/admin-ui.tokens";
import { AdminButton } from "@/domains/shared/ui/admin-design-contract/AdminButton";
import { useAppDialog } from "@/domains/shared/feedback/AppDialogProvider";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";
import {
  readUiResponse,
  uiFeedbackMessage,
} from "@/domains/shared/feedback/read-ui-response";
import { WatchQuickPreviewTrigger } from "@/domains/shared/ui/work-object/WatchQuickPreviewTrigger";
import PaymentWorkspace from "@/domains/payment/ui/PaymentWorkspace";
import {
  consignmentAmounts,
  directionLabels,
  statusLabels,
  termLabels,
  type ConsignmentTerms,
} from "../shared/contract";
import type { listConsignments } from "../server/service";
import type { consignmentCapabilities } from "../server/access";

type Data = Awaited<ReturnType<typeof listConsignments>> & {
  capabilities: ReturnType<typeof consignmentCapabilities>;
};
type Item = Data["items"][number];
type Lookup = {
  vendors: { id: string; name: string }[];
  watches: {
    id: string;
    productId: string;
    product: { title: string; sku: string | null };
  }[];
};
const input = `${ADMIN_UI.input} min-h-10 min-w-0 w-full px-3 py-2 text-sm`;
const money = (value: number | null | undefined) =>
  value == null ? "—" : `${new Intl.NumberFormat("vi-VN").format(value)} ₫`;
function Terms({
  value,
  onChange,
  direction,
  disabled,
}: {
  value: ConsignmentTerms;
  onChange: (value: ConsignmentTerms) => void;
  direction: "IN" | "OUT";
  disabled?: boolean;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="grid min-w-0 gap-1.5 text-xs text-slate-600">
        Thỏa thuận
        <select
          disabled={disabled}
          className={input}
          value={value.mode}
          onChange={(e) =>
            onChange({
              ...value,
              mode: e.target.value as ConsignmentTerms["mode"],
            })
          }
        >
          {Object.entries(termLabels).map(([key, label]) => (
            <option key={key} value={key}>
              {key === "NET"
                ? direction === "IN"
                  ? "Chốt tiền trả người gửi"
                  : "Chốt tiền shop nhận"
                : label}
            </option>
          ))}
        </select>
      </label>
      <label className="grid min-w-0 gap-1.5 text-xs text-slate-600">
        {value.mode === "PERCENT"
          ? "Tỷ lệ phí (%)"
          : value.mode === "FIXED"
            ? direction === "IN"
              ? "Phí shop hưởng (VND)"
              : "Phí đối tác hưởng (VND)"
            : direction === "IN"
              ? "Tiền trả người gửi (VND)"
              : "Tiền shop nhận (VND)"}
        <input
          required
          disabled={disabled}
          className={input}
          type="number"
          min="0"
          max={value.mode === "PERCENT" ? 100 : 9999999999}
          step={value.mode === "PERCENT" ? "0.01" : "1"}
          value={Number.isFinite(value.value) ? value.value : ""}
          onChange={(e) =>
            onChange({
              ...value,
              value:
                e.target.value === "" ? Number.NaN : Number(e.target.value),
            })
          }
        />
      </label>
    </div>
  );
}
export default function ConsignmentClient({ data }: { data: Data }) {
  const router = useRouter(),
    params = useSearchParams(),
    notify = useNotify(),
    dialog = useAppDialog();
  const selectedId = params.get("id"),
    newDirection = params.get("new");
  const item = data.items.find((row) => row.id === selectedId);
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const [payOpen, setPayOpen] = useState(false);
  const [query, setQuery] = useState(params.get("q") || "");
  async function mutate(body: Record<string, unknown>, message: string) {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const result = await readUiResponse(
        await fetch("/api/admin/consignments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }),
        "Không thể lưu hồ sơ ký gửi. Vui lòng thử lại.",
      );
      notify.success({ message, density: "compact" });
      if (result.projectionPending)
        notify.warning({
          message: "Đã lưu hồ sơ; danh sách đồng hồ đang chờ đồng bộ.",
          density: "compact",
        });
      router.push(
        `/admin/consignments?id=${encodeURIComponent(String(result.id))}`,
      );
      router.refresh();
    } catch (failure) {
      setError(
        uiFeedbackMessage(failure, "Không thể lưu hồ sơ. Vui lòng thử lại."),
      );
    } finally {
      setBusy(false);
    }
  }
  async function command(
    row: Item,
    action: string,
    extra: Record<string, unknown> = {},
  ) {
    if (
      !(await dialog.confirm({
        title:
          (
            {
              ACTIVATE:
                row.direction === "IN"
                  ? "Xác nhận nhận đồng hồ?"
                  : "Xác nhận gửi đối tác?",
              RETURN:
                row.direction === "IN"
                  ? "Trả đồng hồ cho người gửi?"
                  : "Đã nhận lại đồng hồ từ đối tác?",
              SALE: "Chốt bán và số tiền quyết toán?",
              SETTLE: "Khóa hồ sơ đã quyết toán?",
              CANCEL: "Hủy hồ sơ nháp?",
            } as Record<string, string>
          )[action] || "Lưu thỏa thuận?",
        message:
          "Thao tác sẽ cập nhật hồ sơ và ghi lại lịch sử. Hãy kiểm tra đồng hồ, đối tác và số tiền trước khi xác nhận.",
        confirmText: "Xác nhận",
        cancelText: "Quay lại",
        tone: action === "CANCEL" ? "danger" : "default",
      }))
    )
      return;
    await mutate(
      { id: row.id, expectedVersion: row.version, action, ...extra },
      "Đã cập nhật hồ sơ ký gửi.",
    );
  }
  const back = () => router.push("/admin/consignments");
  const endpoint = item
    ? `/api/admin/acquisitions/${encodeURIComponent(item.id)}/payment`
    : "";
  async function payment(body: Record<string, unknown>) {
    if (busy) return;
    setBusy(true);
    try {
      await readUiResponse(
        await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }),
        "Không thể cập nhật thanh toán.",
      );
      notify.success({
        message: "Đã cập nhật thanh toán.",
        density: "compact",
      });
      router.refresh();
    } catch (failure) {
      notify.error({
        message: uiFeedbackMessage(failure, "Không thể cập nhật thanh toán."),
        density: "compact",
      });
      throw failure;
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="min-w-0 text-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-semibold">
          {newDirection === "IN"
            ? "Nhận ký gửi"
            : newDirection === "OUT"
              ? "Gửi đối tác"
              : item
                ? item.refNo || "Hồ sơ ký gửi"
                : "Ký gửi"}
        </h2>
        <div className="flex flex-wrap gap-2">
          {selectedId || newDirection ? (
            <AdminButton
              variant="quiet"
              type="button"
              onClick={back}
              disabled={busy}
            >
              <ArrowLeft className="h-4 w-4" />
              Danh sách
            </AdminButton>
          ) : (
            data.capabilities.create && (
              <>
                <AdminButton
                  variant="secondary"
                  type="button"
                  onClick={() => router.push("/admin/consignments?new=OUT")}
                >
                  <Plus className="h-4 w-4" />
                  Gửi đối tác
                </AdminButton>
                <AdminButton
                  variant="primary"
                  type="button"
                  onClick={() => router.push("/admin/consignments?new=IN")}
                >
                  <Plus className="h-4 w-4" />
                  Nhận ký gửi
                </AdminButton>
              </>
            )
          )}
        </div>
      </div>
      {error && (
        <p role="alert" className="mb-4 text-sm text-rose-700">
          {error}
        </p>
      )}
      {newDirection === "IN" || newDirection === "OUT" ? (
        data.capabilities.create ? (
          <CreateForm
            key={newDirection}
            direction={newDirection}
            productId={params.get("productId") || ""}
            busy={busy}
            onSave={(body) =>
              mutate(
                { action: "CREATE", ...body },
                "Đã tạo hồ sơ nháp. Kiểm tra và xác nhận nhận/gửi.",
              )
            }
          />
        ) : (
          <p>Bạn không có quyền tạo hồ sơ ký gửi.</p>
        )
      ) : item ? (
        <>
          <div className="mb-6 flex flex-wrap items-start gap-3 border-b border-slate-100 pb-4">
            <Handshake className="mt-1 h-5 w-5 text-slate-500" />
            <div className="min-w-0 flex-1">
              <WatchQuickPreviewTrigger
                watch={{
                  productId: item.watchId || item.productId,
                  label: item.title,
                  imageUrl: item.imageUrl,
                }}
                className="max-w-full text-left text-base font-semibold text-blue-700 underline-offset-4 hover:underline"
              >
                {item.title}
                <Eye className="ml-2 inline h-4 w-4" />
              </WatchQuickPreviewTrigger>
              <p className="mt-1 text-xs text-slate-500">
                {directionLabels[item.direction]} · {item.vendorName} ·{" "}
                {statusLabels[item.status]}
              </p>
            </div>
          </div>
          <Detail
            key={item.id}
            item={item}
            busy={busy}
            caps={data.capabilities}
            onCommand={command}
            onPayment={() => setPayOpen(true)}
          />
          {item.note && (
            <section className="mt-6 border-t border-slate-100 pt-4">
              <h3 className="mb-2 font-semibold">Ghi chú</h3>
              <p className="whitespace-pre-wrap break-words text-slate-600">
                {item.note}
              </p>
            </section>
          )}
          <section className="mt-6 border-t border-slate-100 pt-4">
            <h3 className="mb-3 font-semibold">Lịch sử</h3>
            <ul className="space-y-2 text-xs text-slate-500">
              {item.history.map((event, index) => (
                <li key={index}>
                  {(
                    {
                      CREATE: "Lập hồ sơ",
                      TERMS: "Cập nhật thỏa thuận",
                      ACTIVATE: "Xác nhận nhận / gửi",
                      RETURN: "Trả / nhận lại",
                      SALE: "Chốt bán",
                      SETTLE: "Khóa quyết toán",
                      CANCEL: "Hủy hồ sơ",
                    } as Record<string, string>
                  )[event.action] || event.action}{" "}
                  ·{" "}
                  {new Intl.DateTimeFormat("vi-VN", {
                    dateStyle: "short",
                    timeStyle: "short",
                    timeZone: "Asia/Ho_Chi_Minh",
                  }).format(new Date(event.at))}
                </li>
              ))}
            </ul>
          </section>
        </>
      ) : selectedId ? (
        <p role="alert">
          Không tìm thấy hồ sơ ký gửi.{" "}
          <Link href="/admin/consignments" className="text-blue-700">
            Về danh sách
          </Link>
        </p>
      ) : (
        <>
          <form
            className="mb-4 flex flex-wrap gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const next = new URLSearchParams(params.toString());
              next.delete("page");
              if (query.trim()) next.set("q", query.trim());
              else next.delete("q");
              router.push(`/admin/consignments?${next}`);
            }}
          >
            <input
              className={`${input} min-w-0 flex-1`}
              aria-label="Tìm hồ sơ ký gửi"
              placeholder="Tìm mã hồ sơ, đồng hồ hoặc đối tác…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <AdminButton type="submit">Tìm</AdminButton>
            <AdminButton
              type="button"
              variant="quiet"
              onClick={() => router.refresh()}
            >
              <RefreshCw className="h-4 w-4" />
              Làm mới
            </AdminButton>
          </form>
          <p className="mb-2 text-xs text-slate-500">{data.total} hồ sơ</p>
          {!data.items.length ? (
            <p className="py-12 text-center text-slate-500">
              Chưa có hồ sơ phù hợp. Chọn Nhận ký gửi hoặc Gửi đối tác để bắt
              đầu.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100 border-t border-slate-100">
              {data.items.map((row) => (
                <li
                  key={row.id}
                  className="flex flex-wrap items-center gap-3 py-4"
                >
                  <WatchQuickPreviewTrigger
                    watch={{
                      productId: row.watchId || row.productId,
                      label: row.title,
                      imageUrl: row.imageUrl,
                    }}
                    className="min-w-0 flex-1 text-left"
                  >
                    <span className="block break-words font-semibold">
                      {row.title}
                    </span>
                    <span className="mt-1 block text-xs text-slate-500">
                      {row.refNo} · {row.vendorName}
                    </span>
                  </WatchQuickPreviewTrigger>
                  <div className="min-w-36 text-xs">
                    <p>{directionLabels[row.direction]}</p>
                    <p className="mt-1 text-slate-500">
                      {statusLabels[row.status]}
                    </p>
                  </div>
                  {data.canReadMoney && (
                    <div className="min-w-28 text-right text-xs tabular-nums">
                      <p>
                        {row.soldAmount == null
                          ? "Chưa chốt bán"
                          : money(row.net)}
                      </p>
                      {row.soldAmount != null && (
                        <p className="mt-1 text-slate-500">
                          Còn {money(row.remaining)}
                        </p>
                      )}
                    </div>
                  )}
                  <AdminButton
                    type="button"
                    variant="quiet"
                    onClick={() =>
                      router.push(
                        `/admin/consignments?id=${encodeURIComponent(row.id)}`,
                      )
                    }
                  >
                    Mở hồ sơ
                  </AdminButton>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 flex items-center justify-end gap-3">
            <AdminButton
              type="button"
              disabled={data.page <= 1}
              onClick={() => {
                const next = new URLSearchParams(params.toString());
                next.set("page", String(data.page - 1));
                router.push(`/admin/consignments?${next}`);
              }}
            >
              Trước
            </AdminButton>
            <span className="text-xs">Trang {data.page}</span>
            <AdminButton
              type="button"
              disabled={data.page * data.pageSize >= data.total}
              onClick={() => {
                const next = new URLSearchParams(params.toString());
                next.set("page", String(data.page + 1));
                router.push(`/admin/consignments?${next}`);
              }}
            >
              Sau
            </AdminButton>
          </div>
        </>
      )}
      {item && payOpen && data.capabilities.paymentView && (
        <PaymentWorkspace
          open
          allowComplete={
            data.capabilities.paymentUpdate && item.status === "SOLD"
          }
          owner={{
            type: "ACQUISITION",
            id: item.id,
            code: item.refNo,
            title: item.title,
            direction: item.direction === "IN" ? "OUT" : "IN",
            totalAmount: item.net,
            remainingAmount: item.remaining,
            listEndpoint: endpoint,
            disableCreate:
              !data.capabilities.paymentCreate || item.status !== "SOLD",
            createDisabledMessage:
              "Chỉ tạo thanh toán khi đã chốt bán và có quyền tạo khoản thu/chi.",
          }}
          submitting={busy}
          onClose={() => setPayOpen(false)}
          onUpdated={() => router.refresh()}
          onCreatePayment={(body) => payment({ ...body, markPaidNow: false })}
          onCompletePayment={(body) => {
            if (!data.capabilities.paymentUpdate)
              return Promise.reject(
                Error("Không có quyền hoàn tất thanh toán."),
              );
            return payment({ ...body, action: "complete" });
          }}
        />
      )}
    </div>
  );
}
function CreateForm({
  direction,
  productId,
  busy,
  onSave,
}: {
  direction: "IN" | "OUT";
  productId: string;
  busy: boolean;
  onSave: (body: Record<string, unknown>) => Promise<void>;
}) {
  const [receipt] = useState(() => crypto.randomUUID()),
    [lookup, setLookup] = useState<Lookup>({ vendors: [], watches: [] }),
    [lookupError, setLookupError] = useState(""),
    [q, setQ] = useState(""),
    [vendorId, setVendorId] = useState(""),
    [selectedProduct, setSelectedProduct] = useState(productId),
    [title, setTitle] = useState(""),
    [terms, setTerms] = useState<ConsignmentTerms>({
      mode: "PERCENT",
      value: Number.NaN,
    }),
    [note, setNote] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      void fetch(
        `/api/admin/consignments?lookup=1&q=${encodeURIComponent(q)}&productId=${encodeURIComponent(productId)}`,
        { signal: controller.signal, cache: "no-store" },
      )
        .then((r) => readUiResponse(r, "Không tải được Danh bạ / đồng hồ."))
        .then((value) => {
          if (controller.signal.aborted) return;
          if (!Array.isArray(value.vendors) || !Array.isArray(value.watches))
            throw Error("Invalid lookup");
          const result = value as unknown as Lookup;
          setLookup((current) => {
            const vendor = current.vendors.find((row) => row.id === vendorId);
            const watch = current.watches.find(
              (row) => row.productId === selectedProduct,
            );
            return {
              vendors:
                vendor && !result.vendors.some((row) => row.id === vendor.id)
                  ? [vendor, ...result.vendors]
                  : result.vendors,
              watches:
                watch &&
                !result.watches.some((row) => row.productId === watch.productId)
                  ? [watch, ...result.watches]
                  : result.watches,
            };
          });
          setLookupError("");
        })
        .catch(() => {
          if (!controller.signal.aborted)
            setLookupError(
              "Không tải được Danh bạ / đồng hồ. Kiểm tra kết nối hoặc tải lại trang.",
            );
        });
    }, 200);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [q, productId, vendorId, selectedProduct]);
  return (
    <form
      className="max-w-3xl space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        void onSave({
          requestId: receipt,
          direction,
          vendorId,
          productId: direction === "OUT" ? selectedProduct : undefined,
          title: direction === "IN" ? title : undefined,
          terms,
          note,
        });
      }}
    >
      <p className="text-xs text-slate-500">
        {direction === "IN"
          ? "Tạo một đồng hồ nhận ký gửi mới; chỉ nhập kho khi bạn xác nhận đã nhận."
          : "Lập hồ sơ với đồng hồ đang trong kho; chỉ chuyển sang gửi đối tác sau khi xác nhận."}
      </p>
      <label className="grid min-w-0 gap-1.5 text-xs text-slate-600">
        Tìm người gửi / đối tác hoặc đồng hồ
        <input
          className={input}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Nhập tên để tìm trong Danh bạ và kho…"
        />
      </label>
      {lookupError && (
        <p role="alert" className="text-rose-700">
          {lookupError}
        </p>
      )}
      <label className="grid min-w-0 gap-1.5 text-xs text-slate-600">
        {direction === "IN" ? "Người gửi" : "Đối tác nhận"}
        <select
          required
          disabled={busy}
          className={input}
          value={vendorId}
          onChange={(e) => setVendorId(e.target.value)}
        >
          <option value="">Chọn trong Danh bạ</option>
          {lookup.vendors.map((vendor) => (
            <option key={vendor.id} value={vendor.id}>
              {vendor.name}
            </option>
          ))}
        </select>
      </label>
      <p className="text-xs text-slate-500">
        Chưa có người liên hệ?{" "}
        <Link
          href="/admin/vendors"
          target="_blank"
          className="text-blue-700 underline"
        >
          Thêm trong Danh bạ
        </Link>
        , rồi tìm lại tên tại đây.
      </p>
      {direction === "IN" ? (
        <label className="grid min-w-0 gap-1.5 text-xs text-slate-600">
          Tên đồng hồ nhận ký gửi
          <input
            required
            disabled={busy}
            className={input}
            value={title}
            maxLength={200}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
      ) : (
        <label className="grid min-w-0 gap-1.5 text-xs text-slate-600">
          Đồng hồ gửi đối tác
          <select
            required
            disabled={busy}
            className={input}
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
          >
            <option value="">Chọn đồng hồ trong kho</option>
            {lookup.watches.map((watch) => (
              <option key={watch.productId} value={watch.productId}>
                {watch.product.title}
                {watch.product.sku ? ` · ${watch.product.sku}` : ""}
              </option>
            ))}
          </select>
        </label>
      )}
      <Terms
        direction={direction}
        value={terms}
        onChange={setTerms}
        disabled={busy}
      />
      <p className="text-xs text-slate-500">
        Phí thuộc {direction === "IN" ? "shop" : "đối tác"}; phần còn lại trả
        cho {direction === "IN" ? "người gửi" : "shop"}. Kiểm tra kỹ thỏa thuận
        trước khi xác nhận.
      </p>
      <label className="grid min-w-0 gap-1.5 text-xs text-slate-600">
        Ghi chú thỏa thuận
        <textarea
          disabled={busy}
          className={input}
          rows={3}
          maxLength={4000}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </label>
      <AdminButton variant="primary" type="submit" disabled={busy}>
        {busy ? "Đang tạo…" : "Tạo hồ sơ nháp"}
      </AdminButton>
    </form>
  );
}
function Detail({
  item,
  busy,
  caps,
  onCommand,
  onPayment,
}: {
  item: Item;
  busy: boolean;
  caps: Data["capabilities"];
  onCommand: (
    item: Item,
    action: string,
    extra?: Record<string, unknown>,
  ) => Promise<void>;
  onPayment: () => void;
}) {
  const [terms, setTerms] = useState<ConsignmentTerms>(
      item.terms || { mode: "PERCENT", value: 0 },
    ),
    [saleAmount, setSaleAmount] = useState(""),
    [reference, setReference] = useState(""),
    [orders, setOrders] = useState<
      { id: string; label: string; amount: number }[]
    >([]),
    [orderId, setOrderId] = useState(""),
    [loadError, setLoadError] = useState(""),
    [ordersAttempt, setOrdersAttempt] = useState(0);
  useEffect(() => {
    if (item.direction !== "IN" || item.status !== "ACTIVE" || !caps.approve)
      return;
    const controller = new AbortController();
    void fetch(
      `/api/admin/consignments?saleOrders=${encodeURIComponent(item.id)}`,
      { signal: controller.signal, cache: "no-store" },
    )
      .then((r) => readUiResponse(r, "Không tải được đơn hàng."))
      .then((r) => {
        if (!Array.isArray(r.orders)) throw Error("Invalid orders");
        setOrders(r.orders as typeof orders);
        setLoadError("");
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setLoadError("Không tải được đơn hàng. Tải lại trang để thử lại.");
      });
    return () => controller.abort();
  }, [item.id, item.direction, item.status, caps.approve, ordersAttempt]);
  const amount =
    item.direction === "IN"
      ? orders.find((order) => order.id === orderId)?.amount
      : Number(saleAmount);
  let preview: string = "";
  if (amount && item.terms) {
    try {
      const split = consignmentAmounts(amount, item.terms);
      preview = `Phí ${item.direction === "IN" ? "shop" : "đối tác"} hưởng: ${money(split.fee)} · ${item.direction === "IN" ? "Trả người gửi" : "Shop nhận"}: ${money(split.net)}`;
    } catch {
      preview = "Giá bán chưa đủ số tiền thỏa thuận.";
    }
  }
  return (
    <div className="space-y-6">
      {item.terms ? (
        <section className="space-y-3">
          <h3 className="font-semibold">Thỏa thuận</h3>
          <Terms
            direction={item.direction}
            value={terms}
            onChange={setTerms}
            disabled={
              busy || !caps.edit || !["DRAFT", "ACTIVE"].includes(item.status)
            }
          />
          {caps.edit && ["DRAFT", "ACTIVE"].includes(item.status) && (
            <AdminButton
              type="button"
              disabled={busy}
              onClick={() => onCommand(item, "TERMS", { terms })}
            >
              Lưu thỏa thuận
            </AdminButton>
          )}
        </section>
      ) : (
        <p className="text-slate-500">
          Bạn không có quyền xem điều khoản tài chính.
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {item.status === "DRAFT" && caps.approve && (
          <AdminButton
            variant="primary"
            type="button"
            disabled={busy}
            onClick={() => onCommand(item, "ACTIVATE")}
          >
            {item.direction === "IN"
              ? "Xác nhận đã nhận đồng hồ"
              : "Xác nhận đã gửi đối tác"}
          </AdminButton>
        )}
        {item.status === "DRAFT" && caps.cancel && (
          <AdminButton
            type="button"
            variant="quiet"
            disabled={busy}
            onClick={() => onCommand(item, "CANCEL")}
          >
            Hủy hồ sơ
          </AdminButton>
        )}
        {item.status === "ACTIVE" && caps.approve && (
          <AdminButton
            type="button"
            disabled={busy}
            onClick={() => onCommand(item, "RETURN")}
          >
            {item.direction === "IN"
              ? "Trả lại người gửi"
              : "Nhận lại từ đối tác"}
          </AdminButton>
        )}
      </div>
      {item.status === "ACTIVE" && caps.approve && (
        <section className="space-y-3 border-t border-slate-100 pt-4">
          <h3 className="font-semibold">Chốt bán</h3>
          {item.direction === "IN" ? (
            <>
              <p className="text-xs text-slate-500">
                Bán qua Đơn hàng như bình thường, sau đó chọn đúng đơn đã bán ở
                đây.
              </p>
              <label className="grid min-w-0 gap-1.5 text-xs text-slate-600">
                Đơn hàng đã bán
                <select
                  className={input}
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                >
                  <option value="">Chọn đơn chứa đồng hồ này</option>
                  {orders.map((order) => (
                    <option key={order.id} value={order.id}>
                      {order.label} · {money(order.amount)}
                    </option>
                  ))}
                </select>
              </label>
              <AdminButton
                type="button"
                variant="quiet"
                density="compact"
                disabled={busy}
                onClick={() => setOrdersAttempt((v) => v + 1)}
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Làm mới đơn hàng
              </AdminButton>
              {loadError && (
                <p role="alert" className="text-rose-700">
                  {loadError}
                </p>
              )}
            </>
          ) : (
            <>
              <label className="grid min-w-0 gap-1.5 text-xs text-slate-600">
                Giá đối tác đã bán (VND)
                <input
                  className={input}
                  type="number"
                  min="1"
                  max="9999999999"
                  step="1"
                  value={saleAmount}
                  onChange={(e) => setSaleAmount(e.target.value)}
                />
              </label>
              <label className="grid min-w-0 gap-1.5 text-xs text-slate-600">
                Xác nhận / tham chiếu bán từ đối tác
                <input
                  className={input}
                  maxLength={240}
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                />
              </label>
            </>
          )}
          {preview && (
            <p className="rounded-lg bg-blue-50 px-3 py-2 text-xs tabular-nums">
              {preview}
            </p>
          )}
          <AdminButton
            variant="primary"
            type="button"
            disabled={
              busy ||
              !amount ||
              (item.direction === "IN" ? !orderId : !reference.trim())
            }
            onClick={() =>
              onCommand(
                item,
                "SALE",
                item.direction === "IN"
                  ? { orderId }
                  : {
                      saleAmount: Number(saleAmount),
                      saleReference: reference,
                    },
              )
            }
          >
            Chốt bán & số tiền quyết toán
          </AdminButton>
        </section>
      )}
      {(item.status === "SOLD" || item.status === "SETTLED") && (
        <section className="space-y-3 border-t border-slate-100 pt-4">
          <h3 className="font-semibold">Quyết toán</h3>
          <dl className="grid gap-3 text-xs tabular-nums sm:grid-cols-3">
            <div>
              <dt className="text-slate-500">Giá đã bán</dt>
              <dd className="mt-1 font-semibold">{money(item.soldAmount)}</dd>
            </div>
            <div>
              <dt className="text-slate-500">
                {item.direction === "IN"
                  ? "Trả người gửi"
                  : "Shop nhận từ đối tác"}
              </dt>
              <dd className="mt-1 font-semibold">{money(item.net)}</dd>
            </div>
            <div>
              <dt className="text-slate-500">
                Còn phải {item.direction === "IN" ? "chi" : "thu"}
              </dt>
              <dd className="mt-1 font-semibold">{money(item.remaining)}</dd>
            </div>
          </dl>
          <div className="flex flex-wrap gap-2">
            {caps.paymentView && (
              <AdminButton type="button" disabled={busy} onClick={onPayment}>
                Quản lý{" "}
                {item.direction === "IN"
                  ? "chi trả người gửi"
                  : "thu từ đối tác"}
              </AdminButton>
            )}
            {item.status === "SOLD" && caps.approve && (
              <AdminButton
                variant="primary"
                type="button"
                disabled={busy || item.remaining !== 0}
                onClick={() => onCommand(item, "SETTLE")}
              >
                Xác nhận đã quyết toán
              </AdminButton>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
