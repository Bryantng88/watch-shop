import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchMediaOrderByWithRelationInputObjectSchema as WatchMediaOrderByWithRelationInputObjectSchema } from './objects/WatchMediaOrderByWithRelationInput.schema';
import { WatchMediaWhereInputObjectSchema as WatchMediaWhereInputObjectSchema } from './objects/WatchMediaWhereInput.schema';
import { WatchMediaWhereUniqueInputObjectSchema as WatchMediaWhereUniqueInputObjectSchema } from './objects/WatchMediaWhereUniqueInput.schema';
import { WatchMediaCountAggregateInputObjectSchema as WatchMediaCountAggregateInputObjectSchema } from './objects/WatchMediaCountAggregateInput.schema';

export const WatchMediaCountSchema: z.ZodType<Prisma.WatchMediaCountArgs> = z.object({ orderBy: z.union([WatchMediaOrderByWithRelationInputObjectSchema, WatchMediaOrderByWithRelationInputObjectSchema.array()]).optional(), where: WatchMediaWhereInputObjectSchema.optional(), cursor: WatchMediaWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), WatchMediaCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.WatchMediaCountArgs>;

export const WatchMediaCountZodSchema = z.object({ orderBy: z.union([WatchMediaOrderByWithRelationInputObjectSchema, WatchMediaOrderByWithRelationInputObjectSchema.array()]).optional(), where: WatchMediaWhereInputObjectSchema.optional(), cursor: WatchMediaWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), WatchMediaCountAggregateInputObjectSchema ]).optional() }).strict();