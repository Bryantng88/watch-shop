import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { BankSelectObjectSchema as BankSelectObjectSchema } from './objects/BankSelect.schema';
import { BankIncludeObjectSchema as BankIncludeObjectSchema } from './objects/BankInclude.schema';
import { BankWhereUniqueInputObjectSchema as BankWhereUniqueInputObjectSchema } from './objects/BankWhereUniqueInput.schema';

export const BankDeleteOneSchema: z.ZodType<Prisma.BankDeleteArgs> = z.object({ select: BankSelectObjectSchema.optional(), include: BankIncludeObjectSchema.optional(), where: BankWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.BankDeleteArgs>;

export const BankDeleteOneZodSchema = z.object({ select: BankSelectObjectSchema.optional(), include: BankIncludeObjectSchema.optional(), where: BankWhereUniqueInputObjectSchema }).strict();