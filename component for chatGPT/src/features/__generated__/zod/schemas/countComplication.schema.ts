import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ComplicationOrderByWithRelationInputObjectSchema as ComplicationOrderByWithRelationInputObjectSchema } from './objects/ComplicationOrderByWithRelationInput.schema';
import { ComplicationWhereInputObjectSchema as ComplicationWhereInputObjectSchema } from './objects/ComplicationWhereInput.schema';
import { ComplicationWhereUniqueInputObjectSchema as ComplicationWhereUniqueInputObjectSchema } from './objects/ComplicationWhereUniqueInput.schema';
import { ComplicationCountAggregateInputObjectSchema as ComplicationCountAggregateInputObjectSchema } from './objects/ComplicationCountAggregateInput.schema';

export const ComplicationCountSchema: z.ZodType<Prisma.ComplicationCountArgs> = z.object({ orderBy: z.union([ComplicationOrderByWithRelationInputObjectSchema, ComplicationOrderByWithRelationInputObjectSchema.array()]).optional(), where: ComplicationWhereInputObjectSchema.optional(), cursor: ComplicationWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), ComplicationCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.ComplicationCountArgs>;

export const ComplicationCountZodSchema = z.object({ orderBy: z.union([ComplicationOrderByWithRelationInputObjectSchema, ComplicationOrderByWithRelationInputObjectSchema.array()]).optional(), where: ComplicationWhereInputObjectSchema.optional(), cursor: ComplicationWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), ComplicationCountAggregateInputObjectSchema ]).optional() }).strict();