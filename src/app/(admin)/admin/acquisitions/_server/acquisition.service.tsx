"use server";

import { prisma, DB } from "@/server/db/client";
import * as dto from "./acquisition.dto";
import { buildAcqWhere, buildAcqOrderBy, DEFAULT_PAGE_SIZE } from "./filters";
import * as repoAcq from "./acquisition.repo";
//mport { CreateAcqWithItemInput } from "./acquisition.dto";
import { AcquisitionStatus, AcquisitionType, ProductType, Prisma, ServiceDetail, ServiceRequestStatus, ServiceScope } from "@prisma/client";
import { createInvoiceFromAcquisition } from "../../invoices/_servers/invoices.repo";
import { ItemInput } from "./acquisition.dto";
import { getStrapSpecFromDescription, getWatchFlagsFromDescription } from "./item-metadata";
import { createFromProductTx } from "../../services/_server/service_request.service";

type AcqViewKey = "all" | "draft" | "posted" | "canceled";

const firstValue = (v: unknown) => (Array.isArray(v) ? v[0] : v);

function asString(v: unknown) {
    const raw = firstValue(v);
    if (raw == null || raw === "") return undefined;
    return String(raw);
}

function asNumber(v: unknown, fallback: number) {
    const raw = firstValue(v);
    const n = Number(raw);
    return Number.isFinite(n) && n > 0 ? n : fallback;
}

function normalizeSort(v: unknown) {
    const raw = String(firstValue(v) ?? "updatedDesc");
    if (
        raw === "updatedDesc" ||
        raw === "updatedAsc" ||
        raw === "createdDesc" ||
        raw === "createdAsc" ||
        raw === "acquiredDesc" ||
        raw === "acquiredAsc"
    ) {
        return raw;
    }
    return "updatedDesc";
}

function normalizeView(v: unknown): AcqViewKey {
    const raw = String(firstValue(v) ?? "all").toLowerCase();
    if (raw === "draft" || raw === "posted" || raw === "canceled") return raw;
    return "all";
}

function normalizeType(v: unknown) {
    const raw = String(firstValue(v) ?? "").toUpperCase();
    if (
        raw === "PURCHASE" ||
        raw === "CONSIGNMENT" ||
        raw === "TRADE_IN" ||
        raw === "BUY_BACK"
    ) {
        return raw;
    }
    return undefined;
}

function normalizeStatus(v: unknown) {
    const raw = String(firstValue(v) ?? "").toUpperCase();
    if (raw === "DRAFT" || raw === "POSTED" || raw === "CANCELED") return raw;
    return undefined;
}

function statusFromView(view: AcqViewKey) {
    switch (view) {
        case "draft":
            return "DRAFT";
        case "posted":
            return "POSTED";
        case "canceled":
            return "CANCELED";
        default:
            return undefined;
    }
}

// List cho admin table
export async function getAdminAcquisitionList(raw: Record<string, unknown>) {
    const page = Math.max(1, asNumber(raw.page, 1));
    const pageSize = Math.max(1, Math.min(200, asNumber(raw.pageSize, DEFAULT_PAGE_SIZE)));

    const q = asString(raw.q)?.trim();
    const vendorId = asString(raw.vendorId);
    const type = normalizeType(raw.type);
    const sort = normalizeSort(raw.sort);
    const acquiredFrom = asString(raw.from ?? raw.acquiredFrom);
    const acquiredTo = asString(raw.to ?? raw.acquiredTo);
    const view = normalizeView(raw.view);
    const explicitStatus = normalizeStatus(raw.status);
    const activeStatus = explicitStatus ?? statusFromView(view);

    const baseFilters = {
        page,
        pageSize,
        q,
        vendorIds: vendorId ? [vendorId] : undefined,
        customerIds: undefined,
        type: type ? [type] : undefined,
        status: undefined,
        acquiredFrom,
        acquiredTo,
        hasInvoice: undefined,
        sort,
    } as any;

    const listFilters = {
        ...baseFilters,
        status: activeStatus ? [activeStatus] : undefined,
    } as any;

    const whereBase = buildAcqWhere(baseFilters);
    const whereList = buildAcqWhere(listFilters);

    const [{ rows, total }, all, draft, posted, canceled] = await Promise.all([
        repoAcq.getAcqList(
            whereList,
            buildAcqOrderBy(sort as any),
            (page - 1) * pageSize,
            pageSize
        ),
        prisma.acquisition.count({ where: whereBase }),
        prisma.acquisition.count({
            where: buildAcqWhere({ ...baseFilters, status: ["DRAFT"] } as any),
        }),
        prisma.acquisition.count({
            where: buildAcqWhere({ ...baseFilters, status: ["POSTED"] } as any),
        }),
        prisma.acquisition.count({
            where: buildAcqWhere({ ...baseFilters, status: ["CANCELED"] } as any),
        }),
    ]);

    const items = rows.map((a) => ({
        id: a.id,
        refNo: a.refNo,
        notes: a.notes,
        type: a.type,
        status: a.accquisitionStt,
        vendorName: a.vendor?.name ?? null,
        itemCount: a._count.acquisitionItem,
        hasInvoice: a._count.invoice > 0,
        createdAt: a.createdAt,
        cost: a.cost,
        updatedAt: a.updatedAt,
        currency: a.currency ?? "VND",
    }));

    return {
        items,
        total,
        page,
        pageSize,
        counts: {
            all,
            draft,
            posted,
            canceled,
        },
    };
}

// Chi tiết
export async function getAcquisitionDetail(id: string) {
    const acq = await repoAcq.getAcqtById(id);
    if (!acq) throw new Error("Không tìm thấy phiếu nhập");
    return acq;
}

// Tạo mới (Draft)

// Tạo phiếu nhập mới (DRAFT) và thêm item đầu tiên
export async function createAcquisitionWithItem(input: dto.CreateAcquisitionInput) {
    return await prisma.$transaction(async (tx) => {
        let vendorId = input.vendorId;

        if (!vendorId && input.quickVendorName) {
            const newVendor = await tx.vendor.create({
                data: { name: input.quickVendorName },
            });
            vendorId = newVendor.id;
        }

        if (!vendorId) {
            throw new Error("Thiếu vendor");
        }

        const acq = await repoAcq.createDraft(tx, {
            vendorId,
            currency: input.currency,
            type: input.type,
            createdAt: input.createdAt ? new Date(input.createdAt) : undefined,
            notes: input.notes,
        });

        let total = 0;

        for (const it of input.items) {
            await repoAcq.createAcqItem(tx, acq.id, it);
            total += (it.quantity ?? 1) * (it.unitCost ?? 0);
        }

        await repoAcq.updateAcquisitionCost(tx, acq.id, total);
        return { id: acq.id };
    });
}
function parseStrapSpecFromDescription(description?: string | null) {
    return getStrapSpecFromDescription(description);
}

function parseWatchFlagsFromDescription(description?: string | null) {
    return getWatchFlagsFromDescription(description);
}

const OPEN_INTERNAL_SERVICE_STATUSES = [
    ServiceRequestStatus.DRAFT,
    ServiceRequestStatus.DIAGNOSING,
    ServiceRequestStatus.WAIT_APPROVAL,
    ServiceRequestStatus.IN_PROGRESS,
] as const;

async function getAutoInternalServiceCatalogs(tx: DB) {
    const rows = await tx.serviceCatalog.findMany({
        where: {
            isActive: true,
            detail: { in: [ServiceDetail.BASIC, ServiceDetail.SPA] as any },
        },
        orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
        select: {
            id: true,
            detail: true,
            code: true,
            name: true,
        },
    });

    const basic = rows.find((row: any) => row.detail === ServiceDetail.BASIC) ?? null;
    const spa = rows.find((row: any) => row.detail === ServiceDetail.SPA) ?? null;

    return {
        basicId: basic?.id ?? null,
        spaId: spa?.id ?? null,
    };
}

async function ensureInternalServiceRequestsForWatchTx(
    tx: DB,
    catalogs: { basicId: string | null; spaId: string | null },
    input: {
        productId: string;
        flags: { isServiced?: boolean; isSpa?: boolean };
        acquisitionLabel: string;
        productTitle?: string | null;
    }
) {
    const needsBasic = !input.flags?.isServiced;
    const needsSpa = !input.flags?.isSpa;

    if (!needsBasic && !needsSpa) return;

    const tasks = [
        needsBasic && catalogs.basicId
            ? {
                serviceCatalogId: catalogs.basicId,
                note: `Tự động tạo từ phiếu nhập ${input.acquisitionLabel}${input.productTitle ? ` · ${input.productTitle}` : ""} · Chưa service`,
            }
            : null,
        needsSpa && catalogs.spaId
            ? {
                serviceCatalogId: catalogs.spaId,
                note: `Tự động tạo từ phiếu nhập ${input.acquisitionLabel}${input.productTitle ? ` · ${input.productTitle}` : ""} · Chưa spa`,
            }
            : null,
    ].filter(Boolean) as Array<{ serviceCatalogId: string; note: string }>;

    for (const task of tasks) {
        const existing = await tx.serviceRequest.findFirst({
            where: {
                productId: input.productId,
                servicecatalogid: task.serviceCatalogId,
                scope: ServiceScope.INTERNAL,
                status: { in: OPEN_INTERNAL_SERVICE_STATUSES as any },
            },
            select: { id: true },
        });

        if (existing) continue;

        await createFromProductTx(tx as any, {
            productId: input.productId,
            serviceCatalogId: task.serviceCatalogId,
            scope: ServiceScope.INTERNAL,
            notes: task.note,
        });
    }
}

// Chuyển phiếu sang POSTED
export async function postAcquisition(acqId: string, vendorName: string) {
    return prisma.$transaction(async (tx) => {
        const acq = await repoAcq.getAcqtById(acqId, tx);
        if (!acq) throw new Error("Không tìm thấy phiếu nhập");

        let vendorId = acq.vendorId ?? null;

        if (!vendorId && vendorName) {
            const vendor = await tx.vendor.findFirst({
                where: { name: vendorName },
                select: { id: true },
            });
            vendorId = vendor?.id ?? null;
        }

        if (!vendorId) {
            throw new Error("Không tìm thấy vendor để post phiếu");
        }

        const items = acq.acquisitionItem ?? [];
        const acquisitionLabel = acq.refNo || acq.id;
        const autoInternalCatalogs = await getAutoInternalServiceCatalogs(tx);

        for (const item of items) {
            if (item.productId) {
                if (!item.variantId) {
                    const resolvedVariantId = await repoAcq.resolveVariantIdForProduct(
                        tx,
                        item.productId
                    );

                    if (resolvedVariantId) {
                        await tx.acquisitionItem.update({
                            where: { id: item.id },
                            data: { variantId: resolvedVariantId },
                        });
                    }
                }

                if ((item.productType ?? "WATCH") === "WATCH") {
                    const watchFlags = parseWatchFlagsFromDescription(item.description);
                    await tx.watchSpec.upsert({
                        where: { productId: item.productId },
                        update: {
                            hasStrap: !!watchFlags.hasStrap,
                            isServiced: !!watchFlags.isServiced,
                            hasClasp: !!watchFlags.hasClasp,
                            isSpa: !!watchFlags.isSpa,
                        } as any,
                        create: {
                            productId: item.productId,
                            hasStrap: !!watchFlags.hasStrap,
                            isServiced: !!watchFlags.isServiced,
                            hasClasp: !!watchFlags.hasClasp,
                            isSpa: !!watchFlags.isSpa,
                        } as any,
                    });

                    await ensureInternalServiceRequestsForWatchTx(tx, autoInternalCatalogs, {
                        productId: item.productId,
                        flags: watchFlags,
                        acquisitionLabel,
                        productTitle: item.productTitle,
                    });
                }
                continue;
            }

            if (item.productType === "WATCH_STRAP") {
                const strapSpec = parseStrapSpecFromDescription(item.description);

                const created = await tx.product.create({
                    data: {
                        title: item.productTitle,
                        status: "DRAFT" as any,
                        type: "WATCH_STRAP" as any,
                        vendor: { connect: { id: vendorId } },
                        variants: {
                            create: [
                                {
                                    stockQty: Number(item.quantity ?? 1),
                                    price: new Prisma.Decimal(
                                        strapSpec?.sellPrice != null
                                            ? Number(strapSpec.sellPrice)
                                            : Number(item.unitCost ?? 0)
                                    ),
                                    costPrice: new Prisma.Decimal(Number(item.unitCost ?? 0)),
                                    availabilityStatus: "HIDDEN" as any,
                                    strapSpec: {
                                        create: {
                                            lugWidthMM: Number(strapSpec?.lugWidthMM ?? 20),
                                            buckleWidthMM: Number(strapSpec?.buckleWidthMM ?? 18),
                                            color: strapSpec?.color ?? "Black",
                                            material: (strapSpec?.material as any) ?? "LEATHER",
                                            quickRelease:
                                                strapSpec?.quickRelease == null
                                                    ? true
                                                    : Boolean(strapSpec.quickRelease),
                                        },
                                    },
                                },
                            ],
                        },
                    },
                    select: {
                        id: true,
                        variants: {
                            select: { id: true },
                            take: 1,
                        },
                    },
                });

                await tx.acquisitionItem.update({
                    where: { id: item.id },
                    data: {
                        productId: created.id,
                        variantId: created.variants?.[0]?.id ?? null,
                    },
                });

                continue;
            }

            const watchFlags = parseWatchFlagsFromDescription(item.description);

            const created = await tx.product.create({
                data: {
                    title: item.productTitle,
                    status: "DRAFT" as any,
                    type: (item.productType ?? "WATCH") as any,
                    vendor: { connect: { id: vendorId } },
                    ...(item.productType === "WATCH"
                        ? {
                            watchSpec: {
                                create: {
                                    hasStrap: !!watchFlags.hasStrap,
                                    isServiced: !!watchFlags.isServiced,
                                    hasClasp: !!watchFlags.hasClasp,
                                    isSpa: !!watchFlags.isSpa,
                                } as any,
                            },
                        }
                        : {}),
                    variants: {
                        create: [
                            {
                                stockQty: Number(item.quantity ?? 1),
                                costPrice: new Prisma.Decimal(Number(item.unitCost ?? 0)),
                                availabilityStatus: "HIDDEN" as any,
                            },
                        ],
                    },
                },
                select: {
                    id: true,
                    variants: {
                        select: { id: true },
                        take: 1,
                    },
                },
            });

            await tx.acquisitionItem.update({
                where: { id: item.id },
                data: {
                    productId: created.id,
                    variantId: created.variants?.[0]?.id ?? null,
                },
            });

            if ((item.productType ?? "WATCH") === "WATCH") {
                await ensureInternalServiceRequestsForWatchTx(tx, autoInternalCatalogs, {
                    productId: created.id,
                    flags: watchFlags,
                    acquisitionLabel,
                    productTitle: item.productTitle,
                });
            }
        }

        await createInvoiceFromAcquisition(tx, acqId);
        return repoAcq.changeDraftToPost(tx, acqId);
    }, {
        maxWait: 10000,
        timeout: 60000,
    });
}
export async function postMultipleAcquisitions(items: { id: string; vendor: string }[]) {
    const results = [];
    for (const acq of items) {
        try {
            await postAcquisition(acq.id, acq.vendor);
            results.push({ id: acq.id, ok: true });
        } catch (e) {
            results.push({ id: acq.id, ok: false, error: (e as Error).message });
        }
    }
    return results;
}

export async function updateAcquisitionWithItems(
    id: string,
    input: {
        vendorId?: string;
        acquiredAt?: string | Date;
        currency?: string;
        type?: AcquisitionType;
        notes?: string | null;
        items?: ItemInput[];
    }
) {
    return prisma.$transaction(async (tx) => {
        const existing = await repoAcq.getAcqtById(id, tx);
        if (!existing) throw new Error("Không tìm thấy phiếu nhập");
        if (existing.accquisitionStt === AcquisitionStatus.POSTED) {
            throw new Error("Không thể sửa phiếu đã duyệt");
        }

        await tx.acquisition.update({
            where: { id },
            data: {
                ...(input.vendorId !== undefined ? { vendorId: input.vendorId || null } : {}),
                ...(input.acquiredAt !== undefined
                    ? { acquiredAt: input.acquiredAt ? new Date(input.acquiredAt) : existing.acquiredAt }
                    : {}),
                ...(input.currency !== undefined ? { currency: input.currency || null } : {}),
                ...(input.type !== undefined ? { type: input.type } : {}),
                ...(input.notes !== undefined ? { notes: input.notes ?? null } : {}),
            },
        });

        await updateAcquisitionItems(tx, id, input.items ?? []);
        return { success: true, id };
    });
}

// Hủy phiếu
export async function cancelAcquisition(id: string) {
    const acq = await repoAcq.getAcqtById(id);
    if (!acq) throw new Error("Không tìm thấy phiếu nhập");
    if (acq.accquisitionStt === AcquisitionStatus.POSTED) throw new Error("Không thể huỷ phiếu đã duyệt");
    return prisma.acquisition.update({
        where: { id },
        data: { accquisitionStt: AcquisitionStatus.CANCELED },
        select: { id: true, accquisitionStt: true },
    });
}

//Update acquisition item
export async function updateAcqItem(tx: DB, it: any) {
    return repoAcq.updateAcqItem(tx, it);
}

export async function updateAcquisitionItems(tx: DB, acqId: string, items: ItemInput[]) {
    const existing = await repoAcq.findAcqItems(tx, acqId);

    const existingIds = new Set(existing.map((i): string => i.id));
    const receivedIds = new Set(items.map((i) => i.id).filter((id): id is string => typeof id === "string"));

    const toDelete = Array.from(existingIds as Set<string>).filter((id) => !receivedIds.has(id));

    if (toDelete.length > 0) {
        await repoAcq.deleteAcqItems(tx, toDelete);
    }

    for (const it of items) {
        const itemId = typeof it.id === "string" ? it.id : "tmp-new";
        if (itemId.startsWith("tmp-")) {
            await repoAcq.createAcqItem(tx, acqId, it);
        } else {
            await updateAcqItem(tx, it);
        }
    }

    const all = await repoAcq.findAcqItems(tx, acqId);

    const total = all.reduce((s, r) => s + Number(r.quantity) * Number(r.unitCost ?? 0), 0);

    await repoAcq.updateAcqTotal(tx, acqId, total);

    return { success: true, total };
}