import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AppTagWhereInputObjectSchema as AppTagWhereInputObjectSchema } from './objects/AppTagWhereInput.schema';
import { AppTagOrderByWithAggregationInputObjectSchema as AppTagOrderByWithAggregationInputObjectSchema } from './objects/AppTagOrderByWithAggregationInput.schema';
import { AppTagScalarWhereWithAggregatesInputObjectSchema as AppTagScalarWhereWithAggregatesInputObjectSchema } from './objects/AppTagScalarWhereWithAggregatesInput.schema';
import { AppTagScalarFieldEnumSchema } from './enums/AppTagScalarFieldEnum.schema';
import { AppTagCountAggregateInputObjectSchema as AppTagCountAggregateInputObjectSchema } from './objects/AppTagCountAggregateInput.schema';
import { AppTagMinAggregateInputObjectSchema as AppTagMinAggregateInputObjectSchema } from './objects/AppTagMinAggregateInput.schema';
import { AppTagMaxAggregateInputObjectSchema as AppTagMaxAggregateInputObjectSchema } from './objects/AppTagMaxAggregateInput.schema';

export const AppTagGroupBySchema: z.ZodType<Prisma.AppTagGroupByArgs> = z.object({ where: AppTagWhereInputObjectSchema.optional(), orderBy: z.union([AppTagOrderByWithAggregationInputObjectSchema, AppTagOrderByWithAggregationInputObjectSchema.array()]).optional(), having: AppTagScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(AppTagScalarFieldEnumSchema), _count: z.union([ z.literal(true), AppTagCountAggregateInputObjectSchema ]).optional(), _min: AppTagMinAggregateInputObjectSchema.optional(), _max: AppTagMaxAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.AppTagGroupByArgs>;

export const AppTagGroupByZodSchema = z.object({ where: AppTagWhereInputObjectSchema.optional(), orderBy: z.union([AppTagOrderByWithAggregationInputObjectSchema, AppTagOrderByWithAggregationInputObjectSchema.array()]).optional(), having: AppTagScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(AppTagScalarFieldEnumSchema), _count: z.union([ z.literal(true), AppTagCountAggregateInputObjectSchema ]).optional(), _min: AppTagMinAggregateInputObjectSchema.optional(), _max: AppTagMaxAggregateInputObjectSchema.optional() }).strict();