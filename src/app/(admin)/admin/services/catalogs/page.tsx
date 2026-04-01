import Link from "next/link";

export default function ServiceCatalogHubPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Quản lý danh mục service</h1>

            <div className="grid gap-4 md:grid-cols-2">
                <Link href="/admin/services/catalogs/technical" className="rounded-xl border bg-white p-5 shadow-sm hover:bg-slate-50">
                    <div className="text-lg font-semibold">Danh mục kỹ thuật</div>
                    <div className="mt-1 text-sm text-slate-500">Quản lý các hạng mục như thay pin, lau dầu, spa vỏ, sửa máy...</div>
                </Link>

                <Link href="/admin/services/catalogs/supplies" className="rounded-xl border bg-white p-5 shadow-sm hover:bg-slate-50">
                    <div className="text-lg font-semibold">Danh mục vật tư</div>
                    <div className="mt-1 text-sm text-slate-500">Quản lý dây, pin và các vật tư dùng trong sửa chữa.</div>
                </Link>
            </div>
        </div>
    );
}
