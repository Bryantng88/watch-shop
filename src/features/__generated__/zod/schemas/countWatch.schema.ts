import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchOrderByWithRelationInputObjectSchema as WatchOrderByWithRelationInputObjectSchema } from './objects/WatchOrderByWithRelationInput.schema';
import { WatchWhereInputObjectSchema as WatchWhereInputObjectSchema } from './objects/WatchWhereInput.schema';
import { WatchWhereUniqueInputObjectSchema as WatchWhereUniqueInputObjectSchema } from './objects/WatchWhereUniqueInput.schema';
import { WatchCountAggregateInputObjectSchema as WatchCountAggregateInputObjectSchema } from './objects/WatchCountAggregateInput.schema';

export const WatchCountSchema: z.ZodType<Prisma.WatchCountArgs> = z.object({ orderBy: z.union([WatchOrderByWithRelationInputObjectSchema, WatchOrderByWithRelationInputObjectSchema.array()]).optional(), where: WatchWhereInputObjectSchema.optional(), cursor: WatchWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), WatchCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.WatchCountArgs>;

export const WatchCountZodSchema = z.object({ orderBy: z.union([WatchOrderByWithRelationInputObjectSchema, WatchOrderByWithRelationInputObjectSchema.array()]).optional(), where: WatchWhereInputObjectSchema.optional(), cursor: WatchWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), WatchCountAggregateInputObjectSchema ]).optional() }).strict();