import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceItemWhereInputObjectSchema as InvoiceItemWhereInputObjectSchema } from './InvoiceItemWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => InvoiceItemWhereInputObjectSchema).optional(),
  some: z.lazy(() => InvoiceItemWhereInputObjectSchema).optional(),
  none: z.lazy(() => InvoiceItemWhereInputObjectSchema).optional()
}).strict();
export const InvoiceItemListRelationFilterObjectSchema: z.ZodType<Prisma.InvoiceItemListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceItemListRelationFilter>;
export const InvoiceItemListRelationFilterObjectZodSchema = makeSchema();
