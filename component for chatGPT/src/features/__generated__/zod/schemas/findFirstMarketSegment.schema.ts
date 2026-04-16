import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MarketSegmentIncludeObjectSchema as MarketSegmentIncludeObjectSchema } from './objects/MarketSegmentInclude.schema';
import { MarketSegmentOrderByWithRelationInputObjectSchema as MarketSegmentOrderByWithRelationInputObjectSchema } from './objects/MarketSegmentOrderByWithRelationInput.schema';
import { MarketSegmentWhereInputObjectSchema as MarketSegmentWhereInputObjectSchema } from './objects/MarketSegmentWhereInput.schema';
import { MarketSegmentWhereUniqueInputObjectSchema as MarketSegmentWhereUniqueInputObjectSchema } from './objects/MarketSegmentWhereUniqueInput.schema';
import { MarketSegmentScalarFieldEnumSchema } from './enums/MarketSegmentScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const MarketSegmentFindFirstSelectSchema: z.ZodType<Prisma.MarketSegmentSelect> = z.object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    watchSpecs: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.MarketSegmentSelect>;

export const MarketSegmentFindFirstSelectZodSchema = z.object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    watchSpecs: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const MarketSegmentFindFirstSchema: z.ZodType<Prisma.MarketSegmentFindFirstArgs> = z.object({ select: MarketSegmentFindFirstSelectSchema.optional(), include: MarketSegmentIncludeObjectSchema.optional(), orderBy: z.union([MarketSegmentOrderByWithRelationInputObjectSchema, MarketSegmentOrderByWithRelationInputObjectSchema.array()]).optional(), where: MarketSegmentWhereInputObjectSchema.optional(), cursor: MarketSegmentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([MarketSegmentScalarFieldEnumSchema, MarketSegmentScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.MarketSegmentFindFirstArgs>;

export const MarketSegmentFindFirstZodSchema = z.object({ select: MarketSegmentFindFirstSelectSchema.optional(), include: MarketSegmentIncludeObjectSchema.optional(), orderBy: z.union([MarketSegmentOrderByWithRelationInputObjectSchema, MarketSegmentOrderByWithRelationInputObjectSchema.array()]).optional(), where: MarketSegmentWhereInputObjectSchema.optional(), cursor: MarketSegmentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([MarketSegmentScalarFieldEnumSchema, MarketSegmentScalarFieldEnumSchema.array()]).optional() }).strict();