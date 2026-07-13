import Link from "next/link";

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
    <span className={`inline-flex min-h-6 items-center rounded-full border px-2.5 text-xs font-medium ${tone}`}>
      {label}
    </span>
  );
}

function statusDot(label: string, toneValue?: string | null) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-semibold text-slate-800">
      <span className={`h-2 w-2 rounded-full ${dotTone(toneValue ?? label)}`} />
      {label}
    </span>
  );
}

function stat(label: string, value: number) {
  return (
    <div className="min-h-[78px] rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-[11px] font-bold uppercase text-slate-500">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-slate-950">{value}</div>
    </div>
  );
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
      : "All active service work";

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-6 text-slate-950">
      <div className="mx-auto max-w-[1280px] space-y-5">
        <nav className="flex items-center gap-2 text-sm text-slate-500" aria-label="Breadcrumb">
          <span>Space Management</span>
          <span>/</span>
          <strong className="font-semibold text-slate-900">Service Operation Space</strong>
        </nav>

        <header className="grid gap-5 border-b border-slate-200 pb-5 xl:grid-cols-[minmax(420px,1fr)_auto] xl:items-end">
          <div>
            <h1 className="text-[21px] font-semibold leading-tight tracking-normal">
              Service Operation - {scope.label}
            </h1>
            <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-500">
              <span>{scopeText}</span>
              <span>Current technical workload</span>
              <span>Internal + customer service</span>
            </div>
          </div>

          <form className="grid gap-3 sm:grid-cols-[180px_180px_minmax(220px,1fr)_90px]">
            <input name="mode" type="hidden" value={mode} />
            <label className="grid gap-1.5 text-xs font-semibold text-slate-500">
              Range
              <select
                className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm"
                name="range"
                defaultValue={range}
              >
                <option value="ALL_ACTIVE">All active</option>
                <option value="CURRENT_WEEK">Current week</option>
              </select>
            </label>
            <label className="grid gap-1.5 text-xs font-semibold text-slate-500">
              Anchor date
              <input
                className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm"
                name="anchorDate"
                type="date"
                defaultValue={dateInputValue(scope.anchorDate)}
              />
            </label>
            <label className="grid gap-1.5 text-xs font-semibold text-slate-500">
              Search
              <input
                className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm"
                name="q"
                placeholder={activeView.searchPlaceholder}
                defaultValue={q}
              />
            </label>
            <div className="flex items-end">
              <button className="h-10 w-full rounded-md bg-slate-950 px-3 text-sm font-bold text-white" type="submit">
                Apply
              </button>
            </div>
          </form>
        </header>

        <section className="grid gap-3 md:grid-cols-3 xl:grid-cols-6" aria-label="Service Operation counters">
          {activeView.counters.map((counter) => (
            <div key={counter.key}>{stat(counter.label, counters[counter.key])}</div>
          ))}
        </section>

        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <header className="grid gap-4 border-b border-slate-200 p-4 xl:grid-cols-[minmax(360px,1fr)_auto] xl:items-center">
            <div className="flex flex-wrap items-center gap-2">
              <strong className="text-base">Service Operation Workspaces</strong>
              {activeView.chips.map((label) => (
                <span key={label}>{chip(label)}</span>
              ))}
            </div>
            <div className="grid h-10 w-full grid-cols-2 rounded-lg border border-slate-200 bg-slate-50 p-1 xl:w-80">
              {SERVICE_OPERATION_SPACE_VIEW_LIST.map((view) => (
                <Link
                  key={view.mode}
                  aria-pressed={mode === view.mode}
                  className={`grid place-items-center rounded-md text-sm font-bold ${
                    mode === view.mode ? "bg-slate-950 text-white shadow-sm" : "text-slate-500"
                  }`}
                  href={modeHref({
                    mode: view.mode,
                    q,
                    range,
                    anchorDate: anchorDateValue,
                    stage: view.mode === "ti" && selectedStage !== "ALL" ? selectedStage : null,
                  })}
                >
                  {view.label}
                </Link>
              ))}
            </div>
          </header>

          <div className="grid gap-3 border-b border-slate-200 bg-white p-4 xl:grid-cols-[minmax(0,1fr)_auto_auto] xl:items-center">
            <div className="flex flex-wrap items-center gap-2">
              <strong className="text-sm">Flow setup</strong>
              {chip("Blueprint: Service Operation")}
              {chip("Auto-binding: workspace capacity")}
              {chip("Business truth is hydrated into workspace rows")}
            </div>
            <button className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700" type="button">
              Receive previous week
            </button>
            <button className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700" type="button">
              Flow config
            </button>
          </div>

          {mode === "sr" ? (
            <div className="overflow-x-auto">
              <table className="min-w-[1040px] w-full table-fixed border-collapse text-left text-sm">
                <colgroup>
                  <col className="w-[16%]" />
                  <col className="w-[22%]" />
                  <col className="w-[12%]" />
                  <col className="w-[13%]" />
                  <col className="w-[17%]" />
                  <col className="w-[13%]" />
                  <col className="w-[7%]" />
                </colgroup>
                <thead className="bg-slate-50 text-[11px] font-extrabold uppercase text-slate-500">
                  <tr>
                    <th className="border-b border-slate-200 px-4 py-3">SR Workspace</th>
                    <th className="border-b border-slate-200 px-4 py-3">Watch</th>
                    <th className="border-b border-slate-200 px-4 py-3">Creator</th>
                    <th className="border-b border-slate-200 px-4 py-3">Attention</th>
                    <th className="border-b border-slate-200 px-4 py-3">Workspace Items</th>
                    <th className="border-b border-slate-200 px-4 py-3">Commercial</th>
                    <th className="border-b border-slate-200 px-4 py-3">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {srCases.items.map((item) => {
                    const progress = pct(item.technicalProgress.done, item.technicalProgress.total);
                    const srWorkspaceHref = workspaceHref(item.workspaceBinding);
                    return (
                      <tr key={item.id} className="align-top">
                        <td className="border-b border-slate-100 px-4 py-4">
                          <div className="grid gap-1">
                            <strong>{item.refNo ?? item.id}</strong>
                            <span className="text-xs text-slate-500">{item.id}</span>
                            {statusDot(item.status, item.status)}
                            {srWorkspaceHref ? (
                              <Link
                                className="mt-2 inline-flex h-7 w-fit items-center rounded-md border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700"
                                href={srWorkspaceHref}
                              >
                                Open workspace
                              </Link>
                            ) : (
                              <span className="mt-2 inline-flex h-7 w-fit items-center rounded-md border border-amber-200 bg-amber-50 px-2.5 text-xs font-semibold text-amber-700">
                                Pending workspace binding
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="border-b border-slate-100 px-4 py-4">
                          <div className="grid grid-cols-[44px_1fr] items-center gap-3">
                            <div className="relative h-11 w-11 rounded-lg border border-slate-200 bg-slate-100">
                              <div className="absolute inset-[11px_14px] rounded-full border-2 border-slate-500" />
                            </div>
                            <div className="grid gap-1">
                              <strong>{item.watch.title ?? "Untitled watch"}</strong>
                              <span className="text-xs text-slate-500">{item.watch.sku ?? "-"}</span>
                            </div>
                          </div>
                        </td>
                        <td className="border-b border-slate-100 px-4 py-4">
                          <span className="inline-flex items-center gap-2 text-xs font-semibold">
                            <span className="grid h-7 w-7 place-items-center rounded-full bg-slate-950 text-[11px] font-extrabold text-white">
                              {item.creator.name?.slice(0, 1).toUpperCase() ?? "S"}
                            </span>
                            {item.creator.name ?? "System"}
                          </span>
                        </td>
                        <td className="border-b border-slate-100 px-4 py-4">{statusDot(item.attention, item.attention)}</td>
                        <td className="border-b border-slate-100 px-4 py-4">
                          <div className="grid gap-2">
                            <span className="text-xs text-slate-500">
                              {item.technicalProgress.done} done / {item.technicalProgress.inProgress} in progress / {item.technicalProgress.open} open
                            </span>
                            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                              <div className="h-full rounded-full bg-teal-600" style={{ width: `${progress}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="border-b border-slate-100 px-4 py-4">
                          <div className="grid gap-1">
                            <strong>{money(item.commercial.actualTotal || item.commercial.estimatedTotal)} VND</strong>
                            <span className="text-xs text-slate-500">Remaining {money(item.commercial.remaining)}</span>
                          </div>
                        </td>
                        <td className="border-b border-slate-100 px-4 py-4 text-xs text-slate-600">{formatDateTime(item.updatedAt)}</td>
                      </tr>
                    );
                  })}
                  {!srCases.items.length ? (
                    <tr>
                      <td className="px-4 py-10 text-center text-slate-500" colSpan={7}>
                        No SR cases found for this scope.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          ) : (
            <section
              className="grid gap-3 bg-slate-50 p-4"
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
                    <article key={workspace.role} className="min-h-[520px] overflow-hidden rounded-lg border border-slate-200 bg-white">
                      <header className="grid gap-2 border-b border-slate-200 bg-slate-50 px-3 py-3">
                        <div className="flex items-center justify-between gap-2">
                          <strong className="text-sm">{technicalWorkspace?.title ?? `${workspace.label} Workspace`}</strong>
                          <span className="grid min-w-6 place-items-center rounded-full border border-slate-200 px-2 text-xs font-bold text-slate-500">
                            {items.length}
                          </span>
                        </div>
                        <span className="text-xs font-medium text-slate-500">
                          {workspace.description}
                        </span>
                        {technicalWorkspaceHref ? (
                          <Link
                            className="inline-flex h-8 w-fit items-center rounded-md bg-slate-950 px-3 text-xs font-semibold text-white"
                            href={technicalWorkspaceHref}
                          >
                            Open workspace
                          </Link>
                        ) : (
                          <span className="inline-flex h-8 w-fit items-center rounded-md border border-amber-200 bg-amber-50 px-3 text-xs font-semibold text-amber-700">
                            Pending workspace
                          </span>
                        )}
                      </header>
                      <div className="grid gap-3 p-3">
                        {items.map((item) => {
                          const tiWorkspaceHref = workspaceHref(item.workspaceBinding);
                          return (
                            <section
                              key={item.id}
                              className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm"
                            >
                              <div className="mb-2 flex items-start justify-between gap-2">
                                {chip(item.serviceRequest.refNo ?? item.serviceRequestId, "border-blue-100 bg-blue-50 text-blue-700")}
                                {statusDot(item.stage, item.stage)}
                              </div>
                              <div className="grid gap-1">
                                <strong className="text-sm leading-snug">{item.summary}</strong>
                                <span className="text-xs text-slate-500">
                                  {item.serviceRequest.productTitle ?? "Watch"} / {item.serviceRequest.sku ?? "-"}
                                </span>
                              </div>
                              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-500">
                                <span>
                                  Area
                                  <b className="mt-0.5 block text-xs text-slate-900">{item.area ?? "-"}</b>
                                </span>
                                <span>
                                  Owner
                                  <b className="mt-0.5 block text-xs text-slate-900">{item.ownerKind}</b>
                                </span>
                                <span>
                                  Estimate
                                  <b className="mt-0.5 block text-xs text-slate-900">
                                    {item.estimatedCost == null ? "TBD" : money(item.estimatedCost)}
                                  </b>
                                </span>
                                <span>
                                  Priority
                                  <b className="mt-0.5 block text-xs text-slate-900">{item.priority ?? "Normal"}</b>
                                </span>
                              </div>
                              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                                <span className="text-xs text-slate-500">{formatDateTime(item.updatedAt)}</span>
                                <div className="flex flex-wrap items-center justify-end gap-2">
                                  {tiWorkspaceHref ? (
                                    <Link
                                      className="inline-flex h-8 items-center rounded-md bg-slate-950 px-3 text-xs font-semibold text-white"
                                      href={tiWorkspaceHref}
                                    >
                                      Open workspace
                                    </Link>
                                  ) : (
                                    <span className="inline-flex h-8 items-center rounded-md border border-amber-200 bg-amber-50 px-3 text-xs font-semibold text-amber-700">
                                      Pending binding
                                    </span>
                                  )}
                                  <Link
                                    className="inline-flex h-8 items-center rounded-md border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700"
                                    href={tiIssueHref({ item })}
                                  >
                                    View issue
                                  </Link>
                                </div>
                              </div>
                            </section>
                          );
                        })}
                        {!items.length ? (
                          <div className="rounded-lg border border-dashed border-slate-200 p-5 text-center text-sm text-slate-500">
                            No items
                          </div>
                        ) : null}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          )}
        </section>
      </div>
    </main>
  );
}
