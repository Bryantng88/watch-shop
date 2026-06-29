import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { BusinessEventLogCountOrderByAggregateInputObjectSchema as BusinessEventLogCountOrderByAggregateInputObjectSchema } from './BusinessEventLogCountOrderByAggregateInput.schema';
import { BusinessEventLogMaxOrderByAggregateInputObjectSchema as BusinessEventLogMaxOrderByAggregateInputObjectSchema } from './BusinessEventLogMaxOrderByAggregateInput.schema';
import { BusinessEventLogMinOrderByAggregateInputObjectSchema as BusinessEventLogMinOrderByAggregateInputObjectSchema } from './BusinessEventLogMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  eventKey: SortOrderSchema.optional(),
  targetType: SortOrderSchema.optional(),
  targetId: SortOrderSchema.optional(),
  actorUserId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  metadataJson: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  _count: z.lazy(() => BusinessEventLogCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => BusinessEventLogMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => BusinessEventLogMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const BusinessEventLogOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.BusinessEventLogOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.BusinessEventLogOrderByWithAggregationInput>;
export const BusinessEventLogOrderByWithAggregationInputObjectZodSchema = makeSchema();
