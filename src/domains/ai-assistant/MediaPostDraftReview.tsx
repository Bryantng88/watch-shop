"use client";
import type { MediaPostDraft } from "./media-post-contract";
const price = (value: string) =>
  new Intl.NumberFormat("vi-VN").format(Number(value)) + " ₫";
export default function MediaPostDraftReview({
  draft,
  busy,
  onApprove,
}: {
  draft: MediaPostDraft;
  busy: boolean;
  onApprove: () => void;
}) {
  const prices = draft.watches.map((w) => Number(w.price));
  return (
    <section
      aria-label="Duyệt post Media"
      className="mt-4 rounded-2xl border border-blue-200 bg-white p-4 text-sm"
    >
      <h3 className="font-semibold">
        Post {draft.watches.length} đồng hồ · {draft.selection.brand}
      </h3>
      {draft.selection.keywords.length > 0 && (
        <p className="mt-2 text-slate-600">
          {draft.selection.keywords.join(" · ")}
        </p>
      )}
      <p className="mt-2 text-xs text-slate-500">
        {price(String(Math.min(...prices)))} –{" "}
        {price(String(Math.max(...prices)))}
        {draft.selection.similarPrices ? " · Chênh giá tối đa 25%" : ""}
      </p>
      {draft.watches.length < draft.selection.count && (
        <p className="mt-2 text-amber-700">
          Chỉ chọn được {draft.watches.length}/{draft.selection.count} chiếc
          đúng điều kiện. Chưa thêm mẫu khác.
        </p>
      )}
      <details className="mt-3">
        <summary className="cursor-pointer text-blue-700">
          Xem {draft.watches.length} đồng hồ đã chọn
        </summary>
        <ul className="mt-2 divide-y divide-slate-100">
          {draft.watches.map((w) => (
            <li key={w.watchId} className="flex justify-between gap-3 py-2">
              <span>
                {w.title}
                <small className="block text-slate-500">{w.sku}</small>
              </span>
              <span className="whitespace-nowrap">{price(w.price)}</span>
            </li>
          ))}
        </ul>
      </details>
      <p className="mt-3 whitespace-pre-wrap leading-6">{draft.caption}</p>
      <p className="mt-3 text-xs text-slate-500">
        Tạo một post nháp với các đồng hồ và mỗi chiếc một ảnh Gallery. Chỉnh
        nội dung hoặc lựa chọn bằng tin nhắn trước khi duyệt.
      </p>
      <button
        type="button"
        disabled={busy}
        onClick={onApprove}
        className="mt-3 rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white disabled:opacity-50"
      >
        {busy ? "Đang tạo…" : "Tạo post nháp"}
      </button>
    </section>
  );
}
