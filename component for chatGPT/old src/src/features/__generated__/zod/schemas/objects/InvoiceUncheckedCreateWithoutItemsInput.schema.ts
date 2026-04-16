import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceTypeSchema } from '../enums/InvoiceType.schema';
import { InvoiceStatusSchema } from '../enums/InvoiceStatus.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  code: z.string().optional().nullable(),
  type: InvoiceTypeSchema,
  status: InvoiceStatusSchema.optional(),
  customerId: z.string().optional().nullable(),
  vendorId: z.string().optional().nullable(),
  orderId: z.string().optional().nullable(),
  acquisitionId: z.string().optional().nullable(),
  serviceRequestId: z.string().optional().nullable(),
  currency: z.string(),
  subTotal: z.number(),
  taxTotal: z.number().optional(),
  discountTotal: z.number().optional(),
  grandTotal: z.number(),
  issuedAt: z.coerce.date().optional().nullable(),
  dueAt: z.coerce.date().optional().nullable(),
  notes: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const InvoiceUncheckedCreateWithoutItemsInputObjectSchema: z.ZodType<Prisma.InvoiceUncheckedCreateWithoutItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceUncheckedCreateWithoutItemsInput>;
export const InvoiceUncheckedCreateWithoutItemsInputObjectZodSchema = makeSchema();
