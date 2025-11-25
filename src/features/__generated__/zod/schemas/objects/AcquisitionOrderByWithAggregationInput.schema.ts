import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { AcquisitionCountOrderByAggregateInputObjectSchema as AcquisitionCountOrderByAggregateInputObjectSchema } from './AcquisitionCountOrderByAggregateInput.schema';
import { AcquisitionAvgOrderByAggregateInputObjectSchema as AcquisitionAvgOrderByAggregateInputObjectSchema } from './AcquisitionAvgOrderByAggregateInput.schema';
import { AcquisitionMaxOrderByAggregateInputObjectSchema as AcquisitionMaxOrderByAggregateInputObjectSchema } from './AcquisitionMaxOrderByAggregateInput.schema';
import { AcquisitionMinOrderByAggregateInputObjectSchema as AcquisitionMinOrderByAggregateInputObjectSchema } from './AcquisitionMinOrderByAggregateInput.schema';
import { AcquisitionSumOrderByAggregateInputObjectSchema as AcquisitionSumOrderByAggregateInputObjectSchema } from './AcquisitionSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  vendorId: SortOrderSchema.optional(),
  customerId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  type: SortOrderSchema.optional(),
  acquiredAt: SortOrderSchema.optional(),
  cost: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  currency: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  payoutStatus: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  accquisitionStt: SortOrderSchema.optional(),
  refNo: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  notes: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  condition: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  warrantyUntil: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  sentAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  returnedAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  _count: z.lazy(() => AcquisitionCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => AcquisitionAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => AcquisitionMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => AcquisitionMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => AcquisitionSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const AcquisitionOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.AcquisitionOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionOrderByWithAggregationInput>;
export const AcquisitionOrderByWithAggregationInputObjectZodSchema = makeSchema();
