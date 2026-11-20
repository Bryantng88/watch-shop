"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { RefreshCw, Check, ImageOff } from "lucide-react";
import { AdminButton } from "@/domains/shared/ui/admin-design-contract/AdminButton";
import { AdminListFooter } from "@/domains/shared/ui/admin-design-contract/AdminListFooter";
import { WEBSITE_IMAGE_FOLDERS, type WebsiteFolder, type WebsiteImage, type WebsiteImagePage } from "./website-media";
import s from "./WebsiteImagePicker.module.css";
function Thumbnail({ item }: { item: WebsiteImage }) {
  const [failed, setFailed] = useState(false);
  return failed ? <ImageOff size={20} aria-label="Không tải được ảnh" /> : <Image unoptimized src={item.url} alt="" width={180} height={120} onError={() => setFailed(true)} />;
}
/** Inline selection surface: choosing an image never saves or publishes content. */
export function WebsiteImagePicker({ initialFolder, selectedKey, disabled, refreshVersion, onChoose }: {
  initialFolder: WebsiteFolder; selectedKey: string; disabled: boolean; refreshVersion: number; onChoose: (item: WebsiteImage) => void;
}) {
  const [folder, setFolder] = useState(initialFolder);
  const [items, setItems] = useState<WebsiteImage[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [reload, setReload] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const generation = useRef(0);
  useEffect(() => { setCursor(null); }, [refreshVersion]);
  useEffect(() => {
    const controller = new AbortController(), request = ++generation.current;
    setLoading(true); setError("");
    const params = new URLSearchParams({ folder }); if (cursor) params.set("cursor", cursor);
    void fetch(`/api/admin/storefront/media/library?${params}`, { cache: "no-store", signal: controller.signal }).then(async response => {
      const data = await response.json() as WebsiteImagePage & { error?: string };
      if (!response.ok || !Array.isArray(data.items)) throw new Error(data.error || "Không tải được ảnh. Vui lòng thử lại.");
      if (controller.signal.aborted || request !== generation.current) return;
      setItems(current => cursor ? [...current, ...data.items.filter(item => !current.some(old => old.key === item.key))] : data.items);
      setNextCursor(data.nextCursor);
    }).catch(reason => { if (!controller.signal.aborted && request === generation.current) setError(reason instanceof Error ? reason.message : "Không tải được ảnh."); })
      .finally(() => { if (!controller.signal.aborted && request === generation.current) setLoading(false); });
    return () => controller.abort();
  }, [folder, cursor, reload, refreshVersion]);
  return <div className={s.browser}>
    <div className={s.toolbar}>
      <select aria-label="Thư mục chọn ảnh" value={folder} disabled={disabled} onChange={event => { setFolder(event.target.value as WebsiteFolder); setCursor(null); setItems([]); setNextCursor(null); }}>
        {WEBSITE_IMAGE_FOLDERS.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}
      </select>
      <AdminButton type="button" variant="quiet" iconOnly density="compact" aria-label="Làm mới ảnh trong thư mục" disabled={loading || disabled} onClick={() => { setCursor(null); setReload(value => value + 1); }}><RefreshCw size={16} /></AdminButton>
    </div>
    {error && <p role="alert" className={s.error}>{error}<AdminButton type="button" variant="quiet" density="compact" disabled={loading || disabled} onClick={() => setReload(value => value + 1)}>Thử lại</AdminButton></p>}
    {loading && <p role="status" className={s.meta}>Đang tải ảnh…</p>}
    {!loading && !error && !items.length && <p className={s.meta}>Thư mục chưa có ảnh. Dùng “Tải ảnh mới” để thêm ảnh cho mục đang sửa.</p>}
    <div className={s.grid} aria-label="Chọn ảnh trong thư mục" aria-busy={loading}>
      {items.map(item => <AdminButton key={item.key} type="button" variant="contextual" className={s.image} disabled={disabled || loading} aria-label={`Chọn ảnh ${item.name}`} aria-pressed={selectedKey === item.key} onClick={() => onChoose(item)}>
        <span className={s.thumbnail}><Thumbnail item={item} />{selectedKey === item.key && <Check size={16} className={s.check} aria-hidden="true" />}</span><span className={s.name}>{item.name}</span>
      </AdminButton>)}
    </div>
    <AdminListFooter total={items.length} totalLabel="Đã tải" unit="ảnh" pending={loading} actions={nextCursor ? <AdminButton type="button" variant="quiet" density="compact" disabled={loading || disabled} onClick={() => setCursor(nextCursor)}>Tải thêm ảnh</AdminButton> : undefined} />
  </div>;
}
