import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchSpecOrderByWithRelationInputObjectSchema as WatchSpecOrderByWithRelationInputObjectSchema } from './objects/WatchSpecOrderByWithRelationInput.schema';
import { WatchSpecWhereInputObjectSchema as WatchSpecWhereInputObjectSchema } from './objects/WatchSpecWhereInput.schema';
import { WatchSpecWhereUniqueInputObjectSchema as WatchSpecWhereUniqueInputObjectSchema } from './objects/WatchSpecWhereUniqueInput.schema';
import { WatchSpecCountAggregateInputObjectSchema as WatchSpecCountAggregateInputObjectSchema } from './objects/WatchSpecCountAggregateInput.schema';

export const WatchSpecCountSchema: z.ZodType<Prisma.WatchSpecCountArgs> = z.object({ orderBy: z.union([WatchSpecOrderByWithRelationInputObjectSchema, WatchSpecOrderByWithRelationInputObjectSchema.array()]).optional(), where: WatchSpecWhereInputObjectSchema.optional(), cursor: WatchSpecWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), WatchSpecCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.WatchSpecCountArgs>;

export const WatchSpecCountZodSchema = z.object({ orderBy: z.union([WatchSpecOrderByWithRelationInputObjectSchema, WatchSpecOrderByWithRelationInputObjectSchema.array()]).optional(), where: WatchSpecWhereInputObjectSchema.optional(), cursor: WatchSpecWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), WatchSpecCountAggregateInputObjectSchema ]).optional() }).strict();