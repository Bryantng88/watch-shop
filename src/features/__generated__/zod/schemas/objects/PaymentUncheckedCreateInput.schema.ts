import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PaymentMethodSchema } from '../enums/PaymentMethod.schema';
import { paymentdirectionSchema } from '../enums/paymentdirection.schema';
import { paymentstatusSchema } from '../enums/paymentstatus.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  method: PaymentMethodSchema,
  amount: z.number(),
  currency: z.string(),
  paidAt: z.coerce.date().optional(),
  reference: z.string().optional().nullable(),
  note: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  direction: paymentdirectionSchema.optional().nullable(),
  status: paymentstatusSchema.optional().nullable(),
  order_id: z.string().optional().nullable(),
  service_request_id: z.string().optional().nullable(),
  vendor_id: z.string().optional().nullable(),
  acquisition_id: z.string().optional().nullable()
}).strict();
export const PaymentUncheckedCreateInputObjectSchema: z.ZodType<Prisma.PaymentUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.PaymentUncheckedCreateInput>;
export const PaymentUncheckedCreateInputObjectZodSchema = makeSchema();
