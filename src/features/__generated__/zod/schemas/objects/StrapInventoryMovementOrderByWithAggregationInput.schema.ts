import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { StrapInventoryMovementCountOrderByAggregateInputObjectSchema as StrapInventoryMovementCountOrderByAggregateInputObjectSchema } from './StrapInventoryMovementCountOrderByAggregateInput.schema';
import { StrapInventoryMovementAvgOrderByAggregateInputObjectSchema as StrapInventoryMovementAvgOrderByAggregateInputObjectSchema } from './StrapInventoryMovementAvgOrderByAggregateInput.schema';
import { StrapInventoryMovementMaxOrderByAggregateInputObjectSchema as StrapInventoryMovementMaxOrderByAggregateInputObjectSchema } from './StrapInventoryMovementMaxOrderByAggregateInput.schema';
import { StrapInventoryMovementMinOrderByAggregateInputObjectSchema as StrapInventoryMovementMinOrderByAggregateInputObjectSchema } from './StrapInventoryMovementMinOrderByAggregateInput.schema';
import { StrapInventoryMovementSumOrderByAggregateInputObjectSchema as StrapInventoryMovementSumOrderByAggregateInputObjectSchema } from './StrapInventoryMovementSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  strapVariantId: SortOrderSchema.optional(),
  movementType: SortOrderSchema.optional(),
  quantity: SortOrderSchema.optional(),
  balanceAfter: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  watchId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  orderId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  serviceRequestId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  actorUserId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  sourceType: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  sourceId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  note: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  _count: z.lazy(() => StrapInventoryMovementCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => StrapInventoryMovementAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => StrapInventoryMovementMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => StrapInventoryMovementMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => StrapInventoryMovementSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const StrapInventoryMovementOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.StrapInventoryMovementOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.StrapInventoryMovementOrderByWithAggregationInput>;
export const StrapInventoryMovementOrderByWithAggregationInputObjectZodSchema = makeSchema();
