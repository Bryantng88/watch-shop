import Link from "next/link";
import { ArrowRight, Link2, Watch } from "lucide-react";
import { PERMISSIONS } from "@/constants/permissions";
import { requireAnyPermission } from "@/server/auth/requirePermission";
import { AdminPageCanvas, AdminPageHeader } from "@/domains/shared/ui/admin-design-contract";

export default async function AcquisitionNewPage() {
    await requireAnyPermission([PERMISSIONS.WATCH_ACQUISITION_CREATE, PERMISSIONS.ACQUISITION_CREATE_ALL]);
    return <AdminPageCanvas>
        <AdminPageHeader eyebrow="KHO HÀNG / PHIẾU NHẬP" title="Tạo phiếu nhập" description="Chọn loại sản phẩm cần nhập kho." />
        <div className="max-w-3xl divide-y divide-slate-100">
            {[
                { href: "watches", icon: Watch, title: "Đồng hồ", description: "Thu mua, trade-in hoặc ký gửi." },
                { href: "accessories", icon: Link2, title: "Phụ kiện", description: "Nhập dây và khóa đồng hồ." },
            ].map(({ href, icon: Icon, title, description }) => <Link key={href} href={`/admin/acquisitions/${href}/new`} className="flex items-center gap-3 py-4 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300">
                <Icon className="h-5 w-5 shrink-0 text-slate-500" />
                <span className="min-w-0 flex-1"><strong className="block text-sm text-slate-900">{title}</strong><span className="text-xs text-slate-500">{description}</span></span>
                <ArrowRight className="h-4 w-4 text-slate-400" />
            </Link>)}
        </div>
    </AdminPageCanvas>;
}
