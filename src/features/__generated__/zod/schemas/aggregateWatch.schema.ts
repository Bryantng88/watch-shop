import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchOrderByWithRelationInputObjectSchema as WatchOrderByWithRelationInputObjectSchema } from './objects/WatchOrderByWithRelationInput.schema';
import { WatchWhereInputObjectSchema as WatchWhereInputObjectSchema } from './objects/WatchWhereInput.schema';
import { WatchWhereUniqueInputObjectSchema as WatchWhereUniqueInputObjectSchema } from './objects/WatchWhereUniqueInput.schema';
import { WatchCountAggregateInputObjectSchema as WatchCountAggregateInputObjectSchema } from './objects/WatchCountAggregateInput.schema';
import { WatchMinAggregateInputObjectSchema as WatchMinAggregateInputObjectSchema } from './objects/WatchMinAggregateInput.schema';
import { WatchMaxAggregateInputObjectSchema as WatchMaxAggregateInputObjectSchema } from './objects/WatchMaxAggregateInput.schema';
import { WatchAvgAggregateInputObjectSchema as WatchAvgAggregateInputObjectSchema } from './objects/WatchAvgAggregateInput.schema';
import { WatchSumAggregateInputObjectSchema as WatchSumAggregateInputObjectSchema } from './objects/WatchSumAggregateInput.schema';

export const WatchAggregateSchema: z.ZodType<Prisma.WatchAggregateArgs> = z.object({ orderBy: z.union([WatchOrderByWithRelationInputObjectSchema, WatchOrderByWithRelationInputObjectSchema.array()]).optional(), where: WatchWhereInputObjectSchema.optional(), cursor: WatchWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), WatchCountAggregateInputObjectSchema ]).optional(), _min: WatchMinAggregateInputObjectSchema.optional(), _max: WatchMaxAggregateInputObjectSchema.optional(), _avg: WatchAvgAggregateInputObjectSchema.optional(), _sum: WatchSumAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.WatchAggregateArgs>;

export const WatchAggregateZodSchema = z.object({ orderBy: z.union([WatchOrderByWithRelationInputObjectSchema, WatchOrderByWithRelationInputObjectSchema.array()]).optional(), where: WatchWhereInputObjectSchema.optional(), cursor: WatchWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), WatchCountAggregateInputObjectSchema ]).optional(), _min: WatchMinAggregateInputObjectSchema.optional(), _max: WatchMaxAggregateInputObjectSchema.optional(), _avg: WatchAvgAggregateInputObjectSchema.optional(), _sum: WatchSumAggregateInputObjectSchema.optional() }).strict();