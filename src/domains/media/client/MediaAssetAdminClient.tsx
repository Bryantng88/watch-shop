// src/domains/media/client/MediaAssetAdminClient.tsx
"use client";

import * as React from "react";
import {
  AlertTriangle,
  Database,
  Filter,
  ImageIcon,
  RefreshCw,
  Search,
  ServerCrash,
} from "lucide-react";

import { useAppProgress } from "@/domains/shared/feedback/AppProgressProvider";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";

type MediaAssetItem = {
  id: string;
  key: string;
  fileName?: string | null;
  parentPrefix?: string | null;
  profile?: string | null;
  status?: string | null;
  productId?: string | null;
  acquisitionId?: string | null;
  role?: string | null;
  sizeBytes?: number | null;
  isMissing?: boolean | null;
  lastSeenAt?: string | null;
  missingAt?: string | null;
  updatedAt?: string | null;
};

type AssetResponse = {
  items: MediaAssetItem[];
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
};

type MediaDashboard = {
  totalAssets?: number;
  chosenCount?: number;
  assignedCount?: number;
  missingCount?: number;
  stats?: {
    totalAssets?: number;
    chosenCount?: number;
    assignedCount?: number;
    missingCount?: number;
  };
};

function cx(...items: Array<string | false | null | undefined>) {
  return items.filter(Boolean).join(" ");
}

function formatBytes(value?: number | null) {
  const bytes = Number(value ?? 0);
  if (!bytes) return "-";

  const units = ["B", "KB", "MB", "GB", "TB"];
  let next = bytes;
  let unitIndex = 0;

  while (next >= 1024 && unitIndex < units.length - 1) {
    next /= 1024;
    unitIndex += 1;
  }

  return `${next.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function statusClass(status?: string | null) {
  if (status === "ACTIVE") return "border-blue-200 bg-blue-50 text-blue-700";
  if (status === "CHOSEN") return "border-violet-200 bg-violet-50 text-violet-700";
  if (status === "ATTACHED") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (status === "MISSING") return "border-red-200 bg-red-50 text-red-700";
  if (status === "ARCHIVED") return "border-slate-200 bg-slate-100 text-slate-600";

  return "border-slate-200 bg-slate-50 text-slate-700";
}

function normalizeDashboard(input: any): Required<MediaDashboard>["stats"] {
  const source = input?.stats ?? input ?? {};

  return {
    totalAssets: Number(source.totalAssets ?? 0),
    chosenCount: Number(source.chosenCount ?? 0),
    assignedCount: Number(source.assignedCount ?? 0),
    missingCount: Number(source.missingCount ?? 0),
  };
}

function normalizeAssets(input: any, fallbackPage: number): AssetResponse {
  return {
    items: Array.isArray(input?.items) ? input.items : [],
    page: Number(input?.page ?? fallbackPage),
    pageSize: Number(input?.pageSize ?? 48),
    total: Number(input?.total ?? 0),
    pageCount: Math.max(1, Number(input?.pageCount ?? 1)),
  };
}

function buildAssetsUrl(input: {
  page: number;
  status: string;
  q: string;
  prefix: string;
  profile: string;
  missingOnly: boolean;
}) {
  const params = new URLSearchParams();

  params.set("page", String(input.page));
  params.set("pageSize", "48");

  if (input.status !== "ALL") params.set("status", input.status);
  if (input.q.trim()) params.set("q", input.q.trim());
  if (input.prefix.trim()) params.set("prefix", input.prefix.trim());
  if (input.profile.trim()) params.set("profile", input.profile.trim());
  if (input.missingOnly) params.set("missingOnly", "1");

  return `/api/media/assets?${params.toString()}`;
}

function StatCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-slate-100 p-3 text-slate-600">
          {icon}
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {label}
          </div>
          <div className="mt-1 text-2xl font-bold text-slate-950">
            {value}
          </div>
          {hint ? <div className="mt-1 text-xs text-slate-500">{hint}</div> : null}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status?: string | null }) {
  return (
    <span
      className={cx(
        "inline-flex rounded-full border px-2 py-0.5 text-[11px] font-bold",
        statusClass(status)
      )}
    >
      {status || "-"}
    </span>
  );
}

export default function MediaAssetAdminClient() {
  const notify = useNotify();
  const progress = useAppProgress();

  const [dashboard, setDashboard] = React.useState<MediaDashboard | null>(null);
  const [assets, setAssets] = React.useState<AssetResponse>({
    items: [],
    page: 1,
    pageSize: 48,
    total: 0,
    pageCount: 1,
  });

  const [loading, setLoading] = React.useState(true);
  const [status, setStatus] = React.useState("ALL");
  const [q, setQ] = React.useState("");
  const [prefix, setPrefix] = React.useState("");
  const [profile, setProfile] = React.useState("");
  const [missingOnly, setMissingOnly] = React.useState(false);
  const [page, setPage] = React.useState(1);

  const load = React.useCallback(async () => {
    setLoading(true);

    try {
      const [dashboardRes, assetsRes] = await Promise.all([
        fetch("/api/media/assets/dashboard", { cache: "no-store" }),
        fetch(
          buildAssetsUrl({
            page,
            status,
            q,
            prefix,
            profile,
            missingOnly,
          }),
          { cache: "no-store" }
        )
      ]);

      const dashboardJson = await dashboardRes.json().catch(() => ({}));
      const assetsJson = await assetsRes.json().catch(() => ({}));

      if (!dashboardRes.ok) {
        throw new Error(dashboardJson?.error || "Không tải được media dashboard");
      }

      if (!assetsRes.ok) {
        throw new Error(assetsJson?.error || "Không tải được media assets");
      }

      setDashboard({
        stats: normalizeDashboard(dashboardJson),
      });

      setAssets(normalizeAssets(assetsJson, page));
    } catch (error) {
      setDashboard({
        stats: normalizeDashboard({}),
      });

      setAssets((prev) => ({
        ...prev,
        items: [],
        total: 0,
        pageCount: 1,
      }));

      notify.error({
        title: "Không tải được MediaAsset",
        message: error instanceof Error ? error.message : "Vui lòng thử lại.",
      });
    } finally {
      setLoading(false);
    }
  }, [missingOnly, notify, page, prefix, profile, q, status]);

  React.useEffect(() => {
    load();
  }, [load]);

  async function runRebuild(recursive = true) {
    progress.show({
      title: "Đang rebuild MediaAsset index",
      message: "Hệ thống đang quét NAS và cập nhật bảng MediaAsset.",
    });

    try {
      const res = await fetch("/api/media/assets/rebuild-index", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: profile || "edit",
          prefix: prefix || undefined,
          recursive,
          markMissing: true,
        }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(json?.error || "Không thể rebuild index");
      }

      notify.success({
        title: "Đã rebuild index",
        message: `Đã index ${json?.indexed ?? json?.count ?? 0} assets.`,
      });

      await load();
    } catch (error) {
      notify.error({
        title: "Rebuild index thất bại",
        message: error instanceof Error ? error.message : "Vui lòng thử lại.",
      });
    } finally {
      progress.hide();
    }
  }

  async function runOrganizeActive() {
    progress.show({
      title: "Đang organize active folder",
      message: "Hệ thống đang gom ảnh lẻ trong products/edit/active vào batch theo ngày.",
    });

    try {
      const res = await fetch("/api/media/assets/organize-active", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          maxFiles: 500,
          dryRun: false,
        }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(json?.error || "Không thể organize active folder");
      }

      notify.success({
        title: "Đã organize active",
        message: `Đã move ${json?.movedCount ?? 0}/${json?.processed ?? 0} ảnh vào batch.`,
      });

      await load();
    } catch (error) {
      notify.error({
        title: "Organize active thất bại",
        message: error instanceof Error ? error.message : "Vui lòng thử lại.",
      });
    } finally {
      progress.hide();
    }
  }

  async function runMigrateChosen(dryRun = true) {
    progress.show({
      title: dryRun ? "Đang kiểm tra chosen" : "Đang migrate chosen",
      message: dryRun
        ? "Hệ thống đang kiểm tra ảnh chosen flat folder."
        : "Hệ thống đang move chosen vào folder watch/{productId}.",
    });

    try {
      const res = await fetch("/api/media/assets/migrate-chosen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dryRun,
        }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(json?.error || "Không thể migrate chosen");
      }

      notify.success({
        title: dryRun ? "Dry run migrate chosen" : "Đã migrate chosen",
        message: dryRun
          ? `Tìm thấy ${json?.scanned ?? 0} ảnh flat chosen, matched ${json?.matchedProductImages ?? 0}.`
          : `Đã move ${json?.moved ?? 0}/${json?.scanned ?? 0} ảnh chosen.`,
      });

      await load();
    } catch (error) {
      notify.error({
        title: "Migrate chosen thất bại",
        message: error instanceof Error ? error.message : "Vui lòng thử lại.",
      });
    } finally {
      progress.hide();
    }
  }
  async function runReconcile() {
    progress.show({
      title: "Đang kiểm tra NAS",
      message: "Hệ thống đang đối chiếu MediaAsset với file thật trên NAS.",
    });

    try {
      const res = await fetch("/api/media/assets/reconcile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prefix: prefix || undefined,
          profile: profile || undefined,
        }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(json?.error || "Không thể reconcile media assets");
      }

      notify.success({
        title: "Đã kiểm tra NAS",
        message: `Đã kiểm tra ${json.checked ?? json.scanned ?? 0} assets.`,
      });

      await load();
    } catch (error) {
      notify.error({
        title: "Kiểm tra NAS thất bại",
        message: error instanceof Error ? error.message : "Vui lòng thử lại.",
      });
    } finally {
      progress.hide();
    }
  }

  const stats = normalizeDashboard(dashboard);
  const items = assets.items ?? [];

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-500">
                Admin / Media
              </div>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
                Media Asset Center
              </h1>
              <p className="mt-2 max-w-3xl text-sm text-slate-500">
                Quản lý index ảnh trên NAS, trạng thái ACTIVE/CHOSEN/ATTACHED/MISSING và quan hệ ảnh với watch.
              </p>
            </div>

            <div className="flex flex-col items-start gap-2 md:items-end">
              <div className="flex flex-wrap justify-end gap-2">
                <button
                  type="button"
                  onClick={() => runReconcile()}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <ServerCrash className="h-4 w-4" />
                  Check NAS
                </button>

                <button
                  type="button"
                  onClick={() => runOrganizeActive()}
                  className="inline-flex items-center gap-2 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
                >
                  <ImageIcon className="h-4 w-4" />
                  Organize active
                </button>

                <button
                  type="button"
                  onClick={() => runRebuild(true)}
                  className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  <RefreshCw className="h-4 w-4" />
                  Rebuild index
                </button>
              </div>

              <div className="flex flex-wrap justify-end gap-2">
                <button
                  type="button"
                  onClick={() => runMigrateChosen(true)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700 hover:bg-violet-100"
                >
                  <ImageIcon className="h-4 w-4" />
                  Check chosen
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Migrate chosen sẽ move file trên NAS và update ProductImage.fileKey. Bạn chắc chắn muốn chạy?"
                      )
                    ) {
                      runMigrateChosen(false);
                    }
                  }}
                  className="inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100"
                >
                  <ImageIcon className="h-4 w-4" />
                  Migrate chosen
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <StatCard
            icon={<Database className="h-5 w-5" />}
            label="Total assets"
            value={stats.totalAssets ?? 0}
            hint="Tổng asset đã index"
          />
          <StatCard
            icon={<ImageIcon className="h-5 w-5" />}
            label="Chosen"
            value={stats.chosenCount ?? 0}
            hint="Pool ảnh đang chọn"
          />
          <StatCard
            icon={<Database className="h-5 w-5" />}
            label="Assigned"
            value={stats.assignedCount ?? 0}
            hint="Đang gắn product/watch"
          />
          <StatCard
            icon={<AlertTriangle className="h-5 w-5" />}
            label="Missing"
            value={stats.missingCount ?? 0}
            hint="DB có nhưng NAS thiếu"
          />
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-[1fr_150px_150px_220px_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={q}
                onChange={(event) => {
                  setPage(1);
                  setQ(event.target.value);
                }}
                placeholder="Tìm key / filename / productId / acquisitionId..."
                className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-slate-400"
              />
            </div>

            <select
              value={status}
              onChange={(event) => {
                setPage(1);
                setStatus(event.target.value);
              }}
              className="h-11 rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400"
            >
              <option value="ALL">Status: tất cả</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="CHOSEN">CHOSEN</option>
              <option value="ATTACHED">ATTACHED</option>
              <option value="MISSING">MISSING</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>

            <input
              value={profile}
              onChange={(event) => {
                setPage(1);
                setProfile(event.target.value);
              }}
              placeholder="profile"
              className="h-11 rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400"
            />

            <input
              value={prefix}
              onChange={(event) => {
                setPage(1);
                setPrefix(event.target.value);
              }}
              placeholder="prefix"
              className="h-11 rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400"
            />

            <button
              type="button"
              onClick={() => {
                setPage(1);
                setMissingOnly((value) => !value);
              }}
              className={cx(
                "inline-flex h-11 items-center justify-center gap-2 rounded-2xl border px-4 text-sm font-semibold",
                missingOnly
                  ? "border-orange-200 bg-orange-50 text-orange-700"
                  : "border-slate-200 bg-white text-slate-700"
              )}
            >
              <Filter className="h-4 w-4" />
              Missing
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <div className="text-sm font-bold text-slate-950">Media assets</div>
            <div className="text-xs text-slate-500">
              {loading ? "Đang tải..." : `${assets.total} assets · page ${assets.page}/${assets.pageCount}`}
            </div>
          </div>

          {items.length === 0 ? (
            <div className="px-6 py-16 text-center text-sm text-slate-500">
              <ImageIcon className="mx-auto mb-3 h-8 w-8 text-slate-300" />
              Chưa có asset phù hợp bộ lọc.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="grid gap-4 px-5 py-4 text-sm md:grid-cols-[1fr_120px_140px_120px_120px]"
                >
                  <div className="min-w-0">
                    <div className="truncate font-semibold text-slate-950">
                      {item.fileName || item.key}
                    </div>
                    <div className="mt-1 truncate text-xs text-slate-500">
                      {item.key}
                    </div>
                    <div className="mt-1 truncate text-xs text-slate-400">
                      {item.parentPrefix || "-"}
                    </div>
                  </div>

                  <div>
                    <StatusBadge status={item.status} />
                  </div>

                  <div className="text-xs text-slate-600">
                    <div>Role: {item.role || "-"}</div>
                    <div>Profile: {item.profile || "-"}</div>
                  </div>

                  <div className="text-xs text-slate-600">
                    <div>{formatBytes(item.sizeBytes)}</div>
                    <div>{item.isMissing ? "Missing" : "OK"}</div>
                  </div>

                  <div className="text-xs text-slate-600">
                    <div className="truncate">Product: {item.productId || "-"}</div>
                    <div className="truncate">Acq: {item.acquisitionId || "-"}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
            <button
              type="button"
              disabled={assets.page <= 1 || loading}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-40"
            >
              Trước
            </button>

            <div className="text-sm font-semibold text-slate-600">
              {assets.page} / {assets.pageCount}
            </div>

            <button
              type="button"
              disabled={assets.page >= assets.pageCount || loading}
              onClick={() => setPage((value) => Math.min(assets.pageCount, value + 1))}
              className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-40"
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}