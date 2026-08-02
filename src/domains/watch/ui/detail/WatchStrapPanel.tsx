import Link from "next/link";
import { Link2 } from "lucide-react";

type StrapDetailLike = {
  strapInstallation?: {
    variantId: string;
    title?: string | null;
    sku?: string | null;
    ownershipMode?: string | null;
    installedFullLinks?: number | null;
    spareFullLinks?: number | null;
    installedHalfLinks?: number | null;
    wristSizeMM?: number | null;
  } | null;
};

export default function WatchStrapPanel({ detail }: { detail: StrapDetailLike }) {
  const installation = detail?.strapInstallation;
  return <section className="rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center gap-3 border-b border-slate-100 p-5"><div className="rounded-xl bg-violet-50 p-2 text-violet-600"><Link2 className="h-4 w-4" /></div><div><h2 className="font-semibold text-slate-950">Dây & khóa hiện tại</h2><p className="text-xs text-slate-500">Liên kết xuyên suốt với hồ sơ Strap</p></div></div>{installation ? <div className="p-5"><Link href={`/admin/straps/${installation.variantId}`} className="font-semibold text-violet-800">{installation.title || "Dây đồng hồ"}</Link><div className="mt-1 text-xs text-slate-500">{installation.sku || "Chưa SKU"} · {installation.ownershipMode}</div><div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-600"><span>Mắt đang lắp: <b>{installation.installedFullLinks ?? "—"}</b></span><span>Mắt rời: <b>{installation.spareFullLinks ?? "—"}</b></span><span>Half-link: <b>{installation.installedHalfLinks ?? "—"}</b></span><span>Cổ tay: <b>{installation.wristSizeMM ? `${installation.wristSizeMM} mm` : "—"}</b></span></div></div> : <div className="p-5"><p className="text-sm text-slate-500">Chưa liên kết hồ sơ dây.</p><Link href="/admin/straps" className="mt-3 inline-block text-sm font-medium text-violet-700">Chọn từ danh mục dây →</Link></div>}</section>;
}
