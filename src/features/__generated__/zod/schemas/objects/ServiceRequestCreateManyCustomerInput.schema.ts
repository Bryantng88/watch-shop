import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceTypeSchema } from '../enums/ServiceType.schema';
import { ServiceRequestStatusSchema } from '../enums/ServiceRequestStatus.schema';
import { ServiceScopeSchema } from '../enums/ServiceScope.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  type: ServiceTypeSchema.optional(),
  billable: z.boolean().optional(),
  orderItemId: z.string().optional().nullable(),
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
  servicecatalogid: z.string().optional().nullable(),
  refNo: z.string().optional().nullable(),
  scope: ServiceScopeSchema.optional().nullable(),
  vendorId: z.string().optional().nullable(),
  vendorNameSnap: z.string().optional().nullable(),
  technicianId: z.string().optional().nullable(),
  technicianNameSnap: z.string().optional().nullable(),
  skuSnapshot: z.string().optional().nullable(),
  primaryImageUrlSnapshot: z.string().optional().nullable(),
  dummy_technical_rel: z.string().optional().nullable(),
  priority: z.string().optional().nullable(),
  priority_reason: z.string().optional().nullable(),
  priority_source: z.string().optional().nullable(),
  priority_marked_at: z.coerce.date().optional().nullable(),
  priorityReason: z.string().optional().nullable(),
  prioritySource: z.string().optional().nullable(),
  priorityMarkedAt: z.coerce.date().optional().nullable()
}).strict();
export const ServiceRequestCreateManyCustomerInputObjectSchema: z.ZodType<Prisma.ServiceRequestCreateManyCustomerInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestCreateManyCustomerInput>;
export const ServiceRequestCreateManyCustomerInputObjectZodSchema = makeSchema();
