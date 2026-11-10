"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {AdminPageCanvas,AdminPageHeader,AdminFlatToolbar} from "@/domains/shared/ui/admin-design-contract";
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
  homeImageGuidance,
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
 return homeOnly?<section id={`home-editor-${id}`} hidden={active!==id} className="sfc-section-editor" aria-label={title}><h2>{title}</h2>{children}</section>:<details id={`home-editor-${id}`} className="sfc-card" open={active===id}><summary>{title}</summary>{children}</details>;
}
async function jsonRequest(url: string, init?: RequestInit) {
  const res = await fetch(url, { cache: "no-store", ...init });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || json.message || "Không thể thực hiện. Hãy thử lại.");
  return json;
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
}: {
  label: string;
  value: EditorialImage;
  onChange: (s: EditorialImage) => void;
  library: LibraryImage[];
  onUpload: (file: File) => Promise<LibraryImage | null>;
  disabled: boolean;
}) {
  const fileInput=useRef<HTMLInputElement>(null);
  const current = library.find((i) => i.key === value.key);
  return (
    <fieldset className="sfc-image">
      <legend>{label}</legend>
      <div className="sfc-image-row">
        <div className="sfc-thumbnail">
          {current ? (
            <Image
              unoptimized
              width={140}
              height={115}
              src={current.url}
              alt={value.alt}
              style={{ objectPosition: `${value.focalX}% ${value.focalY}%` }}
            />
          ) : (
            <ImagePlus size={24} />
          )}
        </div>
        <div className="sfc-image-controls">
          <select
            aria-label={`Chọn ${label}`}
            value={value.key}
            onChange={(e) => onChange({ ...value, key: e.target.value })}
          >
            <option value="">Chưa chọn ảnh</option>
            {value.key && !current ? (
              <option value={value.key}>Ảnh đã chọn (ngoài 300 ảnh mới nhất)</option>
            ) : null}
            {library.map((i) => (
              <option key={i.key} value={i.key}>
                {i.name}
              </option>
            ))}
          </select>
          <button type="button" className="sfc-upload" disabled={disabled} aria-label={`Tải ${label}`} onClick={()=>fileInput.current?.click()}><ImagePlus size={15}/>Tải ảnh mới</button>
            <input
              ref={fileInput}
              hidden
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={disabled}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const item = await onUpload(file);
                  if (item) onChange({ ...value, key: item.key });
                }
                e.target.value = "";
              }}
            />
          {value.key ? (
            <button type="button" onClick={() => onChange(emptyImage())}>
              Bỏ ảnh
            </button>
          ) : null}
        </div>
      </div>
      <Field label="Mô tả ảnh" value={value.alt} onChange={(alt) => onChange({ ...value, alt })} />
      <details className="sfc-advanced"><summary>Chỉnh vị trí ảnh</summary>
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
      void jsonRequest(`/api/admin/storefront/products?q=${encodeURIComponent(q)}`, {
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
    void jsonRequest(`/api/admin/storefront/products?ids=${encodeURIComponent(ids.join(","))}`, {
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
          <button
            type="button"
            disabled={!i}
            aria-label="Đưa sản phẩm lên"
            onClick={() => move(i, -1)}
          >
            <ArrowUp size={14} />
          </button>
          <button
            type="button"
            disabled={i === ids.length - 1}
            aria-label="Đưa sản phẩm xuống"
            onClick={() => move(i, 1)}
          >
            <ArrowDown size={14} />
          </button>
          <button
            type="button"
            aria-label="Bỏ sản phẩm"
            onClick={() => onChange(ids.filter((v) => v !== id))}
          >
            <X size={14} />
          </button>
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
            <button
              type="button"
              key={p.productId}
              disabled={ids.length >= 12}
              onClick={() => onChange([...ids, p.productId])}
            >
              <Image src={p.image.url} alt="" width={48} height={60} unoptimized />
              <span>{p.title}</span>
              <Plus size={16} />
            </button>
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
  const documentMutation=useUiMutation(),uploadMutation=useUiMutation(),dialog=useAppDialog();
  const busy=documentMutation.hasPending,uploading=uploadMutation.hasPending;
  const [pendingAction,setPendingAction]=useState<"save"|"preview"|"publish"|"unpublish"|"create">("save");
  const [needsReload,setNeedsReload]=useState(false);
  const [activeSection,setActiveSection]=useState<HomeSectionId>("hero");
  const [loading, setLoading] = useState(true);
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState("");
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
      setMessage("");
    } catch (e) {
      if (request === loadCounter.current)
        setError(e instanceof Error ? e.message : "Không tải được nội dung.");
    } finally {
      if (request === loadCounter.current) setLoading(false);
    }
  }, []);
  useEffect(() => {
    void load("home");
    void jsonRequest("/api/admin/storefront/media")
      .then((r) => {
        setLibrary(r.items);
        if (r.truncated)
          setMessage("Thư viện đang hiển thị 300 ảnh mới nhất. Ảnh đã chọn vẫn được giữ nguyên.");
      })
      .catch((e) => setError(e.message));
  }, [load]);
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
    setMessage("");
  }
  async function upload(file: File) {
    setError("");
    return await uploadMutation.run({key:"media-upload",action:async()=>{
      const data=new FormData();data.append("file",file);
      const result=await jsonRequest("/api/admin/storefront/media",{method:"POST",body:data});
      setLibrary(value=>[result.item,...value]);return result.item as LibraryImage;
    }}) || null;
  }
  async function save(action: "save" | "publish" | "unpublish", openPreview = false) {
    if (!record || uploading) return;
    setPendingAction(openPreview?"preview":action);setError("");setMessage("");
    await documentMutation.run({key:"document",onError:()=>setNeedsReload(true),action:async()=>{
      const result=await jsonRequest("/api/admin/storefront/content",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:record.id,revision:record.revision,action,...(homeOnly?{scope:"home"}:{}),content:record.draft})});
      setRecord(result.record);setDirty(false);setNeedsReload(false);
      setMessage(action==="publish"?"Đã xuất bản phiên bản mới.":action==="unpublish"?"Đã gỡ xuất bản. Bản nháp được giữ.":"Đã lưu nháp · website chưa thay đổi.");
      if(openPreview)setPreview(`/storefront-preview?${record.kind==="ARTICLE"?`article=${record.id}&`:""}v=${result.record.revision}`);
      // The mutation result is authoritative. A separate list refresh must not
      // turn a committed publication into a false save failure.
      if(record.kind==="ARTICLE")setArticles(rows=>rows.map(row=>row.id===result.record.id?{id:row.id,content:result.record.draft,publishedAt:result.record.publishedAt}:row));
      return result;
    }});
  }
  async function create() {
    if(busy||uploading||(dirty&&!await dialog.confirm({title:"Tạo bài mới?",message:"Các thay đổi chưa lưu sẽ bị bỏ.",confirmText:"Tạo bài",cancelText:"Ở lại"})))return;
    setPendingAction("create");setError("");
    await documentMutation.run({key:"document",action:async()=>{
      const result=await jsonRequest("/api/admin/storefront/content",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"create"})});
      await load(result.record.id);setTab("articles");return result;
    }});
  }
  const home = record?.kind === "HOME" ? (record.draft as HomeContent) : null;
  const article = record?.kind === "ARTICLE" ? (record.draft as ArticleContent) : null;
  const imageProps = { library, onUpload: upload, disabled: uploading || busy };
  function moveSection(from: number, to: number) {
    if (!home || to < 0 || to >= home.sections.length) return;
    const sections = [...home.sections];
    const [item] = sections.splice(from, 1);
    sections.splice(to, 0, item);
    edit({ ...home, sections });
  }
  return (
    <AdminPageCanvas className={`sfc ${homeOnly?"sfc-home":""}`}>
      <AdminPageHeader eyebrow="Website" title={homeOnly?"Trang chủ website":"Quản lý website"} description={homeOnly?"Chọn một khối để sửa. Lưu nháp → xem trước → xuất bản.":"Quản lý nội dung và hình ảnh website."} meta={<a href={storefrontUrl} target="_blank" rel="noreferrer" className="text-xs text-slate-500 hover:text-slate-950">Mở website ↗</a>}/>
      {!homeOnly && (
        <div className="sfc-tabs">
          <button
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
          </button>
          <button
            type="button"
            className={tab === "articles" ? "active" : ""}
            onClick={() => setTab("articles")}
          >
            Chuyện đồng hồ ({articles.length})
          </button>
        </div>
      )}
      {error ? (
        <div className="sfc-error" role="alert">
          {error}
          <button
            type="button"
            onClick={() => {
              void (async()=>{if(!dirty||await dialog.confirm({title:"Tải lại nội dung?",message:"Thay đổi chưa lưu sẽ bị bỏ.",confirmText:"Tải lại",cancelText:"Ở lại"}))void load(record?.id||"home");})();
            }}
          >
            Tải lại nội dung
          </button>
        </div>
      ) : null}
      {message ? (
        <p role="status" className="sfc-success">
          {message}
        </p>
      ) : null}
      {tab === "articles" ? (
        <section className="sfc-card">
          <div className="sfc-row">
            <h2>Bài viết</h2>
            <AsyncActionButton type="button" pending={busy&&pendingAction==="create"} pendingLabel="Đang tạo…" disabled={busy || uploading} onClick={() => void create()}>
              <Plus size={16} /> Tạo bài
            </AsyncActionButton>
          </div>
          <div className="sfc-article-list">
            {articles.length ? (
              articles.map((a) => (
                <button
                  type="button"
                  key={a.id}
                  className={record?.id === a.id ? "selected" : ""}
                  onClick={() => choose(a.id)}
                >
                  <strong>{a.content.title}</strong>
                  <span>
                    {a.publishedAt ? "Đã xuất bản · có thể có thay đổi nháp" : "Bản nháp"}
                  </span>
                </button>
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
          <AdminFlatToolbar className="sfc-toolbar">
            <div>
              <strong>{record.kind === "HOME" ? "Trang chủ" : article?.title}</strong>
              <small>
                {uploading?"Đang tải ảnh…":dirty ? "Có thay đổi chưa lưu" : "Đã lưu nháp"} · Phiên bản {record.revision}
                {record.publishedAt
                  ? ` · Xuất bản ${new Date(record.publishedAt).toLocaleString("vi-VN",{timeZone:"Asia/Ho_Chi_Minh"})}`
                  : " · Chưa xuất bản"}
              </small>
            </div>
            {needsReload&&<button type="button" disabled={busy||uploading} onClick={()=>{void (async()=>{if(!dirty||await dialog.confirm({title:"Tải lại bản mới?",message:"Thay đổi chưa lưu sẽ bị bỏ. Chọn Ở lại để giữ nội dung và thử lưu lại.",confirmText:"Tải lại",cancelText:"Ở lại"}))void load(record.id);})();}}>Tải lại bản mới</button>}
            <div className="sfc-actions">
              <AsyncActionButton type="button" pending={busy&&pendingAction==="save"} pendingLabel="Đang lưu…" disabled={busy || uploading} onClick={() => void save("save")}>
                <Save size={15} />
                Lưu nháp
              </AsyncActionButton>
              <AsyncActionButton
                type="button"
                pending={busy&&pendingAction==="preview"}
                pendingLabel="Đang mở…"
                disabled={busy || uploading}
                onClick={() => void save("save", true)}
              >
                <Eye size={15} />
                Xem trước
              </AsyncActionButton>
              <AsyncActionButton
                type="button"
                className="primary"
                pending={busy&&pendingAction==="publish"}
                pendingLabel="Đang xuất bản…"
                disabled={busy || uploading}
                onClick={() => void save("publish")}
              >
                <Globe size={15} />
                Xuất bản
              </AsyncActionButton>
              {record.publishedAt && !homeOnly ? (
                <button
                  type="button"
                  disabled={busy || uploading}
                  onClick={() => {
                    void (async()=>{if(await dialog.confirm({title:"Gỡ xuất bản?",message:"Nội dung đang công khai sẽ bị gỡ. Bản nháp được giữ.",confirmText:"Gỡ xuất bản",cancelText:"Hủy",tone:"danger"}))void save("unpublish");})();
                  }}
                >
                  Gỡ xuất bản
                </button>
              ) : null}
            </div>
          </AdminFlatToolbar>
          {home && homeImageGuidance(home).length > 0 && (
            <details className="sfc-guidance"><summary>{homeImageGuidance(home).length} lưu ý về cách hiển thị ảnh</summary>
              {homeImageGuidance(home).map(item=><button key={item.section} type="button" onClick={()=>{setActiveSection(item.section);requestAnimationFrame(()=>document.getElementById(`home-editor-${item.section}`)?.scrollIntoView({block:"start",behavior:"smooth"}));}}>{names[item.section]} · {item.message} <span aria-hidden>→</span></button>)}
            </details>
          )}
          <fieldset disabled={busy || uploading} className={`sfc-editor ${home&&homeOnly?"sfc-home-layout":""}`}>
            {home ? (
              <>
                <section className="sfc-section-nav" aria-label="Các khối trang chủ">
                  <h2>Các khối trang chủ</h2>
                  <p className="sfc-help">
                    Chọn khối để sửa · kéo để sắp xếp.
                  </p>
                  {homeOnly&&<div className="sfc-section-mobile">
                    <label className="sfc-field"><span>Khối đang sửa</span><select value={activeSection} onChange={event=>setActiveSection(event.target.value as HomeSectionId)}>{home.sections.map(section=><option key={section.id} value={section.id}>{names[section.id]}</option>)}</select></label>
                    <div className="sfc-row"><label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={home.sections.find(section=>section.id===activeSection)?.enabled||false} onChange={event=>edit({...home,sections:home.sections.map(section=>section.id===activeSection?{...section,enabled:event.target.checked}:section)})}/>Hiển thị khối</label><div className="flex gap-1"><button type="button" aria-label="Đưa khối đang sửa lên" disabled={home.sections[0].id===activeSection} onClick={()=>{const i=home.sections.findIndex(section=>section.id===activeSection);moveSection(i,i-1);}}><ArrowUp size={15}/></button><button type="button" aria-label="Đưa khối đang sửa xuống" disabled={home.sections.at(-1)?.id===activeSection} onClick={()=>{const i=home.sections.findIndex(section=>section.id===activeSection);moveSection(i,i+1);}}><ArrowDown size={15}/></button></div></div>
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
                      <button type="button" className="sfc-section-select" aria-current={activeSection===section.id?"true":undefined} aria-controls={`home-editor-${section.id}`} onClick={()=>{setActiveSection(section.id);if(window.matchMedia("(max-width: 900px)").matches)requestAnimationFrame(()=>document.getElementById(`home-editor-${section.id}`)?.scrollIntoView({block:"start",behavior:"smooth"}));}}><span>{names[section.id]}</span><small>{section.enabled?"Đang bật":"Đang ẩn"}</small></button>
                      <button
                        type="button"
                        disabled={!i}
                        aria-label={`Đưa ${names[section.id]} lên`}
                        onClick={() => moveSection(i, i - 1)}
                      >
                        <ArrowUp size={15} />
                      </button>
                      <button
                        type="button"
                        disabled={i === home.sections.length - 1}
                        aria-label={`Đưa ${names[section.id]} xuống`}
                        onClick={() => moveSection(i, i + 1)}
                      >
                        <ArrowDown size={15} />
                      </button>
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
                  <details className="sfc-advanced"><summary>Nút liên kết & chú thích</summary>
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
                  {!home.hero.image.key&&<p className="sfc-help">Đang dùng ảnh đồng hồ tự động từ danh mục. Bạn có thể giữ ảnh này và chỉ đổi tông màu.</p>}
                  <div className="sfc-grid">
                    <ImageField
                      {...imageProps}
                      label="Ảnh desktop"
                      value={home.hero.image}
                      onChange={(image) => edit({ ...home, hero: { ...home.hero, image } })}
                    />
                    <ImageField
                      {...imageProps}
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
                    label="Ảnh giới thiệu"
                    value={home.about.image}
                    onChange={(image) => edit({ ...home, about: { ...home.about, image } })}
                  />
                </HomeSection>
                <HomeSection id="collections" title="Bộ sưu tập theo phong cách" homeOnly={homeOnly} active={activeSection}>
                  {home.collections.map((collection, i) => (
                    <section className="sfc-collection" key={collection.id}>
                      <div className="sfc-row">
                        <h3>Bộ sưu tập {i + 1}</h3>
                        <button
                          type="button"
                          onClick={() =>
                            edit({
                              ...home,
                              collections: home.collections.filter((_, n) => n !== i),
                            })
                          }
                        >
                          Bỏ nhóm
                        </button>
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
                        label={`Ảnh nhóm ${i + 1}`}
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
                  <button
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
                  </button>
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
                    <summary>Thông tin chung & footer</summary>
                    <ImageField
                      {...imageProps}
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
                        <button
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
                        </button>
                      </div>
                    ))}
                    <button
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
                    </button>
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
                      label={`Ảnh trong bài ${i + 1}`}
                      value={image}
                      onChange={(value) =>
                        edit({
                          ...article,
                          images: article.images.map((v, n) => (n === i ? value : v)),
                        })
                      }
                    />
                    <button
                      type="button"
                      onClick={() =>
                        edit({
                          ...article,
                          images: article.images.filter((_, n) => n !== i),
                        })
                      }
                    >
                      Bỏ ảnh {i + 1}
                    </button>
                  </div>
                ))}
                <button
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
                </button>
                <h3>Đồng hồ liên quan</h3>
                <ProductPicker
                  ids={article.productIds}
                  onChange={(productIds) => edit({ ...article, productIds })}
                />
              </section>
            ) : null}
          </fieldset>
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
            <button type="button" onClick={() => setMobile(false)} aria-pressed={!mobile}>
              Desktop
            </button>
            <button type="button" onClick={() => setMobile(true)} aria-pressed={mobile}>
              Mobile
            </button>
            <a href={preview} target="_blank" rel="noreferrer">
              Mở riêng ↗
            </a>
            <button type="button" aria-label="Đóng xem trước" onClick={() => setPreview("")}>
              <X size={20} />
            </button>
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
