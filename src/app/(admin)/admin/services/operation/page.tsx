import Link from "next/link";

import {
  getServiceOperationCounters,
  listServiceOperationSrCases,
  listServiceOperationTiStageItems,
  resolveServiceOperationScope,
  type ServiceOperationRange,
  type ServiceOperationTiListInput,
  type ServiceOperationTiStageItem,
} from "@/domains/service/server/operation";

type SearchParams = Record<string, string | string[] | undefined>;

type PageProps = {
  searchParams?: Promise<SearchParams>;
};

type Mode = "sr" | "ti";

const STAGES: Array<{
  key: NonNullable<ServiceOperationTiListInput["stage"]>;
  label: string;
}> = [
  { key: "INSPECT", label: "Inspect" },
  { key: "READY", label: "Ready" },
  { key: "IN_PROGRESS", label: "In Progress" },
  { key: "DONE", label: "Done" },
];

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function normalizeMode(value: string | undefined): Mode {
  return value === "ti" ? "ti" : "sr";
}

function normalizeRange(value: string | undefined): ServiceOperationRange {
  return value === "CURRENT_WEEK" ? "CURRENT_WEEK" : "ALL_ACTIVE";
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
  mode: Mode;
  q: string;
  range: ServiceOperationRange;
  anchorDate: string;
}) {
  const params = new URLSearchParams();
  params.set("mode", input.mode);
  params.set("range", input.range);
  params.set("anchorDate", input.anchorDate);
  if (input.q) params.set("q", input.q);
  return `?${params.toString()}`;
}

function stageItems(
  items: ServiceOperationTiStageItem[],
  stage: NonNullable<ServiceOperationTiListInput["stage"]>,
) {
  return items.filter((item) => item.stage === stage);
}

export default async function ServiceOperationPage(props: PageProps) {
  const searchParams = (await props.searchParams) ?? {};
  const q = first(searchParams.q)?.trim() ?? "";
  const mode = normalizeMode(first(searchParams.mode));
  const range = normalizeRange(first(searchParams.range));
  const anchorDate = first(searchParams.anchorDate) ?? dateInputValue(new Date());
  const scope = resolveServiceOperationScope({ range, anchorDate });

  const [srCases, tiItems, counters] = await Promise.all([
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
    getServiceOperationCounters({ range, anchorDate }),
  ]);

  const scopeText =
    scope.range === "CURRENT_WEEK" && scope.from && scope.to
      ? `${formatDate(scope.from)} - ${formatDate(new Date(scope.to.getTime() - 1))}`
      : "All active service work";

  const srStats = [
    ["Active SR", counters.activeSr],
    ["Waiting Approval", counters.waitingApproval],
    ["Has Open TI", counters.hasOpenTi],
    ["Completed SR", counters.completedSr],
    ["Waiting Payment", counters.waitingPayment],
    ["Open TI", counters.openTi],
  ] as const;

  const tiStats = [
    ["Open TI", counters.openTi],
    ["Inspect", counters.inspect],
    ["Ready", counters.ready],
    ["In Progress", counters.inProgress],
    ["Done", counters.done],
    ["Waiting Payment", counters.waitingPayment],
  ] as const;

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
                placeholder={mode === "sr" ? "Search SR, watch, customer, TI..." : "Search TI, SR, watch, area..."}
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
          {(mode === "sr" ? srStats : tiStats).map(([label, value]) => (
            <div key={label}>{stat(label, value)}</div>
          ))}
        </section>

        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <header className="grid gap-4 border-b border-slate-200 p-4 xl:grid-cols-[minmax(360px,1fr)_auto] xl:items-center">
            <div className="flex flex-wrap items-center gap-2">
              <strong className="text-base">Service Operation</strong>
              {chip("SR is case aggregate")}
              {chip("TI is flow unit")}
            </div>
            <div className="grid h-10 w-full grid-cols-2 rounded-lg border border-slate-200 bg-slate-50 p-1 xl:w-80">
              <Link
                aria-pressed={mode === "sr"}
                className={`grid place-items-center rounded-md text-sm font-bold ${
                  mode === "sr" ? "bg-slate-950 text-white shadow-sm" : "text-slate-500"
                }`}
                href={modeHref({ mode: "sr", q, range, anchorDate: dateInputValue(scope.anchorDate) })}
              >
                SR Cases
              </Link>
              <Link
                aria-pressed={mode === "ti"}
                className={`grid place-items-center rounded-md text-sm font-bold ${
                  mode === "ti" ? "bg-slate-950 text-white shadow-sm" : "text-slate-500"
                }`}
                href={modeHref({ mode: "ti", q, range, anchorDate: dateInputValue(scope.anchorDate) })}
              >
                Technical Bench
              </Link>
            </div>
          </header>

          <div className="grid gap-3 border-b border-slate-200 bg-white p-4 xl:grid-cols-[minmax(0,1fr)_auto_auto] xl:items-center">
            <div className="flex flex-wrap items-center gap-2">
              <strong className="text-sm">Flow setup</strong>
              {chip("Blueprint: Service Operation")}
              {chip("Auto-binding: Current active service flow")}
              {chip("Receiver: Technical Bench")}
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
                    <th className="border-b border-slate-200 px-4 py-3">Service Request</th>
                    <th className="border-b border-slate-200 px-4 py-3">Watch</th>
                    <th className="border-b border-slate-200 px-4 py-3">Creator</th>
                    <th className="border-b border-slate-200 px-4 py-3">Attention</th>
                    <th className="border-b border-slate-200 px-4 py-3">Technical Progress</th>
                    <th className="border-b border-slate-200 px-4 py-3">Commercial</th>
                    <th className="border-b border-slate-200 px-4 py-3">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {srCases.items.map((item) => {
                    const progress = pct(item.technicalProgress.done, item.technicalProgress.total);
                    return (
                      <tr key={item.id} className="align-top">
                        <td className="border-b border-slate-100 px-4 py-4">
                          <div className="grid gap-1">
                            <strong>{item.refNo ?? item.id}</strong>
                            <span className="text-xs text-slate-500">{item.id}</span>
                            {statusDot(item.status, item.status)}
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
            <section className="grid gap-3 bg-slate-50 p-4 xl:grid-cols-4" aria-label="Technical issue board">
              {STAGES.map((stage) => {
                const items = stageItems(tiItems.items, stage.key);
                return (
                  <article key={stage.key} className="min-h-[520px] overflow-hidden rounded-lg border border-slate-200 bg-white">
                    <header className="flex h-11 items-center justify-between border-b border-slate-200 bg-slate-50 px-3">
                      <strong className="text-sm">{stage.label}</strong>
                      <span className="grid min-w-6 place-items-center rounded-full border border-slate-200 px-2 text-xs font-bold text-slate-500">
                        {items.length}
                      </span>
                    </header>
                    <div className="grid gap-3 p-3">
                      {items.map((item) => (
                        <section key={item.id} className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
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
                            <button className="h-8 rounded-md border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700" type="button">
                              Open
                            </button>
                          </div>
                        </section>
                      ))}
                      {!items.length ? (
                        <div className="rounded-lg border border-dashed border-slate-200 p-5 text-center text-sm text-slate-500">
                          No items
                        </div>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </section>
          )}
        </section>
      </div>
    </main>
  );
}
