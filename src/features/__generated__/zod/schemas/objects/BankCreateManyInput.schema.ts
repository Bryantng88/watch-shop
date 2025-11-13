import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.bigint().optional(),
  created_at: z.coerce.date().optional(),
  bankName: z.string()
}).strict();
export const BankCreateManyInputObjectSchema: z.ZodType<Prisma.BankCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.BankCreateManyInput>;
export const BankCreateManyInputObjectZodSchema = makeSchema();
