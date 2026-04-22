import * as z from 'zod';

import { ProductTypeSchema } from '../../enums/ProductType.schema';
import { PriceVisibilitySchema } from '../../enums/PriceVisibility.schema';
import { TagSchema } from '../../enums/Tag.schema';
import { ProductStatusSchema } from '../../enums/ProductStatus.schema';
import { ContentStatusSchema } from '../../enums/ContentStatus.schema';
// prettier-ignore
export const ProductModelSchema = z.object({
    id: z.string(),
    slug: z.string().nullable(),
    title: z.string(),
    primaryImageUrl: z.string().nullable(),
    type: ProductTypeSchema,
    priceVisibility: PriceVisibilitySchema,
    brandId: z.string().nullable(),
    seoTitle: z.string().nullable(),
    seoDescription: z.string().nullable(),
    isStockManaged: z.boolean(),
    maxQtyPerOrder: z.number().int(),
    publishedAt: z.date().nullable(),
    vendorId: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    tag: TagSchema,
    status: ProductStatusSchema,
    categoryId: z.string().nullable(),
    contentStatus: ContentStatusSchema,
    postContent: z.string().nullable(),
    aiPromptUsed: z.string().nullable(),
    aiGeneratedAt: z.date().nullable(),
    sku: z.string().nullable(),
    nickname: z.string().nullable(),
    specStatus: z.string(),
    storefrontImageKey: z.string().nullable(),
    acquisitionItem: z.array(z.unknown()),
    acquisitionSpecJob: z.array(z.unknown()),
    invoiceItem: z.array(z.unknown()),
    maintenanceRecord: z.array(z.unknown()),
    orderItem: z.array(z.unknown()),
    brand: z.unknown().nullable(),
    productCategory: z.unknown().nullable(),
    vendor: z.unknown().nullable(),
    productContent: z.unknown().nullable(),
    productImage: z.array(z.unknown()),
    productVariant: z.array(z.unknown()),
    reservation: z.array(z.unknown()),
    serviceRequest: z.array(z.unknown()),
    watch: z.unknown().nullable(),
    watchSpec: z.unknown().nullable()
}).strict();

export type ProductPureType = z.infer<typeof ProductModelSchema>;
