import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CircleDollarSign, Link2, Package, Settings2 } from "lucide-react";

import { PERMISSIONS } from "@/constants/permissions";
import { requirePermission } from "@/server/auth/requirePermission";
import { getStrapDetail } from "@/domains/strap/server";
import { requestStrapProcessingAction } from "./actions";

function money(value: unknown) { return new Intl.NumberFormat("vi-VN").format(Number(value ?? 0)); }

export default async function StrapDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission(PERMISSIONS.ACCESSORY_VIEW);
  const { id } = await params;
  const row = await getStrapDetail(id);
  if (!row?.StrapVariantSpec) notFound();
  const spec = row.StrapVariantSpec;
  const active = row.strapInstallations.find((item) => !item.removedAt) ?? null;

  return <main className="min-h-screen bg-slate-50 px-6 py-6"><div className="mx-auto max-w-[1450px] space-y-4">
    <Link href="/admin/straps" className="inline-flex items-center gap-2 text-sm text-slate-500"><ArrowLeft className="h-4 w-4" /> Danh sách dây</Link>
    <section className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-[220px_1fr_280px]">
      <div className="flex h-52 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-violet-50 text-violet-300"><Link2 className="h-16 w-16" /></div>
      <div><div className="flex gap-2"><span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">{spec.originType === "OEM" ? "Chính hãng" : "Linh kiện"}</span><span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">{String(spec.material)}</span></div><h1 className="mt-4 text-2xl font-semibold text-slate-950">{row.Product.title}</h1><p className="mt-1 text-sm text-slate-500">{row.sku || "Chưa có SKU"} · {spec.lugWidthMM}–{spec.buckleWidthMM ?? "—"} mm · {spec.color || "Chưa màu"}</p>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">{[["Đầu lug", `${spec.lugWidthMM} mm`],["Đầu khóa", spec.buckleWidthMM ? `${spec.buckleWidthMM} mm` : "—"],["Khóa", spec.claspType || "Chưa khai báo"],["Chính sách", spec.inventoryPolicy]].map(([k,v])=><div key={k} className="rounded-xl border border-slate-100 bg-slate-50 p-3"><div className="text-[10px] uppercase text-slate-400">{k}</div><div className="mt-1 text-sm font-semibold text-slate-800">{String(v)}</div></div>)}</div>
      </div>
      <aside className="rounded-2xl border border-slate-200 bg-slate-950 p-5 text-white"><div className="text-xs text-slate-400">Tồn khả dụng</div><div className="mt-2 text-3xl font-semibold">{spec.inventoryPolicy === "NON_STOCK" ? "—" : row.stockQty}</div><div className="mt-5 border-t border-white/10 pt-4 text-xs text-slate-400">Giá bán</div><div className="mt-1 text-xl font-semibold">{money(row.price)} VND</div><form action={requestStrapProcessingAction.bind(null, row.id)}><button type="submit" className="mt-5 w-full rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-medium transition hover:bg-violet-400">Mở xử lý dây</button></form></aside>
    </section>

    <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
      <div className="space-y-4">
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center gap-3 border-b border-slate-100 p-5"><Settings2 className="h-5 w-5 text-violet-600" /><div><h2 className="font-semibold">Khóa & mắt dây</h2><p className="text-xs text-slate-500">Cấu hình catalog và số mắt trên Watch hiện tại</p></div></div><div className="grid gap-3 p-5 sm:grid-cols-3">{[["Loại khóa", spec.claspType || "Chưa khai báo"],["Rộng khóa", spec.claspWidthMM ? `${spec.claspWidthMM} mm` : "—"],["Nguồn khóa", spec.claspOriginType || "—"],["Mắt mặc định", spec.defaultFullLinks ?? "—"],["Half-link", spec.defaultHalfLinks ?? "—"],["End-link", spec.defaultEndLinks ?? "—"]].map(([k,v])=><div key={k} className="rounded-xl border border-slate-200 p-4"><div className="text-xs text-slate-400">{k}</div><div className="mt-1 font-semibold text-slate-800">{String(v)}</div></div>)}</div></section>
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center gap-3 border-b border-slate-100 p-5"><Package className="h-5 w-5 text-emerald-600" /><h2 className="font-semibold">Biến động tồn kho</h2></div><div className="divide-y divide-slate-100">{row.strapMovements.length ? row.strapMovements.map((item)=><div key={item.id} className="flex justify-between px-5 py-3 text-sm"><span>{item.movementType}<span className="ml-2 text-slate-400">{item.note}</span></span><b className={item.quantity > 0 ? "text-emerald-600" : "text-rose-600"}>{item.quantity > 0 ? "+" : ""}{item.quantity}</b></div>) : <div className="p-5 text-sm text-slate-400">Chưa có movement.</div>}</div></section>
      </div>
      <aside className="space-y-4">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-semibold">Watch hiện tại</h2>{active ? <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4"><Link href={`/admin/watches/${active.watch.productId}`} className="font-semibold text-blue-900">{active.watch.product.title}</Link><div className="mt-1 text-xs text-blue-700">{active.watch.product.sku || "Chưa SKU"}</div><div className="mt-4 grid grid-cols-2 gap-2 text-xs"><span>Mắt lắp: <b>{active.installedFullLinks ?? "—"}</b></span><span>Mắt rời: <b>{active.spareFullLinks ?? "—"}</b></span><span>Half-link: <b>{active.installedHalfLinks ?? "—"}</b></span><span>Cổ tay: <b>{active.wristSizeMM ? `${active.wristSizeMM} mm` : "—"}</b></span></div></div> : <p className="mt-3 text-sm text-slate-500">Dây chưa gắn Watch.</p>}</section>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center gap-2"><CircleDollarSign className="h-4 w-4 text-amber-500" /><h2 className="font-semibold">Giá & định mức</h2></div><dl className="mt-4 space-y-3 text-sm"><div className="flex justify-between"><dt className="text-slate-500">Giá vốn</dt><dd className="font-semibold">{money(row.costPrice)}đ</dd></div><div className="flex justify-between"><dt className="text-slate-500">Tồn tối thiểu</dt><dd className="font-semibold">{spec.minStockQty}</dd></div><div className="flex justify-between"><dt className="text-slate-500">Tồn mục tiêu</dt><dd className="font-semibold">{spec.targetStockQty}</dd></div></dl></section>
      </aside>
    </div>
  </div></main>;
}
