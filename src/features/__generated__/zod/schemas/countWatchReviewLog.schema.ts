import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchReviewLogOrderByWithRelationInputObjectSchema as WatchReviewLogOrderByWithRelationInputObjectSchema } from './objects/WatchReviewLogOrderByWithRelationInput.schema';
import { WatchReviewLogWhereInputObjectSchema as WatchReviewLogWhereInputObjectSchema } from './objects/WatchReviewLogWhereInput.schema';
import { WatchReviewLogWhereUniqueInputObjectSchema as WatchReviewLogWhereUniqueInputObjectSchema } from './objects/WatchReviewLogWhereUniqueInput.schema';
import { WatchReviewLogCountAggregateInputObjectSchema as WatchReviewLogCountAggregateInputObjectSchema } from './objects/WatchReviewLogCountAggregateInput.schema';

export const WatchReviewLogCountSchema: z.ZodType<Prisma.WatchReviewLogCountArgs> = z.object({ orderBy: z.union([WatchReviewLogOrderByWithRelationInputObjectSchema, WatchReviewLogOrderByWithRelationInputObjectSchema.array()]).optional(), where: WatchReviewLogWhereInputObjectSchema.optional(), cursor: WatchReviewLogWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), WatchReviewLogCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.WatchReviewLogCountArgs>;

export const WatchReviewLogCountZodSchema = z.object({ orderBy: z.union([WatchReviewLogOrderByWithRelationInputObjectSchema, WatchReviewLogOrderByWithRelationInputObjectSchema.array()]).optional(), where: WatchReviewLogWhereInputObjectSchema.optional(), cursor: WatchReviewLogWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), WatchReviewLogCountAggregateInputObjectSchema ]).optional() }).strict();