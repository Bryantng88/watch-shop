"use server";

import { createVendorQuick, getVendorList } from "@/domains/vendor/server";
import { PERMISSIONS } from "@/constants/permissions";
import { requirePermission } from "@/server/auth/requirePermission";

export async function createQuickVendor(input: {
  name: string;
  phone?: string | null;
}) {
  await requirePermission(PERMISSIONS.STRAP_ACQUISITION_CREATE);
  return createVendorQuick(input);
}

export async function listAccessoryVendorsAction() {
  await requirePermission(PERMISSIONS.STRAP_ACQUISITION_VIEW);
  return getVendorList();
}
