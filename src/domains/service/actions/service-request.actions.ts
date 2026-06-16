"use server";

import { revalidatePath } from "next/cache";
import {
  assignVendorForServiceRequestApplication,
  bulkAssignVendorAndCreateMaintenanceApplication,
  completeServiceRequestApplication,
  createMaintenanceRecordForServiceRequestApplication,
  createTechnicalChecksFromProductsApplication,
  postServiceRequestsApplication,
} from "../application";
import { createTechnicalIssue } from "../server/issue-board";
function serialize<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj, (_key, value) => {
    if (value instanceof Date) return value.toISOString();
    if (typeof value === "object" && value?._isDecimal) return Number(value);
    return value;
  }));
}

function revalidateService() {
  revalidatePath("/admin/services");
  revalidatePath("/admin/service");
}

export async function createTechnicalChecksFromProductsAction(input: Parameters<typeof createTechnicalChecksFromProductsApplication>[0]) {
  const result = await createTechnicalChecksFromProductsApplication(input);
  revalidateService();
  return serialize(result);
}

export async function postServiceRequestsAction(ids: string[]) {
  const result = await postServiceRequestsApplication(ids);
  revalidateService();
  return serialize(result);
}

export async function completeServiceRequestAction(input: { serviceRequestId: string; note?: string | null }) {
  const result = await completeServiceRequestApplication(input);
  revalidateService();
  revalidatePath(`/admin/services/${input.serviceRequestId}`);
  return serialize(result);
}

export async function assignVendorForServiceRequestAction(input: { serviceRequestId: string; vendorId: string; reason?: string | null; setInProgress?: boolean }) {
  const result = await assignVendorForServiceRequestApplication(input);
  revalidateService();
  revalidatePath(`/admin/services/${input.serviceRequestId}`);
  return serialize(result);
}

export async function bulkAssignVendorAndCreateMaintenanceAction(input: { ids: string[]; vendorId: string | null; reason?: string | null }) {
  const result = await bulkAssignVendorAndCreateMaintenanceApplication(input);
  revalidateService();
  return serialize(result);
}

export async function createMaintenanceRecordForServiceRequestAction(input: Parameters<typeof createMaintenanceRecordForServiceRequestApplication>[0]) {
  const result = await createMaintenanceRecordForServiceRequestApplication(input);
  revalidateService();
  revalidatePath(`/admin/services/${input.serviceRequestId}`);
  return serialize(result);
}
export async function createTechnicalIssueForServiceRequestAction(input: {
  serviceRequestId: string;
  summary: string;
  area?: string | null;
  actionMode?: string | null;
  note?: string | null;
  technicalDetailCatalogId?: string | null;
  vendorId?: string | null;
}) {
  const result = await createTechnicalIssue({
    serviceRequestId: input.serviceRequestId,
    summary: input.summary,
    area: input.area ?? "GENERAL",
    issueType: "CHECK",
    actionMode: input.actionMode ?? "INTERNAL",
    note: input.note ?? null,
    technicalDetailCatalogId: input.technicalDetailCatalogId ?? null,
    vendorId: input.vendorId ?? null,
  });

  revalidateService();
  revalidatePath(`/admin/services/${input.serviceRequestId}`);

  return serialize(result);
}