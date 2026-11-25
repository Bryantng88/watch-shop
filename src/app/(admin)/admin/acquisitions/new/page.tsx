import { redirect } from "next/navigation";
import { PERMISSIONS } from "@/constants/permissions";
import { requireAnyPermission } from "@/server/auth/requirePermission";

export default async function AcquisitionNewPage() {
  const user=await requireAnyPermission([PERMISSIONS.WATCH_ACQUISITION_CREATE,PERMISSIONS.ACCESSORY_ACQUISITION_CREATE,PERMISSIONS.ACQUISITION_CREATE_ALL]);
  const canCreateWatches=user.roles?.includes("ADMIN") || user.permissions?.includes(PERMISSIONS.WATCH_ACQUISITION_CREATE) || user.permissions?.includes(PERMISSIONS.ACQUISITION_CREATE_ALL);
  redirect(canCreateWatches ? "/admin/acquisitions/watches/new" : "/admin/acquisitions/accessories/new");
}
