import { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Grid2X2, List, Search } from "lucide-react";
import TechnicalIssueListView from "../../src/domains/coordination/ui/TechnicalIssueListView";
import { SpaceViewSwitch } from "../../src/domains/shared/ui/space/SpaceFilterBar";
import {
  AdminPageCanvas,
  AdminPageHeader,
} from "../../src/domains/shared/ui/admin-design-contract";
import {
  DEFAULT_TI_LIST_STATE,
  TECHNICAL_LIST_STAGES,
  technicalIssueMatches,
  technicalIssueLayoutUrl,
  type TechnicalIssueListState,
} from "../../src/domains/coordination/shared/technical-issue-list";
import type {
  CoordinationTechnicalIssueBoardItemDTO as Item,
  CoordinationBoardColumnPaginationDTO,
} from "../../src/domains/coordination/server/coordination-dashboard.types";
const titles = [
  "Kiểm tra máy",
  "Thay kính bị xước",
  "Vệ sinh vỏ và dây",
  "Căn chỉnh sai số",
  "Tìm mắt dây phù hợp",
  "Lau dầu bộ máy",
];
const watches = [
  "Seiko LM Special",
  "Citizen Exceed mặt champagne",
  "Rado Tank mặt đá",
  "Omega Seamaster quartz",
  "Seiko Dolce mặt trắng",
  "Tissot Seastar vintage",
];
function fixture(stage: Item["stage"], i: number): Item {
  return {
    id: `${stage.toLowerCase()}-${i}`,
    serviceRequestId: `sr-${stage}-${i}`,
    summary: titles[i % titles.length],
    note: null,
    area: i % 3 === 0 ? "CASE" : "MOVEMENT",
    actionMode: i % 3 === 0 ? "VENDOR" : "INTERNAL",
    vendorId: null,
    vendorName: i % 3 === 0 ? "Quang Long" : null,
    estimatedCost: i % 5 === 0 ? null : 150000 + (i % 8) * 50000,
    actualCost: stage === "DONE" ? 0 : null,
    expectedWorkingDays: 3,
    expectedCompletionAt:
      i % 7 === 0
        ? null
        : i % 3 === 0
          ? "2026-11-08T10:00:00+07:00"
          : "2026-11-13T10:00:00+07:00",
    completedAt: stage === "DONE" ? "2026-11-09T09:00:00+07:00" : null,
    overdueDays: i % 3 === 0 ? 2 : null,
    executionStatus:
      stage === "DONE"
        ? "DONE"
        : stage === "PROCESSING"
          ? "IN_PROGRESS"
          : "OPEN",
    isConfirmed: stage !== "INSPECT",
    priority: i % 8 === 0 ? "URGENT" : "NORMAL",
    technicalDetailCatalogId: null,
    processingDetails: i % 4 === 0 ? ["Kiểm tra vận hành"] : [],
    commentCount: i % 5,
    mentionedMeCount: i % 6 === 0 ? 1 : 0,
    unreadMentionCount: i % 6 === 0 ? 1 : 0,
    stage,
    updatedAt: `2026-11-10T0${i % 9}:00:00+07:00`,
    lastUpdatedBy: {
      label: ["An", "Đạt", "Long"][i % 3],
      avatarUrl: null,
      isSystem: false,
    },
    workspaceTaskItemId: `work-${stage}-${i}`,
    srCaseTaskItemId: null,
    requestOrigin: i % 9 === 0 ? "CUSTOMER_ORDER" : "OTHER",
    serviceRequest: {
      refNo: `SR-${String(i + 1).padStart(6, "0")}`,
      productTitle: watches[i % watches.length],
      sku: `VN-${i}`,
      imageUrl: null,
    },
  };
}
const initial = TECHNICAL_LIST_STAGES.flatMap((stage) =>
  Array.from({ length: stage.key === "DONE" ? 8 : 20 }, (_, i) =>
    fixture(stage.key, i),
  ),
);
function App() {
  const [items, setItems] = useState(initial),
    [layout, setLayout] = useState<"board" | "list">("list"),
    [state, setState] = useState<TechnicalIssueListState>(
      DEFAULT_TI_LIST_STATE,
    ),
    [query, setQuery] = useState(""),
    [focus, setFocus] = useState<string | null>(null),
    [pendingIds, setPendingIds] = useState(new Set<string>()),
    [loading, setLoading] = useState<string | null>(null),
    [preview, setPreview] = useState<Item | null>(null),
    [move, setMove] = useState<{ id: string; stage: Item["stage"] } | null>(
      null,
    ),
    [doneRange, setDoneRange] = useState<"14D" | "30D" | "ALL">("14D"),
    [calls, setCalls] = useState<unknown[]>([]);
  const memory = useRef("");
  const [pagination, setPagination] =
    useState<CoordinationBoardColumnPaginationDTO>({
      INSPECT: { loaded: 20, total: 45, hasMore: true, nextPage: 3 },
      READY: { loaded: 20, total: 37, hasMore: true, nextPage: 3 },
      PROCESSING: { loaded: 20, total: 32, hasMore: true, nextPage: 3 },
      DONE: { loaded: 8, total: 18, hasMore: true, nextPage: 2 },
    });
  (window as unknown as { __tiQA: unknown }).__tiQA = {
    focus: setFocus,
    getState: () => state,
    getCalls: () => calls,
  };
  const visible = items.filter((item) => technicalIssueMatches(item, query));
  function record(call: unknown) {
    setCalls((values) => [...values, call]);
  }
  function options(item: Item) {
    return item.stage === "INSPECT"
      ? [{ stage: "READY" as const, label: "Phân loại" }]
      : item.stage === "READY"
        ? [
            { stage: "INSPECT" as const, label: "Kiểm tra lại" },
            { stage: "PROCESSING" as const, label: "Bắt đầu" },
          ]
        : item.stage === "PROCESSING"
          ? [
              { stage: "READY" as const, label: "Tạm dừng" },
              { stage: "DONE" as const, label: "Hoàn tất" },
            ]
          : [{ stage: "READY" as const, label: "Mở lại" }];
  }
  return (
    <AdminPageCanvas className="fixture-canvas">
      <AdminPageHeader
        eyebrow="VẬN HÀNH / KỸ THUẬT"
        title="Xử lý kỹ thuật"
        description="Theo dõi công việc, thời hạn và tiến độ xử lý."
        meta={<span className="fixture-label">Dữ liệu minh họa</span>}
      />
      <div className="fixture-controls">
        <div className="fixture-search">
          <Search size={16} />
          <input
            aria-label="Tìm TI"
            placeholder="Tìm TI, đồng hồ hoặc mã phiếu…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <SpaceViewSwitch
          activeView={layout}
          options={[
            { value: "board", label: "Board", icon: <Grid2X2 size={15} /> },
            { value: "list", label: "List", icon: <List size={15} /> },
          ]}
          onChange={(value) => {
            setLayout(value as typeof layout);
            history.replaceState(
              null,
              "",
              technicalIssueLayoutUrl(location.href, value as typeof layout),
            );
          }}
        />
      </div>
      {layout === "list" ? (
        <TechnicalIssueListView
          items={visible}
          state={state}
          onStateChange={setState}
          focusMemory={memory}
          query={query}
          pagination={pagination}
          loadingColumn={loading}
          focusedIssueId={focus}
          pending={false}
          priorityPendingIssueId={null}
          isPriorityPendingFor={(id) => pendingIds.has(id)}
          doneRange={doneRange}
          onDoneRangeChange={(value) => {
            record({ type: "range", value });
            setDoneRange(value);
          }}
          onLoadMore={(stage, page) => {
            record({ type: "load", stage, page });
            setLoading(`technical:${stage}`);
            setTimeout(() => {
              const before = pagination[stage].loaded,
                count = Math.min(10, pagination[stage].total - before);
              setItems((rows) => [
                ...rows,
                ...Array.from({ length: count }, (_, i) =>
                  fixture(stage, before + i),
                ),
              ]);
              setPagination((current) => ({
                ...current,
                [stage]: {
                  ...current[stage],
                  loaded: before + count,
                  hasMore: before + count < current[stage].total,
                  nextPage:
                    before + count < current[stage].total ? page + 1 : null,
                },
              }));
              setLoading(null);
            }, 200);
          }}
          onPreview={(item) => {
            record({ type: "preview", id: item.id });
            setPreview(item);
          }}
          onMove={(id, stage) => {
            record({ type: "move", id, stage });
            setMove({ id, stage });
          }}
          onTogglePriority={(item) => {
            record({ type: "priority", id: item.id });
            setPendingIds((current) => new Set([...current, item.id]));
            setTimeout(() => {
              setItems((current) =>
                current.map((row) =>
                  row.id === item.id
                    ? {
                        ...row,
                        priority:
                          row.priority === "URGENT" ? "NORMAL" : "URGENT",
                      }
                    : row,
                ),
              );
              setPendingIds((current) => {
                const next = new Set(current);
                next.delete(item.id);
                return next;
              });
            }, 250);
          }}
          moveOptions={options}
          areaLabel={(area) => (area === "CASE" ? "Vỏ" : "Máy")}
          ownerLabel={(mode, vendor) =>
            mode === "VENDOR" ? `Vendor · ${vendor}` : "Nội bộ"
          }
        />
      ) : (
        <div className="fixture-board" aria-label="Board minh họa">
          {TECHNICAL_LIST_STAGES.map((stage) => (
            <section key={stage.key}>
              <h2>{stage.label}</h2>
              {visible
                .filter((item) => item.stage === stage.key)
                .slice(0, 4)
                .map((item) => (
                  <button key={item.id} onClick={() => setPreview(item)}>
                    {item.summary}
                    <small>{item.serviceRequest.productTitle}</small>
                  </button>
                ))}
            </section>
          ))}
        </div>
      )}
      {preview && (
        <div className="fixture-overlay">
          <section role="dialog" aria-label="Xem nhanh TI">
            <h2>{preview.summary}</h2>
            <p>{preview.serviceRequest.productTitle}</p>
            <p>{preview.serviceRequest.refNo}</p>
            <button onClick={() => setPreview(null)}>Đóng xem nhanh</button>
          </section>
        </div>
      )}
      {move && (
        <div className="fixture-overlay">
          <section role="dialog" aria-label="Đề nghị chuyển TI">
            <h2>Chuyển trạng thái</h2>
            <p>
              {move.id} → {move.stage}
            </p>
            <p>Fixture: luồng thật dùng bản duyệt nghiệp vụ hiện có.</p>
            <button onClick={() => setMove(null)}>Hủy</button>
            <button
              onClick={() => {
                setItems((rows) =>
                  rows.map((item) =>
                    item.id === move.id ? { ...item, stage: move.stage } : item,
                  ),
                );
                setFocus(null);
                setMove(null);
              }}
            >
              Xác nhận fixture
            </button>
          </section>
        </div>
      )}
    </AdminPageCanvas>
  );
}
createRoot(document.getElementById("root")!).render(<App />);
