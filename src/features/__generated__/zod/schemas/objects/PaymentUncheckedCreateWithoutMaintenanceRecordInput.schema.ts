import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PaymentMethodSchema } from '../enums/PaymentMethod.schema';
import { PaymentDirectionSchema } from '../enums/PaymentDirection.schema';
import { PaymentStatusSchema } from '../enums/PaymentStatus.schema';
import { PaymentPurposeSchema } from '../enums/PaymentPurpose.schema';
import { PaymentTypeSchema } from '../enums/PaymentType.schema'

const makeSchema = () => z.object({
  id: z.string(),
  method: PaymentMethodSchema,
  amount: z.number(),
  currency: z.string(),
  paidAt: z.coerce.date().optional().nullable(),
  reference: z.string().optional().nullable(),
  note: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  direction: PaymentDirectionSchema.optional().nullable(),
  order_id: z.string().optional().nullable(),
  service_request_id: z.string().optional().nullable(),
  vendor_id: z.string().optional().nullable(),
  acquisition_id: z.string().optional().nullable(),
  status: PaymentStatusSchema.optional(),
  purpose: PaymentPurposeSchema.optional(),
  shipment_id: z.string().optional().nullable(),
  type: PaymentTypeSchema.optional(),
  refNo: z.string().optional().nullable()
}).strict();
export const PaymentUncheckedCreateWithoutMaintenanceRecordInputObjectSchema: z.ZodType<Prisma.PaymentUncheckedCreateWithoutMaintenanceRecordInput> = makeSchema() as unknown as z.ZodType<Prisma.PaymentUncheckedCreateWithoutMaintenanceRecordInput>;
export const PaymentUncheckedCreateWithoutMaintenanceRecordInputObjectZodSchema = makeSchema();
