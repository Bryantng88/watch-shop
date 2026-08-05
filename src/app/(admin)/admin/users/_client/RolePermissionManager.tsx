"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Plus, Save, Search, Shield, UsersRound, X } from "lucide-react";

import { useNotify } from "@/domains/shared/feedback/AppToastProvider";

type PermissionItem = { id: string; code: string; description: string | null };
type RoleItem = { id: string; name: string; description: string | null; permissions: PermissionItem[] };
type RoleDraft = { id?: string; name: string; description: string; permissionIds: string[] };

const EMPTY_ROLE: RoleDraft = { name: "", description: "", permissionIds: [] };

function permissionGroup(code: string) {
    const prefixes: Array<[string, string]> = [
        ["ORDER_PAYMENT_", "Thanh toán · Đơn bán"],
        ["ACQUISITION_PAYMENT_", "Thanh toán · Phiếu nhập"],
        ["SERVICE_PAYMENT_", "Thanh toán · Dịch vụ"],
        ["SHIPMENT_PAYMENT_", "Thanh toán · Vận chuyển"],
        ["PAYMENT_", "Thanh toán · Toàn bộ"],
        ["WATCH_ACQUISITION_", "Phiếu nhập · Đồng hồ"],
        ["ACCESSORY_ACQUISITION_", "Phiếu nhập · Phụ kiện"],
        ["ACQUISITION_", "Phiếu nhập · Toàn bộ"],
        ["ACCESSORY_", "Phụ kiện"], ["PRODUCT_", "Sản phẩm"], ["ORDER_", "Đơn hàng"], ["PAYMENT_", "Thanh toán"],
        ["SHIPMENT_", "Vận chuyển"], ["SERVICE_", "Dịch vụ"], ["TASK_", "Công việc"],
        ["USER_", "Người dùng"], ["CUSTOMER_", "Khách hàng"], ["MEDIA_", "Media"],
        ["ACTIVITY_", "Hoạt động"], ["SYSTEM_", "Hệ thống"], ["DASHBOARD_", "Dashboard"],
    ];
    return prefixes.find(([prefix]) => code.startsWith(prefix))?.[1] ?? "Khác";
}

export default function RolePermissionManager({ initialRoles, permissions }: {
    initialRoles: RoleItem[];
    permissions: PermissionItem[];
}) {
    const router = useRouter();
    const notify = useNotify();
    const [roles, setRoles] = useState(initialRoles);
    const [draft, setDraft] = useState<RoleDraft>(() => initialRoles[0]
        ? { id: initialRoles[0].id, name: initialRoles[0].name, description: initialRoles[0].description ?? "", permissionIds: initialRoles[0].permissions.map((item) => item.id) }
        : EMPTY_ROLE);
    const [query, setQuery] = useState("");
    const [busy, setBusy] = useState(false);

    const groups = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();
        return permissions.reduce<Record<string, PermissionItem[]>>((result, permission) => {
            if (normalizedQuery && !`${permission.code} ${permission.description ?? ""}`.toLowerCase().includes(normalizedQuery)) return result;
            (result[permissionGroup(permission.code)] ||= []).push(permission);
            return result;
        }, {});
    }, [permissions, query]);

    function selectRole(role: RoleItem) {
        setDraft({ id: role.id, name: role.name, description: role.description ?? "", permissionIds: role.permissions.map((permission) => permission.id) });
    }

    function togglePermission(permissionId: string) {
        setDraft((current) => ({ ...current, permissionIds: current.permissionIds.includes(permissionId)
            ? current.permissionIds.filter((id) => id !== permissionId)
            : [...current.permissionIds, permissionId] }));
    }

    function toggleGroup(items: PermissionItem[]) {
        const allSelected = items.every((item) => draft.permissionIds.includes(item.id));
        const ids = new Set(draft.permissionIds);
        items.forEach((item) => allSelected ? ids.delete(item.id) : ids.add(item.id));
        setDraft((current) => ({ ...current, permissionIds: Array.from(ids) }));
    }

    async function saveRole() {
        if (!draft.name.trim()) return notify.error("Tên role không được để trống");
        setBusy(true);
        try {
            const response = await fetch(draft.id ? `/api/admin/roles/${draft.id}` : "/api/admin/roles", {
                method: draft.id ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(draft),
            });
            const data = await response.json().catch(() => null);
            if (!response.ok) throw new Error(data?.message || data?.detail || "Không thể lưu role");
            if (Array.isArray(data?.roles)) {
                setRoles(data.roles);
                const saved = data.roles.find((role: RoleItem) => role.name === draft.name.trim().toUpperCase());
                if (saved) selectRole(saved);
            }
            notify.success(draft.id ? "Đã cập nhật role" : "Đã tạo role");
            router.refresh();
        } catch (error) {
            notify.error(error instanceof Error ? error.message : "Không thể lưu role");
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="min-h-full bg-slate-50/60">
            <header className="border-b bg-white px-5 py-5 lg:px-7">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-start gap-3"><span className="grid h-10 w-10 place-items-center rounded-md bg-slate-100 text-slate-700"><Shield size={19} /></span><div><h1 className="text-xl font-semibold text-slate-950">Role & quyền truy cập</h1><p className="mt-1 text-sm text-slate-500">Thiết lập phạm vi nghiệp vụ theo từng nhóm người dùng.</p></div></div>
                    <Link href="/admin/users" className="inline-flex h-10 items-center gap-2 rounded-md border bg-white px-3 text-sm font-medium hover:bg-slate-50"><ArrowLeft size={16} /> Người dùng</Link>
                </div>
            </header>

            <main className="grid min-h-[calc(100vh-180px)] grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)]">
                <aside className="border-r bg-white p-4">
                    <button type="button" onClick={() => setDraft(EMPTY_ROLE)} className="mb-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-slate-950 text-sm font-medium text-white"><Plus size={16} /> Tạo role mới</button>
                    <div className="space-y-1">
                        {roles.map((role) => <button key={role.id} type="button" onClick={() => selectRole(role)} className={`flex w-full items-center justify-between rounded-md px-3 py-3 text-left ${draft.id === role.id ? "bg-slate-100" : "hover:bg-slate-50"}`}><span className="min-w-0"><b className="block truncate text-sm text-slate-900">{role.name}</b><span className="text-xs text-slate-500">{role.permissions.length} quyền</span></span>{draft.id === role.id ? <Check size={16} className="text-slate-700" /> : null}</button>)}
                    </div>
                    <div className="mt-5 border-t pt-4 text-xs text-slate-500"><UsersRound size={15} className="mb-2" />Mỗi người dùng có thể được gán nhiều role. Quyền hiệu lực là tổng quyền từ các role đó.</div>
                </aside>

                <section className="min-w-0 px-5 py-5 lg:px-7">
                    <div className="flex flex-wrap items-end justify-between gap-4 border-b pb-5">
                        <div className="grid flex-1 gap-4 sm:grid-cols-2">
                            <label className="text-sm font-medium text-slate-700">Tên role<input value={draft.name} onChange={(e) => setDraft((current) => ({ ...current, name: e.target.value }))} className="mt-1.5 h-10 w-full rounded-md border bg-white px-3 font-normal outline-none focus:border-slate-500" placeholder="ACCESSORY_MANAGER" disabled={draft.name === "ADMIN"} /></label>
                            <label className="text-sm font-medium text-slate-700">Mô tả<input value={draft.description} onChange={(e) => setDraft((current) => ({ ...current, description: e.target.value }))} className="mt-1.5 h-10 w-full rounded-md border bg-white px-3 font-normal outline-none focus:border-slate-500" placeholder="Phạm vi trách nhiệm của role" /></label>
                        </div>
                        <button type="button" onClick={saveRole} disabled={busy} className="inline-flex h-10 items-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-medium text-white disabled:opacity-50"><Save size={16} /> {busy ? "Đang lưu..." : "Lưu role"}</button>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-semibold text-slate-900">Permission</h2><p className="text-xs text-slate-500">Đã chọn {draft.permissionIds.length}/{permissions.length} quyền</p></div><div className="relative w-full sm:w-80"><Search className="absolute left-3 top-2.5 text-slate-400" size={17} /><input value={query} onChange={(e) => setQuery(e.target.value)} className="h-10 w-full rounded-md border bg-white pl-10 pr-9 text-sm outline-none focus:border-slate-500" placeholder="Tìm permission" />{query ? <button type="button" onClick={() => setQuery("")} className="absolute right-2 top-2 grid h-6 w-6 place-items-center text-slate-400"><X size={14} /></button> : null}</div></div>

                    <div className="mt-5 space-y-5">
                        {Object.entries(groups).map(([group, items]) => {
                            const selected = items.filter((item) => draft.permissionIds.includes(item.id)).length;
                            return <div key={group} className="border-t pt-4 first:border-0 first:pt-0"><div className="mb-3 flex items-center justify-between"><div><h3 className="text-sm font-semibold text-slate-900">{group}</h3><span className="text-xs text-slate-500">{selected}/{items.length} đã chọn</span></div><button type="button" onClick={() => toggleGroup(items)} className="text-xs font-semibold text-slate-600 hover:text-slate-950">{selected === items.length ? "Bỏ chọn nhóm" : "Chọn cả nhóm"}</button></div><div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">{items.map((permission) => {
                                const checked = draft.permissionIds.includes(permission.id);
                                return <button key={permission.id} type="button" onClick={() => togglePermission(permission.id)} className={`flex min-h-16 items-start gap-3 rounded-md border p-3 text-left transition-colors ${checked ? "border-violet-200 bg-violet-50/70" : "border-slate-200 bg-white hover:border-slate-400"}`}><span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded border transition-colors ${checked ? "border-violet-500 bg-violet-500 text-white" : "border-slate-300 bg-white"}`}>{checked ? <Check size={13} /> : null}</span><span className="min-w-0"><b className={`block break-all font-mono text-xs ${checked ? "text-violet-950" : "text-slate-800"}`}>{permission.code}</b><span className={`mt-1 block text-xs ${checked ? "text-violet-700" : "text-slate-500"}`}>{permission.description || "Chưa có mô tả"}</span></span></button>;
                            })}</div></div>;
                        })}
                    </div>
                </section>
            </main>
        </div>
    );
}
