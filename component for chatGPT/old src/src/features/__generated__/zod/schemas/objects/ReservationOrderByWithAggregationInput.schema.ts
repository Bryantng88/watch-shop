import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { ReservationCountOrderByAggregateInputObjectSchema as ReservationCountOrderByAggregateInputObjectSchema } from './ReservationCountOrderByAggregateInput.schema';
import { ReservationAvgOrderByAggregateInputObjectSchema as ReservationAvgOrderByAggregateInputObjectSchema } from './ReservationAvgOrderByAggregateInput.schema';
import { ReservationMaxOrderByAggregateInputObjectSchema as ReservationMaxOrderByAggregateInputObjectSchema } from './ReservationMaxOrderByAggregateInput.schema';
import { ReservationMinOrderByAggregateInputObjectSchema as ReservationMinOrderByAggregateInputObjectSchema } from './ReservationMinOrderByAggregateInput.schema';
import { ReservationSumOrderByAggregateInputObjectSchema as ReservationSumOrderByAggregateInputObjectSchema } from './ReservationSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  productId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  orderId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  status: SortOrderSchema.optional(),
  depositAmt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  expiresAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => ReservationCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => ReservationAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => ReservationMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => ReservationMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => ReservationSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const ReservationOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.ReservationOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.ReservationOrderByWithAggregationInput>;
export const ReservationOrderByWithAggregationInputObjectZodSchema = makeSchema();
