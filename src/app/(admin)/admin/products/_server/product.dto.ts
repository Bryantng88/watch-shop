import { PriceVisibility, ProductType, CaseType, ContentStatus, DiscountType, Gender, ProductStatus, AvailabilityStatus } from "@prisma/client";
import { z } from "zod";
export type CreateProductDTO = {
    title: string;
    availabilityStatus: AvailabilityStatus;
    contentStatus: ContentStatus;
    priceVisibility: PriceVisibility;
    type: ProductType;
    price: number;
    brandId?: string;        // chỉ là id thuần
    vendorId?: string;
    primaryImageUrl?: string | null;
    seoTitle?: string;
    seoDescription?: string;
    // ... các field khác
};

export const CreateProductWithOutAcqSchema = z.
    object({
        //watch spec
        caseType: z.preprocess(
            (v) => (v == null ? undefined : String(v).toUpperCase()),
            z.nativeEnum(CaseType).optional()),
        length: z.coerce.number().optional(),
        width: z.coerce.number().optional(),
        thickness: z.coerce.number().optional(),
        year: z.coerce.number().optional(),
        movement: z.string().optional(),
        caliber: z.string().optional(),
        glass: z.string().optional(),
        CaseMaterial: z.string().optional(),
        complications: z.array(z.string()).optional(),
        marketSegment: z.string().optional(),
        strap: z.string().optional(),

        //variant
        price: z.coerce.number().optional(),
        gender: z.nativeEnum(Gender).optional(),
        image: z.array(
            z.object({
                fileKey: z.string().min(1),
                alt: z.string().nullish(),
                width: z.number().optional(),
                height: z.number().optional(),
                mime: z.string().optional(),
                sizeBytes: z.number().optional(),
                dominantHex: z.string().optional(),
                sortOrder: z.number().default(0).optional(),
            })
        ).optional(),

        //general
        title: z.string().min(1),
        brandId: z.string().optional(),
        slug: z.string().min(1).optional(),
        contentStatus: z.string().optional(), // ví dụ: 'ACTIVE' | 'INACTIVE' | 'DRAFT'
        availabilityStatus: z.string().optional(),
        priceVisibility: z.string().optional(),
        type: z.string().optional(),   // ví dụ enum ProductType
        brand: z.string().optional(),
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
        vendorId: z.string().optional(),

    })

export const CreateProductWithAcqSchema = z
    .object({
        //watch spec
        caseType: z.preprocess(
            (v) => (v == null ? undefined : String(v).toUpperCase()),
            z.nativeEnum(CaseType).optional()),
        length: z.coerce.number().optional(),
        width: z.coerce.number().optional(),
        thickness: z.coerce.number().optional(),
        year: z.coerce.number().optional(),
        movement: z.string().optional(),
        caliber: z.string().optional(),
        glass: z.string().optional(),
        CaseMaterial: z.string().optional(),
        complications: z.array(z.string()).optional(),
        marketSegment: z.string().optional(),
        strap: z.string().optional(),

        //variant
        price: z.coerce.number().optional(),
        gender: z.nativeEnum(Gender).optional(),
        image: z.array(
            z.object({
                fileKey: z.string().min(1),
                alt: z.string().nullish(),
                width: z.number().optional(),
                height: z.number().optional(),
                mime: z.string().optional(),
                sizeBytes: z.number().optional(),
                dominantHex: z.string().optional(),
                sortOrder: z.number().default(0).optional(),
            })
        ).optional(),

        //general
        title: z.string().min(1),
        brandId: z.string().optional(),
        slug: z.string().min(1).optional(),
        contentStatus: z.string().optional(), // ví dụ: 'ACTIVE' | 'INACTIVE' | 'DRAFT'
        availabilityStatus: z.string().optional(),
        priceVisibility: z.string().optional(),
        type: z.string().optional(),   // ví dụ enum ProductType
        brand: z.string().optional(),
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

        // acquisition
        vendorId: z.string().optional(),
        vendorName: z.string().optional(),
        vendorPhone: z.string().optional(),
        vendorEmail: z.string().optional(),
        purchasePrice: z.coerce.number().default(0),
        currency: z.string().default("VND"),
        acquiredAt: z.string().optional(), // yyyy-mm-dd
        refNo: z.string().optional(),
        notes: z.string().optional(),


    })
    .passthrough(); // cho phép gửi thêm field khác (nếu có)

export type CreateProductWithAcqInput = z.infer<typeof CreateProductWithAcqSchema>;
export const UpdateProductWithAcqSchema = CreateProductWithAcqSchema.partial();
export type CreateProductWithOutAcqInput = z.infer<typeof CreateProductWithOutAcqSchema>;





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
    availabilitiStatus: z.array(z.nativeEnum(AvailabilityStatus)).optional(),
    type: z.array(z.nativeEnum(ProductType)).optional(),
    brandIds: z.array(z.string()).optional(),
    categoryIds: z.array(z.string()).optional(),
    hasImages: z.enum(["yes", "no"]).optional(),

    updatedFrom: z.coerce.date().optional(),
    updatedTo: z.coerce.date().optional(),
});

export type AdminFiltersInput = z.infer<typeof AdminFiltersSchema>;

export const ProductStatusSchema = z.nativeEnum(ProductStatus).optional();
export const PriceVisibilitySchema = z.nativeEnum(PriceVisibility).optional();
export const AvailabilityStatusSchema = z.enum(["ACTIVE", "HIDDEN"]).optional();

export const UpdateProductPatchSchema = z
    .object({
        title: z.string().min(1).optional(),
        categoryId: z.string().nullable().optional(),
        primaryImageUrl: z.string().nullable().optional(),

        // alias cũ để không gãy UI cũ
        minPrice: z.coerce.number().nullable().optional(),

        // pricing mới
        listPrice: z.coerce.number().nullable().optional(),
        discountType: z.nativeEnum(DiscountType).nullable().optional(),
        discountValue: z.coerce.number().nullable().optional(),
        salePrice: z.coerce.number().nullable().optional(),
        saleStartsAt: z.coerce.date().nullable().optional(),
        saleEndsAt: z.coerce.date().nullable().optional(),
        purchasePrice: z.coerce.number().nullable().optional(),

        status: ProductStatusSchema,
        priceVisibility: PriceVisibilitySchema,
        availabilityStatus: AvailabilityStatusSchema,
    })
    .strict();