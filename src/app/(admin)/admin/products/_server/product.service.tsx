import { CreateProductWithOutAcqInput, CreateProductWithOutAcqSchema } from "./product.dto";
import { prisma, DB } from "@/server/db/client";
import { ProductStatus } from "@prisma/client";
import * as ultil from "./helper"
import * as prodRepo from "./product.repo"
import { AdminFiltersSchema } from "./product.dto";
import { mapProductToAdminRow } from "./product.mapper";

const asDate = (v: unknown) =>
    v == null || v === "" ? undefined : new Date(String(v));

const asNumber = (v: unknown) =>
    v == null || v === "" ? undefined : Number(v);

/** Một số field có thể đi theo dạng nhiều giá trị trên query (?status=A&status=B) */
const arrayify = (v: unknown): string[] => {
    if (Array.isArray(v)) return v.filter(Boolean).map(String);
    if (v == null || v === "") return [];
    return [String(v)];
};


export async function createProductDraft(title: string) {
    return prisma.$transaction(async (tx) => {
        const product = await prodRepo.createProductDraft(tx, { title })
        return product;
    });
}


// app/(admin)/admin/products/_server/product.service.ts

export async function detail(id: string) {
    return prisma.product.findUnique({
        where: { id },
    });
}

export async function getAdminProductList(raw: Record<string, unknown>) {
    // helper nhỏ để convert string[] sang enum ProductStatus[]
    const parseStatusArray = (input: unknown): ProductStatus[] | undefined => {
        const arr = Array.isArray(input) ? input : [input];
        const valid = arr
            .filter(Boolean)
            .map((s) => String(s).toUpperCase())
            .filter((s): s is ProductStatus =>
                Object.values(ProductStatus).includes(s as ProductStatus)
            );
        return valid.length ? valid : undefined;
    };

    const parsed = AdminFiltersSchema.parse({

        page: asNumber(raw.page) ?? 1,
        pageSize: asNumber(raw.pageSize) ?? 50,
        q: raw.q ?? undefined,
        sort: raw.sort ?? undefined,
        status: parseStatusArray(raw.status), // ✅ chuyển sang enum
        type: arrayify(raw.type),
        brandIds: arrayify(raw.brandIds),
        hasImages: raw.hasImages ?? undefined,
        updatedFrom: asDate(raw.updatedFrom),
        updatedTo: asDate(raw.updatedTo),
    });


    const { items, total, page, pageSize } =
        await prodRepo.listAdminProducts(parsed);

    // 3️⃣ Map → Admin View Model

    const rows = items.map(mapProductToAdminRow);

    // 4️⃣ Return
    return {
        items: rows,
        total,
        page,
        pageSize,
    };
}

export async function updateProduct(
    id: string,
    patch: {
        title?: string;
        minPrice?: number | null;
        primaryImageUrl?: string | null;
        contentStatus?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
        priceVisibility?: "SHOW" | "HIDE";
        availabilityStatus?: "ACTIVE" | "HIDDEN";
    }
) {
    return prisma.$transaction(async (tx) => {
        // map field UI -> field DB (tuỳ schema của bạn)
        // Nếu DB bạn là primaryImageUrl thay vì image, đổi chỗ này:
        const data: any = {};

        if (patch.title !== undefined) data.title = patch.title;
        if (patch.minPrice !== undefined) data.minPrice = patch.minPrice;

        // ✅ nếu DB bạn lưu ở primaryImageUrl:
        // if (patch.image !== undefined) data.primaryImageUrl = patch.image;
        // ✅ nếu DB bạn lưu trực tiếp field image:
        if (patch.primaryImageUrl !== undefined) data.primaryImageUrl = patch.primaryImageUrl;

        if (patch.contentStatus !== undefined) data.contentStatus = patch.contentStatus;
        if (patch.priceVisibility !== undefined) data.priceVisibility = patch.priceVisibility;
        if (patch.availabilityStatus !== undefined) data.availabilityStatus = patch.availabilityStatus;
        console.log('in ra image url :' + patch.primaryImageUrl)
        const updated = await prodRepo.updateProduct(tx, id, data);

        // trả ra tối thiểu cho list
        return updated;
    });
}

export async function remove(id: string) {
    return prisma.$transaction(async (tx) => {
        await prodRepo.deleteProduct(tx, id);
        return { success: true };
    });
}

export async function searchProductService(q: string) {
    return prisma.$transaction(async (tx) => {
        return prodRepo.searchProductsRepo(tx, q);

    });
}

export type BulkPostProductsResult = {
    count: number;
    postedIds: string[];
    failed: Array<{
        id: string;
        title?: string | null;
        reasons: string[];
    }>;
};

function toNumberPrice(v: unknown): number {
    if (v == null) return 0;
    if (typeof v === "number") return v;

    // Prisma.Decimal thường có toNumber()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyV = v as any;
    if (typeof anyV?.toNumber === "function") return anyV.toNumber();

    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
}

function hasPrice(p: { minPrice: unknown }) {
    return toNumberPrice(p.minPrice) > 0;
}

function hasImage(p: { primaryImageUrl: string | null }) {
    return !!p.primaryImageUrl && p.primaryImageUrl.trim().length > 0;
}

/**
 * Bulk POST Products (y như orders bulk post: chạy trong transaction)
 * Điều kiện hoàn thành:
 * - status phải DRAFT
 * - có minPrice > 0
 * - có primaryImageUrl
 */
export async function bulkPostProducts(productIds: string[]): Promise<BulkPostProductsResult> {
    const ids = Array.from(new Set((productIds ?? []).filter(Boolean)));

    if (!ids.length) {
        return { count: 0, postedIds: [], failed: [] };
    }

    return prisma.$transaction(async (tx) => {
        const rows = await prodRepo.getProductsForBulkPost(tx, ids);

        const found = new Set(rows.map((x) => x.id));
        const notFound = ids.filter((id) => !found.has(id));

        const failed: BulkPostProductsResult["failed"] = [];

        // not found
        for (const id of notFound) {
            failed.push({ id, title: null, reasons: ["NOT_FOUND"] });
        }

        // validate
        const eligibleIds: string[] = [];
        for (const p of rows) {
            const reasons: string[] = [];

            if (p.status !== ProductStatus.DRAFT) reasons.push(`STATUS_NOT_ALLOWED:${p.status}`);
            //if (!hasPrice(p)) reasons.push("MISSING_PRICE");
            if (!hasImage(p)) reasons.push("MISSING_IMAGE");

            if (reasons.length) {
                failed.push({ id: p.id, title: p.title ?? null, reasons });
            } else {
                eligibleIds.push(p.id);
            }
            console.log('tét prod repo : ')

        }

        // giống orders: skip cái fail, vẫn post cái ok
        if (eligibleIds.length) {
            await prodRepo.markPostedMany(tx, eligibleIds);
            console.log('tét prod repo : ')
        }

        return {
            count: eligibleIds.length,
            postedIds: eligibleIds,
            failed,
        };
    });
}
