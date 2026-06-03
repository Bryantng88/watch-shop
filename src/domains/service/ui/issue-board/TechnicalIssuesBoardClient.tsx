"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DragOverEvent,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Search, X } from "lucide-react";
import { BoardColumn } from "./board-column";
import { COLUMNS } from "./constants";
import { canMove } from "./dnd";
import { actionModeLabel, areaLabel, normalizeText } from "./helpers";
import { DraggableIssueCard, IssueCard } from "./issue-card";
import { IssueDrawer } from "./issue-drawer";
import { FilterChip } from "./filter-chip";
import type {
  BoardColumnKey,
  IssueItem,
  IssueBoardCatalogs,
  TechnicalDetailCatalogOption,
  SupplyCatalogOption,
  MechanicalPartCatalogOption,
} from "./types";
import { notify } from "@/lib/notify";
type Props = {
  items: IssueItem[];
  counts: {
    pendingConfirm: number;
    ready: number;
    inProgress: number;
    done: number;
    readyToCloseSrCount?: number;
  };
  title?: string;
  subtitle?: string;
  serviceRequestId?: string | null;
  compact?: boolean;
  onClose?: () => void;
  catalogs?: IssueBoardCatalogs;
  technicalDetailCatalogOptions?: TechnicalDetailCatalogOption[];
  supplyCatalogOptions?: SupplyCatalogOption[];
  mechanicalPartCatalogOptions?: MechanicalPartCatalogOption[];
};

export default function TechnicalIssueBoardClient({
  items,
  counts,
  title = "Technical Issue Board",
  catalogs,
  subtitle = "Điều phối toàn bộ technical issue theo trạng thái vận hành.",
  serviceRequestId = null,
  compact = false,
  onClose,

  technicalDetailCatalogOptions = [],
  supplyCatalogOptions = [],
  mechanicalPartCatalogOptions = [],
}: Props) {
  const router = useRouter();
  const [boardItems, setBoardItems] = React.useState<IssueItem[]>(items ?? []);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [overColumn, setOverColumn] = React.useState<BoardColumnKey | null>(
    null,
  );
  const [busyId, setBusyId] = React.useState<string | null>(null);
  const [selectedIssue, setSelectedIssue] = React.useState<IssueItem | null>(
    null,
  );
  const [drawerState, setDrawerState] = React.useState({
    actualCost: "",
    resolutionNote: "",
    technicalDetailCatalogId: "",
    actionMode: "INTERNAL",
    vendorId: "",
    supplyCatalogId: "",
    mechanicalPartCatalogId: "",
  });
  const [cancelingIssueId, setCancelingIssueId] = React.useState<string | null>(
    null,
  );
  const [query, setQuery] = React.useState("");
  const [areaFilter, setAreaFilter] = React.useState<string>("ALL");
  const [actionModeFilter, setActionModeFilter] = React.useState<string>("ALL");
  const [visibleCountByColumn, setVisibleCountByColumn] = React.useState<
    Record<BoardColumnKey, number>
  >({
    PENDING_CONFIRM: 12,
    READY: 12,
    IN_PROGRESS: 12,
    DONE: 12,
  });
  const [loadingMoreColumn, setLoadingMoreColumn] =
    React.useState<BoardColumnKey | null>(null);

  const normalizedTechnicalDetailCatalogOptions = React.useMemo<
    TechnicalDetailCatalogOption[]
  >(() => {
    const direct = Array.isArray(technicalDetailCatalogOptions)
      ? technicalDetailCatalogOptions
      : [];
    if (direct.length > 0) return direct;

    const fromCatalogs = Array.isArray(catalogs?.technicalDetailCatalogOptions)
      ? catalogs.technicalDetailCatalogOptions
      : [];

    return fromCatalogs;
  }, [technicalDetailCatalogOptions, catalogs]);

  const normalizedSupplyCatalogOptions = React.useMemo<SupplyCatalogOption[]>(() => {
    if (Array.isArray(supplyCatalogOptions) && supplyCatalogOptions.length > 0) {
      return supplyCatalogOptions;
    }

    if (Array.isArray(catalogs?.supplyCatalogOptions)) return catalogs.supplyCatalogOptions;
    if (Array.isArray(catalogs?.supplyCatalogs)) return catalogs.supplyCatalogs;
    if (Array.isArray(catalogs?.supplies)) return catalogs.supplies;

    return [];
  }, [supplyCatalogOptions, catalogs]);

  const normalizedMechanicalPartCatalogOptions = React.useMemo<MechanicalPartCatalogOption[]>(() => {
    if (Array.isArray(mechanicalPartCatalogOptions) && mechanicalPartCatalogOptions.length > 0) {
      return mechanicalPartCatalogOptions;
    }

    if (Array.isArray(catalogs?.mechanicalPartCatalogOptions)) return catalogs.mechanicalPartCatalogOptions;
    if (Array.isArray(catalogs?.mechanicalPartCatalogs)) return catalogs.mechanicalPartCatalogs;
    if (Array.isArray(catalogs?.parts)) return catalogs.parts;

    return [];
  }, [mechanicalPartCatalogOptions, catalogs]);

  React.useEffect(() => {
    setBoardItems(items ?? []);
  }, [items]);

  React.useEffect(() => {
    if (!selectedIssue) return;
    setDrawerState({
      actualCost:
        selectedIssue.actualCost != null &&
          Number.isFinite(Number(selectedIssue.actualCost))
          ? String(selectedIssue.actualCost)
          : "",
      resolutionNote: selectedIssue.resolutionNote ?? "",
      technicalDetailCatalogId: selectedIssue.technicalDetailCatalog?.id ?? "",
      actionMode: selectedIssue.actionMode ?? "INTERNAL",
      vendorId: selectedIssue.vendorId ?? "",
      supplyCatalogId: selectedIssue.supplyCatalog?.id ?? "",
      mechanicalPartCatalogId: selectedIssue.mechanicalPartCatalog?.id ?? "",
    });
  }, [selectedIssue]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  const filteredItems = React.useMemo(() => {
    const q = normalizeText(query);

    return (boardItems ?? []).filter((item) => {
      const sr = item?.serviceRequest ?? null;

      const matchesQuery =
        !q ||
        [
          item.summary,
          item.note,
          sr?.productTitle,
          sr?.refNo,
          item.vendorNameSnap,
          sr?.technicianNameSnap,
          areaLabel(item.area),
          actionModeLabel(item.actionMode),
        ]
          .map(normalizeText)
          .some((x) => x.includes(q));

      const matchesArea =
        areaFilter === "ALL" ||
        String(item.area || "").toUpperCase() === areaFilter;
      const matchesActionMode =
        actionModeFilter === "ALL" ||
        String(item.actionMode || "").toUpperCase() === actionModeFilter;

      return matchesQuery && matchesArea && matchesActionMode;
    });
  }, [boardItems, query, areaFilter, actionModeFilter, serviceRequestId]);

  const grouped = React.useMemo(() => {
    const base: Record<BoardColumnKey, IssueItem[]> = {
      PENDING_CONFIRM: [],
      READY: [],
      IN_PROGRESS: [],
      DONE: [],
    };

    for (const item of filteredItems) {
      const key = (item.boardColumn || "PENDING_CONFIRM") as BoardColumnKey;
      base[key].push(item);
    }

    return {
      PENDING_CONFIRM: base.PENDING_CONFIRM.slice(
        0,
        visibleCountByColumn.PENDING_CONFIRM,
      ),
      READY: base.READY.slice(0, visibleCountByColumn.READY),
      IN_PROGRESS: base.IN_PROGRESS.slice(0, visibleCountByColumn.IN_PROGRESS),
      DONE: base.DONE.slice(0, visibleCountByColumn.DONE),
      raw: base,
    };
  }, [filteredItems, visibleCountByColumn]);

  const filteredCounts = React.useMemo(() => {
    const readyToCloseSrIds = Array.from(
      new Set(
        filteredItems
          .filter((x) => x?.serviceRequestReadyToClose && x?.serviceRequest?.id)
          .map((x) => x.serviceRequest!.id),
      ),
    );

    return {
      pendingConfirm: grouped.raw.PENDING_CONFIRM.length,
      ready: grouped.raw.READY.length,
      inProgress: grouped.raw.IN_PROGRESS.length,
      done: grouped.raw.DONE.length,
      readyToCloseSrCount: readyToCloseSrIds.length,
    };
  }, [grouped, filteredItems]);

  const activeItem = React.useMemo(
    () => boardItems.find((x) => x.id === activeId) ?? null,
    [boardItems, activeId],
  );

  async function callAction(
    issueId: string,
    action: "confirm" | "start" | "complete" | "cancel",
    rollback?: IssueItem[],
  ) {
    try {
      setBusyId(issueId);

      const endpoint =
        action === "confirm"
          ? `/api/admin/technical-issues/${issueId}/confirm`
          : action === "start"
            ? `/api/admin/technical-issues/${issueId}/start`
            : action === "complete"
              ? `/api/admin/technical-issues/${issueId}/complete`
              : `/api/admin/technical-issues/${issueId}/cancel`;

      const body =
        action === "start"
          ? {
            technicalDetailCatalogId:
              drawerState.technicalDetailCatalogId || null,
            actionMode: drawerState.actionMode || "INTERNAL",
            vendorId: drawerState.vendorId || null,
          }
          : action === "complete"
            ? {
              actualCost:
                drawerState.actualCost.trim() === ""
                  ? null
                  : Number(drawerState.actualCost),
              resolutionNote: drawerState.resolutionNote.trim() || null,
              supplyCatalogId: drawerState.supplyCatalogId || null,
              mechanicalPartCatalogId: drawerState.mechanicalPartCatalogId || null,
              actionMode: drawerState.actionMode || "INTERNAL",
              vendorId: drawerState.vendorId || null,
            }
            : action === "cancel"
              ? {
                reason: drawerState.resolutionNote.trim() || null,
              }
              : {};

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (rollback) setBoardItems(rollback);
        alert(json?.error || "Không thể cập nhật issue");
        return;
      }

      router.refresh();
      setSelectedIssue(null);
    } finally {
      setBusyId(null);
      setActiveId(null);
      setOverColumn(null);
    }
  }

  function optimisticMove(issueId: string, targetColumn: BoardColumnKey) {
    setBoardItems((prev) =>
      prev.map((item) => {
        if (item.id !== issueId) return item;

        if (targetColumn === "READY") {
          return {
            ...item,
            boardColumn: "READY",
            isConfirmed: true,
            confirmedAt: new Date().toISOString(),
          };
        }
        if (targetColumn === "IN_PROGRESS") {
          return {
            ...item,
            boardColumn: "IN_PROGRESS",
            executionStatus: "IN_PROGRESS",
            startedAt: new Date().toISOString(),
          };
        }
        if (targetColumn === "DONE") {
          return {
            ...item,
            boardColumn: "DONE",
            executionStatus: "DONE",
            completedAt: new Date().toISOString(),
            actualCost:
              drawerState.actualCost.trim() === ""
                ? (item.actualCost ?? null)
                : Number(drawerState.actualCost),
            resolutionNote:
              drawerState.resolutionNote.trim() || item.resolutionNote,
            supplyCatalog: drawerState.supplyCatalogId
              ? item.supplyCatalog
              : item.supplyCatalog,
            mechanicalPartCatalog: drawerState.mechanicalPartCatalogId
              ? item.mechanicalPartCatalog
              : item.mechanicalPartCatalog,
          };
        }

        return item;
      }),
    );
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function handleDragOver(event: DragOverEvent) {
    const overId = event.over?.id ? String(event.over.id) : null;

    if (
      overId === "PENDING_CONFIRM" ||
      overId === "READY" ||
      overId === "IN_PROGRESS" ||
      overId === "DONE"
    ) {
      setOverColumn(overId);
      return;
    }

    setOverColumn(null);
  }

  function handleDragEnd(event: DragEndEvent) {
    const active = event.active;
    const over = event.over;

    if (!active || !over) {
      setActiveId(null);
      setOverColumn(null);
      return;
    }

    const issueId = String(active.id);
    const issue = boardItems.find((x) => x.id === issueId);

    if (!issue) {
      setActiveId(null);
      setOverColumn(null);
      return;
    }

    const targetColumn = String(over.id) as BoardColumnKey;

    if (
      targetColumn !== "PENDING_CONFIRM" &&
      targetColumn !== "READY" &&
      targetColumn !== "IN_PROGRESS" &&
      targetColumn !== "DONE"
    ) {
      setActiveId(null);
      setOverColumn(null);
      return;
    }

    const from = issue.boardColumn;
    const snapshot = [...boardItems];

    if (!canMove(from, targetColumn)) {
      setActiveId(null);
      setOverColumn(null);
      return;
    }

    optimisticMove(issueId, targetColumn);
    setActiveId(null);
    setOverColumn(null);

    if (from === "PENDING_CONFIRM" && targetColumn === "READY") {
      void callAction(issueId, "confirm", snapshot);
      return;
    }
    if (from === "READY" && targetColumn === "IN_PROGRESS") {
      setBoardItems(snapshot);
      setSelectedIssue(issue);
      return;
    }

    if (from === "IN_PROGRESS" && targetColumn === "DONE") {
      setBoardItems(snapshot);
      setSelectedIssue(issue);
      return;
    }
  }

  async function handleCancelIssue(issueId: string) {
    try {
      setCancelingIssueId(issueId);

      const res = await fetch(`/api/admin/technical-issues/${issueId}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "Hủy issue từ Issue Board" }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json?.error || "Không thể hủy issue");
      }

      notify.success({
        title: "Đã hủy issue",
        message: "Issue đã được chuyển sang trạng thái hủy.",
      });

      router.refresh();
    } catch (error: any) {
      notify.error({
        title: "Hủy issue thất bại",
        message: error?.message || "Đã có lỗi xảy ra.",
      });
    } finally {
      setCancelingIssueId(null);
    }
  }

  function loadMore(column: BoardColumnKey) {
    setLoadingMoreColumn(column);

    setTimeout(() => {
      setVisibleCountByColumn((prev) => ({
        ...prev,
        [column]: prev[column] + 12,
      }));
      setLoadingMoreColumn(null);
    }, 250);
  }

  function clearFilters() {
    setQuery("");
    setAreaFilter("ALL");
    setActionModeFilter("ALL");
  }

  return (
    <div
      className={
        compact
          ? "min-w-0 space-y-4"
          : "mx-auto w-full max-w-[1360px] min-w-0 space-y-5 px-4 py-6 lg:px-5 xl:px-6"
      }
    >
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold text-slate-950">{title}</h1>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>

        <div className="flex flex-col gap-3 xl:items-end">
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="self-start rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 xl:self-end"
            >
              Đóng
            </button>
          ) : null}

          <div
            className={
              compact
                ? "grid grid-cols-2 gap-3 lg:grid-cols-5"
                : "grid w-full grid-cols-2 gap-3 md:grid-cols-3 xl:w-[720px] xl:grid-cols-5"
            }
          >
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 shadow-sm">
              <div className="text-xs uppercase tracking-wide text-amber-700">
                Chờ xác nhận
              </div>
              <div className="mt-1 text-xl font-semibold text-amber-900">
                {filteredCounts.pendingConfirm}
              </div>
            </div>
            <div className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 shadow-sm">
              <div className="text-xs uppercase tracking-wide text-sky-700">
                Đã xác nhận
              </div>
              <div className="mt-1 text-xl font-semibold text-sky-900">
                {filteredCounts.ready}
              </div>
            </div>
            <div className="rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3 shadow-sm">
              <div className="text-xs uppercase tracking-wide text-indigo-700">
                Đang xử lý
              </div>
              <div className="mt-1 text-xl font-semibold text-indigo-900">
                {filteredCounts.inProgress}
              </div>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 shadow-sm">
              <div className="text-xs uppercase tracking-wide text-emerald-700">
                Hoàn tất
              </div>
              <div className="mt-1 text-xl font-semibold text-emerald-900">
                {filteredCounts.done}
              </div>
            </div>
            <div className="rounded-2xl border border-teal-200 bg-teal-50 px-4 py-3 shadow-sm">
              <div className="text-xs uppercase tracking-wide text-teal-700">
                SR sẵn sàng đóng
              </div>
              <div className="mt-1 text-xl font-semibold text-teal-900">
                {filteredCounts.readyToCloseSrCount}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative w-full max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm theo sản phẩm, SR, issue, kỹ thuật viên, vendor..."
              className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm outline-none focus:border-slate-400"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <FilterChip
              active={areaFilter === "ALL"}
              onClick={() => setAreaFilter("ALL")}
            >
              Tất cả khu vực
            </FilterChip>
            <FilterChip
              active={areaFilter === "MOVEMENT"}
              onClick={() => setAreaFilter("MOVEMENT")}
            >
              Máy
            </FilterChip>
            <FilterChip
              active={areaFilter === "CASE"}
              onClick={() => setAreaFilter("CASE")}
            >
              Vỏ
            </FilterChip>
            <FilterChip
              active={areaFilter === "CRYSTAL"}
              onClick={() => setAreaFilter("CRYSTAL")}
            >
              Kính
            </FilterChip>
            <FilterChip
              active={areaFilter === "DIAL"}
              onClick={() => setAreaFilter("DIAL")}
            >
              Mặt số
            </FilterChip>
            <FilterChip
              active={areaFilter === "CROWN"}
              onClick={() => setAreaFilter("CROWN")}
            >
              Núm
            </FilterChip>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <FilterChip
            active={actionModeFilter === "ALL"}
            onClick={() => setActionModeFilter("ALL")}
          >
            Tất cả thực hiện
          </FilterChip>
          <FilterChip
            active={actionModeFilter === "INTERNAL"}
            onClick={() => setActionModeFilter("INTERNAL")}
          >
            Nội bộ
          </FilterChip>
          <FilterChip
            active={actionModeFilter === "VENDOR"}
            onClick={() => setActionModeFilter("VENDOR")}
          >
            Vendor
          </FilterChip>

          {(query || areaFilter !== "ALL" || actionModeFilter !== "ALL") && (
            <button
              type="button"
              onClick={clearFilters}
              className="ml-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600 hover:bg-slate-100"
            >
              Xóa filter
            </button>
          )}
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div
          className={
            compact
              ? "grid gap-4 xl:grid-cols-4"
              : "grid min-h-[520px] gap-4 xl:grid-cols-4"
          }
        >
          {COLUMNS.map((column) => {
            const columnItems = grouped[column.key] ?? [];
            const rawCount = grouped.raw[column.key]?.length ?? 0;

            return (
              <BoardColumn
                key={column.key}
                column={column}
                items={columnItems}
                isOver={overColumn === column.key}
                canLoadMore={rawCount > columnItems.length}
                onLoadMore={() => loadMore(column.key)}
                loadingMore={loadingMoreColumn === column.key}
                totalCount={rawCount}
              >
                {columnItems.map((item) => (
                  <DraggableIssueCard
                    key={item.id}
                    item={item}
                    activeId={activeId}
                    onOpen={() => setSelectedIssue(item)}
                    onOpenServiceRequest={() => {
                      if (item?.serviceRequest?.id) {
                        router.push(
                          `/admin/service-requests/${item.serviceRequest.id}`,
                        );
                      }
                    }}
                  />
                ))}
              </BoardColumn>
            );
          })}
        </div>

        <DragOverlay dropAnimation={{ duration: 180, easing: "ease-out" }}>
          {activeItem ? (
            <div className="w-[360px] max-w-[90vw]">
              <IssueCard
                item={activeItem}
                dragging
                onOpen={() => { }}
                onOpenServiceRequest={() => { }}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {selectedIssue && (
        <IssueDrawer
          issue={selectedIssue}
          busyId={busyId}
          actualCost={drawerState.actualCost}
          resolutionNote={drawerState.resolutionNote}
          onChangeActualCost={(value) =>
            setDrawerState((prev) => ({ ...prev, actualCost: value }))
          }
          onChangeResolutionNote={(value) =>
            setDrawerState((prev) => ({ ...prev, resolutionNote: value }))
          }
          technicalDetailCatalogOptions={
            normalizedTechnicalDetailCatalogOptions
          }
          supplyCatalogOptions={normalizedSupplyCatalogOptions}
          mechanicalPartCatalogOptions={normalizedMechanicalPartCatalogOptions}
          technicalDetailCatalogId={drawerState.technicalDetailCatalogId}
          supplyCatalogId={drawerState.supplyCatalogId}
          mechanicalPartCatalogId={drawerState.mechanicalPartCatalogId}
          actionMode={drawerState.actionMode}
          vendorId={drawerState.vendorId}
          onChangeTechnicalDetailCatalogId={(value) =>
            setDrawerState((prev) => ({
              ...prev,
              technicalDetailCatalogId: value,
            }))
          }
          onChangeSupplyCatalogId={(value) =>
            setDrawerState((prev) => ({ ...prev, supplyCatalogId: value }))
          }
          onChangeMechanicalPartCatalogId={(value) =>
            setDrawerState((prev) => ({
              ...prev,
              mechanicalPartCatalogId: value,
            }))
          }
          onChangeActionMode={(value) =>
            setDrawerState((prev) => ({ ...prev, actionMode: value }))
          }
          onChangeVendorId={(value) =>
            setDrawerState((prev) => ({ ...prev, vendorId: value }))
          }
          onClose={() => setSelectedIssue(null)}
          onAction={callAction}
          onOpenServiceRequest={() => {
            if (selectedIssue?.serviceRequest?.id) {
              router.push(
                `/admin/service-requests/${selectedIssue.serviceRequest.id}`,
              );
            }
          }}
          onCancelIssue={handleCancelIssue}
          cancelingIssueId={cancelingIssueId}
        />
      )}
    </div>
  );
}
