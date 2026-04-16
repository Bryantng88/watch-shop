import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MarketSegmentOrderByWithRelationInputObjectSchema as MarketSegmentOrderByWithRelationInputObjectSchema } from './objects/MarketSegmentOrderByWithRelationInput.schema';
import { MarketSegmentWhereInputObjectSchema as MarketSegmentWhereInputObjectSchema } from './objects/MarketSegmentWhereInput.schema';
import { MarketSegmentWhereUniqueInputObjectSchema as MarketSegmentWhereUniqueInputObjectSchema } from './objects/MarketSegmentWhereUniqueInput.schema';
import { MarketSegmentCountAggregateInputObjectSchema as MarketSegmentCountAggregateInputObjectSchema } from './objects/MarketSegmentCountAggregateInput.schema';

export const MarketSegmentCountSchema: z.ZodType<Prisma.MarketSegmentCountArgs> = z.object({ orderBy: z.union([MarketSegmentOrderByWithRelationInputObjectSchema, MarketSegmentOrderByWithRelationInputObjectSchema.array()]).optional(), where: MarketSegmentWhereInputObjectSchema.optional(), cursor: MarketSegmentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), MarketSegmentCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.MarketSegmentCountArgs>;

export const MarketSegmentCountZodSchema = z.object({ orderBy: z.union([MarketSegmentOrderByWithRelationInputObjectSchema, MarketSegmentOrderByWithRelationInputObjectSchema.array()]).optional(), where: MarketSegmentWhereInputObjectSchema.optional(), cursor: MarketSegmentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), MarketSegmentCountAggregateInputObjectSchema ]).optional() }).strict();