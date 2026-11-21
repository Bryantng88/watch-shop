import { AdminLinkAction } from "@/domains/shared/ui/admin-design-contract/AdminLinkAction";
import { AdminRouteWorkspace } from "@/domains/shared/ui/admin-design-contract/AdminRouteWorkspace";
import { AdminWorkspaceHeading, AdminWorkspaceHeadingRow } from "@/domains/shared/ui/admin-design-contract/AdminWorkspaceHeading";
import { productEntries } from "@/domains/shared/ui/navigation/section-navigation";

import { PERMISSIONS } from "@/constants/permissions";
import { requirePermission } from "@/server/auth/requirePermission";
import { listStraps } from "@/domains/strap/server";
import StrapInventoryTable from "@/domains/strap/client/StrapInventoryTable";

export default async function StrapListPage() {
  const user = await requirePermission(PERMISSIONS.ACCESSORY_VIEW);
  const rows = await listStraps();

  return (
    <AdminRouteWorkspace title="Sản phẩm" description="Quản lý đồng hồ và dây đồng hồ." filtersUnderSelected navigationLabel="Nhóm sản phẩm" storageKey="admin:products:menu-width:v1" entries={productEntries(user)} selected="/admin/straps">
      <div className="min-w-0 space-y-4">
        <AdminWorkspaceHeadingRow><AdminWorkspaceHeading>Dây đồng hồ</AdminWorkspaceHeading>
          <div className="flex flex-wrap gap-2">
            <AdminLinkAction variant="quiet" density="compact" href="/admin/straps/catalog">Quản lý danh mục</AdminLinkAction>
            <AdminLinkAction variant="quiet" density="compact" href="/admin/straps/replenishment">Danh sách cần đặt</AdminLinkAction>
          </div>
        </AdminWorkspaceHeadingRow>

        <StrapInventoryTable rows={rows} />
      </div>
    </AdminRouteWorkspace>
  );
}
