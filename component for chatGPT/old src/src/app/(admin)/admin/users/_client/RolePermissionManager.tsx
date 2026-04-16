"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useNotify } from "@/components/feedback/AppToastProvider";

type PermissionItem = {
    id: string;
    code: string;
    description: string | null;
};

type RoleItem = {
    id: string;
    name: string;
    description: string | null;
    permissions: PermissionItem[];
};

type FormState = {
    id?: string;
    name: string;
    description: string;
    permissionIds: string[];
};

function groupPermissions(items: PermissionItem[]) {
    return items.reduce<Record<string, PermissionItem[]>>((acc, p) => {
        const group = p.code.split("_")[0] || "OTHER";
        (acc[group] ||= []).push(p);
        return acc;
    }, {});
}

function PermissionChip({ code }: { code: string }) {
    return <span className="rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-700">{code}</span>;
}

function RoleEditor({
    open,
    title,
    form,
    permissions,
    onClose,
    onToggle,
    onChange,
    onSubmit,
    submitting,
}: {
    open: boolean;
    title: string;
    form: FormState;
    permissions: PermissionItem[];
    onClose: () => void;
    onToggle: (permissionId: string) => void;
    onChange: (patch: Partial<FormState>) => void;
    onSubmit: () => void;
    submitting: boolean;
}) {
    if (!open) return null;

    const groups = groupPermissions(permissions);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
            <div className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b px-5 py-4">
                    <div>
                        <h2 className="text-lg font-semibold">{title}</h2>
                        <p className="text-sm text-gray-500">Quản lý role và quyền truy cập chi tiết.</p>
                    </div>
                    <button type="button" onClick={onClose} className="rounded border px-3 py-1.5 text-sm hover:bg-gray-50">
                        Đóng
                    </button>
                </div>

                <div className="max-h-[calc(90vh-76px)] overflow-y-auto p-5 space-y-5">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="text-xs text-gray-600">Tên role</label>
                            <input
                                className="mt-1 h-10 w-full rounded border px-3"
                                value={form.name}
                                onChange={(e) => onChange({ name: e.target.value })}
                                placeholder="TECHNICIAN"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-600">Mô tả</label>
                            <input
                                className="mt-1 h-10 w-full rounded border px-3"
                                value={form.description}
                                onChange={(e) => onChange({ description: e.target.value })}
                                placeholder="Mô tả role"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <div className="text-sm font-medium">Quyền truy cập</div>
                            <div className="text-xs text-gray-500 mt-1">Chọn các permission áp dụng cho role này.</div>
                        </div>

                        {Object.entries(groups).map(([group, items]) => (
                            <div key={group} className="rounded-lg border p-4">
                                <div className="mb-3 flex items-center justify-between">
                                    <div className="font-medium">{group}</div>
                                    <div className="text-xs text-gray-500">{items.length} quyền</div>
                                </div>
                                <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                                    {items.map((p) => {
                                        const checked = form.permissionIds.includes(p.id);
                                        return (
                                            <label key={p.id} className="flex items-start gap-2 rounded border p-2 hover:bg-gray-50">
                                                <input
                                                    type="checkbox"
                                                    className="mt-1"
                                                    checked={checked}
                                                    onChange={() => onToggle(p.id)}
                                                />
                                                <div>
                                                    <div className="text-sm font-medium">{p.code}</div>
                                                    {p.description ? <div className="text-xs text-gray-500">{p.description}</div> : null}
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end gap-2 border-t pt-4">
                        <button type="button" onClick={onClose} className="rounded border px-4 py-2">
                            Hủy
                        </button>
                        <button
                            type="button"
                            onClick={onSubmit}
                            disabled={submitting}
                            className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
                        >
                            {submitting ? "Đang lưu..." : "Lưu role"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function RolePermissionManager({
    initialRoles,
    permissions,
}: {
    initialRoles: RoleItem[];
    permissions: PermissionItem[];
}) {
    const router = useRouter();
    const notify = useNotify();
    const [roles, setRoles] = useState(initialRoles);
    const [form, setForm] = useState<FormState>({ name: "", description: "", permissionIds: [] });
    const [open, setOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const totalPermissionCount = permissions.length;
    const permissionMap = useMemo(() => new Map(permissions.map((p) => [p.id, p])), [permissions]);

    function openCreate() {
        setForm({ name: "", description: "", permissionIds: [] });
        setOpen(true);
    }

    function openEdit(role: RoleItem) {
        setForm({
            id: role.id,
            name: role.name,
            description: role.description ?? "",
            permissionIds: role.permissions.map((p) => p.id),
        });
        setOpen(true);
    }

    function closeEditor() {
        if (submitting) return;
        setOpen(false);
    }

    function togglePermission(permissionId: string) {
        setForm((prev) => ({
            ...prev,
            permissionIds: prev.permissionIds.includes(permissionId)
                ? prev.permissionIds.filter((id) => id !== permissionId)
                : [...prev.permissionIds, permissionId],
        }));
    }

    async function submitForm() {
        if (!form.name.trim()) {
            notify.error("Tên role không được để trống");
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch(form.id ? `/api/admin/roles/${form.id}` : "/api/admin/roles", {
                method: form.id ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name,
                    description: form.description,
                    permissionIds: form.permissionIds,
                }),
            });

            const data = await res.json().catch(() => null);
            if (!res.ok) {
                throw new Error(data?.message || data?.detail || "Lưu role thất bại");
            }

            notify.success(form.id ? "Đã cập nhật role" : "Đã tạo role mới");
            setOpen(false);
            router.refresh();
            if (Array.isArray(data?.roles)) {
                setRoles(data.roles);
            }
        } catch (e: any) {
            notify.error(e?.message || "Lưu role thất bại");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h1 className="text-xl font-semibold">Quản lý role & permission</h1>
                    <p className="text-sm text-gray-500">Xem role nào có quyền gì và chỉnh trực tiếp tại đây.</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/admin/users" className="rounded border px-3 py-2 text-sm hover:bg-gray-50">
                        ← Danh sách user
                    </Link>
                    <button type="button" onClick={openCreate} className="rounded bg-black px-3 py-2 text-sm text-white">
                        + Tạo role
                    </button>
                </div>
            </div>

            <div className="rounded-lg border bg-white">
                <div className="grid grid-cols-12 border-b bg-gray-50 px-4 py-3 text-sm font-medium">
                    <div className="col-span-2">Role</div>
                    <div className="col-span-4">Mô tả</div>
                    <div className="col-span-4">Quyền</div>
                    <div className="col-span-1 text-center">Số quyền</div>
                    <div className="col-span-1 text-right">Hành động</div>
                </div>

                <div className="divide-y">
                    {roles.map((role) => (
                        <div key={role.id} className="grid grid-cols-12 items-start gap-4 px-4 py-4 text-sm">
                            <div className="col-span-2 font-semibold">{role.name}</div>
                            <div className="col-span-4 text-gray-600">{role.description || <span className="text-gray-400">-</span>}</div>
                            <div className="col-span-4 flex flex-wrap gap-2">
                                {role.permissions.length ? (
                                    role.permissions.map((p) => <PermissionChip key={p.id} code={p.code} />)
                                ) : (
                                    <span className="text-gray-400">Chưa có quyền</span>
                                )}
                            </div>
                            <div className="col-span-1 text-center font-medium">{role.permissions.length}</div>
                            <div className="col-span-1 text-right">
                                <button
                                    type="button"
                                    onClick={() => openEdit(role)}
                                    className="rounded border px-3 py-1.5 text-sm hover:bg-gray-50"
                                >
                                    Sửa
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="rounded-lg border bg-white p-4 text-sm text-gray-600">
                Tổng permission catalog: <b>{totalPermissionCount}</b>
                <div className="mt-2 flex flex-wrap gap-2">
                    {permissions.map((p) => (
                        <span key={p.id} className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                            {p.code}
                        </span>
                    ))}
                </div>
            </div>

            <RoleEditor
                open={open}
                title={form.id ? `Chỉnh role ${form.name}` : "Tạo role mới"}
                form={form}
                permissions={permissions}
                onClose={closeEditor}
                onToggle={togglePermission}
                onChange={(patch) => setForm((prev) => ({ ...prev, ...patch }))}
                onSubmit={submitForm}
                submitting={submitting}
            />
        </div>
    );
}
