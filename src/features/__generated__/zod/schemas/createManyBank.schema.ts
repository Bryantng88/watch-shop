import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { BankCreateManyInputObjectSchema as BankCreateManyInputObjectSchema } from './objects/BankCreateManyInput.schema';

export const BankCreateManySchema: z.ZodType<Prisma.BankCreateManyArgs> = z.object({ data: z.union([ BankCreateManyInputObjectSchema, z.array(BankCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.BankCreateManyArgs>;

export const BankCreateManyZodSchema = z.object({ data: z.union([ BankCreateManyInputObjectSchema, z.array(BankCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();