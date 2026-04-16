import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceTypeSchema } from '../enums/InvoiceType.schema';
import { NestedEnumInvoiceTypeWithAggregatesFilterObjectSchema as NestedEnumInvoiceTypeWithAggregatesFilterObjectSchema } from './NestedEnumInvoiceTypeWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumInvoiceTypeFilterObjectSchema as NestedEnumInvoiceTypeFilterObjectSchema } from './NestedEnumInvoiceTypeFilter.schema'

const makeSchema = () => z.object({
  equals: InvoiceTypeSchema.optional(),
  in: InvoiceTypeSchema.array().optional(),
  notIn: InvoiceTypeSchema.array().optional(),
  not: z.union([InvoiceTypeSchema, z.lazy(() => NestedEnumInvoiceTypeWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumInvoiceTypeFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumInvoiceTypeFilterObjectSchema).optional()
}).strict();
export const EnumInvoiceTypeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumInvoiceTypeWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumInvoiceTypeWithAggregatesFilter>;
export const EnumInvoiceTypeWithAggregatesFilterObjectZodSchema = makeSchema();
