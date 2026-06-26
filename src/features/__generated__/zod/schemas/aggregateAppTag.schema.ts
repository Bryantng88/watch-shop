import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AppTagOrderByWithRelationInputObjectSchema as AppTagOrderByWithRelationInputObjectSchema } from './objects/AppTagOrderByWithRelationInput.schema';
import { AppTagWhereInputObjectSchema as AppTagWhereInputObjectSchema } from './objects/AppTagWhereInput.schema';
import { AppTagWhereUniqueInputObjectSchema as AppTagWhereUniqueInputObjectSchema } from './objects/AppTagWhereUniqueInput.schema';
import { AppTagCountAggregateInputObjectSchema as AppTagCountAggregateInputObjectSchema } from './objects/AppTagCountAggregateInput.schema';
import { AppTagMinAggregateInputObjectSchema as AppTagMinAggregateInputObjectSchema } from './objects/AppTagMinAggregateInput.schema';
import { AppTagMaxAggregateInputObjectSchema as AppTagMaxAggregateInputObjectSchema } from './objects/AppTagMaxAggregateInput.schema';

export const AppTagAggregateSchema: z.ZodType<Prisma.AppTagAggregateArgs> = z.object({ orderBy: z.union([AppTagOrderByWithRelationInputObjectSchema, AppTagOrderByWithRelationInputObjectSchema.array()]).optional(), where: AppTagWhereInputObjectSchema.optional(), cursor: AppTagWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), AppTagCountAggregateInputObjectSchema ]).optional(), _min: AppTagMinAggregateInputObjectSchema.optional(), _max: AppTagMaxAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.AppTagAggregateArgs>;

export const AppTagAggregateZodSchema = z.object({ orderBy: z.union([AppTagOrderByWithRelationInputObjectSchema, AppTagOrderByWithRelationInputObjectSchema.array()]).optional(), where: AppTagWhereInputObjectSchema.optional(), cursor: AppTagWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), AppTagCountAggregateInputObjectSchema ]).optional(), _min: AppTagMinAggregateInputObjectSchema.optional(), _max: AppTagMaxAggregateInputObjectSchema.optional() }).strict();