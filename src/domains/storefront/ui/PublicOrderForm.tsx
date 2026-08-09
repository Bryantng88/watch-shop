"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useStorefrontCart, type StorefrontCartItem } from "./StorefrontCart";
import { useOnlineStatus } from "./PwaRuntime";

type State = { kind: "idle" | "submitting" } | { kind: "success"; reference: string | null } | { kind: "error"; message: string };
const idempotencyKey = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export default function PublicOrderForm({ initialItems = [] }: { initialItems?: StorefrontCartItem[] }) {
  const { items, add, remove: removeFromCart, clear: clearCart } = useStorefrontCart();
  const [dismissedInitialIds, setDismissedInitialIds] = useState<string[]>([]);
  const effectiveItems = useMemo(() => {
    const visibleInitialItems = initialItems.filter((item) => !dismissedInitialIds.includes(item.productId));
    return [...visibleInitialItems, ...items.filter((item) => !visibleInitialItems.some((initial) => initial.productId === item.productId) && !dismissedInitialIds.includes(item.productId))].slice(0, 20);
  }, [dismissedInitialIds, initialItems, items]);
  useEffect(() => { initialItems.forEach(add); }, [add, initialItems]);
  const [state, setState] = useState<State>({ kind: "idle" });
  const requestKey = useRef<string | null>(null);
  const online = useOnlineStatus();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!effectiveItems.length || state.kind === "submitting") return;
    if (!online) {
      setState({ kind: "error", message: "Bạn đang offline. Hãy kết nối mạng để kiểm tra lại tình trạng và gửi yêu cầu." });
      return;
    }
    const form = new FormData(event.currentTarget);
    const customerName = String(form.get("customerName") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim();
    if (!customerName || phone.length < 8) {
      setState({
        kind: "error",
        message: !customerName
          ? "Vui lòng nhập họ và tên để đội ngũ có thể liên hệ."
          : "Vui lòng nhập số điện thoại hợp lệ (ít nhất 8 ký tự).",
      });
      const fieldName = !customerName ? "customerName" : "phone";
      const field = event.currentTarget.elements.namedItem(fieldName);
      if (field instanceof HTMLElement) field.focus();
      return;
    }
    setState({ kind: "submitting" });
    try {
      const response = await fetch("/api/public/orders", {
        method: "POST",
        headers: { "content-type": "application/json", "idempotency-key": requestKey.current ??= idempotencyKey() },
        body: JSON.stringify({
          customerName, phone,
          contactPreference: form.get("contactPreference"), address: form.get("address") || undefined,
          note: form.get("note") || undefined, website: form.get("website") || undefined,
          items: effectiveItems.map((item) => ({ productId: item.productId, quantity: 1 })),
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        if (payload?.error?.code === "PUBLIC_ORDER_PRODUCT_UNAVAILABLE") {
          const unavailableIds = Array.isArray(payload.error.unavailableProductIds)
            ? payload.error.unavailableProductIds.filter((id: unknown): id is string => typeof id === "string")
            : [];
          const remaining = effectiveItems.filter((item) => !unavailableIds.includes(item.productId));
          unavailableIds.forEach(removeFromCart);
          setDismissedInitialIds((current) => [...new Set([...current, ...unavailableIds])]);
          document.cookie = `watch-shop-storefront-request=${encodeURIComponent(JSON.stringify(remaining.map((item) => item.slug)))}; Max-Age=${60 * 60 * 24 * 14}; Path=/; SameSite=Lax`;
          requestKey.current = null;
        }
        throw new Error(payload?.error?.code ?? "ORDER_NOT_ACCEPTED");
      }
      clearCart();
      document.cookie = "watch-shop-storefront-request=; Max-Age=0; Path=/; SameSite=Lax";
      setDismissedInitialIds(initialItems.map((item) => item.productId));
      setState({ kind: "success", reference: payload.reference ?? null });
    } catch (error) {
      const unavailable = error instanceof Error && error.message === "PUBLIC_ORDER_PRODUCT_UNAVAILABLE";
      setState({ kind: "error", message: unavailable ? "Watch đã được giữ hoặc đã bán nên đã được loại khỏi yêu cầu. Vui lòng kiểm tra lại danh sách rồi gửi lại." : "Chưa thể gửi yêu cầu. Vui lòng thử lại." });
    }
  }

  if (state.kind === "success") return <div className="mx-auto max-w-xl py-20 text-center"><h1 className="storefront-display text-4xl">Đã nhận yêu cầu</h1><p className="mt-5 text-[#66635e]">Mã tham chiếu: {state.reference ?? "đang cập nhật"}. Đội ngũ sẽ liên hệ để xác nhận.</p><Link className="storefront-focus mt-8 inline-flex min-h-11 items-center border border-[#333] px-5 text-xs uppercase tracking-widest" href="/products">Tiếp tục xem</Link></div>;

  return <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
    <section><h2 className="storefront-display text-2xl">Sản phẩm</h2>{effectiveItems.length ? <ul className="mt-5 divide-y divide-[#dedbd4] border-y border-[#dedbd4]">{effectiveItems.map((item) => <li key={item.productId} className="flex items-center gap-4 py-4"><div className="relative h-20 w-16 shrink-0 overflow-hidden bg-[#efede8]"><Image src={item.imageUrl} alt="" fill sizes="64px" className="object-cover" /></div><div className="min-w-0 flex-1"><Link href={`/products/${item.slug}`} className="font-medium">{item.title}</Link><p className="mt-1 text-xs text-[#77746f]">Số lượng 1</p></div><button type="button" onClick={() => { const remaining = effectiveItems.filter((candidate) => candidate.productId !== item.productId); removeFromCart(item.productId); setDismissedInitialIds((current) => [...current, item.productId]); document.cookie = `watch-shop-storefront-request=${encodeURIComponent(JSON.stringify(remaining.map((candidate) => candidate.slug)))}; Max-Age=${60 * 60 * 24 * 14}; Path=/; SameSite=Lax`; }} className="storefront-focus grid h-11 w-11 place-items-center" aria-label={`Xóa ${item.title}`}><Trash2 className="h-4 w-4" /></button></li>)}</ul> : <p className="mt-5 text-[#77746f]">Chưa có sản phẩm. <Link className="underline" href="/products">Xem bộ sưu tập</Link>.</p>}</section>
    <form onSubmit={submit} noValidate className="space-y-5"><h2 className="storefront-display text-2xl">Thông tin liên hệ</h2><input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <label className="block text-sm">Họ và tên<input required maxLength={120} name="customerName" className="mt-2 min-h-12 w-full border border-[#cbc7bf] bg-white px-4" /></label>
      <label className="block text-sm">Số điện thoại<input required minLength={8} maxLength={30} name="phone" inputMode="tel" className="mt-2 min-h-12 w-full border border-[#cbc7bf] bg-white px-4" /></label>
      <label className="block text-sm">Ưu tiên liên hệ<select name="contactPreference" className="mt-2 min-h-12 w-full border border-[#cbc7bf] bg-white px-4"><option value="PHONE">Điện thoại</option><option value="ZALO">Zalo</option></select></label>
      <label className="block text-sm">Địa chỉ (không bắt buộc)<input maxLength={500} name="address" className="mt-2 min-h-12 w-full border border-[#cbc7bf] bg-white px-4" /></label>
      <label className="block text-sm">Ghi chú<textarea maxLength={1000} name="note" rows={4} className="mt-2 w-full border border-[#cbc7bf] bg-white p-4" /></label>
      {state.kind === "error" ? <p role="alert" className="text-sm text-red-700">{state.message}</p> : null}
      <button disabled={!online || !effectiveItems.length || state.kind === "submitting"} className="storefront-focus min-h-12 w-full bg-[#30302e] px-6 text-xs uppercase tracking-[0.15em] text-white disabled:cursor-not-allowed disabled:opacity-50">{state.kind === "submitting" ? "Đang gửi…" : online ? "Gửi yêu cầu" : "Offline — không thể gửi"}</button>
      <p className="text-xs leading-5 text-[#77746f]">Yêu cầu chưa phải thanh toán. Giá và tình trạng sẽ được xác nhận lại.</p>
    </form>
  </div>;
}
