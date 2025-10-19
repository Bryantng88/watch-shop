import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { MaintenancePartCountOrderByAggregateInputObjectSchema as MaintenancePartCountOrderByAggregateInputObjectSchema } from './MaintenancePartCountOrderByAggregateInput.schema';
import { MaintenancePartAvgOrderByAggregateInputObjectSchema as MaintenancePartAvgOrderByAggregateInputObjectSchema } from './MaintenancePartAvgOrderByAggregateInput.schema';
import { MaintenancePartMaxOrderByAggregateInputObjectSchema as MaintenancePartMaxOrderByAggregateInputObjectSchema } from './MaintenancePartMaxOrderByAggregateInput.schema';
import { MaintenancePartMinOrderByAggregateInputObjectSchema as MaintenancePartMinOrderByAggregateInputObjectSchema } from './MaintenancePartMinOrderByAggregateInput.schema';
import { MaintenancePartSumOrderByAggregateInputObjectSchema as MaintenancePartSumOrderByAggregateInputObjectSchema } from './MaintenancePartSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  recordId: SortOrderSchema.optional(),
  variantId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  name: SortOrderSchema.optional(),
  quantity: SortOrderSchema.optional(),
  unitCost: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  notes: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  _count: z.lazy(() => MaintenancePartCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => MaintenancePartAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => MaintenancePartMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => MaintenancePartMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => MaintenancePartSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const MaintenancePartOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.MaintenancePartOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenancePartOrderByWithAggregationInput>;
export const MaintenancePartOrderByWithAggregationInputObjectZodSchema = makeSchema();
