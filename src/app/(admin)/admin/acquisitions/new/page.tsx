import Link from "next/link";
import { ArrowRight, Link2, Watch } from "lucide-react";
import { PERMISSIONS } from "@/constants/permissions";
import { requirePermission } from "@/server/auth/requirePermission";

export default async function AcquisitionNewPage() {
    await requirePermission(PERMISSIONS.ACQUISITION_CREATE);

    return (
        <main className="min-h-screen bg-slate-50 px-6 py-8">
            <div className="mx-auto max-w-5xl">
                <div className="mb-6">
                    <div className="text-sm font-medium text-violet-600">Phiếu nhập</div>
                    <h1 className="mt-1 text-2xl font-semibold text-slate-950">Bạn muốn tạo loại phiếu nào?</h1>
                    <p className="mt-2 text-sm text-slate-500">Mỗi loại có form và quyền truy cập riêng, nhưng vẫn dùng chung nghiệp vụ Phiếu nhập.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Link href="/admin/acquisitions/watches/new" className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
                        <div className="flex items-start justify-between gap-4">
                            <span className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-blue-700 ring-1 ring-blue-100"><Watch className="h-6 w-6" /></span>
                            <ArrowRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600" />
                        </div>
                        <h2 className="mt-6 text-lg font-semibold text-slate-950">Phiếu nhập Watch</h2>
                        <p className="mt-2 text-sm leading-6 text-slate-500">Thu mua, trade-in hoặc ký gửi đồng hồ. Chỉ Admin có quyền truy cập.</p>
                        <div className="mt-5 text-sm font-semibold text-blue-700">Tạo phiếu Watch</div>
                    </Link>

                    <Link href="/admin/acquisitions/accessories/new" className="group rounded-2xl border border-violet-200 bg-gradient-to-br from-white to-violet-50/70 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                        <div className="flex items-start justify-between gap-4">
                            <span className="grid h-12 w-12 place-items-center rounded-xl bg-violet-600 text-white"><Link2 className="h-6 w-6" /></span>
                            <ArrowRight className="h-5 w-5 text-violet-300 transition group-hover:translate-x-1 group-hover:text-violet-700" />
                        </div>
                        <h2 className="mt-6 text-lg font-semibold text-slate-950">Phiếu nhập phụ kiện</h2>
                        <p className="mt-2 text-sm leading-6 text-slate-500">Chọn nhập dây hoặc khóa; mỗi loại có vendor và tồn kho riêng.</p>
                        <div className="mt-5 text-sm font-semibold text-violet-700">Chọn loại phụ kiện</div>
                    </Link>
                </div>
            </div>
        </main>
    );
}
