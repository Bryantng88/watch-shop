"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Loader2,
  MessageCircle,
  MoreHorizontal,
  Search,
  Zap,
} from "lucide-react";
import {
  ADMIN_DOMAIN_TONE,
  AdminUserAvatar,
} from "@/domains/shared/ui/admin-design-contract";
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
  type TechnicalIssueListState,
  type TechnicalIssueListStage,
} from "../shared/technical-issue-list";
import styles from "./TechnicalIssueListView.module.css";
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
        dateStyle: "short",
        timeZone: "Asia/Ho_Chi_Minh",
      }).format(new Date(value))
    : "—";
type Move = { stage: TechnicalIssueListStage; label: string };
type Props = {
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
  const primary = technicalIssuePrimaryMove(item.stage, options),
    trigger = useRef<HTMLButtonElement>(null),
    menu = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false),
    [position, setPosition] = useState({ top: 0, left: 0 });
  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (
        !trigger.current?.contains(event.target as Node) &&
        !menu.current?.contains(event.target as Node)
      )
        setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    const scroll = () => setOpen(false);
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", escape);
    window.addEventListener("scroll", scroll, true);
    window.addEventListener("resize", scroll);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", escape);
      window.removeEventListener("scroll", scroll, true);
      window.removeEventListener("resize", scroll);
    };
  }, [open]);
  useEffect(() => setOpen(false), [item.stage, pending]);
  function toggle() {
    const rect = trigger.current?.getBoundingClientRect();
    if (rect)
      setPosition({
        top: Math.max(
          8,
          Math.min(
            rect.bottom + 6,
            window.innerHeight - ((options.length + 1) * 40 + 16),
          ),
        ),
        left: Math.max(8, Math.min(rect.right - 240, window.innerWidth - 248)),
      });
    setOpen(!open);
    if (!open)
      requestAnimationFrame(() =>
        menu.current?.querySelector<HTMLButtonElement>("button")?.focus(),
      );
  }
  return (
    <div className={styles.actions}>
      <button
        type="button"
        className={styles.move}
        disabled={pending}
        aria-label={`${primary ? primary.label : "Xem nhanh"}: ${item.summary}`}
        onClick={() => (primary ? onMove(primary.stage) : onPreview())}
      >
        {primary ? primary.label : "Xem nhanh"}
        <ChevronRight size={13} />
      </button>
      {options.some((option) => option.stage !== primary?.stage) && (
        <button
          ref={trigger}
          type="button"
          className={styles.iconButton}
          disabled={pending}
          aria-label={`Thao tác khác: ${item.summary}`}
          aria-expanded={open}
          onClick={toggle}
        >
          <MoreHorizontal size={17} />
        </button>
      )}
      {open &&
        createPortal(
          <div
            ref={menu}
            className={styles.menu}
            style={position}
            aria-label={`Thao tác TI ${item.summary}`}
          >
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onPreview();
              }}
            >
              Xem nhanh
            </button>
            {options
              .filter((option) => option.stage !== primary?.stage)
              .map((option) => (
                <button
                  key={option.stage}
                  type="button"
                  disabled={pending}
                  onClick={() => {
                    setOpen(false);
                    onMove(option.stage);
                  }}
                >
                  {option.label}
                </button>
              ))}
          </div>,
          document.body,
        )}
    </div>
  );
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
      aria-busy={loading || !!loadingColumn}
    >
      <div className={styles.toolbar}>
        <div className={styles.tabs} role="group" aria-label="Trạng thái TI">
          {[
            { key: "OPEN" as const, label: "Đang mở" },
            ...TECHNICAL_LIST_STAGES,
          ].map((stage) => (
            <button
              type="button"
              key={stage.key}
              aria-pressed={scope === stage.key}
              onClick={() => change({ scope: stage.key })}
            >
              {stage.label}
              <span>
                {narrow
                  ? technicalIssueListRows(items, stage.key, sort, attention)
                      .length
                  : technicalIssueListStages(stage.key).reduce(
                      (n, s) =>
                        n +
                        (pagination[s.key]?.total ??
                          items.filter((item) => item.stage === s.key).length),
                      0,
                    )}
              </span>
            </button>
          ))}
        </div>
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
      </div>
      {(loading || loadingColumn) && (
        <p role="status" className={styles.loading}>
          <Loader2 size={14} className="animate-spin" />
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
              "TI / Đồng hồ",
              "Trạng thái",
              "Đơn vị xử lý",
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
                  <button
                    type="button"
                    className={styles.open}
                    onClick={() => onPreview(item)}
                    aria-label={`Xem nhanh TI ${item.summary}`}
                  >
                    <span className={styles.thumbnail}>
                      {image ? (
                        <Image
                          src={image}
                          alt=""
                          width={40}
                          height={40}
                          unoptimized
                        />
                      ) : (
                        <Clock3 size={18} aria-hidden="true" />
                      )}
                    </span>
                    <span className={styles.identityText}>
                      <span className={styles.title}>{item.summary}</span>
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
                        <span className={ADMIN_DOMAIN_TONE.TECHNICAL.soft}>
                          {areaLabel(item.area)}
                        </span>
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
                      {item.processingDetails.length > 0 && (
                        <span
                          className={styles.processing}
                          title={item.processingDetails.join(" · ")}
                        >
                          {item.processingDetails.join(" · ")}
                        </span>
                      )}
                    </span>
                  </button>
                  <button
                    type="button"
                    aria-pressed={urgent}
                    aria-busy={busy}
                    disabled={busy}
                    aria-label={`${urgent ? "Bỏ gấp" : "Đánh dấu gấp"}: ${item.summary}`}
                    title={urgent ? "Bỏ ưu tiên gấp" : "Đánh dấu ưu tiên gấp"}
                    className={`${styles.priority} ${urgent ? styles.urgent : ""}`}
                    onClick={() => onTogglePriority(item)}
                  >
                    {busy ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Zap size={14} />
                    )}
                    <span className={urgent ? "" : "sr-only"}>
                      {urgent ? "Gấp" : "Thường"}
                    </span>
                  </button>
                </div>
                <div role="cell" className={styles.stage}>
                  <span data-stage={item.stage}>
                    {
                      TECHNICAL_LIST_STAGES.find(
                        (stage) => stage.key === item.stage,
                      )?.label
                    }
                  </span>
                </div>
                <div role="cell" className={styles.owner}>
                  <span className={styles.ownerName}>
                    {ownerLabel(item.actionMode, item.vendorName)}
                  </span>
                  <span className={styles.updated}>
                    <AdminUserAvatar
                      user={{
                        name: item.lastUpdatedBy.label,
                        avatarUrl: item.lastUpdatedBy.avatarUrl,
                      }}
                      size="xs"
                    />
                    <span>
                      Cập nhật: {item.lastUpdatedBy.label}
                      <small>{date(item.updatedAt)}</small>
                    </span>
                  </span>
                </div>
                <div role="cell" className={styles.due}>
                  <span className={styles.mobileLabel}>Thời hạn</span>
                  <span
                    className={late && item.stage !== "DONE" ? styles.late : ""}
                  >
                    {item.expectedCompletionAt
                      ? date(item.expectedCompletionAt)
                      : "Chưa hẹn hạn"}
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
                <div role="cell" className={styles.cost}>
                  <span className={styles.mobileLabel}>Chi phí</span>
                  <span>
                    {item.actualCost != null
                      ? money(item.actualCost)
                      : item.estimatedCost != null
                        ? money(item.estimatedCost)
                        : "Chưa có chi phí"}
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
            <button type="button" onClick={() => change({ attention: "ALL" })}>
              Bỏ lọc chú ý
            </button>
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
          <button
            type="button"
            aria-label="Trang TI trước"
            disabled={currentPage <= 1}
            onClick={() => onStateChange({ ...state, page: currentPage - 1 })}
          >
            <ChevronLeft size={15} />
          </button>
          <span>
            {currentPage}/{pages}
          </span>
          <button
            type="button"
            aria-label="Trang TI sau"
            disabled={currentPage >= pages}
            onClick={() => onStateChange({ ...state, page: currentPage + 1 })}
          >
            <ChevronRight size={15} />
          </button>
          {loadTarget && (
            <button
              type="button"
              className={styles.load}
              disabled={!!loadingColumn}
              aria-busy={loadingColumn === `technical:${loadTarget}`}
              onClick={() =>
                onLoadMore(loadTarget, pagination[loadTarget].nextPage!)
              }
            >
              {loadingColumn === `technical:${loadTarget}` ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <ArrowDown size={14} />
              )}
              Tải thêm{" "}
              {TECHNICAL_LIST_STAGES.find(
                (stage) => stage.key === loadTarget,
              )?.label.toLocaleLowerCase("vi")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
