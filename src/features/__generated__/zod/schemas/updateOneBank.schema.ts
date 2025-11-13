import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { BankSelectObjectSchema as BankSelectObjectSchema } from './objects/BankSelect.schema';
import { BankIncludeObjectSchema as BankIncludeObjectSchema } from './objects/BankInclude.schema';
import { BankUpdateInputObjectSchema as BankUpdateInputObjectSchema } from './objects/BankUpdateInput.schema';
import { BankUncheckedUpdateInputObjectSchema as BankUncheckedUpdateInputObjectSchema } from './objects/BankUncheckedUpdateInput.schema';
import { BankWhereUniqueInputObjectSchema as BankWhereUniqueInputObjectSchema } from './objects/BankWhereUniqueInput.schema';

export const BankUpdateOneSchema: z.ZodType<Prisma.BankUpdateArgs> = z.object({ select: BankSelectObjectSchema.optional(), include: BankIncludeObjectSchema.optional(), data: z.union([BankUpdateInputObjectSchema, BankUncheckedUpdateInputObjectSchema]), where: BankWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.BankUpdateArgs>;

export const BankUpdateOneZodSchema = z.object({ select: BankSelectObjectSchema.optional(), include: BankIncludeObjectSchema.optional(), data: z.union([BankUpdateInputObjectSchema, BankUncheckedUpdateInputObjectSchema]), where: BankWhereUniqueInputObjectSchema }).strict();