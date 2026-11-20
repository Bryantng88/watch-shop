"use client";
import { AdminButton } from "@/domains/shared/ui/admin-design-contract/AdminButton";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Loader2,
  MessageCircle,
  Search,
  Zap,
} from "lucide-react";
import { AdminRowActionMenu } from "@/domains/shared/ui/admin-design-contract/AdminRowActionMenu";
import { ADMIN_TECHNICAL_LIST as styles, ADMIN_TECHNICAL_LIST_STYLE } from "@/domains/shared/ui/admin-design-contract/AdminTechnicalList";
import { resolveMediaPreviewSrc } from "@/lib/media-profile";
import type {
  CoordinationDashboardDTO,
  CoordinationTechnicalIssueBoardItemDTO as Item,
} from "../server/coordination-dashboard.types";
import {
  TECHNICAL_LIST_STAGES,
  technicalIssueListRows,
  technicalIssueListStages,
  technicalIssueListLoadTarget,
  technicalIssuePrimaryMove,
  technicalIssueListNavigation,
  type TechnicalIssueListState,
  type TechnicalIssueListStage,
} from "../shared/technical-issue-list";
const PAGE_SIZE = 25;
const money = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
const date = (value: string | null) =>
  value && Number.isFinite(Date.parse(value))
    ? new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit", month: "2-digit", year: "numeric",
        timeZone: "Asia/Ho_Chi_Minh",
      }).format(new Date(value))
    : "—";
type Move = { stage: TechnicalIssueListStage; label: string };
type Props = {
  stageNavigation?: "inline" | "external";
  items: Item[];
  pagination: NonNullable<
    CoordinationDashboardDTO["technicalIssueBoard"]
  >["columnPagination"];
  loadingColumn: string | null;
  focusedIssueId: string | null;
  pending: boolean;
  priorityPendingIssueId: string | null;
  isPriorityPendingFor?: (id: string) => boolean;
  doneRange: "14D" | "30D" | "ALL";
  onDoneRangeChange: (value: "14D" | "30D" | "ALL") => void;
  onLoadMore: (stage: TechnicalIssueListStage, page: number) => void;
  onPreview: (item: Item) => void;
  onMove: (id: string, stage: TechnicalIssueListStage) => void;
  onTogglePriority: (item: Item) => void;
  moveOptions: (item: Item) => Move[];
  areaLabel: (area: string | null) => string;
  ownerLabel: (mode: string | null, vendor: string | null) => string;
  state: TechnicalIssueListState;
  focusMemory?: { current: string };
  filtered?: boolean;
  loading?: boolean;
  onStateChange: (state: TechnicalIssueListState) => void;
  query?: string;
};
function RowActions({
  item,
  options,
  pending,
  onPreview,
  onMove,
}: {
  item: Item;
  options: Move[];
  pending: boolean;
  onPreview: () => void;
  onMove: (stage: TechnicalIssueListStage) => void;
}) {
  const primary = technicalIssuePrimaryMove(item.stage, options);
  const label = primary?.label ?? "Xem nhanh";
  if (options.length > 1) return <AdminRowActionMenu triggerClassName={styles.move} label={`Thao tác TI: ${item.summary}`} status={<span>{label}</span>} disabled={pending}
    actions={[...options.map(option => ({ key: option.stage, label: option.label, onSelect: () => onMove(option.stage) })), { key: "preview", label: "Xem nhanh", onSelect: onPreview }]} />;
  return <AdminButton variant="secondary" density="compact" type="button" className={styles.move} disabled={pending} aria-label={`${label}: ${item.summary}`} onClick={() => primary ? onMove(primary.stage) : onPreview()}>{label}<ChevronRight size={16} aria-hidden="true" /></AdminButton>;
}

function TechnicalThumbnail({ src }: { src: string | null }) {
  const [failed, setFailed] = useState(false);
  return <span className={styles.thumbnail}>{src && !failed ? <Image src={src} alt="" width={36} height={36} unoptimized onError={() => setFailed(true)} /> : <Clock3 size={16} aria-hidden="true" />}</span>;
}

export default function TechnicalIssueListView({
  items,
  pagination,
  loadingColumn,
  focusedIssueId,
  pending,
  priorityPendingIssueId,
  isPriorityPendingFor,
  doneRange,
  onDoneRangeChange,
  onLoadMore,
  onPreview,
  onMove,
  onTogglePriority,
  moveOptions,
  areaLabel,
  ownerLabel,
  state,
  onStateChange,
  query = "",
  focusMemory,
  stageNavigation = "inline",
  filtered = false,
  loading = false,
}: Props) {
  const { scope, sort, attention, page } = state,
    root = useRef<HTMLDivElement>(null),
    localFocus = useRef("");
  const lastFocus = focusMemory || localFocus,
    previousQuery = useRef(query);
  const focused = items.find((item) => item.id === focusedIssueId);
  useEffect(() => {
    if (!focused) {
      lastFocus.current = "";
      return;
    }
    const key = focused.id + ":" + focused.stage;
    if (lastFocus.current === key) return;
    lastFocus.current = key;
    const rows = technicalIssueListRows(items, focused.stage, sort);
    const index = rows.findIndex((item) => item.id === focused.id);
    onStateChange({
      ...state,
      scope: focused.stage,
      attention: "ALL",
      page: Math.floor(Math.max(0, index) / PAGE_SIZE) + 1,
    });
  }, [focused, items, onStateChange, sort, state, lastFocus]);
  const rows = technicalIssueListRows(items, scope, sort, attention),
    pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE)),
    currentPage = Math.max(1, Math.min(page, pages));
  const displayed = rows.slice(
      (currentPage - 1) * PAGE_SIZE,
      currentPage * PAGE_SIZE,
    ),
    stages = technicalIssueListStages(scope);
  const loaded = stages.reduce(
      (n, stage) =>
        n +
        (pagination[stage.key]?.loaded ??
          items.filter((item) => item.stage === stage.key).length),
      0,
    ),
    total = stages.reduce(
      (n, stage) =>
        n +
        (pagination[stage.key]?.total ??
          items.filter((item) => item.stage === stage.key).length),
      0,
    ),
    loadTarget = technicalIssueListLoadTarget(scope, pagination);
  const narrow = filtered || !!query || attention !== "ALL";
  useEffect(() => {
    if (previousQuery.current !== query) {
      previousQuery.current = query;
      if (page !== 1) onStateChange({ ...state, page: 1 });
    } else if (page > pages) onStateChange({ ...state, page: pages });
  }, [query, page, pages, state, onStateChange]);
  useEffect(() => {
    if (!focusedIssueId) return;
    const row = root.current?.querySelector<HTMLElement>(
      `[data-technical-issue-id="${CSS.escape(focusedIssueId)}"]`,
    );
    row?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [focusedIssueId, currentPage, scope]);
  function change(patch: Partial<TechnicalIssueListState>) {
    lastFocus.current = focused ? focused.id + ":" + focused.stage : "";
    onStateChange({ ...state, ...patch, page: 1 });
  }
  return (
    <div
      ref={root}
      className={styles.list}
      style={ADMIN_TECHNICAL_LIST_STYLE}
      aria-busy={loading || !!loadingColumn}
    >
      {stageNavigation === "inline" && <div className={styles.toolbar}>
        {stageNavigation === "inline" && <div className={styles.tabs} role="group" aria-label="Trạng thái TI">
          {technicalIssueListNavigation(items, pagination, state, narrow).map(stage => <AdminButton variant="contextual" type="button" key={stage.key} aria-pressed={scope === stage.key} onClick={() => change({ scope: stage.key })}>
            {stage.label}<span>{stage.count.toLocaleString("vi-VN")}</span>
          </AdminButton>)}
        </div>}
        <div className={styles.filters}>
          {scope === "DONE" && (
            <select
              disabled={!!loadingColumn}
              aria-label="Lịch sử TI đã xong"
              value={doneRange}
              onChange={(event) => {
                change({});
                onDoneRangeChange(event.target.value as typeof doneRange);
              }}
            >
              <option value="14D">14 ngày gần đây</option>
              <option value="30D">30 ngày gần đây</option>
              <option value="ALL">Toàn bộ lịch sử</option>
            </select>
          )}
          <select
            aria-label="Lọc chú ý TI"
            value={attention}
            onChange={(event) =>
              change({ attention: event.target.value as typeof attention })
            }
          >
            <option value="ALL">Tất cả mức chú ý</option>
            <option value="OVERDUE">Quá hạn</option>
            <option value="URGENT">Ưu tiên gấp</option>
            <option value="MENTIONED">Nhắc tôi chưa đọc</option>
          </select>
          <select
            aria-label="Sắp xếp TI"
            value={sort}
            onChange={(event) =>
              change({ sort: event.target.value as typeof sort })
            }
          >
            <option value="PRIORITY">Ưu tiên trước</option>
            <option value="DUE">Hạn gần nhất</option>
            <option value="UPDATED">Mới cập nhật</option>
          </select>
        </div>
      </div>}
      {(loading || loadingColumn) && (
        <p role="status" className={styles.loading}>
          <Loader2 size={14} className="animate-spin" aria-hidden="true" />
          Đang tải dữ liệu TI…
        </p>
      )}
      <div
        className={styles.table}
        role="table"
        aria-label="Danh sách TI"
        aria-describedby="ti-list-coverage"
      >
        <div role="rowgroup" className={styles.headerGroup}>
          <div role="row" className={styles.header}>
            {[
              "Lỗi / Đồng hồ",
              "Xử lý",
              "Thời hạn",
              "Chi phí",
              "Thao tác",
            ].map((label) => (
              <div role="columnheader" key={label}>
                {label}
              </div>
            ))}
          </div>
        </div>
        <div role="rowgroup">
          {displayed.map((item) => {
            const image = resolveMediaPreviewSrc(item.serviceRequest.imageUrl),
              urgent = item.priority?.toUpperCase() === "URGENT",
              busy =
                isPriorityPendingFor?.(item.id) ??
                priorityPendingIssueId === item.id,
              late = (item.overdueDays ?? 0) > 0;
            return (
              <div
                role="row"
                key={item.id}
                data-technical-issue-id={item.id}
                className={`${styles.row} ${focusedIssueId === item.id ? styles.focused : ""}`}
              >
                <div role="cell" className={styles.identity}>
                  <AdminButton
                    variant="contextual"
                    type="button"
                    className={styles.open}
                    onClick={() => onPreview(item)}
                    aria-label={`Xem nhanh TI ${item.summary}`}
                    title={
                      item.processingDetails.length
                        ? item.processingDetails.join(" · ")
                        : undefined
                    }
                  />
                  <TechnicalThumbnail key={image || "missing"} src={image} />
                  <div className={styles.identityText}>
                    <div className={styles.titleLine}>
                      <span className={styles.title}>{item.summary}</span>
                      <AdminButton
                        variant="contextual"
                        type="button"
                        aria-pressed={urgent}
                        aria-busy={busy}
                        disabled={busy}
                        aria-label={`${urgent ? "Bỏ gấp" : "Đánh dấu gấp"}: ${item.summary}`}
                        title={
                          urgent ? "Bỏ ưu tiên gấp" : "Đánh dấu ưu tiên gấp"
                        }
                        className={`${styles.priority} ${urgent ? styles.urgent : ""}`}
                        onClick={() => onTogglePriority(item)}
                      >
                        {busy ? (
                          <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                        ) : (
                          <Zap size={14} aria-hidden="true" />
                        )}
                      </AdminButton>
                    </div>
                    <span
                      className={styles.product}
                      title={
                        item.serviceRequest.productTitle ||
                        item.serviceRequest.sku ||
                        undefined
                      }
                    >
                      {item.serviceRequest.productTitle ||
                        item.serviceRequest.sku ||
                        "Đồng hồ chưa đặt tên"}
                    </span>
                    <span className={styles.meta}>
                      <span>
                        {item.serviceRequest.refNo || "Chưa có mã SR"}
                      </span>
                      <span>{areaLabel(item.area)}</span>
                      {item.requestOrigin === "CUSTOMER_ORDER" && (
                        <span className={styles.order}>Đơn khách</span>
                      )}
                      {(item.commentCount > 0 ||
                        item.unreadMentionCount > 0) && (
                        <span
                          className={
                            item.unreadMentionCount ? styles.unread : ""
                          }
                          title={`${item.commentCount} bình luận · ${item.unreadMentionCount} nhắc bạn chưa đọc`}
                        >
                          <MessageCircle size={12} />
                          {item.commentCount}
                          {item.unreadMentionCount > 0
                            ? ` · @${item.unreadMentionCount}`
                            : ""}
                        </span>
                      )}
                    </span>
                    <span className="sr-only">
                      {item.processingDetails.join(" · ")}
                    </span>
                  </div>
                </div>
                <div role="cell" className={styles.owner}>
                  <span className={styles.stage} data-stage={item.stage}>
                    {
                      TECHNICAL_LIST_STAGES.find(
                        (stage) => stage.key === item.stage,
                      )?.label
                    }
                  </span>
                  <span className={styles.ownerName}>
                    {ownerLabel(item.actionMode, item.vendorName)}
                  </span>
                  <span className="sr-only">
                    Cập nhật: {item.lastUpdatedBy.label} ·{" "}
                    {date(item.updatedAt)}
                  </span>
                </div>
                <div role="cell" className={styles.due}>
                  <span className={styles.mobileLabel}>Thời hạn</span>
                  <span
                    className={late && item.stage !== "DONE" ? styles.late : ""}
                    aria-label={
                      !item.expectedCompletionAt ? "Chưa hẹn hạn" : undefined
                    }
                  >
                    {item.expectedCompletionAt
                      ? date(item.expectedCompletionAt)
                      : "—"}
                  </span>
                  {late && (
                    <small className={item.stage === "DONE" ? "" : styles.late}>
                      <Clock3 size={12} />
                      {item.stage === "DONE"
                        ? `Hoàn tất trễ ${item.overdueDays} ngày`
                        : `Quá hạn ${item.overdueDays} ngày`}
                    </small>
                  )}
                </div>
                <div
                  role="cell"
                  className={styles.cost}
                  aria-label={
                    item.actualCost == null && item.estimatedCost == null
                      ? "Chưa có chi phí"
                      : undefined
                  }
                >
                  <span className={styles.mobileLabel}>Chi phí</span>
                  <span>
                    {item.actualCost != null
                      ? money(item.actualCost)
                      : item.estimatedCost != null
                        ? money(item.estimatedCost)
                        : "—"}
                  </span>
                  {(item.actualCost != null || item.estimatedCost != null) && (
                    <small>
                      {item.actualCost != null ? "Thực tế" : "Dự kiến"}
                    </small>
                  )}
                </div>
                <div role="cell" className={styles.actionCell}>
                  <RowActions
                    item={item}
                    options={moveOptions(item)}
                    pending={pending}
                    onPreview={() => onPreview(item)}
                    onMove={(stage) => onMove(item.id, stage)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {!displayed.length && !loading && !loadingColumn && (
        <div className={styles.empty}>
          <Search size={22} />
          <strong>Không có TI khớp bộ lọc</strong>
          <p>
            {loaded < total
              ? "Bạn có thể đổi bộ lọc hoặc tải thêm dữ liệu bên dưới."
              : "Thử đổi trạng thái hoặc xóa bộ lọc đang chọn."}
          </p>
          {attention !== "ALL" && (
            <AdminButton variant="secondary" type="button" onClick={() => change({ attention: "ALL" })}>
              Bỏ lọc chú ý
            </AdminButton>
          )}
        </div>
      )}
      <div className={styles.footer}>
        <div>
          <p id="ti-list-coverage">
            {rows.length > 0
              ? `${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(currentPage * PAGE_SIZE, rows.length)} / ${rows.length} TI khớp bộ lọc`
              : "0 TI khớp bộ lọc"}{" "}
            <span>
              · {loaded}/{total} TI đã tải
            </span>
          </p>
          {loaded < total && (
            <small>Lọc và sắp xếp áp dụng cho TI đã tải.</small>
          )}
        </div>
        <div className={styles.pager}>
          <AdminButton variant="secondary"
            type="button"
            aria-label="Trang TI trước"
            disabled={currentPage <= 1}
            onClick={() => onStateChange({ ...state, page: currentPage - 1 })}
          >
            <ChevronLeft size={15} />
          </AdminButton>
          <span>
            {currentPage}/{pages}
          </span>
          <AdminButton variant="secondary"
            type="button"
            aria-label="Trang TI sau"
            disabled={currentPage >= pages}
            onClick={() => onStateChange({ ...state, page: currentPage + 1 })}
          >
            <ChevronRight size={15} />
          </AdminButton>
          {loadTarget && (
            <AdminButton variant="secondary"
              type="button"
              className={styles.load}
              disabled={!!loadingColumn}
              aria-busy={loadingColumn === `technical:${loadTarget}`}
              onClick={() =>
                onLoadMore(loadTarget, pagination[loadTarget].nextPage!)
              }
            >
              {loadingColumn === `technical:${loadTarget}` ? (
                <Loader2 size={14} className="animate-spin" aria-hidden="true" />
              ) : (
                <ArrowDown size={14} />
              )}
              Tải thêm{" "}
              {TECHNICAL_LIST_STAGES.find(
                (stage) => stage.key === loadTarget,
              )?.label.toLocaleLowerCase("vi")}
            </AdminButton>
          )}
        </div>
      </div>
    </div>
  );
}
