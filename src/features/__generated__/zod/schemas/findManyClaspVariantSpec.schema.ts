import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ClaspVariantSpecIncludeObjectSchema as ClaspVariantSpecIncludeObjectSchema } from './objects/ClaspVariantSpecInclude.schema';
import { ClaspVariantSpecOrderByWithRelationInputObjectSchema as ClaspVariantSpecOrderByWithRelationInputObjectSchema } from './objects/ClaspVariantSpecOrderByWithRelationInput.schema';
import { ClaspVariantSpecWhereInputObjectSchema as ClaspVariantSpecWhereInputObjectSchema } from './objects/ClaspVariantSpecWhereInput.schema';
import { ClaspVariantSpecWhereUniqueInputObjectSchema as ClaspVariantSpecWhereUniqueInputObjectSchema } from './objects/ClaspVariantSpecWhereUniqueInput.schema';
import { ClaspVariantSpecScalarFieldEnumSchema } from './enums/ClaspVariantSpecScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const ClaspVariantSpecFindManySelectSchema: z.ZodType<Prisma.ClaspVariantSpecSelect> = z.object({
    variantId: z.boolean().optional(),
    claspType: z.boolean().optional(),
    widthMM: z.boolean().optional(),
    originType: z.boolean().optional(),
    brandName: z.boolean().optional(),
    color: z.boolean().optional(),
    finish: z.boolean().optional(),
    minStockQty: z.boolean().optional(),
    targetStockQty: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    ProductVariant: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.ClaspVariantSpecSelect>;

export const ClaspVariantSpecFindManySelectZodSchema = z.object({
    variantId: z.boolean().optional(),
    claspType: z.boolean().optional(),
    widthMM: z.boolean().optional(),
    originType: z.boolean().optional(),
    brandName: z.boolean().optional(),
    color: z.boolean().optional(),
    finish: z.boolean().optional(),
    minStockQty: z.boolean().optional(),
    targetStockQty: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    ProductVariant: z.boolean().optional()
  }).strict();

export const ClaspVariantSpecFindManySchema: z.ZodType<Prisma.ClaspVariantSpecFindManyArgs> = z.object({ select: ClaspVariantSpecFindManySelectSchema.optional(), include: ClaspVariantSpecIncludeObjectSchema.optional(), orderBy: z.union([ClaspVariantSpecOrderByWithRelationInputObjectSchema, ClaspVariantSpecOrderByWithRelationInputObjectSchema.array()]).optional(), where: ClaspVariantSpecWhereInputObjectSchema.optional(), cursor: ClaspVariantSpecWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ClaspVariantSpecScalarFieldEnumSchema, ClaspVariantSpecScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.ClaspVariantSpecFindManyArgs>;

export const ClaspVariantSpecFindManyZodSchema = z.object({ select: ClaspVariantSpecFindManySelectSchema.optional(), include: ClaspVariantSpecIncludeObjectSchema.optional(), orderBy: z.union([ClaspVariantSpecOrderByWithRelationInputObjectSchema, ClaspVariantSpecOrderByWithRelationInputObjectSchema.array()]).optional(), where: ClaspVariantSpecWhereInputObjectSchema.optional(), cursor: ClaspVariantSpecWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ClaspVariantSpecScalarFieldEnumSchema, ClaspVariantSpecScalarFieldEnumSchema.array()]).optional() }).strict();