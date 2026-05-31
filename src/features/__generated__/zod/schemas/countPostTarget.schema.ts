import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PostTargetOrderByWithRelationInputObjectSchema as PostTargetOrderByWithRelationInputObjectSchema } from './objects/PostTargetOrderByWithRelationInput.schema';
import { PostTargetWhereInputObjectSchema as PostTargetWhereInputObjectSchema } from './objects/PostTargetWhereInput.schema';
import { PostTargetWhereUniqueInputObjectSchema as PostTargetWhereUniqueInputObjectSchema } from './objects/PostTargetWhereUniqueInput.schema';
import { PostTargetCountAggregateInputObjectSchema as PostTargetCountAggregateInputObjectSchema } from './objects/PostTargetCountAggregateInput.schema';

export const PostTargetCountSchema: z.ZodType<Prisma.PostTargetCountArgs> = z.object({ orderBy: z.union([PostTargetOrderByWithRelationInputObjectSchema, PostTargetOrderByWithRelationInputObjectSchema.array()]).optional(), where: PostTargetWhereInputObjectSchema.optional(), cursor: PostTargetWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), PostTargetCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.PostTargetCountArgs>;

export const PostTargetCountZodSchema = z.object({ orderBy: z.union([PostTargetOrderByWithRelationInputObjectSchema, PostTargetOrderByWithRelationInputObjectSchema.array()]).optional(), where: PostTargetWhereInputObjectSchema.optional(), cursor: PostTargetWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), PostTargetCountAggregateInputObjectSchema ]).optional() }).strict();