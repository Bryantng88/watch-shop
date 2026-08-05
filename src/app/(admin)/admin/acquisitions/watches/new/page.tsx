import { PERMISSIONS } from "@/constants/permissions";
import AcquisitionFormClient from "@/domains/acquisition/client/AcquisitionFormClient";
import { getVendorList } from "@/domains/vendor/server/vendor.service";
import { requireAnyPermission } from "@/server/auth/requirePermission";

export default async function NewWatchAcquisitionPage() {
  await requireAnyPermission([PERMISSIONS.WATCH_ACQUISITION_CREATE, PERMISSIONS.ACQUISITION_CREATE_ALL]);
  const vendors = await getVendorList();
  return <div className="mx-auto w-full max-w-[1600px] px-4 py-6 lg:px-6"><AcquisitionFormClient vendors={vendors} /></div>;
}
