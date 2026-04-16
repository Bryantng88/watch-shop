import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { BankSelectObjectSchema as BankSelectObjectSchema } from './objects/BankSelect.schema';
import { BankIncludeObjectSchema as BankIncludeObjectSchema } from './objects/BankInclude.schema';
import { BankWhereUniqueInputObjectSchema as BankWhereUniqueInputObjectSchema } from './objects/BankWhereUniqueInput.schema';

export const BankFindUniqueOrThrowSchema: z.ZodType<Prisma.BankFindUniqueOrThrowArgs> = z.object({ select: BankSelectObjectSchema.optional(), include: BankIncludeObjectSchema.optional(), where: BankWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.BankFindUniqueOrThrowArgs>;

export const BankFindUniqueOrThrowZodSchema = z.object({ select: BankSelectObjectSchema.optional(), include: BankIncludeObjectSchema.optional(), where: BankWhereUniqueInputObjectSchema }).strict();