// src/features/products/admin/server/admin-product.service.ts
import { z } from "zod";
import { listAdminProducts, getAdminProductDetail, getProductOrders, getProductInvoices, getProductAcquisitions, getProductMaintenance, createProduct, updateAdminProduct, deleteAdminProduct, publishProduct, unpublishProduct, } from "./product.repo";
import { CaseMaterial, ProductStatus, CaseType } from "@prisma/client";
import { ProductType } from "@prisma/client";
import { complications } from "@/constants/constants";
import { CreateProductWithAcqSchema, CreateProductWithAcqInput, UpdateProductWithAcqInput, AdminFiltersSchema } from "./product.dto";
import type { Prisma } from "@prisma/client";
import prisma from "@/server/db/client";
import { upsertSupplierByNameRoleTx } from "@/features/vendors/server/vendor.repo";
import { acquisitionRepo } from "@/features/aquisitions/server/acquisition.repo";
import { genUniqueSlug, buildVariants, buildWatchSpec } from "@/features/ultis/helpers";

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

{/*function mapDtoToProductCreate(dto: CreateProductWithAcqInput): Prisma.ProductCreateInput {
    const isWatch = (dto.type ?? "WATCH").toUpperCase() === "WATCH";
    const data: Prisma.ProductCreateInput = {
        title: dto.title,
        status: toStatus(dto.status),
        type: toProductType(dto.type),
        brand: connect(dto.brandId),
        vendor: connect(dto.vendorId),
        variants: { create: [{ price: dto.price ?? 0, stockQty: dto.stockQty ?? 1, isActive: true }] },
        watchSpec: createIf(isWatch, {
            create: {
                caseType: toCaseType(dto.caseType),                 // luôn enum hợp lệ
                length: Number(dto.length ?? 40),                 // luôn là number
                width: Number(dto.width ?? 40),
                thickness: Number(dto.thickness ?? 12.0),
            },
        }),
    };
    if (isWatch) {
        const sizeCategory = deriveSizeCategory({
            caseType: dto.caseType as any,
            width: dto.width ? Number(dto.width) : undefined,
            length: dto.length ? Number(dto.length) : undefined,
        });

        data.watchSpec = {
            create: {
                caseType: (String(dto.caseType ?? 'ROUND').toUpperCase() as keyof typeof CaseType) in CaseType
                    ? (String(dto.caseType ?? 'ROUND').toUpperCase() as CaseType)
                    : CaseType.ROUND,
                length: Number(dto.length ?? 40),
                width: Number(dto.width ?? 40),
                thickness: Number(dto.thickness ?? 12),
                ...(sizeCategory ? { sizeCategory } : {}),
            },
        };
    }
    return data;
}*/}

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
                status: (dto.status as any) ?? "ACTIVE",
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
    //async update(id: string, input: unknown) {
    //const data = UpdateProductSchema.parse(input);
    //return updateAdminProduct(id, data as any);
    //},

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
