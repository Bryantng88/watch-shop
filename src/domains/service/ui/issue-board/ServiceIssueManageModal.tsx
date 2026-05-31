"use client";

import * as React from "react";
import { X } from "lucide-react";
import TechnicalIssuesBoardClient from "./TechnicalIssuesBoardClient";
import type { IssueItem } from "./types";

type Props = {
  open: boolean;
  onClose: () => void;
  serviceRequestId: string;
  serviceRefNo?: string | null;
  items: IssueItem[];
  counts: {
    pendingConfirm: number;
    ready: number;
    inProgress: number;
    done: number;
    readyToCloseSrCount?: number;
  };
};

export default function ServiceIssueManageModal({
  open,
  onClose,
  serviceRequestId,
  serviceRefNo,
  items,
  counts,
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

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/35 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="flex h-[96vh] w-full max-w-[1560px] flex-col overflow-hidden rounded-t-3xl border border-slate-200 bg-slate-50 shadow-2xl sm:h-[92vh] sm:rounded-3xl">
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4">
          <div>
            <div className="text-base font-semibold text-slate-950">Quản lý issue service</div>
            <div className="mt-1 text-sm text-slate-500">
              {serviceRefNo || serviceRequestId} · Board thao tác chính cho kỹ thuật, phí và trạng thái issue.
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
            serviceRequestId={serviceRequestId}
            compact
            title="Issue Board"
            subtitle="Thao tác issue của riêng phiếu service này. Detail bên dưới chỉ giữ vai trò xem thông tin."
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
}
