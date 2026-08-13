import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { CarrierStatusHistoryCountOrderByAggregateInputObjectSchema as CarrierStatusHistoryCountOrderByAggregateInputObjectSchema } from './CarrierStatusHistoryCountOrderByAggregateInput.schema';
import { CarrierStatusHistoryMaxOrderByAggregateInputObjectSchema as CarrierStatusHistoryMaxOrderByAggregateInputObjectSchema } from './CarrierStatusHistoryMaxOrderByAggregateInput.schema';
import { CarrierStatusHistoryMinOrderByAggregateInputObjectSchema as CarrierStatusHistoryMinOrderByAggregateInputObjectSchema } from './CarrierStatusHistoryMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  shipmentId: SortOrderSchema.optional(),
  carrierCode: SortOrderSchema.optional(),
  externalStatus: SortOrderSchema.optional(),
  normalizedStatus: SortOrderSchema.optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  location: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  occurredAt: SortOrderSchema.optional(),
  payloadJson: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  _count: z.lazy(() => CarrierStatusHistoryCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => CarrierStatusHistoryMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => CarrierStatusHistoryMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const CarrierStatusHistoryOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.CarrierStatusHistoryOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.CarrierStatusHistoryOrderByWithAggregationInput>;
export const CarrierStatusHistoryOrderByWithAggregationInputObjectZodSchema = makeSchema();
