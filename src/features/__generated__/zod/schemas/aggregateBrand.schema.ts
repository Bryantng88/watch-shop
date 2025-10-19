import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { BrandOrderByWithRelationInputObjectSchema as BrandOrderByWithRelationInputObjectSchema } from './objects/BrandOrderByWithRelationInput.schema';
import { BrandWhereInputObjectSchema as BrandWhereInputObjectSchema } from './objects/BrandWhereInput.schema';
import { BrandWhereUniqueInputObjectSchema as BrandWhereUniqueInputObjectSchema } from './objects/BrandWhereUniqueInput.schema';
import { BrandCountAggregateInputObjectSchema as BrandCountAggregateInputObjectSchema } from './objects/BrandCountAggregateInput.schema';
import { BrandMinAggregateInputObjectSchema as BrandMinAggregateInputObjectSchema } from './objects/BrandMinAggregateInput.schema';
import { BrandMaxAggregateInputObjectSchema as BrandMaxAggregateInputObjectSchema } from './objects/BrandMaxAggregateInput.schema';
import { BrandAvgAggregateInputObjectSchema as BrandAvgAggregateInputObjectSchema } from './objects/BrandAvgAggregateInput.schema';
import { BrandSumAggregateInputObjectSchema as BrandSumAggregateInputObjectSchema } from './objects/BrandSumAggregateInput.schema';

export const BrandAggregateSchema: z.ZodType<Prisma.BrandAggregateArgs> = z.object({ orderBy: z.union([BrandOrderByWithRelationInputObjectSchema, BrandOrderByWithRelationInputObjectSchema.array()]).optional(), where: BrandWhereInputObjectSchema.optional(), cursor: BrandWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), BrandCountAggregateInputObjectSchema ]).optional(), _min: BrandMinAggregateInputObjectSchema.optional(), _max: BrandMaxAggregateInputObjectSchema.optional(), _avg: BrandAvgAggregateInputObjectSchema.optional(), _sum: BrandSumAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.BrandAggregateArgs>;

export const BrandAggregateZodSchema = z.object({ orderBy: z.union([BrandOrderByWithRelationInputObjectSchema, BrandOrderByWithRelationInputObjectSchema.array()]).optional(), where: BrandWhereInputObjectSchema.optional(), cursor: BrandWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), BrandCountAggregateInputObjectSchema ]).optional(), _min: BrandMinAggregateInputObjectSchema.optional(), _max: BrandMaxAggregateInputObjectSchema.optional(), _avg: BrandAvgAggregateInputObjectSchema.optional(), _sum: BrandSumAggregateInputObjectSchema.optional() }).strict();