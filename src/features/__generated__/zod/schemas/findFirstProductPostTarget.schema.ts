import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProductPostTargetIncludeObjectSchema as ProductPostTargetIncludeObjectSchema } from './objects/ProductPostTargetInclude.schema';
import { ProductPostTargetOrderByWithRelationInputObjectSchema as ProductPostTargetOrderByWithRelationInputObjectSchema } from './objects/ProductPostTargetOrderByWithRelationInput.schema';
import { ProductPostTargetWhereInputObjectSchema as ProductPostTargetWhereInputObjectSchema } from './objects/ProductPostTargetWhereInput.schema';
import { ProductPostTargetWhereUniqueInputObjectSchema as ProductPostTargetWhereUniqueInputObjectSchema } from './objects/ProductPostTargetWhereUniqueInput.schema';
import { ProductPostTargetScalarFieldEnumSchema } from './enums/ProductPostTargetScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const ProductPostTargetFindFirstSelectSchema: z.ZodType<Prisma.ProductPostTargetSelect> = z.object({
    productId: z.boolean().optional(),
    postTargetId: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    product: z.boolean().optional(),
    postTarget: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.ProductPostTargetSelect>;

export const ProductPostTargetFindFirstSelectZodSchema = z.object({
    productId: z.boolean().optional(),
    postTargetId: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    product: z.boolean().optional(),
    postTarget: z.boolean().optional()
  }).strict();

export const ProductPostTargetFindFirstSchema: z.ZodType<Prisma.ProductPostTargetFindFirstArgs> = z.object({ select: ProductPostTargetFindFirstSelectSchema.optional(), include: ProductPostTargetIncludeObjectSchema.optional(), orderBy: z.union([ProductPostTargetOrderByWithRelationInputObjectSchema, ProductPostTargetOrderByWithRelationInputObjectSchema.array()]).optional(), where: ProductPostTargetWhereInputObjectSchema.optional(), cursor: ProductPostTargetWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ProductPostTargetScalarFieldEnumSchema, ProductPostTargetScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.ProductPostTargetFindFirstArgs>;

export const ProductPostTargetFindFirstZodSchema = z.object({ select: ProductPostTargetFindFirstSelectSchema.optional(), include: ProductPostTargetIncludeObjectSchema.optional(), orderBy: z.union([ProductPostTargetOrderByWithRelationInputObjectSchema, ProductPostTargetOrderByWithRelationInputObjectSchema.array()]).optional(), where: ProductPostTargetWhereInputObjectSchema.optional(), cursor: ProductPostTargetWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ProductPostTargetScalarFieldEnumSchema, ProductPostTargetScalarFieldEnumSchema.array()]).optional() }).strict();