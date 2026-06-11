"use client";

import { Eye, ImageIcon } from "lucide-react";
import RowActions from "@/domains/shared/ui/list/RowActions";
import type { WorkCaseWithRelations } from "../server/work-case.repo";
import { WorkCasePriorityBadge, WorkCaseScopeBadge, WorkCaseStatusBadge } from "./WorkCaseBadges";

function userLabel(user: { name?: string | null; email?: string | null; id?: string | null } | null | undefined) {
  return user?.name || user?.email || user?.id || "-";
}

function imageSrc(item: WorkCaseWithRelations) {
  const inline =
    (item.watch?.product as any)?.productImage?.[0] ??
    (item.watch?.product as any)?.productImages?.[0];

  return inline?.imageUrl || inline?.fileKey || item.watch?.product?.primaryImageUrl || null;
}

export default function WorkCaseListTable({
  items,
  page,
  totalPages,
  onPage,
  onOpen,
}: {
  items: WorkCaseWithRelations[];
  page: number;
  totalPages: number;
  onPage: (page: number) => void;
  onOpen: (item: WorkCaseWithRelations) => void;
}) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
            <tr>
              <th className="px-4 py-3">Phiếu</th>
              <th className="px-4 py-3">Watch</th>
              <th className="px-4 py-3">Scope</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Người tạo</th>
              <th className="px-4 py-3">Output</th>
              <th className="px-4 py-3">Ngày tạo</th>
              <th className="w-[72px] px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => {
              const img = imageSrc(item);
              const title = item.watch?.product?.title || "Untitled watch";
              return (
                <tr key={item.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-4 align-top">
                    <div className="min-w-[240px]">
                      <div className="flex flex-wrap gap-2"><WorkCaseStatusBadge status={item.status} /></div>
                      <div className="mt-2 line-clamp-2 font-semibold text-slate-950">{item.title}</div>
                      <div className="mt-1 font-mono text-[11px] text-slate-400">{item.refNo || item.id}</div>
                      {item.description ? <div className="mt-1 line-clamp-2 text-xs text-slate-500">{item.description}</div> : null}
                    </div>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="flex min-w-[260px] gap-3">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                        {img ? <img src={img} alt={title} className="h-full w-full object-cover" /> : <ImageIcon className="h-5 w-5 text-slate-400" />}
                      </div>
                      <div className="min-w-0">
                        <div className="line-clamp-2 font-semibold text-slate-900">{title}</div>
                        <div className="mt-1 text-xs text-slate-500">SKU: {item.watch?.product?.sku || "-"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 align-top"><WorkCaseScopeBadge scope={item.scope} /></td>
                  <td className="px-4 py-4 align-top"><WorkCasePriorityBadge priority={item.priority} /></td>
                  <td className="px-4 py-4 align-top text-slate-600">{userLabel(item.raisedByUser)}</td>
                  <td className="px-4 py-4 align-top text-xs text-slate-600">
                    <div>{item.tasks.length} task</div>
                    <div>{item.serviceRequests.length} SR</div>
                  </td>
                  <td className="px-4 py-4 align-top text-slate-500">{new Date(item.createdAt).toLocaleDateString("vi-VN")}</td>
                  <td className="px-4 py-4 align-top text-right">
                    <RowActions
                      row={item}
                      actions={[
                        {
                          key: "view",
                          label: "Xem chi tiết",
                          icon: <Eye className="h-4 w-4" />,
                          onClick: onOpen,
                        },
                      ]}
                    />
                  </td>
                </tr>
              );
            })}
            {!items.length ? (
              <tr><td colSpan={8} className="px-4 py-10 text-center text-sm text-slate-400">Chưa có phiếu xử lý.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-sm text-slate-600">
        <div>Trang <span className="font-semibold text-slate-900">{page}</span>/<span className="font-semibold text-slate-900">{totalPages}</span></div>
        <div className="flex gap-2">
          <button type="button" disabled={page <= 1} onClick={() => onPage(page - 1)} className="rounded-xl border border-slate-200 px-3 py-2 disabled:opacity-50">Trước</button>
          <button type="button" disabled={page >= totalPages} onClick={() => onPage(page + 1)} className="rounded-xl border border-slate-200 px-3 py-2 disabled:opacity-50">Sau</button>
        </div>
      </div>
    </div>
  );
}
