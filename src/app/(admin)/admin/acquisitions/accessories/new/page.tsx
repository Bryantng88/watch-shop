import { PERMISSIONS } from "@/constants/permissions";
import AccessoryAcquisitionEntryClient from "@/domains/acquisition/client/AccessoryAcquisitionEntryClient";
import { getVendorList } from "@/domains/vendor/server/vendor.service";
import { requirePermission } from "@/server/auth/requirePermission";

export default async function NewAccessoryAcquisitionPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  await requirePermission(PERMISSIONS.STRAP_ACQUISITION_CREATE);
  const query = await searchParams;
  return (
    <AccessoryAcquisitionEntryClient
      vendors={await getVendorList()}
      initialKind={query.type === "clasp" ? "clasp" : "strap"}
    />
  );
}
