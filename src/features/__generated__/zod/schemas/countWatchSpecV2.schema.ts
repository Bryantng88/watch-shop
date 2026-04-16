import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchSpecV2OrderByWithRelationInputObjectSchema as WatchSpecV2OrderByWithRelationInputObjectSchema } from './objects/WatchSpecV2OrderByWithRelationInput.schema';
import { WatchSpecV2WhereInputObjectSchema as WatchSpecV2WhereInputObjectSchema } from './objects/WatchSpecV2WhereInput.schema';
import { WatchSpecV2WhereUniqueInputObjectSchema as WatchSpecV2WhereUniqueInputObjectSchema } from './objects/WatchSpecV2WhereUniqueInput.schema';
import { WatchSpecV2CountAggregateInputObjectSchema as WatchSpecV2CountAggregateInputObjectSchema } from './objects/WatchSpecV2CountAggregateInput.schema';

export const WatchSpecV2CountSchema: z.ZodType<Prisma.WatchSpecV2CountArgs> = z.object({ orderBy: z.union([WatchSpecV2OrderByWithRelationInputObjectSchema, WatchSpecV2OrderByWithRelationInputObjectSchema.array()]).optional(), where: WatchSpecV2WhereInputObjectSchema.optional(), cursor: WatchSpecV2WhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), WatchSpecV2CountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.WatchSpecV2CountArgs>;

export const WatchSpecV2CountZodSchema = z.object({ orderBy: z.union([WatchSpecV2OrderByWithRelationInputObjectSchema, WatchSpecV2OrderByWithRelationInputObjectSchema.array()]).optional(), where: WatchSpecV2WhereInputObjectSchema.optional(), cursor: WatchSpecV2WhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), WatchSpecV2CountAggregateInputObjectSchema ]).optional() }).strict();