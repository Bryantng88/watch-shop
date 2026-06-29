import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { NotificationDispatchCountOrderByAggregateInputObjectSchema as NotificationDispatchCountOrderByAggregateInputObjectSchema } from './NotificationDispatchCountOrderByAggregateInput.schema';
import { NotificationDispatchMaxOrderByAggregateInputObjectSchema as NotificationDispatchMaxOrderByAggregateInputObjectSchema } from './NotificationDispatchMaxOrderByAggregateInput.schema';
import { NotificationDispatchMinOrderByAggregateInputObjectSchema as NotificationDispatchMinOrderByAggregateInputObjectSchema } from './NotificationDispatchMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  businessEventLogId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  ruleId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  eventKey: SortOrderSchema.optional(),
  targetType: SortOrderSchema.optional(),
  targetId: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  errorMessage: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  payloadJson: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => NotificationDispatchCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => NotificationDispatchMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => NotificationDispatchMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const NotificationDispatchOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.NotificationDispatchOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.NotificationDispatchOrderByWithAggregationInput>;
export const NotificationDispatchOrderByWithAggregationInputObjectZodSchema = makeSchema();
