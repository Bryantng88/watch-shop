"use server";

import { prisma, DB } from "@/server/db/client";
import * as dto from "../shared/acquisition.dto";
import * as repoAcq from "./acquisition.repo";
import { buildAcqWhere, buildAcqOrderBy, DEFAULT_PAGE_SIZE } from "../shared/filters";
import { AcquisitionType } from "@prisma/client";
import { ItemInput } from "../shared/acquisition.dto";
import {
    asNumber,
    asString,
    computeActiveAcquisitionTotal,
    normalizeSort,
    normalizeStatus,
    normalizeType,
    normalizeView,
    statusFromView,
    toNonEmptyString,
} from "../shared/helper";
import { toDraftItem } from "../shared/acquisition.mapper";
import { ensureItemCanBeCancelled } from "../shared/rules";
import {
    getAiMetaFromDescription,
    getStrapSpecFromDescription,
    getWatchFlagsFromDescription,
} from "../content/acquisition-item-metadata";
import {
    enqueueAcquisitionSpecJob,
    processQueuedAcquisitionSpecJobs,
} from "../ai/acquisition-spec-job.service";
import { createInvoiceFromAcquisition } from "../../../invoices/_servers/invoices.repo";
import { createTechnicalCheckFromAcquisitionTx } from "../../../services/_server/service_request.service";
import { genUniqueProductSku } from "../../../products/_server/helper";

type ExistingAcqItem = Awaited<ReturnType<typeof repoAcq.findAcqItems>>[number];

async function resolveVendorIdForPosting(
    acq: Awaited<ReturnType<typeof repoAcq.getAcqtById>>,
    vendorName: string
) {
    let vendorId = acq?.vendorId ?? null;

    if (!vendorId && vendorName) {
        const vendor = await prisma.vendor.findFirst({
            where: { name: vendorName },
            select: { id: true },
        });
        vendorId = vendor?.id ?? null;
    }

    return vendorId;
}

async function maybeCreateTechnicalCheckForPostedWatch(
    tx: DB,
    input: {
        acqId: string;
        productId: string;
        variantId: string;
        productSku?: string | null;
        variantSku?: string | null;
        primaryImageUrl?: string | null;
        needService?: boolean;
    }
) {
    if (!input.needService) return;

    await createTechnicalCheckFromAcquisitionTx(tx as any, {
        productId: input.productId,
        variantId: input.variantId,
        skuSnapshot: input.productSku ?? input.variantSku ?? null,
        primaryImageUrlSnapshot: input.primaryImageUrl ?? null,
        notes: `Tạo từ phiếu nhập ${input.acqId}: Kiểm tra kỹ thuật tổng quát`,
    });
}

async function createProductForPostedItem(
    tx: DB,
    params: {
        acqId: string;
        vendorId: string;
        item: ExistingAcqItem;
    }
) {
    const { acqId, vendorId, item } = params;

    if (item.productType === "WATCH_STRAP") {
        const strapSpec = getStrapSpecFromDescription(item.description);
        const aiMeta = getAiMetaFromDescription(item.description);
        const sku = await genUniqueProductSku(tx as any, item.productType ?? "WATCH_STRAP");
        const primaryImageUrl = aiMeta?.images?.[0]?.key ?? null;

        const created = await repoAcq.createStrapProduct(tx, {
            title: toNonEmptyString(item.productTitle, "Untitled strap"),
            vendorId,
            primaryImageUrl,
            sku,
            quantity: Number(item.quantity ?? 1),
            unitCost: Number(item.unitCost ?? 0),
            strapSpec,
        });

        await repoAcq.linkAcquisitionItemToProduct(tx, {
            itemId: item.id,
            productId: created.id,
            variantId: created.variants?.[0]?.id ?? null,
        });

        return;
    }

    const watchFlags = getWatchFlagsFromDescription(item.description);
    const aiMeta = getAiMetaFromDescription(item.description);
    const productType = item.productType ?? "WATCH";
    const sku = await genUniqueProductSku(tx as any, productType);
    const primaryImageUrl = aiMeta?.images?.[0]?.key ?? null;

    const createdProduct = await repoAcq.createWatchProduct(tx, {
        title: toNonEmptyString(item.productTitle, "Processing spec..."),
        sku,
        vendorId,
        productType,
        primaryImageUrl,
        nickname: null,
        specStatus: "PENDING",
    });

    const createdVariant = await repoAcq.createWatchVariant(tx, {
        productId: createdProduct.id,
        sku,
        quantity: Number(item.quantity ?? 1),
        unitCost: Number(item.unitCost ?? 0),
    });

    await repoAcq.linkAcquisitionItemToProduct(tx, {
        itemId: item.id,
        productId: createdProduct.id,
        variantId: createdVariant.id,
    });

    await enqueueAcquisitionSpecJob(tx, {
        acquisitionItemId: item.id,
        productId: createdProduct.id,
    });

    await maybeCreateTechnicalCheckForPostedWatch(tx, {
        acqId,
        productId: createdProduct.id,
        variantId: createdVariant.id,
        productSku: createdProduct.sku ?? null,
        variantSku: createdVariant.sku ?? null,
        primaryImageUrl: createdProduct.primaryImageUrl ?? null,
        needService: Boolean(watchFlags?.needService ?? false),
    });
}

async function updateDraftAcquisitionItems(tx: DB, acqId: string, items: ItemInput[]) {
    const existing = await repoAcq.findAcqItems(tx, acqId);
    const existingIds = new Set(existing.map((i) => i.id));
    const receivedIds = new Set(items.map((i) => i.id));
    const toDelete = [...existingIds].filter((id) => !receivedIds.has(id));

    if (toDelete.length > 0) {
        await repoAcq.deleteAcqItems(tx, toDelete);
    }

    for (const item of items) {
        if (item.id.startsWith("tmp-")) {
            await repoAcq.createAcqItem(tx, acqId, item as any);
        } else {
            await repoAcq.updateAcqItem(tx, item as any);
        }
    }
}

async function updatePostedAcquisitionItems(tx: DB, acqId: string, items: ItemInput[]) {
    const existing = await repoAcq.findAcqItems(tx, acqId);
    const existingMap = new Map(existing.map((item) => [item.id, item]));
    const receivedIds = new Set(items.filter((i) => !i.id.startsWith("tmp-")).map((i) => i.id));

    for (const item of existing) {
        if (item.status === "CANCELLED") continue;

        if (!receivedIds.has(item.id)) {
            await ensureItemCanBeCancelled(tx, {
                productId: item.productId,
                productTitle: item.productTitle,
            });

            if (item.productId) {
                await repoAcq.archiveProductForCancelledAcquisitionItem(tx, {
                    productId: item.productId,
                });
            }

            await tx.acquisitionItem.update({
                where: { id: item.id },
                data: {
                    status: "CANCELLED" as any,
                    returnedAt: new Date(),
                    notes: item.notes
                        ? `${item.notes}\n[ADJUSTMENT] Dòng bị hủy khỏi phiếu nhập sau khi đã post.`
                        : "[ADJUSTMENT] Dòng bị hủy khỏi phiếu nhập sau khi đã post.",
                },
            });
        }
    }

    for (const incoming of items) {
        if (incoming.id.startsWith("tmp-")) {
            const created = await repoAcq.createAcqItem(tx, acqId, incoming as any);
            const fresh = await tx.acquisitionItem.findUnique({ where: { id: created.id } });
            if (!fresh) continue;

            await repoAcq.updateAcquisitionItemStatus(tx, {
                itemId: fresh.id,
                toStatus: "SENT",
            });

            const acq = await tx.acquisition.findUnique({
                where: { id: acqId },
                select: { id: true, refNo: true, vendorId: true },
            });

            if (!acq?.vendorId) {
                throw new Error("Phiếu nhập đã post nhưng không có vendor để tạo product mới.");
            }

            await createProductForPostedItem(tx, {
                acqId: acq.refNo ?? acq.id,
                vendorId: acq.vendorId,
                item: fresh as ExistingAcqItem,
            });

            continue;
        }

        const existingItem = existingMap.get(incoming.id);
        if (!existingItem) {
            throw new Error(`Không tìm thấy dòng phiếu nhập ${incoming.id}`);
        }

        if (existingItem.status === "CANCELLED") {
            throw new Error(`Dòng "${existingItem.productTitle}" đã bị hủy, không thể chỉnh sửa tiếp.`);
        }

        await repoAcq.updateAcqItem(tx, incoming as any);

        await repoAcq.updateAcquisitionItemStatus(tx, {
            itemId: incoming.id,
            toStatus: "SENT",
        });

        await repoAcq.syncLinkedProductFromAcquisitionItem(tx, incoming.id);
    }
}

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
        repoAcq.getAcqList(whereList, buildAcqOrderBy(sort as any), (page - 1) * pageSize, pageSize),
        prisma.acquisition.count({ where: whereBase }),
        prisma.acquisition.count({ where: buildAcqWhere({ ...baseFilters, status: ["DRAFT"] } as any) }),
        prisma.acquisition.count({ where: buildAcqWhere({ ...baseFilters, status: ["POSTED"] } as any) }),
        prisma.acquisition.count({ where: buildAcqWhere({ ...baseFilters, status: ["CANCELED"] } as any) }),
    ]);

    const items = rows.map((a) => {
        const activeItems = (a.acquisitionItem ?? []).filter(
            (it) => String(it.status ?? "").toUpperCase() !== "CANCELLED"
        );

        return {
            id: a.id,
            refNo: a.refNo,
            notes: a.notes,
            type: a.type,
            status: a.accquisitionStt,
            vendorName: a.vendor?.name ?? null,
            itemCount: activeItems.length,
            hasInvoice: a._count.invoice > 0,
            createdAt: a.createdAt,
            cost: computeActiveAcquisitionTotal(activeItems),
            updatedAt: a.updatedAt,
            currency: a.currency ?? "VND",
        };
    });

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

export async function getAcquisitionDetail(id: string) {
    const acq = await repoAcq.getAcqtById(id);
    if (!acq) throw new Error("Không tìm thấy phiếu nhập");
    return acq;
}

export async function createAcquisitionWithItem(input: dto.CreateAcquisitionInput) {
    return prisma.$transaction(async (tx) => {
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

        for (const raw of input.items) {
            const item = toDraftItem(raw);
            await repoAcq.createAcqItem(tx, acq.id, item as any);
            total += item.quantity * item.unitCost;
        }

        await repoAcq.updateAcquisitionCost(tx, acq.id, total);
        return { id: acq.id };
    });
}

export async function postAcquisition(acqId: string, vendorName?: string | null) {
    const acq = await repoAcq.getAcqtById(acqId);
    if (!acq) {
        throw new Error("Không tìm thấy phiếu nhập");
    }

    const vendorId = await resolveVendorIdForPosting(acq, vendorName ?? "");
    if (!vendorId) {
        throw new Error("Không tìm thấy vendor để post phiếu");
    }

    const items = acq.acquisitionItem ?? [];
    const newItems = items.filter((item) => !item.productId);
    const existingItems = items.filter((item) => !!item.productId);

    const result = await prisma.$transaction(
        async (tx) => {
            if (existingItems.length > 0) {
                const productIds = Array.from(
                    new Set(existingItems.map((x) => x.productId).filter((v): v is string => !!v))
                );

                if (productIds.length) {
                    const variants = await tx.productVariant.findMany({
                        where: { productId: { in: productIds } },
                        orderBy: [{ updatedAt: "desc" }, { createdAt: "asc" }],
                        select: {
                            id: true,
                            productId: true,
                        },
                    });

                    const variantMap = new Map<string, string>();
                    for (const row of variants) {
                        if (!variantMap.has(row.productId)) {
                            variantMap.set(row.productId, row.id);
                        }
                    }

                    for (const row of existingItems) {
                        if (row.variantId || !row.productId) continue;
                        const resolvedVariantId = variantMap.get(row.productId);
                        if (!resolvedVariantId) continue;

                        await repoAcq.linkAcquisitionItemToProduct(tx, {
                            itemId: row.id,
                            productId: row.productId,
                            variantId: resolvedVariantId,
                        });
                    }
                }
            }

            for (const item of newItems) {
                await createProductForPostedItem(tx, {
                    acqId: acq.refNo ?? acq.id,
                    vendorId,
                    item: item as ExistingAcqItem,
                });
            }

            await repoAcq.updateAcquisitionItemStatus(tx, {
                acquisitionId: acqId,
                fromStatus: "DRAFT",
                toStatus: "SENT",
            });

            return repoAcq.changeDraftToPost(tx, acqId);
        },
        {
            maxWait: 10000,
            timeout: 60000,
        }
    );

    await prisma.$transaction(
        async (tx) => {
            await createInvoiceFromAcquisition(tx as any, acqId);
        },
        {
            maxWait: 10000,
            timeout: 30000,
        }
    );

    if (newItems.length > 0) {
        const jobResult = await processQueuedAcquisitionSpecJobs({
            limit: newItems.length,
            acquisitionItemIds: newItems.map((x) => x.id),
            includeFailed: false,
        });

        console.log("[ACQ_POST][SPEC_JOB_TRIGGERED]", {
            acqId,
            newItems: newItems.length,
            acquisitionItemIds: newItems.map((x) => x.id),
            processed: jobResult?.processed ?? 0,
        });
    }
    return result;
}

export async function postMultipleAcquisitions(acquisitionIds: string[]) {
    const posted: string[] = [];
    const failed: { id: string; error: string }[] = [];

    for (const acqId of acquisitionIds) {
        try {
            const acq = await repoAcq.getAcqtById(acqId);

            if (!acq) {
                failed.push({ id: acqId, error: "Không tìm thấy phiếu nhập" });
                continue;
            }

            if (acq.accquisitionStt !== "DRAFT") {
                failed.push({
                    id: acqId,
                    error: "Chỉ phiếu DRAFT mới được duyệt",
                });
                continue;
            }

            await postAcquisition(acqId, "");
            posted.push(acqId);
        } catch (error) {
            failed.push({
                id: acqId,
                error: error instanceof Error ? error.message : "Bulk post failed",
            });
        }
    }

    return { posted, failed };
}

export async function cancelAcquisition(id: string) {
    const acq = await repoAcq.getAcqtById(id);
    if (!acq) throw new Error("Không tìm thấy phiếu nhập");
    if (acq.accquisitionStt === "POSTED") {
        throw new Error("Không thể hủy phiếu đã đăng");
    }

    return prisma.acquisition.update({
        where: { id },
        data: { accquisitionStt: "CANCELED" as any },
    });
}

export async function updateAcqItem(tx: DB, it: any) {
    return repoAcq.updateAcqItem(tx, it);
}

export async function updateAcquisitionItems(tx: DB, acqId: string, items: ItemInput[]) {
    const acq = await tx.acquisition.findUnique({
        where: { id: acqId },
        select: { accquisitionStt: true },
    });

    if (!acq) {
        throw new Error("Không tìm thấy phiếu nhập");
    }

    if (acq.accquisitionStt === "POSTED") {
        await updatePostedAcquisitionItems(tx, acqId, items);
    } else {
        await updateDraftAcquisitionItems(tx, acqId, items);
    }

    const all = await repoAcq.findAcqItems(tx, acqId);
    const total = computeActiveAcquisitionTotal(all as any[]);

    await repoAcq.updateAcqTotal(tx, acqId, total);

    return { success: true, total };
}

export async function updateAcquisitionWithItems(
    acqId: string,
    payload: {
        vendorId?: string;
        acquiredAt?: string | Date | null;
        currency?: string | null;
        type?: AcquisitionType | string | null;
        notes?: string | null;
        items?: ItemInput[];
    }
) {
    const acq = await repoAcq.getAcqtById(acqId);
    if (!acq) throw new Error("Không tìm thấy phiếu nhập");
    if (acq.accquisitionStt === "CANCELED") {
        throw new Error("Phiếu đã hủy, không thể chỉnh sửa");
    }

    const items = Array.isArray(payload?.items) ? payload.items : [];
    if (!items.length) {
        throw new Error("Phiếu nhập phải còn ít nhất 1 dòng sản phẩm");
    }

    return prisma.$transaction(async (tx) => {
        await tx.acquisition.update({
            where: { id: acqId },
            data: {
                vendorId: payload.vendorId ?? undefined,
                acquiredAt: payload.acquiredAt ? new Date(payload.acquiredAt) : undefined,
                currency: payload.currency ?? undefined,
                type: (payload.type as AcquisitionType | undefined) ?? undefined,
                notes: payload.notes ?? undefined,
            },
            select: { id: true },
        });

        await updateAcquisitionItems(tx, acqId, items);

        const updated = await repoAcq.getAcqtById(acqId, tx);
        return { success: true, id: acqId, acquisition: updated };
    });
}