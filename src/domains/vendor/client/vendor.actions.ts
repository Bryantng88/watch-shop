"use server";

import { createVendorQuick, getVendorList } from "@/domains/vendor/server";
import { PERMISSIONS } from "@/constants/permissions";
import { requireAnyPermission } from "@/server/auth/requirePermission";

export async function createQuickVendor(input: {
  name: string;
  phone?: string | null;
}) {
  await requireAnyPermission([PERMISSIONS.ACCESSORY_ACQUISITION_CREATE, PERMISSIONS.ACQUISITION_CREATE_ALL]);
  return createVendorQuick(input);
}

export async function listAccessoryVendorsAction() {
  await requireAnyPermission([PERMISSIONS.ACCESSORY_ACQUISITION_VIEW, PERMISSIONS.ACQUISITION_VIEW_ALL]);
  return getVendorList();
}
