import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  items: z.boolean().optional()
}).strict();
export const InvoiceCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.InvoiceCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceCountOutputTypeSelect>;
export const InvoiceCountOutputTypeSelectObjectZodSchema = makeSchema();
