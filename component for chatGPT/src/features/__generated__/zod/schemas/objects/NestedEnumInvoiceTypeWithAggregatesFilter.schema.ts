import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceTypeSchema } from '../enums/InvoiceType.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumInvoiceTypeFilterObjectSchema as NestedEnumInvoiceTypeFilterObjectSchema } from './NestedEnumInvoiceTypeFilter.schema'

const nestedenuminvoicetypewithaggregatesfilterSchema = z.object({
  equals: InvoiceTypeSchema.optional(),
  in: InvoiceTypeSchema.array().optional(),
  notIn: InvoiceTypeSchema.array().optional(),
  not: z.union([InvoiceTypeSchema, z.lazy(() => NestedEnumInvoiceTypeWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumInvoiceTypeFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumInvoiceTypeFilterObjectSchema).optional()
}).strict();
export const NestedEnumInvoiceTypeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumInvoiceTypeWithAggregatesFilter> = nestedenuminvoicetypewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumInvoiceTypeWithAggregatesFilter>;
export const NestedEnumInvoiceTypeWithAggregatesFilterObjectZodSchema = nestedenuminvoicetypewithaggregatesfilterSchema;
