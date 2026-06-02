"use client";

import * as React from "react";
import { X } from "lucide-react";
import TechnicalIssuesBoardClient from "./TechnicalIssuesBoardClient";
import type { IssueBoardCatalogs, IssueItem } from "./types";

type Props = {
  open: boolean;
  onClose: () => void;

  /**
   * SR hiện tại chỉ dùng để hiển thị context trên modal.
   * Không dùng để filter Issue Board.
   */
  currentServiceRequestId?: string | null;
  serviceRefNo?: string | null;

  items: IssueItem[];
  counts: {
    pendingConfirm: number;
    ready: number;
    inProgress: number;
    done: number;
    readyToCloseSrCount?: number;
  };
  catalogs?: IssueBoardCatalogs;
};

export default function ServiceIssueManageModal({
  open,
  onClose,
  currentServiceRequestId,
  serviceRefNo,
  items,
  counts,
  catalogs,
}: Props) {
  React.useEffect(() => {
    if (!open) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;
  console.log("[ServiceIssueManageModal] catalogs", {
    catalogs,
    count: catalogs?.technicalDetailCatalogOptions?.length,
    sample: catalogs?.technicalDetailCatalogOptions?.slice(0, 3),
  });
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/35 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="flex h-[96vh] w-full max-w-[1560px] flex-col overflow-hidden rounded-t-3xl border border-slate-200 bg-slate-50 shadow-2xl sm:h-[92vh] sm:rounded-3xl">
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4">
          <div>
            <div className="text-base font-semibold text-slate-950">Quản lý issue service</div>
            <div className="mt-1 text-sm text-slate-500">
              {serviceRefNo || currentServiceRequestId
                ? `${serviceRefNo || currentServiceRequestId} · `
                : null}
              Board tổng cho toàn bộ technical issue. Detail service chỉ giữ vai trò xem thông tin.
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-800"
            aria-label="Đóng"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-auto p-4 sm:p-5">
          <TechnicalIssuesBoardClient
            items={items}
            counts={counts}
            catalogs={catalogs}
            technicalDetailCatalogOptions={
              catalogs?.technicalDetailCatalogOptions ?? []
            }
            serviceRequestId={null}
            compact
            title="Issue Board tổng"
            subtitle="Board thao tác chính cho toàn bộ technical issue của service."
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
}