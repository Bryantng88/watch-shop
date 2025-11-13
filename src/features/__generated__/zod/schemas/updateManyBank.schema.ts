import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { BankUpdateManyMutationInputObjectSchema as BankUpdateManyMutationInputObjectSchema } from './objects/BankUpdateManyMutationInput.schema';
import { BankWhereInputObjectSchema as BankWhereInputObjectSchema } from './objects/BankWhereInput.schema';

export const BankUpdateManySchema: z.ZodType<Prisma.BankUpdateManyArgs> = z.object({ data: BankUpdateManyMutationInputObjectSchema, where: BankWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.BankUpdateManyArgs>;

export const BankUpdateManyZodSchema = z.object({ data: BankUpdateManyMutationInputObjectSchema, where: BankWhereInputObjectSchema.optional() }).strict();