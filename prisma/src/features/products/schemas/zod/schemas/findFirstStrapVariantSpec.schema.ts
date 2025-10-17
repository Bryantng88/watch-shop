import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { StrapVariantSpecIncludeObjectSchema as StrapVariantSpecIncludeObjectSchema } from './objects/StrapVariantSpecInclude.schema';
import { StrapVariantSpecOrderByWithRelationInputObjectSchema as StrapVariantSpecOrderByWithRelationInputObjectSchema } from './objects/StrapVariantSpecOrderByWithRelationInput.schema';
import { StrapVariantSpecWhereInputObjectSchema as StrapVariantSpecWhereInputObjectSchema } from './objects/StrapVariantSpecWhereInput.schema';
import { StrapVariantSpecWhereUniqueInputObjectSchema as StrapVariantSpecWhereUniqueInputObjectSchema } from './objects/StrapVariantSpecWhereUniqueInput.schema';
import { StrapVariantSpecScalarFieldEnumSchema } from './enums/StrapVariantSpecScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const StrapVariantSpecFindFirstSelectSchema: z.ZodType<Prisma.StrapVariantSpecSelect> = z.object({
    variantId: z.boolean().optional(),
    widthMM: z.boolean().optional(),
    lengthLabel: z.boolean().optional(),
    color: z.boolean().optional(),
    material: z.boolean().optional(),
    quickRelease: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    variant: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.StrapVariantSpecSelect>;

export const StrapVariantSpecFindFirstSelectZodSchema = z.object({
    variantId: z.boolean().optional(),
    widthMM: z.boolean().optional(),
    lengthLabel: z.boolean().optional(),
    color: z.boolean().optional(),
    material: z.boolean().optional(),
    quickRelease: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    variant: z.boolean().optional()
  }).strict();

export const StrapVariantSpecFindFirstSchema: z.ZodType<Prisma.StrapVariantSpecFindFirstArgs> = z.object({ select: StrapVariantSpecFindFirstSelectSchema.optional(), include: StrapVariantSpecIncludeObjectSchema.optional(), orderBy: z.union([StrapVariantSpecOrderByWithRelationInputObjectSchema, StrapVariantSpecOrderByWithRelationInputObjectSchema.array()]).optional(), where: StrapVariantSpecWhereInputObjectSchema.optional(), cursor: StrapVariantSpecWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([StrapVariantSpecScalarFieldEnumSchema, StrapVariantSpecScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.StrapVariantSpecFindFirstArgs>;

export const StrapVariantSpecFindFirstZodSchema = z.object({ select: StrapVariantSpecFindFirstSelectSchema.optional(), include: StrapVariantSpecIncludeObjectSchema.optional(), orderBy: z.union([StrapVariantSpecOrderByWithRelationInputObjectSchema, StrapVariantSpecOrderByWithRelationInputObjectSchema.array()]).optional(), where: StrapVariantSpecWhereInputObjectSchema.optional(), cursor: StrapVariantSpecWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([StrapVariantSpecScalarFieldEnumSchema, StrapVariantSpecScalarFieldEnumSchema.array()]).optional() }).strict();