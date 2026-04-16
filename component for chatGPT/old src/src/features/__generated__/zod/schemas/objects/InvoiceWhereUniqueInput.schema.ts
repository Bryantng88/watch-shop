import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  code: z.string().optional()
}).strict();
export const InvoiceWhereUniqueInputObjectSchema: z.ZodType<Prisma.InvoiceWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceWhereUniqueInput>;
export const InvoiceWhereUniqueInputObjectZodSchema = makeSchema();
