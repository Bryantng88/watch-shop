import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { StrapVariantSpecIncludeObjectSchema as StrapVariantSpecIncludeObjectSchema } from './objects/StrapVariantSpecInclude.schema';
import { StrapVariantSpecOrderByWithRelationInputObjectSchema as StrapVariantSpecOrderByWithRelationInputObjectSchema } from './objects/StrapVariantSpecOrderByWithRelationInput.schema';
import { StrapVariantSpecWhereInputObjectSchema as StrapVariantSpecWhereInputObjectSchema } from './objects/StrapVariantSpecWhereInput.schema';
import { StrapVariantSpecWhereUniqueInputObjectSchema as StrapVariantSpecWhereUniqueInputObjectSchema } from './objects/StrapVariantSpecWhereUniqueInput.schema';
import { StrapVariantSpecScalarFieldEnumSchema } from './enums/StrapVariantSpecScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const StrapVariantSpecFindFirstOrThrowSelectSchema: z.ZodType<Prisma.StrapVariantSpecSelect> = z.object({
    variantId: z.boolean().optional(),
    color: z.boolean().optional(),
    material: z.boolean().optional(),
    quickRelease: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    lugWidthMM: z.boolean().optional(),
    buckleWidthMM: z.boolean().optional(),
    originType: z.boolean().optional(),
    brandName: z.boolean().optional(),
    leatherType: z.boolean().optional(),
    surface: z.boolean().optional(),
    inventoryPolicy: z.boolean().optional(),
    claspType: z.boolean().optional(),
    claspWidthMM: z.boolean().optional(),
    claspOriginType: z.boolean().optional(),
    finish: z.boolean().optional(),
    lengthClass: z.boolean().optional(),
    minStockQty: z.boolean().optional(),
    targetStockQty: z.boolean().optional(),
    braceletReference: z.boolean().optional(),
    defaultFullLinks: z.boolean().optional(),
    defaultHalfLinks: z.boolean().optional(),
    defaultEndLinks: z.boolean().optional(),
    ProductVariant: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.StrapVariantSpecSelect>;

export const StrapVariantSpecFindFirstOrThrowSelectZodSchema = z.object({
    variantId: z.boolean().optional(),
    color: z.boolean().optional(),
    material: z.boolean().optional(),
    quickRelease: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    lugWidthMM: z.boolean().optional(),
    buckleWidthMM: z.boolean().optional(),
    originType: z.boolean().optional(),
    brandName: z.boolean().optional(),
    leatherType: z.boolean().optional(),
    surface: z.boolean().optional(),
    inventoryPolicy: z.boolean().optional(),
    claspType: z.boolean().optional(),
    claspWidthMM: z.boolean().optional(),
    claspOriginType: z.boolean().optional(),
    finish: z.boolean().optional(),
    lengthClass: z.boolean().optional(),
    minStockQty: z.boolean().optional(),
    targetStockQty: z.boolean().optional(),
    braceletReference: z.boolean().optional(),
    defaultFullLinks: z.boolean().optional(),
    defaultHalfLinks: z.boolean().optional(),
    defaultEndLinks: z.boolean().optional(),
    ProductVariant: z.boolean().optional()
  }).strict();

export const StrapVariantSpecFindFirstOrThrowSchema: z.ZodType<Prisma.StrapVariantSpecFindFirstOrThrowArgs> = z.object({ select: StrapVariantSpecFindFirstOrThrowSelectSchema.optional(), include: StrapVariantSpecIncludeObjectSchema.optional(), orderBy: z.union([StrapVariantSpecOrderByWithRelationInputObjectSchema, StrapVariantSpecOrderByWithRelationInputObjectSchema.array()]).optional(), where: StrapVariantSpecWhereInputObjectSchema.optional(), cursor: StrapVariantSpecWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([StrapVariantSpecScalarFieldEnumSchema, StrapVariantSpecScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.StrapVariantSpecFindFirstOrThrowArgs>;

export const StrapVariantSpecFindFirstOrThrowZodSchema = z.object({ select: StrapVariantSpecFindFirstOrThrowSelectSchema.optional(), include: StrapVariantSpecIncludeObjectSchema.optional(), orderBy: z.union([StrapVariantSpecOrderByWithRelationInputObjectSchema, StrapVariantSpecOrderByWithRelationInputObjectSchema.array()]).optional(), where: StrapVariantSpecWhereInputObjectSchema.optional(), cursor: StrapVariantSpecWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([StrapVariantSpecScalarFieldEnumSchema, StrapVariantSpecScalarFieldEnumSchema.array()]).optional() }).strict();