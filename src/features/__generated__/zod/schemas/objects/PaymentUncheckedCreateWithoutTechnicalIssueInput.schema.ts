import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PaymentMethodSchema } from '../enums/PaymentMethod.schema';
import { PaymentDirectionSchema } from '../enums/PaymentDirection.schema';
import { PaymentStatusSchema } from '../enums/PaymentStatus.schema';
import { PaymentPurposeSchema } from '../enums/PaymentPurpose.schema';
import { PaymentTypeSchema } from '../enums/PaymentType.schema';
import { MaintenanceRecordUncheckedCreateNestedManyWithoutPaymentInputObjectSchema as MaintenanceRecordUncheckedCreateNestedManyWithoutPaymentInputObjectSchema } from './MaintenanceRecordUncheckedCreateNestedManyWithoutPaymentInput.schema';
import { TaskUncheckedCreateNestedManyWithoutPaymentInputObjectSchema as TaskUncheckedCreateNestedManyWithoutPaymentInputObjectSchema } from './TaskUncheckedCreateNestedManyWithoutPaymentInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
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
  refNo: z.string().optional().nullable(),
  updatedAt: z.coerce.date().optional(),
  maintenanceRecord: z.lazy(() => MaintenanceRecordUncheckedCreateNestedManyWithoutPaymentInputObjectSchema).optional(),
  task: z.lazy(() => TaskUncheckedCreateNestedManyWithoutPaymentInputObjectSchema).optional()
}).strict();
export const PaymentUncheckedCreateWithoutTechnicalIssueInputObjectSchema: z.ZodType<Prisma.PaymentUncheckedCreateWithoutTechnicalIssueInput> = makeSchema() as unknown as z.ZodType<Prisma.PaymentUncheckedCreateWithoutTechnicalIssueInput>;
export const PaymentUncheckedCreateWithoutTechnicalIssueInputObjectZodSchema = makeSchema();
