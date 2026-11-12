import { notFound } from "next/navigation";
import Link from "next/link";
import { requirePermission } from "@/server/auth/requirePermission";
import { prisma } from "@/server/db/client";
import { getTaskItemDetail } from "@/domains/task/server/core/task.service";
export default async function BenWorkDetail({params}:{params:Promise<{id:string}>}) {
  const auth = await requirePermission("TASK_VIEW");
  const {id} = await params;
  const item = await getTaskItemDetail(prisma,id,auth);
  if (!item) notFound();
  return <main className="mx-auto max-w-2xl space-y-4 p-5">
    <Link href="/admin/ben" className="text-sm text-blue-700">← Ben</Link>
    <h1 className="text-xl font-semibold text-slate-950">{item.title}</h1>
    <p className="text-sm text-slate-600">{item.status}</p>
    {item.dueAt && <p className="text-sm">{new Intl.DateTimeFormat("vi-VN",{dateStyle:"medium",timeStyle:"short",timeZone:"Asia/Bangkok"}).format(new Date(item.dueAt))}</p>}
    <Link href="/admin/coordination/operation?view=ad-hoc-work" className="inline-flex rounded-lg bg-slate-950 px-4 py-2 text-sm text-white">Mở không gian vận hành</Link>
  </main>;
}
