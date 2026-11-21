"use client";
import { AdminListFooter } from "@/domains/shared/ui/admin-design-contract/AdminListFooter";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminRefreshAction } from "@/domains/shared/ui/admin-design-contract/AdminToolbarControls";
import { Plus, Search } from "lucide-react";
import { useAppDialog } from "@/domains/shared/feedback/AppDialogProvider";
import { AdminManagementSection, AdminManagementButton as Button, AdminManagementField as Field, ADMIN_MANAGEMENT as s } from "@/domains/shared/ui/admin-design-contract/AdminManagement";
import type { ContactKind, ContactPage, DirectoryContact } from "../shared/contact-directory";

import { PageNotice, PageEditingState } from "@/domains/shared/feedback/PageFeedback";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";
import { uiFeedbackMessage } from "@/domains/shared/feedback/read-ui-response";

type Draft = { id?: string; updatedAt?: string; name: string; phone: string; email: string; address: string };
const empty = (): Draft => ({ name: "", phone: "", email: "", address: "" });
const roleNames: Record<string,string> = { SUPPLIER: "Nhà cung cấp", SERVICE: "Dịch vụ", BOTH: "Cung cấp & dịch vụ", PRIVATE_SELLER: "Người bán cá nhân" };
export default function ContactDirectory({ kind, canCreate, canUpdate }: { kind: ContactKind; canCreate: boolean; canUpdate: boolean }) {
  const title = kind === "customers" ? "Khách hàng" : "Nhà cung cấp";
  const dialog = useAppDialog();
  const notify = useNotify();
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
      const value = await response.json().catch(() => { throw new Error("Không tải được danh bạ. Vui lòng thử lại."); });
      if (!response.ok) throw new Error(value.error || "Không tải được danh bạ.");
      if (!controller.signal.aborted) setData(value);
    }).catch(reason => { if (!controller.signal.aborted) setError(uiFeedbackMessage(reason, "Không tải được danh bạ. Vui lòng thử lại.")); }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
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
      const result = await response.json().catch(() => { throw new Error("Không lưu được liên hệ. Vui lòng thử lại."); });
      if (!response.ok) { setFieldErrors(result.fields || {}); requestAnimationFrame(() => editor.current?.querySelector<HTMLInputElement>('[aria-invalid="true"]')?.focus()); throw new Error(result.error || "Không lưu được liên hệ."); }
      setDraft(null); notify.success("Đã lưu thông tin liên hệ."); setReload(value => value + 1);
    } catch (reason) { setSaveError(uiFeedbackMessage(reason, "Không lưu được liên hệ. Vui lòng thử lại.")); }
    finally { savingRef.current = false; setSaving(false); }
  }
  return <AdminManagementSection title={title} actions={canCreate && <Button primary disabled={saving} onClick={() => void open()}><Plus aria-hidden="true" />Thêm {kind === "customers" ? "khách hàng" : "nhà cung cấp"}</Button>}>
    <form data-admin-form className={`${s.toolbar} ${s.plainToolbar}`} role="search" onSubmit={event => { event.preventDefault(); setData(null); setPage(1); setQuery(search.trim()); setReload(v => v + 1); }}>
      <label className={s.searchField}><span className="sr-only">Tìm tên, điện thoại hoặc email</span><input className={s.input} type="search" value={search} maxLength={200} placeholder="Tìm tên, điện thoại hoặc email…" onChange={event => setSearch(event.target.value)} /></label>
      <Button type="submit"><Search aria-hidden="true" />Tìm</Button>
      {(search || query) && <Button onClick={() => { setData(null); setSearch(""); setQuery(""); setPage(1); setReload(v => v + 1); }}>Xóa tìm</Button>}
      <span className={`${s.metadata} ${s.resultCount}`} role="status">{loading ? "Đang tải…" : data ? `${data.total.toLocaleString("vi-VN")} liên hệ` : "—"}</span>
      <AdminRefreshAction loading={loading} label="Làm mới danh bạ" onRefresh={() => setReload(v => v + 1)} />
    </form>
    {message && <p role="status" className={s.metadata}>{message}</p>}
    {draft && <form ref={editor} data-admin-form className={`${s.form} ${s.editor}`} aria-label={draft.id ? "Sửa liên hệ" : "Thêm liên hệ"} onSubmit={event => void save(event)}>
      <div className={s.editorHeading}><h3 className={s.sectionTitle}>{draft.id ? `Sửa ${draft.name}` : "Thêm liên hệ"}</h3><PageEditingState dirty={dirty} saving={saving} /></div>
      <fieldset disabled={saving}><div className={s.grid}>
        {([['name','Tên liên hệ'],['phone','Số điện thoại'],['email','Email'],['address','Địa chỉ']] as const).map(([key,label]) => <Field key={key} label={label} type={key === "email" ? "email" : key === "phone" ? "tel" : "text"} required={key === "name" || (kind === "customers" && key === "phone")} maxLength={key === "name" ? 200 : key === "phone" ? 32 : key === "email" ? 254 : 1000} value={draft[key]} error={fieldErrors[key]?.[0]} onChange={event => setDraft({ ...draft, [key]: event.target.value })} />)}
      </div></fieldset>
      {saveError && <p role="alert" className={s.error}>{saveError} {draft.id && <Button disabled={saving} onClick={() => { setReload(v => v + 1); setMessage("Đã yêu cầu tải lại danh sách. Bản đang sửa vẫn được giữ để đối chiếu."); }}>Tải lại danh sách</Button>}</p>}
      <div className={s.actions}><Button disabled={saving} onClick={() => { void (async () => { if (await canLeave()) setDraft(null); })(); }}>Hủy</Button><Button type="submit" primary pending={saving} pendingLabel="Đang lưu…">Lưu liên hệ</Button></div>
    </form>}
    {!canCreate && !canUpdate && <p className={s.metadata}>Chỉ xem · Bạn có thể tra cứu thông tin liên hệ.</p>}
    {error && <PageNotice title="Không tải được danh bạ" action={<Button onClick={() => setReload(v => v + 1)}>Thử lại</Button>}>{error}</PageNotice>}
    {loading && <p role="status" className={s.metadata}>Đang tải danh bạ…</p>}
    {!error && data && <>
      <div className={s.columnHeader} aria-hidden="true"><span>Liên hệ</span><span>Điện thoại / Email</span><span>Địa chỉ</span><span>{canUpdate ? "Thao tác" : ""}</span></div>
      {!data.items.length ? <p className={s.metadata}>{query ? "Không có liên hệ phù hợp." : "Chưa có liên hệ trong danh bạ."}</p> : <ul className={s.list} aria-label="Danh sách liên hệ" aria-busy={loading}>
        {data.items.map(item => <li className={s.row} key={item.id}>
          <div><h3 className={s.rowTitle}>{item.name}</h3>{item.role && <p className={s.metadata}>{roleNames[item.role] || item.role}{item.isActive === false ? " · Ngừng hoạt động" : ""}</p>}</div>
          <div>{item.phone ? <a href={`tel:${item.phone}`} className="text-sm">{item.phone}</a> : <p className={s.metadata}>Chưa có điện thoại</p>}<p className={s.metadata}>{item.email || "—"}</p></div>
          <div className={s.metadata}>{item.address || "—"}</div>
          {canUpdate && <Button className={s.rowAction} disabled={saving} aria-label={`Sửa ${item.name}`} onClick={() => void open(item)}>Sửa</Button>}
        </li>)}
      </ul>}
      <AdminListFooter total={data.total} unit="liên hệ" page={page} totalPages={Math.max(1,Math.ceil(data.total/data.pageSize))} pending={loading} onPrevious={() => { setData(null); setPage(p => p - 1); }} onNext={() => { setData(null); setPage(p => p + 1); }} />
    </>}
  </AdminManagementSection>;
}
