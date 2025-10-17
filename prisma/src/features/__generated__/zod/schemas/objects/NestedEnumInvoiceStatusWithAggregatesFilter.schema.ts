import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceStatusSchema } from '../enums/InvoiceStatus.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumInvoiceStatusFilterObjectSchema as NestedEnumInvoiceStatusFilterObjectSchema } from './NestedEnumInvoiceStatusFilter.schema'

const nestedenuminvoicestatuswithaggregatesfilterSchema = z.object({
  equals: InvoiceStatusSchema.optional(),
  in: InvoiceStatusSchema.array().optional(),
  notIn: InvoiceStatusSchema.array().optional(),
  not: z.union([InvoiceStatusSchema, z.lazy(() => NestedEnumInvoiceStatusWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumInvoiceStatusFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumInvoiceStatusFilterObjectSchema).optional()
}).strict();
export const NestedEnumInvoiceStatusWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumInvoiceStatusWithAggregatesFilter> = nestedenuminvoicestatuswithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumInvoiceStatusWithAggregatesFilter>;
export const NestedEnumInvoiceStatusWithAggregatesFilterObjectZodSchema = nestedenuminvoicestatuswithaggregatesfilterSchema;
