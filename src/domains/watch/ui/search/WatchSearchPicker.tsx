"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronRight, ImageIcon, Loader2, Search } from "lucide-react";

import { resolveMediaPreviewSrc } from "@/lib/media-profile";
import { cn } from "@/lib/utils";

export type WatchSearchResult = {
  id: string;
  productId: string;
  sku: string;
  title: string;
  imageUrl?: string | null;
  imageKey?: string | null;
  brandName?: string | null;
  serviceState?: string | null;
};

type CachedSearch = { items: WatchSearchResult[]; total: number; hasMore: boolean };
const searchCache = new Map<string, CachedSearch>();

export default function WatchSearchPicker({
  selectedProductId,
  onSelect,
  placeholder = "Tìm mã Watch, SKU, tên sản phẩm...",
  pageSize = 8,
}: {
  selectedProductId?: string | null;
  onSelect: (watch: WatchSearchResult) => void | Promise<void>;
  placeholder?: string;
  pageSize?: number;
}) {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<WatchSearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);
  const cleanQuery = query.trim();

  useEffect(() => {
    if (cleanQuery.length < 2) {
      setItems([]);
      setTotal(0);
      setHasMore(false);
      setError(null);
      return;
    }

    const cacheKey = `${cleanQuery.toLocaleLowerCase("vi")}:1:${pageSize}`;
    const cached = searchCache.get(cacheKey);
    if (cached) {
      setItems(cached.items);
      setTotal(cached.total);
      setHasMore(cached.hasMore);
      setPage(1);
      return;
    }

    const controller = new AbortController();
    const currentRequestId = ++requestId.current;
    const timeout = window.setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ q: cleanQuery, page: "1", pageSize: String(pageSize), meta: "lite" });
        const response = await fetch(`/api/admin/watches/list?${params.toString()}`, { signal: controller.signal, cache: "no-store" });
        const json = await response.json().catch(() => null);
        if (!response.ok || !json?.ok) throw new Error(json?.error || "Không thể tìm Watch.");
        if (requestId.current !== currentRequestId) return;
        const nextItems = (json.data?.items ?? []) as WatchSearchResult[];
        const nextTotal = Number(json.data?.total ?? nextItems.length);
        const nextHasMore = nextItems.length < nextTotal;
        setItems(nextItems);
        setTotal(nextTotal);
        setHasMore(nextHasMore);
        setPage(1);
        searchCache.set(cacheKey, { items: nextItems, total: nextTotal, hasMore: nextHasMore });
      } catch (searchError) {
        if (!controller.signal.aborted) setError(searchError instanceof Error ? searchError.message : "Không thể tìm Watch.");
      } finally {
        if (!controller.signal.aborted && requestId.current === currentRequestId) setLoading(false);
      }
    }, 300);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [cleanQuery, pageSize]);

  async function loadMore() {
    if (loadingMore || !hasMore) return;
    const nextPage = page + 1;
    setLoadingMore(true);
    setError(null);
    try {
      const params = new URLSearchParams({ q: cleanQuery, page: String(nextPage), pageSize: String(pageSize), meta: "lite" });
      const response = await fetch(`/api/admin/watches/list?${params.toString()}`, { cache: "no-store" });
      const json = await response.json().catch(() => null);
      if (!response.ok || !json?.ok) throw new Error(json?.error || "Không thể tải thêm Watch.");
      const moreItems = (json.data?.items ?? []) as WatchSearchResult[];
      setItems((current) => Array.from(new Map([...current, ...moreItems].map((item) => [item.productId, item])).values()));
      setPage(nextPage);
      setHasMore(nextPage * pageSize < Number(json.data?.total ?? total));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Không thể tải thêm Watch.");
    } finally {
      setLoadingMore(false);
    }
  }

  const resultLabel = useMemo(() => total ? `${total.toLocaleString("vi-VN")} kết quả` : "Kết quả", [total]);

  return (
    <div>
      <label className="flex h-12 items-center gap-3 rounded-xl border border-slate-300 px-4 focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100">
        {loading ? <Loader2 className="h-5 w-5 animate-spin text-violet-500" /> : <Search className="h-5 w-5 text-slate-400" />}
        <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder={placeholder} className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none" />
        {cleanQuery.length >= 2 && !loading ? <span className="shrink-0 text-xs font-semibold text-slate-400">{resultLabel}</span> : null}
      </label>

      <div className="mt-4 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-400">
        <span>{resultLabel}</span>
        {items.length ? <span>Đang hiển thị {items.length}/{total}</span> : null}
      </div>
      {error ? <div className="mt-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div> : null}
      {!loading && cleanQuery.length >= 2 && !items.length && !error ? <div className="mt-2 rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500">Không tìm thấy Watch phù hợp.</div> : null}

      <div className="mt-2 grid gap-2">
        {items.map((item) => <WatchSearchResultRow key={item.productId} item={item} selected={selectedProductId === item.productId} onSelect={onSelect} />)}
      </div>
      {hasMore ? <button type="button" disabled={loadingMore} onClick={() => void loadMore()} className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-60">{loadingMore ? <Loader2 className="h-4 w-4 animate-spin" /> : null}Xem thêm {Math.min(pageSize, Math.max(0, total - items.length))} Watch</button> : null}
    </div>
  );
}

function WatchSearchResultRow({ item, selected, onSelect }: { item: WatchSearchResult; selected: boolean; onSelect: (watch: WatchSearchResult) => void | Promise<void> }) {
  const candidates = useMemo(() => Array.from(new Set([resolveMediaPreviewSrc(item.imageKey), resolveMediaPreviewSrc(item.imageUrl)].filter((value): value is string => Boolean(value)))), [item.imageKey, item.imageUrl]);
  const [candidateIndex, setCandidateIndex] = useState(0);
  const imageSrc = candidates[candidateIndex] ?? null;

  useEffect(() => setCandidateIndex(0), [item.productId]);

  return (
    <button type="button" onClick={() => void onSelect(item)} className={cn("grid w-full grid-cols-[64px_1fr_auto] items-center gap-4 rounded-xl border p-3 text-left transition", selected ? "border-slate-500 bg-slate-50 ring-2 ring-slate-100" : "border-slate-200 hover:border-slate-400 hover:bg-slate-50")}>
      <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-lg bg-slate-100">
        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageSrc} alt="" onError={() => setCandidateIndex((index) => index + 1)} className="h-full w-full object-cover" />
        ) : <ImageIcon className="h-6 w-6 text-slate-400" />}
      </div>
      <div className="min-w-0"><div className="truncate font-bold text-slate-950">{item.title}</div><div className="mt-1 truncate text-sm text-slate-500">{item.sku || item.productId}</div><div className="mt-2 truncate text-xs font-medium text-slate-600">{item.brandName || "Watch"} · {item.serviceState || "Chưa tiếp nhận service"}</div></div>
      <ChevronRight className={cn("h-5 w-5", selected ? "text-slate-800" : "text-slate-400")} />
    </button>
  );
}
