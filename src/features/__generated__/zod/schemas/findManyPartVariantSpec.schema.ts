import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PartVariantSpecIncludeObjectSchema as PartVariantSpecIncludeObjectSchema } from './objects/PartVariantSpecInclude.schema';
import { PartVariantSpecOrderByWithRelationInputObjectSchema as PartVariantSpecOrderByWithRelationInputObjectSchema } from './objects/PartVariantSpecOrderByWithRelationInput.schema';
import { PartVariantSpecWhereInputObjectSchema as PartVariantSpecWhereInputObjectSchema } from './objects/PartVariantSpecWhereInput.schema';
import { PartVariantSpecWhereUniqueInputObjectSchema as PartVariantSpecWhereUniqueInputObjectSchema } from './objects/PartVariantSpecWhereUniqueInput.schema';
import { PartVariantSpecScalarFieldEnumSchema } from './enums/PartVariantSpecScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const PartVariantSpecFindManySelectSchema: z.ZodType<Prisma.PartVariantSpecSelect> = z.object({
    variantId: z.boolean().optional(),
    partType: z.boolean().optional(),
    variant: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.PartVariantSpecSelect>;

export const PartVariantSpecFindManySelectZodSchema = z.object({
    variantId: z.boolean().optional(),
    partType: z.boolean().optional(),
    variant: z.boolean().optional()
  }).strict();

export const PartVariantSpecFindManySchema: z.ZodType<Prisma.PartVariantSpecFindManyArgs> = z.object({ select: PartVariantSpecFindManySelectSchema.optional(), include: PartVariantSpecIncludeObjectSchema.optional(), orderBy: z.union([PartVariantSpecOrderByWithRelationInputObjectSchema, PartVariantSpecOrderByWithRelationInputObjectSchema.array()]).optional(), where: PartVariantSpecWhereInputObjectSchema.optional(), cursor: PartVariantSpecWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([PartVariantSpecScalarFieldEnumSchema, PartVariantSpecScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.PartVariantSpecFindManyArgs>;

export const PartVariantSpecFindManyZodSchema = z.object({ select: PartVariantSpecFindManySelectSchema.optional(), include: PartVariantSpecIncludeObjectSchema.optional(), orderBy: z.union([PartVariantSpecOrderByWithRelationInputObjectSchema, PartVariantSpecOrderByWithRelationInputObjectSchema.array()]).optional(), where: PartVariantSpecWhereInputObjectSchema.optional(), cursor: PartVariantSpecWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([PartVariantSpecScalarFieldEnumSchema, PartVariantSpecScalarFieldEnumSchema.array()]).optional() }).strict();