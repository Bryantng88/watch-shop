import { z } from "zod";
import { AcquisitionType, ProductType } from "@prisma/client";

export const adminAcqSort = z.enum([
    "updatedDesc",
    "updatedAsc",
    "createdDesc",
    "createdAsc",
    "acquiredDesc",
    "acquiredAsc",
]);

export const CreateAcqWithItemSchema = z.object({
    vendorId: z.string().min(1, "vendorId required"),
    acquiredAt: z.coerce.date().optional(),
    currency: z.string().default("VND"),
    type: z.nativeEnum(AcquisitionType).default("PURCHASE"),
    notes: z.string().nullable().optional(),
    refNo: z.string().nullable().optional(),
    reuse: z.enum(["always-new", "reuse-today", "reuse-latest"]).default("reuse-today"),
    item: z.object({
        productId: z.string().min(1),
        variantId: z.string().nullable().optional(),
        quantity: z.coerce.number().int().positive().default(1),
        unitCost: z.coerce.number().nonnegative().default(0),
    }),
});

export type CreateAcqWithItemInput = z.infer<typeof CreateAcqWithItemSchema>;

export const acqFiltersSchema = z.object({
    page: z.coerce.number().int().positive().optional(),
    pageSize: z.coerce.number().int().positive().max(200).optional(),
    q: z.string().trim().optional(),
    vendorIds: z.array(z.string()).optional(),
    customerIds: z.array(z.string()).optional(),
    type: z.array(z.enum(["PURCHASE", "CONSIGN", "TRADEIN"])).optional(),
    status: z.array(z.enum(["DRAFT", "POSTED", "CANCELED"])).optional(),
    acquiredFrom: z.string().or(z.date()).optional(),
    acquiredTo: z.string().or(z.date()).optional(),
    hasInvoice: z.enum(["yes", "no"]).optional(),
    sort: adminAcqSort.optional(),
});

export type AdminAcqFiltersInput = z.infer<typeof acqFiltersSchema>;

export type StrapSpecInput = {
    material?: string;
    lugWidthMM?: number;
    buckleWidthMM?: number;
    color?: string;
    quickRelease?: boolean;
    sellPrice?: number;
};

export type CreateAcquisitionInput = {
    vendorId: string;
    currency?: string;
    type?: AcquisitionType;
    createdAt?: Date | string;
    notes?: string | null;
    items: {
        title: string;
        quantity: number;
        unitCost: number;
        productType?: ProductType;
        productId?: string | null;
        variantId?: string | null;
        strapSpec?: StrapSpecInput;
    }[];
    quickVendorName: string;
};


export type CreateAcqDTO = {
    vendorId: string;
    acquiredAt?: string | Date | null;
    cost?: number | null;
    currency?: string | null;
    refNo?: string | null;
    notes?: string | null;
    type?: AcquisitionType | "PURCHASE" | "CONSIGN";
};

export const ItemDTO = z.object({
    id: z.string().min(1),
    title: z.string(),
    quantity: z.number().nonnegative(),
    unitPrice: z.number().nonnegative(),
    productType: z.nativeEnum(ProductType).optional(),
    productId: z.string().nullable().optional(),
    variantId: z.string().nullable().optional(),
    strapSpec: z
        .object({
            material: z.string().optional(),
            lugWidthMM: z.number().optional(),
            buckleWidthMM: z.number().optional(),
            color: z.string().optional(),
            quickRelease: z.boolean().optional(),
            sellPrice: z.number().optional(),
        })
        .optional(),
});

export type ItemInput = z.infer<typeof ItemDTO>;

export const NewItemDTO = ItemDTO.omit({ id: true });
export type NewItemInput = z.infer<typeof NewItemDTO>;