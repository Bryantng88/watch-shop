"use client";

import { useState } from "react";
import Link from "next/link";
import ActionMenu from "../../acquisitions/components/ActionMenu"
// =====================
// Formatters
// =====================
function fmtDate(d?: string | null) {
    if (!d) return "-";
    const dt = new Date(d);
    return dt.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}
type UserItem = {
    id: string;
    email: string;
    name: string | null;
    roles: string[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
};

type PageProps = {
    items: UserItem[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    rawSearchParams: Record<string, string | string[] | undefined>;
};
// =====================
// MAIN CLIENT COMPONENT
// =====================
export default function UserListPageClient({
    items,
    total,
    page,
    pageSize,
    totalPages,
    rawSearchParams,
}: PageProps) {
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    const url = new URLSearchParams(rawSearchParams as any);

    const gotoPageHref = (p: number) => {
        const next = new URLSearchParams(url);
        next.set("page", String(p));
        return `/admin/users?${next.toString()}`;
    };

    const spObj = rawSearchParams;

    return (
        <div className="space-y-4">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Quản lý người dùng</h1>

                <Link
                    href="/admin/users/new"
                    className="rounded-md bg-black text-white text-sm px-3 py-2 hover:bg-neutral-800"
                >
                    + Tạo người dùng
                </Link>
            </div>

            {/* FILTER */}
            <form
                action="/admin/users"
                method="get"
                className="flex flex-wrap gap-2 items-end"
            >
                <div className="flex flex-col">
                    <label className="text-xs text-gray-600">Tìm kiếm</label>
                    <input
                        name="q"
                        defaultValue={(spObj.q as string) ?? ""}
                        placeholder="Email, tên…"
                        className="h-9 rounded border px-2"
                    />
                </div>

                <div className="flex gap-2">
                    <button className="h-9 rounded border px-3">Lọc</button>
                    <Link
                        href="/admin/users"
                        className="h-9 rounded border px-3 flex items-center"
                    >
                        Clear
                    </Link>
                </div>
            </form>

            {/* TABLE */}
            <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full text-sm border-collapse">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-3 py-2 text-left">Email</th>
                            <th className="px-3 py-2 text-left">Tên</th>
                            <th className="px-3 py-2 text-left">Role</th>
                            <th className="px-3 py-2 text-left">Trạng thái</th>
                            <th className="px-3 py-2 text-left">Tạo lúc</th>
                            <th className="px-3 py-2 text-right">Hành động</th>
                        </tr>
                    </thead>

                    <tbody>
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="py-8 text-center text-gray-500">
                                    Không có người dùng
                                </td>
                            </tr>
                        ) : (
                            items.map((u) => (
                                <tr
                                    key={u.id}
                                    className="border-b hover:bg-gray-50"
                                >
                                    <td className="px-3 py-2 font-medium">{u.email}</td>

                                    <td className="px-3 py-2">{u.name ?? "-"}</td>

                                    <td className="px-3 py-2">
                                        <div className="flex flex-wrap gap-1">
                                            {u.roles.map((r) => (
                                                <span
                                                    key={r}
                                                    className="rounded bg-gray-100 px-2 py-0.5 text-xs"
                                                >
                                                    {r}
                                                </span>
                                            ))}
                                        </div>
                                    </td>

                                    <td className="px-3 py-2">
                                        <span
                                            className={`px-2 py-1 rounded text-xs font-medium ${u.isActive
                                                ? "bg-green-100 text-green-700"
                                                : "bg-gray-100 text-gray-600"
                                                }`}
                                        >
                                            {u.isActive ? "Active" : "Disabled"}
                                        </span>
                                    </td>

                                    <td className="px-3 py-2">
                                        {fmtDate(u.createdAt)}
                                    </td>

                                    <td className="relative px-3 py-2 text-right">
                                        <button
                                            className="p-2 rounded hover:bg-gray-100"
                                            onClick={() =>
                                                setOpenMenuId(openMenuId === u.id ? null : u.id)
                                            }
                                        >
                                            ⋮
                                        </button>

                                        {openMenuId === u.id && (
                                            <ActionMenu userId={u.id} isActive={u.isActive} />
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                    Tổng: <b>{total}</b> • Trang <b>{page}</b>/<b>{totalPages}</b>
                </div>

                <div className="flex gap-2">
                    <Link
                        href={gotoPageHref(Math.max(1, page - 1))}
                        className={`rounded border px-3 py-1 text-sm ${page <= 1 ? "pointer-events-none opacity-50" : ""
                            }`}
                    >
                        ← Trước
                    </Link>

                    <Link
                        href={gotoPageHref(Math.min(totalPages, page + 1))}
                        className={`rounded border px-3 py-1 text-sm ${page >= totalPages ? "pointer-events-none opacity-50" : ""
                            }`}
                    >
                        Sau →
                    </Link>
                </div>
            </div>
        </div>
    );
}
