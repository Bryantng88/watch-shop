"use client";

import DotLabel from "../../../__components/DotLabel";
import type { ProductRow } from "./types";
import { getDetailedPublishMissing, getQuickFixHints, hasMissingCoreReadinessInfo, hasMissingImageReadiness } from "./helpers";

export default function ProductReadinessModal({
  product,
  open,
  onClose,
  onEdit,
}: {
  product: ProductRow | null;
  open: boolean;
  onClose: () => void;
  onEdit: (id: string) => void;
}) {
  if (!open || !product) return null;

  const detailedPublishMissing = Array.from(new Set(getDetailedPublishMissing(product)));
  const quickFixHints = getQuickFixHints(product);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
          <div>
            <div className="text-lg font-semibold text-slate-950">Kiểm tra thông tin sản phẩm</div>
            <div className="mt-1 text-sm text-slate-500">{product.title || "-"}</div>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-50">Đóng</button>
        </div>

        <div className="space-y-4 px-5 py-4 text-sm">
          <div className="flex flex-wrap gap-2">
            <DotLabel label={hasMissingImageReadiness(product) ? "Thiếu ảnh" : "Ảnh đạt yêu cầu"} tone={hasMissingImageReadiness(product) ? "orange" : "green"} />
            <DotLabel label={hasMissingCoreReadinessInfo(product) ? "Thiếu thông tin" : "Thông tin đạt"} tone={hasMissingCoreReadinessInfo(product) ? "orange" : "green"} />
          </div>

          {detailedPublishMissing.length > 0 ? (
            <div>
              <div className="mb-2 font-medium text-slate-800">Thiếu chi tiết</div>
              <ul className="list-disc space-y-1 pl-5 text-slate-600">
                {detailedPublishMissing.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          ) : null}

          {quickFixHints.length > 0 ? (
            <div>
              <div className="mb-2 font-medium text-slate-800">Gợi ý xử lý nhanh</div>
              <ul className="list-disc space-y-1 pl-5 text-slate-600">
                {quickFixHints.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 px-5 py-4">
          <button type="button" onClick={onClose} className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50">Đóng</button>
          <button type="button" onClick={() => onEdit(product.id)} className="inline-flex h-10 items-center justify-center rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800">Chỉnh sửa sản phẩm</button>
        </div>
      </div>
    </div>
  );
}
