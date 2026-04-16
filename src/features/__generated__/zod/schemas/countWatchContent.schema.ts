import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchContentOrderByWithRelationInputObjectSchema as WatchContentOrderByWithRelationInputObjectSchema } from './objects/WatchContentOrderByWithRelationInput.schema';
import { WatchContentWhereInputObjectSchema as WatchContentWhereInputObjectSchema } from './objects/WatchContentWhereInput.schema';
import { WatchContentWhereUniqueInputObjectSchema as WatchContentWhereUniqueInputObjectSchema } from './objects/WatchContentWhereUniqueInput.schema';
import { WatchContentCountAggregateInputObjectSchema as WatchContentCountAggregateInputObjectSchema } from './objects/WatchContentCountAggregateInput.schema';

export const WatchContentCountSchema: z.ZodType<Prisma.WatchContentCountArgs> = z.object({ orderBy: z.union([WatchContentOrderByWithRelationInputObjectSchema, WatchContentOrderByWithRelationInputObjectSchema.array()]).optional(), where: WatchContentWhereInputObjectSchema.optional(), cursor: WatchContentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), WatchContentCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.WatchContentCountArgs>;

export const WatchContentCountZodSchema = z.object({ orderBy: z.union([WatchContentOrderByWithRelationInputObjectSchema, WatchContentOrderByWithRelationInputObjectSchema.array()]).optional(), where: WatchContentWhereInputObjectSchema.optional(), cursor: WatchContentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), WatchContentCountAggregateInputObjectSchema ]).optional() }).strict();