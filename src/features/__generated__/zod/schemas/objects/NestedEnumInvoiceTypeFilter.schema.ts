import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceTypeSchema } from '../enums/InvoiceType.schema'

const nestedenuminvoicetypefilterSchema = z.object({
  equals: InvoiceTypeSchema.optional(),
  in: InvoiceTypeSchema.array().optional(),
  notIn: InvoiceTypeSchema.array().optional(),
  not: z.union([InvoiceTypeSchema, z.lazy(() => NestedEnumInvoiceTypeFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumInvoiceTypeFilterObjectSchema: z.ZodType<Prisma.NestedEnumInvoiceTypeFilter> = nestedenuminvoicetypefilterSchema as unknown as z.ZodType<Prisma.NestedEnumInvoiceTypeFilter>;
export const NestedEnumInvoiceTypeFilterObjectZodSchema = nestedenuminvoicetypefilterSchema;
