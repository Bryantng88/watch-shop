import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { BusinessFeedbackCountOrderByAggregateInputObjectSchema as BusinessFeedbackCountOrderByAggregateInputObjectSchema } from './BusinessFeedbackCountOrderByAggregateInput.schema';
import { BusinessFeedbackMaxOrderByAggregateInputObjectSchema as BusinessFeedbackMaxOrderByAggregateInputObjectSchema } from './BusinessFeedbackMaxOrderByAggregateInput.schema';
import { BusinessFeedbackMinOrderByAggregateInputObjectSchema as BusinessFeedbackMinOrderByAggregateInputObjectSchema } from './BusinessFeedbackMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  targetType: SortOrderSchema.optional(),
  targetId: SortOrderSchema.optional(),
  eventKey: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  actorUserId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  message: SortOrderSchema.optional(),
  visibility: SortOrderSchema.optional(),
  metadataJson: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => BusinessFeedbackCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => BusinessFeedbackMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => BusinessFeedbackMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const BusinessFeedbackOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.BusinessFeedbackOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.BusinessFeedbackOrderByWithAggregationInput>;
export const BusinessFeedbackOrderByWithAggregationInputObjectZodSchema = makeSchema();
