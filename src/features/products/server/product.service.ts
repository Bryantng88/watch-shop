// src/features/products/admin/server/admin-product.service.ts
import { z } from "zod";
import { listAdminProducts, getAdminProductDetail, getProductOrders, getProductInvoices, getProductAcquisitions, getProductMaintenance, createAdminProduct, updateAdminProduct, deleteAdminProduct, publishProduct, unpublishProduct, } from "./product.repo";
import { ProductStatus } from "@prisma/client";
import { ProductType } from "@prisma/client";
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

/* -------------------------------------------------------
 * Zod schemas (validate đầu vào)
 * - Chỉ validate những gì service cần. Những field còn lại bạn có thể bổ sung dần.
 * - Nếu bạn đã dùng prisma-zod-generator, có thể import schema từ đó để thay thế.
 * ----------------------------------------------------- */

export const AdminFiltersSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    pageSize: z.coerce.number().min(1).max(200).default(50),

    q: z.string().optional(),
    sort: z
        .enum([
            "updatedDesc",
            "updatedAsc",
            "createdDesc",
            "createdAsc",
            "titleAsc",
            "titleDesc",
        ])
        .optional(),

    status: z.array(z.nativeEnum(ProductStatus)).optional(),
    type: z.array(z.nativeEnum(ProductType)).optional(),
    brandIds: z.array(z.string()).optional(),
    hasImages: z.enum(["yes", "no"]).optional(),

    updatedFrom: z.coerce.date().optional(),
    updatedTo: z.coerce.date().optional(),
});

export type AdminFiltersInput = z.infer<typeof AdminFiltersSchema>;

/** Tối thiểu cho create/update Product trong admin */
const BaseProductSchema = z
    .object({
        title: z.string().min(1),
        slug: z.string().min(1).optional(),
        status: z.string().optional(), // ví dụ: 'ACTIVE' | 'INACTIVE' | 'DRAFT'
        type: z.string().optional(),   // ví dụ enum ProductType
        brand: z.string().optional(),
        vendorId: z.string().optional(),
        primaryImageUrl: z.preprocess(
            (v) => (v === "" ? undefined : v), // "" -> undefined
            z.string().url().nullable().optional()
        ),
        seoTitle: z.string().optional(),
        seoDescription: z.string().optional(),
        tag: z.string().optional(),
        isStockManaged: z.boolean().optional(),
        maxQtyPerOrder: z.number().int().positive().optional(),
        publishedAt: z.coerce.date().optional(),
    })
    .passthrough(); // cho phép gửi thêm field khác (nếu có)

export const CreateProductSchema = BaseProductSchema;
export const UpdateProductSchema = BaseProductSchema.partial();

/* -------------------------------------------------------
 * Service API (được route handlers gọi)
 * ----------------------------------------------------- */

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
        const data = CreateProductSchema.parse(input);
        // TODO: nếu cần slug auto, bạn có thể xử lý ở đây hoặc ở prisma .$extends / middleware
        return createAdminProduct(data as any);
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
