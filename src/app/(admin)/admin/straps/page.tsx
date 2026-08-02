import Link from "next/link";
import { Boxes, Link2, PackageCheck, SlidersHorizontal, Wrench } from "lucide-react";

import { PERMISSIONS } from "@/constants/permissions";
import { requirePermission } from "@/server/auth/requirePermission";
import { listStraps } from "@/domains/strap/server";

function materialLabel(value: string) {
  const labels: Record<string, string> = { LEATHER: "Dây da", BRACELET: "Dây thép", RUBBER: "Cao su", NATO: "NATO", CANVASS: "Vải" };
  return labels[value] ?? value;
}

export default async function StrapListPage() {
  await requirePermission(PERMISSIONS.PRODUCT_VIEW);
  const rows = await listStraps();
  const stocked = rows.filter((row) => row.inventoryPolicy === "STOCKED");
  const lowStock = stocked.filter((row) => row.lowStock);
  const attached = rows.filter((row) => row.attachedWatch);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-6">
      <div className="mx-auto max-w-[1500px] space-y-4">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-violet-100 bg-gradient-to-r from-white to-violet-50 px-6 py-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600 text-white"><Link2 className="h-5 w-5" /></div>
            <div><h1 className="text-xl font-semibold text-slate-950">Dây & khóa</h1><p className="mt-1 text-sm text-slate-500">Sản phẩm · tồn kho · Watch đang gắn · vận hành dây</p></div>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/straps/catalog" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700">Quản lý danh mục</Link>
            <Link href="/admin/straps/replenishment" className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-medium text-white">Danh sách cần đặt</Link>
          </div>
        </header>

        <section className="grid gap-3 md:grid-cols-4">
          {[
            ["Tổng biến thể", rows.length, Boxes, "text-violet-600 bg-violet-50"],
            ["Tồn linh kiện", stocked.reduce((sum, row) => sum + row.stockQty, 0), PackageCheck, "text-emerald-600 bg-emerald-50"],
            ["Sắp hết", lowStock.length, SlidersHorizontal, "text-amber-600 bg-amber-50"],
            ["Đang gắn Watch", attached.length, Wrench, "text-blue-600 bg-blue-50"],
          ].map(([label, value, Icon, tone]) => {
            const MetricIcon = Icon as typeof Boxes;
            return <div key={String(label)} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className={`mb-4 flex h-9 w-9 items-center justify-center rounded-xl ${tone}`}><MetricIcon className="h-4 w-4" /></div><div className="text-2xl font-semibold text-slate-950">{String(value)}</div><div className="mt-1 text-xs text-slate-500">{String(label)}</div></div>;
          })}
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap gap-2 border-b border-slate-100 p-4">
            <input className="h-10 min-w-[280px] flex-1 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-violet-300" placeholder="Tìm SKU, kích thước, màu, hãng..." />
            {['Loại dây', 'Nguồn gốc', 'Kích thước', 'Màu', 'Trạng thái'].map((label) => <button key={label} className="h-10 rounded-xl border border-slate-200 px-4 text-sm text-slate-600">{label}</button>)}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-3">Dây</th><th className="px-5 py-3">Quy cách</th><th className="px-5 py-3">Nguồn</th><th className="px-5 py-3">Khóa</th><th className="px-5 py-3 text-right">Tồn</th><th className="px-5 py-3">Trạng thái</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((row) => <tr key={row.variantId} className="hover:bg-slate-50/70">
                  <td className="px-5 py-4"><Link href={`/admin/straps/${row.variantId}`} className="font-semibold text-slate-950 hover:text-violet-700">{row.title}</Link><div className="mt-1 text-xs text-slate-400">{row.sku || "Chưa có SKU"}</div></td>
                  <td className="px-5 py-4"><div className="font-medium text-slate-800">{row.lugWidthMM}–{row.buckleWidthMM ?? "—"} mm</div><div className="mt-1 text-xs text-slate-500">{materialLabel(row.material)} · {row.color || "Chưa màu"}</div></td>
                  <td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${row.originType === "OEM" ? "bg-blue-50 text-blue-700" : "bg-violet-50 text-violet-700"}`}>{row.originType === "OEM" ? "Chính hãng" : "Linh kiện"}</span></td>
                  <td className="px-5 py-4 text-slate-600">{row.claspType || "Chưa khai báo"}</td>
                  <td className="px-5 py-4 text-right font-semibold">{row.inventoryPolicy === "NON_STOCK" ? "—" : row.stockQty}</td>
                  <td className="px-5 py-4">{row.attachedWatch ? <Link href={`/admin/watches/${row.attachedWatch.productId}`} className="text-blue-700">Gắn: {row.attachedWatch.title}</Link> : row.lowStock ? <span className="text-amber-700">Sắp hết</span> : <span className="text-emerald-700">Sẵn sàng</span>}</td>
                </tr>)}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
