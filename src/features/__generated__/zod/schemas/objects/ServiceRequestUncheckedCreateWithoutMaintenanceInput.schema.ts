import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceTypeSchema } from '../enums/ServiceType.schema';
import { ServiceRequestStatusSchema } from '../enums/ServiceRequestStatus.schema';
import { InvoiceUncheckedCreateNestedManyWithoutServiceReqInputObjectSchema as InvoiceUncheckedCreateNestedManyWithoutServiceReqInputObjectSchema } from './InvoiceUncheckedCreateNestedManyWithoutServiceReqInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  type: ServiceTypeSchema.optional(),
  billable: z.boolean().optional(),
  orderItemId: z.string().optional().nullable(),
  customerId: z.string().optional().nullable(),
  productId: z.string().optional().nullable(),
  variantId: z.string().optional().nullable(),
  brandSnapshot: z.string().optional().nullable(),
  modelSnapshot: z.string().optional().nullable(),
  refSnapshot: z.string().optional().nullable(),
  serialSnapshot: z.string().optional().nullable(),
  appointmentAt: z.coerce.date().optional().nullable(),
  status: ServiceRequestStatusSchema.optional(),
  notes: z.string().optional().nullable(),
  warrantyUntil: z.coerce.date().optional().nullable(),
  warrantyPolicy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Invoice: z.lazy(() => InvoiceUncheckedCreateNestedManyWithoutServiceReqInputObjectSchema).optional()
}).strict();
export const ServiceRequestUncheckedCreateWithoutMaintenanceInputObjectSchema: z.ZodType<Prisma.ServiceRequestUncheckedCreateWithoutMaintenanceInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestUncheckedCreateWithoutMaintenanceInput>;
export const ServiceRequestUncheckedCreateWithoutMaintenanceInputObjectZodSchema = makeSchema();
