// src/features/products/admin/server/admin-product.service.ts
import { z } from "zod";
import { listAdminProducts, getAdminProductDetail, getProductOrders, getProductInvoices, getProductAcquisitions, getProductMaintenance, createProduct, updateAdminProduct, deleteAdminProduct, publishProduct, unpublishProduct, } from "./product.repo";
import { CaseMaterial, ProductStatus, CaseType, Gender, MovementType } from "@prisma/client";
import { ProductType } from "@prisma/client";
import { complications } from "@/constants/constants";
import { CreateProductWithAcqSchema, CreateProductWithAcqInput, UpdateProductWithAcqSchema, AdminFiltersSchema } from "./product.dto";
import type { Prisma } from "@prisma/client";
import prisma from "@/server/db/client";
import { upsertSupplierByNameRoleTx } from "@/features/vendors/server/vendor.repo";
import { acquisitionRepo } from "@/features/aquisitions/server/acquisition.repo";
import { genUniqueSlug, buildVariants, buildWatchSpec } from "@/features/ultis/helpers";
import { toPublicUrl } from "@/features/ultis/helpers";


/* -------------------------------------------------------
 * Helpers
 * ----------------------------------------------------- */

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

const clean = <T extends object>(o: T) =>
    Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined)) as T;
const toCaseType = (v?: unknown): CaseType => {
    const key = String(v ?? 'ROUND').toUpperCase() as keyof typeof CaseType;
    return CaseType[key] ?? CaseType.ROUND;
};
const toStatus = (v?: unknown): ProductStatus => {
    const key = String(v ?? 'ROUND').toUpperCase() as keyof typeof ProductStatus;
    return ProductStatus[key] ?? ProductStatus.HIDDEN;
};

const toProductType = (v?: unknown): ProductType => {
    const key = String(v ?? 'ROUND').toUpperCase() as keyof typeof ProductType;
    return ProductType[key] ?? ProductType.WATCH;
};
const connect = (id?: string) => (id ? { connect: { id } } : undefined);
const createIf = <T>(cond: any, payload: T) => (cond ? payload : undefined);
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


export const adminProductService = {
    /**
     * List bảng admin + KPI (đếm liên quan, last dates…)
     * Chấp nhận cả query thô từ URLSearchParams (chuỗi).
     */
    async list(raw: Record<string, unknown>) {
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
    },
    /** Tạo Product (validate + gọi repo) */
    async create(input: unknown) {
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
                status: (dto.status as any) ?? "HIDDEN",
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
    },


    /** Lấy chi tiết đầy đủ để mở form admin */
    async detail(id: string) {
        return getAdminProductDetail(id);
    },

    /** Tab lịch sử: Orders (phân trang + lọc ngày) */
    async orders(productId: string, raw: Record<string, unknown> = {}) {
        const page = asNumber(raw.page) ?? 1;
        const pageSize = asNumber(raw.pageSize) ?? 20;
        const from = asDate(raw.from);
        const to = asDate(raw.to);
        return getProductOrders(productId, page, pageSize, from, to);
    },

    /** Tab lịch sử: Invoices */
    async invoices(productId: string, raw: Record<string, unknown> = {}) {
        const page = asNumber(raw.page) ?? 1;
        const pageSize = asNumber(raw.pageSize) ?? 20;
        return getProductInvoices(productId, page, pageSize);
    },

    /** Tab lịch sử: Acquisitions (nhập hàng) */
    async acquisitions(productId: string, raw: Record<string, unknown> = {}) {
        const page = asNumber(raw.page) ?? 1;
        const pageSize = asNumber(raw.pageSize) ?? 20;
        return getProductAcquisitions(productId, page, pageSize);
    },

    /** Tab lịch sử: Maintenance (bảo trì) */
    async maintenance(productId: string, raw: Record<string, unknown> = {}) {
        const page = asNumber(raw.page) ?? 1;
        const pageSize = asNumber(raw.pageSize) ?? 20;
        const from = asDate(raw.from);
        const to = asDate(raw.to);
        return getProductMaintenance(productId, page, pageSize, from, to);
    },



    /** Cập nhật Product */
    async update(id: string, input: unknown) {
        const dto = UpdateProductWithAcqSchema.parse(input);

        const { image, complicationIds, price, stockQty, ...rest } = dto;
        const watchUpdate: Prisma.WatchSpecUpdateWithoutProductInput = {
            caseType: rest.caseType ? { set: rest.caseType as CaseType } : undefined,
            gender: rest.gender ? { set: rest.gender as Gender } : undefined,
            movement: rest.movement ? { set: rest.movement as MovementType } : undefined,

            length: rest.length != null ? { set: Number(rest.length) } : undefined,
            width: rest.width != null ? { set: Number(rest.width) } : undefined,
            thickness: rest.thickness != null ? { set: Number(rest.thickness) } : undefined,
        };
        return prisma.$transaction(async (tx) => {
            // 1) Update core fields + watchSpec + complications
            const updated = await tx.product.update({
                where: { id },
                data: {
                    ...clean({
                        title: rest.title,
                        status: rest.status,
                        seoTitle: rest.seoTitle,
                        seoDescription: rest.seoDescription,
                        type: rest.productType,
                        primaryImageUrl: rest.primaryImageUrl ?? undefined,
                        brand: rest.brandId ? { connect: { id: rest.brandId } } : undefined,
                    }),
                    // watchSpec: update hoặc upsert (nếu có sản phẩm WATCH)
                    watchSpec: rest.type === 'WATCH'
                        ? {
                            upsert: {
                                update: clean({
                                    caseType: rest.caseType,
                                    gender: rest.gender,
                                    length: rest.length != null ? Number(rest.length) : undefined,
                                    width: rest.width != null ? Number(rest.width) : undefined,
                                    thickness: rest.thickness != null ? Number(rest.thickness) : undefined,
                                    movement: rest.movement,
                                }),
                                create: clean({
                                    caseType: rest.caseType ?? 'ROUND',
                                    gender: rest.gender ?? 'MEN',
                                    length: rest.length != null ? Number(rest.length) : undefined,
                                    width: rest.width != null ? Number(rest.width) : undefined,
                                    thickness: rest.thickness != null ? Number(rest.thickness) : undefined,
                                    movement: rest.movement ?? 'AUTOMATIC',
                                }),
                            },
                        }
                        : undefined,
                    // complications: set lại toàn bộ từ danh sách id
                    complication: complicationIds
                        ? { set: complicationIds.map((cid) => ({ id: cid })) }
                        : undefined,
                },
                select: { id: true },
            });

            // 2) Update giá/stock cho biến thể hiện có (nếu có gửi)
            if (price != null || stockQty != null) {
                await tx.productVariant.updateMany({
                    where: { productId: id },
                    data: clean({
                        price: price != null ? Number(price) : undefined,
                        stockQty: stockQty != null ? Number(stockQty) : undefined,
                    }),
                });
            }

            // 3) Đồng bộ ảnh: chiến lược đơn giản là replace
            if (image) {
                await tx.productImage.deleteMany({ where: { productId: id } });
                if (image.length) {
                    await tx.productImage.createMany({
                        data: image.map((im, i) => ({
                            productId: id,
                            fileKey: im.fileKey,
                            alt: im.alt ?? null,
                            sortOrder: im.sortOrder ?? i,
                        })),
                    });
                    // set primary từ ảnh đầu
                    await tx.product.update({
                        where: { id },
                        data: { primaryImageUrl: image[0].fileKey },
                    });
                } else {
                    await tx.product.update({
                        where: { id },
                        data: { primaryImageUrl: null },
                    });
                }
            }

            return updated;
        });
    }


    /** Xoá Product */
    async remove(id: string) {
        await deleteAdminProduct(id);
        return { ok: true };
    },

    /** Xuất bản / Ẩn sản phẩm */
    async publish(id: string) {
        return publishProduct(id);
    },
    async unpublish(id: string) {
        return unpublishProduct(id);
    },
};
