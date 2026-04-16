import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { BankSelectObjectSchema as BankSelectObjectSchema } from './objects/BankSelect.schema';
import { BankIncludeObjectSchema as BankIncludeObjectSchema } from './objects/BankInclude.schema';
import { BankCreateInputObjectSchema as BankCreateInputObjectSchema } from './objects/BankCreateInput.schema';
import { BankUncheckedCreateInputObjectSchema as BankUncheckedCreateInputObjectSchema } from './objects/BankUncheckedCreateInput.schema';

export const BankCreateOneSchema: z.ZodType<Prisma.BankCreateArgs> = z.object({ select: BankSelectObjectSchema.optional(), include: BankIncludeObjectSchema.optional(), data: z.union([BankCreateInputObjectSchema, BankUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.BankCreateArgs>;

export const BankCreateOneZodSchema = z.object({ select: BankSelectObjectSchema.optional(), include: BankIncludeObjectSchema.optional(), data: z.union([BankCreateInputObjectSchema, BankUncheckedCreateInputObjectSchema]) }).strict();