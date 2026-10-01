"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, ChevronDown, ChevronUp, ImageIcon, LoaderCircle, Search, X } from "lucide-react";
import {
  createMediaPostAction,
  searchMediaPostThemeWatchesAction,
} from "@/domains/media-post/actions";
import type {
  MediaPostThemeFilters,
  MediaPostThemeWatchCandidate,
} from "../shared/media-post-theme.types";
import { MEDIA_POST_UNCLASSIFIED_FILTER } from "../shared/media-post-theme.types";
import {
  selectMediaPostGalleryImage,
  toggleMediaPostWatchSelection,
} from "../shared/media-post-theme-selection";
import {
  MEDIA_POST_AUDIENCE_OPTIONS,
  MEDIA_POST_CASE_SHAPE_OPTIONS,
  MEDIA_POST_MOVEMENT_OPTIONS,
  MEDIA_POST_SITE_CHANNEL_OPTIONS,
  MEDIA_POST_STOCK_OPTIONS,
  MEDIA_POST_STYLE_OPTIONS,
} from "../shared/media-post-theme.options";

type CreateResult = Awaited<ReturnType<typeof createMediaPostAction>>;

function money(value: string | null) {
  if (!value) return "Chưa có giá";
  const parsed = Number(value);
  return Number.isFinite(parsed)
    ? `${new Intl.NumberFormat("vi-VN").format(parsed)}đ`
    : "Chưa có giá";
}

const inputClass = "h-10 min-w-0 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-50";

function priceInMillions(value?: number | null) {
  return value ? String(value / 1_000_000) : "";
}

export default function MediaPostCreateForm({
  onCreated,
  onCancel,
}: {
  onCreated: (result: CreateResult) => void | Promise<void>;
  onCancel: () => void;
}) {
  const [mode, setMode] = useState<"FREE" | "THEME">("THEME");
  const [brief, setBrief] = useState("");
  const [themeLabel, setThemeLabel] = useState("");
  const [filters, setFilters] = useState<MediaPostThemeFilters>({});
  const [candidates, setCandidates] = useState<MediaPostThemeWatchCandidate[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<Record<string, string>>({});
  const [expandedWatchId, setExpandedWatchId] = useState<string | null>(null);
  const [draggedImage, setDraggedImage] = useState<{ watchId: string; key: string } | null>(null);
  const [dropTargetWatchId, setDropTargetWatchId] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchSuggestion, setSearchSuggestion] = useState<{
    label: string;
    count: number;
    filters: MediaPostThemeFilters;
  } | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedCount = Object.keys(selectedKeys).length;
  const missingClassification = candidates.reduce((counts, watch) => ({
    movementType: counts.movementType + (watch.movementType ? 0 : 1),
    caseShape: counts.caseShape + (watch.caseShape ? 0 : 1),
    style: counts.style + (watch.style ? 0 : 1),
  }), { movementType: 0, caseShape: 0, style: 0 });

  async function searchWatches(nextFilters = filters) {
    if (searching) return;
    setSearching(true);
    setError(null);
    try {
      const result = await searchMediaPostThemeWatchesAction(nextFilters);
      setHasSearched(true);
      setSearchSuggestion(result.suggestion);
      setCandidates(result.items);
      setSelectedKeys((current) => Object.fromEntries(
        Object.entries(current).filter(([watchId, key]) =>
          result.items.some((watch) => watch.watchId === watchId && watch.gallery.some((image) => image.key === key)),
        ),
      ));
    } catch (searchError) {
      setError(searchError instanceof Error ? searchError.message : "Không thể tìm watch.");
    } finally {
      setSearching(false);
    }
  }

  function clearFilters() {
    setFilters({});
    setCandidates([]);
    setSelectedKeys({});
    setSearchSuggestion(null);
    setHasSearched(false);
  }

  function toggleWatch(watch: MediaPostThemeWatchCandidate) {
    setSelectedKeys((current) => toggleMediaPostWatchSelection(current, watch));
  }

  function selectGalleryImage(watchId: string, key: string) {
    setSelectedKeys((current) => selectMediaPostGalleryImage(current, watchId, key));
  }

  async function create() {
    if (creating || (mode === "THEME" && !selectedCount)) return;
    setCreating(true);
    setError(null);
    try {
      const result = await createMediaPostAction({
        brief,
        ...(mode === "THEME"
          ? {
              theme: {
                label: themeLabel.trim() || "Bài viết theo chủ đề",
                filters,
              },
              watchSelections: candidates
                .filter((watch) => selectedKeys[watch.watchId])
                .map((watch) => ({
                  watchId: watch.watchId,
                  sourceGalleryKey: selectedKeys[watch.watchId],
                })),
            }
          : {}),
      });
      await onCreated(result);
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Không thể tạo Media Post.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/45 p-3 backdrop-blur-[2px] sm:p-6">
      <div className="flex max-h-[94vh] w-full max-w-[1500px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-4">
        <div>
          <h2 className="text-lg font-bold text-slate-950">Tạo Media Post</h2>
          <p className="mt-0.5 text-xs text-slate-500">Chọn chủ đề, lọc watch và chốt một ảnh Gallery cho từng watch.</p>
        </div>
        <div className="flex items-center gap-3">
        <div className="inline-flex rounded-xl border border-violet-100 bg-violet-50 p-1">
          {(["THEME", "FREE"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setMode(value)}
              className={`h-9 rounded-lg px-4 text-sm font-semibold transition ${mode === value ? "bg-white text-violet-700 shadow-sm" : "text-slate-500"}`}
            >
              {value === "THEME" ? "Theo chủ đề" : "Bài tự do"}
            </button>
          ))}
        </div>
        <button type="button" onClick={onCancel} className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50">
          <X className="h-4 w-4" />
        </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5">
      {mode === "THEME" ? (
        <>
          <div className="rounded-2xl border border-violet-100 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between gap-3"><span className="text-sm font-bold text-slate-900">Điều kiện chủ đề</span><button type="button" onClick={clearFilters} className="text-xs font-semibold text-slate-500 hover:text-violet-700">Xóa bộ lọc</button></div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <label className="space-y-1.5 md:col-span-2"><span className="text-xs font-semibold text-slate-600">Tên chủ đề</span><input className={`${inputClass} w-full`} value={themeLabel} onChange={(event) => setThemeLabel(event.target.value)} placeholder="Ví dụ: Seiko automatic dưới 10 triệu" /></label>
            <label className="space-y-1.5 md:col-span-2"><span className="text-xs font-semibold text-slate-600">Từ khóa / hãng / tên / SKU / model / reference</span><input className={`${inputClass} w-full`} value={filters.query ?? ""} onChange={(event) => setFilters((current) => ({ ...current, query: event.target.value }))} placeholder="Ví dụ: Seiko" /></label>
            <label className="space-y-1.5"><span className="text-xs font-semibold text-slate-600">Giá từ (triệu đồng)</span><input className={`${inputClass} w-full`} type="number" min="0" step="0.5" value={priceInMillions(filters.priceMin)} onChange={(event) => setFilters((current) => ({ ...current, priceMin: event.target.value ? Number(event.target.value) * 1_000_000 : null }))} placeholder="5" /></label>
            <label className="space-y-1.5"><span className="text-xs font-semibold text-slate-600">Giá đến (triệu đồng)</span><input className={`${inputClass} w-full`} type="number" min="0" step="0.5" value={priceInMillions(filters.priceMax)} onChange={(event) => setFilters((current) => ({ ...current, priceMax: event.target.value ? Number(event.target.value) * 1_000_000 : null }))} placeholder="10" /></label>
            <label className="space-y-1.5"><span className="text-xs font-semibold text-slate-600">Bộ máy</span><select className={`${inputClass} w-full`} value={filters.movementType ?? ""} onChange={(event) => setFilters((current) => ({ ...current, movementType: event.target.value }))}>
              <option value="">Tất cả bộ máy</option>
              <option value={MEDIA_POST_UNCLASSIFIED_FILTER}>Chưa phân loại</option>
              {MEDIA_POST_MOVEMENT_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select></label>
            <label className="space-y-1.5"><span className="text-xs font-semibold text-slate-600">Form vỏ</span><select className={`${inputClass} w-full`} value={filters.caseShape ?? ""} onChange={(event) => setFilters((current) => ({ ...current, caseShape: event.target.value }))}>
              <option value="">Tất cả form</option>
              <option value={MEDIA_POST_UNCLASSIFIED_FILTER}>Chưa phân loại</option>
              {MEDIA_POST_CASE_SHAPE_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select></label>
            <label className="space-y-1.5"><span className="text-xs font-semibold text-slate-600">Phong cách</span><select className={`${inputClass} w-full`} value={filters.style ?? ""} onChange={(event) => setFilters((current) => ({ ...current, style: event.target.value }))}><option value="">Tất cả phong cách</option><option value={MEDIA_POST_UNCLASSIFIED_FILTER}>Chưa phân loại</option>{MEDIA_POST_STYLE_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
            <label className="space-y-1.5"><span className="text-xs font-semibold text-slate-600">Tình trạng kho</span><select className={`${inputClass} w-full`} value={filters.stockStage ?? ""} onChange={(event) => setFilters((current) => ({ ...current, stockStage: event.target.value }))}><option value="">Tất cả trạng thái</option>{MEDIA_POST_STOCK_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
            <label className="space-y-1.5"><span className="text-xs font-semibold text-slate-600">Phân khúc</span><select className={`${inputClass} w-full`} value={filters.audienceSegment ?? ""} onChange={(event) => setFilters((current) => ({ ...current, audienceSegment: event.target.value }))}><option value="">Tất cả phân khúc</option>{MEDIA_POST_AUDIENCE_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
            <label className="space-y-1.5"><span className="text-xs font-semibold text-slate-600">Kênh sản phẩm</span><select className={`${inputClass} w-full`} value={filters.siteChannel ?? ""} onChange={(event) => setFilters((current) => ({ ...current, siteChannel: event.target.value }))}><option value="">Tất cả kênh</option>{MEDIA_POST_SITE_CHANNEL_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
            <label className="flex h-10 items-center gap-2 self-end rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700"><input type="checkbox" checked={filters.publishedOnly === true} onChange={(event) => setFilters((current) => ({ ...current, publishedOnly: event.target.checked }))} className="h-4 w-4 accent-violet-600" />Chỉ watch đang storefront</label>
            <label className="space-y-1.5 md:col-span-2"><span className="text-xs font-semibold text-slate-600">Brief / yêu cầu giọng văn</span><input className={`${inputClass} w-full`} value={brief} onChange={(event) => setBrief(event.target.value)} placeholder="Không bắt buộc" /></label>
            <button type="button" onClick={() => void searchWatches()} disabled={searching} className="inline-flex h-10 items-center justify-center gap-2 self-end rounded-xl bg-violet-600 px-4 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50">
              {searching ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              Tìm watch
            </button>
            </div>
          </div>

          {candidates.length ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-800">Tìm thấy {candidates.length} watch</span>
                <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">Đã chọn {selectedCount}</span>
              </div>
              {missingClassification.movementType || missingClassification.caseShape || missingClassification.style ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
                  Trong kết quả hiện tại: thiếu Bộ máy {missingClassification.movementType}, Form vỏ {missingClassification.caseShape}, Phong cách {missingClassification.style}. Có thể chọn “Chưa phân loại” để làm sạch dữ liệu.
                </div>
              ) : null}
              <div className="grid max-h-[520px] gap-3 overflow-y-auto pr-1 lg:grid-cols-2">
                {candidates.map((watch) => {
                  const selectedKey = selectedKeys[watch.watchId];
                  const selectedImage = watch.gallery.find((image) => image.key === selectedKey) ?? watch.gallery[0];
                  const selected = Boolean(selectedKey);
                  const expanded = expandedWatchId === watch.watchId;
                  return (
                    <div key={watch.watchId} className={`rounded-2xl border bg-white p-3 transition ${selected ? "border-violet-300 ring-2 ring-violet-50" : "border-slate-200"}`}>
                      <div className="flex gap-3">
                        <button type="button" onClick={() => toggleWatch(watch)} className={`mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-md border ${selected ? "border-violet-600 bg-violet-600 text-white" : "border-slate-300 bg-white"}`}>
                          {selected ? <Check className="h-3.5 w-3.5" /> : null}
                        </button>
                        <div
                          onDragOver={(event) => {
                            if (draggedImage?.watchId !== watch.watchId) return;
                            event.preventDefault();
                            setDropTargetWatchId(watch.watchId);
                          }}
                          onDragLeave={() => setDropTargetWatchId((current) => current === watch.watchId ? null : current)}
                          onDrop={(event) => {
                            event.preventDefault();
                            if (draggedImage?.watchId === watch.watchId) {
                              selectGalleryImage(watch.watchId, draggedImage.key);
                            }
                            setDraggedImage(null);
                            setDropTargetWatchId(null);
                          }}
                          className={`relative h-24 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-slate-50 transition ${dropTargetWatchId === watch.watchId ? "border-violet-500 ring-4 ring-violet-100" : "border-slate-200"}`}
                        >
                          {selectedImage ? <Image src={selectedImage.url} alt="" width={80} height={96} unoptimized className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center"><ImageIcon className="h-5 w-5 text-slate-300" /></div>}
                          {dropTargetWatchId === watch.watchId ? <div className="absolute inset-0 grid place-items-center bg-violet-700/70 px-2 text-center text-[10px] font-bold text-white">Thả để chọn</div> : null}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-bold text-slate-900">{watch.title}</div>
                          <div className="mt-1 text-xs text-slate-500">{watch.sku || watch.productId}</div>
                          <div className="mt-2 flex flex-wrap gap-1.5 text-[11px] font-medium text-slate-600">
                            {watch.brandName ? <span className="rounded-md bg-slate-100 px-2 py-1">{watch.brandName}</span> : null}
                            {watch.movementType ? <span className="rounded-md bg-slate-100 px-2 py-1">{watch.movementType}</span> : null}
                            <span className="rounded-md bg-emerald-50 px-2 py-1 text-emerald-700">{money(watch.price)}</span>
                          </div>
                          <button type="button" onClick={() => setExpandedWatchId(expanded ? null : watch.watchId)} className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-violet-700">
                            Ảnh Gallery {selectedImage ? watch.gallery.findIndex((image) => image.key === selectedImage.key) + 1 : 0}/{watch.gallery.length}
                            {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                      </div>
                      {expanded ? (
                        <div className="mt-3 border-t border-slate-100 pt-3">
                          <div className="mb-2 text-[11px] font-medium text-slate-500">Bấm ảnh hoặc kéo ảnh vào ô đại diện phía trên. Lựa chọn này chưa được lưu.</div>
                          <div className="flex gap-2 overflow-x-auto">
                          {watch.gallery.map((image, index) => (
                            <button
                              key={image.key}
                              type="button"
                              draggable
                              onDragStart={(event) => {
                                event.dataTransfer.effectAllowed = "copy";
                                setDraggedImage({ watchId: watch.watchId, key: image.key });
                              }}
                              onDragEnd={() => {
                                setDraggedImage(null);
                                setDropTargetWatchId(null);
                              }}
                              onClick={() => selectGalleryImage(watch.watchId, image.key)}
                              className={`relative h-24 w-20 shrink-0 cursor-grab overflow-hidden rounded-xl border-2 bg-slate-50 active:cursor-grabbing ${selectedKey === image.key ? "border-violet-500" : "border-transparent"}`}
                              title={`Dùng ảnh Gallery ${index + 1}`}
                            >
                              <Image src={image.url} alt="" width={80} height={96} unoptimized className="h-full w-full object-cover" />
                              <span className="absolute bottom-1 right-1 rounded bg-slate-950/70 px-1.5 py-0.5 text-[10px] font-bold text-white">{index + 1}</span>
                            </button>
                          ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : !searching ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center text-sm text-slate-500">{hasSearched ? <>{searchSuggestion ? <><div>Không có watch thỏa tất cả điều kiện. Điều kiện <strong>{searchSuggestion.label}</strong> đang làm kết quả về 0.</div><button type="button" onClick={() => { setFilters(searchSuggestion.filters); void searchWatches(searchSuggestion.filters); }} className="mt-4 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700">Bỏ {searchSuggestion.label} và xem {searchSuggestion.count} watch</button></> : <>Không tìm thấy watch phù hợp. Hãy nới lỏng một vài điều kiện rồi tìm lại.</>}</> : <>Nhập điều kiện rồi bấm <strong>Tìm watch</strong>. Giá được tính theo triệu đồng.</>}</div> : null}
        </>
      ) : (
        <input className={`${inputClass} w-full`} value={brief} onChange={(event) => setBrief(event.target.value)} placeholder="Brief / yêu cầu nội dung (không bắt buộc)" />
      )}

      {error ? <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">{error}</div> : null}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 bg-white px-5 py-4">
        <span className="text-sm font-semibold text-slate-600">{mode === "THEME" ? `${selectedCount} watch đã chọn` : "Bài post tự do"}</span>
        <div className="flex gap-2">
        <button type="button" onClick={onCancel} className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600">Hủy</button>
        <button type="button" onClick={() => void create()} disabled={creating || (mode === "THEME" && !selectedCount)} className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-45">
          {creating ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
          {creating ? "Đang tạo và sao chép ảnh..." : mode === "THEME" ? `Tạo bài với ${selectedCount} watch` : "Tạo ngay"}
        </button>
        </div>
      </div>
      </div>
    </div>
  );
}
