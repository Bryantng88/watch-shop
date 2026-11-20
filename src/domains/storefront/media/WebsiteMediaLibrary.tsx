"use client";
import { AdminListFooter } from "@/domains/shared/ui/admin-design-contract/AdminListFooter";
import { AdminButton, AdminAnchorAction } from "@/domains/shared/ui/admin-design-contract/AdminButton";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Folder, ImageOff, RefreshCw, Upload } from "lucide-react";
import { AdminManagementPage, AdminManagementButton as Button, ADMIN_MANAGEMENT as s } from "@/domains/shared/ui/admin-design-contract/AdminManagement";
import { WEBSITE_IMAGE_FOLDERS, type WebsiteFolder, type WebsiteImage, type WebsiteImagePage } from "./website-media";
function ImagePreview({ item }: { item: WebsiteImage }) {
  const [broken, setBroken] = useState(false);
  useEffect(() => setBroken(false), [item.url]);
  return <div className={s.imageView}>{broken ? <ImageOff aria-label="Ảnh hết hạn hoặc không tải được. Làm mới thư viện để thử lại." size={24} /> : <Image unoptimized src={item.url} alt={item.name} width={320} height={240} onError={() => setBroken(true)} />}</div>;
}
export default function WebsiteMediaLibrary() {
  const [folder, setFolder] = useState<WebsiteFolder>("editorial");
  const [items, setItems] = useState<WebsiteImage[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [reload, setReload] = useState(0);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [uploadError, setUploadError] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const uploadLock = useRef(false);
  const generation = useRef(0);
  useEffect(() => {
    const controller = new AbortController();
    const request = ++generation.current;
    setLoading(true); setError("");
    const params = new URLSearchParams({ folder }); if (cursor) params.set("cursor", cursor);
    void fetch(`/api/admin/storefront/media/library?${params}`, { cache: "no-store", signal: controller.signal }).then(async response => {
      const value = await response.json();
      if (!response.ok) throw new Error(value.error || "Không tải được ảnh.");
      if (request !== generation.current || controller.signal.aborted) return;
      const result = value as WebsiteImagePage;
      setItems(current => cursor ? [...current, ...result.items.filter(item => !current.some(existing => existing.key === item.key))] : result.items);
      setNextCursor(result.nextCursor);
    }).catch(reason => { if (!controller.signal.aborted && request === generation.current) setError(reason instanceof Error ? reason.message : "Không tải được ảnh."); }).finally(() => { if (!controller.signal.aborted && request === generation.current) setLoading(false); });
    return () => controller.abort();
  }, [folder, cursor, reload]);
  useEffect(() => {
    if (!uploading) return;
    const guard = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", guard);
    return () => window.removeEventListener("beforeunload", guard);
  }, [uploading]);
  function refresh() { setCursor(null); setReload(value => value + 1); }
  async function upload(files: FileList | null) {
    if (!files?.length || uploadLock.current) return;
    uploadLock.current = true; setUploading(true); setUploadError(""); setMessage("");
    let count = 0;
    try {
      for (const file of Array.from(files)) {
        if (file.size > 20 * 1024 * 1024 || !["image/jpeg","image/png","image/webp"].includes(file.type)) throw new Error(`${file.name}: chọn JPEG, PNG hoặc WebP tối đa 20 MB.`);
        const body = new FormData(); body.set("file", file); body.set("folder", folder);
        const response = await fetch("/api/admin/storefront/media", { method: "POST", body });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Không tải được ảnh.");
        count += 1;
        setMessage(`Đã tải ${count}/${files.length} ảnh.`);
      }
      setMessage(`Đã tải ${count} ảnh. Chọn “Dùng trên Home” để đặt ảnh vào trang chủ.`);
    } catch (reason) { setUploadError(`${reason instanceof Error ? reason.message : "Không tải được ảnh."}${count ? ` ${count} ảnh trước đó đã được tải thành công.` : ""}`); }
    finally { uploadLock.current = false; setUploading(false); if (fileInput.current) fileInput.current.value = ""; refresh(); }
  }
  const folderName = WEBSITE_IMAGE_FOLDERS.find(item => item.id === folder)!.label;
  return <AdminManagementPage eyebrow="Storefront" title="Thư viện ảnh website" description="Quản lý ảnh nội dung và ảnh mở đầu dùng cho website." actions={<a className={s.link} href="/admin/storefront/home" aria-disabled={uploading} onClick={event => { if (uploading) event.preventDefault(); }}>Chỉnh sửa trang chủ</a>}>
    <div className={s.mediaLayout}>
      <nav className={s.folders} aria-label="Thư mục ảnh website">{WEBSITE_IMAGE_FOLDERS.map(item => <AdminButton variant="contextual" key={item.id} className={s.folder} aria-pressed={item.id === folder} disabled={uploading} onClick={() => { if (item.id !== folder) { setFolder(item.id); setCursor(null); setItems([]); setNextCursor(null); setMessage(""); setUploadError(""); } }}><Folder aria-hidden="true" />{item.label}</AdminButton>)}</nav>
      <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>
        <div className={s.toolbar}><h2 className={s.sectionTitle} style={{ flex: "1 1 180px" }}>{folderName}</h2><Button disabled={loading || uploading} onClick={refresh} aria-label="Làm mới thư viện"><RefreshCw aria-hidden="true" /></Button><Button primary disabled={loading} pending={uploading} pendingLabel="Đang tải ảnh…" onClick={() => fileInput.current?.click()}><Upload aria-hidden="true" />Tải ảnh lên</Button><input ref={fileInput} hidden type="file" multiple accept="image/jpeg,image/png,image/webp" aria-label="Chọn ảnh tải lên website" disabled={uploading} onChange={event => void upload(event.target.files)} /></div>
        <p className={s.metadata}>JPEG, PNG, WebP · tối đa 20 MB/ảnh. Tải lên thư viện chưa thay đổi website đã xuất bản.</p>
        {message && <p role="status" className={s.metadata}>{message}</p>}
        {uploadError && <p role="alert" className={s.error}>{uploadError}</p>}
        {error && <div role="alert" className={s.errorBox}>{error}<Button disabled={loading} onClick={() => setReload(v => v + 1)}>Thử lại</Button></div>}
        {loading && <p role="status" className={s.metadata}>Đang tải thư viện…</p>}
        {!loading && !items.length && !error && <p className={s.metadata}>{nextCursor ? "Trang này chưa có ảnh website phù hợp. Tải thêm để tiếp tục." : "Thư mục chưa có ảnh. Tải ảnh lên để bắt đầu."}</p>}
        <div className={s.images} aria-label="Ảnh trong thư mục" aria-busy={loading}>{items.map(item => <figure className={s.image} key={item.key}>
          <ImagePreview item={item} /><figcaption>{item.name}{item.sizeBytes != null && <span> · {(item.sizeBytes / 1024).toLocaleString("vi-VN", { maximumFractionDigits: 0 })} KB</span>}</figcaption>
          <div className={s.actions}><AdminAnchorAction variant="secondary" className={s.button} href={item.url} target="_blank" rel="noreferrer">Xem ảnh</AdminAnchorAction><AdminAnchorAction variant="secondary" className={s.button} aria-disabled={uploading} onClick={event => { if (uploading) event.preventDefault(); }} href={`/admin/storefront/home?libraryImage=${encodeURIComponent(item.key)}`}>Dùng trên Home</AdminAnchorAction></div>
        </figure>)}</div>
        <AdminListFooter total={items.length} totalLabel="Đã tải" unit="ảnh" pending={loading || uploading} actions={nextCursor ? <AdminButton variant="quiet" density="compact" disabled={loading || uploading} onClick={() => setCursor(nextCursor)}>Tải thêm ảnh</AdminButton> : undefined} />
      </div>
    </div>
  </AdminManagementPage>;
}
