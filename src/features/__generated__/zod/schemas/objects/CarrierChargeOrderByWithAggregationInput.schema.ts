import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { CarrierChargeCountOrderByAggregateInputObjectSchema as CarrierChargeCountOrderByAggregateInputObjectSchema } from './CarrierChargeCountOrderByAggregateInput.schema';
import { CarrierChargeAvgOrderByAggregateInputObjectSchema as CarrierChargeAvgOrderByAggregateInputObjectSchema } from './CarrierChargeAvgOrderByAggregateInput.schema';
import { CarrierChargeMaxOrderByAggregateInputObjectSchema as CarrierChargeMaxOrderByAggregateInputObjectSchema } from './CarrierChargeMaxOrderByAggregateInput.schema';
import { CarrierChargeMinOrderByAggregateInputObjectSchema as CarrierChargeMinOrderByAggregateInputObjectSchema } from './CarrierChargeMinOrderByAggregateInput.schema';
import { CarrierChargeSumOrderByAggregateInputObjectSchema as CarrierChargeSumOrderByAggregateInputObjectSchema } from './CarrierChargeSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  shipmentId: SortOrderSchema.optional(),
  kind: SortOrderSchema.optional(),
  currency: SortOrderSchema.optional(),
  estimatedAmount: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  chargedAmount: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  settlementStatus: SortOrderSchema.optional(),
  settlementRef: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  settledAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  metadataJson: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => CarrierChargeCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => CarrierChargeAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => CarrierChargeMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => CarrierChargeMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => CarrierChargeSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const CarrierChargeOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.CarrierChargeOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.CarrierChargeOrderByWithAggregationInput>;
export const CarrierChargeOrderByWithAggregationInputObjectZodSchema = makeSchema();
