import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MediaBindingOrderByWithRelationInputObjectSchema as MediaBindingOrderByWithRelationInputObjectSchema } from './objects/MediaBindingOrderByWithRelationInput.schema';
import { MediaBindingWhereInputObjectSchema as MediaBindingWhereInputObjectSchema } from './objects/MediaBindingWhereInput.schema';
import { MediaBindingWhereUniqueInputObjectSchema as MediaBindingWhereUniqueInputObjectSchema } from './objects/MediaBindingWhereUniqueInput.schema';
import { MediaBindingCountAggregateInputObjectSchema as MediaBindingCountAggregateInputObjectSchema } from './objects/MediaBindingCountAggregateInput.schema';

export const MediaBindingCountSchema: z.ZodType<Prisma.MediaBindingCountArgs> = z.object({ orderBy: z.union([MediaBindingOrderByWithRelationInputObjectSchema, MediaBindingOrderByWithRelationInputObjectSchema.array()]).optional(), where: MediaBindingWhereInputObjectSchema.optional(), cursor: MediaBindingWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), MediaBindingCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.MediaBindingCountArgs>;

export const MediaBindingCountZodSchema = z.object({ orderBy: z.union([MediaBindingOrderByWithRelationInputObjectSchema, MediaBindingOrderByWithRelationInputObjectSchema.array()]).optional(), where: MediaBindingWhereInputObjectSchema.optional(), cursor: MediaBindingWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), MediaBindingCountAggregateInputObjectSchema ]).optional() }).strict();