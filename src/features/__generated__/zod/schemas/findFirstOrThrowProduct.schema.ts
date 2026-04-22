import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProductIncludeObjectSchema as ProductIncludeObjectSchema } from './objects/ProductInclude.schema';
import { ProductOrderByWithRelationInputObjectSchema as ProductOrderByWithRelationInputObjectSchema } from './objects/ProductOrderByWithRelationInput.schema';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './objects/ProductWhereInput.schema';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './objects/ProductWhereUniqueInput.schema';
import { ProductScalarFieldEnumSchema } from './enums/ProductScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const ProductFindFirstOrThrowSelectSchema: z.ZodType<Prisma.ProductSelect> = z.object({
    id: z.boolean().optional(),
    slug: z.boolean().optional(),
    title: z.boolean().optional(),
    primaryImageUrl: z.boolean().optional(),
    type: z.boolean().optional(),
    priceVisibility: z.boolean().optional(),
    brandId: z.boolean().optional(),
    seoTitle: z.boolean().optional(),
    seoDescription: z.boolean().optional(),
    isStockManaged: z.boolean().optional(),
    maxQtyPerOrder: z.boolean().optional(),
    publishedAt: z.boolean().optional(),
    vendorId: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    tag: z.boolean().optional(),
    status: z.boolean().optional(),
    categoryId: z.boolean().optional(),
    contentStatus: z.boolean().optional(),
    postContent: z.boolean().optional(),
    aiPromptUsed: z.boolean().optional(),
    aiGeneratedAt: z.boolean().optional(),
    sku: z.boolean().optional(),
    nickname: z.boolean().optional(),
    specStatus: z.boolean().optional(),
    storefrontImageKey: z.boolean().optional(),
    acquisitionItem: z.boolean().optional(),
    acquisitionSpecJob: z.boolean().optional(),
    invoiceItem: z.boolean().optional(),
    maintenanceRecord: z.boolean().optional(),
    orderItem: z.boolean().optional(),
    brand: z.boolean().optional(),
    productCategory: z.boolean().optional(),
    vendor: z.boolean().optional(),
    productContent: z.boolean().optional(),
    productImage: z.boolean().optional(),
    productVariant: z.boolean().optional(),
    reservation: z.boolean().optional(),
    serviceRequest: z.boolean().optional(),
    watch: z.boolean().optional(),
    watchSpec: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.ProductSelect>;

export const ProductFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    slug: z.boolean().optional(),
    title: z.boolean().optional(),
    primaryImageUrl: z.boolean().optional(),
    type: z.boolean().optional(),
    priceVisibility: z.boolean().optional(),
    brandId: z.boolean().optional(),
    seoTitle: z.boolean().optional(),
    seoDescription: z.boolean().optional(),
    isStockManaged: z.boolean().optional(),
    maxQtyPerOrder: z.boolean().optional(),
    publishedAt: z.boolean().optional(),
    vendorId: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    tag: z.boolean().optional(),
    status: z.boolean().optional(),
    categoryId: z.boolean().optional(),
    contentStatus: z.boolean().optional(),
    postContent: z.boolean().optional(),
    aiPromptUsed: z.boolean().optional(),
    aiGeneratedAt: z.boolean().optional(),
    sku: z.boolean().optional(),
    nickname: z.boolean().optional(),
    specStatus: z.boolean().optional(),
    storefrontImageKey: z.boolean().optional(),
    acquisitionItem: z.boolean().optional(),
    acquisitionSpecJob: z.boolean().optional(),
    invoiceItem: z.boolean().optional(),
    maintenanceRecord: z.boolean().optional(),
    orderItem: z.boolean().optional(),
    brand: z.boolean().optional(),
    productCategory: z.boolean().optional(),
    vendor: z.boolean().optional(),
    productContent: z.boolean().optional(),
    productImage: z.boolean().optional(),
    productVariant: z.boolean().optional(),
    reservation: z.boolean().optional(),
    serviceRequest: z.boolean().optional(),
    watch: z.boolean().optional(),
    watchSpec: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const ProductFindFirstOrThrowSchema: z.ZodType<Prisma.ProductFindFirstOrThrowArgs> = z.object({ select: ProductFindFirstOrThrowSelectSchema.optional(), include: ProductIncludeObjectSchema.optional(), orderBy: z.union([ProductOrderByWithRelationInputObjectSchema, ProductOrderByWithRelationInputObjectSchema.array()]).optional(), where: ProductWhereInputObjectSchema.optional(), cursor: ProductWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ProductScalarFieldEnumSchema, ProductScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.ProductFindFirstOrThrowArgs>;

export const ProductFindFirstOrThrowZodSchema = z.object({ select: ProductFindFirstOrThrowSelectSchema.optional(), include: ProductIncludeObjectSchema.optional(), orderBy: z.union([ProductOrderByWithRelationInputObjectSchema, ProductOrderByWithRelationInputObjectSchema.array()]).optional(), where: ProductWhereInputObjectSchema.optional(), cursor: ProductWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ProductScalarFieldEnumSchema, ProductScalarFieldEnumSchema.array()]).optional() }).strict();