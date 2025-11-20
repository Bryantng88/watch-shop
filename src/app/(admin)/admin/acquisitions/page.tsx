// app/(admin)/admin/acquisitions/page.tsx
import Link from "next/link";
import { getAdminAcquisitionList } from "./_server/acquisition.service";
import { parseAcqSearchParams } from "./ultils/search-params";    // NOTE: utils (không phải ultils)
import DrawerHost from "./components/Drawer";                      // <— Drawer client component
import ItemsHover from "./components/ItemsHover";
import AcqItemsPopover from "./components/ItemsPopover";
import ChangeToPostedButton from "./components/ChangeToPostedButton";
type SearchParams = { [key: string]: string | string[] | undefined };

type PageProps = {
    searchParams: Promise<SearchParams>;
};

function fmtDate(d?: string | Date | null) {
    if (!d) return "-";
    const dt = typeof d === "string" ? new Date(d) : d;
    return dt.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function fmtMoney(n?: number | null, cur = "VND") {
    if (n == null) return "-";
    return new Intl.NumberFormat("vi-VN").format(Number(n)) + (cur ? ` ${cur}` : "");
}

export default async function AcquisitionListPage({ searchParams }: PageProps) {
    // chuẩn hoá searchParams -> URLSearchParams
    const spObj = await searchParams;  // 👈 quan trọng

    const sp = new URLSearchParams(
        Object.entries(spObj).flatMap(([k, v]) =>
            Array.isArray(v) ? v.map((x) => [k, x]) : [[k, v ?? ""]]
        )
    );

    // parse filters
    const input = parseAcqSearchParams(sp);
    const { items, total, page, pageSize } = await getAdminAcquisitionList(input);
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    const gotoPageHref = (p: number) => {
        const next = new URLSearchParams(sp);
        next.set("page", String(p));
        return `/admin/acquisitions?${next.toString()}`;
    };

    // build href ?view=<id> (giữ các query khác)
    const viewHref = (id: string) => {
        const next = new URLSearchParams(sp);
        next.set("view", id);
        return `?${next.toString()}`;
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Phiếu nhập hàng</h1>
                <Link
                    href="/admin/acquisitions/new"
                    className="rounded-md bg-black text-white text-sm px-3 py-2 hover:bg-neutral-800"
                >
                    + Tạo phiếu nhập
                </Link>
            </div>

            {/* Filters */}
            <form action="/admin/acquisitions" method="get" className="flex flex-wrap gap-2 items-end">
                <div className="flex flex-col">
                    <label className="text-xs text-gray-600">Tìm kiếm</label>
                    <input
                        name="q"
                        defaultValue={(spObj.q as string) ?? ""}
                        placeholder="RefNo, ghi chú…"
                        className="h-9 rounded border px-2"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-xs text-gray-600">Sắp xếp</label>
                    <select
                        name="sort"
                        defaultValue={(spObj.sort as string) ?? "updatedDesc"}
                        className="h-9 rounded border px-2"
                    >
                        <option value="updatedDesc">Cập nhật ↓</option>
                        <option value="updatedAsc">Cập nhật ↑</option>
                        <option value="createdDesc">Tạo ↓</option>
                        <option value="createdAsc">Tạo ↑</option>
                        <option value="acquiredDesc">Ngày nhập ↓</option>
                        <option value="acquiredAsc">Ngày nhập ↑</option>
                    </select>
                </div>

                <div className="flex gap-2">
                    <button className="h-9 rounded border px-3">Lọc</button>
                    <Link href="/admin/acquisitions" className="h-9 rounded border px-3 flex items-center">
                        Clear
                    </Link>
                </div>
            </form>

            <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full text-sm border-collapse">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-3 py-2 text-left">RefNo</th>
                            <th className="px-3 py-2 text-left">Vendor</th>
                            <th className="px-3 py-2 text-left">Loại</th>
                            <th className="px-3 py-2 text-left">Trạng thái</th>
                            <th className="px-3 py-2 text-left">Ngày nhập</th>
                            <th className="px-3 py-2 text-left">Tổng tiền</th>
                            <th className="px-3 py-2 text-left">Số dòng</th>
                            <th className="px-3 py-2 text-left">HĐ</th>
                            <th className="px-3 py-2 text-left">Cập nhật</th>
                            <th className="px-3 py-2 text-right">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan={10} className="py-8 text-center text-gray-500">
                                    Không có phiếu nhập
                                </td>
                            </tr>
                        ) : (
                            items.map((a) => (
                                <tr key={a.id} className="border-b hover:bg-gray-50">
                                    <td className="px-3 py-2 font-medium">{a.refNo ?? "-"}</td>
                                    <td className="px-3 py-2">{a.vendorName ?? "-"}</td>
                                    <td className="px-3 py-2">{a.type}</td>
                                    <td className="px-3 py-2">
                                        <span
                                            className={`px-2 py-1 rounded text-xs font-medium ${a.status === "POSTED"
                                                ? "bg-green-100 text-green-700"
                                                : a.status === "DRAFT"
                                                    ? "bg-amber-100 text-amber-700"
                                                    : "bg-gray-100 text-gray-700"
                                                }`}
                                        >
                                            {a.status}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2">{fmtDate(a.acquiredAt)}</td>
                                    <td className="px-3 py-2">{fmtMoney(Number(a.cost ?? 0), a.currency ?? "VND")}</td>
                                    <td className="px-3 py-2">
                                        <AcqItemsPopover
                                            acqId={a.id}
                                            count={(a as any).itemCount ?? 0}
                                            currency={a.currency ?? "VND"}
                                        />
                                    </td>
                                    <td className="px-3 py-2">{(a as any).hasInvoice ? "✓" : "-"}</td>
                                    <td className="px-3 py-2">{fmtDate((a as any).updatedAt)}</td>
                                    <td className="px-3 py-2">
                                        <div className="flex justify-end gap-3">
                                            <ChangeToPostedButton id={a.id} status={a.status} />
                                            <Link
                                                href={`/admin/acquisitions/${a.id}/edit`}
                                                className="text-amber-600 hover:underline text-xs"
                                            >
                                                Sửa
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                    Tổng: <b>{total}</b> • Trang <b>{page}</b>/<b>{totalPages}</b>
                </div>
                <div className="flex gap-2">
                    <Link
                        href={gotoPageHref(Math.max(1, page - 1))}
                        className={`rounded border px-3 py-1 text-sm ${page <= 1 ? "pointer-events-none opacity-50" : ""}`}
                    >
                        ← Trước
                    </Link>
                    <Link
                        href={gotoPageHref(Math.min(totalPages, page + 1))}
                        className={`rounded border px-3 py-1 text-sm ${page >= totalPages ? "pointer-events-none opacity-50" : ""}`}
                    >
                        Sau →
                    </Link>
                </div>
            </div>

            {/* Drawer: đọc ?view=<id> và fetch chi tiết */}

        </div>
    );
}
