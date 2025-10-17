import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional()
}).strict();
export const InvoiceItemWhereUniqueInputObjectSchema: z.ZodType<Prisma.InvoiceItemWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceItemWhereUniqueInput>;
export const InvoiceItemWhereUniqueInputObjectZodSchema = makeSchema();
