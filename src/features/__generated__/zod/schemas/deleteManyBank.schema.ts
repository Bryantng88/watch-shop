import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { BankWhereInputObjectSchema as BankWhereInputObjectSchema } from './objects/BankWhereInput.schema';

export const BankDeleteManySchema: z.ZodType<Prisma.BankDeleteManyArgs> = z.object({ where: BankWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.BankDeleteManyArgs>;

export const BankDeleteManyZodSchema = z.object({ where: BankWhereInputObjectSchema.optional() }).strict();