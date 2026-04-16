import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceTypeSchema } from '../enums/InvoiceType.schema';
import { NestedEnumInvoiceTypeFilterObjectSchema as NestedEnumInvoiceTypeFilterObjectSchema } from './NestedEnumInvoiceTypeFilter.schema'

const makeSchema = () => z.object({
  equals: InvoiceTypeSchema.optional(),
  in: InvoiceTypeSchema.array().optional(),
  notIn: InvoiceTypeSchema.array().optional(),
  not: z.union([InvoiceTypeSchema, z.lazy(() => NestedEnumInvoiceTypeFilterObjectSchema)]).optional()
}).strict();
export const EnumInvoiceTypeFilterObjectSchema: z.ZodType<Prisma.EnumInvoiceTypeFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumInvoiceTypeFilter>;
export const EnumInvoiceTypeFilterObjectZodSchema = makeSchema();
