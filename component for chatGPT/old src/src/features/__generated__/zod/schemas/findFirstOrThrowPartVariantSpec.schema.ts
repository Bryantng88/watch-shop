import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PartVariantSpecIncludeObjectSchema as PartVariantSpecIncludeObjectSchema } from './objects/PartVariantSpecInclude.schema';
import { PartVariantSpecOrderByWithRelationInputObjectSchema as PartVariantSpecOrderByWithRelationInputObjectSchema } from './objects/PartVariantSpecOrderByWithRelationInput.schema';
import { PartVariantSpecWhereInputObjectSchema as PartVariantSpecWhereInputObjectSchema } from './objects/PartVariantSpecWhereInput.schema';
import { PartVariantSpecWhereUniqueInputObjectSchema as PartVariantSpecWhereUniqueInputObjectSchema } from './objects/PartVariantSpecWhereUniqueInput.schema';
import { PartVariantSpecScalarFieldEnumSchema } from './enums/PartVariantSpecScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const PartVariantSpecFindFirstOrThrowSelectSchema: z.ZodType<Prisma.PartVariantSpecSelect> = z.object({
    variantId: z.boolean().optional(),
    partType: z.boolean().optional(),
    variant: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.PartVariantSpecSelect>;

export const PartVariantSpecFindFirstOrThrowSelectZodSchema = z.object({
    variantId: z.boolean().optional(),
    partType: z.boolean().optional(),
    variant: z.boolean().optional()
  }).strict();

export const PartVariantSpecFindFirstOrThrowSchema: z.ZodType<Prisma.PartVariantSpecFindFirstOrThrowArgs> = z.object({ select: PartVariantSpecFindFirstOrThrowSelectSchema.optional(), include: PartVariantSpecIncludeObjectSchema.optional(), orderBy: z.union([PartVariantSpecOrderByWithRelationInputObjectSchema, PartVariantSpecOrderByWithRelationInputObjectSchema.array()]).optional(), where: PartVariantSpecWhereInputObjectSchema.optional(), cursor: PartVariantSpecWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([PartVariantSpecScalarFieldEnumSchema, PartVariantSpecScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.PartVariantSpecFindFirstOrThrowArgs>;

export const PartVariantSpecFindFirstOrThrowZodSchema = z.object({ select: PartVariantSpecFindFirstOrThrowSelectSchema.optional(), include: PartVariantSpecIncludeObjectSchema.optional(), orderBy: z.union([PartVariantSpecOrderByWithRelationInputObjectSchema, PartVariantSpecOrderByWithRelationInputObjectSchema.array()]).optional(), where: PartVariantSpecWhereInputObjectSchema.optional(), cursor: PartVariantSpecWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([PartVariantSpecScalarFieldEnumSchema, PartVariantSpecScalarFieldEnumSchema.array()]).optional() }).strict();