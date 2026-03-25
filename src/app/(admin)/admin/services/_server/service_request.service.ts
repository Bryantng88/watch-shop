"use server";

import { prisma } from "@/server/db/client";
import * as maintenanceRepo from "./maintenance.repo";
import { MaintenanceEventType, Prisma } from "@prisma/client";
import { createPayment } from "../../payments/_server/payment.repo";

type CreateMaintenanceLogInput = {
    serviceRequestId: string;
    vendorId?: string | null;
    notes?: string | null;
    servicedAt?: Date | null;
    totalCost?: number | null;
    currency?: string | null;
    paymentMethod?: string | null;
    paymentStatus?: string | null;
    paymentType?: string | null;
    paymentPurpose?: string | null;
};

type AssignVendorInput = {
    serviceRequestId: string;
    vendorId: string;
    reason?: string | null;
    notes?: string | null;
    servicedAt?: Date | null;
    totalCost?: number | null;
    currency?: string | null;
    paymentMethod?: string | null;
    paymentStatus?: string | null;
    paymentType?: string | null;
    paymentPurpose?: string | null;
    setInProgress?: boolean;
};

function serialize(obj: any) {
    return JSON.parse(
        JSON.stringify(obj, (_k, v) => {
            if (v instanceof Date) return v.toISOString();
            if (typeof v === "object" && v?._isDecimal) return Number(v);
            return v;
        }),
    );
}

function mergeVendorNotes(...parts: Array<string | null | undefined>) {
    return parts
        .map((part) => (typeof part === "string" ? part.trim() : ""))
        .filter(Boolean)
        .join("\n");
}

async function createServicePayment(tx: Prisma.TransactionClient, args: {
    amount: number;
    currency: string;
    serviceRequestId: string;
    vendorId: string | null;
    note: string | null;
    paymentMethod?: string | null;
    paymentStatus?: string | null;
    paymentType?: string | null;
    paymentPurpose?: string | null;
}) {
    const amountDec = new Prisma.Decimal(String(args.amount));
    const createdPayment = await createPayment(tx, {
        amount: amountDec,
        currency: args.currency,
        service_request_id: args.serviceRequestId,
        vendor_id: args.vendorId,
        note: args.note,
        method: (args.paymentMethod ?? "CASH") as any,
        status: (args.paymentStatus ?? "UNPAID") as any,
        direction: "OUT" as any,
        type: (args.paymentType ?? "SERVICE") as any,
        purpose: (args.paymentPurpose ?? "MAINTENANCE_COST") as any,
    });

    return {
        paymentId: createdPayment.id,
        paidAmount: amountDec,
        paidAt: new Date(),
    };
}

async function createVendorMaintenanceLog(
    tx: Prisma.TransactionClient,
    args: {
        serviceRequestId: string;
        vendorId: string | null;
        vendorName: string | null;
        technicianId: string | null;
        technicianNameSnap: string | null;
        productId: string | null;
        variantId: string | null;
        brandSnapshot: string | null;
        modelSnapshot: string | null;
        refSnapshot: string | null;
        serialSnapshot: string | null;
        notes: string | null;
        servicedAt: Date | null;
        totalCost: number | null;
        currency: string;
        paymentMethod?: string | null;
        paymentStatus?: string | null;
        paymentType?: string | null;
        paymentPurpose?: string | null;
    },
) {
    let paymentId: string | null = null;
    let paidAmount: Prisma.Decimal | null = null;
    let paidAt: Date | null = null;

    if (args.totalCost != null) {
        const payment = await createServicePayment(tx, {
            amount: args.totalCost,
            currency: args.currency,
            serviceRequestId: args.serviceRequestId,
            vendorId: args.vendorId,
            note: args.notes,
            paymentMethod: args.paymentMethod,
            paymentStatus: args.paymentStatus,
            paymentType: args.paymentType,
            paymentPurpose: args.paymentPurpose,
        });

        paymentId = payment.paymentId;
        paidAmount = payment.paidAmount;
        paidAt = payment.paidAt;
    }

    return maintenanceRepo.createLog(tx, {
        serviceRequestId: args.serviceRequestId,
        eventType: args.totalCost != null ? MaintenanceEventType.COST : MaintenanceEventType.NOTE,
        vendorId: args.vendorId,
        vendorName: args.vendorName,
        technicianId: args.technicianId,
        technicianNameSnap: args.technicianNameSnap,
        notes: args.notes,
        servicedAt: args.servicedAt,
        totalCost: args.totalCost == null ? null : new Prisma.Decimal(String(args.totalCost)),
        currency: args.currency,
        paymentId,
        paidAmount,
        paidAt,
        productId: args.productId,
        variantId: args.variantId,
        brandSnapshot: args.brandSnapshot,
        modelSnapshot: args.modelSnapshot,
        refSnapshot: args.refSnapshot,
        serialSnapshot: args.serialSnapshot,
    });
}

export async function getMaintenancePanelByServiceRequest(serviceRequestId: string) {
    const id = String(serviceRequestId || "").trim();
    if (!id) throw new Error("Missing serviceRequestId");
    return serialize(await maintenanceRepo.getPanelByServiceRequestId(prisma, id));
}

export async function getMaintenanceLogsByServiceRequest(serviceRequestId: string) {
    const id = String(serviceRequestId || "").trim();
    if (!id) throw new Error("Missing serviceRequestId");
    const panel = await maintenanceRepo.getPanelByServiceRequestId(prisma, id);
    return serialize(panel?.logs ?? []);
}

export async function createMaintenanceLogForServiceRequest(input: CreateMaintenanceLogInput) {
    const serviceRequestId = String(input.serviceRequestId || "").trim();
    if (!serviceRequestId) throw new Error("Missing serviceRequestId");

    return prisma.$transaction(async (tx) => {
        const sr = await tx.serviceRequest.findUnique({
            where: { id: serviceRequestId },
            select: {
                id: true,
                vendorId: true,
                vendorNameSnap: true,
                technicianId: true,
                technicianNameSnap: true,
                productId: true,
                variantId: true,
                brandSnapshot: true,
                modelSnapshot: true,
                refSnapshot: true,
                serialSnapshot: true,
            },
        });

        if (!sr) throw new Error("Service request not found");

        const vendorId = (input.vendorId ?? sr.vendorId ?? null) as string | null;
        let vendorName: string | null = sr.vendorNameSnap ?? null;
        if (vendorId) {
            const v = await tx.vendor.findUnique({ where: { id: vendorId }, select: { name: true } });
            vendorName = v?.name ?? vendorName;
        }

        const created = await createVendorMaintenanceLog(tx, {
            serviceRequestId: sr.id,
            vendorId,
            vendorName,
            technicianId: sr.technicianId ?? null,
            technicianNameSnap: sr.technicianNameSnap ?? null,
            notes: input.notes ?? null,
            servicedAt: input.servicedAt ?? null,
            totalCost: input.totalCost ?? null,
            currency: input.currency ?? "VND",
            paymentMethod: input.paymentMethod ?? null,
            paymentStatus: input.paymentStatus ?? null,
            paymentType: input.paymentType ?? null,
            paymentPurpose: input.paymentPurpose ?? null,
            productId: sr.productId ?? null,
            variantId: sr.variantId ?? null,
            brandSnapshot: sr.brandSnapshot ?? null,
            modelSnapshot: sr.modelSnapshot ?? null,
            refSnapshot: sr.refSnapshot ?? null,
            serialSnapshot: sr.serialSnapshot ?? null,
        });

        return serialize(created);
    });
}

export async function assignVendorForServiceRequest(input: AssignVendorInput) {
    const serviceRequestId = String(input.serviceRequestId || "").trim();
    const vendorId = String(input.vendorId || "").trim();
    if (!serviceRequestId) throw new Error("Missing serviceRequestId");
    if (!vendorId) throw new Error("Missing vendorId");

    return prisma.$transaction(async (tx) => {
        const sr = await tx.serviceRequest.findUnique({
            where: { id: serviceRequestId },
            select: {
                id: true,
                vendorId: true,
                vendorNameSnap: true,
                technicianId: true,
                technicianNameSnap: true,
                productId: true,
                variantId: true,
                brandSnapshot: true,
                modelSnapshot: true,
                refSnapshot: true,
                serialSnapshot: true,
            },
        });

        if (!sr) throw new Error("Service request not found");

        const vendor = await tx.vendor.findUnique({ where: { id: vendorId }, select: { id: true, name: true } });
        if (!vendor) throw new Error("Vendor not found");

        const vendorChanged = sr.vendorId !== vendor.id;
        if (vendorChanged) {
            await maintenanceRepo.assignVendorOne(tx, {
                serviceRequestId,
                vendorId: vendor.id,
                vendorName: vendor.name,
                reason: null,
                setInProgress: input.setInProgress !== false,
            });
        }

        const mergedNotes = mergeVendorNotes(input.reason, input.notes);
        const shouldCreateVendorLog = Boolean(mergedNotes) || !!input.servicedAt || input.totalCost != null;

        let createdLog: unknown = null;
        if (shouldCreateVendorLog) {
            createdLog = await createVendorMaintenanceLog(tx, {
                serviceRequestId: sr.id,
                vendorId: vendor.id,
                vendorName: vendor.name,
                technicianId: sr.technicianId ?? null,
                technicianNameSnap: sr.technicianNameSnap ?? null,
                notes: mergedNotes || null,
                servicedAt: input.servicedAt ?? null,
                totalCost: input.totalCost ?? null,
                currency: input.currency ?? "VND",
                paymentMethod: input.paymentMethod ?? null,
                paymentStatus: input.paymentStatus ?? null,
                paymentType: input.paymentType ?? null,
                paymentPurpose: input.paymentPurpose ?? null,
                productId: sr.productId ?? null,
                variantId: sr.variantId ?? null,
                brandSnapshot: sr.brandSnapshot ?? null,
                modelSnapshot: sr.modelSnapshot ?? null,
                refSnapshot: sr.refSnapshot ?? null,
                serialSnapshot: sr.serialSnapshot ?? null,
            });
        }

        if (!vendorChanged && !createdLog) {
            return serialize({ ok: true, skipped: true, reason: "SAME_VENDOR" });
        }

        return serialize({
            ok: true,
            skipped: false,
            vendorChanged,
            logged: Boolean(createdLog),
            log: createdLog,
        });
    });
}
