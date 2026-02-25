import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  billable: SortOrderSchema.optional(),
  serviceRequestId: SortOrderSchema.optional(),
  productId: SortOrderSchema.optional(),
  variantId: SortOrderSchema.optional(),
  brandSnapshot: SortOrderSchema.optional(),
  modelSnapshot: SortOrderSchema.optional(),
  refSnapshot: SortOrderSchema.optional(),
  serialSnapshot: SortOrderSchema.optional(),
  vendorId: SortOrderSchema.optional(),
  servicedByName: SortOrderSchema.optional(),
  vendorName: SortOrderSchema.optional(),
  servicedAt: SortOrderSchema.optional(),
  notes: SortOrderSchema.optional(),
  totalCost: SortOrderSchema.optional(),
  billed: SortOrderSchema.optional(),
  invoiceId: SortOrderSchema.optional(),
  revenueAmount: SortOrderSchema.optional(),
  currency: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  eventType: SortOrderSchema.optional(),
  prevVendorId: SortOrderSchema.optional(),
  prevVendorName: SortOrderSchema.optional(),
  paymentId: SortOrderSchema.optional(),
  paidAmount: SortOrderSchema.optional(),
  paidAt: SortOrderSchema.optional()
}).strict();
export const MaintenanceRecordMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordMaxOrderByAggregateInput>;
export const MaintenanceRecordMaxOrderByAggregateInputObjectZodSchema = makeSchema();
