"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Package, Plus, Save, Search, Trash2, Truck, UserRound, Wallet } from "lucide-react";

import GuardNotice from "@/domains/shared/feedback/GuardNotice";
import InlineNotice from "@/domains/shared/feedback/InlineNotice";
import { useAppDialog } from "@/domains/shared/feedback/AppDialogProvider";
import { useAppProgress } from "@/domains/shared/feedback/AppProgressProvider";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";
import { Button, Input, Select, Textarea, Toggle } from "@/domains/shared/ui/form/fields";
import { SectionCard } from "@/domains/shared/ui/surface/card";
import OrderInventoryNotice from "@/domains/order/shared/OrderInventoryNotice";
import OrderPageHeader from "@/domains/order/ui/OrderPageHeader";
import { fmtMoney } from "@/domains/order/ui/order-ui.helpers";

type ServiceOption = { id: string; code?: string | null; name: string; defaultPrice?: number | null; isActive?: boolean };
type ProductSearchItem = { id: string; title: string; price: number; primaryImageUrl?: string | null; variantId?: string | null; availabilityStatus?: string | null };
type FormItem = {
  id?: string;
  kind: "PRODUCT" | "SERVICE";
  productId?: string | null;
  variantId?: string | null;
  title: string;
  quantity: number;
  listPrice: number;
  unitPriceAgreed: number;
  img?: string | null;
  serviceCatalogId?: string | null;
  serviceScope?: "WITH_PURCHASE" | "CUSTOMER_ITEM" | null;
  linkedOrderItemId?: string | null;
  customerItemNote?: string | null;
};

type Props = { mode: "create" | "edit"; orderId?: string; initialData?: any; services?: ServiceOption[]; backHref?: string; backLabel?: string };

function normalizeInitialItems(initialData: any): FormItem[] {
  if (!Array.isArray(initialData?.items)) return [];
  return initialData.items.map((it: any) => ({
    id: it.id,
    kind: (it.kind || "PRODUCT") as "PRODUCT" | "SERVICE",
    productId: it.productId ?? null,
    variantId: it.variantId ?? null,
    title: it.title ?? "",
    quantity: Number(it.quantity ?? 1),
    listPrice: Number(it.listPrice ?? it.unitPriceAgreed ?? 0),
    unitPriceAgreed: Number(it.unitPriceAgreed ?? it.listPrice ?? 0),
    img: it.img ?? null,
    serviceCatalogId: it.serviceCatalogId ?? null,
    serviceScope: it.serviceScope ?? null,
    linkedOrderItemId: it.linkedOrderItemId ?? null,
    customerItemNote: it.customerItemNote ?? null,
  }));
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">{label}</span>{children}</label>;
}

function numberValue(value: string) {
  const n = Number(String(value).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export default function OrderFormClient({ mode, orderId, initialData, services = [], backHref = "/admin/orders", backLabel = "← Danh sách" }: Props) {
  const isEdit = mode === "edit";
  const router = useRouter();
  const sp = useSearchParams();
  const notify = useNotify();
  const dialog = useAppDialog();
  const progress = useAppProgress();
  const quickApplied = useRef(false);

  const [customerName, setCustomerName] = useState(initialData?.customerName ?? "");
  const [shipPhone, setShipPhone] = useState(initialData?.shipPhone ?? "");
  const [hasShipment, setHasShipment] = useState(Boolean(initialData?.hasShipment ?? false));
  const [shipAddress, setShipAddress] = useState(initialData?.shipAddress ?? "");
  const [shipCity, setShipCity] = useState(initialData?.shipCity ?? "");
  const [shipDistrict, setShipDistrict] = useState(initialData?.shipDistrict ?? "");
  const [shipWard, setShipWard] = useState(initialData?.shipWard ?? "");
  const [paymentMethod, setPaymentMethod] = useState(initialData?.paymentMethod ?? "BANK_TRANSFER");
  const [notes, setNotes] = useState(initialData?.notes ?? "");
  const [reserveType, setReserveType] = useState(initialData?.reserve?.type ?? "");
  const [reserveAmount, setReserveAmount] = useState(Number(initialData?.reserve?.amount ?? 0));
  const [reserveExpiresAt, setReserveExpiresAt] = useState(() => initialData?.reserve?.expiresAt ? new Date(initialData.reserve.expiresAt).toISOString().slice(0, 16) : "");
  const [items, setItems] = useState<FormItem[]>(() => normalizeInitialItems(initialData));
  const [productQuery, setProductQuery] = useState("");
  const [productResults, setProductResults] = useState<ProductSearchItem[]>([]);
  const [searching, setSearching] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const quickMode = !isEdit && String(sp.get("mode") || "").toLowerCase() === "quick";
  const quickProductId = sp.get("productId");

  useEffect(() => {
    if (!quickMode || quickApplied.current || !quickProductId) return;
    quickApplied.current = true;
    const price = Number(sp.get("listPrice") || 0);
    setItems((prev) => prev.some((it) => it.productId === quickProductId) ? prev : [
      ...prev,
      { kind: "PRODUCT", productId: quickProductId, variantId: null, title: sp.get("title") || "Sản phẩm", quantity: 1, listPrice: Number.isFinite(price) ? price : 0, unitPriceAgreed: Number.isFinite(price) ? price : 0, img: sp.get("img") || null },
    ]);
  }, [quickMode, quickProductId, sp]);

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + Number(item.quantity || 1) * Number(item.unitPriceAgreed || 0), 0), [items]);
  const canEdit = !initialData?.status || initialData?.status === "DRAFT" || initialData?.status === "RESERVED";

  async function searchProduct() {
    const q = productQuery.trim();
    if (!q) return;
    setSearching(true);
    try {
      const res = await fetch(`/api/admin/products/search?q=${encodeURIComponent(q)}`);
      const json = await res.json().catch(() => null);
      setProductResults(Array.isArray(json?.items) ? json.items : []);
    } catch {
      notify.error("Không thể tìm sản phẩm");
    } finally {
      setSearching(false);
    }
  }

  function addProduct(product: ProductSearchItem) {
    if (items.some((item) => item.productId === product.id)) {
      notify.warning("Sản phẩm đã nằm trong đơn");
      return;
    }
    setItems((prev) => [...prev, { kind: "PRODUCT", productId: product.id, variantId: product.variantId ?? null, title: product.title, quantity: 1, listPrice: Number(product.price || 0), unitPriceAgreed: Number(product.price || 0), img: product.primaryImageUrl ?? null }]);
  }

  function addService(service: ServiceOption) {
    setItems((prev) => [...prev, { kind: "SERVICE", productId: null, variantId: null, title: service.name, quantity: 1, listPrice: Number(service.defaultPrice || 0), unitPriceAgreed: Number(service.defaultPrice || 0), serviceCatalogId: service.id, serviceScope: "CUSTOMER_ITEM" }]);
  }

  function updateItem(index: number, patch: Partial<FormItem>) {
    setItems((prev) => prev.map((item, i) => i === index ? { ...item, ...patch } : item));
  }

  async function submit() {
    if (!canEdit) {
      notify.warning("Đơn đã khóa, không thể chỉnh sửa trực tiếp.");
      return;
    }
    if (!customerName.trim()) {
      notify.warning("Vui lòng nhập tên khách hàng");
      return;
    }
    if (!items.length) {
      notify.warning("Vui lòng thêm ít nhất một sản phẩm hoặc dịch vụ");
      return;
    }
    if (hasShipment && !shipCity.trim()) {
      notify.warning("Vui lòng nhập tỉnh/thành phố khi có giao hàng");
      return;
    }

    const ok = await dialog.confirm({
      title: isEdit ? "Lưu thay đổi đơn hàng?" : "Tạo đơn hàng?",
      message: quickMode ? "Đơn này được tạo từ Watch bridge. Sau khi duyệt sẽ sync Watch sang SOLD." : "Order sẽ là nguồn trạng thái HOLD/SOLD cho watch liên quan.",
      confirmText: isEdit ? "Lưu thay đổi" : "Tạo đơn",
    });
    if (!ok) return;

    setSubmitting(true);
    progress.show({ title: "Đang lưu đơn hàng", message: "Đang xử lý qua order domain" });
    try {
      const payload = {
        customerName: customerName.trim(),
        shipPhone: shipPhone.trim(),
        hasShipment,
        shipAddress: shipAddress.trim(),
        shipCity: shipCity.trim(),
        shipDistrict: shipDistrict.trim(),
        shipWard: shipWard.trim(),
        paymentMethod,
        notes: notes.trim() || null,
        status: initialData?.status ?? "DRAFT",
        reserve: reserveType ? { type: reserveType, amount: Number(reserveAmount || 0), expiresAt: reserveExpiresAt ? new Date(reserveExpiresAt).toISOString() : null } : null,
        quickFromProductId: quickMode ? quickProductId ?? null : null,
        quickFlowType: quickMode ? "QUICK_ORDER" : "STANDARD",
        items: items.map((item) => ({
          id: item.id,
          kind: item.kind,
          productId: item.productId ?? null,
          variantId: item.variantId ?? null,
          title: item.title,
          quantity: Number(item.quantity || 1),
          listPrice: Number(item.listPrice || 0),
          unitPriceAgreed: Number(item.unitPriceAgreed || 0),
          img: item.img ?? null,
          serviceCatalogId: item.serviceCatalogId ?? null,
          serviceScope: item.kind === "SERVICE" ? item.serviceScope ?? "CUSTOMER_ITEM" : null,
          linkedOrderItemId: item.kind === "SERVICE" && item.serviceScope === "WITH_PURCHASE" ? item.linkedOrderItemId ?? null : null,
          customerItemNote: item.kind === "SERVICE" && item.serviceScope === "CUSTOMER_ITEM" ? item.customerItemNote ?? null : null,
          createdFromFlow: quickMode ? "QUICK_ORDER" : "STANDARD",
        })),
      };

      const res = await fetch(isEdit ? `/api/admin/orders/${orderId}` : "/api/admin/orders", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error || "Lưu đơn hàng thất bại");
      notify.success({ title: "Đã lưu đơn", message: "Order đã được lưu qua domain mới." });
      router.push(`/admin/orders/${isEdit ? orderId : json?.id}`);
      router.refresh();
    } catch (error: any) {
      notify.error({ title: "Không thể lưu đơn", message: error?.message || "Có lỗi xảy ra" });
    } finally {
      progress.hide();
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-5 px-4 pt-6 lg:px-6">
      <OrderPageHeader
        eyebrow={quickMode ? "Watch bridge" : "Order form"}
        title={isEdit ? "Chỉnh sửa đơn hàng" : quickMode ? "Tạo đơn nhanh từ Watch" : "Tạo đơn hàng"}
        description={quickMode ? "Sản phẩm watch đã được prefill từ bridge. Order sẽ giữ vai trò source of truth cho HOLD/SOLD." : "Form mới dùng shared UI/feedback, không dùng alert/window confirm thô."}
        backHref={backHref}
        backLabel={backLabel}
        actions={<Button type="button" onClick={submit} disabled={submitting || !canEdit}><Save className="mr-2 h-4 w-4" />{submitting ? "Đang lưu..." : "Lưu đơn"}</Button>}
      />

      {initialData?.status ? <OrderInventoryNotice status={initialData.status} /> : <InlineNotice title="Đơn mới sẽ bắt đầu ở DRAFT/HOLD" description="Khi duyệt đơn, hệ thống sync sang SOLD cho watch liên quan." />}
      {!canEdit ? <GuardNotice title="Đơn đã khóa chỉnh sửa" message="Đơn không còn ở DRAFT/RESERVED. Hãy thao tác qua action của order để giữ đồng bộ tồn kho watch." tone="locked" icon="lock" /> : null}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_380px]">
        <div className="space-y-5">
          <SectionCard icon={<UserRound className="h-5 w-5" />} title="Khách hàng" subtitle="Thông tin cơ bản để tạo đơn">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Tên khách hàng"><Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} disabled={!canEdit} /></Field>
              <Field label="Số điện thoại"><Input value={shipPhone} onChange={(e) => setShipPhone(e.target.value)} disabled={!canEdit} /></Field>
              <Field label="Phương thức thanh toán"><Select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} disabled={!canEdit} options={[{ value: "BANK_TRANSFER", label: "Chuyển khoản" }, { value: "CASH", label: "Tiền mặt" }, { value: "COD", label: "COD" }]} /></Field>
              <Field label="Loại giữ hàng"><Select value={reserveType} onChange={(e) => setReserveType(e.target.value)} disabled={!canEdit} placeholder="Không giữ hàng" options={[{ value: "DEPOSIT", label: "Cọc giữ hàng" }, { value: "COD", label: "COD" }]} /></Field>
              {reserveType ? <Field label="Số tiền cọc"><Input inputMode="numeric" value={String(reserveAmount)} onChange={(e) => setReserveAmount(numberValue(e.target.value))} disabled={!canEdit} /></Field> : null}
              {reserveType ? <Field label="Giữ đến"><Input type="datetime-local" value={reserveExpiresAt} onChange={(e) => setReserveExpiresAt(e.target.value)} disabled={!canEdit} /></Field> : null}
            </div>
          </SectionCard>

          <SectionCard icon={<Truck className="h-5 w-5" />} title="Giao hàng" subtitle="Bật khi đơn có vận chuyển">
            <div className="space-y-4">
              <Toggle checked={hasShipment} onChange={setHasShipment} label="Có giao hàng" />
              {hasShipment ? <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Địa chỉ"><Input value={shipAddress} onChange={(e) => setShipAddress(e.target.value)} disabled={!canEdit} /></Field>
                <Field label="Tỉnh / thành"><Input value={shipCity} onChange={(e) => setShipCity(e.target.value)} disabled={!canEdit} /></Field>
                <Field label="Quận / huyện"><Input value={shipDistrict} onChange={(e) => setShipDistrict(e.target.value)} disabled={!canEdit} /></Field>
                <Field label="Phường / xã"><Input value={shipWard} onChange={(e) => setShipWard(e.target.value)} disabled={!canEdit} /></Field>
              </div> : null}
            </div>
          </SectionCard>

          <SectionCard icon={<Package className="h-5 w-5" />} title="Sản phẩm / dịch vụ" subtitle="Thêm watch, sản phẩm hoặc dịch vụ vào đơn">
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_auto]">
                  <Input value={productQuery} onChange={(e) => setProductQuery(e.target.value)} placeholder="Tìm sản phẩm theo SKU / title" disabled={!canEdit} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); searchProduct(); } }} />
                  <Button type="button" variant="outline" onClick={searchProduct} disabled={searching || !canEdit}><Search className="mr-2 h-4 w-4" />{searching ? "Đang tìm..." : "Tìm"}</Button>
                </div>
                {productResults.length ? <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
                  {productResults.map((product) => <button key={product.id} type="button" onClick={() => addProduct(product)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-left transition hover:bg-slate-50">
                    <div className="text-sm font-semibold text-slate-900">{product.title}</div>
                    <div className="mt-1 text-xs text-slate-500">{fmtMoney(product.price)}</div>
                  </button>)}
                </div> : null}
              </div>

              {services.length ? <div className="flex flex-wrap gap-2">
                {services.filter((s) => s.isActive !== false).map((service) => <Button key={service.id} type="button" variant="outline" onClick={() => addService(service)} disabled={!canEdit}><Plus className="mr-2 h-4 w-4" />{service.name}</Button>)}
              </div> : null}

              <div className="space-y-3">
                {!items.length ? <InlineNotice tone="warning" title="Chưa có dòng hàng" description="Thêm sản phẩm từ watch bridge hoặc tìm sản phẩm để tạo đơn." /> : items.map((item, index) => <div key={`${item.kind}-${item.productId || item.serviceCatalogId || index}`} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 w-fit">{item.kind}</div>
                      <Input className="mt-2 font-semibold" value={item.title} onChange={(e) => updateItem(index, { title: e.target.value })} disabled={!canEdit || item.kind === "PRODUCT"} />
                    </div>
                    <button type="button" disabled={!canEdit} onClick={() => setItems((prev) => prev.filter((_, i) => i !== index))} className="rounded-xl p-2 text-rose-500 hover:bg-rose-50 disabled:opacity-40"><Trash2 className="h-4 w-4" /></button>
                  </div>
                  <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Field label="Số lượng"><Input inputMode="numeric" value={String(item.quantity)} onChange={(e) => updateItem(index, { quantity: numberValue(e.target.value) || 1 })} disabled={!canEdit} /></Field>
                    <Field label="Giá niêm yết"><Input inputMode="numeric" value={String(item.listPrice)} onChange={(e) => updateItem(index, { listPrice: numberValue(e.target.value) })} disabled={!canEdit} /></Field>
                    <Field label="Giá chốt"><Input inputMode="numeric" value={String(item.unitPriceAgreed)} onChange={(e) => updateItem(index, { unitPriceAgreed: numberValue(e.target.value) })} disabled={!canEdit} /></Field>
                  </div>
                  {item.kind === "SERVICE" ? <div className="mt-4"><Field label="Ghi chú dịch vụ"><Textarea value={item.customerItemNote ?? ""} onChange={(e) => updateItem(index, { customerItemNote: e.target.value })} disabled={!canEdit} /></Field></div> : null}
                </div>)}
              </div>
            </div>
          </SectionCard>

          <SectionCard icon={<Wallet className="h-5 w-5" />} title="Ghi chú" subtitle="Thông tin nội bộ">
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} disabled={!canEdit} placeholder="Ghi chú cho đơn hàng..." />
          </SectionCard>
        </div>

        <aside className="space-y-5 xl:sticky xl:top-4 xl:self-start">
          <SectionCard icon={<Wallet className="h-5 w-5" />} title="Tổng hợp" subtitle="Kiểm tra trước khi lưu">
            <div className="space-y-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"><div className="text-xs text-slate-500">Số dòng</div><div className="mt-1 text-sm font-semibold text-slate-950">{items.length}</div></div>
              <div className="rounded-2xl bg-slate-950 px-4 py-3 text-white"><div className="text-xs text-white/60">Tạm tính</div><div className="mt-1 text-lg font-semibold">{fmtMoney(subtotal)}</div></div>
              <Button type="button" className="w-full" onClick={submit} disabled={submitting || !canEdit}>{submitting ? "Đang lưu..." : isEdit ? "Lưu thay đổi" : "Tạo đơn"}</Button>
              <Link href={backHref} className="block rounded-xl border border-slate-200 px-4 py-2.5 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50">Hủy</Link>
            </div>
          </SectionCard>
        </aside>
      </div>
    </div>
  );
}
