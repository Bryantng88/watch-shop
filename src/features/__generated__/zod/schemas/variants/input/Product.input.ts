import * as z from 'zod';

import { ContentStatusSchema } from '../../enums/ContentStatus.schema';
import { ProductTypeSchema } from '../../enums/ProductType.schema';
import { TagSchema } from '../../enums/Tag.schema';
// prettier-ignore
export const ProductInputSchema = z.object({
    id: z.string(),
    slug: z.string().optional().nullable(),
    title: z.string(),
    primaryImageUrl: z.string().optional().nullable(),
    contentStatus: ContentStatusSchema,
    type: ProductTypeSchema,
    brandId: z.string().optional().nullable(),
    seoTitle: z.string().optional().nullable(),
    seoDescription: z.string().optional().nullable(),
    isStockManaged: z.boolean(),
    maxQtyPerOrder: z.number().int(),
    publishedAt: z.date().optional().nullable(),
    vendorId: z.string().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    tag: TagSchema,
    AcquisitionItem: z.array(z.unknown()),
    InvoiceItem: z.array(z.unknown()),
    maintenanceRecords: z.array(z.unknown()),
    orderItems: z.array(z.unknown()),
    brand: z.unknown().optional().nullable(),
    vendor: z.unknown().optional().nullable(),
    image: z.array(z.unknown()),
    variants: z.array(z.unknown()),
    Reservation: z.array(z.unknown()),
    ServiceRequest: z.array(z.unknown()),
    watchSpec: z.unknown().optional().nullable()
}).strict();

export type ProductInputType = z.infer<typeof ProductInputSchema>;
