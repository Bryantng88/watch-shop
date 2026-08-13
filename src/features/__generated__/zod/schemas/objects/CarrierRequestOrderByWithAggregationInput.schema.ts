import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { CarrierRequestCountOrderByAggregateInputObjectSchema as CarrierRequestCountOrderByAggregateInputObjectSchema } from './CarrierRequestCountOrderByAggregateInput.schema';
import { CarrierRequestAvgOrderByAggregateInputObjectSchema as CarrierRequestAvgOrderByAggregateInputObjectSchema } from './CarrierRequestAvgOrderByAggregateInput.schema';
import { CarrierRequestMaxOrderByAggregateInputObjectSchema as CarrierRequestMaxOrderByAggregateInputObjectSchema } from './CarrierRequestMaxOrderByAggregateInput.schema';
import { CarrierRequestMinOrderByAggregateInputObjectSchema as CarrierRequestMinOrderByAggregateInputObjectSchema } from './CarrierRequestMinOrderByAggregateInput.schema';
import { CarrierRequestSumOrderByAggregateInputObjectSchema as CarrierRequestSumOrderByAggregateInputObjectSchema } from './CarrierRequestSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  shipmentId: SortOrderSchema.optional(),
  carrierCode: SortOrderSchema.optional(),
  environment: SortOrderSchema.optional(),
  operation: SortOrderSchema.optional(),
  idempotencyKey: SortOrderSchema.optional(),
  requestJson: SortOrderSchema.optional(),
  responseJson: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  status: SortOrderSchema.optional(),
  httpStatus: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  externalOrderCode: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  errorCode: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  errorMessage: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  attemptCount: SortOrderSchema.optional(),
  requestedAt: SortOrderSchema.optional(),
  completedAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  _count: z.lazy(() => CarrierRequestCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => CarrierRequestAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => CarrierRequestMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => CarrierRequestMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => CarrierRequestSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const CarrierRequestOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.CarrierRequestOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.CarrierRequestOrderByWithAggregationInput>;
export const CarrierRequestOrderByWithAggregationInputObjectZodSchema = makeSchema();
