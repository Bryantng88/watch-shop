import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { BankOrderByWithRelationInputObjectSchema as BankOrderByWithRelationInputObjectSchema } from './objects/BankOrderByWithRelationInput.schema';
import { BankWhereInputObjectSchema as BankWhereInputObjectSchema } from './objects/BankWhereInput.schema';
import { BankWhereUniqueInputObjectSchema as BankWhereUniqueInputObjectSchema } from './objects/BankWhereUniqueInput.schema';
import { BankCountAggregateInputObjectSchema as BankCountAggregateInputObjectSchema } from './objects/BankCountAggregateInput.schema';
import { BankMinAggregateInputObjectSchema as BankMinAggregateInputObjectSchema } from './objects/BankMinAggregateInput.schema';
import { BankMaxAggregateInputObjectSchema as BankMaxAggregateInputObjectSchema } from './objects/BankMaxAggregateInput.schema';
import { BankAvgAggregateInputObjectSchema as BankAvgAggregateInputObjectSchema } from './objects/BankAvgAggregateInput.schema';
import { BankSumAggregateInputObjectSchema as BankSumAggregateInputObjectSchema } from './objects/BankSumAggregateInput.schema';

export const BankAggregateSchema: z.ZodType<Prisma.BankAggregateArgs> = z.object({ orderBy: z.union([BankOrderByWithRelationInputObjectSchema, BankOrderByWithRelationInputObjectSchema.array()]).optional(), where: BankWhereInputObjectSchema.optional(), cursor: BankWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), BankCountAggregateInputObjectSchema ]).optional(), _min: BankMinAggregateInputObjectSchema.optional(), _max: BankMaxAggregateInputObjectSchema.optional(), _avg: BankAvgAggregateInputObjectSchema.optional(), _sum: BankSumAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.BankAggregateArgs>;

export const BankAggregateZodSchema = z.object({ orderBy: z.union([BankOrderByWithRelationInputObjectSchema, BankOrderByWithRelationInputObjectSchema.array()]).optional(), where: BankWhereInputObjectSchema.optional(), cursor: BankWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), BankCountAggregateInputObjectSchema ]).optional(), _min: BankMinAggregateInputObjectSchema.optional(), _max: BankMaxAggregateInputObjectSchema.optional(), _avg: BankAvgAggregateInputObjectSchema.optional(), _sum: BankSumAggregateInputObjectSchema.optional() }).strict();