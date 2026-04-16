import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceStatusSchema } from '../enums/InvoiceStatus.schema'

const nestedenuminvoicestatusfilterSchema = z.object({
  equals: InvoiceStatusSchema.optional(),
  in: InvoiceStatusSchema.array().optional(),
  notIn: InvoiceStatusSchema.array().optional(),
  not: z.union([InvoiceStatusSchema, z.lazy(() => NestedEnumInvoiceStatusFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumInvoiceStatusFilterObjectSchema: z.ZodType<Prisma.NestedEnumInvoiceStatusFilter> = nestedenuminvoicestatusfilterSchema as unknown as z.ZodType<Prisma.NestedEnumInvoiceStatusFilter>;
export const NestedEnumInvoiceStatusFilterObjectZodSchema = nestedenuminvoicestatusfilterSchema;
