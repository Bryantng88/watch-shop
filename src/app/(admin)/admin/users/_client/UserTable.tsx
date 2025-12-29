"use client";

import { useState } from "react";
import clsx from "clsx";

type UserRow = {
    id: string;
    email: string;
    name?: string | null;
    isActive: boolean;
    roles: string[];
};

type Props = {
    users: UserRow[];
};

export default function UserTable({ users }: Props) {
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    return (
        <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full text-sm border-collapse">
                {/* ================= HEADER ================= */}
                <thead className="bg-gray-50 border-b">
                    <tr>
                        <th className="px-3 py-2 text-left">Email</th>
                        <th className="px-3 py-2 text-left">Tên</th>
                        <th className="px-3 py-2 text-left">Role</th>
                        <th className="px-3 py-2 text-left">Trạng thái</th>
                        <th className="px-3 py-2 text-right">Hành động</th>
                    </tr>
                </thead>

                {/* ================= BODY ================= */}
                <tbody>
                    {users.length === 0 ? (
                        <tr>
                            <td
                                colSpan={5}
                                className="py-8 text-center text-gray-500"
                            >
                                Không có user
                            </td>
                        </tr>
                    ) : (
                        users.map((u) => (
                            <tr
                                key={u.id}
                                className="border-b hover:bg-gray-50"
                            >
                                {/* Email */}
                                <td className="px-3 py-2 font-medium">
                                    {u.email}
                                </td>

                                {/* Name */}
                                <td className="px-3 py-2">
                                    {u.name ?? "-"}
                                </td>

                                {/* Roles */}
                                <td className="px-3 py-2">
                                    <div className="flex flex-wrap gap-1">
                                        {u.roles.map((r) => (
                                            <span
                                                key={r}
                                                className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700"
                                            >
                                                {r}
                                            </span>
                                        ))}
                                    </div>
                                </td>

                                {/* Status */}
                                <td className="px-3 py-2">
                                    <span
                                        className={clsx(
                                            "px-2 py-1 rounded text-xs font-medium",
                                            u.isActive
                                                ? "bg-green-100 text-green-700"
                                                : "bg-gray-100 text-gray-600"
                                        )}
                                    >
                                        {u.isActive ? "Active" : "Disabled"}
                                    </span>
                                </td>

                                {/* Actions */}
                                <td className="relative px-3 py-2 text-right">
                                    <button
                                        className="p-2 rounded hover:bg-gray-100"
                                        onClick={() =>
                                            setOpenMenuId(
                                                openMenuId === u.id ? null : u.id
                                            )
                                        }
                                    >
                                        ⋮
                                    </button>

                                    {openMenuId === u.id && (
                                        <div className="absolute right-2 top-10 z-20 w-40 rounded-md border bg-white shadow">
                                            <button className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100">
                                                Xem chi tiết
                                            </button>
                                            <button className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100">
                                                Phân quyền
                                            </button>
                                            <button className="block w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50">
                                                Vô hiệu hoá
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
