import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AppTagOrderByWithRelationInputObjectSchema as AppTagOrderByWithRelationInputObjectSchema } from './objects/AppTagOrderByWithRelationInput.schema';
import { AppTagWhereInputObjectSchema as AppTagWhereInputObjectSchema } from './objects/AppTagWhereInput.schema';
import { AppTagWhereUniqueInputObjectSchema as AppTagWhereUniqueInputObjectSchema } from './objects/AppTagWhereUniqueInput.schema';
import { AppTagCountAggregateInputObjectSchema as AppTagCountAggregateInputObjectSchema } from './objects/AppTagCountAggregateInput.schema';

export const AppTagCountSchema: z.ZodType<Prisma.AppTagCountArgs> = z.object({ orderBy: z.union([AppTagOrderByWithRelationInputObjectSchema, AppTagOrderByWithRelationInputObjectSchema.array()]).optional(), where: AppTagWhereInputObjectSchema.optional(), cursor: AppTagWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), AppTagCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.AppTagCountArgs>;

export const AppTagCountZodSchema = z.object({ orderBy: z.union([AppTagOrderByWithRelationInputObjectSchema, AppTagOrderByWithRelationInputObjectSchema.array()]).optional(), where: AppTagWhereInputObjectSchema.optional(), cursor: AppTagWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), AppTagCountAggregateInputObjectSchema ]).optional() }).strict();