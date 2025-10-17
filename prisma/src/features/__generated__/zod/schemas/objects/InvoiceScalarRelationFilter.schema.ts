import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceWhereInputObjectSchema as InvoiceWhereInputObjectSchema } from './InvoiceWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => InvoiceWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => InvoiceWhereInputObjectSchema).optional()
}).strict();
export const InvoiceScalarRelationFilterObjectSchema: z.ZodType<Prisma.InvoiceScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceScalarRelationFilter>;
export const InvoiceScalarRelationFilterObjectZodSchema = makeSchema();
