"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, RefreshCw, Search } from "lucide-react";
import { useAppDialog } from "@/domains/shared/feedback/AppDialogProvider";
import { AdminManagementPage, AdminManagementButton as Button, AdminManagementField as Field, ADMIN_MANAGEMENT as s } from "@/domains/shared/ui/admin-design-contract/AdminManagement";
import type { ContactKind, ContactPage, DirectoryContact } from "../shared/contact-directory";

type Draft = { id?: string; updatedAt?: string; name: string; phone: string; email: string; address: string };
const empty = (): Draft => ({ name: "", phone: "", email: "", address: "" });
const roleNames: Record<string,string> = { SUPPLIER: "Nhà cung cấp", SERVICE: "Dịch vụ", BOTH: "Cung cấp & dịch vụ", PRIVATE_SELLER: "Người bán cá nhân" };
export default function ContactDirectory({ kind, canCreate, canUpdate }: { kind: ContactKind; canCreate: boolean; canUpdate: boolean }) {
  const title = kind === "customers" ? "Khách hàng" : "Nhà cung cấp / Vendor";
  const dialog = useAppDialog();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<ContactPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [initial, setInitial] = useState("");
  const [saveError, setSaveError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string,string[]>>({});
  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false);
  const editor = useRef<HTMLFormElement>(null);
  const [message, setMessage] = useState("");
  const dirty = draft !== null && JSON.stringify(draft) !== initial;
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError("");
    void fetch(`/api/admin/contacts?${new URLSearchParams({ kind, q: query, page: String(page) })}`, { cache: "no-store", signal: controller.signal }).then(async response => {
      const value = await response.json();
      if (!response.ok) throw new Error(value.error || "Không tải được danh bạ.");
      if (!controller.signal.aborted) setData(value);
    }).catch(reason => { if (!controller.signal.aborted) setError(reason instanceof Error ? reason.message : "Không tải được danh bạ."); }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [kind, query, page, reload]);
  useEffect(() => {
    if (!dirty) return;
    const guard = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", guard); return () => window.removeEventListener("beforeunload", guard);
  }, [dirty]);
  const canLeave = useCallback(async () => !dirty || await dialog.confirm({ title: "Bỏ thay đổi chưa lưu?", message: "Nội dung liên hệ đang sửa chưa được lưu.", confirmText: "Bỏ thay đổi", cancelText: "Tiếp tục sửa" }), [dirty, dialog]);
  useEffect(() => {
    if (!dirty) return;
    const navigate = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !(event.target instanceof Element)) return;
      const link = event.target.closest<HTMLAnchorElement>("a[href]");
      if (!link || link.hasAttribute("download") || (link.target && link.target !== "_self")) return;
      const destination = new URL(link.href, window.location.href);
      if (destination.origin !== window.location.origin || (destination.pathname === window.location.pathname && destination.search === window.location.search)) return;
      event.preventDefault(); event.stopImmediatePropagation();
      if (savingRef.current) return;
      void (async () => { if (await canLeave()) { setDraft(null); router.push(destination.pathname + destination.search + destination.hash); } })();
    };
    document.addEventListener("click", navigate, true);
    return () => document.removeEventListener("click", navigate, true);
  }, [dirty, canLeave, router]);
  async function open(item?: DirectoryContact) {
    if (savingRef.current || !await canLeave()) return;
    const value = item ? { id: item.id, updatedAt: item.updatedAt, name: item.name, phone: item.phone || "", email: item.email || "", address: item.address || "" } : empty();
    setDraft(value); setInitial(JSON.stringify(value)); setSaveError(""); setFieldErrors({}); setMessage("");
    requestAnimationFrame(() => { editor.current?.scrollIntoView({ block: "nearest" }); editor.current?.querySelector<HTMLInputElement>("input")?.focus(); });
  }
  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (!draft || savingRef.current) return;
    savingRef.current = true; setSaving(true); setSaveError(""); setFieldErrors({});
    try {
      const response = await fetch("/api/admin/contacts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind, ...draft }) });
      const result = await response.json();
      if (!response.ok) { setFieldErrors(result.fields || {}); requestAnimationFrame(() => editor.current?.querySelector<HTMLInputElement>('[aria-invalid="true"]')?.focus()); throw new Error(result.error || "Không lưu được liên hệ."); }
      setDraft(null); setMessage("Đã lưu thông tin liên hệ."); setReload(value => value + 1);
    } catch (reason) { setSaveError(reason instanceof Error ? reason.message : "Không lưu được liên hệ."); }
    finally { savingRef.current = false; setSaving(false); }
  }
  return <AdminManagementPage eyebrow="Danh bạ" title={title} description="Thông tin liên hệ dùng chung trong giao dịch và vận hành." actions={canCreate && <Button primary disabled={saving} onClick={() => void open()}><Plus aria-hidden="true" />Thêm {kind === "customers" ? "khách hàng" : "vendor"}</Button>}>
    <form data-admin-form className={s.toolbar} role="search" onSubmit={event => { event.preventDefault(); setData(null); setPage(1); setQuery(search.trim()); setReload(v => v + 1); }}>
      <label style={{ flex: "1 1 240px", minWidth: 0 }}><span className="sr-only">Tìm tên, điện thoại hoặc email</span><input className={s.input} type="search" value={search} maxLength={200} placeholder="Tìm tên, điện thoại hoặc email…" onChange={event => setSearch(event.target.value)} /></label>
      <Button type="submit"><Search aria-hidden="true" />Tìm</Button>
      {(search || query) && <Button onClick={() => { setData(null); setSearch(""); setQuery(""); setPage(1); setReload(v => v + 1); }}>Xóa tìm</Button>}
      <Button disabled={loading} aria-label="Tải lại danh bạ" onClick={() => setReload(v => v + 1)}><RefreshCw aria-hidden="true" /></Button>
    </form>
    {message && <p role="status" className={s.metadata}>{message}</p>}
    {draft && <form ref={editor} data-admin-form className={`${s.form} ${s.editor}`} aria-label={draft.id ? "Sửa liên hệ" : "Thêm liên hệ"} onSubmit={event => void save(event)}>
      <h2 className={s.sectionTitle}>{draft.id ? `Sửa ${draft.name}` : "Thêm liên hệ"}</h2>
      <fieldset disabled={saving}><div className={s.grid}>
        {([['name','Tên liên hệ'],['phone','Số điện thoại'],['email','Email'],['address','Địa chỉ']] as const).map(([key,label]) => <Field key={key} label={label} type={key === "email" ? "email" : key === "phone" ? "tel" : "text"} required={key === "name" || (kind === "customers" && key === "phone")} maxLength={key === "name" ? 200 : key === "phone" ? 32 : key === "email" ? 254 : 1000} value={draft[key]} error={fieldErrors[key]?.[0]} onChange={event => setDraft({ ...draft, [key]: event.target.value })} />)}
      </div></fieldset>
      {saveError && <p role="alert" className={s.error}>{saveError} {draft.id && <Button disabled={saving} onClick={() => { setReload(v => v + 1); setMessage("Đã yêu cầu tải lại danh sách. Bản đang sửa vẫn được giữ để đối chiếu."); }}>Tải lại danh sách</Button>}</p>}
      <div className={s.actions}><Button disabled={saving} onClick={() => { void (async () => { if (await canLeave()) setDraft(null); })(); }}>Hủy</Button><Button type="submit" primary pending={saving} pendingLabel="Đang lưu…">Lưu liên hệ</Button></div>
    </form>}
    {!canCreate && !canUpdate && <p className={s.metadata}>Chỉ xem · Bạn có thể tra cứu thông tin liên hệ.</p>}
    {error && <div role="alert" className={s.errorBox}>{error}<Button onClick={() => setReload(v => v + 1)}>Thử lại</Button></div>}
    {loading && <p role="status" className={s.metadata}>Đang tải danh bạ…</p>}
    {!error && data && <>
      <p className={s.metadata}>{data.total.toLocaleString("vi-VN")} liên hệ{query ? ` · Kết quả cho “${query}”` : ""}</p>
      {!data.items.length ? <p className={s.metadata}>{query ? "Không có liên hệ phù hợp." : "Chưa có liên hệ trong danh bạ."}</p> : <ul className={s.list} aria-label="Danh sách liên hệ" aria-busy={loading}>
        {data.items.map(item => <li className={s.row} key={item.id}>
          <div><h2 className={s.rowTitle}>{item.name}</h2>{item.role && <p className={s.metadata}>{roleNames[item.role] || item.role}{item.isActive === false ? " · Ngừng hoạt động" : ""}</p>}</div>
          <div>{item.phone ? <a href={`tel:${item.phone}`} className="text-sm">{item.phone}</a> : <p className={s.metadata}>Chưa có điện thoại</p>}<p className={s.metadata}>{item.email || "Chưa có email"}</p></div>
          <div className={s.metadata}>{item.address || "Chưa có địa chỉ"}</div>
          {canUpdate && <Button disabled={saving} aria-label={`Sửa ${item.name}`} onClick={() => void open(item)}>Sửa</Button>}
        </li>)}
      </ul>}
      <div className={s.footer}><p className={s.metadata}>Trang {page.toLocaleString("vi-VN")} / {Math.max(1,Math.ceil(data.total/data.pageSize)).toLocaleString("vi-VN")}</p><div className={s.actions}><Button disabled={loading || page <= 1} onClick={() => { setData(null); setPage(p => p - 1); }}>Trước</Button><Button disabled={loading || page * data.pageSize >= data.total} onClick={() => { setData(null); setPage(p => p + 1); }}>Sau</Button></div></div>
    </>}
  </AdminManagementPage>;
}
