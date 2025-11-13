import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.bigint().optional(),
  bankName: z.string().optional()
}).strict();
export const BankWhereUniqueInputObjectSchema: z.ZodType<Prisma.BankWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.BankWhereUniqueInput>;
export const BankWhereUniqueInputObjectZodSchema = makeSchema();
