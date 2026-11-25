import { PERMISSIONS } from "@/constants/permissions";
import AccessoryAcquisitionEntryClient from "@/domains/acquisition/client/AccessoryAcquisitionEntryClient";
import { getVendorList } from "@/domains/vendor/server/vendor.service";
import { requireAnyPermission } from "@/server/auth/requirePermission";
import { listActiveStrapColors } from "@/domains/strap/server";

export default async function NewAccessoryAcquisitionPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const user = await requireAnyPermission([PERMISSIONS.ACCESSORY_ACQUISITION_CREATE, PERMISSIONS.ACQUISITION_CREATE_ALL]);
  const query = await searchParams;
  const [vendors, strapColors] = await Promise.all([
    getVendorList(),
    listActiveStrapColors(),
  ]);
  return (
    <AccessoryAcquisitionEntryClient
      canCreateWatches={Boolean(user.roles?.includes("ADMIN") || user.permissions?.includes(PERMISSIONS.WATCH_ACQUISITION_CREATE) || user.permissions?.includes(PERMISSIONS.ACQUISITION_CREATE_ALL))}
      vendors={vendors}
      strapColors={strapColors}
      initialKind={query.type === "clasp" ? "clasp" : "strap"}
    />
  );
}
