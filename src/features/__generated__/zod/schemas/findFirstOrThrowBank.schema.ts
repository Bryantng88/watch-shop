import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { BankIncludeObjectSchema as BankIncludeObjectSchema } from './objects/BankInclude.schema';
import { BankOrderByWithRelationInputObjectSchema as BankOrderByWithRelationInputObjectSchema } from './objects/BankOrderByWithRelationInput.schema';
import { BankWhereInputObjectSchema as BankWhereInputObjectSchema } from './objects/BankWhereInput.schema';
import { BankWhereUniqueInputObjectSchema as BankWhereUniqueInputObjectSchema } from './objects/BankWhereUniqueInput.schema';
import { BankScalarFieldEnumSchema } from './enums/BankScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const BankFindFirstOrThrowSelectSchema: z.ZodType<Prisma.BankSelect> = z.object({
    id: z.boolean().optional(),
    created_at: z.boolean().optional(),
    bankName: z.boolean().optional(),
    Vendor: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.BankSelect>;

export const BankFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    created_at: z.boolean().optional(),
    bankName: z.boolean().optional(),
    Vendor: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const BankFindFirstOrThrowSchema: z.ZodType<Prisma.BankFindFirstOrThrowArgs> = z.object({ select: BankFindFirstOrThrowSelectSchema.optional(), include: BankIncludeObjectSchema.optional(), orderBy: z.union([BankOrderByWithRelationInputObjectSchema, BankOrderByWithRelationInputObjectSchema.array()]).optional(), where: BankWhereInputObjectSchema.optional(), cursor: BankWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([BankScalarFieldEnumSchema, BankScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.BankFindFirstOrThrowArgs>;

export const BankFindFirstOrThrowZodSchema = z.object({ select: BankFindFirstOrThrowSelectSchema.optional(), include: BankIncludeObjectSchema.optional(), orderBy: z.union([BankOrderByWithRelationInputObjectSchema, BankOrderByWithRelationInputObjectSchema.array()]).optional(), where: BankWhereInputObjectSchema.optional(), cursor: BankWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([BankScalarFieldEnumSchema, BankScalarFieldEnumSchema.array()]).optional() }).strict();