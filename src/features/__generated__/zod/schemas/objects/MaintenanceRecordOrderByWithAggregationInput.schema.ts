import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { MaintenanceRecordCountOrderByAggregateInputObjectSchema as MaintenanceRecordCountOrderByAggregateInputObjectSchema } from './MaintenanceRecordCountOrderByAggregateInput.schema';
import { MaintenanceRecordAvgOrderByAggregateInputObjectSchema as MaintenanceRecordAvgOrderByAggregateInputObjectSchema } from './MaintenanceRecordAvgOrderByAggregateInput.schema';
import { MaintenanceRecordMaxOrderByAggregateInputObjectSchema as MaintenanceRecordMaxOrderByAggregateInputObjectSchema } from './MaintenanceRecordMaxOrderByAggregateInput.schema';
import { MaintenanceRecordMinOrderByAggregateInputObjectSchema as MaintenanceRecordMinOrderByAggregateInputObjectSchema } from './MaintenanceRecordMinOrderByAggregateInput.schema';
import { MaintenanceRecordSumOrderByAggregateInputObjectSchema as MaintenanceRecordSumOrderByAggregateInputObjectSchema } from './MaintenanceRecordSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  billable: SortOrderSchema.optional(),
  serviceRequestId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  productId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  variantId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  brandSnapshot: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  modelSnapshot: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  refSnapshot: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  serialSnapshot: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  vendorId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  servicedByName: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  vendorName: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  servicedAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  notes: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  totalCost: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  billed: SortOrderSchema.optional(),
  invoiceId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  revenueAmount: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  currency: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  eventType: SortOrderSchema.optional(),
  prevVendorId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  prevVendorName: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  paymentId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  paidAmount: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  paidAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  _count: z.lazy(() => MaintenanceRecordCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => MaintenanceRecordAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => MaintenanceRecordMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => MaintenanceRecordMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => MaintenanceRecordSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const MaintenanceRecordOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordOrderByWithAggregationInput>;
export const MaintenanceRecordOrderByWithAggregationInputObjectZodSchema = makeSchema();
