import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { maintenanceLogsCountOrderByAggregateInputObjectSchema as maintenanceLogsCountOrderByAggregateInputObjectSchema } from './maintenanceLogsCountOrderByAggregateInput.schema';
import { maintenanceLogsAvgOrderByAggregateInputObjectSchema as maintenanceLogsAvgOrderByAggregateInputObjectSchema } from './maintenanceLogsAvgOrderByAggregateInput.schema';
import { maintenanceLogsMaxOrderByAggregateInputObjectSchema as maintenanceLogsMaxOrderByAggregateInputObjectSchema } from './maintenanceLogsMaxOrderByAggregateInput.schema';
import { maintenanceLogsMinOrderByAggregateInputObjectSchema as maintenanceLogsMinOrderByAggregateInputObjectSchema } from './maintenanceLogsMinOrderByAggregateInput.schema';
import { maintenanceLogsSumOrderByAggregateInputObjectSchema as maintenanceLogsSumOrderByAggregateInputObjectSchema } from './maintenanceLogsSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  serviceRequestId: SortOrderSchema.optional(),
  technicalAssessmentId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  approvalRequestId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  sourceType: SortOrderSchema.optional(),
  category: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  action: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  execution: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  vendorId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  partId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  cost: SortOrderSchema.optional(),
  note: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  status: SortOrderSchema.optional(),
  autoApproved: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => maintenanceLogsCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => maintenanceLogsAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => maintenanceLogsMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => maintenanceLogsMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => maintenanceLogsSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const maintenanceLogsOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.maintenanceLogsOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.maintenanceLogsOrderByWithAggregationInput>;
export const maintenanceLogsOrderByWithAggregationInputObjectZodSchema = makeSchema();
