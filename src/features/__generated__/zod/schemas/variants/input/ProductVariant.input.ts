import * as z from 'zod';

// prettier-ignore
export const ProductVariantInputSchema = z.object({
    id: z.string(),
    productId: z.string(),
    sku: z.string().optional().nullable(),
    name: z.string().optional().nullable(),
    price: z.number().optional().nullable(),
    stockQty: z.number().int(),
    isStockManaged: z.boolean().optional().nullable(),
    isActive: z.boolean(),
    maxQtyPerOrder: z.number().int(),
    createdAt: z.date(),
    updatedAt: z.date(),
    AcquisitionItem: z.array(z.unknown()),
    InvoiceItem: z.array(z.unknown()),
    MaintenancePart: z.array(z.unknown()),
    MaintenanceRecord: z.array(z.unknown()),
    partSpec: z.unknown().optional().nullable(),
    product: z.unknown(),
    ServiceRequest: z.array(z.unknown()),
    strapSpec: z.unknown().optional().nullable()
}).strict();

export type ProductVariantInputType = z.infer<typeof ProductVariantInputSchema>;
