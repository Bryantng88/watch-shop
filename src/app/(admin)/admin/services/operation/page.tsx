import Link from "next/link";
import {
  CalendarDays,
  ChevronRight,
  BookOpen,
  Filter,
  Info,
  LayoutGrid,
  ListChecks,
  Search,
  Settings,
  SlidersHorizontal,
  Wrench,
} from "lucide-react";

import {
  SERVICE_OPERATION_SPACE_VIEW_CONFIGS,
  SERVICE_OPERATION_SPACE_VIEW_LIST,
  SERVICE_OPERATION_TECHNICAL_WORKSPACE_BUCKETS,
  SERVICE_OPERATION_TI_STAGE_FILTERS,
  getServiceOperationCounters,
  listServiceOperationTechnicalWorkspaces,
  listServiceOperationSrCases,
  listServiceOperationTiStageItems,
  normalizeServiceOperationSpaceViewMode,
  resolveServiceOperationScope,
  type ServiceOperationRange,
  type ServiceOperationSpaceViewMode,
  type ServiceOperationTiListInput,
  type ServiceOperationTiStageItem,
} from "@/domains/service/server/operation";
import {
  SpaceViewFooterTip,
  SpaceViewInfoCell,
  SpaceViewInfoGrid,
  SpaceViewPage,
  SpaceViewPanel,
  SpaceViewPanelIntro,
  SpaceViewSectionHeader,
  SpaceViewSummary,
  SpaceViewSummaryCell,
} from "@/domains/shared/ui/space/SpaceViewShell";

type SearchParams = Record<string, string | string[] | undefined>;

type PageProps = {
  searchParams?: Promise<SearchParams>;
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function normalizeRange(value: string | undefined): ServiceOperationRange {
  return value === "CURRENT_WEEK" ? "CURRENT_WEEK" : "ALL_ACTIVE";
}

function normalizeStage(value: string | undefined) {
  const stage = SERVICE_OPERATION_TI_STAGE_FILTERS.find((item) => item.key === value);
  return stage?.key ?? "ALL";
}

function dateInputValue(value: Date) {
  return value.toISOString().slice(0, 10);
}

function formatDate(value: Date | string | null | undefined) {
  if (!value) return "-";
  const date = value instanceof Date ? value : new Date(value);
  if (!Number.isFinite(date.getTime())) return "-";
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatDateTime(value: Date | string | null | undefined) {
  if (!value) return "-";
  const date = value instanceof Date ? value : new Date(value);
  if (!Number.isFinite(date.getTime())) return "-";
  return date.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

function money(value: number | null | undefined) {
  const amount = Number(value ?? 0);
  return new Intl.NumberFormat("vi-VN").format(Number.isFinite(amount) ? amount : 0);
}

function pct(done: number, total: number) {
  if (!total) return 0;
  return Math.max(0, Math.min(100, Math.round((done / total) * 100)));
}

function dotTone(value: string | null | undefined) {
  const status = String(value ?? "").toUpperCase();
  if (status === "DONE" || status === "COMPLETED" || status === "DELIVERED") return "bg-emerald-600";
  if (status === "IN_PROGRESS" || status === "READY" || status === "CONFIRMED") return "bg-blue-600";
  if (status === "COST_APPROVAL" || status === "PAYMENT" || status === "OVERDUE") return "bg-red-600";
  return "bg-amber-500";
}

function chip(label: string, tone = "border-slate-200 bg-slate-50 text-slate-600") {
  return (
    <span className={`inline-flex min-h-6 items-center rounded-full border px-2.5 text-xs font-semibold ${tone}`}>
      {label}
    </span>
  );
}

function statusDot(label: string, toneValue?: string | null) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-semibold text-[#111a3d]">
      <span className={`h-2 w-2 rounded-full ${dotTone(toneValue ?? label)}`} />
      {label}
    </span>
  );
}

function stat(label: string, value: number) {
  return (
    <div className="min-h-[88px] rounded-xl border border-[#e5e9f2] bg-white p-4 shadow-[0_6px_18px_rgba(24,36,76,0.04)]">
      <div className="text-[11px] font-extrabold uppercase tracking-[0.06em] text-[#65718d]">{label}</div>
      <div className="mt-2 text-[26px] font-extrabold leading-none text-[#07113d]">{value}</div>
    </div>
  );
}

function counterLabel(label: string) {
  const labels: Record<string, string> = {
    "Active SR": "SR đang mở",
    "Waiting Approval": "Chờ duyệt",
    "Has Open TI": "Có TI mở",
    "Completed SR": "SR hoàn tất",
    "Waiting Payment": "Chờ thanh toán",
    "Open TI": "TI đang mở",
    Inspect: "Kiểm tra",
    Ready: "Sẵn sàng",
    "In Progress": "Đang xử lý",
    Done: "Hoàn tất",
  };
  return labels[label] ?? label;
}

function modeLabel(mode: ServiceOperationSpaceViewMode) {
  return mode === "sr" ? "Hồ sơ SR" : "Kỹ thuật";
}

function stageLabel(value: string | null | undefined) {
  const labels: Record<string, string> = {
    ALL: "Tất cả",
    INSPECT: "Kiểm tra",
    READY: "Sẵn sàng",
    IN_PROGRESS: "Đang xử lý",
    DONE: "Hoàn tất",
  };
  return labels[String(value ?? "").toUpperCase()] ?? String(value ?? "-");
}

function statusLabel(value: string | null | undefined) {
  const labels: Record<string, string> = {
    ACTIVE: "Đang mở",
    OPEN: "Đang mở",
    READY: "Sẵn sàng",
    IN_PROGRESS: "Đang xử lý",
    DONE: "Hoàn tất",
    COMPLETED: "Hoàn tất",
    DELIVERED: "Đã giao",
    COST_APPROVAL: "Chờ duyệt phí",
    PAYMENT: "Thanh toán",
    OVERDUE: "Quá hạn",
    YES: "Có",
    NO: "Không",
  };
  return labels[String(value ?? "").toUpperCase()] ?? String(value ?? "-");
}

function ownerKindLabel(value: string | null | undefined) {
  const labels: Record<string, string> = {
    INTERNAL: "Nội bộ",
    VENDOR: "Đối tác",
    CUSTOMER: "Khách hàng",
    SYSTEM: "Hệ thống",
  };
  return labels[String(value ?? "").toUpperCase()] ?? String(value ?? "-");
}

function priorityLabel(value: string | null | undefined) {
  const labels: Record<string, string> = {
    LOW: "Thấp",
    NORMAL: "Bình thường",
    MEDIUM: "Trung bình",
    HIGH: "Cao",
    URGENT: "Khẩn cấp",
  };
  return labels[String(value ?? "NORMAL").toUpperCase()] ?? String(value ?? "Bình thường");
}

function workspaceDescription(role: string) {
  const labels: Record<string, string> = {
    INSPECT: "Phân loại, gán phụ trách hoặc đối tác, rồi điều phối vấn đề.",
    PROCESSING: "Luồng xử lý chính: sẵn sàng, đang xử lý, hoàn tất.",
    DONE: "Theo dõi hoàn tất, trả lại khi cần và chuyển bước thanh toán.",
  };
  return labels[role] ?? "Theo dõi việc kỹ thuật theo stage vận hành.";
}

function modeHref(input: {
  mode: ServiceOperationSpaceViewMode;
  q: string;
  range: ServiceOperationRange;
  anchorDate: string;
  stage?: string | null;
}) {
  const params = new URLSearchParams();
  params.set("mode", input.mode);
  params.set("range", input.range);
  params.set("anchorDate", input.anchorDate);
  if (input.q) params.set("q", input.q);
  if (input.stage && input.mode === "ti") params.set("stage", input.stage);
  return `?${params.toString()}`;
}

function workspaceItems(
  items: ServiceOperationTiStageItem[],
  stages: Array<NonNullable<ServiceOperationTiListInput["stage"]>>,
) {
  return items.filter((item) => stages.includes(item.stage));
}

function tiIssueHref(input: {
  item: ServiceOperationTiStageItem;
}) {
  return `/admin/services/issues-board?issueId=${input.item.id}`;
}

function workspaceHref(binding: { taskItemId: string | null } | null | undefined) {
  return binding?.taskItemId ? `/admin/task-items/${binding.taskItemId}` : null;
}

export default async function ServiceOperationPage(props: PageProps) {
  const searchParams = (await props.searchParams) ?? {};
  const q = first(searchParams.q)?.trim() ?? "";
  const mode = normalizeServiceOperationSpaceViewMode(first(searchParams.mode));
  const activeView = SERVICE_OPERATION_SPACE_VIEW_CONFIGS[mode];
  const range = normalizeRange(first(searchParams.range));
  const selectedStage = normalizeStage(first(searchParams.stage));
  const anchorDate = first(searchParams.anchorDate) ?? dateInputValue(new Date());
  const scope = resolveServiceOperationScope({ range, anchorDate });
  const anchorDateValue = dateInputValue(scope.anchorDate);

  const [srCases, tiItems, technicalWorkspaces, counters] = await Promise.all([
    listServiceOperationSrCases({
      q,
      range,
      anchorDate,
      page: 1,
      pageSize: 30,
    }),
    listServiceOperationTiStageItems({
      q,
      range,
      anchorDate,
      stage: "ALL",
      page: 1,
      pageSize: 80,
    }),
    listServiceOperationTechnicalWorkspaces(),
    getServiceOperationCounters({ range, anchorDate }),
  ]);
  const technicalWorkspaceByRole = new Map(
    technicalWorkspaces.map((workspace) => [workspace.role, workspace]),
  );
  const scopeText =
    scope.range === "CURRENT_WEEK" && scope.from && scope.to
      ? `${formatDate(scope.from)} - ${formatDate(new Date(scope.to.getTime() - 1))}`
      : "Tất cả công việc dịch vụ đang mở";
  const scopeLabel = scope.range === "CURRENT_WEEK" ? "Tuần hiện tại" : "Tất cả đang mở";
  const searchPlaceholder =
    mode === "sr" ? "Tìm SR, đồng hồ, khách hàng, TI..." : "Tìm TI, SR, đồng hồ, khu vực...";

  return (
    <SpaceViewPage
      breadcrumbs={
        <nav className="flex items-center gap-2 text-sm text-[#52607c]" aria-label="Breadcrumb">
          <Link className="hover:text-[#5b43f1]" href="/admin/coordination">
            Danh sách Space
          </Link>
          <ChevronRight className="h-4 w-4 text-[#9aa5ba]" aria-hidden="true" />
          <strong className="font-semibold text-[#07113d]">Space kỹ thuật</strong>
        </nav>
      }
      title="Service Operation"
      status={
        <span className="inline-flex min-h-7 items-center rounded-full border border-[#ddd5ff] bg-[#f0edff] px-3 text-xs font-extrabold text-[#5b43f1]">
          {scopeLabel}
        </span>
      }
      meta={
        <>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            {scopeText}
          </span>
          <span>Vận hành sửa chữa, kỹ thuật và dịch vụ khách hàng.</span>
        </>
      }
      actions={
        <>
            <button
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
              type="button"
            >
              <ListChecks className="h-4 w-4" aria-hidden="true" />
              Nhận việc tồn từ tuần trước
            </button>
            <button
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm"
              type="button"
            >
              <Settings className="h-4 w-4" aria-hidden="true" />
              Cấu hình luồng
            </button>
        </>
      }
    >

        <section className="hidden gap-3 md:grid-cols-3 xl:grid-cols-6" aria-label="Chỉ số Service Operation">
          {activeView.counters.map((counter) => (
            <div key={counter.key}>{stat(counterLabel(counter.label), counters[counter.key])}</div>
          ))}
        </section>

        <SpaceViewPanel>
          <SpaceViewPanelIntro>
            <form>
              <input name="mode" type="hidden" value={mode} />
              <SpaceViewSummary columns="lg:grid-cols-[1.05fr_0.85fr_1.15fr_1.7fr_auto]">
              <SpaceViewSummaryCell as="label">
                <span className="font-bold uppercase tracking-wide text-slate-500">Blueprint</span>
                <div className="mt-3 text-base font-semibold text-slate-950">Service Operation</div>
                <div className="mt-3 inline-flex items-center gap-2 text-sm text-slate-500">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-violet-50 text-violet-700 ring-1 ring-violet-100">
                    <Wrench className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  Space kỹ thuật
                </div>
              </SpaceViewSummaryCell>

              <SpaceViewSummaryCell>
                <div className="font-bold uppercase tracking-wide text-slate-500">Workspace đang mở</div>
                <div className="mt-3 text-base font-semibold text-slate-950">
                  {counters.activeSr} SR / {counters.openTi} TI mở
                </div>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-violet-100">
                  <div
                    className="h-full rounded-full bg-violet-600"
                    style={{
                      width: `${Math.min(100, counters.activeSr + counters.openTi ? 68 : 0)}%`,
                    }}
                  />
                </div>
              </SpaceViewSummaryCell>

              <SpaceViewSummaryCell as="label">
                <span className="font-bold uppercase tracking-wide text-slate-500">Phạm vi vận hành</span>
                <select
                  className="mt-3 h-8 w-full rounded-md border-0 bg-transparent px-0 text-base font-semibold text-slate-950 outline-none focus:ring-0"
                  name="range"
                  defaultValue={range}
                >
                  <option value="ALL_ACTIVE">Tất cả đang mở</option>
                  <option value="CURRENT_WEEK">Tuần hiện tại</option>
                </select>
                <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  Đang bật
                </span>
              </SpaceViewSummaryCell>

              <SpaceViewSummaryCell>
                <div className="font-bold uppercase tracking-wide text-slate-500">Bộ lọc</div>
                <div className="mt-3 grid gap-2 xl:grid-cols-[150px_minmax(190px,1fr)]">
                  <input
                    className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-950 shadow-sm outline-none focus:border-violet-300"
                    name="anchorDate"
                    type="date"
                    defaultValue={dateInputValue(scope.anchorDate)}
                  />
                  <input
                    className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-950 shadow-sm outline-none focus:border-violet-300"
                    name="q"
                    placeholder={searchPlaceholder}
                    defaultValue={q}
                  />
                </div>
              </SpaceViewSummaryCell>

              <div className="flex items-start justify-end p-5">
                <button
                  className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md border border-violet-100 bg-violet-50 px-3 text-xs font-semibold text-violet-700"
                  type="submit"
                >
                  <Search className="h-3.5 w-3.5" aria-hidden="true" />
                  Áp dụng
                </button>
              </div>
              </SpaceViewSummary>
            </form>

            <SpaceViewInfoGrid>
              <SpaceViewInfoCell icon={<LayoutGrid className="h-4 w-4" aria-hidden="true" />} label="Chế độ Space">
                <div className="font-extrabold text-[#07113d]">{modeLabel(mode)}</div>
                <div className="mt-2 max-w-md text-sm leading-6 text-[#394765]">
                  {mode === "sr"
                    ? "Một dòng đại diện cho một Workspace hồ sơ dịch vụ."
                    : "Hiển thị các Workspace kỹ thuật theo cụm stage vận hành."}
                </div>
                <div className="mt-3 text-sm font-bold text-[#5b43f1]">Luồng: Service Operation</div>
              </SpaceViewInfoCell>
              <SpaceViewInfoCell icon={<Filter className="h-4 w-4" aria-hidden="true" />} label="Quy tắc hiển thị">
                <div className="space-y-2 text-sm leading-6 text-[#394765]">
                  <div>Dòng: {mode === "sr" ? "Workspace hồ sơ SR" : "Cụm Workspace kỹ thuật"}</div>
                  <div>Đích: Workspace</div>
                  <div>Blueprint: Service Operation</div>
                  <div>Cột: Workspace, Đồng hồ, Phụ trách, Chú ý, Item, Chi phí, Cập nhật</div>
                </div>
              </SpaceViewInfoCell>
              <SpaceViewInfoCell icon={<SlidersHorizontal className="h-4 w-4" aria-hidden="true" />} label="Tự động binding">
                <div className="max-w-xl text-sm leading-6 text-[#394765]">
                  Dữ liệu Service Request và Technical Issue được hydrate thành dòng Workspace theo năng lực vận hành hiện tại.
                </div>
                <div className="mt-3 inline-flex max-w-full rounded-full border border-[#d6ccff] bg-[#f7f3ff] px-3 py-1.5 text-xs font-extrabold text-[#5b43f1]">
                  Ràng buộc: SR, đồng hồ, vấn đề kỹ thuật
                </div>
              </SpaceViewInfoCell>
            </SpaceViewInfoGrid>
          </SpaceViewPanelIntro>

          <SpaceViewSectionHeader
            title="Workspace Service Operation"
            badge={chip(mode === "sr" ? "Item: SR" : "Item: TI", "border-[#d6ccff] bg-white text-[#111a3d]")}
            description={
              mode === "sr"
                ? "Theo dõi hồ sơ dịch vụ đang chạy theo từng Workspace SR."
                : "Theo dõi việc kỹ thuật theo stage và Workspace xử lý."
            }
            actions={
              <div className="grid h-10 min-w-[280px] grid-cols-2 rounded-lg border border-[#d9deea] bg-white p-1">
                {SERVICE_OPERATION_SPACE_VIEW_LIST.map((view) => (
                  <Link
                    key={view.mode}
                    aria-pressed={mode === view.mode}
                    className={`grid place-items-center rounded-md text-sm font-extrabold transition ${
                      mode === view.mode
                        ? "bg-[#07113d] text-white shadow-[0_8px_18px_rgba(24,36,76,0.16)]"
                        : "text-[#53617e]"
                    }`}
                    href={modeHref({
                      mode: view.mode,
                      q,
                      range,
                      anchorDate: anchorDateValue,
                      stage: view.mode === "ti" && selectedStage !== "ALL" ? selectedStage : null,
                    })}
                  >
                    {modeLabel(view.mode)}
                  </Link>
                ))}
              </div>
            }
          />

          {mode === "sr" ? (
            <div className="overflow-x-auto border-y border-[#e5e9f2]">
              <table className="w-full min-w-[1120px] table-fixed border-collapse text-left text-sm">
                <colgroup>
                  <col className="w-[18%]" />
                  <col className="w-[21%]" />
                  <col className="w-[13%]" />
                  <col className="w-[11%]" />
                  <col className="w-[17%]" />
                  <col className="w-[12%]" />
                  <col className="w-[8%]" />
                </colgroup>
                <thead className="bg-[#fbfcfe] text-[11px] font-black uppercase tracking-[0.05em] text-[#5f6c88]">
                  <tr>
                    <th className="border-b border-[#e5e9f2] px-4 py-3">Workspace</th>
                    <th className="border-b border-[#e5e9f2] px-4 py-3">Đồng hồ</th>
                    <th className="border-b border-[#e5e9f2] px-4 py-3 text-center">Phụ trách</th>
                    <th className="border-b border-[#e5e9f2] px-4 py-3 text-center">Cần chú ý</th>
                    <th className="border-b border-[#e5e9f2] px-4 py-3">Tiến độ / Item</th>
                    <th className="border-b border-[#e5e9f2] px-4 py-3 text-center">Chi phí</th>
                    <th className="border-b border-[#e5e9f2] px-4 py-3 text-center">Cập nhật</th>
                  </tr>
                </thead>
                <tbody>
                  {srCases.items.map((item) => {
                    const progress = pct(item.technicalProgress.done, item.technicalProgress.total);
                    const srWorkspaceHref = workspaceHref(item.workspaceBinding);
                    return (
                      <tr key={item.id} className="align-middle transition hover:bg-[#fbfcff]">
                        <td className="border-b border-[#edf0f6] px-4 py-4">
                          <div className="grid gap-1">
                            <strong className="text-[#07113d]">{item.refNo ?? item.id}</strong>
                            <span className="text-xs text-[#6f7a96]">{item.id}</span>
                            {statusDot(statusLabel(item.status), item.status)}
                            {srWorkspaceHref ? (
                              <Link
                                className="mt-2 inline-flex h-7 w-fit items-center rounded-lg border border-[#d9deea] bg-white px-2.5 text-xs font-bold text-[#253153]"
                                href={srWorkspaceHref}
                              >
                                Mở Workspace
                              </Link>
                            ) : (
                              <span className="mt-2 inline-flex h-7 w-fit items-center rounded-lg border border-[#ffe5a5] bg-[#fff6df] px-2.5 text-xs font-bold text-[#c77700]">
                                Chờ binding
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="border-b border-[#edf0f6] px-4 py-4">
                          <div className="grid grid-cols-[44px_1fr] items-center gap-3">
                            <div className="grid h-11 w-11 place-items-center rounded-xl border border-[#dfe7f7] bg-[#eef7ff] text-[#5b43f1]">
                              <Wrench className="h-5 w-5" aria-hidden="true" />
                            </div>
                            <div className="grid gap-1">
                              <strong className="text-[#07113d]">{item.watch.title ?? "Chưa có tên đồng hồ"}</strong>
                              <span className="text-xs text-[#6f7a96]">{item.watch.sku ?? "-"}</span>
                            </div>
                          </div>
                        </td>
                        <td className="border-b border-[#edf0f6] px-4 py-4 text-center">
                          <span className="inline-flex items-center justify-center gap-2 text-xs font-bold">
                            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#07113d] text-[11px] font-extrabold text-white">
                              {item.creator.name?.slice(0, 1).toUpperCase() ?? "S"}
                            </span>
                            {item.creator.name === "System" || !item.creator.name ? "Hệ thống" : item.creator.name}
                          </span>
                        </td>
                        <td className="border-b border-[#edf0f6] px-4 py-4 text-center">{statusDot(statusLabel(item.attention), item.attention)}</td>
                        <td className="border-b border-[#edf0f6] px-4 py-4">
                          <div className="grid gap-2">
                            <div className="flex items-center justify-between gap-2 text-xs font-bold text-[#5b43f1]">
                              <span>
                                {item.technicalProgress.done} / {item.technicalProgress.total}
                              </span>
                              <span>{progress}%</span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-[#eef0f7]">
                              <div className="h-full rounded-full bg-[#5b43f1]" style={{ width: `${progress}%` }} />
                            </div>
                            <span className="text-xs text-[#53617e]">
                              Xong {item.technicalProgress.done} · Đang xử lý {item.technicalProgress.inProgress} · Mở {item.technicalProgress.open}
                            </span>
                          </div>
                        </td>
                        <td className="border-b border-[#edf0f6] px-4 py-4 text-center">
                          <div className="grid gap-1">
                            <strong>{money(item.commercial.actualTotal || item.commercial.estimatedTotal)}</strong>
                            <span className="text-xs text-[#6f7a96]">Còn {money(item.commercial.remaining)}</span>
                          </div>
                        </td>
                        <td className="border-b border-[#edf0f6] px-4 py-4 text-center text-xs text-[#53617e]">{formatDateTime(item.updatedAt)}</td>
                      </tr>
                    );
                  })}
                  {!srCases.items.length ? (
                    <tr>
                      <td className="px-4 py-14 text-center text-[#6f7a96]" colSpan={7}>
                        Chưa có hồ sơ SR nào trong phạm vi này.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          ) : (
            <section
              className="mt-4 grid gap-3 rounded-xl border border-[#e5e9f2] bg-[#fbfcfe] p-4"
              aria-label="Technical workspace index"
            >
              <div className="grid gap-3 xl:grid-cols-3">
                {SERVICE_OPERATION_TECHNICAL_WORKSPACE_BUCKETS.map((workspace) => {
                  const items = workspaceItems(tiItems.items, workspace.stages);
                  const technicalWorkspace = technicalWorkspaceByRole.get(workspace.role);
                  const technicalWorkspaceHref = workspaceHref({
                    taskItemId: technicalWorkspace?.taskItemId ?? null,
                  });
                  return (
                    <article key={workspace.role} className="min-h-[520px] overflow-hidden rounded-xl border border-[#e5e9f2] bg-white shadow-[0_6px_18px_rgba(24,36,76,0.04)]">
                      <header className="grid gap-2 border-b border-[#e5e9f2] bg-[#fbfcfe] px-4 py-4">
                        <div className="flex items-center justify-between gap-2">
                          <strong className="text-sm text-[#07113d]">{technicalWorkspace?.title ?? `${stageLabel(workspace.role)} Workspace`}</strong>
                          <span className="grid min-w-7 place-items-center rounded-full border border-[#d6ccff] bg-[#f0edff] px-2 text-xs font-extrabold text-[#5b43f1]">
                            {items.length}
                          </span>
                        </div>
                        <span className="text-xs font-medium leading-5 text-[#6f7a96]">
                          {workspaceDescription(workspace.role)}
                        </span>
                        {technicalWorkspaceHref ? (
                          <Link
                            className="inline-flex h-8 w-fit items-center rounded-lg bg-[#07113d] px-3 text-xs font-bold text-white"
                            href={technicalWorkspaceHref}
                          >
                            Mở Workspace
                          </Link>
                        ) : (
                          <span className="inline-flex h-8 w-fit items-center rounded-lg border border-[#ffe5a5] bg-[#fff6df] px-3 text-xs font-bold text-[#c77700]">
                            Chờ Workspace
                          </span>
                        )}
                      </header>
                      <div className="grid gap-3 p-3">
                        {items.map((item) => {
                          const tiWorkspaceHref = workspaceHref(item.workspaceBinding);
                          return (
                            <section
                              key={item.id}
                              className="rounded-xl border border-[#e5e9f2] bg-white p-3 shadow-[0_4px_12px_rgba(24,36,76,0.04)]"
                            >
                              <div className="mb-2 flex items-start justify-between gap-2">
                                {chip(item.serviceRequest.refNo ?? item.serviceRequestId, "border-[#d6ccff] bg-[#f0edff] text-[#5b43f1]")}
                                {statusDot(stageLabel(item.stage), item.stage)}
                              </div>
                              <div className="grid gap-1">
                                <strong className="text-sm leading-snug text-[#07113d]">{item.summary}</strong>
                                <span className="text-xs text-[#6f7a96]">
                                  {item.serviceRequest.productTitle ?? "Đồng hồ"} / {item.serviceRequest.sku ?? "-"}
                                </span>
                              </div>
                              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-[#6f7a96]">
                                <span>
                                  Khu vực
                                  <b className="mt-0.5 block text-xs text-[#07113d]">{item.area ?? "-"}</b>
                                </span>
                                <span>
                                  Phụ trách
                                  <b className="mt-0.5 block text-xs text-[#07113d]">{ownerKindLabel(item.ownerKind)}</b>
                                </span>
                                <span>
                                  Ước tính
                                  <b className="mt-0.5 block text-xs text-[#07113d]">
                                    {item.estimatedCost == null ? "Chưa có" : money(item.estimatedCost)}
                                  </b>
                                </span>
                                <span>
                                  Ưu tiên
                                  <b className="mt-0.5 block text-xs text-[#07113d]">{priorityLabel(item.priority)}</b>
                                </span>
                              </div>
                              <div className="mt-3 flex items-center justify-between border-t border-[#edf0f6] pt-3">
                                <span className="text-xs text-[#6f7a96]">{formatDateTime(item.updatedAt)}</span>
                                <div className="flex flex-wrap items-center justify-end gap-2">
                                  {tiWorkspaceHref ? (
                                    <Link
                                      className="inline-flex h-8 items-center rounded-lg bg-[#07113d] px-3 text-xs font-bold text-white"
                                      href={tiWorkspaceHref}
                                    >
                                      Mở Workspace
                                    </Link>
                                  ) : (
                                    <span className="inline-flex h-8 items-center rounded-lg border border-[#ffe5a5] bg-[#fff6df] px-3 text-xs font-bold text-[#c77700]">
                                      Chờ binding
                                    </span>
                                  )}
                                  <Link
                                    className="inline-flex h-8 items-center rounded-lg border border-[#d9deea] bg-white px-3 text-xs font-bold text-[#253153]"
                                    href={tiIssueHref({ item })}
                                  >
                                    Xem TI
                                  </Link>
                                </div>
                              </div>
                            </section>
                          );
                        })}
                        {!items.length ? (
                          <div className="rounded-xl border border-dashed border-[#d9deea] bg-[#fbfcfe] p-5 text-center text-sm text-[#6f7a96]">
                            Chưa có item trong cụm này.
                          </div>
                        ) : null}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          )}

          <SpaceViewFooterTip
            icon={<Info className="h-4 w-4" aria-hidden="true" />}
            action={
              <button
                type="button"
                className="inline-flex h-9 items-center gap-2 rounded-md border border-violet-200 bg-white px-3 text-sm font-semibold text-violet-700"
              >
                <BookOpen className="h-4 w-4" aria-hidden="true" />
                Xem hướng dẫn
              </button>
            }
          >
            Gợi ý: dùng chế độ Hồ sơ SR để xem việc theo case, hoặc Kỹ thuật để gom vấn đề theo stage xử lý.
          </SpaceViewFooterTip>
        </SpaceViewPanel>
    </SpaceViewPage>
  );
}
