"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, KeyRound, Plus, Shield, X } from "lucide-react";

import { AdminManagementSection, AdminManagementButton as Button, ADMIN_MANAGEMENT as s } from "@/domains/shared/ui/admin-design-contract/AdminManagement";
import { useAppDialog } from "@/domains/shared/feedback/AppDialogProvider";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";

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

function UserEditor({ state, roles, busy, onChange, onClose, onSave }: {
    state: EditorState;
    roles: Role[];
    busy: boolean;
    onChange: (patch: Partial<EditorState>) => void;
    onClose: () => void;
    onSave: () => void;
}) {
    const selectedPermissions = useMemo(() => Array.from(new Set(
        roles.filter((role) => state.roleIds.includes(role.id)).flatMap((role) => role.permissions)
    )), [roles, state.roleIds]);

    function toggleRole(roleId: string) {
        onChange({ roleIds: state.roleIds.includes(roleId)
            ? state.roleIds.filter((id) => id !== roleId)
            : [...state.roleIds, roleId] });
    }

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30" role="dialog" aria-modal="true">
            <div className="flex h-full w-full max-w-xl flex-col bg-white shadow-2xl">
                <header className="flex items-start justify-between border-b px-6 py-5">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-950">{state.id ? "Chỉnh sửa người dùng" : "Tạo người dùng"}</h2>
                        <p className="mt-1 text-sm text-slate-500">Thông tin đăng nhập, trạng thái và phạm vi truy cập.</p>
                    </div>
                    <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-md border text-slate-500 hover:bg-slate-50" title="Đóng"><X size={17} /></button>
                </header>

                <div className="flex-1 space-y-7 overflow-y-auto px-6 py-6">
                    <section>
                        <h3 className="mb-3 text-xs font-semibold uppercase text-slate-500">Tài khoản</h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <label className="text-sm font-medium text-slate-700">Tên hiển thị
                                <input value={state.name} onChange={(e) => onChange({ name: e.target.value })} className="mt-1.5 h-10 w-full rounded-md border px-3 font-normal outline-none focus:border-slate-500" placeholder="Nguyễn Văn A" />
                            </label>
                            <label className="text-sm font-medium text-slate-700">Email
                                <input type="email" value={state.email} onChange={(e) => onChange({ email: e.target.value })} className="mt-1.5 h-10 w-full rounded-md border px-3 font-normal outline-none focus:border-slate-500" placeholder="user@company.com" />
                            </label>
                        </div>
                        <label className="mt-4 block text-sm font-medium text-slate-700">
                            {state.id ? "Mật khẩu mới" : "Mật khẩu"}
                            <div className="relative mt-1.5"><KeyRound className="absolute left-3 top-2.5 text-slate-400" size={17} /><input type="password" value={state.password} onChange={(e) => onChange({ password: e.target.value })} className="h-10 w-full rounded-md border pl-10 pr-3 font-normal outline-none focus:border-slate-500" placeholder={state.id ? "Để trống nếu không đổi" : "Tối thiểu 8 ký tự"} /></div>
                        </label>
                        <label className="mt-4 flex items-center justify-between border-y py-3 text-sm">
                            <span><b className="block text-slate-800">Tài khoản hoạt động</b><span className="text-xs text-slate-500">Cho phép đăng nhập và sử dụng hệ thống</span></span>
                            <input type="checkbox" checked={state.isActive} onChange={(e) => onChange({ isActive: e.target.checked })} className="h-5 w-5 accent-slate-900" />
                        </label>
                    </section>

                    <section>
                        <div className="mb-3 flex items-center justify-between"><h3 className="text-xs font-semibold uppercase text-slate-500">Role được gán</h3><span className="text-xs text-slate-500">{state.roleIds.length} role</span></div>
                        <div className="grid gap-2 sm:grid-cols-2">
                            {roles.map((role) => {
                                const checked = state.roleIds.includes(role.id);
                                return <button key={role.id} type="button" onClick={() => toggleRole(role.id)} className={`flex min-h-16 items-start gap-3 rounded-md border p-3 text-left transition-colors ${checked ? "border-violet-200 bg-violet-50/70" : "border-slate-200 hover:border-slate-400"}`}>
                                    <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded border ${checked ? "border-violet-500 bg-violet-500 text-white" : "border-slate-300 bg-white"}`}>{checked ? <Check size={13} /> : null}</span>
                                    <span><b className="block text-sm text-slate-900">{role.name}</b><span className="line-clamp-2 text-xs text-slate-500">{role.description || `${role.permissions.length} quyền`}</span></span>
                                </button>;
                            })}
                        </div>
                        <div className="mt-4 text-xs text-slate-500">Tổng quyền hiệu lực: <b className="text-slate-800">{selectedPermissions.length}</b></div>
                    </section>
                </div>

                <footer className="flex justify-end gap-2 border-t px-6 py-4">
                    <button type="button" onClick={onClose} disabled={busy} className="h-10 rounded-md border px-4 text-sm font-medium">Hủy</button>
                    <button type="button" onClick={onSave} disabled={busy} className="h-10 rounded-md bg-slate-950 px-4 text-sm font-medium text-white disabled:opacity-50">{busy ? "Đang lưu..." : state.id ? "Lưu thay đổi" : "Tạo tài khoản"}</button>
                </footer>
            </div>
        </div>
    );
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
    function openEditor(value: EditorState) { initial.current = JSON.stringify(value); setEditor(value); }
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
            notify.error("Vui lòng nhập email, mật khẩu hợp lệ và chọn ít nhất một role");
            return;
        }
        busyRef.current = true; setBusy(true);
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
            notify.error(error instanceof Error ? error.message : "Không thể lưu người dùng");
        } finally {
            busyRef.current = false; setBusy(false);
        }
    }

    return <AdminManagementSection title="Người dùng" description="Tài khoản, trạng thái và quyền truy cập nội bộ." actions={<>
        {canManageRoles && <Link href="/admin/users/roles" className={s.button}><Shield aria-hidden="true" />Role & quyền</Link>}
        {canCreate && <Button primary onClick={createUser}><Plus aria-hidden="true" />Tạo người dùng</Button>}
    </>}>
        <form data-admin-form action="/admin/users" className={s.toolbar} role="search">
            <label style={{ flex: "1 1 240px", minWidth: 0 }}><span className="sr-only">Tìm theo tên, email hoặc role</span><input type="search" name="q" defaultValue={currentQuery ?? ""} className={s.input} placeholder="Tìm theo tên, email hoặc role…" /></label>
            <Button type="submit">Tìm</Button>{currentQuery && <Link href="/admin/users" className={s.button}>Xóa tìm</Link>}
        </form>
        <p className={s.metadata}>{total.toLocaleString("vi-VN")} người dùng{currentQuery ? ` · Kết quả cho “${currentQuery}”` : ""}</p>
        {items.length ? <ul className={s.list} aria-label="Danh sách người dùng">{items.map(user => <li key={user.id} className={`${s.row} ${s.userRow}`}>
            <div><h3 className={s.rowTitle}>{user.name || "Chưa đặt tên"}</h3><p className={s.metadata}>{user.email}</p></div>
            <div className={s.metadata}>{user.roles.map(role => role.name).join(" · ") || "Chưa gán role"}</div>
            <div><p className={s.metadata}>{user.isActive ? "Hoạt động" : "Đã khóa"}</p><p className={s.metadata}>Cập nhật {dateText(user.updatedAt)}</p></div>
            {canUpdate && <Button aria-label={`Sửa ${user.name || user.email}`} onClick={() => editUser(user)}>Sửa</Button>}
        </li>)}</ul> : <p className={s.metadata}>{currentQuery ? "Không tìm thấy người dùng phù hợp." : "Chưa có người dùng."}</p>}
        <div className={s.footer}><p className={s.metadata}>Trang {page.toLocaleString("vi-VN")} / {totalPages.toLocaleString("vi-VN")}</p><div className={s.actions}>
            {page > 1 ? <Link href={pageHref(page - 1)} className={s.button}>Trước</Link> : <Button disabled>Trước</Button>}
            {page < totalPages ? <Link href={pageHref(page + 1)} className={s.button}>Sau</Link> : <Button disabled>Sau</Button>}
        </div></div>
        {editor && <UserEditor state={editor} roles={roles} busy={busy} onChange={patch => setEditor(current => current ? { ...current, ...patch } : current)} onClose={() => void closeEditor()} onSave={() => void saveUser()} />}
    </AdminManagementSection>;
}
