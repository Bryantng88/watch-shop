import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProductVariantIncludeObjectSchema as ProductVariantIncludeObjectSchema } from './objects/ProductVariantInclude.schema';
import { ProductVariantOrderByWithRelationInputObjectSchema as ProductVariantOrderByWithRelationInputObjectSchema } from './objects/ProductVariantOrderByWithRelationInput.schema';
import { ProductVariantWhereInputObjectSchema as ProductVariantWhereInputObjectSchema } from './objects/ProductVariantWhereInput.schema';
import { ProductVariantWhereUniqueInputObjectSchema as ProductVariantWhereUniqueInputObjectSchema } from './objects/ProductVariantWhereUniqueInput.schema';
import { ProductVariantScalarFieldEnumSchema } from './enums/ProductVariantScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const ProductVariantFindManySelectSchema: z.ZodType<Prisma.ProductVariantSelect> = z.object({
    id: z.boolean().optional(),
    productId: z.boolean().optional(),
    sku: z.boolean().optional(),
    name: z.boolean().optional(),
    price: z.boolean().optional(),
    stockQty: z.boolean().optional(),
    isStockManaged: z.boolean().optional(),
    maxQtyPerOrder: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    availabilityStatus: z.boolean().optional(),
    acquisitionItem: z.boolean().optional(),
    invoiceItem: z.boolean().optional(),
    maintenancePart: z.boolean().optional(),
    maintenanceRecord: z.boolean().optional(),
    partSpec: z.boolean().optional(),
    product: z.boolean().optional(),
    serviceRequest: z.boolean().optional(),
    strapSpec: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.ProductVariantSelect>;

export const ProductVariantFindManySelectZodSchema = z.object({
    id: z.boolean().optional(),
    productId: z.boolean().optional(),
    sku: z.boolean().optional(),
    name: z.boolean().optional(),
    price: z.boolean().optional(),
    stockQty: z.boolean().optional(),
    isStockManaged: z.boolean().optional(),
    maxQtyPerOrder: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    availabilityStatus: z.boolean().optional(),
    acquisitionItem: z.boolean().optional(),
    invoiceItem: z.boolean().optional(),
    maintenancePart: z.boolean().optional(),
    maintenanceRecord: z.boolean().optional(),
    partSpec: z.boolean().optional(),
    product: z.boolean().optional(),
    serviceRequest: z.boolean().optional(),
    strapSpec: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const ProductVariantFindManySchema: z.ZodType<Prisma.ProductVariantFindManyArgs> = z.object({ select: ProductVariantFindManySelectSchema.optional(), include: ProductVariantIncludeObjectSchema.optional(), orderBy: z.union([ProductVariantOrderByWithRelationInputObjectSchema, ProductVariantOrderByWithRelationInputObjectSchema.array()]).optional(), where: ProductVariantWhereInputObjectSchema.optional(), cursor: ProductVariantWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ProductVariantScalarFieldEnumSchema, ProductVariantScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.ProductVariantFindManyArgs>;

export const ProductVariantFindManyZodSchema = z.object({ select: ProductVariantFindManySelectSchema.optional(), include: ProductVariantIncludeObjectSchema.optional(), orderBy: z.union([ProductVariantOrderByWithRelationInputObjectSchema, ProductVariantOrderByWithRelationInputObjectSchema.array()]).optional(), where: ProductVariantWhereInputObjectSchema.optional(), cursor: ProductVariantWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ProductVariantScalarFieldEnumSchema, ProductVariantScalarFieldEnumSchema.array()]).optional() }).strict();