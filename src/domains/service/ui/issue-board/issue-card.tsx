import * as React from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import type { IssueItem } from "./types";
import { actionModeLabel, areaLabel, fmtDT, fmtMoney, statusLabel } from "./helpers";
import { ClosedSrBadge, PriorityBadge, ReadyToCloseBadge } from "./badges";
import { getAreaAccent } from "./theme";

export function IssueCard({
  item,
  dragging,
  onOpen,
  onOpenServiceRequest,
  dragHandleProps,
}: {
  item: IssueItem;
  dragging?: boolean;
  onOpen?: () => void;
  onOpenServiceRequest?: () => void;
  dragHandleProps?: Record<string, any>;
}) {
  const sr = item?.serviceRequest ?? null;
  const accent = getAreaAccent(item.area);

  const imageSrc = sr?.primaryImageUrl
    ? `/api/media/sign?key=${encodeURIComponent(sr.primaryImageUrl)}`
    : null;

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition ${
        dragging ? "rotate-[1.5deg] shadow-xl" : "hover:shadow-md"
      }`}
    >
      <div className={`h-1.5 ${accent.topBar}`} />

      <div className={`border-b px-4 py-3 ${accent.headerBg} ${accent.headerBorder}`}>
        <div className="flex items-start justify-between gap-3">
          <button type="button" onClick={onOpen} className="min-w-0 flex-1 text-left">
            <div className="line-clamp-1 text-sm font-semibold text-stone-900">
              {item.summary || "Technical issue"}
            </div>
            <div className="mt-1 line-clamp-2 text-xs text-stone-600">
              {item.note || "Chưa có ghi chú kỹ thuật."}
            </div>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (sr?.id) onOpenServiceRequest?.();
              }}
              className="rounded-lg border border-stone-200 bg-white px-2.5 py-1 text-xs font-medium text-stone-700 hover:bg-stone-50"
            >
              Mở phiếu
            </button>

            <button
              type="button"
              {...dragHandleProps}
              onClick={(e) => e.stopPropagation()}
              className="cursor-grab rounded-lg border border-stone-200 bg-white px-2 py-1 text-stone-500 hover:bg-stone-50 active:cursor-grabbing"
              aria-label="Kéo thả issue"
              title="Kéo thả issue"
            >
              <GripVertical className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <button type="button" onClick={onOpen} className="block w-full text-left">
        <div className="space-y-3 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${accent.chip}`}>
              {areaLabel(item.area)}
            </span>
            <span className="rounded-full border border-stone-200 bg-stone-50 px-2 py-0.5 text-[11px] text-stone-700">
              {actionModeLabel(item.actionMode)}
            </span>
            <span className="rounded-full border border-stone-200 bg-stone-50 px-2 py-0.5 text-[11px] text-stone-700">
              {statusLabel(item.executionStatus)}
            </span>
            <PriorityBadge level={item.priority} />
            {item.serviceRequestClosed ? (
              <ClosedSrBadge />
            ) : item.serviceRequestReadyToClose ? (
              <ReadyToCloseBadge />
            ) : null}
          </div>

          <div className="rounded-xl bg-stone-50 px-3 py-3">
            <div className="text-[11px] uppercase tracking-wide text-stone-400">Sản phẩm</div>
            <div className="mt-2 grid grid-cols-[1fr_72px] gap-3">
              <div className="min-w-0">
                <div className="line-clamp-2 text-sm font-semibold text-stone-900">
                  {sr?.productTitle || "-"}
                </div>
                <div className="mt-1 text-xs text-stone-500">{sr?.refNo || "-"}</div>
              </div>

              <div className="h-[72px] w-[72px] overflow-hidden rounded-xl border border-stone-200 bg-white">
                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt={sr?.productTitle || "product"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[10px] text-stone-400">
                    No image
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-xl border border-stone-200 px-3 py-2">
              <div className="text-stone-400">Mở lúc</div>
              <div className="mt-1 font-medium text-stone-800">{fmtDT(item.openedAt)}</div>
            </div>
            <div className="rounded-xl border border-stone-200 px-3 py-2">
              <div className="text-stone-400">Chi phí dự kiến</div>
              <div className="mt-1 font-medium text-stone-800">{fmtMoney(item.estimatedCost)}</div>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}

export function DraggableIssueCard({
  item,
  activeId,
  onOpen,
  onOpenServiceRequest,
}: {
  item: IssueItem;
  activeId: string | null;
  onOpen?: () => void;
  onOpenServiceRequest?: () => void;
}) {
  const { setNodeRef, transform, isDragging, attributes, listeners } = useDraggable({
    id: item.id,
    data: {
      type: "issue",
      issue: item,
      column: item.boardColumn,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: activeId === item.id ? 0 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <IssueCard
        item={item}
        dragging={isDragging}
        onOpen={onOpen}
        onOpenServiceRequest={onOpenServiceRequest}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}
