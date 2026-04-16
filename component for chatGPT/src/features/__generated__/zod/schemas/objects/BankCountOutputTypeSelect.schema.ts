import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  Vendor: z.boolean().optional()
}).strict();
export const BankCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.BankCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.BankCountOutputTypeSelect>;
export const BankCountOutputTypeSelectObjectZodSchema = makeSchema();
