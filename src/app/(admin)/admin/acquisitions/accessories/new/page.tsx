import { PERMISSIONS } from "@/constants/permissions";
import AccessoryAcquisitionEntryClient from "@/domains/acquisition/client/AccessoryAcquisitionEntryClient";
import { getVendorList } from "@/domains/vendor/server/vendor.service";
import { requireAnyPermission } from "@/server/auth/requirePermission";

export default async function NewAccessoryAcquisitionPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  await requireAnyPermission([PERMISSIONS.ACCESSORY_ACQUISITION_CREATE, PERMISSIONS.ACQUISITION_CREATE_ALL]);
  const query = await searchParams;
  return (
    <AccessoryAcquisitionEntryClient
      vendors={await getVendorList()}
      initialKind={query.type === "clasp" ? "clasp" : "strap"}
    />
  );
}
