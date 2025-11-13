import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { BankSelectObjectSchema as BankSelectObjectSchema } from './objects/BankSelect.schema';
import { BankIncludeObjectSchema as BankIncludeObjectSchema } from './objects/BankInclude.schema';
import { BankWhereUniqueInputObjectSchema as BankWhereUniqueInputObjectSchema } from './objects/BankWhereUniqueInput.schema';
import { BankCreateInputObjectSchema as BankCreateInputObjectSchema } from './objects/BankCreateInput.schema';
import { BankUncheckedCreateInputObjectSchema as BankUncheckedCreateInputObjectSchema } from './objects/BankUncheckedCreateInput.schema';
import { BankUpdateInputObjectSchema as BankUpdateInputObjectSchema } from './objects/BankUpdateInput.schema';
import { BankUncheckedUpdateInputObjectSchema as BankUncheckedUpdateInputObjectSchema } from './objects/BankUncheckedUpdateInput.schema';

export const BankUpsertOneSchema: z.ZodType<Prisma.BankUpsertArgs> = z.object({ select: BankSelectObjectSchema.optional(), include: BankIncludeObjectSchema.optional(), where: BankWhereUniqueInputObjectSchema, create: z.union([ BankCreateInputObjectSchema, BankUncheckedCreateInputObjectSchema ]), update: z.union([ BankUpdateInputObjectSchema, BankUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.BankUpsertArgs>;

export const BankUpsertOneZodSchema = z.object({ select: BankSelectObjectSchema.optional(), include: BankIncludeObjectSchema.optional(), where: BankWhereUniqueInputObjectSchema, create: z.union([ BankCreateInputObjectSchema, BankUncheckedCreateInputObjectSchema ]), update: z.union([ BankUpdateInputObjectSchema, BankUncheckedUpdateInputObjectSchema ]) }).strict();