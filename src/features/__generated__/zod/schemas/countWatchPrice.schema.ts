import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchPriceOrderByWithRelationInputObjectSchema as WatchPriceOrderByWithRelationInputObjectSchema } from './objects/WatchPriceOrderByWithRelationInput.schema';
import { WatchPriceWhereInputObjectSchema as WatchPriceWhereInputObjectSchema } from './objects/WatchPriceWhereInput.schema';
import { WatchPriceWhereUniqueInputObjectSchema as WatchPriceWhereUniqueInputObjectSchema } from './objects/WatchPriceWhereUniqueInput.schema';
import { WatchPriceCountAggregateInputObjectSchema as WatchPriceCountAggregateInputObjectSchema } from './objects/WatchPriceCountAggregateInput.schema';

export const WatchPriceCountSchema: z.ZodType<Prisma.WatchPriceCountArgs> = z.object({ orderBy: z.union([WatchPriceOrderByWithRelationInputObjectSchema, WatchPriceOrderByWithRelationInputObjectSchema.array()]).optional(), where: WatchPriceWhereInputObjectSchema.optional(), cursor: WatchPriceWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), WatchPriceCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.WatchPriceCountArgs>;

export const WatchPriceCountZodSchema = z.object({ orderBy: z.union([WatchPriceOrderByWithRelationInputObjectSchema, WatchPriceOrderByWithRelationInputObjectSchema.array()]).optional(), where: WatchPriceWhereInputObjectSchema.optional(), cursor: WatchPriceWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), WatchPriceCountAggregateInputObjectSchema ]).optional() }).strict();