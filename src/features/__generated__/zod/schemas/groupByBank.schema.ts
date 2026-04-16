import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { BankWhereInputObjectSchema as BankWhereInputObjectSchema } from './objects/BankWhereInput.schema';
import { BankOrderByWithAggregationInputObjectSchema as BankOrderByWithAggregationInputObjectSchema } from './objects/BankOrderByWithAggregationInput.schema';
import { BankScalarWhereWithAggregatesInputObjectSchema as BankScalarWhereWithAggregatesInputObjectSchema } from './objects/BankScalarWhereWithAggregatesInput.schema';
import { BankScalarFieldEnumSchema } from './enums/BankScalarFieldEnum.schema';
import { BankCountAggregateInputObjectSchema as BankCountAggregateInputObjectSchema } from './objects/BankCountAggregateInput.schema';
import { BankMinAggregateInputObjectSchema as BankMinAggregateInputObjectSchema } from './objects/BankMinAggregateInput.schema';
import { BankMaxAggregateInputObjectSchema as BankMaxAggregateInputObjectSchema } from './objects/BankMaxAggregateInput.schema';
import { BankAvgAggregateInputObjectSchema as BankAvgAggregateInputObjectSchema } from './objects/BankAvgAggregateInput.schema';
import { BankSumAggregateInputObjectSchema as BankSumAggregateInputObjectSchema } from './objects/BankSumAggregateInput.schema';

export const BankGroupBySchema: z.ZodType<Prisma.BankGroupByArgs> = z.object({ where: BankWhereInputObjectSchema.optional(), orderBy: z.union([BankOrderByWithAggregationInputObjectSchema, BankOrderByWithAggregationInputObjectSchema.array()]).optional(), having: BankScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(BankScalarFieldEnumSchema), _count: z.union([ z.literal(true), BankCountAggregateInputObjectSchema ]).optional(), _min: BankMinAggregateInputObjectSchema.optional(), _max: BankMaxAggregateInputObjectSchema.optional(), _avg: BankAvgAggregateInputObjectSchema.optional(), _sum: BankSumAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.BankGroupByArgs>;

export const BankGroupByZodSchema = z.object({ where: BankWhereInputObjectSchema.optional(), orderBy: z.union([BankOrderByWithAggregationInputObjectSchema, BankOrderByWithAggregationInputObjectSchema.array()]).optional(), having: BankScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(BankScalarFieldEnumSchema), _count: z.union([ z.literal(true), BankCountAggregateInputObjectSchema ]).optional(), _min: BankMinAggregateInputObjectSchema.optional(), _max: BankMaxAggregateInputObjectSchema.optional(), _avg: BankAvgAggregateInputObjectSchema.optional(), _sum: BankSumAggregateInputObjectSchema.optional() }).strict();