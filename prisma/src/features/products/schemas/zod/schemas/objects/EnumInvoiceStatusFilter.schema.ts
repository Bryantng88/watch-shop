import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceStatusSchema } from '../enums/InvoiceStatus.schema';
import { NestedEnumInvoiceStatusFilterObjectSchema as NestedEnumInvoiceStatusFilterObjectSchema } from './NestedEnumInvoiceStatusFilter.schema'

const makeSchema = () => z.object({
  equals: InvoiceStatusSchema.optional(),
  in: InvoiceStatusSchema.array().optional(),
  notIn: InvoiceStatusSchema.array().optional(),
  not: z.union([InvoiceStatusSchema, z.lazy(() => NestedEnumInvoiceStatusFilterObjectSchema)]).optional()
}).strict();
export const EnumInvoiceStatusFilterObjectSchema: z.ZodType<Prisma.EnumInvoiceStatusFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumInvoiceStatusFilter>;
export const EnumInvoiceStatusFilterObjectZodSchema = makeSchema();
