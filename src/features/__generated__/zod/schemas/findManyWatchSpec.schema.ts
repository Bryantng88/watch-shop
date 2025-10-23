import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchSpecIncludeObjectSchema as WatchSpecIncludeObjectSchema } from './objects/WatchSpecInclude.schema';
import { WatchSpecOrderByWithRelationInputObjectSchema as WatchSpecOrderByWithRelationInputObjectSchema } from './objects/WatchSpecOrderByWithRelationInput.schema';
import { WatchSpecWhereInputObjectSchema as WatchSpecWhereInputObjectSchema } from './objects/WatchSpecWhereInput.schema';
import { WatchSpecWhereUniqueInputObjectSchema as WatchSpecWhereUniqueInputObjectSchema } from './objects/WatchSpecWhereUniqueInput.schema';
import { WatchSpecScalarFieldEnumSchema } from './enums/WatchSpecScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const WatchSpecFindManySelectSchema: z.ZodType<Prisma.WatchSpecSelect> = z.object({
    productId: z.boolean().optional(),
    model: z.boolean().optional(),
    year: z.boolean().optional(),
    caseType: z.boolean().optional(),
    category: z.boolean().optional(),
    gender: z.boolean().optional(),
    length: z.boolean().optional(),
    width: z.boolean().optional(),
    thickness: z.boolean().optional(),
    movement: z.boolean().optional(),
    caliber: z.boolean().optional(),
    caseMaterial: z.boolean().optional(),
    goldKarat: z.boolean().optional(),
    goldColor: z.boolean().optional(),
    caseSize: z.boolean().optional(),
    dialColor: z.boolean().optional(),
    marketSegmentId: z.boolean().optional(),
    strap: z.boolean().optional(),
    glass: z.boolean().optional(),
    boxIncluded: z.boolean().optional(),
    bookletIncluded: z.boolean().optional(),
    cardIncluded: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    sizeCategory: z.boolean().optional(),
    product: z.boolean().optional(),
    complication: z.boolean().optional(),
    marketSegment: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.WatchSpecSelect>;

export const WatchSpecFindManySelectZodSchema = z.object({
    productId: z.boolean().optional(),
    model: z.boolean().optional(),
    year: z.boolean().optional(),
    caseType: z.boolean().optional(),
    category: z.boolean().optional(),
    gender: z.boolean().optional(),
    length: z.boolean().optional(),
    width: z.boolean().optional(),
    thickness: z.boolean().optional(),
    movement: z.boolean().optional(),
    caliber: z.boolean().optional(),
    caseMaterial: z.boolean().optional(),
    goldKarat: z.boolean().optional(),
    goldColor: z.boolean().optional(),
    caseSize: z.boolean().optional(),
    dialColor: z.boolean().optional(),
    marketSegmentId: z.boolean().optional(),
    strap: z.boolean().optional(),
    glass: z.boolean().optional(),
    boxIncluded: z.boolean().optional(),
    bookletIncluded: z.boolean().optional(),
    cardIncluded: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    sizeCategory: z.boolean().optional(),
    product: z.boolean().optional(),
    complication: z.boolean().optional(),
    marketSegment: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const WatchSpecFindManySchema: z.ZodType<Prisma.WatchSpecFindManyArgs> = z.object({ select: WatchSpecFindManySelectSchema.optional(), include: WatchSpecIncludeObjectSchema.optional(), orderBy: z.union([WatchSpecOrderByWithRelationInputObjectSchema, WatchSpecOrderByWithRelationInputObjectSchema.array()]).optional(), where: WatchSpecWhereInputObjectSchema.optional(), cursor: WatchSpecWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([WatchSpecScalarFieldEnumSchema, WatchSpecScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.WatchSpecFindManyArgs>;

export const WatchSpecFindManyZodSchema = z.object({ select: WatchSpecFindManySelectSchema.optional(), include: WatchSpecIncludeObjectSchema.optional(), orderBy: z.union([WatchSpecOrderByWithRelationInputObjectSchema, WatchSpecOrderByWithRelationInputObjectSchema.array()]).optional(), where: WatchSpecWhereInputObjectSchema.optional(), cursor: WatchSpecWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([WatchSpecScalarFieldEnumSchema, WatchSpecScalarFieldEnumSchema.array()]).optional() }).strict();