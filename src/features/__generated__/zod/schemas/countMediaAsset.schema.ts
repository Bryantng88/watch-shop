import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MediaAssetOrderByWithRelationInputObjectSchema as MediaAssetOrderByWithRelationInputObjectSchema } from './objects/MediaAssetOrderByWithRelationInput.schema';
import { MediaAssetWhereInputObjectSchema as MediaAssetWhereInputObjectSchema } from './objects/MediaAssetWhereInput.schema';
import { MediaAssetWhereUniqueInputObjectSchema as MediaAssetWhereUniqueInputObjectSchema } from './objects/MediaAssetWhereUniqueInput.schema';
import { MediaAssetCountAggregateInputObjectSchema as MediaAssetCountAggregateInputObjectSchema } from './objects/MediaAssetCountAggregateInput.schema';

export const MediaAssetCountSchema: z.ZodType<Prisma.MediaAssetCountArgs> = z.object({ orderBy: z.union([MediaAssetOrderByWithRelationInputObjectSchema, MediaAssetOrderByWithRelationInputObjectSchema.array()]).optional(), where: MediaAssetWhereInputObjectSchema.optional(), cursor: MediaAssetWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), MediaAssetCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.MediaAssetCountArgs>;

export const MediaAssetCountZodSchema = z.object({ orderBy: z.union([MediaAssetOrderByWithRelationInputObjectSchema, MediaAssetOrderByWithRelationInputObjectSchema.array()]).optional(), where: MediaAssetWhereInputObjectSchema.optional(), cursor: MediaAssetWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), MediaAssetCountAggregateInputObjectSchema ]).optional() }).strict();