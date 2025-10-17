import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProductImageIncludeObjectSchema as ProductImageIncludeObjectSchema } from './objects/ProductImageInclude.schema';
import { ProductImageOrderByWithRelationInputObjectSchema as ProductImageOrderByWithRelationInputObjectSchema } from './objects/ProductImageOrderByWithRelationInput.schema';
import { ProductImageWhereInputObjectSchema as ProductImageWhereInputObjectSchema } from './objects/ProductImageWhereInput.schema';
import { ProductImageWhereUniqueInputObjectSchema as ProductImageWhereUniqueInputObjectSchema } from './objects/ProductImageWhereUniqueInput.schema';
import { ProductImageScalarFieldEnumSchema } from './enums/ProductImageScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const ProductImageFindManySelectSchema: z.ZodType<Prisma.ProductImageSelect> = z.object({
    id: z.boolean().optional(),
    productId: z.boolean().optional(),
    fileKey: z.boolean().optional(),
    role: z.boolean().optional(),
    alt: z.boolean().optional(),
    width: z.boolean().optional(),
    height: z.boolean().optional(),
    mime: z.boolean().optional(),
    sizeBytes: z.boolean().optional(),
    sortOrder: z.boolean().optional(),
    dominantHex: z.boolean().optional(),
    contentHash: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    product: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.ProductImageSelect>;

export const ProductImageFindManySelectZodSchema = z.object({
    id: z.boolean().optional(),
    productId: z.boolean().optional(),
    fileKey: z.boolean().optional(),
    role: z.boolean().optional(),
    alt: z.boolean().optional(),
    width: z.boolean().optional(),
    height: z.boolean().optional(),
    mime: z.boolean().optional(),
    sizeBytes: z.boolean().optional(),
    sortOrder: z.boolean().optional(),
    dominantHex: z.boolean().optional(),
    contentHash: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    product: z.boolean().optional()
  }).strict();

export const ProductImageFindManySchema: z.ZodType<Prisma.ProductImageFindManyArgs> = z.object({ select: ProductImageFindManySelectSchema.optional(), include: ProductImageIncludeObjectSchema.optional(), orderBy: z.union([ProductImageOrderByWithRelationInputObjectSchema, ProductImageOrderByWithRelationInputObjectSchema.array()]).optional(), where: ProductImageWhereInputObjectSchema.optional(), cursor: ProductImageWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ProductImageScalarFieldEnumSchema, ProductImageScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.ProductImageFindManyArgs>;

export const ProductImageFindManyZodSchema = z.object({ select: ProductImageFindManySelectSchema.optional(), include: ProductImageIncludeObjectSchema.optional(), orderBy: z.union([ProductImageOrderByWithRelationInputObjectSchema, ProductImageOrderByWithRelationInputObjectSchema.array()]).optional(), where: ProductImageWhereInputObjectSchema.optional(), cursor: ProductImageWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ProductImageScalarFieldEnumSchema, ProductImageScalarFieldEnumSchema.array()]).optional() }).strict();