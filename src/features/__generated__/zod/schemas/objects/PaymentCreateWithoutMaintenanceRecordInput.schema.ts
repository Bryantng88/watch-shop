import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PaymentMethodSchema } from '../enums/PaymentMethod.schema';
import { paymentdirectionSchema } from '../enums/paymentdirection.schema';
import { PaymentStatusSchema } from '../enums/PaymentStatus.schema';
import { PaymentPurposeSchema } from '../enums/PaymentPurpose.schema';
import { PaymentTypeSchema } from '../enums/PaymentType.schema'

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
  order_id: z.string().optional().nullable(),
  service_request_id: z.string().optional().nullable(),
  vendor_id: z.string().optional().nullable(),
  acquisition_id: z.string().optional().nullable(),
  status: PaymentStatusSchema.optional(),
  purpose: PaymentPurposeSchema.optional(),
  shipment_id: z.string().optional().nullable(),
  type: PaymentTypeSchema.optional()
}).strict();
export const PaymentCreateWithoutMaintenanceRecordInputObjectSchema: z.ZodType<Prisma.PaymentCreateWithoutMaintenanceRecordInput> = makeSchema() as unknown as z.ZodType<Prisma.PaymentCreateWithoutMaintenanceRecordInput>;
export const PaymentCreateWithoutMaintenanceRecordInputObjectZodSchema = makeSchema();
