import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { BankSelectObjectSchema as BankSelectObjectSchema } from './objects/BankSelect.schema';
import { BankCreateManyInputObjectSchema as BankCreateManyInputObjectSchema } from './objects/BankCreateManyInput.schema';

export const BankCreateManyAndReturnSchema: z.ZodType<Prisma.BankCreateManyAndReturnArgs> = z.object({ select: BankSelectObjectSchema.optional(), data: z.union([ BankCreateManyInputObjectSchema, z.array(BankCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.BankCreateManyAndReturnArgs>;

export const BankCreateManyAndReturnZodSchema = z.object({ select: BankSelectObjectSchema.optional(), data: z.union([ BankCreateManyInputObjectSchema, z.array(BankCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();