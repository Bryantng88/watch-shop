import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { BankOrderByWithRelationInputObjectSchema as BankOrderByWithRelationInputObjectSchema } from './objects/BankOrderByWithRelationInput.schema';
import { BankWhereInputObjectSchema as BankWhereInputObjectSchema } from './objects/BankWhereInput.schema';
import { BankWhereUniqueInputObjectSchema as BankWhereUniqueInputObjectSchema } from './objects/BankWhereUniqueInput.schema';
import { BankCountAggregateInputObjectSchema as BankCountAggregateInputObjectSchema } from './objects/BankCountAggregateInput.schema';

export const BankCountSchema: z.ZodType<Prisma.BankCountArgs> = z.object({ orderBy: z.union([BankOrderByWithRelationInputObjectSchema, BankOrderByWithRelationInputObjectSchema.array()]).optional(), where: BankWhereInputObjectSchema.optional(), cursor: BankWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), BankCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.BankCountArgs>;

export const BankCountZodSchema = z.object({ orderBy: z.union([BankOrderByWithRelationInputObjectSchema, BankOrderByWithRelationInputObjectSchema.array()]).optional(), where: BankWhereInputObjectSchema.optional(), cursor: BankWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), BankCountAggregateInputObjectSchema ]).optional() }).strict();