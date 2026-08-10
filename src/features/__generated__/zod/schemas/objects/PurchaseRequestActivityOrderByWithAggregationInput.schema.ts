import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { PurchaseRequestActivityCountOrderByAggregateInputObjectSchema as PurchaseRequestActivityCountOrderByAggregateInputObjectSchema } from './PurchaseRequestActivityCountOrderByAggregateInput.schema';
import { PurchaseRequestActivityMaxOrderByAggregateInputObjectSchema as PurchaseRequestActivityMaxOrderByAggregateInputObjectSchema } from './PurchaseRequestActivityMaxOrderByAggregateInput.schema';
import { PurchaseRequestActivityMinOrderByAggregateInputObjectSchema as PurchaseRequestActivityMinOrderByAggregateInputObjectSchema } from './PurchaseRequestActivityMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  purchaseRequestId: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  note: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  actorUserId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  followUpAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  _count: z.lazy(() => PurchaseRequestActivityCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => PurchaseRequestActivityMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => PurchaseRequestActivityMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const PurchaseRequestActivityOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.PurchaseRequestActivityOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestActivityOrderByWithAggregationInput>;
export const PurchaseRequestActivityOrderByWithAggregationInputObjectZodSchema = makeSchema();
