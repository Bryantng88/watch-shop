import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceWhereInputObjectSchema as InvoiceWhereInputObjectSchema } from './InvoiceWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => InvoiceWhereInputObjectSchema).optional(),
  some: z.lazy(() => InvoiceWhereInputObjectSchema).optional(),
  none: z.lazy(() => InvoiceWhereInputObjectSchema).optional()
}).strict();
export const InvoiceListRelationFilterObjectSchema: z.ZodType<Prisma.InvoiceListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceListRelationFilter>;
export const InvoiceListRelationFilterObjectZodSchema = makeSchema();
