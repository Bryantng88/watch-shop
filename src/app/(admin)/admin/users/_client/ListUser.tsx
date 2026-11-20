"use client";
import { AdminListFooter } from "@/domains/shared/ui/admin-design-contract/AdminListFooter";
import { AdminLinkAction } from "@/domains/shared/ui/admin-design-contract/AdminLinkAction";


import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useRouter } from "next/navigation";
import { AdminRefreshAction } from "@/domains/shared/ui/admin-design-contract/AdminToolbarControls";
import { Plus, Shield } from "lucide-react";

import { AdminManagementSection, AdminManagementField as Field, AdminManagementButton as Button, ADMIN_MANAGEMENT as s } from "@/domains/shared/ui/admin-design-contract/AdminManagement";
import { useAppDialog } from "@/domains/shared/feedback/AppDialogProvider";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";

import { PageNotice, PageEditingState } from "@/domains/shared/feedback/PageFeedback";
import { uiFeedbackMessage } from "@/domains/shared/feedback/read-ui-response";
import { AdminUserAvatar } from "@/domains/shared/ui/admin-design-contract/AdminUserAvatar";

type Role = { id: string; name: string; description: string | null; permissions: string[] };
type UserItem = {
    id: string;
    email: string;
    name: string | null;
    roles: Array<{ id: string; name: string }>;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
};
type EditorState = {
    id?: string;
    email: string;
    name: string;
    password: string;
    roleIds: string[];
    isActive: boolean;
};
type PageProps = {
    items: UserItem[];
    roles: Role[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    rawSearchParams: Record<string, string | string[] | undefined>;
    canCreate: boolean;
    canUpdate: boolean;
    canManageRoles: boolean;
};

function dateText(value: string) {
    return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Ho_Chi_Minh" }).format(new Date(value));
}

function paramsFromRecord(raw: PageProps["rawSearchParams"]) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(raw)) {
        if (Array.isArray(value)) value.forEach((item) => params.append(key, item));
        else if (value !== undefined) params.set(key, value);
    }
    return params;
}

function UserEditor({ state, roles, busy, dirty, error, onChange, onClose, onSave }: {
    state: EditorState; roles: Role[]; busy: boolean; dirty: boolean; error: string;
    onChange: (patch: Partial<EditorState>) => void; onClose: () => void; onSave: () => void;
}) {
    const editorRef = useRef<HTMLFormElement>(null);
    useEffect(() => { editorRef.current?.scrollIntoView({ block: "nearest" }); editorRef.current?.querySelector<HTMLInputElement>("input")?.focus(); }, [state.id]);
    const selectedPermissions = useMemo(() => new Set(roles.filter(role => state.roleIds.includes(role.id)).flatMap(role => role.permissions)).size, [roles, state.roleIds]);
    return <form ref={editorRef} data-admin-form className={`${s.form} ${s.editor}`} aria-label={state.id ? "Chỉnh sửa người dùng" : "Tạo người dùng"} onSubmit={event => { event.preventDefault(); onSave(); }}>
        <div className={s.editorHeading}><h3 className={s.sectionTitle}>{state.id ? "Chỉnh sửa người dùng" : "Tạo người dùng"}</h3><PageEditingState dirty={dirty} saving={busy} /></div>
        <fieldset disabled={busy} className={s.form}>
            <div className={s.grid}>
                <Field label="Tên hiển thị" value={state.name} onChange={event => onChange({ name: event.target.value })} autoComplete="off" />
                <Field label="Email (bắt buộc)" type="email" required value={state.email} onChange={event => onChange({ email: event.target.value })} autoComplete="off" />
                <Field label={state.id ? "Mật khẩu mới (để trống nếu giữ nguyên)" : "Mật khẩu (bắt buộc)"} type="password" required={!state.id} minLength={8} value={state.password} onChange={event => onChange({ password: event.target.value })} autoComplete="new-password" />
            </div>
            <label className={s.checkRow}><input type="checkbox" checked={state.isActive} onChange={event => onChange({ isActive: event.target.checked })} /><span><strong>Tài khoản hoạt động</strong><span className={s.metadata}>Cho phép đăng nhập và sử dụng hệ thống.</span></span></label>
            <div className={s.editorHeading}><h3 className={s.sectionTitle}>Vai trò truy cập</h3><span className={s.metadata}>{state.roleIds.length} vai trò · {selectedPermissions} quyền hiệu lực</span></div>
            <div className={s.checkList}>{roles.map(role => <label key={role.id} className={s.checkRow}><input type="checkbox" checked={state.roleIds.includes(role.id)} onChange={event => onChange({ roleIds: event.target.checked ? [...state.roleIds, role.id] : state.roleIds.filter(id => id !== role.id) })} /><span><strong>{role.name}</strong><span className={s.metadata}>{role.description || `${role.permissions.length} quyền`}</span></span></label>)}</div>
        </fieldset>
        {error && <PageNotice title="Không thể lưu người dùng">{error}</PageNotice>}
        <div className={s.actions}><Button disabled={busy} onClick={onClose}>Hủy</Button><Button type="submit" primary pending={busy} pendingLabel="Đang lưu…">{state.id ? "Lưu thay đổi" : "Tạo tài khoản"}</Button></div>
    </form>;
}

export default function UserListPageClient(props: PageProps) {
    const { items, roles, total, page, totalPages, rawSearchParams, canCreate, canUpdate, canManageRoles } = props;
    const router = useRouter();
    const notify = useNotify();
    const dialog = useAppDialog();
    const [editor, setEditor] = useState<EditorState | null>(() =>
        canCreate && rawSearchParams.create === "1"
            ? { email: "", name: "", password: "", roleIds: roles[0] ? [roles[0].id] : [], isActive: true }
            : null
    );
    const [busy, setBusy] = useState(false);
    const [saveError, setSaveError] = useState("");
    const busyRef = useRef(false);
    const initial = useRef(JSON.stringify(editor));
    const dirty = editor !== null && JSON.stringify(editor) !== initial.current;
    const canLeave = useCallback(async () => !busyRef.current && (!dirty || await dialog.confirm({ title: "Bỏ thay đổi chưa lưu?", message: "Thông tin người dùng đang sửa chưa được lưu.", confirmText: "Bỏ thay đổi", cancelText: "Tiếp tục sửa" })), [dirty, dialog]);
    useEffect(() => {
        if (!dirty) return;
        const guard = (event: BeforeUnloadEvent) => event.preventDefault();
        window.addEventListener("beforeunload", guard);
        return () => window.removeEventListener("beforeunload", guard);
    }, [dirty]);
    useEffect(() => {
        if (!editor) return;
        const navigate = (event: MouseEvent) => {
            if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !(event.target instanceof Element)) return;
            const link = event.target.closest<HTMLAnchorElement>("a[href]");
            if (!link || link.hasAttribute("download") || (link.target && link.target !== "_self")) return;
            const destination = new URL(link.href, location.href);
            if (destination.origin !== location.origin || (destination.pathname === location.pathname && destination.search === location.search)) return;
            event.preventDefault(); event.stopImmediatePropagation();
            void (async () => { if (await canLeave()) { setEditor(null); router.push(destination.pathname + destination.search + destination.hash); } })();
        };
        document.addEventListener("click", navigate, true);
        return () => document.removeEventListener("click", navigate, true);
    }, [editor, canLeave, router]);
    async function openEditor(value: EditorState) { if (!await canLeave()) return; initial.current = JSON.stringify(value); setSaveError(""); setEditor(value); }
    async function closeEditor() { if (await canLeave()) setEditor(null); }

    const currentQuery = Array.isArray(rawSearchParams.q) ? rawSearchParams.q[0] : rawSearchParams.q;

    function pageHref(nextPage: number) {
        const params = paramsFromRecord(rawSearchParams);
        params.set("page", String(nextPage));
        return `/admin/users?${params.toString()}`;
    }

    function createUser() {
        openEditor({ email: "", name: "", password: "", roleIds: roles[0] ? [roles[0].id] : [], isActive: true });
    }

    function editUser(user: UserItem) {
        openEditor({ id: user.id, email: user.email, name: user.name ?? "", password: "", roleIds: user.roles.map((role) => role.id), isActive: user.isActive });
    }

    async function saveUser() {
        if (!editor || busyRef.current) return;
        if (!editor.email.trim() || (!editor.id && editor.password.length < 8) || !editor.roleIds.length) {
            setSaveError("Vui lòng nhập email, mật khẩu tối thiểu 8 ký tự và chọn ít nhất một vai trò.");
            return;
        }
        busyRef.current = true; setBusy(true); setSaveError("");
        try {
            const response = await fetch(editor.id ? `/api/admin/users/${editor.id}` : "/api/admin/users", {
                method: editor.id ? "PATCH" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editor),
            });
            const data = await response.json().catch(() => null);
            if (!response.ok) throw new Error(data?.message || "Không thể lưu người dùng");
            notify.success(editor.id ? "Đã cập nhật người dùng" : "Đã tạo người dùng");
            setEditor(null);
            router.refresh();
        } catch (error) {
            setSaveError(uiFeedbackMessage(error, "Không thể lưu người dùng. Vui lòng thử lại."));
        } finally {
            busyRef.current = false; setBusy(false);
        }
    }

    return <AdminManagementSection title="Người dùng" actions={<>
        {canManageRoles && <AdminLinkAction variant="secondary" href="/admin/users/roles" className={s.button}><Shield aria-hidden="true" /><span>Vai trò & quyền</span></AdminLinkAction>}
        {canCreate && <Button primary onClick={createUser}><Plus aria-hidden="true" />Tạo người dùng</Button>}
    </>}>
        <form data-admin-form action="/admin/users" className={`${s.toolbar} ${s.plainToolbar}`} role="search">
            <label className={s.searchField}><span className="sr-only">Tìm theo tên, email hoặc vai trò</span><input type="search" name="q" defaultValue={currentQuery ?? ""} className={s.input} placeholder="Tìm theo tên, email hoặc vai trò…" /></label>
            <Button type="submit">Tìm</Button>{currentQuery && <AdminLinkAction variant="secondary" href="/admin/users" className={s.button}>Xóa tìm</AdminLinkAction>}
            <span className={`${s.metadata} ${s.resultCount}`} role="status">{total.toLocaleString("vi-VN")} người dùng</span>
            <AdminRefreshAction onRefresh={() => router.refresh()} />
        </form>
        {editor && <UserEditor key={editor.id || "new"} state={editor} roles={roles} busy={busy} dirty={dirty} error={saveError} onChange={patch => setEditor(current => current ? { ...current, ...patch } : current)} onClose={() => void closeEditor()} onSave={() => void saveUser()} />}
        <div aria-hidden="true" className={`${s.columnHeader} ${s.userRow}`}><span>Người dùng</span><span>Vai trò</span><span>Trạng thái</span><span>{canUpdate ? "Thao tác" : ""}</span></div>
        {items.length ? <ul className={s.list} aria-label="Danh sách người dùng">{items.map(user => <li key={user.id} className={`${s.row} ${s.userRow}`}>
            <div className={s.identity}><AdminUserAvatar user={user} size="sm" /><div><h3 className={s.rowTitle}>{user.name || "Chưa đặt tên"}</h3><p className={`${s.metadata} ${s.secondaryText}`} title={user.email}>{user.email}</p></div></div>
            <div className={`${s.metadata} ${s.roleList}`}>{user.roles.length ? user.roles.map(role => <span key={role.id} title={role.name}>{role.name}</span>) : "Chưa gán vai trò"}</div>
            <div><p className={`${s.metadata} ${s.status}`} data-active={user.isActive}>{user.isActive ? "Hoạt động" : "Đã khóa"}</p><p className={s.metadata}>Cập nhật {dateText(user.updatedAt)}</p></div>
            {canUpdate && <Button className={s.rowAction} aria-label={`Sửa ${user.name || user.email}`} onClick={() => editUser(user)}>Sửa</Button>}
        </li>)}</ul> : <p className={s.metadata}>{currentQuery ? "Không tìm thấy người dùng phù hợp." : "Chưa có người dùng."}</p>}
        <AdminListFooter total={total} unit="người dùng" page={page} totalPages={totalPages} previousHref={pageHref(Math.max(1,page-1))} nextHref={pageHref(Math.min(totalPages,page+1))} />
    </AdminManagementSection>;
}
