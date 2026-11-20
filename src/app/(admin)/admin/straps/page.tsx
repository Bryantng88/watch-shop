import { AdminLinkAction } from "@/domains/shared/ui/admin-design-contract/AdminLinkAction";
import { AdminRouteWorkspace } from "@/domains/shared/ui/admin-design-contract/AdminRouteWorkspace";
import { AdminWorkspaceHeading, AdminWorkspaceHeadingRow } from "@/domains/shared/ui/admin-design-contract/AdminWorkspaceHeading";
import { productEntries } from "@/domains/shared/ui/navigation/section-navigation";
import { Boxes, PackageCheck, SlidersHorizontal, Wrench } from "lucide-react";

import { PERMISSIONS } from "@/constants/permissions";
import { requirePermission } from "@/server/auth/requirePermission";
import { listStraps } from "@/domains/strap/server";
import StrapInventoryTable from "@/domains/strap/client/StrapInventoryTable";

export default async function StrapListPage() {
  const user = await requirePermission(PERMISSIONS.ACCESSORY_VIEW);
  const rows = await listStraps();
  const stocked = rows.filter((row) => row.inventoryPolicy === "STOCKED");
  const lowStock = stocked.filter((row) => row.lowStock);
  const attached = rows.filter((row) => row.attachedWatch);

  return (
    <AdminRouteWorkspace title="Sản phẩm" description="Quản lý đồng hồ và phụ kiện." navigationLabel="Nhóm sản phẩm" storageKey="admin:products:menu-width:v1" entries={productEntries(user)} selected="/admin/straps">
      <div className="min-w-0 space-y-4">
        <AdminWorkspaceHeadingRow><AdminWorkspaceHeading>Phụ kiện</AdminWorkspaceHeading>
          <div className="flex flex-wrap gap-2">
            <AdminLinkAction variant="quiet" density="compact" href="/admin/straps/catalog">Quản lý danh mục</AdminLinkAction>
            <AdminLinkAction variant="quiet" density="compact" href="/admin/straps/replenishment">Danh sách cần đặt</AdminLinkAction>
          </div>
        </AdminWorkspaceHeadingRow>

        <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {[
            ["Tổng biến thể", rows.length, Boxes, "text-violet-600 bg-violet-50"],
            ["Tồn linh kiện", stocked.reduce((sum, row) => sum + row.stockQty, 0), PackageCheck, "text-emerald-600 bg-emerald-50"],
            ["Sắp hết", lowStock.length, SlidersHorizontal, "text-amber-600 bg-amber-50"],
            ["Đang gắn Watch", attached.length, Wrench, "text-blue-600 bg-blue-50"],
          ].map(([label, value, Icon, tone]) => {
            const MetricIcon = Icon as typeof Boxes;
            return <div key={String(label)} className="border-b border-slate-100 py-3"><div className={`mb-4 flex h-9 w-9 items-center justify-center rounded-xl ${tone}`}><MetricIcon className="h-4 w-4" /></div><div className="text-2xl font-semibold text-slate-950">{String(value)}</div><div className="mt-1 text-xs text-slate-500">{String(label)}</div></div>;
          })}
        </section>

        <StrapInventoryTable rows={rows} />
      </div>
    </AdminRouteWorkspace>
  );
}
