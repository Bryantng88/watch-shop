"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, ChevronLeft, ChevronRight, KeyRound, Pencil, Plus, Search, Shield, UserRound, X } from "lucide-react";

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
    return new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function initials(user: UserItem) {
    const source = user.name?.trim() || user.email;
    return source.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
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
    const [editor, setEditor] = useState<EditorState | null>(() =>
        rawSearchParams.create === "1"
            ? { email: "", name: "", password: "", roleIds: roles[0] ? [roles[0].id] : [], isActive: true }
            : null
    );
    const [busy, setBusy] = useState(false);
    const currentQuery = Array.isArray(rawSearchParams.q) ? rawSearchParams.q[0] : rawSearchParams.q;

    function pageHref(nextPage: number) {
        const params = paramsFromRecord(rawSearchParams);
        params.set("page", String(nextPage));
        return `/admin/users?${params.toString()}`;
    }

    function createUser() {
        setEditor({ email: "", name: "", password: "", roleIds: roles[0] ? [roles[0].id] : [], isActive: true });
    }

    function editUser(user: UserItem) {
        setEditor({ id: user.id, email: user.email, name: user.name ?? "", password: "", roleIds: user.roles.map((role) => role.id), isActive: user.isActive });
    }

    async function saveUser() {
        if (!editor) return;
        if (!editor.email.trim() || (!editor.id && editor.password.length < 8) || !editor.roleIds.length) {
            notify.error("Vui lòng nhập email, mật khẩu hợp lệ và chọn ít nhất một role");
            return;
        }
        setBusy(true);
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
            setBusy(false);
        }
    }

    return (
        <div className="min-h-full bg-slate-50/60">
            <header className="border-b bg-white px-5 py-5 lg:px-7">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div><h1 className="text-xl font-semibold text-slate-950">Người dùng</h1><p className="mt-1 text-sm text-slate-500">Quản lý tài khoản, trạng thái và quyền truy cập nội bộ.</p></div>
                    <div className="flex gap-2">
                        {canManageRoles ? <Link href="/admin/users/roles" className="inline-flex h-10 items-center gap-2 rounded-md border bg-white px-3 text-sm font-medium hover:bg-slate-50"><Shield size={16} /> Role & quyền</Link> : null}
                        {canCreate ? <button type="button" onClick={createUser} className="inline-flex h-10 items-center gap-2 rounded-md bg-slate-950 px-3 text-sm font-medium text-white"><Plus size={16} /> Tạo người dùng</button> : null}
                    </div>
                </div>
                <form action="/admin/users" className="mt-5 flex max-w-xl gap-2"><div className="relative flex-1"><Search className="absolute left-3 top-2.5 text-slate-400" size={17} /><input name="q" defaultValue={currentQuery ?? ""} className="h-10 w-full rounded-md border bg-white pl-10 pr-3 text-sm outline-none focus:border-slate-500" placeholder="Tìm theo tên, email hoặc role" /></div><button className="h-10 rounded-md border bg-white px-4 text-sm font-medium">Tìm</button>{currentQuery ? <Link href="/admin/users" className="grid h-10 w-10 place-items-center rounded-md border bg-white" title="Xóa bộ lọc"><X size={16} /></Link> : null}</form>
            </header>

            <main className="px-5 py-5 lg:px-7">
                <div className="overflow-hidden rounded-md border bg-white">
                    <div className="grid grid-cols-[minmax(260px,1.4fr)_minmax(190px,1fr)_120px_170px_52px] gap-4 border-b bg-slate-50 px-4 py-3 text-xs font-semibold uppercase text-slate-500"><span>Tài khoản</span><span>Role</span><span>Trạng thái</span><span>Cập nhật</span><span /></div>
                    {items.length ? items.map((user) => <div key={user.id} className="grid grid-cols-[minmax(260px,1.4fr)_minmax(190px,1fr)_120px_170px_52px] items-center gap-4 border-b px-4 py-3 last:border-0 hover:bg-slate-50/70">
                        <div className="flex min-w-0 items-center gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-slate-100 text-xs font-bold text-slate-600">{initials(user)}</span><span className="min-w-0"><b className="block truncate text-sm text-slate-900">{user.name || "Chưa đặt tên"}</b><span className="block truncate text-xs text-slate-500">{user.email}</span></span></div>
                        <div className="flex flex-wrap gap-1.5">{user.roles.map((role) => <span key={role.id} className="rounded border bg-white px-2 py-1 text-xs font-medium text-slate-700">{role.name}</span>)}</div>
                        <span className={`w-fit rounded px-2 py-1 text-xs font-semibold ${user.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{user.isActive ? "Hoạt động" : "Đã khóa"}</span>
                        <span className="text-xs text-slate-500">{dateText(user.updatedAt)}</span>
                        {canUpdate ? <button type="button" onClick={() => editUser(user)} className="grid h-9 w-9 place-items-center rounded-md border text-slate-600 hover:bg-white" title="Chỉnh sửa người dùng"><Pencil size={15} /></button> : null}
                    </div>) : <div className="grid place-items-center py-16 text-center"><UserRound className="mb-3 text-slate-300" size={32} /><p className="text-sm font-medium text-slate-700">Không tìm thấy người dùng</p></div>}
                </div>
                <div className="mt-4 flex items-center justify-between text-sm text-slate-500"><span>{total} người dùng · Trang {page}/{totalPages}</span><div className="flex gap-2"><Link href={pageHref(Math.max(1, page - 1))} aria-disabled={page <= 1} className={`grid h-9 w-9 place-items-center rounded-md border bg-white ${page <= 1 ? "pointer-events-none opacity-40" : ""}`} title="Trang trước"><ChevronLeft size={16} /></Link><Link href={pageHref(Math.min(totalPages, page + 1))} aria-disabled={page >= totalPages} className={`grid h-9 w-9 place-items-center rounded-md border bg-white ${page >= totalPages ? "pointer-events-none opacity-40" : ""}`} title="Trang sau"><ChevronRight size={16} /></Link></div></div>
            </main>
            {editor ? <UserEditor state={editor} roles={roles} busy={busy} onChange={(patch) => setEditor((current) => current ? { ...current, ...patch } : current)} onClose={() => !busy && setEditor(null)} onSave={saveUser} /> : null}
        </div>
    );
}
