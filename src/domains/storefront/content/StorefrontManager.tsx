"use client";

import { AdminWorkspaceHeading } from "@/domains/shared/ui/admin-design-contract/AdminWorkspaceHeading";
import { AdminButton, AdminDisclosureSummary } from "@/domains/shared/ui/admin-design-contract/AdminButton";
import { ADMIN_SPLIT_WORKSPACE as split, ADMIN_SPLIT_WORKSPACE_STYLE, useAdminSplitWorkspace } from "@/domains/shared/ui/admin-design-contract/AdminSplitWorkspace";
import { PageNotice, PageEditingState } from "@/domains/shared/feedback/PageFeedback";
import { readUiResponse, uiFeedbackMessage } from "@/domains/shared/feedback/read-ui-response";
import Image from "next/image";
import { WebsiteImagePicker } from "../media/WebsiteImagePicker";
import { WEBSITE_IMAGE_FOLDERS, websiteImageUrl, type WebsiteFolder } from "../media/website-media";
import { ADMIN_UI_FOUNDATION as foundation } from "@/domains/shared/ui/admin-design-contract/admin-ui.foundation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import {AdminPageCanvas,AdminPageHeader,AdminDocumentFooter} from "@/domains/shared/ui/admin-design-contract";
import {useUiMutation} from "@/domains/shared/ui/mutation/use-ui-mutation";
import {AsyncActionButton} from "@/domains/shared/ui/mutation/AsyncActionButton";
import {useAppDialog} from "@/domains/shared/feedback/AppDialogProvider";
import { ArrowDown, ArrowUp, Eye, Globe, ImagePlus, Plus, Save, X } from "lucide-react";
import {
  type ArticleContent,
  type ContentRecord,
  type EditorialImage,
  type HomeContent,
  emptyImage,
} from "./contract";
import type { PublicWatchCard } from "../contracts";
import "./manager.css";

type LibraryImage = { key: string; name: string; url: string };
type ArticleItem = {
  id: string;
  content: ArticleContent;
  publishedAt: string | null;
};
const names = {
  hero: "Ảnh mở đầu",
  featured: "Đồng hồ nổi bật",
  about: "Về Vintic",
  collections: "Bộ sưu tập",
  journal: "Chuyện đồng hồ",
  closing: "Lời mời khám phá",
};
type HomeSectionId = HomeContent["sections"][number]["id"];
function HomeSection({id,title,homeOnly,active,children}:{id:HomeSectionId;title:string;homeOnly:boolean;active:HomeSectionId;children:React.ReactNode}){
 return homeOnly?<section id={`home-editor-${id}`} hidden={active!==id} data-admin-pane="content" className="sfc-section-editor" aria-label={title}><AdminWorkspaceHeading>{title}</AdminWorkspaceHeading>{children}</section>:<details id={`home-editor-${id}`} className="sfc-card" open={active===id}><AdminDisclosureSummary>{title}</AdminDisclosureSummary>{children}</details>;
}
async function jsonRequest<T = { record: ContentRecord; articles: ArticleItem[]; items: LibraryImage[]; item: LibraryImage; truncated?: boolean }>(url: string, init?: RequestInit): Promise<T> {
  const fallback = "Không thể tải hoặc lưu dữ liệu website. Vui lòng thử lại.";
  try {
    const res = await fetch(url, { cache: "no-store", ...init });
    const result = await readUiResponse(res, fallback);
    if (url.startsWith("/api/admin/storefront/content") && (!result.record || typeof result.record !== "object" || !("id" in result.record) || !("draft" in result.record))) throw new Error(fallback);
    return result as T;
  } catch (error) { throw new Error(uiFeedbackMessage(error, fallback)); }
}

function Field({
  label,
  value,
  onChange,
  multiline = false,
  hint,
}: {
  label: string;
  value: string;
  onChange: (s: string) => void;
  multiline?: boolean;
  hint?: string;
}) {
  return (
    <label className="sfc-field">
      <span>{label}</span>
      {multiline ? (
        <textarea
          rows={value.length > 1000 ? 16 : 4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} />
      )}
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}
function ImageField({
  label,
  value,
  onChange,
  library,
  onUpload,
  disabled,
  emptyHint,
  folder = "editorial",
  suggestedImage,
}: {
  label: string;
  value: EditorialImage;
  onChange: (s: EditorialImage) => void;
  library: LibraryImage[];
  onUpload: (file: File, folder: WebsiteFolder) => Promise<LibraryImage | null>;
  disabled: boolean;
  emptyHint?: string;
  folder?: WebsiteFolder;
  suggestedImage?: LibraryImage | null;
}) {
  const hintId = useId();
  const showHint = !value.key && Boolean(emptyHint);
  const fileInput=useRef<HTMLInputElement>(null);
  const current = library.find((i) => i.key === value.key);
  const [browsing, setBrowsing] = useState(false);
  const [refreshVersion, setRefreshVersion] = useState(0);
  const pickerId = useId(), chooseButton = useRef<HTMLButtonElement>(null);
  const folderName = WEBSITE_IMAGE_FOLDERS.find(item => item.id === folder)!.label;
  function closePicker() { setBrowsing(false); chooseButton.current?.focus(); }
  return (
    <fieldset className="sfc-image" style={{ "--website-line": foundation.colors.divider, "--website-body": foundation.colors.body, "--website-ring": foundation.colors.focusRing, "--website-soft": foundation.colors.softSurface, "--website-link": foundation.colors.link, "--website-canvas": foundation.colors.canvas, "--website-muted": foundation.colors.muted, "--website-error": foundation.colors.danger } as React.CSSProperties}>
      <legend>{label}</legend>
      <div className="sfc-image-row">
        <div className="sfc-thumbnail">
          {value.key ? (
            <Image
              unoptimized
              width={140}
              height={115}
              src={current?.url || websiteImageUrl(value.key)}
              alt={value.alt}
              style={{ objectPosition: `${value.focalX}% ${value.focalY}%` }}
            />
          ) : (
            <ImagePlus size={24} />
          )}
        </div>
        <div className="sfc-image-controls">
          <AdminButton ref={chooseButton} variant="quiet" type="button" disabled={disabled} aria-label={`Chọn ${label}`} aria-expanded={browsing} aria-controls={pickerId} aria-describedby={showHint ? hintId : undefined} onClick={() => setBrowsing(value => !value)}><ImagePlus size={15} />Chọn ảnh</AdminButton>
          <AdminButton variant="quiet" type="button" className="sfc-upload" disabled={disabled} aria-label={`Tải ${label}`} onClick={()=>fileInput.current?.click()}><ImagePlus size={15}/>Tải ảnh mới</AdminButton>
            <input
              ref={fileInput}
              hidden
              type="file"
              aria-label={`Tải ${label} vào ${folderName}`}
              accept="image/jpeg,image/png,image/webp"
              disabled={disabled}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const item = await onUpload(file, folder);
                  if (item) { onChange({ ...value, key: item.key }); setRefreshVersion(version => version + 1); }
                }
                e.target.value = "";
              }}
            />
          {suggestedImage && suggestedImage.key !== value.key && <AdminButton variant="quiet" type="button" disabled={disabled} title={suggestedImage.name} aria-label={`Dùng ảnh từ thư viện cho ${label}`} onClick={() => onChange({ ...value, key: suggestedImage.key })}>Dùng ảnh từ thư viện</AdminButton>}
          <small className="sfc-image-hint">{folderName}</small>
          {value.key ? (
            <AdminButton variant="quiet" type="button" onClick={() => onChange(emptyImage())}>
              Bỏ ảnh
            </AdminButton>
          ) : null}
          {showHint ? <small id={hintId} className="sfc-image-hint">{emptyHint}</small> : null}
        </div>
      </div>
      {browsing && <div id={pickerId} role="region" aria-label={`Thư viện ${label}`} onKeyDown={event => { if (event.key === "Escape") { event.stopPropagation(); closePicker(); } }}>
        <div className="sfc-row"><strong>Chọn ảnh · {folderName}</strong><AdminButton variant="quiet" type="button" disabled={disabled} onClick={closePicker} aria-label={`Đóng thư viện ${label}`}><X size={16} /></AdminButton></div>
        <WebsiteImagePicker initialFolder={folder} selectedKey={value.key} disabled={disabled} refreshVersion={refreshVersion} onChoose={item => { onChange({ ...value, key: item.key }); closePicker(); }} />
      </div>}
      <Field label="Mô tả ảnh" value={value.alt} onChange={(alt) => onChange({ ...value, alt })} />
      <details className="sfc-advanced"><AdminDisclosureSummary>Chỉnh vị trí ảnh</AdminDisclosureSummary>
      <div className="sfc-grid">
        <label>
          Điểm lấy nét ngang: {value.focalX}%
          <input
            aria-label={`Lấy nét ngang ${label}`}
            type="range"
            min="0"
            max="100"
            value={value.focalX}
            onChange={(e) => onChange({ ...value, focalX: Number(e.target.value) })}
          />
        </label>
        <label>
          Điểm lấy nét dọc: {value.focalY}%
          <input
            aria-label={`Lấy nét dọc ${label}`}
            type="range"
            min="0"
            max="100"
            value={value.focalY}
            onChange={(e) => onChange({ ...value, focalY: Number(e.target.value) })}
          />
        </label>
      </div>
      </details>
    </fieldset>
  );
}
function ProductPicker({ ids, onChange }: { ids: string[]; onChange: (v: string[]) => void }) {
  const [q, setQ] = useState("");
  const [items, setItems] = useState<PublicWatchCard[]>([]);
  const [selected, setSelected] = useState<PublicWatchCard[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      void jsonRequest<{ items: PublicWatchCard[] }>(`/api/admin/storefront/products?q=${encodeURIComponent(q)}`, {
        signal: controller.signal,
      })
        .then((r) => {
          setItems(r.items);
          setError("");
        })
        .catch((e) => {
          if (!controller.signal.aborted) setError(e.message);
        });
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [q]);
  useEffect(() => {
    if (!ids.length) {
      setSelected([]);
      return;
    }
    const controller = new AbortController();
    void jsonRequest<{ items: PublicWatchCard[] }>(`/api/admin/storefront/products?ids=${encodeURIComponent(ids.join(","))}`, {
      signal: controller.signal,
    })
      .then((r) => setSelected(r.items))
      .catch((e) => {
        if (!controller.signal.aborted) setError(e.message);
      });
    return () => controller.abort();
  }, [ids]);
  function move(index: number, delta: number) {
    const copy = [...ids];
    [copy[index], copy[index + delta]] = [copy[index + delta], copy[index]];
    onChange(copy);
  }
  return (
    <div className="sfc-picker">
      <p className="sfc-help">
        Chỉ hiển thị đồng hồ đủ điều kiện public. Tên, giá và tình trạng luôn lấy từ kho.
      </p>
      {ids.map((id, i) => (
        <div className="sfc-product" key={id}>
          <span>
            {i + 1}.{" "}
            {selected.find((p) => p.productId === id)?.title ||
              "Không còn public — hãy bỏ hoặc chọn lại"}
          </span>
          <AdminButton variant="secondary"
            type="button"
            disabled={!i}
            aria-label="Đưa sản phẩm lên"
            onClick={() => move(i, -1)}
          >
            <ArrowUp size={14} />
          </AdminButton>
          <AdminButton variant="secondary"
            type="button"
            disabled={i === ids.length - 1}
            aria-label="Đưa sản phẩm xuống"
            onClick={() => move(i, 1)}
          >
            <ArrowDown size={14} />
          </AdminButton>
          <AdminButton variant="secondary"
            type="button"
            aria-label="Bỏ sản phẩm"
            onClick={() => onChange(ids.filter((v) => v !== id))}
          >
            <X size={14} />
          </AdminButton>
        </div>
      ))}
      <input
        aria-label="Tìm đồng hồ"
        placeholder="Tìm tên hoặc thương hiệu…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      {error ? <p role="alert">{error}</p> : null}
      <div className="sfc-product-results">
        {items
          .filter((p) => !ids.includes(p.productId))
          .map((p) => (
            <AdminButton variant="contextual"
              type="button"
              key={p.productId}
              disabled={ids.length >= 12}
              onClick={() => onChange([...ids, p.productId])}
            >
              <Image src={p.image.url} alt="" width={48} height={60} unoptimized />
              <span>{p.title}</span>
              <Plus size={16} />
            </AdminButton>
          ))}
      </div>
    </div>
  );
}
export default function StorefrontManager({
  homeOnly = false,
  storefrontUrl = "/",
}: {
  homeOnly?: boolean;
  storefrontUrl?: string;
}) {
  const [record, setRecord] = useState<ContentRecord | null>(null);
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [library, setLibrary] = useState<LibraryImage[]>([]);
  const [librarySuggestion, setLibrarySuggestion] = useState<LibraryImage | null>(null);
  const documentMutation=useUiMutation(),uploadMutation=useUiMutation(),dialog=useAppDialog();
  const busy=documentMutation.hasPending,uploading=uploadMutation.hasPending;
  const [pendingAction,setPendingAction]=useState<"save"|"preview"|"publish"|"unpublish"|"create">("save");
  const [needsReload,setNeedsReload]=useState(false);
  const [activeSection,setActiveSection]=useState<HomeSectionId>("hero");
  const splitRef = useAdminSplitWorkspace<HTMLFieldSetElement>(homeOnly && Boolean(record));
  const [loading, setLoading] = useState(true);
  const [dirty, setDirty] = useState(false);
  const [libraryNotice, setLibraryNotice] = useState("");
  const [libraryError, setLibraryError] = useState("");
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");
  const [mobile, setMobile] = useState(false);
  const [tab, setTab] = useState<"home" | "articles">("home");
  const previewDialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (preview && !previewDialog.current?.open) previewDialog.current?.showModal();
  }, [preview]);
  const loadCounter = useRef(0);
  const load = useCallback(async (id: string) => {
    const request = ++loadCounter.current;
    setLoading(true);
    setError("");
    try {
      const r = await jsonRequest(`/api/admin/storefront/content?id=${encodeURIComponent(id)}`);
      if (request !== loadCounter.current) return;
      setRecord(r.record);
      setNeedsReload(false);
      setArticles(r.articles);
      setDirty(false);

    } catch (e) {
      if (request === loadCounter.current)
        setError(e instanceof Error ? e.message : "Không tải được nội dung.");
    } finally {
      if (request === loadCounter.current) setLoading(false);
    }
  }, []);
  const libraryRequest = useRef(0);
  const loadLibrary = useCallback(async () => {
    const request = ++libraryRequest.current;
    setLibraryError("");
    try {
      const result = await jsonRequest<{ items: LibraryImage[]; truncated?: boolean }>("/api/admin/storefront/media");
      if (request !== libraryRequest.current) return;
      if (!Array.isArray(result.items)) throw new Error("Không thể tải thư viện ảnh. Vui lòng thử lại.");
      const selectedKey = new URL(window.location.href).searchParams.get("libraryImage");
      let selected: LibraryImage | undefined;
      if (selectedKey) {
        const lookup = await jsonRequest<{ item: LibraryImage }>(`/api/admin/storefront/media/library?key=${encodeURIComponent(selectedKey)}`);
        selected = lookup.item;
      }
      if (request !== libraryRequest.current) return;
      setLibrarySuggestion(selected ?? null);
      setLibrary(selected ? [selected, ...result.items.filter(item => item.key !== selected.key)] : result.items);
      setLibraryNotice(selected ? "Ảnh từ thư viện đã sẵn trong bộ chọn. Chọn vị trí ảnh và lưu nháp khi đã sẵn sàng." : result.truncated ? "Thư viện đang hiển thị 300 ảnh mới nhất. Mở Thư viện ảnh website để tìm ảnh cũ hơn." : "");
    } catch (error) {
      if (request === libraryRequest.current) setLibraryError(uiFeedbackMessage(error, "Không thể tải thư viện ảnh. Vui lòng thử lại."));
    }
  }, []);
  useEffect(() => {
    void load("home"); void loadLibrary();
    const focus = () => { void loadLibrary(); };
    window.addEventListener("focus", focus);
    return () => { libraryRequest.current += 1; window.removeEventListener("focus", focus); };
  }, [load, loadLibrary]);
  useEffect(() => {
    const listener = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", listener);
    return () => window.removeEventListener("beforeunload", listener);
  }, [dirty]);
  async function choose(id: string) {
    if (busy || uploading || (dirty && !await dialog.confirm({title:"Bỏ thay đổi chưa lưu?",message:"Chuyển nội dung sẽ bỏ các thay đổi chưa lưu.",confirmText:"Bỏ thay đổi",cancelText:"Ở lại"})))return;
    setPreview("");void load(id);
  }
  function edit(content: HomeContent | ArticleContent) {
    if (!record) return;
    setRecord({ ...record, draft: content });
    setDirty(true);

  }
  async function upload(file: File, folder: WebsiteFolder) {
    setError("");
    return await uploadMutation.run({key:"media-upload",notifyOnError:false,onError:(error)=>setError(error instanceof Error?error.message:"Không thể tải ảnh. Vui lòng thử lại."),action:async()=>{
      const data=new FormData();data.append("file",file);data.append("folder",folder);
      const result=await jsonRequest("/api/admin/storefront/media",{method:"POST",body:data});
      libraryRequest.current += 1; setLibrary(value=>[result.item,...value]);return result.item as LibraryImage;
    }}) || null;
  }
  async function save(action: "save" | "publish" | "unpublish", openPreview = false) {
    if (!record || uploading) return;
    setPendingAction(openPreview?"preview":action);setError("");
    await documentMutation.run({key:"document",notifyOnError:false,successMessage:action==="publish"?"Đã xuất bản phiên bản mới.":action==="unpublish"?"Đã gỡ xuất bản. Bản nháp được giữ.":"Đã lưu nháp.",onError:(error)=>{setNeedsReload(true);setError(error instanceof Error?error.message:"Không thể lưu nội dung. Vui lòng thử lại.");},action:async()=>{
      const result=await jsonRequest("/api/admin/storefront/content",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:record.id,revision:record.revision,action,...(homeOnly?{scope:"home"}:{}),content:record.draft})});
      setRecord(result.record);setDirty(false);setNeedsReload(false);

      if(openPreview)setPreview(`/storefront-preview?${record.kind==="ARTICLE"?`article=${record.id}&`:""}v=${result.record.revision}`);
      // The mutation result is authoritative. A separate list refresh must not
      // turn a committed publication into a false save failure.
      if(result.record.kind==="ARTICLE" && "slug" in result.record.draft){const saved=result.record;const content=result.record.draft;setArticles(rows=>rows.map(row=>row.id===saved.id?{id:row.id,content,publishedAt:saved.publishedAt}:row));}
      return result;
    }});
  }
  async function create() {
    if(busy||uploading||(dirty&&!await dialog.confirm({title:"Tạo bài mới?",message:"Các thay đổi chưa lưu sẽ bị bỏ.",confirmText:"Tạo bài",cancelText:"Ở lại"})))return;
    setPendingAction("create");setError("");
    await documentMutation.run({key:"document",notifyOnError:false,onError:(error)=>setError(error instanceof Error?error.message:"Không thể tạo bài viết. Vui lòng thử lại."),action:async()=>{
      const result=await jsonRequest("/api/admin/storefront/content",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"create"})});
      await load(result.record.id);setTab("articles");return result;
    }});
  }
  const home = record?.kind === "HOME" ? (record.draft as HomeContent) : null;
  const article = record?.kind === "ARTICLE" ? (record.draft as ArticleContent) : null;
  const imageProps = { library, suggestedImage: librarySuggestion, onUpload: upload, disabled: uploading || busy };
  function moveSection(from: number, to: number) {
    if (!home || to < 0 || to >= home.sections.length) return;
    const sections = [...home.sections];
    const [item] = sections.splice(from, 1);
    sections.splice(to, 0, item);
    edit({ ...home, sections });
  }
  return (
    <AdminPageCanvas className={`sfc ${homeOnly?"sfc-home":""}`}>
      <AdminPageHeader variant={homeOnly ? "workspace" : "default"} eyebrow={homeOnly ? undefined : "Website"} title={homeOnly?"Trang chủ website":"Quản lý website"} description={homeOnly?"Chọn khối để chỉnh sửa nội dung trang chủ.":"Quản lý nội dung và hình ảnh website."} meta={<><a href="/admin/storefront/media" target="_blank" rel="noreferrer" className="text-xs text-slate-500 hover:text-slate-950">Thư viện ảnh website ↗</a><a href={storefrontUrl} target="_blank" rel="noreferrer" className="text-xs text-slate-500 hover:text-slate-950">Mở website ↗</a></>}/>
      {!homeOnly && (
        <div className="sfc-tabs">
          <AdminButton variant="contextual"
            type="button"
            className={tab === "home" ? "active" : ""}
            onClick={() => {
              if (tab !== "home") {
                choose("home");
                setTab("home");
              }
            }}
          >
            Bố cục & nội dung Home
          </AdminButton>
          <AdminButton variant="contextual"
            type="button"
            className={tab === "articles" ? "active" : ""}
            onClick={() => setTab("articles")}
          >
            Chuyện đồng hồ ({articles.length})
          </AdminButton>
        </div>
      )}
      {error && <PageNotice title="Chưa thể hoàn tất yêu cầu" action={(!record || needsReload) ? (
          <AdminButton variant="secondary"
            type="button"
            onClick={() => {
              void (async()=>{if(!dirty||await dialog.confirm({title:"Tải lại nội dung?",message:"Thay đổi chưa lưu sẽ bị bỏ.",confirmText:"Tải lại",cancelText:"Ở lại"}))void load(record?.id||"home");})();
            }}
          >
            Tải lại nội dung
          </AdminButton>
      ) : undefined}>{error}</PageNotice>}
      {libraryError && <PageNotice title="Không tải được thư viện ảnh" action={<AdminButton variant="secondary" type="button" disabled={busy || uploading} onClick={() => void loadLibrary()}>Thử lại</AdminButton>}>{libraryError}</PageNotice>}
      {libraryNotice && <PageNotice tone="info" title="Thư viện ảnh">{libraryNotice}</PageNotice>}
      {tab === "articles" ? (
        <section className="sfc-card">
          <div className="sfc-row">
            <h2>Bài viết</h2>
            <AsyncActionButton variant="secondary" type="button" pending={busy&&pendingAction==="create"} pendingLabel="Đang tạo…" disabled={busy || uploading} onClick={() => void create()}>
              <Plus size={16} /> Tạo bài
            </AsyncActionButton>
          </div>
          <div className="sfc-article-list">
            {articles.length ? (
              articles.map((a) => (
                <AdminButton variant="contextual"
                  type="button"
                  key={a.id}
                  className={record?.id === a.id ? "selected" : ""}
                  onClick={() => choose(a.id)}
                >
                  <strong>{a.content.title}</strong>
                  <span>
                    {a.publishedAt ? "Đã xuất bản · có thể có thay đổi nháp" : "Bản nháp"}
                  </span>
                </AdminButton>
              ))
            ) : (
              <p>Chưa có bài viết. Tạo bài, chọn ảnh bìa và xuất bản trước khi đưa lên Home.</p>
            )}
          </div>
        </section>
      ) : null}
      {loading ? (
        <p role="status">Đang tải nội dung…</p>
      ) : record && ((tab === "home" && home) || (tab === "articles" && article)) ? (
        <>

          <fieldset ref={splitRef} style={home&&homeOnly?ADMIN_SPLIT_WORKSPACE_STYLE:undefined} disabled={busy || uploading} className={`sfc-editor ${home&&homeOnly?`sfc-home-layout ${split.layout}`:""}`}>
            {home ? (
              <>
                <section data-admin-pane="sidebar" className="sfc-section-nav" aria-label="Các khối trang chủ">
                  <AdminWorkspaceHeading navigation>Các khối trang chủ</AdminWorkspaceHeading>
                  <p className="sfc-help">
                    Chọn khối để sửa · kéo để sắp xếp.
                  </p>
                  {homeOnly&&<div className="sfc-section-mobile">
                    <label className="sfc-field"><span>Khối đang sửa</span><select value={activeSection} onChange={event=>setActiveSection(event.target.value as HomeSectionId)}>{home.sections.map(section=><option key={section.id} value={section.id}>{names[section.id]}</option>)}</select></label>
                    <div className="sfc-row"><label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={home.sections.find(section=>section.id===activeSection)?.enabled||false} onChange={event=>edit({...home,sections:home.sections.map(section=>section.id===activeSection?{...section,enabled:event.target.checked}:section)})}/>Hiển thị khối</label><div className="flex gap-1"><AdminButton variant="quiet" iconOnly type="button" aria-label="Đưa khối đang sửa lên" disabled={home.sections[0].id===activeSection} onClick={()=>{const i=home.sections.findIndex(section=>section.id===activeSection);moveSection(i,i-1);}}><ArrowUp size={15}/></AdminButton><AdminButton variant="quiet" iconOnly type="button" aria-label="Đưa khối đang sửa xuống" disabled={home.sections.at(-1)?.id===activeSection} onClick={()=>{const i=home.sections.findIndex(section=>section.id===activeSection);moveSection(i,i+1);}}><ArrowDown size={15}/></AdminButton></div></div>
                  </div>}
                  <div className={homeOnly?"sfc-section-desktop":""}>
                  {home.sections.map((section, i) => (
                    <div
                      className={`sfc-section-row ${homeOnly&&activeSection===section.id?"is-selected":""}`}
                      key={section.id}
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData("application/x-vintic-home-section", section.id)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const from = home.sections.findIndex(s=>s.id===e.dataTransfer.getData("application/x-vintic-home-section"));
                        if (Number.isInteger(from) && from >= 0 && from < home.sections.length)
                          moveSection(from, i);
                      }}
                    >
                      <span aria-hidden>⠿</span>
                      <label>
                        <input
                          type="checkbox"
                          checked={section.enabled}
                          onChange={(e) =>
                            edit({
                              ...home,
                              sections: home.sections.map((s) =>
                                s.id === section.id ? { ...s, enabled: e.target.checked } : s,
                              ),
                            })
                          }
                        />
                        <span className="sr-only">Hiển thị {names[section.id]}</span>
                      </label>
                      <AdminButton variant="contextual" type="button" className="sfc-section-select" aria-current={activeSection===section.id?"true":undefined} aria-controls={`home-editor-${section.id}`} onClick={()=>{setActiveSection(section.id);if(window.matchMedia("(max-width: 900px)").matches)requestAnimationFrame(()=>document.getElementById(`home-editor-${section.id}`)?.scrollIntoView({block:"start",behavior:"smooth"}));}}><span>{names[section.id]}</span><small>{section.enabled?"Đang bật":"Đang ẩn"}</small></AdminButton>
                      <AdminButton variant="quiet" iconOnly
                        type="button"
                        disabled={!i}
                        aria-label={`Đưa ${names[section.id]} lên`}
                        onClick={() => moveSection(i, i - 1)}
                      >
                        <ArrowUp size={15} />
                      </AdminButton>
                      <AdminButton variant="quiet" iconOnly
                        type="button"
                        disabled={i === home.sections.length - 1}
                        aria-label={`Đưa ${names[section.id]} xuống`}
                        onClick={() => moveSection(i, i + 1)}
                      >
                        <ArrowDown size={15} />
                      </AdminButton>
                    </div>
                  ))}
                  </div>
                </section>
                <HomeSection id="hero" title="Ảnh mở đầu — Hero" homeOnly={homeOnly} active={activeSection}>
                  <label className="sfc-field">
                    <span>Tông màu khối mở đầu</span>
                    <select
                      value={home.hero.theme}
                      onChange={(e) =>
                        edit({
                          ...home,
                          hero: {
                            ...home.hero,
                            theme: e.target.value as "light" | "charcoal",
                          },
                        })
                      }
                    >
                      <option value="charcoal">Than ấm · chữ trắng ngà, nút kem</option>
                      <option value="light">Sáng · chữ tối</option>
                    </select>
                    <small>
                      Để giống mẫu tông tối đã duyệt, dùng PNG/WebP đã tách nền. Đổi tông không tự
                      xóa nền trắng của ảnh.
                    </small>
                  </label>
                  <div className="sfc-grid">
                    <Field
                      label="Tiêu đề (xuống dòng để ngắt câu)"
                      multiline
                      value={home.hero.title}
                      onChange={(title) => edit({ ...home, hero: { ...home.hero, title } })}
                    />
                    <Field
                      label="Mô tả"
                      multiline
                      value={home.hero.description}
                      onChange={(description) =>
                        edit({ ...home, hero: { ...home.hero, description } })
                      }
                    />
                  </div>
                  <details className="sfc-advanced"><AdminDisclosureSummary>Nút liên kết & chú thích</AdminDisclosureSummary>
                  <div className="sfc-grid">
                    <Field
                      label="Chữ trên nút"
                      value={home.hero.button}
                      onChange={(button) => edit({ ...home, hero: { ...home.hero, button } })}
                    />
                    <Field
                      label="Đường dẫn"
                      value={home.hero.href}
                      onChange={(href) => edit({ ...home, hero: { ...home.hero, href } })}
                    />
                  </div>
                  <Field
                    label="Chú thích ảnh"
                    value={home.hero.caption}
                    onChange={(caption) => edit({ ...home, hero: { ...home.hero, caption } })}
                  />
                  </details>
                  <div className="sfc-grid">
                    <ImageField
                      {...imageProps}
                      folder="hero"
                      label="Ảnh desktop"
                      emptyHint="Để trống để dùng ảnh đồng hồ đủ điều kiện từ danh mục."
                      value={home.hero.image}
                      onChange={(image) => edit({ ...home, hero: { ...home.hero, image } })}
                    />
                    <ImageField
                      {...imageProps}
                      folder="hero"
                      label="Ảnh mobile (bỏ trống để dùng desktop)"
                      value={home.hero.mobileImage}
                      onChange={(mobileImage) =>
                        edit({ ...home, hero: { ...home.hero, mobileImage } })
                      }
                    />
                  </div>
                </HomeSection>
                <HomeSection id="featured" title="Đồng hồ nổi bật" homeOnly={homeOnly} active={activeSection}>
                  <Field
                    label="Tiêu đề khối"
                    value={home.featured.title}
                    onChange={(title) => edit({ ...home, featured: { ...home.featured, title } })}
                  />
                  <Field
                    label="Đường dẫn xem tất cả"
                    value={home.featured.href}
                    onChange={(href) => edit({ ...home, featured: { ...home.featured, href } })}
                  />
                  <p className="sfc-help">
                    Chưa chọn: tự lấy 4 đồng hồ public mới cập nhật, còn hàng. Đã chọn: giữ đúng thứ
                    tự bên dưới.
                  </p>
                  <ProductPicker
                    ids={home.featured.productIds}
                    onChange={(productIds) =>
                      edit({
                        ...home,
                        featured: { ...home.featured, productIds },
                      })
                    }
                  />
                </HomeSection>
                <HomeSection id="about" title="Về Vintic" homeOnly={homeOnly} active={activeSection}>
                  <Field
                    label="Tiêu đề"
                    value={home.about.title}
                    onChange={(title) => edit({ ...home, about: { ...home.about, title } })}
                  />
                  <Field
                    label="Nội dung"
                    multiline
                    value={home.about.body}
                    onChange={(body) => edit({ ...home, about: { ...home.about, body } })}
                  />
                  <ImageField
                    {...imageProps}
                    folder="about"
                      label="Ảnh giới thiệu"
                    emptyHint="Ảnh không bắt buộc. Chưa chọn ảnh: phần giới thiệu hiển thị dạng văn bản gọn."
                    value={home.about.image}
                    onChange={(image) => edit({ ...home, about: { ...home.about, image } })}
                  />
                </HomeSection>
                <HomeSection id="collections" title="Bộ sưu tập theo phong cách" homeOnly={homeOnly} active={activeSection}>
                  {home.collections.map((collection, i) => (
                    <section className="sfc-collection" key={collection.id}>
                      <div className="sfc-row">
                        <h3>Bộ sưu tập {i + 1}</h3>
                        <AdminButton variant="secondary"
                          type="button"
                          onClick={() =>
                            edit({
                              ...home,
                              collections: home.collections.filter((_, n) => n !== i),
                            })
                          }
                        >
                          Bỏ nhóm
                        </AdminButton>
                      </div>
                      {(
                        [
                          ["title", "Tên nhóm"],
                          ["description", "Mô tả"],
                          ["href", "Đường dẫn /products?style=DRESS…"],
                        ] as const
                      ).map(([key, label]) => (
                        <Field
                          key={key}
                          label={label}
                          value={collection[key]}
                          onChange={(value) =>
                            edit({
                              ...home,
                              collections: home.collections.map((c, n) =>
                                n === i ? { ...c, [key]: value } : c,
                              ),
                            })
                          }
                        />
                      ))}
                      <ImageField
                        {...imageProps}
                        folder="collections"
                        label={`Ảnh nhóm ${i + 1}`}
                        emptyHint="Ảnh không bắt buộc. Chưa chọn ảnh: nhóm hiển thị thành liên kết gọn."
                        value={collection.image}
                        onChange={(image) =>
                          edit({
                            ...home,
                            collections: home.collections.map((c, n) =>
                              n === i ? { ...c, image } : c,
                            ),
                          })
                        }
                      />
                    </section>
                  ))}
                  <AdminButton variant="secondary"
                    type="button"
                    disabled={home.collections.length >= 6}
                    onClick={() =>
                      edit({
                        ...home,
                        collections: [
                          ...home.collections,
                          {
                            id: `collection-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                            title: "Bộ sưu tập mới",
                            description: "",
                            href: "/products",
                            image: emptyImage(),
                          },
                        ],
                      })
                    }
                  >
                    + Thêm nhóm
                  </AdminButton>
                </HomeSection>
                <HomeSection id="journal" title="Chuyện đồng hồ trên Home" homeOnly={homeOnly} active={activeSection}>
                  <Field
                    label="Tên khối"
                    value={home.journal.title}
                    onChange={(title) => edit({ ...home, journal: { ...home.journal, title } })}
                  />
                  <label className="sfc-field">
                    <span>Bài nổi bật</span>
                    <select
                      value={home.journal.articleId}
                      onChange={(e) =>
                        edit({
                          ...home,
                          journal: {
                            ...home.journal,
                            articleId: e.target.value,
                          },
                        })
                      }
                    >
                      <option value="">Không hiển thị bài nổi bật</option>
                      {articles.map((a) => (
                        <option key={a.id} value={a.id} disabled={!a.publishedAt}>
                          {a.content.title}
                          {a.publishedAt ? "" : " (chưa xuất bản)"}
                        </option>
                      ))}
                    </select>
                  </label>
                  <p className="sfc-help">
                    Khách đọc phiên bản đã xuất bản. Các chỉnh sửa nháp của bài không thay đổi nội
                    dung công khai.
                  </p>
                </HomeSection>
                <HomeSection id="closing" title="Lời mời khám phá" homeOnly={homeOnly} active={activeSection}>
                  {(
                    [
                      ["title", "Tiêu đề"],
                      ["button", "Chữ trên nút"],
                      ["href", "Đường dẫn"],
                    ] as const
                  ).map(([key, label]) => (
                    <Field
                      key={key}
                      label={label}
                      value={home.closing[key]}
                      onChange={(v) =>
                        edit({
                          ...home,
                          closing: { ...home.closing, [key]: v },
                        })
                      }
                    />
                  ))}
                </HomeSection>
                {!homeOnly && (
                  <details className="sfc-card">
                    <AdminDisclosureSummary>Thông tin chung & footer</AdminDisclosureSummary>
                    <ImageField
                      {...imageProps}
                      folder="branding"
                      label="Logo (bỏ trống để dùng chữ Vintic)"
                      value={home.general.logo}
                      onChange={(logo) => edit({ ...home, general: { ...home.general, logo } })}
                    />
                    <Field
                      label="Giới thiệu ngắn"
                      value={home.general.tagline}
                      onChange={(tagline) =>
                        edit({ ...home, general: { ...home.general, tagline } })
                      }
                    />
                    <Field
                      label="Thông tin liên hệ"
                      multiline
                      value={home.general.contact}
                      onChange={(contact) =>
                        edit({ ...home, general: { ...home.general, contact } })
                      }
                    />
                    {home.general.links.map((link, i) => (
                      <div key={i} className="sfc-grid">
                        <Field
                          label="Tên liên kết (chính sách / mạng xã hội)"
                          value={link.label}
                          onChange={(label) =>
                            edit({
                              ...home,
                              general: {
                                ...home.general,
                                links: home.general.links.map((l, n) =>
                                  n === i ? { ...l, label } : l,
                                ),
                              },
                            })
                          }
                        />
                        <Field
                          label="Đường dẫn"
                          value={link.href}
                          onChange={(href) =>
                            edit({
                              ...home,
                              general: {
                                ...home.general,
                                links: home.general.links.map((l, n) =>
                                  n === i ? { ...l, href } : l,
                                ),
                              },
                            })
                          }
                        />
                        <AdminButton variant="secondary"
                          type="button"
                          onClick={() =>
                            edit({
                              ...home,
                              general: {
                                ...home.general,
                                links: home.general.links.filter((_, n) => n !== i),
                              },
                            })
                          }
                        >
                          Bỏ liên kết
                        </AdminButton>
                      </div>
                    ))}
                    <AdminButton variant="secondary"
                      type="button"
                      disabled={home.general.links.length >= 12}
                      onClick={() =>
                        edit({
                          ...home,
                          general: {
                            ...home.general,
                            links: [
                              ...home.general.links,
                              { label: "Liên kết mới", href: "/products" },
                            ],
                          },
                        })
                      }
                    >
                      + Thêm liên kết
                    </AdminButton>
                  </details>
                )}
              </>
            ) : null}
            {article ? (
              <section className="sfc-card">
                <Field
                  label="Tiêu đề bài"
                  value={article.title}
                  onChange={(title) => edit({ ...article, title })}
                />
                <Field
                  label="Slug"
                  hint="Đường dẫn /stories/slug. Chỉnh sửa nháp chưa thay đổi đường dẫn đang công khai."
                  value={article.slug}
                  onChange={(slug) => edit({ ...article, slug })}
                />
                <Field
                  label="Tóm tắt (hiển thị trên Home)"
                  multiline
                  value={article.excerpt}
                  onChange={(excerpt) => edit({ ...article, excerpt })}
                />
                <ImageField
                  {...imageProps}
                  folder="journal"
                      label="Ảnh bìa"
                  value={article.cover}
                  onChange={(cover) => edit({ ...article, cover })}
                />
                <Field
                  label="Nội dung bài"
                  multiline
                  hint="Văn bản thuần, một dòng trống để tách đoạn. Không cần HTML."
                  value={article.body}
                  onChange={(body) => edit({ ...article, body })}
                />
                {article.images.map((image, i) => (
                  <div key={i}>
                    <ImageField
                      {...imageProps}
                      folder="journal"
                      label={`Ảnh trong bài ${i + 1}`}
                      value={image}
                      onChange={(value) =>
                        edit({
                          ...article,
                          images: article.images.map((v, n) => (n === i ? value : v)),
                        })
                      }
                    />
                    <AdminButton variant="secondary"
                      type="button"
                      onClick={() =>
                        edit({
                          ...article,
                          images: article.images.filter((_, n) => n !== i),
                        })
                      }
                    >
                      Bỏ ảnh {i + 1}
                    </AdminButton>
                  </div>
                ))}
                <AdminButton variant="secondary"
                  type="button"
                  disabled={article.images.length >= 10}
                  onClick={() =>
                    edit({
                      ...article,
                      images: [...article.images, emptyImage()],
                    })
                  }
                >
                  + Thêm ảnh trong bài
                </AdminButton>
                <h3>Đồng hồ liên quan</h3>
                <ProductPicker
                  ids={article.productIds}
                  onChange={(productIds) => edit({ ...article, productIds })}
                />
              </section>
            ) : null}
          </fieldset>
          <AdminDocumentFooter className="sfc-document-actions">
            {!homeOnly && <h2 className="text-sm font-semibold">{record.kind === "HOME" ? "Trang chủ" : article?.title}</h2>}
            {needsReload&&<AdminButton variant="secondary" type="button" disabled={busy||uploading} onClick={()=>{void (async()=>{if(!dirty||await dialog.confirm({title:"Tải lại bản mới?",message:"Thay đổi chưa lưu sẽ bị bỏ. Chọn Ở lại để giữ nội dung và thử lưu lại.",confirmText:"Tải lại",cancelText:"Ở lại"}))void load(record.id);})();}}>Tải lại bản mới</AdminButton>}
            <div className="sfc-actions">
              <PageEditingState dirty={dirty} saving={busy && pendingAction === "save"} uploading={uploading} />
              <details className="text-xs text-slate-500">
                <AdminDisclosureSummary className="cursor-pointer py-2">{record.publishedAt ? "Đã xuất bản" : "Chưa xuất bản"}</AdminDisclosureSummary>
                <span className="block py-2 tabular-nums">Phiên bản {record.revision}{record.publishedAt ? ` · Xuất bản ${new Date(record.publishedAt).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}` : ""}</span>
              </details>
              <AsyncActionButton variant="secondary" type="button" pending={busy&&pendingAction==="save"} pendingLabel="Đang lưu…" disabled={busy || uploading} onClick={() => void save("save")}>
                <Save size={16} strokeWidth={1.75} aria-hidden="true" />
                Lưu nháp
              </AsyncActionButton>
              <AsyncActionButton variant="secondary"
                type="button"
                pending={busy&&pendingAction==="preview"}
                pendingLabel="Đang mở…"
                disabled={busy || uploading}
                onClick={() => void save("save", true)}
              >
                <Eye size={16} strokeWidth={1.75} aria-hidden="true" />
                Xem trước
              </AsyncActionButton>
              <AsyncActionButton variant="primary"
                type="button"
                className="primary"
                pending={busy&&pendingAction==="publish"}
                pendingLabel="Đang xuất bản…"
                disabled={busy || uploading}
                onClick={() => void save("publish")}
              >
                <Globe size={16} strokeWidth={1.75} aria-hidden="true" />
                Xuất bản
              </AsyncActionButton>
              {record.publishedAt && !homeOnly ? (
                <AdminButton variant="secondary"
                  type="button"
                  disabled={busy || uploading}
                  onClick={() => {
                    void (async()=>{if(await dialog.confirm({title:"Gỡ xuất bản?",message:"Nội dung đang công khai sẽ bị gỡ. Bản nháp được giữ.",confirmText:"Gỡ xuất bản",cancelText:"Hủy",tone:"danger"}))void save("unpublish");})();
                  }}
                >
                  Gỡ xuất bản
                </AdminButton>
              ) : null}
            </div>
          </AdminDocumentFooter>
        </>
      ) : null}
      {preview ? (
        <dialog
          ref={previewDialog}
          className="sfc-preview"
          aria-label="Xem trước Storefront"
          onCancel={() => setPreview("")}
        >
          <div className="sfc-preview-toolbar">
            <strong>Bản nháp đã lưu</strong>
            <AdminButton variant="contextual" type="button" onClick={() => setMobile(false)} aria-pressed={!mobile}>
              Desktop
            </AdminButton>
            <AdminButton variant="contextual" type="button" onClick={() => setMobile(true)} aria-pressed={mobile}>
              Mobile
            </AdminButton>
            <a href={preview} target="_blank" rel="noreferrer">
              Mở riêng ↗
            </a>
            <AdminButton variant="secondary" type="button" aria-label="Đóng xem trước" onClick={() => setPreview("")}>
              <X size={20} />
            </AdminButton>
          </div>
          <iframe
            key={preview}
            title="Bản nháp storefront"
            src={preview}
            style={{ width: mobile ? "390px" : "100%" }}
          />
        </dialog>
      ) : null}
    </AdminPageCanvas>
  );
}
