"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ShieldCheck, Trash2 } from "lucide-react";
import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useStorefrontCart, type StorefrontCartItem } from "./StorefrontCart";
import { useOnlineStatus } from "./PwaRuntime";
import { useStorefrontLocale } from "./StorefrontLocale";
import { getStorefrontAnalyticsContext, trackStorefrontEvent } from "@/domains/analytics/storefront/StorefrontAnalytics";

type State = { kind: "idle" | "submitting" } | { kind: "success"; reference: string | null; disposition: "CREATED" | "MERGED"; addedItemCount: number } | { kind: "error"; message: string };
const idempotencyKey = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export default function PublicOrderForm({ initialItems = [], initialRequestKey, submittedReference, submittedDisposition, submittedAddedItemCount = 0, initialError }: { initialItems?: StorefrontCartItem[]; initialRequestKey: string; submittedReference?: string; submittedDisposition?: "CREATED" | "MERGED"; submittedAddedItemCount?: number; initialError?: string }) {
  const { items, add, remove: removeFromCart, clear: clearCart } = useStorefrontCart();
  const [dismissedInitialIds, setDismissedInitialIds] = useState<string[]>([]);
  const effectiveItems = useMemo(() => {
    const visibleInitialItems = initialItems.filter((item) => !dismissedInitialIds.includes(item.productId));
    return [...visibleInitialItems, ...items.filter((item) => !visibleInitialItems.some((initial) => initial.productId === item.productId) && !dismissedInitialIds.includes(item.productId))].slice(0, 20);
  }, [dismissedInitialIds, initialItems, items]);
  useEffect(() => { initialItems.forEach((item) => add(item, false)); }, [add, initialItems]);
  const [state, setState] = useState<State>(submittedReference
    ? { kind: "success", reference: submittedReference, disposition: submittedDisposition ?? "CREATED", addedItemCount: submittedAddedItemCount }
    : initialError
      ? { kind: "error", message: "Chưa thể gửi yêu cầu. Vui lòng kiểm tra lại thông tin và thử lại." }
      : { kind: "idle" });
  const requestKey = useRef<string | null>(initialRequestKey);
  const online = useOnlineStatus();
  const { locale } = useStorefrontLocale();
  const en = locale === "en";
  const [contactPreference, setContactPreference] = useState("PHONE");
  const formStarted = useRef(false);
  const estimatedTotal = effectiveItems.reduce((total, item) => total + (Number(item.priceAmount) || 0), 0);
  const money = (amount: number) => new Intl.NumberFormat(en ? "en-US" : "vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(amount);

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
    const phoneDigits = phone.replace(/\D/g, "");
    const contactHandle = String(form.get("contactHandle") ?? "").trim();
    if (!customerName || phoneDigits.length < 8 || phoneDigits.length > 15 || (contactPreference !== "PHONE" && !contactHandle)) {
      setState({
        kind: "error",
        message: !customerName
          ? "Vui lòng nhập họ và tên để đội ngũ có thể liên hệ."
          : phoneDigits.length < 8 || phoneDigits.length > 15
            ? "Vui lòng nhập số điện thoại hợp lệ."
            : "Vui lòng nhập thông tin của kênh liên hệ đã chọn.",
      });
      const fieldName = !customerName ? "customerName" : phoneDigits.length < 8 || phoneDigits.length > 15 ? "phone" : "contactHandle";
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
          contactPreference: form.get("contactPreference"), contactHandle: form.get("contactHandle") || undefined, address: form.get("address") || undefined,
          note: form.get("note") || undefined, website: form.get("website") || undefined,
          items: effectiveItems.map((item) => ({ productId: item.productId, quantity: 1 })),
          analytics: getStorefrontAnalyticsContext() ?? undefined,
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

  if (state.kind === "success") return <div className="mx-auto max-w-xl border border-[#dedbd4] bg-white/60 px-6 py-16 text-center sm:px-12"><CheckCircle2 className="mx-auto h-8 w-8 text-[#46545e]" /><h1 className="storefront-display mt-5 text-4xl">{en ? (state.disposition === "MERGED" ? "Selection updated" : "Request received") : (state.disposition === "MERGED" ? "Đã bổ sung sản phẩm" : "Đã nhận yêu cầu")}</h1><p className="mt-5 text-sm leading-6 text-[#66635e]">{en ? (state.disposition === "MERGED" ? `${state.addedItemCount} watch(es) have been added to your request.` : "Our team has received your consultation request and will contact you shortly.") : (state.disposition === "MERGED" ? `Đã bổ sung ${state.addedItemCount} sản phẩm vào yêu cầu của bạn.` : "Đội ngũ đã nhận yêu cầu và sẽ sớm liên hệ trực tiếp với bạn.")}</p><p className="mt-4 text-xs uppercase tracking-[0.12em] text-[#3b3935]">{en ? "Reference" : "Mã tham chiếu"}: {state.reference ?? (en ? "updating" : "đang cập nhật")}</p><Link className="storefront-focus mt-8 inline-flex min-h-11 items-center bg-[#30302e] px-6 text-[10px] uppercase tracking-[0.16em] text-white" href="/products">{en ? "Continue exploring" : "Tiếp tục xem"}</Link></div>;

  const fieldClass = "mt-2 min-h-[50px] w-full rounded-md border border-[#d9e0e3] bg-[#f7f9fa] px-4 text-[15px] text-[#302d29] outline-none transition duration-200 placeholder:text-[#9ca6ab] hover:border-[#c3cdd2] hover:bg-white focus:border-[#46545e] focus:bg-white focus:ring-4 focus:ring-[#46545e]/10";
  return <div className="relative grid items-start gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12 xl:gap-16">
    <section className="order-2 overflow-hidden rounded-lg border border-[#cfd6da] bg-white shadow-[0_16px_44px_-38px_rgba(50,67,77,0.38)] lg:sticky lg:top-24">
      <header className="flex items-center justify-between px-5 pb-3 pt-5 sm:px-6"><div><p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#829099]">{en ? "Your request" : "Yêu cầu của bạn"}</p><h2 className="storefront-display mt-1 text-[25px] text-[#26343b]">{en ? "Order summary" : "Tóm tắt sản phẩm"}</h2></div><span className="rounded-full bg-[#eef2f4] px-2.5 py-1 text-[10px] font-medium tabular-nums text-[#60717b]">{effectiveItems.length} {en ? "items" : "món"}</span></header>
      <div className="px-3 pb-2 sm:px-4">{effectiveItems.length ? <ul>{effectiveItems.map((item) => <li key={item.productId} className="group flex items-center gap-3 rounded-lg px-2 py-2.5 transition hover:bg-[#f5f7f8] sm:gap-4"><div className="relative shrink-0"><Link href={`/products/${item.slug}`} className="relative block h-16 w-14 overflow-hidden rounded-md bg-[#f1f3f3] sm:h-[68px] sm:w-[60px]"><Image src={item.imageUrl} alt="" fill sizes="60px" className="object-cover transition duration-500 ease-out group-hover:scale-[1.04]" /></Link><button type="button" onClick={() => { const remaining = effectiveItems.filter((candidate) => candidate.productId !== item.productId); removeFromCart(item.productId); setDismissedInitialIds((current) => [...current, item.productId]); document.cookie = `watch-shop-storefront-request=${encodeURIComponent(JSON.stringify(remaining.map((candidate) => candidate.slug)))}; Max-Age=${60 * 60 * 24 * 14}; Path=/; SameSite=Lax`; }} className="storefront-focus absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full border border-[#e0e5e7] bg-white text-[#75828a] shadow-sm opacity-90 transition hover:border-[#c9d1d5] hover:text-[#29363d] sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100" aria-label={`${en ? "Remove" : "Xóa"} ${item.title}`}><Trash2 className="h-2.5 w-2.5" /></button></div><div className="min-w-0 flex-1"><Link href={`/products/${item.slug}`} className="line-clamp-2 block text-[13px] font-semibold leading-[1.2rem] text-[#303b40] transition hover:text-[#46545e]">{item.title}</Link><p className="mt-1 text-[10px] text-[#869198]">{en ? "Qty" : "SL"} · 1</p></div><strong className="shrink-0 self-center text-right text-[12px] font-semibold tabular-nums text-[#26343b]">{money(Number(item.priceAmount) || 0)}</strong></li>)}</ul> : <div className="mx-2 border-y border-dashed border-[#d8e0e3] px-6 py-12 text-center text-sm text-[#738088]">{en ? "No watches selected." : "Chưa có sản phẩm."} <Link className="underline underline-offset-4" href="/products">{en ? "Explore the collection" : "Xem bộ sưu tập"}</Link>.</div>}</div>
      <footer className="m-3 mt-1 rounded-lg bg-[#f3f6f7] px-4 py-4 sm:m-4 sm:mt-1 sm:px-5"><div className="flex items-end justify-between gap-4"><div><p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#718089]">{en ? "Estimated total" : "Tổng giá tham khảo"}</p><p className="mt-1 text-[10px] leading-4 text-[#8b969c]">{en ? "Price and availability will be reconfirmed" : "Giá và tình trạng sẽ được xác nhận lại"}</p></div><strong className="shrink-0 text-lg font-bold tabular-nums text-[#26343b]">{money(estimatedTotal)}</strong></div><button form="purchase-request-form" type="submit" disabled={!online || !effectiveItems.length || state.kind === "submitting"} className="storefront-focus mt-4 flex min-h-[50px] w-full items-center justify-center rounded-md bg-[#46545e] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white shadow-[0_8px_18px_-12px_rgba(42,57,66,0.8)] transition hover:bg-[#35434b] disabled:cursor-not-allowed disabled:opacity-50">{state.kind === "submitting" ? (en ? "Sending…" : "Đang gửi…") : online ? (en ? "Send request" : "Gửi yêu cầu") : (en ? "Offline" : "Đang offline")}</button><div className="mt-3 flex items-center justify-center gap-2 text-[10px] leading-4 text-[#7c898f]"><ShieldCheck className="h-3.5 w-3.5 shrink-0 text-[#607782]" /><p>{en ? "No payment or reservation is made at this step." : "Chưa phát sinh thanh toán hay giữ chỗ ở bước này."}</p></div></footer>
    </section>
    <form id="purchase-request-form" action="/api/public/orders" method="post" onSubmit={submit} noValidate className="order-1"><div className="border-b border-[#d8dddf] pb-5"><p className="text-[9px] font-medium uppercase tracking-[0.22em] text-[#687983]">{en ? "Contact details" : "Thông tin liên hệ"}</p><h2 className="storefront-display mt-2 text-3xl text-[#29363d] sm:text-[36px]">{en ? "Let’s begin the conversation" : "Bắt đầu một cuộc trò chuyện"}</h2><p className="mt-3 max-w-xl text-sm leading-6 text-[#6d777c]">{en ? "A few details are all we need. A member of our team will contact you personally." : "Chỉ cần vài thông tin cơ bản. Đội ngũ sẽ trực tiếp liên hệ và hỗ trợ bạn."}</p></div><input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className="mt-7 space-y-6" onInput={() => { if (!formStarted.current) { formStarted.current = true; trackStorefrontEvent("request_form_started"); } }}>
      <input type="hidden" name="idempotencyKey" value={initialRequestKey} />
      {effectiveItems.map((item) => <input key={item.productId} type="hidden" name="productId" value={item.productId} />)}
      <div className="grid gap-7 sm:grid-cols-2"><label className="block text-[10px] uppercase tracking-[0.14em] text-[#69645d]">{en ? "Full name" : "Họ và tên"}<input required maxLength={120} name="customerName" autoComplete="name" className={fieldClass} /></label>
      <label className="block text-[10px] uppercase tracking-[0.14em] text-[#69645d]">{en ? "Phone number" : "Số điện thoại"}<input required minLength={8} maxLength={30} name="phone" autoComplete="tel" inputMode="tel" className={fieldClass} /></label></div>
      <div className="grid gap-7 sm:grid-cols-2"><label className="block text-[10px] uppercase tracking-[0.14em] text-[#69645d]">{en ? "Preferred contact" : "Ưu tiên liên hệ"}<select name="contactPreference" value={contactPreference} onChange={(event) => setContactPreference(event.target.value)} className={fieldClass}><option value="PHONE">{en ? "Phone" : "Điện thoại"}</option><option value="ZALO">Zalo</option><option value="WHATSAPP">WhatsApp</option><option value="INSTAGRAM">Instagram</option></select></label>
      <label className="block text-[10px] uppercase tracking-[0.14em] text-[#69645d]">{en ? "Address (optional)" : "Địa chỉ (không bắt buộc)"}<input maxLength={500} name="address" autoComplete="street-address" className={fieldClass} /></label></div>
      {contactPreference !== "PHONE" ? <label className="block text-[10px] uppercase tracking-[0.14em] text-[#69645d]">{contactPreference === "INSTAGRAM" ? (en ? "Instagram username" : "Tài khoản Instagram") : contactPreference === "WHATSAPP" ? (en ? "WhatsApp number" : "Số WhatsApp") : (en ? "Zalo number" : "Số Zalo")}<input required maxLength={120} name="contactHandle" autoComplete={contactPreference === "INSTAGRAM" ? "off" : "tel"} inputMode={contactPreference === "INSTAGRAM" ? "text" : "tel"} placeholder={contactPreference === "INSTAGRAM" ? "@username" : en ? "Contact number" : "Số điện thoại dùng cho kênh này"} className={fieldClass} /></label> : null}
      <label className="block text-[10px] uppercase tracking-[0.14em] text-[#69645d]">{en ? "Anything we should know?" : "Điều bạn muốn chia sẻ"}<textarea maxLength={1000} name="note" rows={3} className={`${fieldClass} min-h-28 resize-y py-3 normal-case tracking-normal`} /></label>
      {state.kind === "error" ? <p role="alert" className="rounded-xl bg-[#f7e9e6] px-4 py-3 text-sm text-[#9a3f35]">{state.message}</p> : null}
      <p className="border-t border-[#e1e6e8] pt-5 text-center text-[10px] leading-5 text-[#7e898f]">{en ? "Your details remain private. Review your selection and submit from the card beside this form." : "Thông tin của bạn được bảo mật. Kiểm tra danh sách và gửi yêu cầu tại thẻ bên cạnh."}</p>
      </div>
    </form>
  </div>;
}
