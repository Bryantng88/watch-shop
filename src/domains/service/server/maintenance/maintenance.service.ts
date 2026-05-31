"use server";

import { prisma } from "@/server/db/client";
import * as maintenanceRepo from "./maintenance.repo";
import {
  assignVendorForServiceRequestApplication,
  createMaintenanceRecordForServiceRequestApplication,
} from "../../application";

function serialize<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj, (_key, value) => {
    if (value instanceof Date) return value.toISOString();
    if (typeof value === "object" && value?._isDecimal) return Number(value);
    return value;
  }));
}

export async function getMaintenancePanelByServiceRequest(serviceRequestId: string) {
  const id = String(serviceRequestId || "").trim();
  if (!id) throw new Error("Missing serviceRequestId");
  return serialize(await maintenanceRepo.getPanelByServiceRequestId(prisma, id));
}

export async function getMaintenanceRecordsByServiceRequest(serviceRequestId: string) {
  const id = String(serviceRequestId || "").trim();
  if (!id) throw new Error("Missing serviceRequestId");
  const panel = await maintenanceRepo.getPanelByServiceRequestId(prisma, id);
  return serialize(panel?.logs ?? []);
}

export const createMaintenanceRecordForServiceRequest = createMaintenanceRecordForServiceRequestApplication;
export const assignVendorForServiceRequest = assignVendorForServiceRequestApplication;

// Backward-compatible aliases
export const getMaintenanceLogsByServiceRequest = getMaintenanceRecordsByServiceRequest;
export const createMaintenanceLogForServiceRequest = createMaintenanceRecordForServiceRequest;
