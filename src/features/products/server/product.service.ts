// src/features/products/admin/server/admin-product.service.ts
import { z } from "zod";
import { listAdminProducts, getAdminProductDetail, getProductOrders, getProductInvoices, getProductAcquisitions, getProductMaintenance, createProduct, updateAdminProduct, deleteAdminProduct, publishProduct, unpublishProduct, } from "./product.repo";
import { CaseMaterial, ProductStatus, CaseType, Gender, MovementType } from "@prisma/client";
import { ProductType } from "@prisma/client";
import { complications } from "@/constants/constants";
import { CreateProductWithAcqSchema, CreateProductWithAcqInput, UpdateProductWithAcqSchema, AdminFiltersSchema } from "./product.dto";
import { Prisma } from "@prisma/client";
import prisma from "@/server/db/client";
import { upsertSupplierByNameRoleTx } from "@/features/vendors/server/vendor.repo";
import { acquisitionRepo } from "@/app/(admin)/admin/acquisitions/_server/acquisition.repo";
import { genUniqueSlug, buildVariants, buildWatchSpec } from "@/features/ultis/helpers";
import { toPublicUrl } from "@/features/ultis/helpers";
import { CreateProductWithAcqDTO, UpdateProductWithAcqDTO } from "../schemas/product.schema";
import { adminProductRepo } from "./product.repo";
import { MIN_IMAGES, REQUIRED_WATCHSPEC_FIELDS, hasValue } from "./rules";
/* -------------------------------------------------------
 * Helpers
 * ----------------------------------------------------- */
export type PublishSnapshot = {
    imageCount: number;
    brandId: string | null;
    hasSellableVariant: boolean;
    variants: Array<{
        id: string;
        price: any;                  // Prisma.Decimal | number | null
        availabilityStatus: string;  // "ACTIVE" | ...
        stockQty: number | null;
    }>;
    watchSpec?: WatchSpecSnapshot | null;
};

export type WatchSpecSnapshot = {
    id: string;
    // chỉ cần những trường bạn dùng để validate
    model?: any; year?: any; caseType?: any; category?: any;
    length?: any; width?: any; thickness?: any;
    movement?: any; caliber?: any; caseMaterial?: any;
    goldKarat?: any; goldColor?: any; dialColor?: any;
    strap?: any; glass?: any;
    boxIncluded?: boolean; bookletIncluded?: boolean; cardIncluded?: boolean;
};

export type MissingItem =
    | { key: "images"; label: string; count: number }
    | { key: "brandId"; label: string }
    | { key: "variant"; label: string }
    | { key: "watchSpec"; label: string; fields: string[] };


/** Chuyển chuỗi rỗng -> undefined, đảm bảo number/date an toàn */
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


const toCaseType = (v?: unknown): CaseType => {
    const key = String(v ?? 'ROUND').toUpperCase() as keyof typeof CaseType;
    return CaseType[key] ?? CaseType.ROUND;
};
const toStatus = (v?: unknown): ProductStatus => {
    const key = String(v ?? 'ROUND').toUpperCase() as keyof typeof ProductStatus;
    return ProductStatus[key] ?? ProductStatus.HIDDEN;
};
type UpdateProductWithAcqInput = z.infer<typeof UpdateProductWithAcqSchema>;

const toProductType = (v?: unknown): ProductType => {
    const key = String(v ?? 'ROUND').toUpperCase() as keyof typeof ProductType;
    return ProductType[key] ?? ProductType.WATCH;
};
const connect = (id?: string) => (id ? { connect: { id } } : undefined);
const createIf = <T>(cond: any, payload: T) => (cond ? payload : undefined);

function toDecimal(v?: string) {
    return typeof v === "string" ? new Prisma.Decimal(v) : undefined;
}
function normalizeUpdateBody(raw: any) {
    const out: any = { ...raw };

    // 1) Lấy id từ object
    if (raw.brand?.id) out.brandId = raw.brand.id;
    delete out.brand;

    if (raw.vendor?.id) out.vendorId = raw.vendor.id;
    delete out.vendor;

    // 2) null -> undefined để qua .optional()
    const nullToUndef = (v: any) => (v === null ? undefined : v);
    out.primaryImageUrl = nullToUndef(raw.primaryImageUrl);
    out.seoTitle = nullToUndef(raw.seoTitle);
    out.seoDescription = nullToUndef(raw.seoDescription);

    // 3) coerce số cho watchSpec
    if (raw.watchSpec) {
        out.watchSpec = {
            ...raw.watchSpec,
            length: raw.watchSpec.length != null ? Number(raw.watchSpec.length) : undefined,
            width: raw.watchSpec.width != null ? Number(raw.watchSpec.width) : undefined,
            thickness: raw.watchSpec.thickness != null ? Number(raw.watchSpec.thickness) : undefined,
        };
        // KHÔNG gửi complication object trong watchSpec khi update
        delete out.watchSpec.complication;
    }

    // 4) chỉ giữ complicationIds (string[])
    if (!Array.isArray(raw.complicationIds) && Array.isArray(raw.watchSpec?.complication)) {
        out.complicationIds = raw.watchSpec.complication.map((c: any) => c.id);
    }

    // 5) coerce price nếu cần
    if (raw.purchasePrice != null) out.purchasePrice = Number(raw.purchasePrice);

    return out;
}
function buildMissing(s: PublishSnapshot): MissingItem[] {
    const missing: MissingItem[] = [];

    if (s.imageCount < MIN_IMAGES) {
        missing.push({ key: "images", label: `Ảnh sản phẩm (≥ ${MIN_IMAGES})`, count: s.imageCount });
    }
    if (!s.brandId) {
        missing.push({ key: "brandId", label: "Thương hiệu" });
    }
    if (!s.hasSellableVariant) {
        missing.push({ key: "variant", label: "Ít nhất 1 biến thể có giá & ACTIVE" });
    }

    // Gom watchSpec vào 1 mục với danh sách trường thiếu
    if (s.watchSpec) {
        const lack = REQUIRED_WATCHSPEC_FIELDS
            .filter(f => !hasValue((s.watchSpec as any)[f.key]))
            .map(f => f.label);
        if (lack.length) {
            missing.push({ key: "watchSpec", label: "Thông số kỹ thuật", fields: lack });
            console.log(missing)
        }
    }
    return missing;
}
/**
 * List bảng admin + KPI (đếm liên quan, last dates…)
 * Chấp nhận cả query thô từ URLSearchParams (chuỗi).
 */
async function list(raw: Record<string, unknown>) {
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

    return listAdminProducts(parsed);
}
/** Tạo Product (validate + gọi repo) */
async function create(input: unknown) {
    const dto = CreateProductWithAcqSchema.parse(input);

    return prisma.$transaction(async (tx) => {
        // 1) Vendor (select hoặc quick-add)
        let vendorId = dto.vendorId;
        if (!vendorId && dto.vendorName) {
            vendorId = await upsertSupplierByNameRoleTx(tx)({
                name: dto.vendorName,
                phone: dto.vendorPhone ?? null,
                email: dto.vendorEmail ?? null,
            });
        }
        if (!vendorId) {
            throw new Error("Vui lòng chọn hoặc tạo Vendor để ghi nhận giá mua.");
        }

        // 2) Slug unique + SKU base
        const slug = await genUniqueSlug(tx, dto.title);
        const skuBase = slug; // single = slug

        // 3) Map ProductCreateInput
        const data: Prisma.ProductCreateInput = {
            title: dto.title,
            contentStatus: (dto.contentStatus as any) ?? "DRAFT",
            type: (dto.type as any) ?? "WATCH",
            slug, // có thể để Prisma default unique nếu bạn muốn
            brand: dto.brandId ? { connect: { id: dto.brandId } } : undefined,
            vendor: { connect: { id: vendorId } },
            variants: buildVariants(dto, skuBase),
            watchSpec: buildWatchSpec(dto),
            primaryImageUrl:
                dto.primaryImageUrl === "" ? null : dto.primaryImageUrl ?? null,
            seoTitle: dto.seoTitle ?? undefined,
            seoDescription: dto.seoDescription ?? undefined,
        };
        // 4) Create Product
        const product = await tx.product.create({
            data,
            select: { id: true, slug: true },
        });
        if (dto.image?.length) {
            await tx.productImage.createMany({
                data: dto.image.map((img) => ({
                    productId: product.id,
                    fileKey: img.fileKey,
                    alt: img.alt ?? null,
                    width: img.width ?? null,
                    height: img.height ?? null,
                    mime: img.mime ?? null,
                    sizeBytes: img.sizeBytes ?? null,
                    dominantHex: img.dominantHex ?? null,
                    sortOrder: img.sortOrder ?? 0,
                })),
                skipDuplicates: true, // tùy chọn
            });
        }
        if (!data.primaryImageUrl) {
            const first = (dto.image ?? [])
                .slice() // copy
                .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))[0];

            if (first) {
                await tx.product.update({
                    where: { id: product.id },
                    data: {
                        primaryImageUrl: first.fileKey
                    }
                });
            }
        }
        // 5) Acquisition (header)
        const acq = acquisitionRepo(tx);
        const acquisition = await acq.createWithItem({
            vendorId,
            acquiredAt: dto.acquiredAt ? new Date(dto.acquiredAt) : undefined,
            cost: dto.purchasePrice,
            currency: dto.currency,
            refNo: dto.refNo ?? null,
            notes: dto.notes ?? null,
            productId: product.id,
            unitCost: dto.purchasePrice ?? 0,
            qty: 1,
        });

        // 6) (Optional) AcquisitionItem link tới product
        // await tx.acquisitionItem.create({
        //   data: {
        //     acquisitionId: acquisition.id,
        //     productId: product.id,
        //     qty: 1,
        //     unitCost: dto.purchasePrice ?? 0,
        //   },
        // });

        return { productId: product.id, acquisitionId: acquisition.id };
    });
}


/** Lấy chi tiết đầy đủ để mở form admin */
async function detail(id: string) {
    return getAdminProductDetail(id);
}

/** Tab lịch sử: Orders (phân trang + lọc ngày) */
async function orders(productId: string, raw: Record<string, unknown> = {}) {
    const page = asNumber(raw.page) ?? 1;
    const pageSize = asNumber(raw.pageSize) ?? 20;
    const from = asDate(raw.from);
    const to = asDate(raw.to);
    return getProductOrders(productId, page, pageSize, from, to);
}

/** Tab lịch sử: Invoices */
async function invoices(productId: string, raw: Record<string, unknown> = {}) {
    const page = asNumber(raw.page) ?? 1;
    const pageSize = asNumber(raw.pageSize) ?? 20;
    return getProductInvoices(productId, page, pageSize);
}

/** Tab lịch sử: Acquisitions (nhập hàng) */
async function acquisitions(productId: string, raw: Record<string, unknown> = {}) {
    const page = asNumber(raw.page) ?? 1;
    const pageSize = asNumber(raw.pageSize) ?? 20;
    return getProductAcquisitions(productId, page, pageSize);
}
/** Tab lịch sử: Maintenance (bảo trì) */
async function maintenance(productId: string, raw: Record<string, unknown> = {}) {
    const page = asNumber(raw.page) ?? 1;
    const pageSize = asNumber(raw.pageSize) ?? 20;
    const from = asDate(raw.from);
    const to = asDate(raw.to);
    return getProductMaintenance(productId, page, pageSize, from, to);
}

async function getPublishSnapshot(productId: string): Promise<PublishSnapshot> {
    const p = await adminProductRepo.getPublishSnapshot(productId);
    if (!p) throw new Error("Product not found");

    const hasSellableVariant = p.variants.some(
        (v) =>
            v.price != null &&
            Number(v.price as any) > 0 &&
            (v.availabilityStatus === "ACTIVE" || (v.stockQty ?? 0) > 0)
    );


    return {
        imageCount: p.image.length,
        brandId: p.brandId,
        hasSellableVariant,
        variants: p.variants.map((v) => ({
            id: v.id,
            price: v.price,
            availabilityStatus: v.availabilityStatus,
            stockQty: v.stockQty ?? 0,
        })),
        // @ts-expect-error: p.watchSpec may be undefined
        watchSpec: p.watchSpec ? { ...p.watchSpec } : null,
    };
}
/** Cập nhật Product */


/** Xoá Product */
async function remove(id: string) {
    await deleteAdminProduct(id);
    return { ok: true };
}

/** Xuất bản / Ẩn sản phẩm */
async function publish(productId: string) {
    // luôn kiểm tra server-side, không tin client
    const snap = await getPublishSnapshot(productId);
    const missing = buildMissing(snap);
    if (missing.length) {
        const msg =
            "Chưa đủ điều kiện publish: " + missing.map((m) => m.label).join(", ");
        throw new Error(msg);
    }

    // chuyển trạng thái hiển thị
    const result = await adminProductRepo.publishProduct(productId)
    return { result };
}
async function unpublish(id: string) {
    return unpublishProduct(id);
}

async function updateProduct(dto: UpdateProductWithAcqDTO) {
    const { id, product, watchSpec, variants } = dto;
    const productData: Prisma.ProductUpdateInput | undefined = product
        ? {
            title: product.title,
            slug: product.slug,
            type: (product.type as any) ?? undefined,
            primaryImageUrl: product.primaryImageUrl ?? undefined,
            seoTitle: product.seoTitle ?? undefined,
            seoDescription: product.seoDescription ?? undefined,
            isStockManaged: product.isStockManaged,
            maxQtyPerOrder: product.maxQtyPerOrder,
            tag: (product.tag as any) ?? undefined,
            brand: product.brandId ? { connect: { id: product.brandId } } : undefined,
            vendor: product.vendorId ? { connect: { id: product.vendorId } } : undefined,
        }
        : undefined;


    const watchSpecData = watchSpec
        ? ({
            update: {
                model: watchSpec.model,
                year: watchSpec.year,
                caseType: (watchSpec.caseType as any) ?? undefined,
                gender: (watchSpec.gender as any) ?? undefined,
                length: toDecimal(watchSpec.length),
                width: toDecimal(watchSpec.width),
                thickness: toDecimal(watchSpec.thickness),
                movement: (watchSpec.movement as any) ?? undefined,
                caliber: watchSpec.caliber,
                caseMaterial: (watchSpec.caseMaterial as any) ?? undefined,
                dialColor: watchSpec.dialColor,
                strap: (watchSpec.strap as any) ?? undefined,
                glass: (watchSpec.glass as any) ?? undefined,
                boxIncluded: watchSpec.boxIncluded,
                bookletIncluded: watchSpec.bookletIncluded,
            },
            create: {
                model: watchSpec.model,
            },
        } satisfies Prisma.WatchSpecUpsertWithoutProductInput)
        : undefined;


    const variantUpserts = (variants ?? []).map((v) => ({
        where: v.id ? { id: v.id } : undefined,
        create: {
            sku: v.sku,
            name: v.name,
            price: v.price ? new Prisma.Decimal(v.price) : undefined,
            stockQty: v.stockQty ?? 0,
            isStockManaged: v.isStockManaged ?? true,
        } satisfies Prisma.ProductVariantCreateWithoutProductInput,
        update: {
            sku: v.sku ?? undefined,
            name: v.name ?? undefined,
            price: v.price ? new Prisma.Decimal(v.price) : undefined,
            stockQty: v.stockQty,
            isStockManaged: v.isStockManaged,
        } satisfies Prisma.ProductVariantUpdateWithoutProductInput,
    }));
    const adm = adminProductRepo;
    return adm.update(id, {
        productData,
        watchSpecData,
        variantUpserts,
    });



}

export const adminProductService = {
    getPublishSnapshot,
    buildMissing,
    publish,
    create,
    list,
    updateProduct,
};
