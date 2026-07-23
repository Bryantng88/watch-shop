import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MediaObjectOrderByWithRelationInputObjectSchema as MediaObjectOrderByWithRelationInputObjectSchema } from './objects/MediaObjectOrderByWithRelationInput.schema';
import { MediaObjectWhereInputObjectSchema as MediaObjectWhereInputObjectSchema } from './objects/MediaObjectWhereInput.schema';
import { MediaObjectWhereUniqueInputObjectSchema as MediaObjectWhereUniqueInputObjectSchema } from './objects/MediaObjectWhereUniqueInput.schema';
import { MediaObjectCountAggregateInputObjectSchema as MediaObjectCountAggregateInputObjectSchema } from './objects/MediaObjectCountAggregateInput.schema';

export const MediaObjectCountSchema: z.ZodType<Prisma.MediaObjectCountArgs> = z.object({ orderBy: z.union([MediaObjectOrderByWithRelationInputObjectSchema, MediaObjectOrderByWithRelationInputObjectSchema.array()]).optional(), where: MediaObjectWhereInputObjectSchema.optional(), cursor: MediaObjectWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), MediaObjectCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.MediaObjectCountArgs>;

export const MediaObjectCountZodSchema = z.object({ orderBy: z.union([MediaObjectOrderByWithRelationInputObjectSchema, MediaObjectOrderByWithRelationInputObjectSchema.array()]).optional(), where: MediaObjectWhereInputObjectSchema.optional(), cursor: MediaObjectWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), MediaObjectCountAggregateInputObjectSchema ]).optional() }).strict();