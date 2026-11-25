import { PERMISSIONS } from "@/constants/permissions";
import AcquisitionFormClient from "@/domains/acquisition/client/AcquisitionFormClient";
import { getVendorList } from "@/domains/vendor/server/vendor.service";
import { requireAnyPermission } from "@/server/auth/requirePermission";

export default async function NewWatchAcquisitionPage() {
  const user = await requireAnyPermission([PERMISSIONS.WATCH_ACQUISITION_CREATE, PERMISSIONS.ACQUISITION_CREATE_ALL]);
  const vendors = await getVendorList();
  const permissions = Array.isArray(user.permissions) ? user.permissions : [];
  const canApprove = permissions.includes(PERMISSIONS.WATCH_ACQUISITION_APPROVE)
    || permissions.includes(PERMISSIONS.ACQUISITION_APPROVE_ALL)
    || user.roles?.includes("ADMIN");
  return <AcquisitionFormClient vendors={vendors} canApprove={canApprove} canCreateAccessories={Boolean(user.roles?.includes("ADMIN") || permissions.includes(PERMISSIONS.ACCESSORY_ACQUISITION_CREATE) || permissions.includes(PERMISSIONS.ACQUISITION_CREATE_ALL))} />;
}
