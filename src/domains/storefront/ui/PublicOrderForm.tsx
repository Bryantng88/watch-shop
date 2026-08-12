"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ShieldCheck, Trash2 } from "lucide-react";
import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useStorefrontCart, type StorefrontCartItem } from "./StorefrontCart";
import { useOnlineStatus } from "./PwaRuntime";
import { useStorefrontLocale } from "./StorefrontLocale";

type State = { kind: "idle" | "submitting" } | { kind: "success"; reference: string | null; disposition: "CREATED" | "MERGED"; addedItemCount: number } | { kind: "error"; message: string };
const idempotencyKey = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export default function PublicOrderForm({ initialItems = [], initialRequestKey, submittedReference, submittedDisposition, submittedAddedItemCount = 0, initialError }: { initialItems?: StorefrontCartItem[]; initialRequestKey: string; submittedReference?: string; submittedDisposition?: "CREATED" | "MERGED"; submittedAddedItemCount?: number; initialError?: string }) {
  const { items, add, remove: removeFromCart, clear: clearCart } = useStorefrontCart();
  const [dismissedInitialIds, setDismissedInitialIds] = useState<string[]>([]);
  const effectiveItems = useMemo(() => {
    const visibleInitialItems = initialItems.filter((item) => !dismissedInitialIds.includes(item.productId));
    return [...visibleInitialItems, ...items.filter((item) => !visibleInitialItems.some((initial) => initial.productId === item.productId) && !dismissedInitialIds.includes(item.productId))].slice(0, 20);
  }, [dismissedInitialIds, initialItems, items]);
  useEffect(() => { initialItems.forEach(add); }, [add, initialItems]);
  const [state, setState] = useState<State>(submittedReference
    ? { kind: "success", reference: submittedReference, disposition: submittedDisposition ?? "CREATED", addedItemCount: submittedAddedItemCount }
    : initialError
      ? { kind: "error", message: "Chưa thể gửi yêu cầu. Vui lòng kiểm tra lại thông tin và thử lại." }
      : { kind: "idle" });
  const requestKey = useRef<string | null>(initialRequestKey);
  const online = useOnlineStatus();
  const { locale } = useStorefrontLocale();
  const en = locale === "en";

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
      setState({ kind: "success", reference: payload.reference ?? null, disposition: payload.disposition === "MERGED" ? "MERGED" : "CREATED", addedItemCount: Number(payload.addedItemCount) || 0 });
    } catch (error) {
      const unavailable = error instanceof Error && error.message === "PUBLIC_ORDER_PRODUCT_UNAVAILABLE";
      setState({ kind: "error", message: unavailable ? "Watch đã được giữ hoặc đã bán nên đã được loại khỏi yêu cầu. Vui lòng kiểm tra lại danh sách rồi gửi lại." : "Chưa thể gửi yêu cầu. Vui lòng thử lại." });
    }
  }

  if (state.kind === "success") return <div className="mx-auto max-w-xl border border-[#dedbd4] bg-white/60 px-6 py-16 text-center sm:px-12"><CheckCircle2 className="mx-auto h-8 w-8 text-[#46545e]" /><p className="mt-5 text-[9px] uppercase tracking-[0.22em] text-[#8b867f]">Vintic concierge</p><h1 className="storefront-display mt-3 text-4xl">{en ? (state.disposition === "MERGED" ? "Selection updated" : "Request received") : (state.disposition === "MERGED" ? "Đã bổ sung sản phẩm" : "Đã nhận yêu cầu")}</h1><p className="mt-5 text-sm leading-6 text-[#66635e]">{en ? (state.disposition === "MERGED" ? `${state.addedItemCount} watch(es) have been added to your request.` : "Our team has received your consultation request and will contact you shortly.") : (state.disposition === "MERGED" ? `Đã bổ sung ${state.addedItemCount} sản phẩm vào yêu cầu của bạn.` : "Đội ngũ đã nhận yêu cầu và sẽ sớm liên hệ trực tiếp với bạn.")}</p><p className="mt-4 text-xs uppercase tracking-[0.12em] text-[#3b3935]">{en ? "Reference" : "Mã tham chiếu"}: {state.reference ?? (en ? "updating" : "đang cập nhật")}</p><Link className="storefront-focus mt-8 inline-flex min-h-11 items-center bg-[#30302e] px-6 text-[10px] uppercase tracking-[0.16em] text-white" href="/products">{en ? "Continue exploring" : "Tiếp tục xem"}</Link></div>;

  const fieldClass = "mt-2 min-h-12 w-full border-0 border-b border-[#c9c4bb] bg-transparent px-0 text-[15px] outline-none transition placeholder:text-[#aaa49b] focus:border-[#30302e] focus:ring-0";
  return <div className="grid gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:gap-12">
    <section className="lg:pt-2">
      <div className="flex items-end justify-between"><div><p className="text-[9px] uppercase tracking-[0.22em] text-[#8b867f]">{en ? "Your selection" : "Lựa chọn của bạn"}</p><h2 className="storefront-display mt-2 text-3xl">{en ? "Selected watches" : "Sản phẩm đã chọn"}</h2></div><span className="text-xs text-[#8b867f]">{effectiveItems.length}</span></div>
      {effectiveItems.length ? <ul className="mt-6 space-y-3">{effectiveItems.map((item) => <li key={item.productId} className="group flex items-center gap-5 rounded-[5px] border border-[#dedbd4] bg-white/55 p-3 transition hover:border-[#c5c0b7] hover:bg-white"><Link href={`/products/${item.slug}`} className="relative h-28 w-24 shrink-0 overflow-hidden bg-[#efede8]"><Image src={item.imageUrl} alt="" fill sizes="96px" className="object-cover transition duration-500 group-hover:scale-[1.025]" /></Link><div className="min-w-0 flex-1"><p className="text-[9px] uppercase tracking-[0.17em] text-[#918c84]">Vintic selection</p><Link href={`/products/${item.slug}`} className="mt-2 block text-[15px] leading-5 text-[#34312e] hover:underline">{item.title}</Link><p className="mt-3 text-xs text-[#77746f]">{en ? "Quantity" : "Số lượng"} · 1</p></div><button type="button" onClick={() => { const remaining = effectiveItems.filter((candidate) => candidate.productId !== item.productId); removeFromCart(item.productId); setDismissedInitialIds((current) => [...current, item.productId]); document.cookie = `watch-shop-storefront-request=${encodeURIComponent(JSON.stringify(remaining.map((candidate) => candidate.slug)))}; Max-Age=${60 * 60 * 24 * 14}; Path=/; SameSite=Lax`; }} className="storefront-focus grid h-9 w-9 shrink-0 place-items-center text-[#8b867f] transition hover:bg-[#efede8] hover:text-[#35322e]" aria-label={`${en ? "Remove" : "Xóa"} ${item.title}`}><Trash2 className="h-4 w-4" /></button></li>)}</ul> : <div className="mt-6 border border-dashed border-[#d7d2ca] px-6 py-12 text-center text-sm text-[#77746f]">{en ? "No watches selected." : "Chưa có sản phẩm."} <Link className="underline underline-offset-4" href="/products">{en ? "Explore the collection" : "Xem bộ sưu tập"}</Link>.</div>}
      <div className="mt-6 flex items-start gap-3 rounded-[4px] bg-[#f0f1ef] px-4 py-4 text-xs leading-5 text-[#67635d]"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#46545e]" /><p>{en ? "Submitting a request does not reserve or charge you for a watch. Our team will reconfirm availability, condition and price." : "Gửi yêu cầu không đồng nghĩa với thanh toán hay giữ chỗ. Đội ngũ sẽ xác nhận lại tình trạng, giá và khả năng cung cấp."}</p></div>
    </section>
    <form action="/api/public/orders" method="post" onSubmit={submit} noValidate className="relative lg:border-l lg:border-[#d8d4cd] lg:pl-12"><div className="absolute left-[-1px] top-0 hidden h-16 w-px bg-[#46545e] lg:block" /><div className="flex items-start justify-between gap-6"><div><p className="text-[9px] uppercase tracking-[0.22em] text-[#8b867f]">{en ? "Personal consultation" : "Tư vấn riêng"}</p><h2 className="storefront-display mt-2 text-3xl sm:text-[34px]">{en ? "Let’s begin the conversation" : "Bắt đầu một cuộc trò chuyện"}</h2><p className="mt-3 max-w-md text-sm leading-6 text-[#77736c]">{en ? "A few details are all we need. A Vintic specialist will contact you personally." : "Chỉ cần vài thông tin cơ bản. Một chuyên viên Vintic sẽ trực tiếp liên hệ và đồng hành cùng bạn."}</p></div><span className="hidden pt-1 text-[10px] uppercase tracking-[0.18em] text-[#aaa49b] sm:block">01 — 05</span></div><input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className="mt-9 space-y-7">
      <input type="hidden" name="idempotencyKey" value={initialRequestKey} />
      {effectiveItems.map((item) => <input key={item.productId} type="hidden" name="productId" value={item.productId} />)}
      <div className="grid gap-7 sm:grid-cols-2"><label className="block text-[10px] uppercase tracking-[0.14em] text-[#69645d]">{en ? "Full name" : "Họ và tên"}<input required maxLength={120} name="customerName" autoComplete="name" className={fieldClass} /></label>
      <label className="block text-[10px] uppercase tracking-[0.14em] text-[#69645d]">{en ? "Phone number" : "Số điện thoại"}<input required minLength={8} maxLength={30} name="phone" autoComplete="tel" inputMode="tel" className={fieldClass} /></label></div>
      <div className="grid gap-7 sm:grid-cols-2"><label className="block text-[10px] uppercase tracking-[0.14em] text-[#69645d]">{en ? "Preferred contact" : "Ưu tiên liên hệ"}<select name="contactPreference" className={fieldClass}><option value="PHONE">{en ? "Phone" : "Điện thoại"}</option><option value="ZALO">Zalo</option></select></label>
      <label className="block text-[10px] uppercase tracking-[0.14em] text-[#69645d]">{en ? "Address (optional)" : "Địa chỉ (không bắt buộc)"}<input maxLength={500} name="address" autoComplete="street-address" className={fieldClass} /></label></div>
      <label className="block text-[10px] uppercase tracking-[0.14em] text-[#69645d]">{en ? "Anything we should know?" : "Điều bạn muốn chia sẻ"}<textarea maxLength={1000} name="note" rows={3} className={`${fieldClass} min-h-24 resize-y py-3 normal-case tracking-normal`} /></label>
      {state.kind === "error" ? <p role="alert" className="text-sm text-red-700">{state.message}</p> : null}
      <div className="flex flex-col gap-4 border-t border-[#dedbd4] pt-6 sm:flex-row sm:items-center"><button type="submit" disabled={!online || !effectiveItems.length || state.kind === "submitting"} className="storefront-focus flex min-h-[52px] shrink-0 items-center justify-center gap-2 bg-[#30302e] px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#171715] disabled:cursor-not-allowed disabled:opacity-50"><CheckCircle2 className="h-4 w-4" />{state.kind === "submitting" ? (en ? "Sending…" : "Đang gửi…") : online ? (en ? "Send request" : "Gửi yêu cầu") : (en ? "Offline" : "Đang offline")}</button>
      <p className="text-[10px] leading-5 text-[#8b867f]">{en ? "No payment is taken. Your details remain private." : "Không phát sinh thanh toán. Thông tin của bạn được bảo mật."}</p></div>
      </div>
    </form>
  </div>;
}
