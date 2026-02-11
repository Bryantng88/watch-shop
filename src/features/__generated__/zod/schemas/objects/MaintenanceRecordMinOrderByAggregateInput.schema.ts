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
  updatedAt: SortOrderSchema.optional()
}).strict();
export const MaintenanceRecordMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordMinOrderByAggregateInput>;
export const MaintenanceRecordMinOrderByAggregateInputObjectZodSchema = makeSchema();
