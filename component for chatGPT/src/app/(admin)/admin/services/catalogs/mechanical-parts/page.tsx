import { prisma } from "@/server/db/client";

export default async function MechanicalPartCatalogPage() {
    const rows = await prisma.mechanicalPartCatalog.findMany({
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-semibold">Danh mục linh kiện máy cơ</h1>

            <div className="rounded-xl border bg-white">
                <table className="min-w-full text-sm">
                    <thead>
                        <tr className="border-b bg-slate-50 text-left">
                            <th className="px-4 py-3">Code</th>
                            <th className="px-4 py-3">Tên</th>
                            <th className="px-4 py-3">Nhóm</th>
                            <th className="px-4 py-3">Giá mặc định</th>
                            <th className="px-4 py-3">Ghi chú</th>
                            <th className="px-4 py-3">Active</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((r) => (
                            <tr key={r.id} className="border-b">
                                <td className="px-4 py-3">{r.code}</td>
                                <td className="px-4 py-3">{r.name}</td>
                                <td className="px-4 py-3">{r.group}</td>
                                <td className="px-4 py-3">
                                    {r.defaultCost != null
                                        ? Number(r.defaultCost).toLocaleString("vi-VN")
                                        : "-"}
                                </td>
                                <td className="px-4 py-3">{r.note || "-"}</td>
                                <td className="px-4 py-3">{r.isActive ? "Yes" : "No"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}