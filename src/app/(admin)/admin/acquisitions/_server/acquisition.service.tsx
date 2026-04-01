"use server";

import { prisma, DB } from "@/server/db/client";
import * as dto from "./acquisition.dto";
import { buildAcqWhere, buildAcqOrderBy, DEFAULT_PAGE_SIZE } from "./filters";
import * as repoAcq from "./acquisition.repo";
//mport { CreateAcqWithItemInput } from "./acquisition.dto";
import { AcquisitionType, ProductType } from "@prisma/client";
import * as repoProd from "../../products/_server/product.repo";
import * as repoVendor from "../../vendors/_server/vendor.repo";
import { convertOffsetToTimes } from "framer-motion";
import { Prisma, ProductStatus, ContentStatus } from "@prisma/client";
import { createInvoiceFromAcquisition } from "../../invoices/_servers/invoices.repo";
import { createTechnicalCheckFromAcquisitionTx } from "../../services/_server/service_request.service";
import { ItemInput } from "./acquisition.dto";

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
    if (!description) return null;
    try {
        const parsed = JSON.parse(description);
        if (!parsed || typeof parsed !== "object") return null;
        return parsed as {
            material?: string;
            lugWidthMM?: number;
            buckleWidthMM?: number;
            color?: string;
            quickRelease?: boolean;
            sellPrice?: number;
        };
    } catch {
        return null;
    }
}

function parseWatchFlagsFromDescription(description?: string | null) {
    if (!description) return null;

    try {
        const parsed = JSON.parse(description);
        const candidate = parsed?.watchFlags ?? parsed;
        if (!candidate || typeof candidate !== "object") return null;

        return {
            hasStrap: Boolean((candidate as any).hasStrap ?? false),
            hasClasp: Boolean((candidate as any).hasClasp ?? false),
            needService: Boolean(
                (candidate as any).needService ??
                (candidate as any).needsService ??
                (candidate as any).service ??
                (candidate as any).isServiced ??
                false
            ),
        };
    } catch {
        return null;
    }
}
// Chuyển phiếu sang POSTED
export async function postAcquisition(acqId: string, vendorName: string) {
    const acq = await repoAcq.getAcqtById(acqId);
    if (!acq) throw new Error("Không tìm thấy phiếu nhập");

    let vendorId = acq.vendorId ?? null;

    if (!vendorId && vendorName) {
        const vendor = await prisma.vendor.findFirst({
            where: { name: vendorName },
            select: { id: true },
        });
        vendorId = vendor?.id ?? null;
    }

    if (!vendorId) {
        throw new Error("Không tìm thấy vendor để post phiếu");
    }

    const items = acq.acquisitionItem ?? [];

    const preparedItems = items.map((item) => ({
        item,
        strapSpec:
            item.productType === "WATCH_STRAP"
                ? parseStrapSpecFromDescription(item.description)
                : null,
        watchFlags:
            item.productType !== "WATCH_STRAP"
                ? parseWatchFlagsFromDescription(item.description)
                : null,
    }));

    const existingItems = preparedItems.filter((x) => !!x.item.productId);
    const newStrapItems = preparedItems.filter(
        (x) => !x.item.productId && x.item.productType === "WATCH_STRAP"
    );
    const newWatchItems = preparedItems.filter(
        (x) => !x.item.productId && x.item.productType !== "WATCH_STRAP"
    );

    const result = await prisma.$transaction(
        async (tx) => {
            // backfill variant cho item đã có product
            if (existingItems.length > 0) {
                const productIds = Array.from(
                    new Set(
                        existingItems
                            .map((x) => x.item.productId)
                            .filter((v): v is string => !!v)
                    )
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
                        if (row.item.variantId || !row.item.productId) continue;
                        const resolvedVariantId = variantMap.get(row.item.productId);
                        if (!resolvedVariantId) continue;

                        await tx.acquisitionItem.update({
                            where: { id: row.item.id },
                            data: { variantId: resolvedVariantId },
                        });
                    }
                }
            }

            // tạo strap products
            for (const row of newStrapItems) {
                const { item, strapSpec } = row;

                const created = await tx.product.create({
                    data: {
                        title: item.productTitle,
                        status: ProductStatus.AVAILABLE,
                        contentStatus: ContentStatus.DRAFT,
                        type: "WATCH_STRAP" as any,
                        vendor: { connect: { id: vendorId! } },
                        variants: {
                            create: [
                                {
                                    stockQty: Number(item.quantity ?? 1),
                                    costPrice: new Prisma.Decimal(Number(item.unitCost ?? 0)),
                                    price: new Prisma.Decimal(
                                        strapSpec?.sellPrice != null
                                            ? Number(strapSpec.sellPrice)
                                            : Number(item.unitCost ?? 0)
                                    ),
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
            }

            // tạo watch products
            for (const row of newWatchItems) {
                const { item, watchFlags } = row;

                const created = await tx.product.create({
                    data: {
                        title: item.productTitle,
                        status: ProductStatus.AVAILABLE,
                        contentStatus: ContentStatus.DRAFT,
                        type: (item.productType ?? "WATCH") as any,
                        vendor: { connect: { id: vendorId! } },
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
                        primaryImageUrl: true,
                        variants: {
                            select: { id: true, sku: true },
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

                const shouldCreateServiceRequest = Boolean(
                    watchFlags?.needService ?? watchFlags?.needsService
                );

                if (shouldCreateServiceRequest) {
                    await createTechnicalCheckFromAcquisitionTx(tx as any, {
                        productId: created.id,
                        variantId: created.variants?.[0]?.id ?? null,
                        skuSnapshot: created.variants?.[0]?.sku ?? null,
                        primaryImageUrlSnapshot: created.primaryImageUrl ?? null,
                        notes: `Tạo từ phiếu nhập ${acq.refNo ?? acq.id}: Kiểm tra kỹ thuật tổng quát`,
                    });
                }
            }

            const posted = await repoAcq.changeDraftToPost(tx, acqId);
            return posted;
        },
        {
            maxWait: 10000,
            timeout: 60000,
        }
    );

    // tạo invoice sau transaction chính để tránh timeout
    await prisma.$transaction(
        async (tx) => {
            await createInvoiceFromAcquisition(tx as any, acqId);
        },
        {
            maxWait: 10000,
            timeout: 30000,
        }
    );

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
        } catch (e) {
            failed.push({
                id: acqId,
                error: e instanceof Error ? e.message : "Bulk post failed",
            });
        }
    }

    return { posted, failed };
}
// Hủy phiếu
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
//Update acquisition item
export async function updateAcqItem(tx: DB, it: any) {
    return repoAcq.updateAcqItem(tx, it);
}

export async function updateAcquisitionItems(tx: DB, acqId: string, items: ItemInput[]) {
    const existing = await repoAcq.findAcqItems(tx, acqId);

    const existingIds = new Set(existing.map((i) => i.id));
    const receivedIds = new Set(items.map((i) => i.id));

    const toDelete = [...existingIds].filter((id) => !receivedIds.has(id));

    if (toDelete.length > 0) {
        await repoAcq.deleteAcqItems(tx, toDelete);
    }

    for (const it of items) {
        console.log("in ra id : " + it.id, it.unitPrice);
        if (it.id.startsWith("tmp-")) {
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

export async function updateAcquisitionWithItems(acqId: string, payload: {
    vendorId?: string;
    acquiredAt?: string | Date | null;
    currency?: string | null;
    type?: AcquisitionType | string | null;
    notes?: string | null;
    items?: ItemInput[];
}) {
    const acq = await repoAcq.getAcqtById(acqId);
    if (!acq) throw new Error("Không tìm thấy phiếu nhập");
    if (acq.accquisitionStt !== "DRAFT") {
        throw new Error("Chỉ phiếu DRAFT mới được chỉnh sửa");
    }

    const items = Array.isArray(payload?.items) ? payload.items : [];
    if (!items.length) {
        throw new Error("Phiếu nhập phải có ít nhất 1 dòng sản phẩm");
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

