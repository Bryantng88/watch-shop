import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { BrandWhereInputObjectSchema as BrandWhereInputObjectSchema } from './objects/BrandWhereInput.schema';
import { BrandOrderByWithAggregationInputObjectSchema as BrandOrderByWithAggregationInputObjectSchema } from './objects/BrandOrderByWithAggregationInput.schema';
import { BrandScalarWhereWithAggregatesInputObjectSchema as BrandScalarWhereWithAggregatesInputObjectSchema } from './objects/BrandScalarWhereWithAggregatesInput.schema';
import { BrandScalarFieldEnumSchema } from './enums/BrandScalarFieldEnum.schema';
import { BrandCountAggregateInputObjectSchema as BrandCountAggregateInputObjectSchema } from './objects/BrandCountAggregateInput.schema';
import { BrandMinAggregateInputObjectSchema as BrandMinAggregateInputObjectSchema } from './objects/BrandMinAggregateInput.schema';
import { BrandMaxAggregateInputObjectSchema as BrandMaxAggregateInputObjectSchema } from './objects/BrandMaxAggregateInput.schema';
import { BrandAvgAggregateInputObjectSchema as BrandAvgAggregateInputObjectSchema } from './objects/BrandAvgAggregateInput.schema';
import { BrandSumAggregateInputObjectSchema as BrandSumAggregateInputObjectSchema } from './objects/BrandSumAggregateInput.schema';

export const BrandGroupBySchema: z.ZodType<Prisma.BrandGroupByArgs> = z.object({ where: BrandWhereInputObjectSchema.optional(), orderBy: z.union([BrandOrderByWithAggregationInputObjectSchema, BrandOrderByWithAggregationInputObjectSchema.array()]).optional(), having: BrandScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(BrandScalarFieldEnumSchema), _count: z.union([ z.literal(true), BrandCountAggregateInputObjectSchema ]).optional(), _min: BrandMinAggregateInputObjectSchema.optional(), _max: BrandMaxAggregateInputObjectSchema.optional(), _avg: BrandAvgAggregateInputObjectSchema.optional(), _sum: BrandSumAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.BrandGroupByArgs>;

export const BrandGroupByZodSchema = z.object({ where: BrandWhereInputObjectSchema.optional(), orderBy: z.union([BrandOrderByWithAggregationInputObjectSchema, BrandOrderByWithAggregationInputObjectSchema.array()]).optional(), having: BrandScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(BrandScalarFieldEnumSchema), _count: z.union([ z.literal(true), BrandCountAggregateInputObjectSchema ]).optional(), _min: BrandMinAggregateInputObjectSchema.optional(), _max: BrandMaxAggregateInputObjectSchema.optional(), _avg: BrandAvgAggregateInputObjectSchema.optional(), _sum: BrandSumAggregateInputObjectSchema.optional() }).strict();