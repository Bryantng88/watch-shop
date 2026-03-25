"use server";

import { prisma, DB } from "@/server/db/client";
import * as dto from "./acquisition.dto";
import { buildAcqWhere, buildAcqOrderBy, DEFAULT_PAGE_SIZE } from "./filters";
import * as repoAcq from "./acquisition.repo";
import { Prisma, ProductStatus, ProductType } from "@prisma/client";
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
        if (!candidate || typeof candidate !== 'object') return null;
        return {
            hasStrap: Boolean(candidate.hasStrap ?? false),
            hasClasp: Boolean(candidate.hasClasp ?? false),
            isServiced: Boolean(candidate.isServiced ?? false),
            isSpa: Boolean(candidate.isSpa ?? false),
        };
    } catch {
        return null;
    }
}


type AcquisitionDetail = NonNullable<Awaited<ReturnType<typeof repoAcq.getAcqtById>>>;
type AcquisitionPostItem = AcquisitionDetail["acquisitionItem"][number];
type WatchFlagsSnapshot = ReturnType<typeof parseWatchFlagsFromDescription>;

function buildTechnicalCheckReasons(watchFlags: WatchFlagsSnapshot) {
    const reasons: string[] = [];
    if (!watchFlags) reasons.push("Chưa có metadata tiếp nhận");
    if (watchFlags && !watchFlags.isServiced) reasons.push("Cần kiểm tra service");
    if (watchFlags && !watchFlags.isSpa) reasons.push("Cần kiểm tra spa");
    return reasons;
}

function shouldCreateTechnicalCheck(watchFlags: WatchFlagsSnapshot) {
    return !watchFlags || !watchFlags.isServiced || !watchFlags.isSpa;
}

function buildTechnicalCheckNote(acq: AcquisitionDetail, reasons: string[]) {
    return `Tạo từ phiếu nhập ${acq.refNo ?? acq.id}: ${reasons.join("; ") || "Kiểm tra kỹ thuật tổng quát"}`;
}

async function resolveVendorIdForPosting(tx: DB, acq: AcquisitionDetail, vendorName?: string | null) {
    let vendorId = acq.vendorId ?? null;
    const normalizedVendorName = vendorName?.trim();

    if (!vendorId && normalizedVendorName) {
        const vendor = await tx.vendor.findFirst({
            where: { name: normalizedVendorName },
            select: { id: true },
        });
        vendorId = vendor?.id ?? null;
    }

    if (!vendorId) {
        throw new Error("Không tìm thấy vendor để post phiếu");
    }

    return vendorId;
}

async function linkProductToAcquisitionItem(
    tx: DB,
    itemId: string,
    input: { productId: string; variantId?: string | null }
) {
    await tx.acquisitionItem.update({
        where: { id: itemId },
        data: {
            productId: input.productId,
            variantId: input.variantId ?? null,
        },
    });
}

async function markProductPosted(tx: DB, productId: string) {
    await tx.product.update({
        where: { id: productId },
        data: { status: ProductStatus.POSTED },
    });
}

async function ensureLinkedItemVariant(tx: DB, item: AcquisitionPostItem) {
    if (!item.productId) {
        throw new Error(`Item ${item.id} chưa liên kết product`);
    }

    const resolvedVariantId = item.variantId ?? await repoAcq.resolveVariantIdForProduct(tx, item.productId);

    if (resolvedVariantId && resolvedVariantId !== item.variantId) {
        await linkProductToAcquisitionItem(tx, item.id, {
            productId: item.productId,
            variantId: resolvedVariantId,
        });
    }

    return {
        productId: item.productId,
        variantId: resolvedVariantId ?? item.variantId ?? null,
    };
}

async function createStrapProductFromAcquisitionItem(
    tx: DB,
    item: AcquisitionPostItem,
    vendorId: string
) {
    const strapSpec = parseStrapSpecFromDescription(item.description);

    const created = await tx.product.create({
        data: {
            title: item.productTitle,
            status: ProductStatus.DRAFT,
            type: ProductType.WATCH_STRAP,
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

    const variantId = created.variants?.[0]?.id ?? null;
    await linkProductToAcquisitionItem(tx, item.id, {
        productId: created.id,
        variantId,
    });
    await markProductPosted(tx, created.id);

    return { productId: created.id, variantId };
}

async function createWatchProductFromAcquisitionItem(
    tx: DB,
    item: AcquisitionPostItem,
    vendorId: string
) {
    const created = await tx.product.create({
        data: {
            title: item.productTitle,
            status: ProductStatus.DRAFT,
            type: item.productType ?? ProductType.WATCH,
            vendor: { connect: { id: vendorId } },
            variants: {
                create: [
                    {
                        stockQty: Number(item.quantity ?? 1),
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

    const variantId = created.variants?.[0]?.id ?? null;
    await linkProductToAcquisitionItem(tx, item.id, {
        productId: created.id,
        variantId,
    });

    return { productId: created.id, variantId };
}

async function finalizeWatchProductForPosting(
    tx: DB,
    acq: AcquisitionDetail,
    item: AcquisitionPostItem,
    input: { productId: string; variantId?: string | null }
) {
    const watchFlags = parseWatchFlagsFromDescription(item.description);
    if (!shouldCreateTechnicalCheck(watchFlags)) {
        await markProductPosted(tx, input.productId);
        return;
    }

    const reasons = buildTechnicalCheckReasons(watchFlags);

    try {
        await createTechnicalCheckFromAcquisitionTx(tx, {
            productId: input.productId,
            variantId: input.variantId ?? null,
            notes: buildTechnicalCheckNote(acq, reasons),
        });
    } catch (error) {
        console.error("CREATE_TECH_CHECK_FAILED", {
            acqId: acq.id,
            itemId: item.id,
            productId: input.productId,
            reasons,
            error,
        });
        throw error;
    }
}

async function processAcquisitionItemForPosting(
    tx: DB,
    acq: AcquisitionDetail,
    item: AcquisitionPostItem,
    vendorId: string
) {
    if (item.productId) {
        const linked = await ensureLinkedItemVariant(tx, item);
        if (item.productType === ProductType.WATCH_STRAP) {
            await markProductPosted(tx, linked.productId);
            return;
        }

        await finalizeWatchProductForPosting(tx, acq, item, linked);
        return;
    }

    if (item.productType === ProductType.WATCH_STRAP) {
        await createStrapProductFromAcquisitionItem(tx, item, vendorId);
        return;
    }

    const created = await createWatchProductFromAcquisitionItem(tx, item, vendorId);
    await finalizeWatchProductForPosting(tx, acq, item, created);
}

// Chuyển phiếu sang POSTED
export async function postAcquisition(acqId: string, vendorName: string) {
    return prisma.$transaction(async (tx) => {
        const acq = await repoAcq.getAcqtById(acqId, tx);
        if (!acq) throw new Error("Không tìm thấy phiếu nhập");
        if (acq.accquisitionStt !== "DRAFT") {
            throw new Error("Chỉ phiếu DRAFT mới được duyệt");
        }

        const items = acq.acquisitionItem ?? [];
        if (!items.length) {
            throw new Error("Không thể duyệt phiếu trống");
        }

        const vendorId = await resolveVendorIdForPosting(tx, acq, vendorName);

        for (const item of items) {
            await processAcquisitionItemForPosting(tx, acq, item, vendorId);
        }

        await createInvoiceFromAcquisition(tx, acqId);
        return repoAcq.changeDraftToPost(tx, acqId);
    });
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
export async function updateAcquisitionItems(tx: DB, acqId: string, items: ItemInput[]) {
    const existing = await repoAcq.findAcqItems(tx, acqId);

    const existingIds = new Set(existing.map((i) => i.id));
    const receivedIds = new Set(items.map((i) => i.id));
    const toDelete = [...existingIds].filter((id) => !receivedIds.has(id));

    if (toDelete.length > 0) {
        await repoAcq.deleteAcqItems(tx, toDelete);
    }

    for (const it of items) {
        if (it.id.startsWith("tmp-")) {
            await repoAcq.createAcqItem(tx, acqId, it);
        } else {
            await repoAcq.updateAcqItem(tx, it);
        }
    }

    const all = await repoAcq.findAcqItems(tx, acqId);
    const total = all.reduce((sum, row) => sum + Number(row.quantity) * Number(row.unitCost ?? 0), 0);

    await repoAcq.updateAcqTotal(tx, acqId, total);

    return { success: true, total };
}