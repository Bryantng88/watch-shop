// src/features/products/admin/server/admin-product.service.ts
import { z } from "zod";
import { listAdminProducts, getAdminProductDetail, getProductOrders, getProductInvoices, getProductAcquisitions, getProductMaintenance, createProduct, updateAdminProduct, deleteAdminProduct, publishProduct, unpublishProduct, } from "./product.repo";
import { CaseMaterial, ProductStatus, CaseType } from "@prisma/client";
import { ProductType } from "@prisma/client";
import { complications } from "@/constants/constants";
import { CreateProductWithAcqSchema, CreateProductWithAcqInput, UpdateProductWithAcqInput, AdminFiltersSchema } from "./product.dto";
import type { Prisma } from "@prisma/client";
import prisma from "@/server/db/client";
import { upsertSupplierByNameRole } from "@/features/vendors/server/vendor.repo";
import { acquisitionRepo } from "@/features/aquisitions/server/acquisition.repo";
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

const toCaseType = (s?: string): CaseType => {
    if (!s) return CaseType.ROUND;
    const k = s.toUpperCase() as keyof typeof CaseType;
    return CaseType[k] ?? CaseType.ROUND;
};

const connect = (id?: string) => (id ? { connect: { id } } : undefined);
const createIf = <T>(cond: any, payload: T) => (cond ? payload : undefined);

function mapDtoToProductCreate(dto: CreateProductWithAcqInput): Prisma.ProductCreateInput {
    const isWatch = (dto.type ?? "WATCH").toUpperCase() === "WATCH";
    return {
        title: dto.title,
        status: dto.status as any,
        type: dto.type as any,
        brand: connect(dto.brandId),
        vendor: connect(dto.vendorId),
        variants: { create: [{ price: dto.price ?? 0, stockQty: dto.stockQty ?? 1, isActive: true }] },
        watchSpec: createIf(isWatch, {
            create: {
                caseType: dto.caseType,
                length: dto.length as any,
                width: dto.width as any,
                thickness: dto.thickness as any,
            },
        }),
    };
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
        const data = CreateProductWithAcqSchema.parse(input);
        // TODO: nếu cần slug auto, bạn có thể xử lý ở đây hoặc ở prisma .$extends / middleware
        return prisma.$transaction(async (tx) => {
            // 2.1 resolve vendorId (chọn sẵn / quick-add)
            let vendorId = data.vendorId;
            if (!vendorId && data.vendorName) {
                vendorId = await upsertSupplierByNameRole({
                    name: data.vendorName,
                    phone: data.vendorPhone ?? null,
                    email: data.vendorEmail ?? null,
                });
            }
            if (!vendorId) throw new Error("Vui lòng chọn hoặc tạo Vendor để ghi nhận giá mua.");

            // 2.2 create product
            await prisma.$transaction(async (tx) => {
                const repo = createProduct(tx);       // ✅ hợp kiểu
                await repo.create(mapDtoToProductCreate({ ...data, vendorId }));
            });

            // 2.3 create acquisition header
            await prisma.$transaction(async (tx) => {
                const acqRepo = acquisitionRepo(tx);
                await acqRepo.create({
                    vendorId,
                    acquiredAt: data.acquiredAt ? new Date(data.acquiredAt) : undefined,
                    cost: data.purchasePrice,
                    currency: data.currency,
                    refNo: data.refNo ?? null,
                    notes: data.notes ?? null,
                    type: "PURCHASE",
                });
            })


            // (tuỳ chọn) nếu có AcquisitionItem lines thì thêm ở đây

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
        const data = UpdateProductSchema.parse(input);
        return updateAdminProduct(id, data as any);
    },

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
