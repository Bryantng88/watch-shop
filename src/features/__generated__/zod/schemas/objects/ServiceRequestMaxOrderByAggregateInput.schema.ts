import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  billable: SortOrderSchema.optional(),
  orderItemId: SortOrderSchema.optional(),
  customerId: SortOrderSchema.optional(),
  productId: SortOrderSchema.optional(),
  variantId: SortOrderSchema.optional(),
  brandSnapshot: SortOrderSchema.optional(),
  modelSnapshot: SortOrderSchema.optional(),
  refSnapshot: SortOrderSchema.optional(),
  serialSnapshot: SortOrderSchema.optional(),
  appointmentAt: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  notes: SortOrderSchema.optional(),
  warrantyUntil: SortOrderSchema.optional(),
  warrantyPolicy: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  servicecatalogid: SortOrderSchema.optional(),
  refNo: SortOrderSchema.optional(),
  scope: SortOrderSchema.optional(),
  vendorId: SortOrderSchema.optional(),
  vendorNameSnap: SortOrderSchema.optional(),
  technicianId: SortOrderSchema.optional(),
  technicianNameSnap: SortOrderSchema.optional(),
  skuSnapshot: SortOrderSchema.optional(),
  primaryImageUrlSnapshot: SortOrderSchema.optional(),
  dummy_technical_rel: SortOrderSchema.optional(),
  priority: SortOrderSchema.optional(),
  priority_reason: SortOrderSchema.optional(),
  priority_source: SortOrderSchema.optional(),
  priority_marked_at: SortOrderSchema.optional(),
  priorityReason: SortOrderSchema.optional(),
  prioritySource: SortOrderSchema.optional(),
  priorityMarkedAt: SortOrderSchema.optional()
}).strict();
export const ServiceRequestMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ServiceRequestMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestMaxOrderByAggregateInput>;
export const ServiceRequestMaxOrderByAggregateInputObjectZodSchema = makeSchema();
