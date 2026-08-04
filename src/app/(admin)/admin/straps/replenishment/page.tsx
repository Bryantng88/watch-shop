import Link from "next/link";
import { ArrowLeft, ClipboardList } from "lucide-react";
import { PERMISSIONS } from "@/constants/permissions";
import { requirePermission } from "@/server/auth/requirePermission";
import { listStraps } from "@/domains/strap/server";
import StrapReplenishmentTable from "@/domains/strap/client/StrapReplenishmentTable";

export default async function StrapReplenishmentPage() {
  await requirePermission(PERMISSIONS.ACCESSORY_VIEW);
  const rows = (await listStraps()).filter((row) => row.inventoryPolicy === "STOCKED" && row.stockQty < row.targetStockQty);
  return <main className="min-h-screen bg-slate-50 px-6 py-6"><div className="mx-auto max-w-5xl space-y-4"><Link href="/admin/straps" className="inline-flex items-center gap-2 text-sm text-slate-500"><ArrowLeft className="h-4 w-4" /> Dây & khóa</Link><header className="rounded-2xl border border-violet-100 bg-gradient-to-r from-white to-violet-50 p-6"><div className="flex items-center gap-3"><div className="rounded-xl bg-violet-600 p-3 text-white"><ClipboardList className="h-5 w-5" /></div><div><h1 className="text-xl font-semibold">Danh sách cần đặt thêm</h1><p className="mt-1 text-sm text-slate-500">Tự tính từ tồn mục tiêu trừ tồn khả dụng.</p></div></div></header><StrapReplenishmentTable rows={rows} /></div></main>;
}
