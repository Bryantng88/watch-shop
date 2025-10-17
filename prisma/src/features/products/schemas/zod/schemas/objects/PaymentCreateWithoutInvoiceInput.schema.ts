import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PaymentMethodSchema } from '../enums/PaymentMethod.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  method: PaymentMethodSchema,
  amount: z.number(),
  currency: z.string(),
  paidAt: z.coerce.date().optional(),
  reference: z.string().optional().nullable(),
  note: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();
export const PaymentCreateWithoutInvoiceInputObjectSchema: z.ZodType<Prisma.PaymentCreateWithoutInvoiceInput> = makeSchema() as unknown as z.ZodType<Prisma.PaymentCreateWithoutInvoiceInput>;
export const PaymentCreateWithoutInvoiceInputObjectZodSchema = makeSchema();
