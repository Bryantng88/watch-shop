import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MediaOperationOrderByWithRelationInputObjectSchema as MediaOperationOrderByWithRelationInputObjectSchema } from './objects/MediaOperationOrderByWithRelationInput.schema';
import { MediaOperationWhereInputObjectSchema as MediaOperationWhereInputObjectSchema } from './objects/MediaOperationWhereInput.schema';
import { MediaOperationWhereUniqueInputObjectSchema as MediaOperationWhereUniqueInputObjectSchema } from './objects/MediaOperationWhereUniqueInput.schema';
import { MediaOperationCountAggregateInputObjectSchema as MediaOperationCountAggregateInputObjectSchema } from './objects/MediaOperationCountAggregateInput.schema';

export const MediaOperationCountSchema: z.ZodType<Prisma.MediaOperationCountArgs> = z.object({ orderBy: z.union([MediaOperationOrderByWithRelationInputObjectSchema, MediaOperationOrderByWithRelationInputObjectSchema.array()]).optional(), where: MediaOperationWhereInputObjectSchema.optional(), cursor: MediaOperationWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), MediaOperationCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.MediaOperationCountArgs>;

export const MediaOperationCountZodSchema = z.object({ orderBy: z.union([MediaOperationOrderByWithRelationInputObjectSchema, MediaOperationOrderByWithRelationInputObjectSchema.array()]).optional(), where: MediaOperationWhereInputObjectSchema.optional(), cursor: MediaOperationWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), MediaOperationCountAggregateInputObjectSchema ]).optional() }).strict();