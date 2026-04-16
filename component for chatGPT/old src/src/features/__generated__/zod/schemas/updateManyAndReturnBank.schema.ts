import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { BankSelectObjectSchema as BankSelectObjectSchema } from './objects/BankSelect.schema';
import { BankUpdateManyMutationInputObjectSchema as BankUpdateManyMutationInputObjectSchema } from './objects/BankUpdateManyMutationInput.schema';
import { BankWhereInputObjectSchema as BankWhereInputObjectSchema } from './objects/BankWhereInput.schema';

export const BankUpdateManyAndReturnSchema: z.ZodType<Prisma.BankUpdateManyAndReturnArgs> = z.object({ select: BankSelectObjectSchema.optional(), data: BankUpdateManyMutationInputObjectSchema, where: BankWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.BankUpdateManyAndReturnArgs>;

export const BankUpdateManyAndReturnZodSchema = z.object({ select: BankSelectObjectSchema.optional(), data: BankUpdateManyMutationInputObjectSchema, where: BankWhereInputObjectSchema.optional() }).strict();