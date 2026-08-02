import Link from "next/link";
import { ArrowLeft, Tags } from "lucide-react";
import { PERMISSIONS } from "@/constants/permissions";
import { requirePermission } from "@/server/auth/requirePermission";
import { listStrapCatalogOptions } from "@/domains/strap/server";
import { createStrapCatalogOption } from "./actions";

const KINDS = [
  ["COLOR", "Màu sắc"], ["MATERIAL", "Chất liệu"], ["CLASP_TYPE", "Loại khóa"],
  ["FINISH", "Hoàn thiện"], ["LENGTH_CLASS", "Chiều dài"], ["STORAGE_LOCATION", "Vị trí kho"],
] as const;

export default async function StrapCatalogPage() {
  await requirePermission(PERMISSIONS.PRODUCT_VIEW);
  const rows = await listStrapCatalogOptions();
  return <main className="min-h-screen bg-slate-50 px-6 py-6"><div className="mx-auto max-w-6xl space-y-4"><Link href="/admin/straps" className="inline-flex items-center gap-2 text-sm text-slate-500"><ArrowLeft className="h-4 w-4" /> Dây & khóa</Link><header className="rounded-2xl border border-violet-100 bg-gradient-to-r from-white to-violet-50 p-6"><div className="flex items-center gap-3"><div className="rounded-xl bg-violet-600 p-3 text-white"><Tags className="h-5 w-5" /></div><div><h1 className="text-xl font-semibold">Danh mục dây & khóa</h1><p className="mt-1 text-sm text-slate-500">Vocabulary dùng chung cho Product, tồn kho và xử lý dây.</p></div></div></header><div className="grid gap-4 md:grid-cols-2">{KINDS.map(([kind,label])=><section key={kind} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-semibold">{label}</h2><div className="mt-3 flex flex-wrap gap-2">{rows.filter((row)=>row.kind===kind).map((row)=><span key={row.id} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">{row.name}</span>)}{!rows.some((row)=>row.kind===kind)?<span className="text-xs text-slate-400">Chưa có dữ liệu</span>:null}</div><form action={createStrapCatalogOption} className="mt-4 flex gap-2"><input type="hidden" name="kind" value={kind}/><input name="name" required placeholder={`Thêm ${label.toLowerCase()}`} className="h-10 flex-1 rounded-xl border border-slate-200 px-3 text-sm"/><button className="rounded-xl bg-slate-950 px-4 text-sm font-medium text-white">Thêm</button></form></section>)}</div></div></main>;
}
