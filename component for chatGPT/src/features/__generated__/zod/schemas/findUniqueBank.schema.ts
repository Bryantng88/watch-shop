import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { BankSelectObjectSchema as BankSelectObjectSchema } from './objects/BankSelect.schema';
import { BankIncludeObjectSchema as BankIncludeObjectSchema } from './objects/BankInclude.schema';
import { BankWhereUniqueInputObjectSchema as BankWhereUniqueInputObjectSchema } from './objects/BankWhereUniqueInput.schema';

export const BankFindUniqueSchema: z.ZodType<Prisma.BankFindUniqueArgs> = z.object({ select: BankSelectObjectSchema.optional(), include: BankIncludeObjectSchema.optional(), where: BankWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.BankFindUniqueArgs>;

export const BankFindUniqueZodSchema = z.object({ select: BankSelectObjectSchema.optional(), include: BankIncludeObjectSchema.optional(), where: BankWhereUniqueInputObjectSchema }).strict();