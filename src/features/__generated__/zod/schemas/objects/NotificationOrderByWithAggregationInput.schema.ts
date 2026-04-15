import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { NotificationCountOrderByAggregateInputObjectSchema as NotificationCountOrderByAggregateInputObjectSchema } from './NotificationCountOrderByAggregateInput.schema';
import { NotificationMaxOrderByAggregateInputObjectSchema as NotificationMaxOrderByAggregateInputObjectSchema } from './NotificationMaxOrderByAggregateInput.schema';
import { NotificationMinOrderByAggregateInputObjectSchema as NotificationMinOrderByAggregateInputObjectSchema } from './NotificationMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  message: SortOrderSchema.optional(),
  priority: SortOrderSchema.optional(),
  isRead: SortOrderSchema.optional(),
  userId: SortOrderSchema.optional(),
  metadata: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  _count: z.lazy(() => NotificationCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => NotificationMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => NotificationMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const NotificationOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.NotificationOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.NotificationOrderByWithAggregationInput>;
export const NotificationOrderByWithAggregationInputObjectZodSchema = makeSchema();
